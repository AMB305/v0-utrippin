import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

/**
 * CriticalBugFixes component handles common application-wide bug fixes
 * and improvements for navigation, authentication, and user experience
 */
const CriticalBugFixes = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Fix: Handle browser back button and navigation state
    const handlePopState = () => {
      // Clear any stale navigation state
      if (location.state && (location.state as any).from) {
        window.history.replaceState(null, '', location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location]);

  useEffect(() => {
    // Fix: Handle authentication redirects properly
    if (!loading) {
      const currentPath = location.pathname;
      const isAuthPage = currentPath === '/auth';
      const isEmailVerification = currentPath === '/email-verification';
      const isPublicPage = [
        '/', '/flights', '/hotels', '/packages', '/experiences', 
        '/cruises', '/deals', '/blog', '/destinations', '/categories',
        '/florida', '/greece', '/travel-tips', '/budget-travel',
        '/family-travel', '/solo-travel', '/melanin', '/widgets'
      ].some(path => currentPath.startsWith(path));

      // Redirect authenticated users away from auth page
      if (user && isAuthPage) {
        const redirectTo = (location.state as any)?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      }

      // Redirect unauthenticated users from protected pages
      if (!user && !isPublicPage && !isAuthPage && !isEmailVerification) {
        navigate('/auth', { 
          state: { from: location },
          replace: true 
        });
      }
    }
  }, [user, loading, location, navigate]);

  useEffect(() => {
    // Fix: Handle URL encoding issues in search parameters
    const params = new URLSearchParams(location.search);
    let needsUpdate = false;
    const updates = new URLSearchParams();

    params.forEach((value, key) => {
      try {
        const decoded = decodeURIComponent(value);
        if (decoded !== value) {
          updates.set(key, decoded);
          needsUpdate = true;
        } else {
          updates.set(key, value);
        }
      } catch (e) {
        // If decoding fails, keep original value
        updates.set(key, value);
      }
    });

    if (needsUpdate) {
      const newSearch = updates.toString();
      navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`, { 
        replace: true 
      });
    }
  }, [location.search, navigate, location.pathname]);

  useEffect(() => {
    // Fix: Handle language persistence
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && document.documentElement.lang !== savedLanguage) {
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  useEffect(() => {
    // Fix: Handle currency persistence
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
      // Dispatch event for components that need to react to currency changes
      window.dispatchEvent(new CustomEvent('currencyChanged', { 
        detail: { currency: savedCurrency } 
      }));
    }
  }, []);

  useEffect(() => {
    // Fix: Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Show user-friendly error for auth-related rejections
      if (event.reason?.message?.includes('auth') || 
          event.reason?.message?.includes('session')) {
        toast({
          title: "Session expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      }
      
      // Prevent default browser behavior
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, [toast]);

  useEffect(() => {
    // Fix: Handle network errors and offline state
    const handleOnline = () => {
      toast({
        title: "Connection restored",
        description: "You're back online!",
      });
    };

    const handleOffline = () => {
      toast({
        title: "Connection lost",
        description: "Some features may not work while offline.",
        variant: "destructive",
        duration: 0, // Don't auto-dismiss
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  useEffect(() => {
    // Fix: Handle focus management for accessibility
    const handleFocusVisible = () => {
      document.body.classList.add('focus-visible');
    };

    const handleFocusNotVisible = () => {
      document.body.classList.remove('focus-visible');
    };

    // Add focus-visible class when user is using keyboard navigation
    document.addEventListener('keydown', handleFocusVisible);
    document.addEventListener('mousedown', handleFocusNotVisible);

    return () => {
      document.removeEventListener('keydown', handleFocusVisible);
      document.removeEventListener('mousedown', handleFocusNotVisible);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default CriticalBugFixes;
