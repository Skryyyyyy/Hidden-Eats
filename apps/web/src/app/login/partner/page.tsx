'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { Building2, ArrowRight } from 'lucide-react';
import { HiddenEatsLogo } from '@/components/Sidebar';

export default function PartnerLoginPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

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

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-12 font-sans antialiased text-body transition-colors duration-500 selection:bg-black selection:text-white ${
      isLight ? 'bg-[#FAFAFA] text-[#111111]' : 'bg-[#0A0A0A] text-[#FAFAFA]'
    }`}>
      {/* Dynamic Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        <div className={`absolute top-[-20%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 ${isLight ? 'bg-black/5' : 'bg-white/5'}`} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full animate-fade-in">
        <HiddenEatsLogo />
        <Link href="/login" className={`text-label text-[11px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors px-5 py-2.5 rounded-full border hover-lift ${
          isLight ? 'text-[#111111] bg-white border-black/5 hover:border-black/15 shadow-sm' : 'text-white bg-[#111111] border-white/5 hover:border-white/15'
        }`}>
          Switch Access Role <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[480px] mx-auto w-full my-auto py-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-12">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm backdrop-blur-md border ${
            isLight ? 'bg-white border-black/5 text-[#111111] shadow-black/5' : 'bg-[#171717]/80 border-white/5 text-white shadow-white/5'
          }`}>
            <Building2 className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <span className={`text-label text-[10px] font-bold uppercase tracking-[0.2em] mb-4 block ${
            isLight ? 'text-[#666666]' : 'text-[#888888]'
          }`}>
            Restaurant Partner Studio
          </span>
          <h1 className={`text-hero text-4xl sm:text-5xl tracking-tight mb-4 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
            {isSignUp ? 'Register Partner Account' : 'Sign in to Partner Studio'}
          </h1>
          <p className={`text-body text-[15px] leading-relaxed mx-auto max-w-[360px] ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
            Manage your Place ID, secret menu dishes, and table reservations.
          </p>
        </div>

        <div className={`border rounded-[32px] p-8 sm:p-10 shadow-xl transition-colors backdrop-blur-xl ${
          isLight ? 'bg-white/80 border-black/5 shadow-black/[0.03]' : 'bg-[#111111]/80 border-white/[0.08] shadow-black/50'
        }`}>
          {errorMsg && (
            <div className={`mb-8 p-5 border rounded-2xl text-body text-sm font-bold flex items-center gap-3 animate-fade-in ${
              isLight ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]' : 'bg-[#3f1616] border-[#5c1c1c] text-[#ef4444]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" /> {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleAuth}>
            {isSignUp && (
              <div className="space-y-2">
                <label className={`block text-label text-[11px] uppercase tracking-wider font-bold ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}>
                  Restaurant / Cafe Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Grand Secret Kitchen"
                  className={`block w-full rounded-2xl px-5 py-4 text-body text-[15px] outline-none transition-all border ${
                    isLight 
                      ? 'bg-[#F9FAFB] border-transparent text-[#111111] focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 placeholder-[#9CA3AF]' 
                      : 'bg-[#1A1A1A] border-transparent text-white focus:bg-[#222222] focus:border-white/20 focus:ring-4 focus:ring-white/5 placeholder-[#666666]'
                  }`}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className={`block text-label text-[11px] uppercase tracking-wider font-bold ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                Business Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@restaurant.com"
                className={`block w-full rounded-2xl px-5 py-4 text-body text-[15px] outline-none transition-all border ${
                  isLight 
                    ? 'bg-[#F9FAFB] border-transparent text-[#111111] focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 placeholder-[#9CA3AF]' 
                    : 'bg-[#1A1A1A] border-transparent text-white focus:bg-[#222222] focus:border-white/20 focus:ring-4 focus:ring-white/5 placeholder-[#666666]'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-label text-[11px] uppercase tracking-wider font-bold ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`block w-full rounded-2xl px-5 py-4 text-body text-[15px] outline-none transition-all border ${
                  isLight 
                    ? 'bg-[#F9FAFB] border-transparent text-[#111111] focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 placeholder-[#9CA3AF]' 
                    : 'bg-[#1A1A1A] border-transparent text-white focus:bg-[#222222] focus:border-white/20 focus:ring-4 focus:ring-white/5 placeholder-[#666666]'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-6 mt-4 rounded-2xl text-label text-[13px] uppercase tracking-widest font-bold shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 group ${
                isLight
                  ? 'bg-[#111111] hover:bg-black text-white shadow-black/10 hover:shadow-black/20'
                  : 'bg-white hover:bg-[#F3F4F6] text-black shadow-white/10 hover:shadow-white/20'
              }`}
            >
              <span className="flex items-center gap-2">
                {loading ? 'Processing...' : isSignUp ? 'Register Partner Account' : 'Sign In to Studio'}
                {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              </span>
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isLight ? 'border-black/5' : 'border-white/10'}`} />
              </div>
              <div className="relative flex justify-center text-label text-[10px] uppercase tracking-widest font-bold">
                <span className={`px-4 ${isLight ? 'bg-white text-[#9CA3AF]' : 'bg-[#111111] text-[#666666]'}`}>
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className={`mt-8 w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-label text-[13px] font-bold transition-all border shadow-sm hover-lift ${
                isLight 
                  ? 'bg-white border-black/5 text-[#111111] hover:bg-[#FAFAFA]' 
                  : 'bg-[#1A1A1A] border-white/5 text-white hover:bg-[#222222]'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-10 text-center text-body text-[13px]">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`font-bold transition-colors border-b border-transparent pb-0.5 ${
                isLight ? 'text-[#111111] hover:border-[#111111]' : 'text-white hover:border-white'
              }`}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Apply now"}
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-label text-[11px] font-bold uppercase tracking-[0.2em] animate-fade-in mt-8" style={{ animationDelay: '0.2s' }}>
        <span className={isLight ? 'text-[#9CA3AF]' : 'text-[#666666]'}>
          Hidden Eats — Enterprise Partner Studio
        </span>
      </footer>
    </div>
  );
}
