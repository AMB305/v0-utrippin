import React from 'react';
import { VecteezyImage } from '@/components/VecteezyImage';

interface EditorialItem {
  title: string;
  image: string;
  tag: string;
  excerpt: string;
  link: string;
  date?: string;
}

interface EditorialGridProps {
  title: string;
  items: EditorialItem[];
}

export const EditorialGrid = ({ title, items }: EditorialGridProps) => {
  return (
    <section className="bg-blavity-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          {title}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="bg-blavity-soft-black rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <VecteezyImage 
                destination={item.title}
                description={item.excerpt}
                tags={[item.tag]}
                fallbackImage={item.image}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <div className="text-xs font-bold text-blavity-yellow uppercase tracking-wide mb-2">
                  {item.tag}
                </div>
                <h3 className="font-bold text-white text-lg mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                  {item.excerpt}
                </p>
                {item.date && (
                  <div className="text-xs text-gray-400 mb-3">
                    {item.date}
                  </div>
                )}
                <div className="text-blavity-orange text-sm font-medium group-hover:underline">
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
