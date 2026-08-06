'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { ShieldCheck, Building2, Users, MapPin, CreditCard, Check, ChevronRight } from 'lucide-react';

export default function PartnerProfilePage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [businessName, setBusinessName] = useState('Grand Secret Kitchen');
  const [ownerName, setOwnerName] = useState('Balamurugan (Owner)');
  const [email, setEmail] = useState('owner@hiddeneats.com');
  const [staffRole, setStaffRole] = useState<'owner' | 'manager' | 'chef'>('owner');
  const [googlePlaceId, setGooglePlaceId] = useState('ChIJN1t_tDeuEmsRUsoyG83frY4');
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
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
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Partner Profile</span>
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
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED RESTAURANT PARTNER
              </span>
            </div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Restaurant Partner Profile & Access
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">Manage your business credentials, linked Google Place ID, and staff roles.</p>
          </div>

          {saved && (
            <div className={`p-4 rounded-[24px] border text-body text-[11px] uppercase tracking-widest font-bold font-bold flex items-center gap-2.5 animate-fade-in ${
              isLight ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]' : 'bg-[#092615] border-[#0f4424] text-[#10b981]'
            }`}>
              <Check className="w-5 h-5" /> Partner profile updated successfully.
            </div>
          )}

          {/* Multi-Branch Franchise Venues Section */}
          <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
            isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className={`text-card-title text-lg ${isLight ? 'text-[#111111]' : 'text-white'}`}>
                Managed Restaurant Branches <span className="text-[13px] font-normal opacity-60 ml-2">(3 Locations)</span>
              </h3>
              <button className={`px-5 py-2.5 rounded-[24px] text-label text-[11px] uppercase tracking-widest font-bold uppercase tracking-wider font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isLight
                  ? 'bg-[#111111] hover:bg-black text-white shadow-black/10 hover:shadow-black/20'
                  : 'bg-white hover:bg-[#F3F4F6] text-black shadow-white/10 hover:shadow-white/20'
              }`}>
                + Add Branch Location
              </button>
            </div>

            <div className="space-y-4">
              {[
                { 
                  name: 'Grand Secret Kitchen — Indiranagar', 
                  badge: 'PRIMARY', 
                  address: '44 Corner Lane, Indiranagar • Place ID: ChIJN1t_tDeuEms...', 
                  isPrimary: true 
                },
                { 
                  name: 'Grand Secret Kitchen — Koramangala', 
                  badge: 'BRANCH 2', 
                  address: '88 Peace Haven, Koramangala • Place ID: ChIJ88t_vD...', 
                  isPrimary: false 
                },
                { 
                  name: 'Grand Secret Kitchen — Brigade Road', 
                  badge: 'BRANCH 3', 
                  address: '12-A Secret Alley, Off Brigade Road • Place ID: ChIJ12t_...', 
                  isPrimary: false 
                },
              ].map((branch, index) => (
                <div key={index} className={`p-5 border rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:shadow-sm ${
                  branch.isPrimary 
                    ? isLight ? 'bg-gradient-to-r from-[#FFF3E8] to-white border-[#D62828]/20' : 'bg-gradient-to-r from-[#261c07] to-[#131A2C] border-[#FFB703]/30'
                    : isLight ? 'bg-[#FAFAFA] border-black/5' : 'bg-[#0A0A0A] border-white/5'
                }`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-card-title text-[15px] ${isLight ? 'text-[#111111]' : 'text-white'}`}>{branch.name}</span>
                      <span className={`text-label text-[9px] font-bold px-2 py-1 rounded-2xl border ${
                        branch.isPrimary 
                          ? isLight ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
                          : isLight ? 'bg-white border-black/10 text-[#666666]' : 'bg-[#111111] border-white/5 text-[#888888]'
                      }`}>{branch.badge}</span>
                    </div>
                    <p className={`text-body text-[13px] mt-1.5 ${isLight ? 'text-[#666666]' : 'text-[#777777]'}`}>{branch.address}</p>
                  </div>
                  <span className={`text-label text-[11px] uppercase tracking-widest font-bold uppercase font-bold flex items-center gap-1.5 shrink-0 ${
                    isLight ? 'text-[#16A34A]' : 'text-[#10b981]'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_5px_currentColor]" /> Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Partner Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
              isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
            }`}>
              <h3 className={`text-card-title text-lg ${isLight ? 'text-[#111111]' : 'text-white'}`}>
                Business Identity & Staff Roles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                    isLight ? 'text-[#666666]' : 'text-[#888888]'
                  }`}>
                    Restaurant Legal / Brand Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                    Primary Owner / Manager Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                      isLight 
                        ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                        : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>
                  Staff Role Level
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all appearance-none cursor-pointer ${
                    isLight 
                      ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                      : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                  }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${isLight ? '%236B7280' : '%23888888'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="owner">Primary Owner (Full Access)</option>
                  <option value="manager">Restaurant Manager (Reservations & Orders)</option>
                  <option value="chef">Head Chef (Off-Menu Items Only)</option>
                </select>
              </div>

              <div>
                <label className={`block text-label text-[11px] uppercase tracking-wider mb-1.5 ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>
                  Business Notification Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-[24px] px-4 py-3 text-body text-[13px] outline-none transition-all ${
                    isLight 
                      ? 'bg-[#FAFAFA] border border-black/5 text-[#111111] focus:border-[#D62828]' 
                      : 'bg-[#0A0A0A] border border-white/5 text-white focus:border-[#FFB703]'
                  }`}
                />
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
              Save Partner Credentials
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
