// src/pages/keila/Chat.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Calendar, Send } from 'lucide-react'
import { sendChat } from '../../api/keila'

function Itinerary({ data }) {
  return (
    <div className="bg-[#1d2029] p-4 rounded-xl space-y-3 max-w-[80%]">
      {data.days.map((day) => (
        <div key={day.day}>
          <h4 className="text-white font-semibold mb-2">
            Day {day.day}: {day.title}
          </h4>
          <div className="space-y-1">
            {day.activities.map((a, i) => (
              <div key={i} className="text-gray-400 text-sm">
                • {a}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function KeilaChat() {
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const user = { id: Date.now(), type: 'text', text: input, isUser: true }
    setMsgs((m) => [...m, user])
    const currentInput = input
    setInput('')
    setLoading(true)

    try {
      const { text, itinerary } = await sendChat(currentInput)
      if (itinerary) {
        setMsgs((m) => [
          ...m,
          { id: Date.now() + 1, type: 'itinerary', data: itinerary },
        ])
      } else {
        setMsgs((m) => [...m, { id: Date.now() + 1, type: 'text', text, isUser: false }])
      }
    } catch (error) {
      setMsgs((m) => [
        ...m,
        { id: Date.now() + 2, type: 'text', text: 'Error – please try again.', isUser: false },
      ])
    } finally {
      setLoading(false)
    }
  }

  const requestItinerary = () => {
    setInput('Please send me a full day-by-day itinerary.')
    setTimeout(handleSend, 100)
  }

  return (
    <div className="flex flex-col h-screen bg-[#101419]">
      {/* message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m) =>
          m.type === 'itinerary' ? (
            <Itinerary key={m.id} data={m.data} />
          ) : (
            <div
              key={m.id}
              className={`max-w-[80%] p-3 rounded-xl ${
                m.isUser 
                  ? 'bg-[#1d2029] self-end ml-auto' 
                  : 'bg-[#1d2029] self-start mr-auto'
              }`}
            >
              <p className="text-white">{m.text}</p>
            </div>
          )
        )}
        {loading && (
          <div className="bg-[#1d2029] self-start mr-auto max-w-[80%] p-3 rounded-xl">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* input bar */}
      <div className="flex items-center p-3 bg-[#101419] border-t border-gray-800">
        <button onClick={requestItinerary} className="p-2 text-gray-400 hover:text-white">
          <Calendar size={20} />
        </button>
        <input
          className="flex-1 mx-2 px-4 py-2 bg-[#1d2029] rounded-full text-white placeholder-gray-400 outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="p-3 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] disabled:opacity-50"
        >
          <Send className="text-white" size={20} />
        </button>
      </div>
    </div>
  )
}