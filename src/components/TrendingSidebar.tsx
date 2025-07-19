import React from 'react';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingItem {
  title: string;
  image: string;
  date: string;
  link: string;
}

interface TrendingSidebarProps {
  items: TrendingItem[];
}

export const TrendingSidebar = ({ items }: TrendingSidebarProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-black mb-4 flex items-center">
        <span className="mr-2">🔥</span>
        Trending Now
      </h3>
      {items.map((item, index) => {
        const isExternal = item.link.startsWith('http');
        
        if (isExternal) {
          return (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-black line-clamp-2 group-hover:text-blavity-orange transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center text-xs text-blavity-gray mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.date}
                </div>
              </div>
            </a>
          );
        } else {
          return (
            <Link
              key={index}
              to={item.link}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
            >
              <img 
                src={item.image} 
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-black line-clamp-2 group-hover:text-blavity-orange transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center text-xs text-blavity-gray mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {item.date}
                </div>
              </div>
            </Link>
          );
        }
      })}
    </div>
  );
};