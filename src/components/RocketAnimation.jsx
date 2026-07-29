import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function RocketAnimation({ active, onComplete }) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Dark overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Launch Trail Beam */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: '100vh', opacity: [0, 1, 0.8, 0] }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute bottom-0 w-8 bg-gradient-to-t from-cyan-500 via-purple-500 to-transparent blur-md"
      />

      {/* Flying Rocket Icon */}
      <motion.div
        initial={{ y: '80vh', scale: 0.6, opacity: 0, rotate: 0 }}
        animate={{ 
          y: '-120vh', 
          scale: [0.6, 1.4, 1.8, 2], 
          opacity: [0, 1, 1, 0],
          rotate: [-2, 2, -1, 0]
        }}
        transition={{ duration: 2.2, ease: [0.15, 0.85, 0.35, 1.2] }}
        onAnimationComplete={onComplete}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative p-6 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_80px_rgba(6,182,212,0.9)] animate-pulse">
          <Rocket className="w-20 h-20 text-white transform -rotate-45" />
          
          {/* Thruster Flame FX */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-10 h-20 bg-gradient-to-b from-orange-400 via-yellow-300 to-transparent rounded-full blur-sm animate-bounce" />
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-16 h-28 bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent rounded-full blur-md opacity-80" />
        </div>

        {/* Speed Particles */}
        <div className="mt-4 text-cyan-300 font-mono font-bold tracking-widest text-lg drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">
          LAUNCHING TO CLOUD...
        </div>
      </motion.div>
    </div>
  );
}
