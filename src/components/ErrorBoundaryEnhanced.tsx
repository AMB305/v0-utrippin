import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
}

export class ErrorBoundaryEnhanced extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error for debugging (you might want to send to error reporting service)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {this.state.error?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {this.state.retryCount < this.maxRetries ? (
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Maximum retry attempts reached
                </p>
              )}

              <Button 
                onClick={this.handleGoHome}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Technical Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: any) => void
) => {
  return (props: P) => (
    <ErrorBoundaryEnhanced fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundaryEnhanced>
  );
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const handleError = (error: Error) => {
    // You can customize this to integrate with error reporting services
    console.error('Handled error:', error);
    
    // Optionally show user-friendly error message
    // You could integrate with a toast system here
    throw error; // Re-throw to trigger error boundary
  };

  return { handleError };
};