import React from 'react';

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse-glow" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[140px] animate-float" />
      <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[500px] rounded-full bg-pink-600/15 blur-[130px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />
    </div>
  );
}
