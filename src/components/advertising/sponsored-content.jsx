import React from "react";

export default function SponsoredContent({ placement }) {
  // Mock sponsored content based on placement
  const getContent = (placement) => {
    switch (placement) {
      case 'homepage_search':
        return {
          title: "Special Offer: Save 25% on Hotels",
          description: "Book now and save on your next hotel stay",
          cta: "Book Now"
        };
      default:
        return null;
    }
  };

  const content = getContent(placement);
  
  if (!content) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-500 mb-2">Sponsored</div>
      <h3 className="font-semibold text-blue-900 mb-1">{content.title}</h3>
      <p className="text-sm text-blue-700 mb-3">{content.description}</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
        {content.cta}
      </button>
    </div>
  );
}

export function BannerAd({ placement }) {
  return <SponsoredContent placement={placement} />;
}