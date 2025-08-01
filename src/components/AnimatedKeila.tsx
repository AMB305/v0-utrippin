// src/components/AnimatedKeila.tsx

import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedKeila = () => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.img 
          src="/lovable-uploads/444cd76d-946f-4ff4-b428-91e07589acd6.png" 
          alt="Keila AI Travel Assistant" 
          className="w-12 h-12 drop-shadow-[0_8px_25px_rgba(168,85,247,0.4)]"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Glowing pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-400 opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Sparkle effects */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        
        <motion.div
          className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full"
          animate={{
            scale: [0, 1, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>
      
      {/* Speech bubble animation */}
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-600 font-medium whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          y: [10, 0, 0, -5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 4,
        }}
      >
        Ready to help! ✨
      </motion.div>
    </div>
  );
};