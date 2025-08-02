import React from 'react';
import { AlertCircle, WifiOff, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorState {
  type: 'network' | 'api' | 'no_results' | 'invalid_params' | 'rate_limit';
  message: string;
  details?: string;
  retryable?: boolean;
}

interface HotelErrorHandlerProps {
  error: ErrorState;
  onRetry?: () => void;
  onModifySearch?: () => void;
  className?: string;
}

export function HotelErrorHandler({ error, onRetry, onModifySearch, className }: HotelErrorHandlerProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <WifiOff className="h-5 w-5" />;
      case 'no_results':
        return <MapPin className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getErrorVariant = () => {
    switch (error.type) {
      case 'no_results':
        return 'default';
      case 'rate_limit':
        return 'destructive';
      default:
        return 'destructive';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Connection Error';
      case 'api':
        return 'Search Unavailable';
      case 'no_results':
        return 'No Hotels Found';
      case 'invalid_params':
        return 'Invalid Search Parameters';
      case 'rate_limit':
        return 'Too Many Requests';
      default:
        return 'Error';
    }
  };

  const getSuggestions = () => {
    switch (error.type) {
      case 'no_results':
        return [
          'Try expanding your date range',
          'Consider nearby destinations',
          'Adjust your filters (price, amenities, etc.)',
          'Check if your dates are during a major event'
        ];
      case 'network':
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the problem persists'
        ];
      case 'invalid_params':
        return [
          'Check your check-in and check-out dates',
          'Ensure dates are in the future',
          'Verify guest count is valid'
        ];
      case 'rate_limit':
        return [
          'Please wait a moment before searching again',
          'Try reducing the frequency of your searches'
        ];
      default:
        return ['Please try again or contact support'];
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Alert variant={getErrorVariant()}>
        <div className="flex items-start space-x-3">
          {getErrorIcon()}
          <div className="flex-1">
            <h4 className="font-semibold">{getErrorTitle()}</h4>
            <AlertDescription className="mt-1">
              {error.message}
              {error.details && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {error.details}
                </div>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Suggestions */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h5 className="font-medium text-sm mb-2">Suggestions:</h5>
        <ul className="text-sm text-muted-foreground space-y-1">
          {getSuggestions().map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {error.retryable !== false && onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
        {onModifySearch && (
          <Button onClick={onModifySearch}>
            Modify Search
          </Button>
        )}
      </div>
    </div>
  );
}
