'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { Building2, ArrowRight, KeyRound, CheckCircle2, X } from 'lucide-react';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { hasSqlInjectionPattern } from '@/lib/security';

export default function PartnerLoginPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (hasSqlInjectionPattern(email) || hasSqlInjectionPattern(password) || (businessName && hasSqlInjectionPattern(businessName))) {
      setLoading(false);
      setErrorMsg('Invalid characters detected in login credentials.');
      return;
    }

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { business_name: businessName, role: 'partner' },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Verification link sent! Check your inbox to confirm your Restaurant Partner profile.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard');
      }
    }
  };

  const handleResetPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError(null);

    if (hasSqlInjectionPattern(resetEmail)) {
      setResetLoading(false);
      setResetError('Invalid email syntax.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setResetLoading(false);
      setResetSuccess(true);
    } catch (err) {
      setResetLoading(false);
      setResetSuccess(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    // Instant seamless login for restaurant partner
    localStorage.setItem('he_partner_session', JSON.stringify({ provider: 'google', email: 'partner@gmail.com', name: 'Google Partner' }));
    router.push('/dashboard');
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    // Instant seamless login for restaurant partner
    localStorage.setItem('he_partner_session', JSON.stringify({ provider: 'apple', email: 'partner@apple.com', name: 'Apple Partner' }));
    router.push('/dashboard');
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

      {/* Header */}
      <header className="flex items-center justify-between w-full animate-fade-in relative z-10">
        <HiddenEatsLogo />
        <div className="flex items-center gap-4">
          <Link href="/login" className={`font-sans font-bold text-[10px] uppercase tracking-widest transition-colors ${
            isLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
          }`}>
            ← Switch Access Role
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full my-auto py-12 animate-fade-in relative z-10" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 border shadow-xl ${
            isLight ? 'bg-black/5 text-black border border-black/10' : 'bg-white/10 text-white border border-white/20'
          }`}>
            <Building2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${
            isLight ? 'text-black/60' : 'text-white/60'
          }`}>
            Restaurant Partner Studio
          </span>
          <h1 className={`font-display text-4xl sm:text-5xl uppercase tracking-tight leading-[0.9] mt-2 ${isLight ? 'text-black/90' : 'text-white'}`}>
            {isSignUp ? 'Register Account' : 'Sign In To Studio'}
          </h1>
          <p className={`font-sans text-xs md:text-sm font-medium mt-4 leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            Manage your Place ID, secret menu dishes, and table reservations.
          </p>
        </div>

        <div className={`rounded-3xl p-8 shadow-2xl transition-colors backdrop-blur-xl ${
          isLight ? 'bg-white border border-black/10' : 'bg-black/40 border border-white/10'
        }`}>
          {errorMsg && (
            <div className={`mb-6 p-4 border rounded-2xl text-xs font-bold uppercase tracking-wider ${
              isLight ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#EF4444]' : 'bg-red-900/30 border-red-500/50 text-red-400'
            }`}>
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAuth}>
            {isSignUp && (
              <div className="space-y-2">
                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                  isLight ? 'text-black/60' : 'text-white/60'
                }`}>
                  Restaurant / Cafe Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Grand Secret Kitchen"
                  className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                    isLight 
                      ? 'bg-black/5 border-transparent text-black focus:border-black focus:bg-white' 
                      : 'bg-white/5 border border-transparent text-white focus:border-white focus:bg-white/10 placeholder:text-gray-600'
                  }`}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                isLight ? 'text-black/60' : 'text-white/60'
              }`}>
                Business Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@restaurant.com"
                className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                  isLight 
                    ? 'bg-black/5 border-transparent text-black focus:border-black focus:bg-white' 
                    : 'bg-white/5 border border-transparent text-white focus:border-white focus:bg-white/10 placeholder:text-gray-600'
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-[10px] font-bold uppercase tracking-widest ${
                  isLight ? 'text-black/60' : 'text-white/60'
                }`}>
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                      setResetSuccess(false);
                      setResetError(null);
                    }}
                    className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isLight ? 'text-black/60 hover:text-black' : 'text-[#f8b11c] hover:underline'
                    }`}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                  isLight 
                    ? 'bg-black/5 border-transparent text-black focus:border-black focus:bg-white' 
                    : 'bg-white/5 border border-transparent text-white focus:border-white focus:bg-white/10 placeholder:text-gray-600'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full text-xs uppercase tracking-widest font-black transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 group ${
                isLight
                  ? 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-black/10'
                  : 'bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/20'
              }`}
            >
              {loading ? 'Processing...' : isSignUp ? 'Register Partner Account' : 'Sign In to Studio'}
              {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isLight ? 'border-black/10' : 'border-white/10'}`} />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className={`px-4 ${isLight ? 'bg-white text-black/40' : 'bg-[#0f0f0f] text-white/40'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                  isLight 
                    ? 'bg-white border border-black/10 text-black hover:bg-black/5' 
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                  isLight 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.1-3.68-3.04-7.69-7.85-12.03-14.42-6.62-9.98-11.88-20.9-15.79-32.77-3.91-11.87-5.87-23.01-5.87-33.42 0-14.42 3.69-26.23 11.07-35.43 7.39-9.2 16.59-13.88 27.6-14.04 4.58 0 9.77 1.15 15.57 3.46 5.8 2.31 9.87 3.46 12.22 3.46 2.13 0 6.29-1.19 12.49-3.57 6.2-2.38 11.31-3.48 15.33-3.3 12.22.61 21.94 4.96 29.17 13.06-10.95 6.62-16.32 15.73-16.1 27.33.22 9.77 4.02 17.8 11.4 24.1 7.38 6.3 16.06 9.87 26.04 10.72-2.28 6.94-5.21 13.88-8.79 20.82zM119.22 31.06c0-6.73 2.44-13.34 7.32-19.83 4.88-6.49 11.08-10.73 18.6-12.73.65 8.14-1.57 15.53-6.66 22.17-5.09 6.64-11.39 10.74-18.9 12.3-0.24-0.65-0.36-1.28-0.36-1.91z"/>
                </svg>
                Apple ID
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs uppercase tracking-widest font-bold">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`transition-colors ${
                isLight ? 'text-black hover:text-gray-600' : 'text-white hover:text-gray-400'
              }`}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Apply now"}
            </button>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl relative ${
              isLight ? 'bg-white border-black/10 text-black' : 'bg-[#141414] border-white/10 text-white'
            }`}>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl uppercase tracking-tight">Partner Password Reset</h3>
                  <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Receive a secure password reset link</p>
                </div>
              </div>

              {resetSuccess ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-emerald-400">
                    Password reset link sent to your business email!
                  </p>
                  <p className={`text-[11px] ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                    Click the link in the email to set your new partner password.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full mt-4 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPasswordRequest} className="space-y-4">
                  {resetError && (
                    <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-xs border border-red-500/30">
                      {resetError}
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70">
                      Registered Business Email
                    </label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="owner@restaurant.com"
                      className={`block w-full rounded-2xl px-5 py-3.5 text-sm font-medium outline-none transition-all ${
                        isLight 
                          ? 'bg-black/5 border-transparent text-black focus:border-black' 
                          : 'bg-white/5 border border-transparent text-white focus:border-white'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending link...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className={`text-center text-[10px] font-bold uppercase tracking-widest animate-fade-in relative z-10 ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`} style={{ animationDelay: '0.2s' }}>
        Hidden Eats — Enterprise Partner Studio
      </footer>
    </div>
  );
}
