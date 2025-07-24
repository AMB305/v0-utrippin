import React from "react";
import { Heart, X, MessageCircle, MapPin } from "lucide-react";

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
  onLike: () => void;
  onDislike: () => void;
  onChat: () => void;
}

export default function TravelBuddyCard({ user, onLike, onDislike, onChat }: TravelBuddyCardProps) {
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