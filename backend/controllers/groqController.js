const axios = require("axios");

// 🔒 Original trained system prompt
const systemPrompt = {
  role: "system",
  content: `You are an AI assistant specializing in Pakistani cuisine, meal planning, ingredient insights, and nutrition. 
You provide detailed and friendly guidance on healthy recipes, ingredient benefits, diet plans, and weight goals. 
You help users understand food in the context of their well-being. 
You do not answer questions unrelated to food, health, diet, or nutrition. Politely guide users back to food-related topics if they go off-topic. 
Avoid asking follow-up questions. Just respond clearly and wait for the next query.`,
};

// 🧠 In-memory conversation context (clears on server restart or refresh)
let conversationHistory = [];

const askGroqBot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Incoming message:", message);

    // Step 1: Add user's new message to the chat history
    conversationHistory.push({ role: "user", content: message });

    // Step 2: Send full history to Groq with system prompt
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [systemPrompt, ...conversationHistory],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply =
      response.data.choices[0]?.message?.content || "🤖 No response.";

    // Step 3: Add Groq's reply to chat history
    conversationHistory.push({ role: "assistant", content: aiReply });

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.json({ reply: "⚠️ Sorry, there was an error getting a reply." });
  }
};

module.exports = { askGroqBot };
