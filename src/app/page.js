"use client"
import styles from './page.module.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import 'simplebar-react/dist/simplebar.min.css';
import { useState, useEffect } from 'react'
import ChatMessageItem from '@/components/ChatMessageItem'
import { alpha, styled } from '@mui/material/styles';
import SimpleBarReact from 'simplebar-react';
import { Container, Card, Box, Divider, Input, IconButton } from '@mui/material'
import { Icon } from '@iconify/react'
import { useRef } from 'react'



const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: alpha('#637381', 0.48),
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

export default function Home() {

  const scrollRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    {
      message: "👋 Hello! Welcome to CareAssist, your healthcare companion. I'm here to assist you with your medical assessment." + 
      "To ensure the best care, could you please share some information about your medical history and your current condition? Don't worry, your responses are confidential and will be used to better understand your needs." +
      "Let's start with the basics. Could you tell me about any existing medical conditions, allergies, or medications you are currently taking? Feel free to share as much detail as you're comfortable with." +
      "If you have any specific concerns or symptoms you'd like to discuss, please let me know. Your well-being is our top priority!",
      sender: "ChatGPT"
    }
  ])

  /*useEffect(() => {
    // Fetch persisted data from the API route on the client side
    const fetchData = async () => {
      const response = await fetch('/api/', {
        method: 'GET',
      });

      const data = await response.json();
      const messages = ([
        {
          message: JSON.stringify(data.data[0]),
          sender: "user",
          id:1
        }
      ]);
      ProcessUserMessageToChatGPT(messages);
    };

    fetchData();
  }, []);*/ 
  
  const [message, setmessage] = useState('')

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [chatMessages.length]);

  async function ProcessUserMessageToChatGPT(messages){
    const apiMessages = messages.map((message) => {
      let role =""
      if(message.sender === "ChatGPT")
        role = "assistant"
      else  
        role = "user"
      return {role: role, content: message.message};
    });

    const systemMessage = {
      role: "system",
      content: "You are a virtual health companion for the patients. First You should ask structured questions for efficient patient assessments than you should be capable of assisting patients with their medical assessment, understanding and generating  personalized health recommendations and lifestyle advice by analyzing the provided data" +  
      "Additionally, you should support healthcare professionals by answering queries about diagnoses, treatment options, and drug interactions in a clear and informative manner." +
      "You should provide accurate and up-to-date information sourced from reliable medical databases and adhere to ethical standards in healthcare communicationand maintaining a user-friendly and empathetic tone throughout interactions." 
    }
    
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...apiMessages
      ],
      stream: true
    }

    const response = await fetch('/api/gpt', {
        method: "POST",
        body: JSON.stringify(apiRequestBody)
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder(); 

    let newMessage = "";
    while(true){
      const {value, done} = await reader.read();
      if(done){
        break;
      }

      let chars = decoder.decode(value, {stream: true});
      let lines = chars.split('data:');
      for (let i=0; i < lines.length; i++) {
        chars = lines[i].replace(/\s*/, '').replace(/\s*$/, '');
        if (!chars) {
            continue;
        }
        if (chars === '[DONE]') { //OpenAI sends [DONE] to say it's over
          break;
        }
        let obj = JSON.parse(chars); 
        if (obj && obj.choices[0].delta) {
          let deltaS = (obj.choices[0]?.delta?.content || "");
          newMessage += deltaS;
          setChatMessages([
            ...messages,
            {
              message: newMessage,
              sender: "ChatGPT"
            }
          ])                      
        }    
      }   
    }
  };

  const handleInputMessage = async() => {
    const newUserMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const updateChatMessage = [...chatMessages, newUserMessage]
    setChatMessages(updateChatMessage)
    ProcessUserMessageToChatGPT(updateChatMessage);
    setmessage('');
  }


  return (
    <Container>
      <Card sx={{ height: '100vh', display: 'flex' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>      
          <div style={{   flexGrow: 1, height: '100%', overflow: 'hidden' }}>
              <SimpleBarStyle scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }} timeout={500} clickOnTrack={false}>
                { 
                  chatMessages.map((message) => (
                    <ChatMessageItem key={message.id} message={message}/>
                  ))
                }
              </SimpleBarStyle>
          </div>
          
          <Divider/>
          
          <div style={{  minHeight: 56, display: 'flex', position: 'relative', alignItems: 'center', paddingLeft:'5px'}}>
              <Input placeholder='Type Message Here' 
                fullWidth 
                disableUnderline 
                value={message} 
                onChange={(event) => setmessage(event.target.value)}
                />

              <Divider orientation="vertical" flexItem />

              <IconButton disabled={!message} onClick={handleInputMessage} sx={{ mx: 1, color: "#7A3678" }}>
                <Icon icon='ic:round-send' sx={{width:22, height:22}} />
              </IconButton>
          </div>
        </Box>
      </Card>
    </Container>  
  )
}

