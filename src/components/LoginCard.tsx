// src/components/LoginCard.tsx

import React from 'react';

export default function LoginCard() {
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

        {/* Email Input */}
        <div className="flex items-center bg-[#1b2945] rounded-lg px-4 py-2 mb-4">
          <input
            type="email"
            className="bg-transparent w-full outline-none text-sm text-white placeholder-gray-500"
            placeholder="Email"
          />
          <button className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-full hover:scale-105 transition">
            ➝
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <input type="checkbox" className="mr-2 accent-purple-500" />
          <label>Remember me</label>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="mx-2 text-xs text-gray-400">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>

        {/* Social Buttons */}
        <button className="flex items-center justify-between bg-[#1b2945] w-full px-4 py-2 rounded-lg mb-3 text-sm hover:bg-[#233652] transition">
          <div className="flex items-center">
            <img src="https://img.icons8.com/color/16/google-logo.png" alt="Google" className="mr-2" />
            Continue with Google
          </div>
          <span>➝</span>
        </button>

        <button className="flex items-center justify-between bg-[#1b2945] w-full px-4 py-2 rounded-lg mb-6 text-sm hover:bg-[#233652] transition">
          <div className="flex items-center">
            <img src="https://img.icons8.com/ios-glyphs/16/github.png" alt="GitHub" className="mr-2 invert" />
            Continue with GitHub
          </div>
          <span>➝</span>
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          Don't have an account? <a href="#" className="text-purple-400 underline hover:text-purple-300">Create Account</a>
        </p>
      </div>
    </div>
  );
}