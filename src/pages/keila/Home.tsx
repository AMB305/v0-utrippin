// src/pages/keila/Home.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  VolumeX,
  MoreHorizontal,
  Lightbulb,
  RefreshCw,
  Camera,
  Globe,
  Compass,
  Mic,
  Send,
} from 'lucide-react'
import UtrippinLogo from '../../components/UtrippinLogo'
import { fetchInspiration } from '../../api/keila'

export default function Home() {
  const nav = useNavigate()

  // State for dynamic prompts
  const [cards, setCards] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Load on mount
  useEffect(() => {
    refreshQuestions()
  }, [])

  // Fetch new prompts from your API
  async function refreshQuestions() {
    setLoading(true)
    try {
      const insp = await fetchInspiration() // returns string[]
      setCards(insp)
    } catch (err) {
      console.error('Failed to fetch inspiration:', err)
    } finally {
      setLoading(false)
    }
  }

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

      {/* MAIN CONTENT */}
      <main className="px-6 mt-4 flex-1 overflow-y-auto">
        {/* Greeting */}
        <h1
          className="
            text-4xl font-bold
            bg-clip-text text-transparent
            bg-gradient-to-r from-blue-500 to-purple-500
          "
        >
          Hi there!
        </h1>

        {/* 2×2 grid of dynamic prompts */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          {cards.map((q, idx) => (
            <button
              key={idx}
              onClick={() =>
                nav(`/keila/chat?prefill=${encodeURIComponent(q)}`)
              }
              className="
                flex items-start space-x-3
                border border-gray-200 rounded-xl
                p-4 hover:shadow
              "
            >
              <Lightbulb className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <span className="text-base text-black">{q}</span>
            </button>
          ))}
        </div>

        {/* Refresh control */}
        <button
          onClick={refreshQuestions}
          disabled={loading}
          className="mt-4 flex items-center text-blue-500 text-sm font-medium"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 transition-transform ${
              loading ? 'animate-spin' : ''
            }`}
          />
          Refresh Questions
        </button>
      </main>

      {/* STICKY ACTION & INPUT BAR */}
      <div
        className="
          sticky bottom-0
          bg-white
          pt-4 pb-[env(safe-area-inset-bottom)]
          border-t border-gray-200
        "
      >
        {/* Flat icon row */}
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Camera className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-black">Recognize Image</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Globe className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-black">Live Translate</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Compass className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-black">Live Guide</span>
          </button>
        </div>

        {/* Input bar */}
        <div className="mt-4 px-6 relative">
          <input
            type="text"
            placeholder="Ask anything you want…"
            className="
              w-full h-12 bg-gray-100 rounded-full
              px-4 pr-16 text-black placeholder-gray-500
              focus:outline-none
            "
          />
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-4 flex items-center space-x-2 text-blue-500">
            <Mic size={18} />
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}