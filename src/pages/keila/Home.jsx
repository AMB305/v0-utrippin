// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  ChevronDown,
  Search,
  Menu,
  MessageSquare,
  Image,
  List,
  Map,
  Home as HomeIcon,
  MessageCircle,
  Mic,
} from 'lucide-react'

const suggestions = [
  'Trip to Tokyo on a budget',
  'Find flights to Rome under $800',
  'Top attractions in Lisbon',
  'Suggest boutique hotels in Bali',
]

const features = [
  { Icon: Image, label: 'Image Maker',    desc: 'Create travel visuals' },
  { Icon: List,  label: 'Itinerary Builder', desc: 'Day-by-day plans' },
  { Icon: Map,   label: 'Local Guides',    desc: 'Hidden gems & tips' },
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── HEADER ── */}
      <header className="px-6 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-black">Utrippin.ai</span>
          <ChevronDown className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-6 h-6 text-gray-600" />
          <Menu   className="w-6 h-6 text-gray-600" />
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="px-6 mt-6 flex-1">
        {/* 1) Title */}
        <h1 className="text-3xl font-bold text-black">
          What can I do for you{' '}
          <span className="text-blue-600">today?</span>
        </h1>

        {/* 2) Central Chat CTA */}
        <button
          onClick={() => nav('/keila/chat')}
          className="mt-6 w-full h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Start Chat
        </button>

        {/* 3) Suggestion Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() =>
                nav(`/keila/chat?prefill=${encodeURIComponent(s)}`)
              }
              className="px-4 py-2 bg-gray-100 text-black rounded-full text-sm"
            >
              {s}
            </button>
          ))}
        </div>

        {/* 4) Feature Cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {features.map(({ Icon, label, desc }) => (
            <div
              key={label}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center shadow-sm"
            >
              <Icon size={24} className="text-blue-600 mb-2" />
              <h3 className="text-sm font-semibold text-black">{label}</h3>
              <p className="text-xs text-gray-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── FOOTER CTA ── */}
      <div className="px-6 pb-6">
        <button
          onClick={() => nav('/keila/chat')}
          className="w-full h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-base font-medium shadow-md"
        >
          Talk to Keila
          <MessageCircle className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* ── BOTTOM NAV ── */}
      <nav className="h-16 bg-white border-t border-gray-200 flex justify-around items-center px-6">
        <HomeIcon
          size={24}
          className="text-blue-600 cursor-pointer"
          onClick={() => nav('/keila/home')}
        />
        <MessageCircle
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