// src/utils/itineraryStorage.ts

import { ComprehensiveItinerary } from '@/lib/schemas';

export const saveItinerary = (itinerary: ComprehensiveItinerary): string => {
  const itineraryId = itinerary.itineraryId || Date.now().toString();
  localStorage.setItem(`itinerary_${itineraryId}`, JSON.stringify(itinerary));
  return itineraryId;
};

export const getItinerary = (id: string): ComprehensiveItinerary | null => {
  try {
    const stored = localStorage.getItem(`itinerary_${id}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error retrieving itinerary:', error);
    return null;
  }
};

export const getAllItineraries = (): Array<{ id: string; itinerary: ComprehensiveItinerary }> => {
  const itineraries: Array<{ id: string; itinerary: ComprehensiveItinerary }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('itinerary_')) {
      try {
        const id = key.replace('itinerary_', '');
        const itinerary = JSON.parse(localStorage.getItem(key)!);
        itineraries.push({ id, itinerary });
      } catch (error) {
        console.error('Error parsing itinerary:', key, error);
      }
    }
  }
  
  return itineraries;
};

export const deleteItinerary = (id: string): boolean => {
  try {
    localStorage.removeItem(`itinerary_${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return false;
  }
};

export const generateShareableUrl = (itineraryId: string): string => {
  return `${window.location.origin}/itinerary/${itineraryId}`;
};