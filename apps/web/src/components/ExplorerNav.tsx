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
  Clapperboard
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
    { href: '/explorer/collections', label: t('collections'), icon: Bookmark },
  ];

  return (
    <nav className="h-[72px] w-full px-6 flex items-center justify-between bg-[#3E0A0E] text-white">
      {/* Left Group: Location + Logo */}
      <div className="flex items-center gap-8">
        
        {/* Location */}
        <Link 
          href="/explorer"
          className="flex items-start gap-2 text-left hover:opacity-80 transition-opacity"
        >
          <MapPin className="w-4 h-4 text-[#FFB703] mt-0.5" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
              CHENNAI <ChevronDown className="w-3 h-3" />
            </div>
            <span className="text-[10px] text-white/70">Tamil Nadu</span>
          </div>
        </Link>

        {/* Logo */}
        <Link href="/explorer" className="text-xl font-bold tracking-wide">
          Hidden Eats
        </Link>
      </div>

      {/* Right Group: Nav Pill + Prominent Multi-Language Switcher + Settings Icon */}
      <div className="hidden xl:flex items-center gap-3">
        <div className="flex items-center bg-black/20 rounded-full p-1 border border-black/20">
          {explorerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/explorer');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  isActive
                    ? 'bg-[#FFB703] text-black shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
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

        {/* Settings Link on the right side next to Collections */}
        <Link 
          href="/explorer/settings"
          className="p-2.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors border border-white/10 text-white/80 hover:text-white flex items-center justify-center"
          title="Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}
