const SYSTEM_PROMPT = `You are Apex, the intelligent AI assistant for Coded For You — a premium AI automation agency. 
Your goal is to help businesses automate tasks, convert leads, and scale using AI.
- WhatsApp: +27 85 905 7756
- Email: coded.for.you.king@gmail.com
- Instagram: @CodedForYou.codes
Keep responses professional, concise (2-4 sentences), and always encourage a WhatsApp consultation.`;

export default async function handler(req, res) {
  // 1. Setup CORS so your website can talk to this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const { messages } = req.body;

  try {
    // 2. Call the xAI (Grok) API
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}` // MATCHES YOUR VERCEL SETTING
      },
      body: JSON.stringify({
        model: "grok-4.20-reasoning", // Latest April 2026 flagship model
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
        stream: false
      })
    });

    // 3. Handle Errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Grok Error:", errorData);
      return res.status(response.status).json({ error: "Grok rejected the request.", details: errorData });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
