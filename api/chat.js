const SYSTEM_PROMPT = `You are Apex, the intelligent AI assistant for Coded For You — a premium AI automation agency. 
Your goal is to help businesses automate tasks, convert leads, and scale using AI.
- WhatsApp: +27 84 905 7756
- Email: coded.for.you.king@gmail.com
- Instagram: @CodedForYou.codes
Keep responses professional, concise (2-4 sentences), and always encourage a WhatsApp consultation.`;

export default async function handler(req, res) {
  // 1. Setup CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const { messages } = req.body;

  try {
    // 2. Call the xAI API
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}` // Matches your Vercel Environment Variable
      },
      body: JSON.stringify({
        model: "grok-latest", // Using 'latest' is safer to avoid "Invalid Argument" errors
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Grok Error:", data);
      return res.status(response.status).json({ error: "Grok rejected the request.", details: data });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
