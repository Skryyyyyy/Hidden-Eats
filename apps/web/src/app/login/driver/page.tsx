'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DriverLoginPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      router.push('/driver');
    }, 1000);
  };

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

      {/* Top Bar */}
      <header className="flex items-center justify-between w-full animate-fade-in relative z-10">
        <HiddenEatsLogo />
        <Link href="/login" className={`font-sans font-bold text-[10px] uppercase tracking-widest transition-colors ${
          isLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
        }`}>
          ← Back to Portals
        </Link>
      </header>

      {/* Main Login Body */}
      <main className="max-w-md mx-auto w-full my-auto py-12 animate-fade-in relative z-10" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 border shadow-xl ${
            isLight ? 'bg-black/5 text-black border border-black/10' : 'bg-white/10 text-white border border-white/20'
          }`}>
            <Truck className="w-8 h-8" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${
            isLight ? 'text-black/60' : 'text-white/60'
          }`}>
            Delivery Partner Network
          </span>
          <h1 className={`font-display text-4xl sm:text-5xl uppercase tracking-tight leading-[0.9] mt-2 ${isLight ? 'text-black/90' : 'text-white'}`}>
            Driver Portal
          </h1>
          <p className={`font-sans text-xs md:text-sm font-medium mt-4 leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            Enter your registered mobile number to receive a one-time password and access your dashboard.
          </p>
        </div>

        <div className={`rounded-3xl p-8 shadow-2xl transition-colors backdrop-blur-xl ${
          isLight ? 'bg-white border border-black/10' : 'bg-black/40 border border-white/10'
        }`}>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                  Mobile Number
                </label>
                <div className={`flex items-center rounded-2xl overflow-hidden transition-all ${
                  isLight 
                    ? 'bg-black/5 text-black focus-within:ring-2 focus-within:ring-black' 
                    : 'bg-white/5 border border-transparent text-white focus-within:border-white focus-within:bg-white/10'
                }`}>
                  <span className={`px-5 font-mono text-sm border-r ${isLight ? 'border-black/10 text-black/50' : 'border-white/10 text-white/50'}`}>+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full p-4 font-mono bg-transparent outline-none text-sm placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full text-xs uppercase tracking-widest font-black transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 ${
                  isLight
                    ? 'bg-black text-white hover:bg-black/90 disabled:bg-black/20'
                    : 'bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/20'
                }`}
              >
                {loading ? 'Sending...' : 'Send OTP'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <label className={`block text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                  Enter OTP
                </label>
                <button type="button" onClick={() => setOtpSent(false)} className={`text-[10px] uppercase tracking-widest font-bold underline ${isLight ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'}`}>
                  Change Number
                </button>
              </div>
              <input
                type="text"
                placeholder="XXXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={`w-full p-4 text-center font-mono text-2xl tracking-[1em] rounded-2xl outline-none transition-all ${
                  isLight 
                    ? 'bg-black/5 text-black focus:ring-2 focus:ring-black' 
                    : 'bg-white/5 border border-transparent text-white focus:border-white focus:bg-white/10'
                }`}
                required
              />

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full text-xs uppercase tracking-widest font-black transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 ${
                  isLight
                    ? 'bg-black text-white hover:bg-black/90 disabled:bg-black/20'
                    : 'bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/20'
                }`}
              >
                {loading ? 'Verifying...' : 'Login Securely'}
                {!loading && <ShieldCheck className="w-4 h-4" />}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className={`text-[10px] uppercase tracking-widest font-bold ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Not registered as a driver yet? <Link href="/" className={`underline ${isLight ? 'text-black' : 'text-white'}`}>Apply to Ride</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className={`text-center py-4 text-[10px] font-bold uppercase tracking-widest relative z-10 ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`}>
        Hidden Eats Delivery Network
      </footer>
    </div>
  );
}
