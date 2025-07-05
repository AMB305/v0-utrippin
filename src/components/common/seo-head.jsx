import { useEffect } from 'react';

export default function SEOHead({ title, description, image, url }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
    
    // Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = title || 'UTrippin - Find Flights, Hotels, Cars & Travel Buddies!';
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = description || 'Compare flights, hotels, car rentals, and connect with travel buddies. Discover your next adventure with UTrippin.';
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = image || '/UTrippin_Social_Card_1200x630_blue.png';
    if (!document.querySelector('meta[property="og:image"]')) {
      document.head.appendChild(ogImage);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = url || window.location.href;
    if (!document.querySelector('meta[property="og:url"]')) {
      document.head.appendChild(ogUrl);
    }
    
    // Twitter Card meta tags
    const twitterCard = document.querySelector('meta[name="twitter:card"]') || document.createElement('meta');
    twitterCard.name = 'twitter:card';
    twitterCard.content = 'summary_large_image';
    if (!document.querySelector('meta[name="twitter:card"]')) {
      document.head.appendChild(twitterCard);
    }
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]') || document.createElement('meta');
    twitterTitle.name = 'twitter:title';
    twitterTitle.content = title || 'UTrippin - Find Flights, Hotels, Cars & Travel Buddies!';
    if (!document.querySelector('meta[name="twitter:title"]')) {
      document.head.appendChild(twitterTitle);
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]') || document.createElement('meta');
    twitterDescription.name = 'twitter:description';
    twitterDescription.content = description || 'Compare flights, hotels, car rentals, and connect with travel buddies. Discover your next adventure with UTrippin.';
    if (!document.querySelector('meta[name="twitter:description"]')) {
      document.head.appendChild(twitterDescription);
    }
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.createElement('meta');
    twitterImage.name = 'twitter:image';
    twitterImage.content = image || '/UTrippin_Social_Card_1200x630_blue.png';
    if (!document.querySelector('meta[name="twitter:image"]')) {
      document.head.appendChild(twitterImage);
    }
  }, [title, description]);

  return null;
}