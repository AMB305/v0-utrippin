// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  MessageSquare,
  Image,
  List,
  MapPin,
  ArrowRightCircle,
} from 'lucide-react'

const suggestions = [
  'Trip to Tokyo on a budget',
  'Find flights to Rome under $800',
  'Top attractions in Lisbon',
  'Suggest boutique hotels in Bali',
]

const features = [
  { Icon: Image,  label: 'Image Maker',    desc: 'Create travel visuals' },
  { Icon: List,   label: 'Itinerary Builder',desc: 'Day-by-day plans' },
  { Icon: MapPin, label: 'Local Guides',    desc: 'Hidden gems & tips' },
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1) Header */}
      <header className="px-6 pt-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">
          What can I do for you{' '}
          <span className="text-blue-600">today?</span>
        </h1>
        <ChevronDown size={24} className="text-black" />
      </header>

      {/* 2) Central CTA */}
      <div className="px-6 mt-6 flex justify-center">
        <button
          onClick={() => nav('/keila/chat')}
          className="w-3/4 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-md"
        >
          <MessageSquare className="mr-2" size={20} /> Start Chat
        </button>
      </div>

      {/* 3) Suggestion chips */}
      <div className="px-6 mt-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => nav(`/keila/chat?prefill=${encodeURIComponent(s)}`)}
            className="px-4 py-2 bg-gray-100 text-black rounded-full text-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* 4) Feature cards */}
      <div className="px-6 mt-6 grid grid-cols-3 gap-4">
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

      {/* 5) Bottom "Talk to Keila" CTA */}
      <div className="mt-auto px-6 pb-6">
        <button
          onClick={() => nav('/keila/chat')}
          className="w-full h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-base font-medium shadow-md"
        >
          Talk to Keila
          <ArrowRightCircle className="ml-2" size={20} />
        </button>
      </div>
    </div>
  )
}