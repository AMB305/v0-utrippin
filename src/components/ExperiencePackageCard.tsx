import React from "react";

interface ExperiencePackageCardProps {
  item: {
    name: string;
    description: string;
    link: string;
    image: string;
    category?: string;
  };
}

export function ExperiencePackageCard({ item }: ExperiencePackageCardProps) {
  return (
    <div className="bg-card rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden border border-border">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-card-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
        <a 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}