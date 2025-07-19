import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchHistoryItem {
  id: string;
  searchType: 'hotels' | 'flights' | 'cars' | 'packages' | 'cruises';
  destination: string;
  checkInDate?: string;
  checkOutDate?: string;
  pickupDate?: string;
  dropoffDate?: string;
  guests?: number;
  rooms?: number;
  travelers?: number;
  createdAt: string;
  searchData?: any;
}

const STORAGE_KEY = 'utrippin_search_history';
const MAX_LOCAL_HISTORY = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_IN') {
        // Sync localStorage to database when user signs in
        syncLocalToDatabase();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load search history (localStorage or database)
  useEffect(() => {
    if (loading) return;
    
    if (isAuthenticated) {
      loadFromDatabase();
    } else {
      loadFromLocalStorage();
    }
  }, [isAuthenticated, loading]);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSearchHistory(parsed);
      }
    } catch (error) {
      console.error('Error loading search history from localStorage:', error);
    }
  };

  const loadFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading search history from database:', error);
        // Fallback to localStorage
        loadFromLocalStorage();
        return;
      }

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        id: item.id,
        searchType: item.search_type as any,
        destination: item.destination,
        checkInDate: item.check_in_date,
        checkOutDate: item.check_out_date,
        pickupDate: item.pickup_date,
        dropoffDate: item.dropoff_date,
        guests: item.guests,
        rooms: item.rooms,
        travelers: item.travelers,
        createdAt: item.created_at,
        searchData: item.search_data
      }));

      setSearchHistory(formattedHistory);
    } catch (error) {
      console.error('Error loading search history:', error);
      loadFromLocalStorage();
    }
  };

  const saveToLocalStorage = (newHistory: SearchHistoryItem[]) => {
    try {
      // Keep only the most recent items
      const limitedHistory = newHistory.slice(0, MAX_LOCAL_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const saveToDatabase = async (item: Omit<SearchHistoryItem, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .insert({
          search_type: item.searchType,
          destination: item.destination,
          check_in_date: item.checkInDate,
          check_out_date: item.checkOutDate,
          pickup_date: item.pickupDate,
          dropoff_date: item.dropoffDate,
          guests: item.guests,
          rooms: item.rooms,
          travelers: item.travelers,
          search_data: item.searchData
        });

      if (error) {
        console.error('Error saving to database:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error saving to database:', error);
      return false;
    }
  };

  const addSearch = async (searchData: Omit<SearchHistoryItem, 'id' | 'createdAt'>) => {
    const newItem: SearchHistoryItem = {
      ...searchData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };

    // Always update local state immediately
    const newHistory = [newItem, ...searchHistory];
    setSearchHistory(newHistory);

    if (isAuthenticated) {
      // Save to database
      const success = await saveToDatabase(searchData);
      if (success) {
        // Reload from database to get the actual ID
        loadFromDatabase();
      } else {
        // Fallback to localStorage
        saveToLocalStorage(newHistory);
      }
    } else {
      // Save to localStorage
      saveToLocalStorage(newHistory);
    }
  };

  const syncLocalToDatabase = async () => {
    if (!isAuthenticated) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const localHistory: SearchHistoryItem[] = JSON.parse(stored);
      
      // Save each local item to database
      for (const item of localHistory) {
        await saveToDatabase({
          searchType: item.searchType,
          destination: item.destination,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          pickupDate: item.pickupDate,
          dropoffDate: item.dropoffDate,
          guests: item.guests,
          rooms: item.rooms,
          travelers: item.travelers,
          searchData: item.searchData
        });
      }

      // Clear localStorage after successful sync
      localStorage.removeItem(STORAGE_KEY);
      
      // Reload from database
      loadFromDatabase();
    } catch (error) {
      console.error('Error syncing localStorage to database:', error);
    }
  };

  const clearHistory = async () => {
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from('search_history')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
          console.error('Error clearing database history:', error);
        }
      } catch (error) {
        console.error('Error clearing database history:', error);
      }
    }
    
    // Always clear localStorage
    localStorage.removeItem(STORAGE_KEY);
    setSearchHistory([]);
  };

  const getRecentSearchesByType = (type: string, limit = 3) => {
    return searchHistory
      .filter(item => item.searchType === type)
      .slice(0, limit);
  };

  const getMostRecentSearch = () => {
    return searchHistory[0] || null;
  };

  return {
    searchHistory,
    addSearch,
    clearHistory,
    getRecentSearchesByType,
    getMostRecentSearch,
    isAuthenticated,
    loading
  };
}
