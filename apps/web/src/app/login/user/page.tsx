'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { Compass, ArrowRight } from 'lucide-react';
import { HiddenEatsLogo } from '@/components/Sidebar';

export default function DinerLoginPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
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
          data: { username: username || email.split('@')[0], role: 'explorer', mobile },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert('Verification email sent! Check your inbox to activate your Explorer profile.');
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
        router.push('/explorer');
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
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ${
            isLight ? 'bg-black/5 text-black border border-black/10' : 'bg-[#f8b11c] text-black border border-[#f8b11c]/50'
          }`}>
            <Compass className="w-8 h-8" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${
            isLight ? 'text-black/60' : 'text-[#f8b11c]'
          }`}>
            Diner & Food Explorer Portal
          </span>
          <h1 className={`font-display text-4xl sm:text-5xl uppercase tracking-tight leading-[0.9] mt-2 ${isLight ? 'text-black/90' : 'text-white'}`}>
            {isSignUp ? 'Create Account' : 'Sign In as Explorer'}
          </h1>
          <p className={`font-sans text-xs md:text-sm font-medium mt-4 leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            Discover hidden gems, unlock secret menu items, and reserve tables.
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
              <div className="space-y-5">
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                    isLight ? 'text-black/60' : 'text-white/60'
                  }`}>
                    Explorer Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="foodie_explorer"
                    className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                      isLight 
                        ? 'bg-black/5 border-transparent text-black focus:border-[#f8b11c] focus:bg-white' 
                        : 'bg-white/5 border border-transparent text-white focus:border-[#f8b11c] focus:bg-white/10 placeholder:text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                    isLight ? 'text-black/60' : 'text-white/60'
                  }`}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                      isLight 
                        ? 'bg-black/5 border-transparent text-black focus:border-[#f8b11c] focus:bg-white' 
                        : 'bg-white/5 border border-transparent text-white focus:border-[#f8b11c] focus:bg-white/10 placeholder:text-gray-600'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                isLight ? 'text-black/60' : 'text-white/60'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@example.com"
                className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                  isLight 
                    ? 'bg-black/5 border-transparent text-black focus:border-[#f8b11c] focus:bg-white' 
                    : 'bg-white/5 border border-transparent text-white focus:border-[#f8b11c] focus:bg-white/10 placeholder:text-gray-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${
                isLight ? 'text-black/60' : 'text-white/60'
              }`}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`block w-full rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all ${
                  isLight 
                    ? 'bg-black/5 border-transparent text-black focus:border-[#f8b11c] focus:bg-white' 
                    : 'bg-white/5 border border-transparent text-white focus:border-[#f8b11c] focus:bg-white/10 placeholder:text-gray-600'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full text-xs uppercase tracking-widest font-black transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 ${
                isLight
                  ? 'bg-black hover:bg-gray-800 text-white shadow-xl shadow-black/10'
                  : 'bg-[#f8b11c] hover:bg-[#e0a019] text-black shadow-xl shadow-[#f8b11c]/20'
              }`}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up as Explorer' : 'Sign In as Explorer'}
              {!loading && <ArrowRight className="w-4 h-4" />}
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

            <button
              onClick={handleGoogleSignIn}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-4 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg hover:-translate-y-1 ${
                isLight 
                  ? 'bg-white border border-black/10 text-black hover:bg-black/5' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              Google Account
            </button>
          </div>

          <div className="mt-8 text-center text-xs uppercase tracking-widest font-bold">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`transition-colors ${
                isLight ? 'text-black hover:text-[#f8b11c]' : 'text-white hover:text-[#f8b11c]'
              }`}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </main>

      <footer className={`text-center text-[10px] font-bold uppercase tracking-widest animate-fade-in relative z-10 ${
        isLight ? 'text-black/40' : 'text-white/40'
      }`} style={{ animationDelay: '0.2s' }}>
        Hidden Eats — Food Explorer Portal
      </footer>
    </div>
  );
}
