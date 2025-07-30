import { useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHereAutocomplete = (setValue: (value: string) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const handleInput = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const query = target.value;
      if (query.length < 3) return;
      
      try {
        const { data, error } = await supabase.functions.invoke('here-locations', {
          body: { query }
        });

        if (error) {
          console.error('HERE API error:', error);
          return;
        }

        if (data && data.length > 0) {
          // Prioritize airport results - look for 3-letter codes in the address label
          const airport = data.find((item: any) => {
            const label = item.address?.label || '';
            const words = label.split(/[\s,]+/);
            return words.some((word: string) => /^[A-Z]{3}$/.test(word));
          });
          
          if (airport) {
            const label = airport.address?.label || '';
            const words = label.split(/[\s,]+/);
            const code = words.find((word: string) => /^[A-Z]{3}$/.test(word));
            if (code) {
              setValue(code);
            } else {
              setValue(airport.address?.label || '');
            }
          } else {
            // Fallback to first result
            setValue(data[0].address?.label || '');
          }
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
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