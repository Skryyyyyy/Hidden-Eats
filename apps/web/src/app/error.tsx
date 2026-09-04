'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Compass, ArrowLeft } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full z-10">
        <Link href="/" className="font-display text-2xl uppercase tracking-wider text-white hover:text-[#f8b11c] transition-colors">
          Hidden<span className="text-[#f8b11c]">Eats</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full text-center my-auto py-12 z-10 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Unexpected Kitchen Hiccup!
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Our kitchen servers hit a temporary bump while loading this page. Your account data and cart are safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#f8b11c] hover:bg-[#e0a019] text-black font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>

          <Link
            href="/explorer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4 text-[#f8b11c]" /> Food Explorer
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-gray-600 z-10 border-t border-white/5 pt-6">
        <p>© 2026 Hidden Eats • System Recovery</p>
      </footer>
    </div>
  );
}
