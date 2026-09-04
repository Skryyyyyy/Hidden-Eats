'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  MapPin,
  Radio,
  Bookmark,
  Settings,
  ChevronDown,
  Clapperboard,
  Sparkles
} from 'lucide-react';

import MultiLangSwitcher from '@/components/MultiLangSwitcher';
import GoogleTranslateWidget from '@/components/GoogleTranslateWidget';
import { useLanguage } from '@/context/LanguageContext';

export default function ExplorerNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const explorerNavItems = [
    { href: '/explorer', label: t('exploreSpots'), icon: Compass },
    { href: '/explorer/map', label: t('inAppMap'), icon: MapPin },
    { href: '/explorer/radar', label: t('liveRadar'), icon: Radio },
    { href: '/explorer/reels', label: t('foodieReels'), icon: Clapperboard },
    { href: '/explorer/submit-gem', label: '+ Submit Gem', icon: Sparkles },
    { href: '/explorer/collections', label: t('collections'), icon: Bookmark },
  ];

  return (
    <nav className="h-[72px] w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-2xl bg-[#08090d]/85 border-b border-white/[0.08] text-white shadow-2xl transition-colors">
      {/* Left Group: Location + Logo */}
      <div className="flex items-center gap-6 sm:gap-8">
        {/* Location Pill */}
        <Link 
          href="/explorer"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-[#f59e0b]/15 flex items-center justify-center text-[#f59e0b]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1 text-[11px] font-black tracking-wider uppercase text-white group-hover:text-[#f59e0b] transition-colors">
              CHENNAI <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-[#f59e0b] transition-colors" />
            </div>
            <span className="text-[9px] text-white/50 tracking-wide font-medium">Tamil Nadu</span>
          </div>
        </Link>

        {/* Brand Logo */}
        <Link href="/explorer" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-wider uppercase text-white group-hover:text-[#f59e0b] transition-colors">
            Hidden<span className="text-[#f59e0b]">Eats</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30">
            Explorer
          </span>
        </Link>
      </div>

      {/* Right Group: Nav Pill + Prominent Multi-Language Switcher + Settings Icon */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden lg:flex items-center bg-white/[0.03] rounded-full p-1 border border-white/[0.08] backdrop-blur-xl">
          {explorerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/explorer');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] font-black tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black shadow-lg shadow-[#f59e0b]/25 font-black'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Prominent Global Multi-Language Switcher Dropdown */}
        <MultiLangSwitcher />

        {/* Settings Link */}
        <Link 
          href="/explorer/settings"
          className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-all border border-white/[0.08] text-white/80 hover:text-[#f59e0b] flex items-center justify-center hover:scale-105 active:scale-95"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}
