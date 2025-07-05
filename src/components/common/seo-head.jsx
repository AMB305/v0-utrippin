import { useEffect } from 'react';

export default function SEOHead({ title, description, image, url, structuredData }) {
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
      updateMetaTag('twitter:title', title, false);
    }
    if (description) {
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description, false);
    }
    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('og:image:width', '1200');
      updateMetaTag('og:image:height', '630');
      updateMetaTag('twitter:image', image, false);
    }
    if (url) {
      updateMetaTag('og:url', url);
    }
    
    // Ensure Twitter card type is set
    updateMetaTag('twitter:card', 'summary_large_image', false);
    
    // Handle structured data JSON-LD
    if (structuredData) {
      // Remove existing structured data script if it exists
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Add new structured data script
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
  }, [title, description, image, url, structuredData]);

  return null;
}