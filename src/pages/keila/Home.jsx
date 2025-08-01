// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, ChevronDown, Search, Menu, Home, Mic, User, ArrowRight } from 'lucide-react'

const prompts = [
  '7-day family trip to Costa Rica',
  'Rome flights under $800',
  'Top attractions in Lisbon',
  'Boutique Bali hotels',
]

export default function KeilaHome() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-[#101419] p-6 flex flex-col">
      {/* top nav icons */}
      <div className="flex items-center space-x-4 mb-8">
        <Zap className="text-white" size={24} />
        <ChevronDown className="text-white" size={24} />
        <div className="flex-1" />
        <Search className="text-white" size={24} />
        <Menu className="text-white" size={24} />
      </div>

      {/* heading */}
      <h1 className="text-white text-3xl font-bold mb-6">Where to next?</h1>

      {/* search bar */}
      <div className="flex items-center bg-[#1d2029] rounded-full px-4 py-2 mb-6">
        <input
          type="text"
          placeholder="e.g., 5-day romantic getaway to Paris"
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 py-2"
        />
        <button
          onClick={() => nav('/keila/chat')}
          className="p-3 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc]"
        >
          <ArrowRight className="text-white" size={20} />
        </button>
      </div>

      {/* prompt chips */}
      <div className="flex space-x-3 overflow-x-auto mb-6 pb-2">
        {prompts.map((p) => (
          <button
            key={p}
            className="flex-shrink-0 bg-[#1d2029] px-4 py-2 rounded-full text-white text-sm whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* bottom nav */}
      <div className="flex justify-around py-4 border-t border-gray-800">
        <button>
          <Home className="text-[#2575fc]" size={28} />
        </button>
        <button onClick={() => nav('/keila/voice')}>
          <Mic className="text-white" size={28} />
        </button>
        <button>
          <User className="text-white" size={28} />
        </button>
      </div>
    </div>
  )
}