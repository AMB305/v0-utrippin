// src/pages/keila/Onboarding.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Plane, Compass } from 'lucide-react'

const features = [
  { icon: MapPin, title: 'Personalized Itineraries', desc: 'Custom plans based on your style & budget.' },
  { icon: Plane, title: 'Smart Booking', desc: 'Best flight, hotel & activity deals.' },
  { icon: Compass, title: 'On-Trip Support', desc: 'Instant tips & local recommendations.' },
]

export default function Onboarding() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-[#101419] flex flex-col p-6">
      {/* top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Keila</h1>
        <button className="text-gray-400" onClick={() => nav('/keila/home')}>
          Skip
        </button>
      </div>

      {/* headline */}
      <h2 className="mt-12 text-white text-4xl font-extrabold leading-tight">
        Travel smarter with Keila
      </h2>

      {/* features */}
      <div className="mt-8 flex-1 flex flex-col justify-center space-y-6">
        {features.map((f) => {
          const IconComponent = f.icon;
          return (
            <div key={f.title} className="flex items-start space-x-4">
              <IconComponent className="text-[#2575fc] text-xl mt-1" size={20} />
              <div>
                <h3 className="text-white font-semibold text-lg">{f.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => nav('/keila/home')}
        className="w-full py-4 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white font-bold text-lg mb-8"
      >
        Let's Plan a Trip
      </button>
    </div>
  )
}