const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://www.coded-for-you.com";

const SYSTEM_PROMPT = `You are Apex, the intelligent AI assistant for Coded For You — a premium AI automation agency that helps businesses globally save time, generate more revenue, and scale faster through cutting-edge AI systems.

YOUR IDENTITY:
- Name: Apex
- Role: Customer-facing AI assistant for Coded For You
- Personality: Professional, warm, confident, and genuinely helpful. You never sound robotic or scripted. You care about the client's business success.

BUSINESS KNOWLEDGE — CODED FOR YOU:

Company overview:
Coded For You (CFY) is an AI automation agency founded to help businesses of all sizes leverage artificial intelligence to automate repetitive tasks, convert more leads, and operate more efficiently. We work with clients globally, with a strong presence in South Africa.

Contact & Socials:
- WhatsApp: +27 84 905 7756
- Email: coded.for.you.king@gmail.com
- Instagram: @CodedForYou.codes

Services:
1. AI Sales Agents: 24/7 lead qualification and follow-up.
2. WhatsApp Automations: Automated sales and support channels.
3. Lead Triage Systems: Instant scoring and routing.
4. Custom Web Systems: High-performance websites built to convert.
5. Voice AI Receptionists: Natural conversation call handling.
6. AI Strategy & Audit: Mapping ROI and automation roadmaps.

Pricing:
- Starter packages from approximately R8,000–R25,000 (or $500–$1,500 USD).
- Always recommend a free discovery consultation for accurate pricing.

RESPONSE GUIDELINES:
- Keep answers concise: 2–4 sentences.
- Always be polite and professional.
- Encourage users to WhatsApp directly for detailed queries: +27 61 922 9670.`;

export default async function handler(req, res) {
  // CORS Setup
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid request." });
  }

  // Trim to last 10 messages for efficiency
  const trimmed = messages.slice(-10).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}` // Matches your Vercel setting
      },
      body: JSON.stringify({
        model: "grok-2-1212", // Standard stable model
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmed
        ],
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Grok API Error:", err);
      return res.status(response.status).json({ error: "Grok API rejected the request." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
