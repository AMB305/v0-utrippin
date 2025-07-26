// src/components/LoginCard.tsx

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    
    try {
      if (isSignUp) {
        if (!password || password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }
        
        const { error } = await signUp(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please check your email to verify your account.');
        }
      } else {
        if (!password) {
          toast.error('Please enter your password');
          return;
        }
        
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b1120] to-[#1a2a41] p-4 text-white">
      <div className="bg-[#101c33] rounded-2xl shadow-lg p-8 w-full max-w-md relative border border-purple-800/30 backdrop-blur-md">
        
        {/* --- Keila Bot Peeking from the Top --- */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2">
          <img 
            src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
            alt="Keila Bot" 
            className="w-28 h-28 animate-float drop-shadow-[0_5px_15px_rgba(168,85,247,0.3)]"
          />
        </div>

        <div className="mt-8">
            {/* --- New Headline --- */}
            <h2 className="text-2xl font-bold text-center mb-2 leading-tight">
                Welcome to Keila Bot!
            </h2>
            <p className="text-center text-sm text-gray-400 mb-6">
                Let's plan your perfect Staycation or Vacation together!
            </p>
        </div>

        <form onSubmit={handleEmailAuth}>
          {/* Email Input */}
          <div className="flex items-center bg-[#1b2945] rounded-lg px-4 py-2 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
              placeholder="Email"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center bg-[#1b2945] rounded-lg px-4 py-2 mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
              placeholder="Password"
              disabled={loading}
            />
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {isSignUp && (
            <div className="flex items-center bg-[#1b2945] rounded-lg px-4 py-2 mb-4">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
                placeholder="Confirm Password"
                disabled={loading}
              />
            </div>
          )}

          {/* Remember Me */}
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 accent-purple-500" 
            />
            <label>Remember me</label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg mb-4 hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="mx-2 text-xs text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        {/* Social Buttons */}
        <button 
          onClick={handleGoogleAuth}
          disabled={loading}
          className="flex items-center justify-between bg-[#1b2945] w-full px-4 py-2 rounded-lg mb-6 text-sm hover:bg-[#233652] transition disabled:opacity-50"
        >
          <div className="flex items-center">
            <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" className="mr-2" />
            Continue with Google
          </div>
          <span>➝</span>
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-400 underline hover:text-purple-300"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </div>
    </div>
  );
}