import React from 'react';
import { VecteezyImage } from '@/components/VecteezyImage';

interface CategoryStripItem {
  title: string;
  image: string;
  tag: string;
  excerpt: string;
  link: string;
}

interface CategoryStripProps {
  title: string;
  items: CategoryStripItem[];
  backgroundColor?: 'black' | 'white';
}

export const CategoryStrip = ({ title, items, backgroundColor = 'black' }: CategoryStripProps) => {
  const bgClass = backgroundColor === 'black' ? 'bg-blavity-black' : 'bg-white';
  const textClass = backgroundColor === 'black' ? 'text-white' : 'text-black';
  const cardBgClass = backgroundColor === 'black' ? 'bg-blavity-soft-black' : 'bg-gray-50';

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${textClass}`}>
          {title}
        </h2>
        
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`flex-shrink-0 w-72 ${cardBgClass} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group`}
            >
              <VecteezyImage 
                destination={item.title}
                description={item.excerpt}
                tags={[item.tag]}
                fallbackImage={item.image}
                alt={item.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <div className={`text-xs font-semibold mb-2 ${backgroundColor === 'black' ? 'text-blavity-yellow' : 'text-blavity-orange'}`}>
                  {item.tag}
                </div>
                <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${textClass}`}>
                  {item.title}
                </h3>
                <p className={`text-sm line-clamp-2 ${backgroundColor === 'black' ? 'text-gray-300' : 'text-blavity-gray'}`}>
                  {item.excerpt}
                </p>
                <div className={`mt-3 text-sm font-medium ${backgroundColor === 'black' ? 'text-blavity-yellow' : 'text-blavity-orange'} group-hover:underline`}>
                  Read More →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
