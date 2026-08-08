'use client';

import React, { useState, useEffect } from 'react';

export default function FlashcardSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    // Start fading out after 1.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 1500);

    // Remove from DOM completely after 2.3 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!showSplash) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#E93B3B] flex flex-col items-center justify-center transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${fadeSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="text-white text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-5xl md:text-7xl font-black tracking-[0.15em] uppercase drop-shadow-xl animate-pulse">
          Hidden Eats
        </h1>
        <p className="text-white/90 font-medium tracking-[0.2em] uppercase text-xs md:text-sm">
          Skip the chains. Eat like a local.
        </p>
      </div>
    </div>
  );
}
