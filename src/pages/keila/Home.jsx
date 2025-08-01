// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import UtrippinLogo from '../../components/UtrippinLogo'
import {
  ChevronDown,
  Camera,
  Translate,
  Compass,
  Lightbulb,
  Send,
  Mic,
} from 'lucide-react'

const cards = [
  {
    question: 'What are the best wineries to visit in Napa Valley?',
  },
  {
    question: 'Which beaches in Miami Beach are dog-friendly?',
  },
  {
    question: 'Top free museums in Washington, DC?',
  },
  {
    question: 'How to plan a budget-friendly trip to St Croix, USVI?',
  },
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
          {/* you can wire these icons up later */}
          <Camera    className="w-6 h-6 text-gray-600" />
          <Translate className="w-6 h-6 text-gray-600" />
          <Compass   className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      {/* ── GREETING & CARDS ── */}
      <main className="px-6 mt-4 flex-1">
        <h1 className="text-3xl font-bold text-black">Hi there!</h1>

        <div className="mt-4 grid grid-cols-1 gap-4">
          {cards.map((c, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 flex items-start space-x-3"
            >
              <Lightbulb className="w-5 h-5 text-blue-600 mt-1" />
              <p className="text-sm text-black">{c.question}</p>
            </div>
          ))}
        </div>

        {/* optional: you can wire up "Refresh" */}
        <button className="mt-4 text-blue-600 text-sm font-medium">
          ↻ Refresh Questions
        </button>
      </main>

      {/* ── BOTTOM ACTIONS ── */}
      <div className="px-6 pb-4 space-y-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Camera    className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-black">Recognize Image</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Translate className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-black">Live Translate</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Compass   className="w-6 h-6 text-gray-700" />
            <span className="text-xs text-black">Live Guide</span>
          </button>
        </div>

        {/* input bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything you want…"
            className="w-full h-12 rounded-full bg-gray-100 px-4 pr-14 text-black placeholder-gray-500 focus:outline-none"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-blue-600">
            <Mic size={18} />
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}