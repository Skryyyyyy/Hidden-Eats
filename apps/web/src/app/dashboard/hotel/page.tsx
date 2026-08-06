'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { Building2, Car, Wifi, Music, AirVent, ShieldCheck, Check, ChevronRight } from 'lucide-react';

export default function HotelVenueManagementPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [valetParking, setValetParking] = useState(true);
  const [outdoorSeating, setOutdoorSeating] = useState(true);
  const [liveMusic, setLiveMusic] = useState(false);
  const [airConditioned, setAirConditioned] = useState(true);
  const [freeWifi, setFreeWifi] = useState(true);
  const [maxDiningCapacity, setMaxDiningCapacity] = useState('80');
  const [saved, setSaved] = useState(false);

  const handleSaveVenue = (e: React.FormEvent) => {
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
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Venue Management</span>
          </div>

          <Link href="/dashboard" className={`text-label text-[11px] uppercase tracking-widest font-bold transition-colors ${
            isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
          }`}>
            ← Back to Overview
          </Link>
        </header>

        <main className="p-6 sm:p-12 space-y-8 max-w-4xl mx-auto w-full animate-fade-in">
          <div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Venue & Hotel Management
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">
              Configure dining capacity, valet parking, amenities, and venue features displayed on mobile app tags.
            </p>
          </div>

          {saved && (
            <div className={`p-4 rounded-[24px] border text-body text-[11px] uppercase tracking-widest font-bold font-bold flex items-center gap-2.5 animate-fade-in ${
              isLight ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]' : 'bg-[#092615] border-[#0f4424] text-[#10b981]'
            }`}>
              <Check className="w-5 h-5" /> Venue & Hotel configurations saved successfully.
            </div>
          )}

          <form onSubmit={handleSaveVenue} className="space-y-8">
            {/* Dining Capacity */}
            <div className={`border rounded-[32px] p-8 shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                <Building2 className={`w-4 h-4 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> Dining Seating Capacity
              </h2>

              <div>
                <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>
                  Maximum Concurrent Seating Capacity
                </label>
                <input
                  type="number"
                  value={maxDiningCapacity}
                  onChange={(e) => setMaxDiningCapacity(e.target.value)}
                  className={`block w-full max-w-sm rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                    isLight 
                      ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                      : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                  }`}
                />
              </div>
            </div>

            {/* Venue Amenities Checklist */}
            <div className={`border rounded-[32px] p-8 shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <h2 className={`text-label text-[11px] font-bold uppercase tracking-wider mb-6 ${
                isLight ? 'text-[#111111]' : 'text-white'
              }`}>
                Venue Amenities & Facilities
              </h2>

              <div className="space-y-4">
                {[
                  { id: 'valet', label: 'Valet Parking Available', icon: Car, checked: valetParking, setChecked: setValetParking },
                  { id: 'outdoor', label: 'Outdoor / Rooftop Seating', icon: Building2, checked: outdoorSeating, setChecked: setOutdoorSeating },
                  { id: 'music', label: 'Live Music / Acoustic Nights', icon: Music, checked: liveMusic, setChecked: setLiveMusic },
                  { id: 'ac', label: 'Fully Air Conditioned', icon: AirVent, checked: airConditioned, setChecked: setAirConditioned },
                  { id: 'wifi', label: 'Complimentary High-Speed Wifi', icon: Wifi, checked: freeWifi, setChecked: setFreeWifi },
                ].map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-center justify-between p-4 border rounded-[24px] transition-colors cursor-pointer hover:shadow-sm ${
                      item.checked 
                        ? isLight ? 'bg-[#F3F4F6] border-[#D62828]/20' : 'bg-[#1A1A1A] border-[#3a2c0c]' 
                        : isLight ? 'bg-[#FAFAFA] border-black/5 hover:border-black/15' : 'bg-[#0A0A0A] border-white/5 hover:border-[#3b4c6b]'
                    }`}
                    onClick={() => item.setChecked(!item.checked)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${
                        item.checked 
                          ? isLight ? 'text-[#111111]' : 'text-white' 
                          : isLight ? 'text-[#666666]' : 'text-[#888888]'
                      }`} />
                      <span className={`text-card-title text-[15px] ${
                        item.checked 
                          ? isLight ? 'text-[#111111]' : 'text-white'
                          : isLight ? 'text-[#4B5563]' : 'text-[#aaaaaa]'
                      }`}>{item.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setChecked(e.target.checked)}
                      className={`w-5 h-5 rounded border ${
                        isLight ? 'accent-[#D62828]' : 'accent-[#FFB703]'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className={`px-8 py-3.5 rounded-[24px] text-label text-[13px] uppercase tracking-wider font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isLight
                  ? 'bg-[#111111] hover:bg-black text-white shadow-black/10 hover:shadow-black/20'
                  : 'bg-white hover:bg-[#F3F4F6] text-black shadow-white/10 hover:shadow-white/20'
              }`}
            >
              Save Venue Features
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
