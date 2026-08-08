'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { Compass, Check, Sun, Moon } from 'lucide-react';
import { HiddenEatsLogo } from '@/components/Sidebar';

export default function DinerLoginPage() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
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
          data: { username: username || email.split('@')[0], role: 'explorer' },
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
    <div className={`min-h-screen flex flex-col justify-between p-6 sm:p-10 font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#F4F4F5] text-[#18181B]' : 'bg-[#05070D] text-white'
    }`}>
      {/* Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full animate-fade-in">
        <HiddenEatsLogo />
        <div className="flex items-center gap-4">
          <Link href="/login" className={`font-sans font-bold text-xs uppercase tracking-widest transition-colors ${
            isLight ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
          }`}>
            ← Switch Access Role
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full my-auto py-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="text-center mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm ${
            isLight ? 'bg-[#FFF3E8] text-[#D62828] shadow-[#D62828]/20' : 'bg-[#261c07] text-[#FFB703] shadow-[#FFB703]/20'
          }`}>
            <Compass className="w-7 h-7" />
          </div>
          <span className={`text-label text-[10px] font-bold uppercase tracking-widest ${
            isLight ? 'text-[#D62828]' : 'text-[#FFB703]'
          }`}>
            Diner & Food Explorer Portal
          </span>
          <h1 className={`text-h1 text-3xl mt-2 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
            {isSignUp ? 'Create Explorer Account' : 'Sign in as Food Explorer'}
          </h1>
          <p className="text-body text-sm text-[#6B7280] dark:text-[#aaaaaa] mt-3">
            Discover hidden gems, unlock secret menu items, and reserve tables.
          </p>
        </div>

        <div className={`border rounded-3xl p-8 shadow-sm transition-colors ${
          isLight ? 'bg-white border-black/8' : 'bg-[#131A2C] border-[#23314a]'
        }`}>
          {errorMsg && (
            <div className={`mb-6 p-4 border rounded-2xl text-body text-xs font-bold ${
              isLight ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#EF4444]' : 'bg-[#3f1616] border-[#5c1c1c] text-[#ef4444]'
            }`}>
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAuth}>
            {isSignUp && (
              <div>
                <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-[#6B7280]' : 'text-[#888888]'
                }`}>
                  Explorer Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="foodie_explorer"
                  className={`block w-full rounded-2xl px-4 py-3 text-body text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-[#FFF8F1] border border-black/8 text-[#1F2937] focus:border-[#D62828]' 
                      : 'bg-[#05070D] border border-[#23314a] text-white focus:border-[#FFB703]'
                  }`}
                />
              </div>
            )}

            <div>
              <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                isLight ? 'text-[#6B7280]' : 'text-[#888888]'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="explorer@example.com"
                className={`block w-full rounded-2xl px-4 py-3 text-body text-sm outline-none transition-all ${
                  isLight 
                    ? 'bg-[#FFF8F1] border border-black/8 text-[#1F2937] focus:border-[#D62828]' 
                    : 'bg-[#05070D] border border-[#23314a] text-white focus:border-[#FFB703]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                isLight ? 'text-[#6B7280]' : 'text-[#888888]'
              }`}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`block w-full rounded-2xl px-4 py-3 text-body text-sm outline-none transition-all ${
                  isLight 
                    ? 'bg-[#FFF8F1] border border-black/8 text-[#1F2937] focus:border-[#D62828]' 
                    : 'bg-[#05070D] border border-[#23314a] text-white focus:border-[#FFB703]'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3.5 px-4 rounded-2xl text-label text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0 ${
                isLight
                  ? 'bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-[#D62828]/25'
                  : 'bg-[#FFB703] hover:bg-[#d97706] text-black font-bold shadow-[#FFB703]/25'
              }`}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up as Explorer' : 'Sign In as Explorer'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isLight ? 'border-black/5' : 'border-[#23314a]'}`} />
              </div>
              <div className="relative flex justify-center text-label text-[10px] uppercase tracking-wider">
                <span className={`px-4 ${isLight ? 'bg-white text-[#6B7280]' : 'bg-[#131A2C] text-[#888888]'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-label text-sm transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                isLight 
                  ? 'bg-[#FFF8F1] border border-black/8 text-[#1F2937] hover:bg-[#FFF3E8]' 
                  : 'bg-[#05070D] border border-[#23314a] text-white hover:bg-[#0a0e17]'
              }`}
            >
              Google Account
            </button>
          </div>

          <div className="mt-8 text-center text-body text-xs">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className={`font-bold transition-colors ${
                isLight ? 'text-[#D62828] hover:text-[#B91C1C]' : 'text-[#FFB703] hover:text-[#d97706]'
              }`}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center text-label text-xs text-[#6B7280] dark:text-[#888888] animate-fade-in" style={{ animationDelay: '0.2s' }}>
        Hidden Eats — Food Explorer Portal
      </footer>
    </div>
  );
}
