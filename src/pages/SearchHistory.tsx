import React from 'react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BuildingOfficeIcon,
  PaperAirplaneIcon,
  ArchiveBoxIcon,
  TruckIcon,
  HomeIcon,
  ArrowLeftIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const iconMap = {
  hotels: BuildingOfficeIcon,
  flights: PaperAirplaneIcon,
  packages: ArchiveBoxIcon,
  cars: TruckIcon,
  cruises: HomeIcon,
};

export default function SearchHistory() {
  const navigate = useNavigate();
  const { searchHistory, clearHistory, isAuthenticated } = useSearchHistory();

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy h:mm a');
    } catch {
      return dateStr;
    }
  };

  const getSearchSummary = (search: any) => {
    const parts = [];
    
    if (search.checkInDate && search.checkOutDate) {
      parts.push(`${formatDate(search.checkInDate)} - ${formatDate(search.checkOutDate)}`);
    } else if (search.checkInDate) {
      parts.push(formatDate(search.checkInDate));
    }
    
    if (search.pickupDate && search.dropoffDate) {
      parts.push(`${formatDateTime(search.pickupDate)} - ${formatDateTime(search.dropoffDate)}`);
    }
    
    if (search.guests && search.guests > 1) {
      parts.push(`${search.guests} guests`);
    }
    
    if (search.rooms && search.rooms > 1) {
      parts.push(`${search.rooms} rooms`);
    }
    
    if (search.travelers && search.travelers > 1) {
      parts.push(`${search.travelers} travelers`);
    }
    
    return parts.join(' • ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target-44"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Search History</h1>
                <p className="text-xs md:text-sm text-gray-500">
                  {isAuthenticated ? 'Synced across all your devices' : 'Stored locally on this device'}
                </p>
              </div>
            </div>
            
            {searchHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-target-44"
                aria-label="Clear all search history"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {searchHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <PaperAirplaneIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No search history yet</h3>
            <p className="text-gray-500 mb-6">
              Start searching for hotels, flights, and more to see your history here.
            </p>
            <button
              onClick={() => navigate('/plane-test')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {searchHistory.map((search) => {
              const IconComponent = iconMap[search.searchType] || BuildingOfficeIcon;
              
              return (
                <div
                  key={search.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    // Navigate back to search page with this search data
                    navigate('/plane-test', { state: { restoreSearch: search } });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {search.searchType}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {format(new Date(search.createdAt), 'MMM dd, h:mm a')}
                          </span>
                        </div>
                        
                        <p className="text-lg text-gray-800 mb-1">
                          {search.destination}
                        </p>
                        
                        {getSearchSummary(search) && (
                          <p className="text-sm text-gray-600">
                            {getSearchSummary(search)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <PaperAirplaneIcon className="h-5 w-5 text-gray-400 rotate-45 flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section */}
      {!isAuthenticated && searchHistory.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Want to sync your search history?</h4>
            <p className="text-sm text-blue-700 mb-3">
              Sign in to save your search history across all your devices and never lose your travel plans.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
