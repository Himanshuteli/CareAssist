import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: 8,
  backgroundColor: '#F4F6F8',
}));

const MessageStyle = styled('p')(({ theme }) => ({
  fontFamily: 'Public Sans, sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  lineHeight: 22 / 14,
  fontSize: `${14 / 16}rem`
}));

// ----------------------------------------------------------------------

export default function ChatMessageItem({ message }) {
  const isMe = message.sender === 'user';

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >

        <Box sx={{ ml: 2 }}>
          <ContentStyle
            sx={{
              ...(isMe && {
                color: '#ffffff',
                bgcolor: '#E8594C',
              }),
            }}
          >
             <MessageStyle>{message.message}</MessageStyle>
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
