'use client';

import Link from 'next/link';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Compass, Building2, ArrowRight } from 'lucide-react';

export default function LoginRoleChooserPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 font-sans antialiased transition-colors duration-500 ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#111111] text-white'
    }`}>
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-[1440px] mx-auto w-full animate-fade-in">
        <HiddenEatsLogo />
        <Link href="/" className={`font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
          isLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
        }`}>
          ← Back to Home
        </Link>
      </header>

      {/* Main Portal Selection Body */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-16">
          <span className={`font-sans text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded border inline-block mb-4 shadow-sm ${
            isLight ? 'bg-black/5 text-black border-black/10' : 'bg-[#f8b11c]/10 text-[#f8b11c] border-[#f8b11c]/20'
          }`}>
            Hidden Eats Access Portal
          </span>
          <h1 className={`font-display text-4xl sm:text-5xl uppercase tracking-wide ${isLight ? 'text-black/90' : 'text-white/90'}`}>
            Welcome to Hidden Eats
          </h1>
          <p className={`font-sans text-sm md:text-base font-semibold max-w-md mx-auto mt-4 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            Select your account type to proceed to your dedicated portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Food Explorer / Diner */}
          <Link
            href="/login/user"
            className={`rounded-2xl p-8 border transition-all group cursor-pointer ${
              isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-[#1c1c1c] border-white/10 hover:border-[#f8b11c]/50'
            }`}
          >
            <div className={`w-14 h-14 rounded flex items-center justify-center mb-8 border ${
              isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-[#f8b11c]/10 border-[#f8b11c]/20 text-[#f8b11c]'
            }`}>
              <Compass className="w-7 h-7" />
            </div>

            <span className={`font-sans text-[10px] uppercase font-bold tracking-widest block mb-2 ${
              isLight ? 'text-black/60' : 'text-[#f8b11c]'
            }`}>
              FOR DINERS & FOOD LOVERS
            </span>
            <h2 className={`font-display text-2xl md:text-3xl tracking-wide uppercase mb-3 flex items-center justify-between ${isLight ? 'text-black/90' : 'text-white/90'}`}>
              <span>Food Explorer</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-black' : 'text-[#f8b11c]'
              }`} />
            </h2>
            <p className={`font-sans text-sm font-medium leading-relaxed mb-8 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
              Search hidden gems, unlock secret off-menu items, save food collections, and reserve tables.
            </p>

            <div className={`pt-5 border-t flex items-center font-sans font-bold text-xs uppercase tracking-wider transition-colors ${
              isLight ? 'border-black/10 text-black group-hover:text-black/70' : 'border-white/10 text-[#f8b11c] group-hover:text-[#e0a019]'
            }`}>
              Sign In as Diner →
            </div>
          </Link>

          {/* Card 2: Restaurant Partner / Owner */}
          <Link
            href="/login/partner"
            className={`rounded-2xl p-8 border transition-all group cursor-pointer ${
              isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-[#1c1c1c] border-white/10 hover:border-[#E93B3B]/50'
            }`}
          >
            <div className={`w-14 h-14 rounded flex items-center justify-center mb-8 border ${
              isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-[#E93B3B]/10 border-[#E93B3B]/20 text-[#E93B3B]'
            }`}>
              <Building2 className="w-7 h-7" />
            </div>

            <span className={`font-sans text-[10px] uppercase font-bold tracking-widest block mb-2 ${
              isLight ? 'text-black/60' : 'text-[#E93B3B]'
            }`}>
              FOR RESTAURANTS & CAFES
            </span>
            <h2 className={`font-display text-2xl md:text-3xl tracking-wide uppercase mb-3 flex items-center justify-between ${isLight ? 'text-black/90' : 'text-white/90'}`}>
              <span>Restaurant Partner</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-black' : 'text-[#E93B3B]'
              }`} />
            </h2>
            <p className={`font-sans text-sm font-medium leading-relaxed mb-8 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
              Manage Place ID, publish secret menu dishes, confirm table reservations, and track diner traffic.
            </p>

            <div className={`pt-5 border-t flex items-center font-sans font-bold text-xs uppercase tracking-wider transition-colors ${
              isLight ? 'border-black/10 text-black group-hover:text-black/70' : 'border-white/10 text-[#E93B3B] group-hover:text-[#c42f2f]'
            }`}>
              Sign In as Partner →
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center py-4 font-sans text-xs uppercase tracking-widest font-bold ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`}>
        Hidden Eats — Dual Access Portal
      </footer>
    </div>
  );
}
