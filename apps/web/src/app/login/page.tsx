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
      isLight ? 'bg-gradient-to-br from-orange-50 via-rose-50 to-amber-100 text-black' : 'bg-gradient-to-br from-[#2a0815] via-[#111111] to-[#2c1305] text-white'
    }`}>
      {/* Colorful Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[100px] -translate-y-1/4 translate-x-1/4 animate-pulse opacity-60 ${isLight ? 'bg-rose-200' : 'bg-rose-900/40'}`}></div>
        <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[120px] translate-y-1/4 -translate-x-1/4 animate-pulse delay-700 opacity-60 ${isLight ? 'bg-orange-200' : 'bg-orange-900/40'}`}></div>
        <div className={`absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[100px] -translate-y-1/2 -translate-x-1/2 animate-pulse delay-1000 opacity-40 ${isLight ? 'bg-amber-200' : 'bg-amber-900/30'}`}></div>
      </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Food Explorer / Diner */}
          <Link
            href="/login/user"
            className={`rounded-2xl p-6 sm:p-8 border shadow-sm transition-all duration-300 group cursor-pointer backdrop-blur-md hover:-translate-y-1 ${
              isLight ? 'bg-white/90 border-black/5 hover:border-black/15 hover:shadow-lg' : 'bg-[#1a1a1a]/80 border-white/5 hover:border-white/15 hover:shadow-2xl'
            }`}
          >
            <div className="flex flex-col gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isLight ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' : 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20'
              }`}>
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${
                  isLight ? 'text-black/40' : 'text-white/40'
                }`}>
                  For Diners
                </span>
                <h2 className={`font-sans font-bold text-xl ${isLight ? 'text-black' : 'text-white'}`}>
                  Food Explorer
                </h2>
              </div>
            </div>
            
            <p className={`font-sans text-sm leading-relaxed mb-8 h-20 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Search hidden gems, unlock secret off-menu items, save collections, and reserve tables seamlessly.
            </p>

            <div className={`flex items-center font-sans font-semibold text-sm transition-colors ${
              isLight ? 'text-orange-600 group-hover:text-orange-700' : 'text-orange-400 group-hover:text-orange-300'
            }`}>
              Sign in as Diner <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </Link>

          {/* Card 2: Restaurant Partner / Owner */}
          <Link
            href="/login/partner"
            className={`rounded-2xl p-6 sm:p-8 border shadow-sm transition-all duration-300 group cursor-pointer backdrop-blur-md hover:-translate-y-1 ${
              isLight ? 'bg-white/90 border-black/5 hover:border-black/15 hover:shadow-lg' : 'bg-[#1a1a1a]/80 border-white/5 hover:border-white/15 hover:shadow-2xl'
            }`}
          >
            <div className="flex flex-col gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isLight ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' : 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20'
              }`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${
                  isLight ? 'text-black/40' : 'text-white/40'
                }`}>
                  For Restaurants
                </span>
                <h2 className={`font-sans font-bold text-xl ${isLight ? 'text-black' : 'text-white'}`}>
                  Restaurant Partner
                </h2>
              </div>
            </div>
            
            <p className={`font-sans text-sm leading-relaxed mb-8 h-20 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Manage Place ID, publish secret menu dishes, confirm reservations, and track your traffic.
            </p>

            <div className={`flex items-center font-sans font-semibold text-sm transition-colors ${
              isLight ? 'text-rose-600 group-hover:text-rose-700' : 'text-rose-400 group-hover:text-rose-300'
            }`}>
              Sign in as Partner <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
          </Link>

          {/* Card 3: Delivery Partner / Driver */}
          <Link
            href="/login/driver"
            className={`rounded-2xl p-6 sm:p-8 border shadow-sm transition-all duration-300 group cursor-pointer backdrop-blur-md hover:-translate-y-1 ${
              isLight ? 'bg-white/90 border-black/5 hover:border-black/15 hover:shadow-lg' : 'bg-[#1a1a1a]/80 border-white/5 hover:border-white/15 hover:shadow-2xl'
            }`}
          >
            <div className="flex flex-col gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isLight ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' : 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
              }`}>
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${
                  isLight ? 'text-black/40' : 'text-white/40'
                }`}>
                  For Drivers
                </span>
                <h2 className={`font-sans font-bold text-xl ${isLight ? 'text-black' : 'text-white'}`}>
                  Delivery Partner
                </h2>
              </div>
            </div>
            
            <p className={`font-sans text-sm leading-relaxed mb-8 h-20 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Manage deliveries, track your earnings, and navigate to restaurants and diners seamlessly.
            </p>

            <div className={`flex items-center font-sans font-semibold text-sm transition-colors ${
              isLight ? 'text-amber-600 group-hover:text-amber-700' : 'text-amber-400 group-hover:text-amber-300'
            }`}>
              Sign in as Driver <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
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
