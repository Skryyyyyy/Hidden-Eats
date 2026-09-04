'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, MapPin, ArrowLeft, Utensils, Search, Radio, Clapperboard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans selection:bg-[#f8b11c]/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#f8b11c]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl tracking-wider uppercase text-white group-hover:text-[#f8b11c] transition-colors">
            Hidden<span className="text-[#f8b11c]">Eats</span>
          </span>
        </Link>

        <Link
          href="/explorer"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#f8b11c] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#f8b11c]" /> Food Explorer
        </Link>
      </header>

      {/* Main 404 Body */}
      <main className="max-w-2xl mx-auto w-full text-center my-auto py-12 z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-[#f8b11c]">
            <Utensils className="w-3.5 h-3.5" /> 404 • Lost in the Food Trail
          </div>

          {/* Big Number */}
          <h1 className="font-display text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 tracking-tighter m-0">
            404
          </h1>

          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            This Secret Alley Doesn't Exist!
          </h2>

          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Looks like this culinary gem relocated their backdoor kitchen, or the secret link took a wrong turn down a Chennai side-street.
          </p>
        </motion.div>

        {/* Quick Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left"
        >
          <Link
            href="/explorer"
            className="p-4 rounded-2xl bg-[#121318] border border-white/10 hover:border-[#f8b11c]/50 transition-all hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#f8b11c]/10 text-[#f8b11c] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Explore Spots</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Discover top-rated hidden kitchens</p>
          </Link>

          <Link
            href="/explorer/map"
            className="p-4 rounded-2xl bg-[#121318] border border-white/10 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Map</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Locate nearest food spots</p>
          </Link>

          <Link
            href="/explorer/reels"
            className="p-4 rounded-2xl bg-[#121318] border border-white/10 hover:border-rose-500/50 transition-all hover:-translate-y-1 group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Foodie Reels</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Watch TikTok & Insta food clips</p>
          </Link>
        </motion.div>

        {/* Action Button */}
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#f8b11c] to-[#e0a019] text-black font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#f8b11c]/25 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" /> Return to Home Base
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-600 z-10 border-t border-white/5 pt-6">
        <p>© 2026 Hidden Eats • Secret Food Trails & Culinary Intelligence</p>
      </footer>
    </div>
  );
}
