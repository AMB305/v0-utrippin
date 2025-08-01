// src/pages/keila/Chat.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UtrippinLogo from '../../components/UtrippinLogo'
import { sendMessageToAI } from '../../utils/sendMessageToAI'
import {
  ChevronDown,
  VolumeX,
  MoreHorizontal,
  Camera,
  Globe,
  Compass,
  Mic,
  Send,
  ArrowRightCircle,
} from 'lucide-react'

export default function Chat() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const prefill = searchParams.get('prefill')
    if (prefill && messages.length === 0) {
      handleSendMessage(prefill)
    }
  }, [searchParams])

  const handleSendMessage = async (message = input) => {
    if (!message.trim() || loading) return
    
    setLoading(true)
    setMessages(prev => [...prev, { text: message, isUser: true }])
    setInput('')
    
    try {
      const response = await sendMessageToAI(message)
      setMessages(prev => [...prev, { text: response, isUser: false }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { 
        text: "I'm having trouble responding right now. Please try again.", 
        isUser: false 
      }])
    } finally {
      setLoading(false)
    }
  }

  const quickReplies = [
    'Can I add a day trip to Chichen Itza?',
    'Could I extend the trip by two days?',
    'What are some must-see attractions in Cancun?',
    'Plan me a budget trip to Europe',
    'Solo travel tips for Asia',
    'Best time to visit Japan?'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UtrippinLogo />
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex items-center space-x-4">
          <VolumeX className="w-6 h-6 text-gray-600" />
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      {/* CHAT MESSAGES */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <h2 className="text-xl font-semibold mb-2">Hi! I'm Keila</h2>
            <p>Ask me anything about travel planning, destinations, or itineraries!</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-xl ${
                msg.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black px-4 py-2 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Keila is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Replies */}
        {messages.length > 0 && !loading && (
          <div className="space-y-2">
            <h4 className="text-black font-semibold">You may also ask</h4>
            {quickReplies.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left px-4 py-2 bg-gray-100 rounded-full flex justify-between items-center hover:bg-gray-200"
              >
                <span className="text-gray-800">{q}</span>
                <ArrowRightCircle size={18} className="text-blue-600" />
              </button>
            ))}
          </div>
        )}
      </main>

      {/* BOTTOM ACTIONS + INPUT */}
      <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Camera className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-black">Recognize Image</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Globe className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-black">Live Translate</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Compass className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-black">Live Guide</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask anything you want..."
            className="w-full h-12 rounded-full bg-gray-100 px-4 pr-16 text-black placeholder-gray-500 focus:outline-none"
            disabled={loading}
          />
          <button 
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-blue-600 disabled:text-gray-400"
          >
            <Mic size={18} />
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}