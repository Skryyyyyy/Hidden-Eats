'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function GlobalThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const pathname = usePathname();

  // Hide the theme toggle on the landing page
  if (pathname === '/') return null;

  return (
    <button 
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110 active:scale-95 ${
        isLight ? 'bg-white text-black shadow-black/10 border border-black/10' : 'bg-[#111] text-white shadow-white/10 border border-white/10'
      }`}
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </button>
  );
}
