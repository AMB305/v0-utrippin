// src/pages/keila/Chat.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import UtrippinLogo from '../../components/UtrippinLogo'
import {
  ChevronDown,
  VolumeX,
  MoreHorizontal,
  ArrowDown,
  Lightbulb,
  Camera,
  Globe,
  Compass,
  MessageCircle,
  Mic,
  Send,
  ArrowRightCircle,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
} from 'lucide-react'

const itineraryData = {
  days: [
    {
      day: 1,
      activities: [
        { text: 'Visit Cancún Beach, a stunning beach with crystal-clear waters and white sand.', link: 'https://en.wikipedia.org/wiki/Canc%C3%BAn_Beach' },
        { text: 'Explore Playa Tortugas, a popular beach known for its lively atmosphere and water activities.', link: 'https://en.wikipedia.org/wiki/Playa_Tortugas' },
        { text: 'Discover Playa Langosta, a serene beach perfect for relaxation and swimming.', link: 'https://en.wikipedia.org/wiki/Playa_Langosta' },
      ],
      images: [
        { src: 'https://example.com/cancun.jpg', caption: 'Cancún Beach' },
        { src: 'https://example.com/tortugas.jpg', caption: 'Playa Tortugas' },
      ],
    },
    {
      day: 2,
      activities: [
        { text: 'Visit El Rey Archaeological Zone, an ancient Mayan site with fascinating ruins.', link: 'https://en.wikipedia.org/wiki/El_Rey_Archaeological_Zone' },
        { text: 'Explore Museo Maya de Cancún, showcasing the rich history and culture of the Mayan civilization.', link: 'https://en.wikipedia.org/wiki/Museo_Maya_de_Canc%C3%BAn' },
        { text: 'Relax at Dolphin Beach, a beautiful beach with opportunities to spot dolphins.', link: 'https://en.wikipedia.org/wiki/Dolphin_Plaza' },
      ],
      images: [
        { src: 'https://example.com/elrey.jpg', caption: 'El Rey Archaeological Zone' },
        { src: 'https://example.com/maya.jpg', caption: 'Museo Maya de Cancún' },
      ],
    },
    {
      day: 3,
      activities: [
        { text: 'Visit Museo INAH, a museum featuring exhibits on Mexican history and archaeology.', link: 'https://en.wikipedia.org/wiki/Museo_Nacional_de_Antropolog%C3%ADa' },
        { text: 'Enjoy a scenic ride on the Ferrar\'s Wheel Cancún, offering panoramic views of the city and coastline.', link: 'https://en.wikipedia.org/wiki/La_Rueda_Canc%C3%BAn' },
        { text: 'End the day at Plaza Las Américas, a bustling shopping mall with a variety of dining options.', link: 'https://en.wikipedia.org/wiki/Plaza_Las_Am%C3%A9ricas_(Canc%C3%BAn)' },
      ],
      images: [
        { src: 'https://example.com/ferris.jpg', caption: 'Ferris Wheel Cancún' },
      ],
    },
  ],
  tips: {
    Currency: 'Cancún uses the Mexican Peso (MXN).',
    Weather:
      'Cancún has a tropical climate with distinct wet and dry seasons. The dry season (November to April) is ideal—warm with low humidity. The wet season (May to October) can be hot and humid with rain showers and occasional hurricanes.',
    Culture:
      'Cancún is known for its vibrant nightlife, rich Mayan history, and delicious Mexican cuisine. Don\'t miss local festivals and traditional music!',
  },
  attractions: ['MUSA', 'Playa Gaviota Azul', 'Cinepolis (Puerto Cancún)'],
  mapUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=Cancun&zoom=12&size=600x300&markers=label:C|21.1619,-86.8515',
}

