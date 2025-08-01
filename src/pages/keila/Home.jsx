// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Home as HomeIcon, MessageSquare, Mic } from 'lucide-react'

const prompts = [
  '7-day family trip to Costa Rica',
  'Rome flights under $800',
  'Top attractions in Lisbon',
  'Boutique Bali hotels',
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="px-6 pt-16">
        <h1 className="text-4xl font-bold text-black">
          Where to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            next?
          </span>
        </h1>
      </header>

      {/* SEARCH & PROMPTS */}
      <main className="flex-1 px-6 pt-6">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="e.g., 5-day romantic getaway to Paris"
            className="w-full h-12 rounded-full bg-gray-100 placeholder-gray-400 px-6 pr-16 shadow-sm focus:outline-none"
          />
          <button
            onClick={() => nav('/keila/chat')}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-4 bg-purple-600 p-3 rounded-full"
          >
            <ArrowRight size={20} color="#fff" />
          </button>
        </div>

        {/* Prompt chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() =>
                nav(`/keila/chat?prefill=${encodeURIComponent(p)}`)
              }
              className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 text-sm shadow-sm"
            >
              {p}
            </button>
          ))}
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="h-16 bg-white border-t border-gray-200 flex justify-around items-center">
        <HomeIcon
          size={24}
          className="text-purple-600 cursor-pointer"
          onClick={() => nav('/keila/home')}
        />
        <MessageSquare
          size={24}
          className="text-gray-400 cursor-pointer"
          onClick={() => nav('/keila/chat')}
        />
        <Mic
          size={24}
          className="text-gray-400 cursor-pointer"
          onClick={() => nav('/keila/voice')}
        />
      </nav>
    </div>
  )
}