// src/pages/keila/Home.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
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
const defaultQuestions = [
  "Where should I go next?",
  "Plan a trip for me",
  "Solo travel ideas",
  "Budget-friendly destinations",
];

export default function Home() {
  const nav = useNavigate()
  const [cards, setCards] = useState<string[]>(defaultQuestions)
  const [loading, setLoading] = useState(false)

  async function refreshQuestions() {
    setLoading(true)
    try {
      // Try to fetch from API, but fallback to default questions
      const res = await fetch('https://api.utrippin.ai/keila/inspiration')
      if (res.ok) {
        const data = await res.json()
        setCards(data.prompts || defaultQuestions)
      } else {
        setCards(defaultQuestions)
      }
    } catch (err) {
      console.error('API error, using default questions:', err)
      setCards(defaultQuestions)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <img src="/logo.svg" alt="Utrippin.ai" className="h-6" />
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex items-center space-x-4">
          <VolumeX className="w-6 h-6 text-gray-600" />
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="px-6 mt-4 flex-1 overflow-y-auto">
        <h1 className="text-4xl font-bold text-black">Hi there!</h1>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {cards.map((q, i) => (
            <button
              key={i}
              onClick={() =>
                nav(`/keila/chat?prefill=${encodeURIComponent(q)}`)
              }
              className="
                border border-gray-200 rounded-xl p-4
                hover:shadow flex flex-col"
            >
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-orange-500">
                  Inspiration
                </span>
              </div>
              <p className="text-base text-black leading-snug">{q}</p>
            </button>
          ))}
        </div>

        <button
          onClick={refreshQuestions}
          disabled={loading}
          className="mt-4 inline-flex items-center text-blue-500 text-sm font-medium"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1 transition-transform ${
              loading ? 'animate-spin' : ''
            }`}
          />
          Refresh Questions
        </button>
      </main>

      {/* BOTTOM ACTION ROW + INPUT */}
      <div
        className="
          sticky bottom-0 bg-white
          pt-4 pb-[env(safe-area-inset-bottom)]
          border-t border-gray-200
        "
      >
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