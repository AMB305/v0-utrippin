import { useRef, useEffect } from 'react';

declare global {
  interface Window {
    H: any;
  }
}

export const useHereAutocomplete = (setValue: (value: string) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadHereScripts = async () => {
      // Check if HERE API is already loaded
      if (window.H) {
        setupAutocomplete();
        return;
      }

      // Load HERE API scripts
      const loadScript = (url: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          if (document.querySelector(`script[src="${url}"]`)) {
            resolve();
            return;
          }
          
          const script = document.createElement("script");
          script.src = url;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
          document.body.appendChild(script);
        });
      };

      try {
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-core.js");
        await loadScript("https://js.api.here.com/v3/3.1/mapsjs-service.js");
        
        // Wait a bit for the scripts to initialize
        setTimeout(() => {
          if (window.H) {
            setupAutocomplete();
          }
        }, 100);
      } catch (error) {
        console.error("Failed to load HERE API scripts:", error);
      }
    };

    const setupAutocomplete = () => {
      if (!window.H || !inputRef.current) return;
      
      const platform = new window.H.service.Platform({ 
        apikey: import.meta.env.VITE_HERE_API_KEY || "YOUR_HERE_API_KEY_HARDCODED_FOR_NOW"
      });
      const service = platform.getSearchService();

      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const query = target.value;
        if (query.length < 3) return;
        
        service.autosuggest({ 
          q: query, 
          at: "0,0",
          limit: 5,
          resultTypes: ["place", "airport"],
          categories: "airport"
        }, (result: any) => {
          if (result.items && result.items.length > 0) {
            // Prioritize airport results
            const airport = result.items.find((item: any) => 
              item.resultType === "place" && item.id?.includes("airport")
            );
            
            if (airport) {
              const code = airport.id?.split("::")?.pop()?.toUpperCase();
              if (code?.length === 3) {
                setValue(code);
              } else {
                setValue(airport.title || airport.address?.label);
              }
            } else {
              // Fallback to first result
              const first = result.items[0];
              const code = first.id?.split("::")?.pop()?.toUpperCase();
              if (first.resultType === "place" && code?.length === 3) {
                setValue(code);
              } else {
                setValue(first.address?.label || first.title);
              }
            }
          }
        });
      };

      inputRef.current.addEventListener("input", handleInput);
      
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener("input", handleInput);
        }
      };
    };

    loadHereScripts();
  }, [setValue]);

  return inputRef;
};