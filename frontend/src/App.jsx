import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { marked } from "marked"; // Markdown converter

const App = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "👋 Welcome! Ask me anything about Pakistani meals, diets, or nutrition.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/groq/chat", { message: input });
      const botReply = res.data.reply || "❌ I couldn't respond right now.";
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error talking to the bot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#FFF6F0] text-[#333]">
      {/* Header */}
      <div className="bg-[#FFA726] p-4 shadow-md">
        <h1 className="text-xl font-bold">Custom Crave Assistant</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-xl whitespace-pre-wrap chat-bubble ${
                msg.role === "user"
                  ? "bg-[#FFB74D] text-white rounded-br-none"
                  : "bg-[#FFE0B2] text-[#333] rounded-bl-none"
              }`}
              dangerouslySetInnerHTML={{
                __html:
                  msg.role === "bot" && typeof msg.content === "string"
                    ? marked.parse(msg.content)
                    : msg.content,
              }}
            />
          </div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-500">Bot is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#FFCC80] bg-[#FFEBCD] flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-white text-[#333] border border-[#FFB74D] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
          placeholder="Ask about meal plans, diets, ingredients..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-[#FF9800] text-white px-4 py-2 rounded-md hover:bg-[#FB8C00]"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
