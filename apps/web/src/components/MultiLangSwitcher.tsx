'use client';

import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, SupportedLanguage } from '@/context/LanguageContext';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
];

export default function MultiLangSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white transition-all text-xs font-bold shadow-lg"
      >
        <Globe className="w-4 h-4 text-[#f8b11c]" />
        <span>{activeOption.flag}</span>
        <span className="font-sans font-extrabold uppercase tracking-wider">{activeOption.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 mt-2 w-56 bg-[#141414] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 py-1"
            >
              <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest text-[#f8b11c] border-b border-white/10">
                Global Languages (7 Languages)
              </div>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-xs transition-colors hover:bg-white/10 ${
                    language === lang.code ? 'bg-[#f8b11c]/10 text-[#f8b11c] font-bold' : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{lang.flag}</span>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="font-bold">{lang.nativeName}</span>
                      <span className="text-[10px] text-gray-500">{lang.name}</span>
                    </div>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-[#f8b11c]" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
