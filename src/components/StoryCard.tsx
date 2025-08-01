import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface StoryCardProps {
  story: {
    title: string;
    link: string;
    image: string | null;
    excerpt: string | null;
    source: string | null;
    published_at: string;
  };
  size?: 'small' | 'medium' | 'large' | 'hero';
  backgroundColor?: 'black' | 'white';
}

export const StoryCard = ({ story, size = 'medium', backgroundColor = 'white' }: StoryCardProps) => {
  const sizeClasses = {
    small: 'col-span-1',
    medium: 'col-span-1 md:col-span-1',
    large: 'col-span-1 md:col-span-2',
    hero: 'col-span-1 md:col-span-3 lg:col-span-4'
  };

  const heightClasses = {
    small: 'h-40',
    medium: 'h-48',
    large: 'h-56',
    hero: 'h-64 md:h-80'
  };

  const cardBg = backgroundColor === 'black' ? 'bg-black' : 'bg-white border border-gray-200';
  const textColor = backgroundColor === 'black' ? 'text-white' : 'text-black';
  const excerptColor = backgroundColor === 'black' ? 'text-gray-300' : 'text-gray-700';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isInternalLink = (url: string) => {
    return url.startsWith('/') || url.startsWith('#');
  };

  return (
    <div className={`group ${cardBg} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${sizeClasses[size]}`}>
      <div className="relative overflow-hidden">
        <img 
          src={story.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'} 
          alt={story.title} 
          loading="lazy"
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${heightClasses[size]}`}
        />
        {backgroundColor === 'black' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
      </div>
      <div className="p-5">
        <h3 className={`font-bold ${textColor} mb-2 line-clamp-2 ${size === 'hero' ? 'text-2xl md:text-3xl' : size === 'large' ? 'text-xl' : 'text-lg'}`}>
          {story.title}
        </h3>
        <p className={`text-sm ${excerptColor} mb-3 line-clamp-2`}>
          {story.excerpt}
        </p>
        <div className="flex items-center justify-between">
          {isInternalLink(story.link) ? (
            <Link 
              to={story.link}
              className="inline-block text-orange-600 hover:text-orange-400 font-semibold text-sm transition-colors duration-200 group-hover:underline underline-offset-4"
            >
              Read more →
            </Link>
          ) : (
            <a 
              href={story.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-orange-600 hover:text-orange-400 font-semibold text-sm transition-colors duration-200 group-hover:underline underline-offset-4"
            >
              Read more via {story.source} →
            </a>
          )}
          <span className={`text-xs ${excerptColor}`}>
            {formatDate(story.published_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

interface HeroStoryCardProps {
  image: string;
  title: string;
  tag: string;
  excerpt: string;
  link: string;
}

export const HeroStoryCard = ({ image, title, tag, excerpt, link }: HeroStoryCardProps) => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] bg-blavity-black rounded-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>
      
      {/* Top badges */}
      <div className="absolute top-6 left-6 right-6">
        <Badge className="bg-blavity-gold text-blavity-black font-bold uppercase text-sm tracking-wide px-4 py-2">
          {tag}
        </Badge>
      </div>
      
      {/* Bottom content with reduced coverage */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight max-w-4xl">
          {title}
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-6 max-w-2xl line-clamp-2">
          {excerpt}
        </p>
        <a 
          href={link} 
          className="inline-block bg-blavity-gold text-blavity-black font-bold px-6 py-3 rounded-lg hover:bg-blavity-coral transition-colors duration-200 text-base"
        >
          Read Full Story →
        </a>
      </div>
    </div>
  );
};