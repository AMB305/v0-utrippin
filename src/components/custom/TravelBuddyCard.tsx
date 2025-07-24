import React from "react";
import { Heart, X, MessageCircle, MapPin, Settings, Filter, Flame, Users, User, Star, RotateCcw, Zap, Sparkles } from "lucide-react";

interface TravelBuddyCardProps {
  user: {
    id: string;
    name: string;
    age: number;
    photo: string;
    match: number;
    location: string;
    bio: string;
    tags: string[];
  };
  variant?: 'mobile' | 'desktop';
  onLike: () => void;
  onDislike: () => void;
  onChat: () => void;
  onNavigate?: (view: string) => void;
  activeView?: string;
}

export default function TravelBuddyCard({ user, variant = 'desktop', onLike, onDislike, onChat, onNavigate, activeView }: TravelBuddyCardProps) {
  if (variant === 'mobile') {
    return (
      <div className="relative w-full h-screen bg-backgroundDark">
        {/* Top header with Utrippin logo */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-tinderOrange to-uttippPurple flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-white font-bold text-lg">utrippin</span>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="w-6 h-6 text-white" />
            <Filter className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Full screen photo */}
        <img
          src={user.photo}
          alt={user.name}
          className="w-full h-full object-cover"
        />

        {/* Match badge */}
        <span className="absolute top-20 right-4 px-3 py-1 bg-gradient-to-r from-tinderOrange to-uttippPurple text-white text-sm font-bold rounded-full shadow z-10">
          {user.match}% Match
        </span>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
          {/* User info */}
          <div className="mb-4">
            <h2 className="text-white text-3xl font-bold mb-2">
              {user.name}, {user.age}
            </h2>
            <p className="text-gray-300 text-lg mb-3">{user.bio}</p>
            <div className="flex items-center gap-1 text-gray-300 mb-4">
              <MapPin className="w-4 h-4" />
              {user.location}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {user.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section with action buttons and navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-black">
          {/* Action buttons row */}
          <div className="flex justify-center gap-4 py-4 px-6">
            <button className="w-14 h-14 rounded-full border-2 border-gray-600 bg-black flex items-center justify-center hover:scale-110 transform transition">
              <RotateCcw className="w-6 h-6 text-yellow-500" />
            </button>
            <button 
              onClick={onDislike}
              className="w-14 h-14 rounded-full border-2 border-gray-600 bg-black flex items-center justify-center hover:scale-110 transform transition"
            >
              <X className="w-6 h-6 text-red-500" />
            </button>
            <button className="w-14 h-14 rounded-full border-2 border-gray-600 bg-black flex items-center justify-center hover:scale-110 transform transition">
              <Star className="w-6 h-6 text-blue-400" />
            </button>
            <button 
              onClick={onLike}
              className="w-14 h-14 rounded-full border-2 border-gray-600 bg-black flex items-center justify-center hover:scale-110 transform transition"
            >
              <Heart className="w-6 h-6 text-green-500" fill="currentColor" />
            </button>
            <button className="w-14 h-14 rounded-full border-2 border-gray-600 bg-black flex items-center justify-center hover:scale-110 transform transition">
              <Zap className="w-6 h-6 text-purple-500" />
            </button>
          </div>

          {/* Navigation tabs row */}
          <div className="flex border-t border-gray-800">
            <button
              onClick={() => onNavigate?.('discover')}
              className={`flex-1 p-3 flex flex-col items-center gap-1 ${activeView === 'discover' ? 'text-tinderOrange' : 'text-gray-400'}`}
            >
              <Flame className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate?.('matches')}
              className={`flex-1 p-3 flex flex-col items-center gap-1 ${activeView === 'matches' ? 'text-tinderOrange' : 'text-gray-400'}`}
            >
              <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => onNavigate?.('explore')}
              className={`flex-1 p-3 flex flex-col items-center gap-1 ${activeView === 'explore' ? 'text-tinderOrange' : 'text-gray-400'}`}
            >
              <Sparkles className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate?.('chat')}
              className={`flex-1 p-3 flex flex-col items-center gap-1 ${activeView === 'chat' ? 'text-tinderOrange' : 'text-gray-400'}`}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigate?.('profile')}
              className={`flex-1 p-3 flex flex-col items-center gap-1 ${activeView === 'profile' ? 'text-tinderOrange' : 'text-gray-400'}`}
            >
              <User className="w-6 h-6" />
            </button>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-32 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version (unchanged)
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl-soft overflow-hidden mx-4 lg:mx-0 max-w-sm w-full">
      
      {/* Photo */}
      <img
        src={user.photo}
        alt={user.name}
        className="w-full h-64 object-cover"
      />

      {/* Match badge */}
      <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-tinderOrange to-uttippPurple text-white text-sm font-bold rounded-full shadow">
        {user.match}% Match
      </span>

      {/* Info */}
      <div className="p-6 font-sans">
        <h2 className="text-2xl font-bold mb-1 text-gray-900">
          {user.name}, {user.age}
        </h2>
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {user.location}
        </p>
        <p className="text-gray-500 mb-4">{user.bio}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-16">
          {user.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center space-x-8">
        <button
          onClick={onDislike}
          className="p-4 bg-white rounded-full shadow hover:scale-110 transform transition border border-gray-200"
        >
          <X className="text-xl text-gray-600" size={20} />
        </button>
        <button
          onClick={onLike}
          className="p-6 bg-gradient-to-r from-tinderOrange to-uttippPurple rounded-full shadow-lg hover:scale-110 transform transition"
        >
          <Heart className="text-2xl text-white" size={24} fill="currentColor" />
        </button>
        <button
          onClick={onChat}
          className="p-4 bg-white rounded-full shadow hover:scale-110 transform transition border border-gray-200"
        >
          <MessageCircle className="text-xl text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
}