// src/pages/Home.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import KeilaBot from "@/components/KeilaBot";
import { sendMessageToAI } from "@/utils/sendMessageToAI";

const quickQuestions = [
  "Where should I go next?",
  "Plan a trip for me",
  "Solo travel ideas",
  "Budget-friendly destinations",
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleQuestionClick = async (question) => {
    setMessages((prev) => [...prev, { text: question, isUser: true }]);
    const response = await sendMessageToAI(question);
    setMessages((prev) => [...prev, { text: response, isUser: false }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    const response = await sendMessageToAI(input);
    setMessages((prev) => [...prev, { text: response, isUser: false }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen justify-between px-4 pb-24 pt-6 bg-white">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Hi there!</h1>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {quickQuestions.map((q) => (
          <motion.button
            key={q}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuestionClick(q)}
            className="bg-blue-100 hover:bg-blue-200 rounded-xl p-4 text-sm font-medium shadow"
          >
            {q}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-grow mt-6">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-xs ${msg.isUser ? 'bg-purple-100 self-end' : 'bg-gray-100 self-start'}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <KeilaBot />
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Ask anything..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm">Send</button>
        </div>
      </div>
    </div>
  );
}