import { useState, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export interface LocationError {
  code: number;
  message: string;
}

export const useLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);

  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        const error = {
          code: 0,
          message: 'Geolocation is not supported by this device'
        };
        setError(error);
        setIsLoading(false);
        reject(error);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocode to get location name
            const locationName = await reverseGeocode(latitude, longitude);
            
            const locationData: LocationData = {
              latitude,
              longitude,
              locationName
            };

            setIsLoading(false);
            resolve(locationData);
          } catch (err) {
            console.error('Error getting location name:', err);
            // Still resolve with coordinates even if reverse geocoding fails
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setIsLoading(false);
            resolve(locationData);
          }
        },
        (err) => {
          const error: LocationError = {
            code: err.code,
            message: getLocationErrorMessage(err.code)
          };
          setError(error);
          setIsLoading(false);
          reject(error);
        },
        options
      );
    });
  }, []);

  const reverseGeocode = async (lat: number, lng: number): Promise<string | undefined> => {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      
      // Format the location name from the most specific to least specific
      const parts = [];
      if (data.locality) parts.push(data.locality);
      if (data.city && data.city !== data.locality) parts.push(data.city);
      if (data.principalSubdivision) parts.push(data.principalSubdivision);
      if (data.countryName) parts.push(data.countryName);
      
      return parts.length > 0 ? parts.join(', ') : undefined;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return undefined;
    }
  };

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Please enable location services in your settings to get suggestions near you.';
      case 2:
        return 'Unable to determine your location. Please try again.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'Unable to access your location. Please enable location services.';
    }
  };

  return {
    getCurrentLocation,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
