import { useEffect } from 'react';

export default function SEOHead({ title, description, image, url }) {
  useEffect(() => {
    // Set page title
    if (title) {
      document.title = title;
    }
    
    // Set meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }
    
    // Update Open Graph meta tags
    const updateMetaTag = (property, content, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let metaTag = document.querySelector(selector);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (isProperty) {
          metaTag.setAttribute('property', property);
        } else {
          metaTag.setAttribute('name', property);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    };
    
    // Open Graph tags
    if (title) {
      updateMetaTag('og:title', title);
    }
    if (description) {
      updateMetaTag('og:description', description);
    }
    if (image) {
      updateMetaTag('og:image', image);
    }
    if (url) {
      updateMetaTag('og:url', url);
    }
    
    // Twitter Card tags
    if (title) {
      updateMetaTag('twitter:title', title, false);
    }
    if (description) {
      updateMetaTag('twitter:description', description, false);
    }
    if (image) {
      updateMetaTag('twitter:image', image, false);
    }
    
  }, [title, description, image, url]);

  return null;
}