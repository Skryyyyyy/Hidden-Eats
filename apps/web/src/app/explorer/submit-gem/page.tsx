'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import { Sparkles, MapPin, Upload, Camera, CheckCircle2, ArrowRight, Flame } from 'lucide-react';
import { sanitizeSearchQuery, hasSqlInjectionPattern } from '@/lib/security';

export default function SubmitHiddenGemPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const router = useRouter();

  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('Chennai');
  const [address, setAddress] = useState('');
  const [signatureDish, setSignatureDish] = useState('');
  const [secretDishPasscode, setSecretDishPasscode] = useState('');
  const [priceRange, setPriceRange] = useState('₹100 - ₹250');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    if (hasSqlInjectionPattern(shopName) || hasSqlInjectionPattern(address) || hasSqlInjectionPattern(signatureDish)) {
      setIsSubmitting(false);
      setErrorMsg('Invalid characters detected in spot details.');
      return;
    }

    // Simulate community spot ingestion
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-500 ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#05070a] text-white'
    }`}>
      <ExplorerNav />

      <main className="max-w-2xl mx-auto w-full px-6 py-12 flex-1 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#f8b11c] block mb-1">
            Community Foodie Network
          </span>
          <h1 className="font-display text-4xl uppercase tracking-tight">Submit a Hidden Gem</h1>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
            Discovered a secret mess, highway dhaba, or alleyway kitchen? Share it with the community and earn <span className="text-[#f8b11c] font-bold">+100 Gem XP</span>.
          </p>
        </div>

        <div className={`rounded-3xl p-8 border shadow-2xl backdrop-blur-xl ${
          isLight ? 'bg-white border-black/10' : 'bg-[#0e121d] border-white/10'
        }`}>
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Spot Submitted for AI Verification!</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Thank you, Explorer! Your submission <span className="text-white font-bold">{shopName}</span> has been queued. You have earned <span className="text-[#f8b11c] font-bold">+100 Gem XP</span>.
              </p>
              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={() => router.push('/explorer/map')}
                  className="py-3 px-6 rounded-full bg-[#f8b11c] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e0a019]"
                >
                  View on Map
                </button>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setShopName('');
                    setAddress('');
                    setSignatureDish('');
                    setImagePreview(null);
                  }}
                  className="py-3 px-6 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/5"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitSpot} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Hidden Gem Name *
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Sri Mookambika Secret Mess"
                  className={`w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-black/5 border border-black/10 text-black' 
                      : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    City / District *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all ${
                      isLight 
                        ? 'bg-black/5 border border-black/10 text-black' 
                        : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                    }`}
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Trichy">Trichy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Approximate Price per Person
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="e.g. ₹150 - ₹300"
                    className={`w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                      isLight 
                        ? 'bg-black/5 border border-black/10 text-black' 
                        : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Street Landmark / Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., 2nd Alley behind Shiva Temple, West Mambalam"
                  className={`w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-black/5 border border-black/10 text-black' 
                      : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Must-Try Signature Dish *
                </label>
                <input
                  type="text"
                  required
                  value={signatureDish}
                  onChange={(e) => setSignatureDish(e.target.value)}
                  placeholder="e.g., Woodfire Dum Biryani & Pepper Salna"
                  className={`w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-black/5 border border-black/10 text-black' 
                      : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Secret Off-Menu Dish & Passcode (Optional)
                </label>
                <input
                  type="text"
                  value={secretDishPasscode}
                  onChange={(e) => setSecretDishPasscode(e.target.value)}
                  placeholder="e.g., Ask for 'Special Nattu Kozhi Roast' from Head Cook"
                  className={`w-full rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                    isLight 
                      ? 'bg-black/5 border border-black/10 text-black' 
                      : 'bg-white/5 border border-white/10 text-white focus:border-[#f8b11c]'
                  }`}
                />
              </div>

              {/* Photo Upload Box */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Food / Shop Front Photo
                </label>
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden h-40 border border-white/20">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#f8b11c] cursor-pointer transition-colors bg-white/[0.02]">
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400 font-medium">Click to upload photo</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#f8b11c] hover:bg-[#e0a019] text-black font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#f8b11c]/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Spot...' : 'Submit Hidden Gem (+100 XP)'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
