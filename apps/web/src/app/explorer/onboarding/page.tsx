'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function ExplorerOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function checkUser() {
      const { data: { session }, error } = await createClient().auth.getSession();
      if (!session) {
        // If not logged in, go back to login
        router.push('/login/user');
        return;
      }
      
      const user = session.user;
      setEmail(user.email || '');
      
      // If they already have all required metadata, redirect to explorer
      if (user.user_metadata?.username && user.user_metadata?.mobile && user.user_metadata?.age) {
        router.push('/explorer');
        return;
      }
      
      setLoading(false);
    }
    
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    if (!username.trim() || !mobile.trim() || !age.trim()) {
      setErrorMsg('Please fill in all fields.');
      setSaving(false);
      return;
    }

    try {
      const { error } = await createClient().auth.updateUser({
        data: {
          username: username.trim(),
          mobile: mobile.trim(),
          age: parseInt(age.trim(), 10) || age.trim(),
          onboarding_complete: true
        }
      });

      if (error) {
        setErrorMsg(error.message);
        setSaving(false);
        return;
      }

      // Success, redirect to explorer dashboard
      router.push('/explorer');
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-[#f8b11c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#f8b11c]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to Hidden Eats</h1>
            <p className="text-sm text-gray-400">Complete your Foodie Explorer profile to continue</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input 
                type="email"
                value={email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Choose a Username
              </label>
              <input 
                type="text"
                placeholder="e.g. foodie_king"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f8b11c] focus:bg-white/10 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <input 
                type="tel"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f8b11c] focus:bg-white/10 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Age
              </label>
              <input 
                type="number"
                placeholder="25"
                min="13"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f8b11c] focus:bg-white/10 transition-colors"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className={`w-full py-3.5 rounded-xl text-black font-bold text-sm bg-gradient-to-r from-[#f8b11c] to-[#e09e19] hover:shadow-lg hover:shadow-[#f8b11c]/20 transition-all ${
                saving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
