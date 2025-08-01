// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import UtrippinLogo from '../../components/UtrippinLogo'
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

const cards = [
  'What are the best wineries to visit in Napa Valley?',
  'Which beaches in Miami Beach are dog-friendly?',
  'Top free museums in Washington, DC?',
  'How to plan a budget-friendly trip to St Croix, USVI?',
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── HEADER ── */}
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

      {/* ── GREETING & CARDS ── */}
      <main className="px-6 mt-4 flex-1">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Hi there!
        </h1>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {cards.map((q, i) => (
            <button
              key={i}
              onClick={() =>
                nav(`/keila/chat?prefill=${encodeURIComponent(q)}`)
              }
              className="w-full text-left border border-gray-200 rounded-xl p-4 flex items-start space-x-3 hover:shadow"
            >
              <Lightbulb className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <span className="text-base text-black">{q}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {/* regenerate */}}
          className="mt-4 flex items-center text-blue-500 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh Questions
        </button>
      </main>

      {/* ── ACTION ROW ── */}
      <div className="px-6 pb-4">
        <div className="flex justify-around border-t border-gray-200 pt-4">
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

        {/* ── INPUT BAR ── */}
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Ask anything you want…"
            className="w-full h-12 bg-gray-100 rounded-full px-4 pr-16 text-black placeholder-gray-500 focus:outline-none"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-blue-500">
            <Mic size={18} />
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}