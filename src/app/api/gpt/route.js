export async function POST(req, res) {
    const data = await req.json();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer "  + process.env.OPEN_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response;
}