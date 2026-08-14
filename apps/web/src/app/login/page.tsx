'use client';

import Link from 'next/link';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Compass, Building2, ArrowRight, Truck } from 'lucide-react';

export default function LoginRoleChooserPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 font-sans antialiased transition-colors duration-500 relative overflow-hidden ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#111111] text-white'
    }`}>
      {/* Background Decorators */}
      {!isLight && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#671212]/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f8b11c]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        </>
      )}

      {/* Header */}
      <header className="flex items-center justify-between w-full animate-fade-in relative z-10">
        <HiddenEatsLogo />
        <Link href="/" className={`font-sans text-[10px] uppercase tracking-widest font-bold transition-colors ${
          isLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
        }`}>
          ← Back to Home
        </Link>
      </header>

      {/* Main Portal Selection Body */}
      <main className="max-w-4xl mx-auto w-full my-auto py-12 animate-fade-in relative z-10" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-16">
          <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border inline-block mb-4 shadow-xl ${
            isLight ? 'bg-black/5 text-black border-black/10' : 'bg-[#f8b11c]/10 text-[#f8b11c] border-[#f8b11c]/20'
          }`}>
            Hidden Eats Access Portal
          </span>
          <h1 className={`font-display text-4xl sm:text-5xl uppercase tracking-tight leading-[0.9] mt-2 ${isLight ? 'text-black/90' : 'text-white'}`}>
            Welcome to Hidden Eats
          </h1>
          <p className={`font-sans text-xs md:text-sm font-medium mt-4 max-w-md mx-auto leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            Select your account type to proceed to your dedicated portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Food Explorer / Diner */}
          <Link
            href="/login/user"
            className={`rounded-3xl p-8 border shadow-xl transition-all group cursor-pointer backdrop-blur-xl ${
              isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-black/40 border-white/10 hover:border-[#f8b11c]/50'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border shadow-md ${
              isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-[#f8b11c] border-[#f8b11c]/50 text-black'
            }`}>
              <Compass className="w-8 h-8" />
            </div>

            <span className={`text-[10px] uppercase font-bold tracking-widest block mb-2 ${
              isLight ? 'text-black/60' : 'text-[#f8b11c]'
            }`}>
              FOR DINERS & FOOD LOVERS
            </span>
            <h2 className={`font-display text-3xl tracking-wide uppercase mb-3 flex items-center justify-between ${isLight ? 'text-black/90' : 'text-white/90'}`}>
              <span>Food Explorer</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-black' : 'text-[#f8b11c]'
              }`} />
            </h2>
            <p className={`font-sans text-xs font-medium leading-relaxed mb-8 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
              Search hidden gems, unlock secret off-menu items, save food collections, and reserve tables.
            </p>

            <div className={`pt-5 border-t flex items-center font-sans font-bold text-[10px] uppercase tracking-widest transition-colors ${
              isLight ? 'border-black/10 text-black group-hover:text-black/70' : 'border-white/10 text-[#f8b11c] group-hover:text-[#e0a019]'
            }`}>
              Sign In as Diner →
            </div>
          </Link>

          {/* Card 2: Restaurant Partner / Owner */}
          <Link
            href="/login/partner"
            className={`rounded-3xl p-8 border shadow-xl transition-all group cursor-pointer backdrop-blur-xl ${
              isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-black/40 border-white/10 hover:border-white/30'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border shadow-md ${
              isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-white/10 border-white/20 text-white'
            }`}>
              <Building2 className="w-8 h-8" />
            </div>

            <span className={`text-[10px] uppercase font-bold tracking-widest block mb-2 ${
              isLight ? 'text-black/60' : 'text-white/60'
            }`}>
              FOR RESTAURANTS & CAFES
            </span>
            <h2 className={`font-display text-3xl tracking-wide uppercase mb-3 flex items-center justify-between ${isLight ? 'text-black/90' : 'text-white/90'}`}>
              <span>Restaurant Partner</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-black' : 'text-white'
              }`} />
            </h2>
            <p className={`font-sans text-xs font-medium leading-relaxed mb-8 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
              Manage Place ID, publish secret menu dishes, confirm table reservations, and track diner traffic.
            </p>

            <div className={`pt-5 border-t flex items-center font-sans font-bold text-[10px] uppercase tracking-widest transition-colors ${
              isLight ? 'border-black/10 text-black group-hover:text-black/70' : 'border-white/10 text-white group-hover:text-white/70'
            }`}>
              Sign In as Partner →
            </div>
          </Link>

          {/* Card 3: Delivery Partner / Driver */}
          <Link
            href="/login/driver"
            className={`rounded-3xl p-8 border shadow-xl transition-all group cursor-pointer backdrop-blur-xl ${
              isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-black/40 border-white/10 hover:border-white/30'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border shadow-md ${
              isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-white/10 border-white/20 text-white'
            }`}>
              <Truck className="w-8 h-8" />
            </div>

            <span className={`text-[10px] uppercase font-bold tracking-widest block mb-2 ${
              isLight ? 'text-black/60' : 'text-white/60'
            }`}>
              FOR DRIVERS & COURIERS
            </span>
            <h2 className={`font-display text-3xl tracking-wide uppercase mb-3 flex items-center justify-between ${isLight ? 'text-black/90' : 'text-white/90'}`}>
              <span>Delivery Partner</span>
              <ArrowRight className={`w-6 h-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${
                isLight ? 'text-black' : 'text-white'
              }`} />
            </h2>
            <p className={`font-sans text-xs font-medium leading-relaxed mb-8 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
              Manage deliveries, track your earnings, and navigate to restaurants and diners seamlessly.
            </p>

            <div className={`pt-5 border-t flex items-center font-sans font-bold text-[10px] uppercase tracking-widest transition-colors ${
              isLight ? 'border-black/10 text-black group-hover:text-black/70' : 'border-white/10 text-white group-hover:text-white/70'
            }`}>
              Sign In as Driver →
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center py-4 text-[10px] font-bold uppercase tracking-widest relative z-10 ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`}>
        Hidden Eats — Dual Access Portal
      </footer>
    </div>
  );
}
