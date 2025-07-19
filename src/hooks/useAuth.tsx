import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isEmailVerified: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; needsVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check email verification status
        const user = session?.user;
        if (user) {
          // Google users don't need email verification
          const isGoogleUser = user.app_metadata?.provider === 'google';
          const emailConfirmed = !!user.email_confirmed_at;
          setIsEmailVerified(isGoogleUser || emailConfirmed);
          
          setTimeout(() => {
            checkAdminStatus(user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsEmailVerified(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      const user = session?.user;
      if (user) {
        // Google users don't need email verification
        const isGoogleUser = user.app_metadata?.provider === 'google';
        const emailConfirmed = !!user.email_confirmed_at;
        setIsEmailVerified(isGoogleUser || emailConfirmed);
        
        checkAdminStatus(user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/email-verification`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            email_confirm: true
          }
        }
      });

      if (error) {
        // Handle specific error types
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          return { 
            error: { 
              ...error, 
              message: 'An account with this email already exists. Please sign in instead.' 
            } 
          };
        }
        return { error };
      }

      // Send custom verification email using our edge function
      if (data.user && !data.user.email_confirmed_at) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
            body: {
              email,
              confirmationUrl: `${window.location.origin}/email-verification?redirect_to=${encodeURIComponent('/profile-setup')}`,
              isSignup: true
            }
          });
          
          if (emailError) {
            console.error('Failed to send verification email:', emailError);
          }
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Don't fail the signup if email fails
        }
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Check if user needs email verification
    if (!error && data.user && !data.user.email_confirmed_at) {
      // Sign out the user since they haven't verified their email
      await supabase.auth.signOut();
      return { 
        error: null, 
        needsVerification: true 
      };
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isEmailVerified,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};