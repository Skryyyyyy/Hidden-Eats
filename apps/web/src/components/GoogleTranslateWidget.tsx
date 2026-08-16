'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

interface LanguageOption {
  code: SupportedLanguage | string;
  name: string;
  native: string;
  flag: string;
}

const EXTENDED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
];

export default function GoogleTranslateWidget() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>(language);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = EXTENDED_LANGUAGES.find((l) => l.code === selectedCode) || EXTENDED_LANGUAGES[0];

  useEffect(() => {
    setSelectedCode(language);
  }, [language]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // 1. Define global init callback for Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // 2. Inject script
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setSelectedCode(langCode);
    setIsOpen(false);

    // Update global context for 0ms instant translation
    if (['en', 'ta', 'hi', 'es', 'fr', 'ar', 'ja'].includes(langCode)) {
      setLanguage(langCode as SupportedLanguage);
    }

    // Set Google Translate cookie
    document.cookie = `googtrans=/en/${langCode}; path=/`;

    // Trigger Google combo select if initialized
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left shrink-0 z-50">
      {/* Target container for Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      {/* Modernized Glassmorphism Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-black/60 to-[#1e1e1e]/60 hover:from-black/80 hover:to-[#2a2a2a]/80 border border-white/15 hover:border-[#f8b11c]/50 backdrop-blur-xl shadow-lg transition-all duration-300 group cursor-pointer text-xs font-bold text-white"
        aria-label="Select Language"
      >
        <div className="w-5 h-5 rounded-full bg-[#f8b11c]/15 border border-[#f8b11c]/30 flex items-center justify-center text-[#f8b11c]">
          <Globe className="w-3 h-3 transition-transform group-hover:rotate-45 duration-500" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-sm">{currentLang.flag}</span>
          <span className="font-semibold text-white tracking-wide text-xs">
            {currentLang.name} <span className="text-white/60 font-normal">({currentLang.native})</span>
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ml-1 ${
            isOpen ? 'rotate-180 text-[#f8b11c]' : 'group-hover:text-white'
          }`}
        />
      </button>

      {/* Modern Glassmorphism Popup Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#0c0c0e]/95 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden animate-scale-in z-50">
          <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f8b11c] flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> Select Language (100+)
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">
              Auto Translate
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {EXTENDED_LANGUAGES.map((lang) => {
              const isSelected = selectedCode === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#f8b11c]/20 to-[#f8b11c]/5 text-white font-bold border border-[#f8b11c]/40'
                      : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold text-xs text-white">{lang.name}</span>
                      <span className="text-[10px] text-white/50">{lang.native}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#f8b11c]/20 border border-[#f8b11c]/50 flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#f8b11c]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
