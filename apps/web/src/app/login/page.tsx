'use client';

import Link from 'next/link';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Compass, Building2, ArrowRight } from 'lucide-react';

export default function LoginRoleChooserPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FFF8F1] text-[#1F2937]' : 'bg-[#05070D] text-white'
    }`}>
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full animate-fade-in">
        <HiddenEatsLogo />
        <Link href="/" className={`text-label text-xs transition-colors ${
          isLight ? 'text-[#6B7280] hover:text-[#D62828]' : 'text-[#888888] hover:text-[#FFB703]'
        }`}>
          ← Back to Home
        </Link>
      </header>

      {/* Main Portal Selection Body */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-16">
          <span className={`text-label text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border inline-block mb-4 shadow-sm ${
            isLight ? 'bg-[#FFF3E8] text-[#D62828] border-[#D62828]/20' : 'bg-[#261c07] text-[#FFB703] border-[#3a2c0c]'
          }`}>
            Hidden Eats Access Portal
          </span>
          <h1 className={`text-hero text-4xl sm:text-6xl ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
            Welcome to Hidden Eats
          </h1>
          <p className="text-body text-sm text-[#6B7280] dark:text-[#aaaaaa] max-w-md mx-auto mt-4">
            Select your account type to proceed to your dedicated portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Food Explorer / Diner */}
          <Link
            href="/login/user"
            className={`border rounded-3xl p-8 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-xl ${
              isLight ? 'bg-white border-black/8 hover:border-[#D62828]/50' : 'bg-[#131A2C] border-[#23314a] hover:border-[#FFB703]/50'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${
              isLight ? 'bg-[#FFF3E8] text-[#D62828] shadow-[#D62828]/20' : 'bg-[#261c07] text-[#FFB703] shadow-[#FFB703]/20'
            }`}>
              <Compass className="w-7 h-7" />
            </div>

            <span className={`text-label text-[10px] uppercase tracking-widest block mb-2 ${
              isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
            }`}>
              FOR DINERS & FOOD LOVERS
            </span>
            <h2 className={`text-h2 text-2xl mb-3 flex items-center justify-between ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span>Food Explorer</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
              }`} />
            </h2>
            <p className="text-body text-xs text-[#6B7280] dark:text-[#aaaaaa] leading-relaxed mb-8">
              Search hidden gems, unlock secret off-menu items, save food collections, and reserve tables.
            </p>

            <div className={`pt-5 border-t flex items-center text-label text-xs uppercase tracking-wider font-bold transition-colors ${
              isLight ? 'border-black/5 text-[#D62828] group-hover:text-[#B91C1C]' : 'border-[#23314a] text-[#FFB703] group-hover:text-[#d97706]'
            }`}>
              Sign In as Diner →
            </div>
          </Link>

          {/* Card 2: Restaurant Partner / Owner */}
          <Link
            href="/login/partner"
            className={`border rounded-3xl p-8 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm hover:shadow-xl ${
              isLight ? 'bg-white border-black/8 hover:border-[#D62828]/50' : 'bg-[#131A2C] border-[#23314a] hover:border-[#FFB703]/50'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${
              isLight ? 'bg-[#FFF3E8] text-[#D62828] shadow-[#D62828]/20' : 'bg-[#261c07] text-[#FFB703] shadow-[#FFB703]/20'
            }`}>
              <Building2 className="w-7 h-7" />
            </div>

            <span className={`text-label text-[10px] uppercase tracking-widest block mb-2 ${
              isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
            }`}>
              FOR RESTAURANTS & CAFES
            </span>
            <h2 className={`text-h2 text-2xl mb-3 flex items-center justify-between ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span>Restaurant Partner</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
              }`} />
            </h2>
            <p className="text-body text-xs text-[#6B7280] dark:text-[#aaaaaa] leading-relaxed mb-8">
              Manage Place ID, publish secret menu dishes, confirm table reservations, and track diner traffic.
            </p>

            <div className={`pt-5 border-t flex items-center text-label text-xs uppercase tracking-wider font-bold transition-colors ${
              isLight ? 'border-black/5 text-[#D62828] group-hover:text-[#B91C1C]' : 'border-[#23314a] text-[#FFB703] group-hover:text-[#d97706]'
            }`}>
              Sign In as Restaurant Owner →
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-label text-xs text-[#6B7280] dark:text-[#888888] animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Hidden Eats — Dual Access Portal
      </footer>
    </div>
  );
}
