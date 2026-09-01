'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Settings, MapPin, Phone, Building2, ShieldCheck, Check, FileText, ChevronRight } from 'lucide-react';

export default function ComprehensivePartnerSettingsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [googlePlaceId, setGooglePlaceId] = useState('ChIJN1t_tDeuEmsRUsoyG83frY4');
  const [fssaiLicense, setFssaiLicense] = useState('11223344556677');
  const [gstinNumber, setGstinNumber] = useState('29AAAAA0000A1Z5');
  const [restaurantName, setRestaurantName] = useState('Grand Secret Kitchen');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [whatsapp, setWhatsapp] = useState('+91 98765 43210');
  const [openingHours, setOpeningHours] = useState('11:00 AM - 11:30 PM (Daily)');
  const [isBookable, setIsBookable] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FAFAFA] text-[#111111]' : 'bg-[#0A0A0A] text-white'
    }`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-20 transition-all border-b glass-header ${
          isLight ? 'border-black/5 bg-[#FAFAFA]/70' : 'border-white/5 bg-[#0A0A0A]/70'
        }`}>
          <div className="flex items-center gap-2 text-label text-[11px] uppercase tracking-widest font-bold">
            <Link href="/dashboard" className={`transition-colors ${isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'}`}>Dashboard</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Partner Settings</span>
          </div>

          <Link href="/dashboard" className={`text-label text-[11px] uppercase tracking-widest font-bold transition-colors ${
            isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
          }`}>
            ← Back to Overview
          </Link>
        </header>

        <main className="p-6 sm:p-12 space-y-8 max-w-4xl mx-auto w-full animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-label text-[10px] uppercase font-bold px-3 py-1 rounded-2xl border flex items-center gap-1.5 ${
                isLight ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" /> FSSAI COMPLIANT RESTAURANT
              </span>
            </div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Restaurant Partner Settings & Licenses
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">Manage FSSAI license details, GSTIN, Google Place ID, and reservation channels.</p>
          </div>

          {saved && (
            <div className={`p-4 rounded-[24px] border text-body text-[11px] uppercase tracking-widest font-bold font-bold flex items-center gap-2.5 animate-fade-in ${
              isLight ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]' : 'bg-[#092615] border-[#0f4424] text-[#10b981]'
            }`}>
              <Check className="w-5 h-5" /> Partner settings and government license data saved successfully.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Government License & FSSAI Section */}
            <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                <ShieldCheck className={`w-4 h-4 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> Government Licenses & FSSAI Registration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    FSSAI License Number (14 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] font-mono outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    required
                    value={gstinNumber}
                    onChange={(e) => setGstinNumber(e.target.value)}
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] font-mono outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Google Places API Link Section */}
            <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <div>
                <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2 ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}>
                  <MapPin className={`w-4 h-4 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> Google Place ID Linking
                </h2>
                <p className={`text-body text-[13px] ${isLight ? 'text-[#666666]' : 'text-[#aaaaaa]'}`}>
                  Per Google Places API terms, restaurant ratings, photos, and address are fetched live at render time via server proxy.
                </p>
              </div>

              <div>
                <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>
                  Google Place ID
                </label>
                <input
                  type="text"
                  required
                  value={googlePlaceId}
                  onChange={(e) => setGooglePlaceId(e.target.value)}
                  className={`block w-full max-w-sm rounded-[24px] px-4 py-3 text-body text-[13px] font-mono outline-none transition-all ${
                    isLight 
                      ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                      : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                  }`}
                />
              </div>
            </div>

            {/* General Profile Section */}
            <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                Restaurant Details & Booking Deep Links
              </h2>

              <div>
                <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>
                  Restaurant Display Name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                    isLight 
                      ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                      : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    Phone Call Booking Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    WhatsApp Deep Link Number
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <input
                  type="checkbox"
                  id="bookableToggle"
                  checked={isBookable}
                  onChange={(e) => setIsBookable(e.target.checked)}
                  className={`w-5 h-5 rounded border cursor-pointer ${
                    isLight ? 'accent-[#D62828]' : 'accent-[#FFB703]'
                  }`}
                />
                <label htmlFor="bookableToggle" className={`text-body text-[13px] font-bold cursor-pointer select-none ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}>
                  Enable Direct Table Seat Reservations on Mobile App & Explorer Web
                </label>
              </div>
            </div>

            {/* Platform Emergency & Maintenance Mode Section */}
            <div className={`p-8 rounded-[32px] border transition-all ${
              isLight ? 'bg-white border-black/5 shadow-sm' : 'bg-[#141414] border-white/5 shadow-none'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`text-h3 text-[17px] tracking-tight ${isLight ? 'text-[#111111]' : 'text-white'}`}>
                    Platform Maintenance & Emergency Controls
                  </h3>
                  <p className={`text-body text-[12px] mt-1 ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
                    Place your restaurant ordering or explorer public pages in maintenance mode during rush hours or upgrades.
                  </p>
                </div>
                <Link
                  href="/maintenance"
                  className="px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-all shrink-0"
                >
                  Preview Maintenance Page
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                className={`px-8 py-3.5 rounded-[24px] text-label text-[13px] uppercase tracking-wider font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  isLight
                    ? 'bg-[#111111] hover:bg-black text-white shadow-black/10 hover:shadow-black/20'
                    : 'bg-white hover:bg-[#F3F4F6] text-black shadow-white/10 hover:shadow-white/20'
                }`}
              >
                Save Partner Settings & Licenses
              </button>

              <Link href="/legal/terms" className={`text-label text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors ${
                isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
              }`}>
                <FileText className="w-4 h-4" /> View Legal Terms
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