export default function Chat() {
  const nav = useNavigate()

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

      {/* CHAT HISTORY */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Prompt */}
        <div className="self-end max-w-[75%] bg-gray-200 text-black px-4 py-2 rounded-xl">
          plan me a trip to Cancun with 2 people and $1000
        </div>

        {/* AI Follow-Up */}
        <div className="self-start max-w-[80%] bg-gray-50 text-black px-4 py-2 rounded-xl">
          How many days will you be spending in Cancun?
        </div>

        {/* User Answer */}
        <div className="self-end w-12 bg-blue-600 text-white text-center rounded-xl px-2 py-1">
          3
        </div>

        {/* Itinerary Card */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
          <h2 className="text-lg font-semibold text-black">Itinerary for you</h2>

          {/* Days */}
          {itineraryData.days.map(({ day, activities, images }) => (
            <div key={day} className="space-y-3">
              <h3 className="font-semibold text-black">Day {day}:</h3>
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {activities.map(({ text, link }) => (
                  <li key={text}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Photos */}
              {images?.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map(({ src, caption }) => (
                    <div key={caption} className="relative w-48 h-28 flex-shrink-0">
                      <img
                        src={src}
                        alt={caption}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-1 left-2 text-white font-semibold text-sm drop-shadow">
                        {caption}
                      </div>
                      <ArrowDown className="absolute bottom-1 right-1 w-5 h-5 text-white drop-shadow" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Travel Tips */}
          <div className="space-y-2">
            <h3 className="font-semibold text-black">Here are some travel tips:</h3>
            {Object.entries(itineraryData.tips).map(([key, val]) => (
              <p key={key} className="text-gray-800">
                <span className="font-medium">{key}:</span> {val}
              </p>
            ))}
          </div>

          {/* Additional Attractions */}
          <div className="space-y-1">
            <h3 className="font-semibold text-black">
              Here are some other Attraction recommendations:
            </h3>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              {itineraryData.attractions.map((a) => (
                <li key={a} className="underline text-blue-600">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Map Embed */}
          <div>
            <h3 className="font-semibold text-black">Map of your trip:</h3>
            <img
              src={itineraryData.mapUrl}
              alt="Map of itinerary"
              className="w-full h-32 object-cover rounded-lg shadow-md mt-2"
            />
            <button
              onClick={() => window.open('https://maps.google.com')}
              className="mt-2 text-blue-600 font-medium underline text-sm"
            >
              View on map &rarr;
            </button>
          </div>

          {/* "View More Itineraries" */}
          <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-full text-sm font-medium">
            View More Itineraries
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            *This content is generated by AI
          </p>

          {/* Reactions */}
          <div className="flex space-x-4 justify-center pt-2">
            <ThumbsUp size={20} className="text-gray-600 cursor-pointer" />
            <ThumbsDown size={20} className="text-gray-600 cursor-pointer" />
            <Copy size={20} className="text-gray-600 cursor-pointer" />
            <Share2 size={20} className="text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* "You may also ask" */}
        <div className="space-y-2">
          <h4 className="text-black font-semibold">You may also ask</h4>
          {[
            'Can I add a day trip to Chichen Itza?',
            'Could I extend the trip by two days?',
            'What are some must-see attractions in Cancun?',
          ].map((q) => (
            <button
              key={q}
              onClick={() => nav(`/keila/chat?prefill=${encodeURIComponent(q)}`)}
              className="w-full text-left px-4 py-2 bg-gray-100 rounded-full flex justify-between items-center"
            >
              <span className="text-gray-800">{q}</span>
              <ArrowRightCircle size={18} className="text-blue-600" />
            </button>
          ))}
        </div>
      </main>

      {/* BOTTOM ACTIONS + INPUT */}
      <div className="px-4 pt-2 pb-4 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <button className="flex flex-col items-center space-y-1">
            <Camera    className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-black">Recognize Image</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Globe className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-black">Live Translate</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Compass   className="w-5 h-5 text-gray-700" />
            <span className="text-xs text-black">Live Guide</span>
          </button>
        </div>

        {/* Input Bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Ask anything you want..."
            className="w-full h-12 rounded-full bg-gray-100 px-4 pr-16 text-black placeholder-gray-500 focus:outline-none"
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