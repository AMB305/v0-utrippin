import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut } from 'lucide-react';

export const AuthStatus = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <a href="/auth" className="text-white hover:bg-gray-800">
            Sign In
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-white">
        <User className="h-4 w-4" />
        <span className="text-sm">{user.email}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => signOut()}
        className="text-white hover:bg-gray-800"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};