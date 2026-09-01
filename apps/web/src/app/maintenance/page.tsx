'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, ShieldCheck, Clock, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { HiddenEatsLogo } from '@/components/Sidebar';

export default function MaintenancePage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const router = useRouter();

  const [adminKey, setAdminKey] = useState('');
  const [showAdminBypass, setShowAdminBypass] = useState(false);
  const [bypassError, setBypassError] = useState(false);

  const handleAdminBypass = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'admin123' || adminKey === 'hiddeneats2026') {
      localStorage.setItem('he_maintenance_mode', 'false');
      router.push('/dashboard');
    } else {
      setBypassError(true);
      setTimeout(() => setBypassError(false), 2500);
    }
  };

  const handleRefreshCheck = () => {
    window.location.reload();
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 font-sans antialiased transition-colors duration-500 relative overflow-hidden ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#0E0E10] text-white'
    }`}>
      {/* Background Ambience */}
      {!isLight && (
        <>
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#671212]/25 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#f8b11c]/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        </>
      )}

      {/* Header */}
      <header className="flex items-center justify-between w-full relative z-10">
        <HiddenEatsLogo />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            System Upgrades Active
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto w-full my-auto py-12 text-center relative z-10">
        <div className="relative inline-block mb-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl ${
            isLight ? 'bg-black/5 text-black border border-black/10' : 'bg-[#f8b11c] text-black border border-[#f8b11c]/50'
          }`}>
            <Wrench className="w-9 h-9 animate-bounce" />
          </div>
        </div>

        <span className={`text-[11px] font-bold uppercase tracking-widest block mb-2 ${
          isLight ? 'text-black/60' : 'text-[#f8b11c]'
        }`}>
          Scheduled Performance & Security Upgrades
        </span>

        <h1 className={`font-display text-4xl sm:text-5xl uppercase tracking-tight leading-[0.95] mb-4 ${
          isLight ? 'text-black/90' : 'text-white'
        }`}>
          Page Under Maintenance
        </h1>

        <p className={`text-sm max-w-md mx-auto leading-relaxed mb-8 ${
          isLight ? 'text-black/70' : 'text-white/70'
        }`}>
          We are currently deploying upgraded real-time GPS navigation, SQL injection defenses, and live kitchen synchronization. We will be back online momentarily.
        </p>

        {/* Maintenance Info Card */}
        <div className={`rounded-3xl p-6 mb-8 border backdrop-blur-xl transition-colors ${
          isLight ? 'bg-white border-black/10 shadow-xl' : 'bg-black/40 border-white/10 shadow-2xl'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <Clock className="w-5 h-5 text-[#f8b11c] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Estimated Duration</p>
                <p className="text-xs font-bold mt-0.5">~10 - 15 Minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Security Status</p>
                <p className="text-xs font-bold mt-0.5">100% Protected & Encrypted</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRefreshCheck}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                isLight 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-[#f8b11c] text-black hover:bg-[#e0a019]'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Check If Online
            </button>

            <button
              onClick={() => setShowAdminBypass(!showAdminBypass)}
              className={`w-full sm:w-auto py-3.5 px-6 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${
                isLight 
                  ? 'border-black/20 text-black hover:bg-black/5' 
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              Staff / Admin Bypass
            </button>
          </div>

          {/* Admin Bypass Form */}
          {showAdminBypass && (
            <form onSubmit={handleAdminBypass} className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter Staff Bypass Passcode"
                className={`flex-1 rounded-2xl px-4 py-3 text-xs font-medium outline-none transition-all ${
                  isLight 
                    ? 'bg-black/5 border border-black/10 text-black' 
                    : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                }`}
              />
              <button
                type="submit"
                className="py-3 px-5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all shrink-0"
              >
                Enter
              </button>
            </form>
          )}

          {bypassError && (
            <p className="text-red-400 text-xs font-bold mt-2">
              Invalid staff passcode. Access denied.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`text-center text-[10px] font-bold uppercase tracking-widest relative z-10 ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`}>
        Hidden Eats — Status & Performance Monitor
      </footer>
    </div>
  );
}
