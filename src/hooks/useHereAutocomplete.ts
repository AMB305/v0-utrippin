import { useRef, useEffect } from 'react';

declare global {
  interface Window {
    H: any;
  }
}

export const useHereAutocomplete = (setValue: (value: string) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.H || !inputRef.current) return;
    
    const platform = new window.H.service.Platform({ 
      apikey: process.env.NEXT_PUBLIC_HERE_API_KEY 
    });
    const service = platform.getSearchService();

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const query = target.value;
      if (query.length < 3) return;
      
      service.autosuggest({ q: query, at: "0,0" }, (result: any) => {
        if (result.items && result.items.length > 0) {
          setValue(result.items[0].address?.label || result.items[0].title);
        }
      });
    };

    inputRef.current.addEventListener("input", handleInput);
    
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("input", handleInput);
      }
    };
  }, [setValue]);

  return inputRef;
};