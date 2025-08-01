// src/pages/keila/Home.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  MessageSquare,
  Mic,
  Compass,
  Plane,
  Calendar,
  MapPin,
} from 'lucide-react'

const categories = [
  { label: 'Hotels',    icon: Calendar,     bg: 'from-purple-500 to-pink-400' },
  { label: 'Flights',   icon: Plane,     bg: 'from-pink-400 to-yellow-400' },
  { label: 'Packages',  icon: MapPin,       bg: 'from-blue-400 to-green-400' },
  { label: 'Trains',    icon: Compass,      bg: 'from-green-400 to-teal-400' },
  { label: 'Rentals',   icon: HomeIcon,     bg: 'from-yellow-400 to-orange-400' },
  { label: 'Attractions',icon: MessageSquare,bg: 'from-indigo-500 to-purple-500' },
]

const popular = [
  'Miami', 'New York', 'Los Angeles',
  'Chicago', 'Orlando', 'Las Vegas',
]

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFEDE5] to-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 pt-12">
        {/* Utrippin.ai logo placeholder */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Utrippin.ai</h1>
        </div>
        <button onClick={() => nav('/keila/voice')}>
          <Mic className="w-6 h-6 text-gray-700" />
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="px-6 mt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Where do you want to go?"
            className="w-full h-12 rounded-full bg-white placeholder-gray-400 px-6 pr-14 shadow-lg focus:outline-none"
          />
          <button
            onClick={() => nav('/keila/chat')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 bg-purple-600 p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
          >
            <MessageSquare size={20} color="#fff" />
          </button>
        </div>
      </div>

      {/* CATEGORIES GRID */}
      <section className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Categories
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map(({ label, icon: Icon, bg }) => (
            <button
              key={label}
              onClick={() => console.log(label)}
              className={`
                flex flex-col items-center justify-center
                h-20 rounded-2xl
                bg-gradient-to-br ${bg}
                text-white font-medium
                shadow-lg transform hover:scale-105 transition
              `}
            >
              <Icon className="w-6 h-6 mb-1" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="px-6 mt-8 flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {popular.map((city) => (
            <button
              key={city}
              onClick={() => nav(`/keila/chat?prefill=Trip to ${encodeURIComponent(city)}`)}
              className="py-3 rounded-full bg-white text-gray-800 font-medium shadow hover:shadow-xl transition"
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* TALK TO KEILA CTA */}
      <div className="px-6 pb-6">
        <button
          onClick={() => nav('/keila/chat')}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg rounded-full shadow-xl hover:from-purple-700 hover:to-blue-600 transition"
        >
          Talk to Keila
        </button>
      </div>

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