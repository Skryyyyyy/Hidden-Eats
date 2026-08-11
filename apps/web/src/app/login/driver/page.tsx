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
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 font-sans antialiased transition-colors duration-500 ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#111111] text-white'
    }`}>
      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-[1440px] mx-auto w-full animate-fade-in">
        <HiddenEatsLogo />
        <Link href="/login" className={`font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
          isLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
        }`}>
          ← Back to Portals
        </Link>
      </header>

      {/* Main Login Body */}
      <main className="max-w-md mx-auto w-full my-auto py-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-10">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 border shadow-lg ${
            isLight ? 'bg-white border-black/10 text-black' : 'bg-[#1c1c1c] border-white/10 text-[#10B981]'
          }`}>
            <Truck className="w-8 h-8" />
          </div>
          <h1 className={`font-display text-3xl sm:text-4xl uppercase tracking-wide ${isLight ? 'text-black/90' : 'text-white/90'}`}>
            Driver Portal
          </h1>
          <p className={`font-sans text-sm font-semibold max-w-sm mx-auto mt-2 ${isLight ? 'text-black/60' : 'text-white/60'}`}>
            Enter your registered mobile number to receive a one-time password and access your dashboard.
          </p>
        </div>

        <div className={`rounded-2xl p-8 border shadow-xl ${
          isLight ? 'bg-white border-black/10' : 'bg-[#1c1c1c] border-white/10'
        }`}>
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className={`block font-sans text-xs font-bold uppercase tracking-widest mb-2 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                  Mobile Number
                </label>
                <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
                  isLight ? 'border-black/20 focus-within:border-black/50 bg-transparent' : 'border-white/20 focus-within:border-[#10B981]/50 bg-[#111]'
                }`}>
                  <span className={`px-4 font-mono text-sm border-r ${isLight ? 'border-black/20 text-black/50' : 'border-white/20 text-white/50'}`}>+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full p-3 font-mono bg-transparent outline-none ${isLight ? 'text-black' : 'text-white'}`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${
                  isLight
                    ? 'bg-black text-white hover:bg-black/90 disabled:bg-black/20'
                    : 'bg-[#10B981] text-black hover:bg-[#059669] disabled:bg-[#10B981]/20 disabled:text-white/30'
                }`}
              >
                {loading ? 'Sending...' : 'Send OTP'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <label className={`block font-sans text-xs font-bold uppercase tracking-widest ${isLight ? 'text-black/70' : 'text-white/70'}`}>
                  Enter OTP
                </label>
                <button type="button" onClick={() => setOtpSent(false)} className={`text-xs uppercase tracking-widest font-bold underline ${isLight ? 'text-black/50 hover:text-black' : 'text-white/50 hover:text-white'}`}>
                  Change Number
                </button>
              </div>
              <input
                type="text"
                placeholder="XXXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className={`w-full p-4 text-center font-mono text-2xl tracking-[1em] rounded-lg border outline-none transition-colors ${
                  isLight 
                    ? 'bg-transparent border-black/20 focus:border-black/50 text-black' 
                    : 'bg-[#111] border-white/20 focus:border-[#10B981]/50 text-white'
                }`}
                required
              />

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all ${
                  isLight
                    ? 'bg-black text-white hover:bg-black/90 disabled:bg-black/20'
                    : 'bg-[#10B981] text-black hover:bg-[#059669] disabled:bg-[#10B981]/20 disabled:text-white/30'
                }`}
              >
                {loading ? 'Verifying...' : 'Login Securely'}
                {!loading && <ShieldCheck className="w-4 h-4" />}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className={`text-xs ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Not registered as a driver yet? <Link href="/" className={`font-bold underline ${isLight ? 'text-black' : 'text-[#10B981]'}`}>Apply to Ride</Link>
            </p>
          </div>
        </div>
      </main>

      <footer className={`text-center py-4 font-sans text-xs uppercase tracking-widest font-bold ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`}>
        Hidden Eats Delivery Network
      </footer>
    </div>
  );
}
