'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';

export type Language = 'en' | 'ta';

interface LanguageToggleProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export default function LanguageToggle({
  currentLang = 'en',
  onLanguageChange,
}: LanguageToggleProps) {
  const [lang, setLang] = useState<Language>(currentLang);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'ta' : 'en';
    setLang(nextLang);
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 text-white/80 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
      title="Switch Language / மொழியை மாற்றுக"
    >
      <Globe className="w-3.5 h-3.5 text-[#f8b11c]" />
      <span>{lang === 'en' ? 'ENG' : 'தமிழ்'}</span>
    </button>
  );
}
