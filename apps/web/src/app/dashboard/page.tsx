'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { ChevronRight, Search, Plus, Calendar, Star, TrendingUp, Users, ChevronDown, Check, Zap, MapPin } from 'lucide-react';

export default function NotionDribbbleDashboard() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <div className={`min-h-screen flex font-sans antialiased text-body transition-colors duration-500 selection:bg-black selection:text-white ${
      isLight ? 'bg-[#FAFAFA] text-[#111111]' : 'bg-[#0A0A0A] text-[#FAFAFA]'
    }`}>
      {/* Shared Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Minimal Header Bar */}
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-20 transition-all border-b glass-header backdrop-blur-xl ${
          isLight ? 'border-black/5 bg-white/70' : 'border-white/5 bg-[#0A0A0A]/70'
        }`}>
          <div className="flex items-center gap-3 text-label text-[11px] uppercase tracking-widest font-bold">
            <Link href="/dashboard" className={`transition-colors ${isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'}`}>Workspace</Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" strokeWidth={3} />
            <span className={isLight ? 'text-[#666666]' : 'text-[#888888]'}>Grand Secret Kitchen</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" strokeWidth={3} />
            <span className={isLight ? 'text-[#111111]' : 'text-white'}>Overview</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <Search className="w-4 h-4 opacity-40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search database..."
                className={`w-56 sm:w-72 rounded-full border pl-11 pr-5 py-2.5 text-body text-[13px] outline-none transition-all shadow-sm focus:ring-4 focus:ring-black/5 ${
                  isLight
                    ? 'bg-white border-black/5 text-[#111111] placeholder-[#9CA3AF] focus:border-black/20 focus:bg-white'
                    : 'bg-[#111111] border-white/5 text-white placeholder-[#666666] focus:border-white/20 focus:bg-[#1A1A1A] focus:ring-white/5'
                }`}
              />
            </div>
            <Link
              href="/dashboard/menu"
              className={`px-5 py-2.5 rounded-full text-label text-[11px] uppercase tracking-widest font-bold transition-all flex items-center gap-2 shadow-sm hover-lift ${
                isLight
                  ? 'bg-[#111111] hover:bg-black text-white shadow-black/10'
                  : 'bg-white hover:bg-[#F3F4F6] text-black shadow-white/10'
              }`}
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} /> New Dish
            </Link>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="p-8 sm:p-12 space-y-12 max-w-[1440px] mx-auto w-full animate-fade-in">
          {/* Pro Tip Callout Box */}
          <div className={`border rounded-[24px] p-6 flex items-start gap-5 shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
          }`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              isLight ? 'bg-[#F3F4F6] text-[#111111]' : 'bg-[#222222] text-white'
            }`}>
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className={`text-body text-[14px] leading-relaxed pt-1 flex-1 ${isLight ? 'text-[#4B5563]' : 'text-[#A1A1AA]'}`}>
              <strong className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Pro Partner Tip: </strong> 
              Restaurants with at least 2 active secret off-menu items experience a 
              <span className={`font-bold mx-1 ${isLight ? 'text-[#111111]' : 'text-white'}`}>+34% increase</span> 
              in community review engagement.
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <NotionMetricCard
              label="Hidden Gem Score"
              value="9.4"
              subtext="/ 10.0 (Top 2%)"
              change="+0.6"
              icon={<Star className="w-5 h-5" />}
              isLight={isLight}
            />
            <NotionMetricCard
              label="Secret Menu Revenue"
              value="₹48,290"
              subtext="142 orders this month"
              change="+18.2%"
              icon={<TrendingUp className="w-5 h-5" />}
              isLight={isLight}
            />
            <NotionMetricCard
              label="Table Reservations"
              value="38"
              subtext="8 pending confirmation"
              change="+12"
              icon={<Calendar className="w-5 h-5" />}
              isLight={isLight}
            />
            <NotionMetricCard
              label="Live Diner Check-Ins"
              value="184"
              subtext="Peak window 8:00–10:00 PM"
              change="+24"
              icon={<Users className="w-5 h-5" />}
              isLight={isLight}
            />
          </div>

          {/* Database Content Columns */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="xl:col-span-2 space-y-8">
              {/* Table Reservations Database Section */}
              <div className={`border rounded-[32px] p-8 shadow-sm transition-all hover:shadow-md ${
                isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#1A1A1A] border-white/5 text-white'
                    }`}>
                      <Calendar className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-card-title text-xl ${isLight ? 'text-[#111111]' : 'text-white'}`}>Reservations</h3>
                  </div>
                  <Link href="/dashboard/bookings" className={`text-label text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-full transition-colors ${
                    isLight ? 'text-[#666666] hover:text-[#111111] hover:bg-black/5' : 'text-[#888888] hover:text-white hover:bg-white/5'
                  }`}>
                    View all (38)
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-label text-[10px] uppercase tracking-widest ${
                        isLight ? 'border-black/5 text-[#9CA3AF]' : 'border-white/5 text-[#666666]'
                      }`}>
                        <th className="pb-4 pl-4 font-bold">Customer</th>
                        <th className="pb-4 font-bold">Party Size</th>
                        <th className="pb-4 font-bold">Time Slot</th>
                        <th className="pb-4 font-bold">Status</th>
                        <th className="pb-4 pr-4 text-right font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? 'divide-black/5' : 'divide-white/5'}`}>
                      <NotionTableRow
                        name="Rahul Sharma"
                        email="rahul@example.com"
                        party="4 Guests"
                        time="Tonight at 8:30 PM"
                        status="Pending"
                        statusClass={isLight ? 'bg-[#F9FAFB] text-[#4B5563] border-black/10' : 'bg-[#1A1A1A] text-[#A1A1AA] border-white/10'}
                        isLight={isLight}
                      />
                      <NotionTableRow
                        name="Priya Patel"
                        email="priya@example.com"
                        party="2 Guests"
                        time="Tomorrow at 1:00 PM"
                        status="Confirmed"
                        statusClass={isLight ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-[#064E3B] text-[#34D399] border-[#065F46]'}
                        isLight={isLight}
                      />
                      <NotionTableRow
                        name="Vikram Singh"
                        email="vikram@example.com"
                        party="6 Guests"
                        time="Aug 7 at 9:00 PM"
                        status="Confirmed"
                        statusClass={isLight ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-[#064E3B] text-[#34D399] border-[#065F46]'}
                        isLight={isLight}
                      />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Secret Items Catalog */}
              <div className={`border rounded-[32px] p-8 shadow-sm transition-all hover:shadow-md ${
                isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                      isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#1A1A1A] border-white/5 text-white'
                    }`}>
                      <Zap className="w-5 h-5 fill-current" strokeWidth={1} />
                    </div>
                    <h3 className={`text-card-title text-xl ${isLight ? 'text-[#111111]' : 'text-white'}`}>Active Secret Catalog</h3>
                  </div>
                  <Link href="/dashboard/menu" className={`text-label text-[11px] uppercase tracking-widest font-bold px-4 py-2 rounded-full transition-colors ${
                    isLight ? 'text-[#666666] hover:text-[#111111] hover:bg-black/5' : 'text-[#888888] hover:text-white hover:bg-white/5'
                  }`}>
                    Edit Catalog
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className={`border rounded-2xl p-6 flex justify-between items-start transition-colors group cursor-pointer ${
                    isLight ? 'bg-[#FAFAFA] border-transparent hover:border-black/10 hover:bg-white hover:shadow-sm' : 'bg-[#171717] border-transparent hover:border-white/10 hover:bg-[#1C1C1C] hover:shadow-lg'
                  }`}>
                    <div>
                      <span className={`text-label text-[9px] uppercase tracking-[0.2em] block mb-3 font-bold ${
                        isLight ? 'text-[#9CA3AF]' : 'text-[#666666]'
                      }`}>
                        SECRET OFF-MENU
                      </span>
                      <h4 className={`text-card-title text-[15px] leading-snug group-hover:text-black dark:group-hover:text-white ${isLight ? 'text-[#111111]' : 'text-[#FAFAFA]'}`}>Chef's Secret Smoked Biryani</h4>
                      <p className={`text-body text-xs mt-2 ${isLight ? 'text-[#6B7280]' : 'text-[#888888]'}`}>Slow-cooked mutton biryani prepared on request.</p>
                      <span className={`text-price text-[15px] mt-4 block ${isLight ? 'text-[#111111]' : 'text-white'}`}>₹340</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)] mt-1" />
                  </div>

                  <div className={`border rounded-2xl p-6 flex justify-between items-start transition-colors group cursor-pointer ${
                    isLight ? 'bg-[#FAFAFA] border-transparent hover:border-black/10 hover:bg-white hover:shadow-sm' : 'bg-[#171717] border-transparent hover:border-white/10 hover:bg-[#1C1C1C] hover:shadow-lg'
                  }`}>
                    <div>
                      <span className={`text-label text-[9px] uppercase tracking-[0.2em] block mb-3 font-bold ${
                        isLight ? 'text-[#9CA3AF]' : 'text-[#666666]'
                      }`}>
                        SECRET OFF-MENU
                      </span>
                      <h4 className={`text-card-title text-[15px] leading-snug group-hover:text-black dark:group-hover:text-white ${isLight ? 'text-[#111111]' : 'text-[#FAFAFA]'}`}>Midnight Chili Garlic Wings</h4>
                      <p className={`text-body text-xs mt-2 ${isLight ? 'text-[#6B7280]' : 'text-[#888888]'}`}>Fried wings tossed in secret spice blend.</p>
                      <span className={`text-price text-[15px] mt-4 block ${isLight ? 'text-[#111111]' : 'text-white'}`}>₹220</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.4)] mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Side Column */}
            <div className="space-y-8">
              {/* Gem Score Breakdown Section */}
              <div className={`border rounded-[32px] p-8 shadow-sm transition-all hover:shadow-md ${
                isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#1A1A1A] border-white/5 text-white'
                  }`}>
                    <Star className="w-5 h-5 fill-current" strokeWidth={1} />
                  </div>
                  <h3 className={`text-card-title text-xl ${isLight ? 'text-[#111111]' : 'text-white'}`}>Score Breakdown</h3>
                </div>
                <p className={`text-body text-[13px] mb-8 ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>Weighted sub-scores from verified reviews</p>

                <div className="space-y-5">
                  <NotionScoreRow label="Food Quality" weight="(40%)" score="4.9" percent="98%" isLight={isLight} />
                  <NotionScoreRow label="Price Worth" weight="(25%)" score="4.8" percent="96%" isLight={isLight} />
                  <NotionScoreRow label="Consistency" weight="(15%)" score="4.7" percent="94%" isLight={isLight} />
                  <NotionScoreRow label="Service" weight="(10%)" score="4.3" percent="86%" isLight={isLight} />
                  <NotionScoreRow label="Ambience" weight="(10%)" score="4.2" percent="84%" isLight={isLight} />
                </div>
              </div>

              {/* Action Callout */}
              <div className={`border rounded-[32px] p-8 shadow-sm transition-all hover:shadow-md ${
                isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
              }`}>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#1A1A1A] border-white/5 text-white'
                  }`}>
                    <MapPin className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h4 className={`text-card-title text-lg ${isLight ? 'text-[#111111]' : 'text-white'}`}>Google Place ID</h4>
                </div>
                
                <p className={`text-body text-[13px] mb-6 leading-relaxed ${isLight ? 'text-[#666666]' : 'text-[#888888]'}`}>
                  Your restaurant is linked to Place ID <code className={`px-2 py-1 rounded-lg font-mono text-[11px] font-bold border ${
                    isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#1A1A1A] border-white/5 text-white'
                  }`}>ChIJN1t_tDeuEms...</code>
                </p>
                <Link
                  href="/dashboard/settings"
                  className={`w-full py-4 rounded-2xl text-label text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 border hover-lift ${
                    isLight
                      ? 'bg-white border-black/10 text-[#111111] hover:bg-[#FAFAFA] shadow-sm'
                      : 'bg-[#111111] border-white/10 text-white hover:bg-[#1A1A1A] shadow-sm'
                  }`}
                >
                  Manage Settings <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NotionMetricCard({
  label,
  value,
  subtext,
  change,
  icon,
  isLight,
}: {
  label: string;
  value: string;
  subtext: string;
  change: string;
  icon: React.ReactNode;
  isLight: boolean;
}) {
  return (
    <div className={`border rounded-[32px] p-8 flex flex-col justify-between shadow-sm transition-all hover-lift ${
      isLight ? 'bg-white border-black/5 hover:border-black/10' : 'bg-[#111111] border-white/5 hover:border-white/10'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
            isLight ? 'bg-[#FAFAFA] border-black/5 text-[#111111]' : 'bg-[#1A1A1A] border-white/5 text-white'
          }`}>
            {icon}
          </div>
          <span className={`text-label text-[11px] font-bold px-3 py-1.5 rounded-full border tracking-widest ${
            change.startsWith('+') 
              ? isLight ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]' : 'bg-[#064E3B] text-[#34D399] border-[#065F46]'
              : isLight ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : 'bg-[#7F1D1D] text-[#F87171] border-[#991B1B]'
          }`}>
            {change}
          </span>
        </div>
        <div className={`text-hero text-4xl mb-2 tracking-tight ${isLight ? 'text-[#111111]' : 'text-white'}`}>{value}</div>
        <div className={`text-label text-[11px] uppercase tracking-[0.15em] font-bold ${isLight ? 'text-[#9CA3AF]' : 'text-[#666666]'}`}>{label}</div>
      </div>
      <div className={`text-body text-[13px] mt-6 pt-5 border-t ${isLight ? 'border-black/5 text-[#6B7280]' : 'border-white/5 text-[#888888]'}`}>
        {subtext}
      </div>
    </div>
  );
}

function NotionTableRow({
  name,
  email,
  party,
  time,
  status,
  statusClass,
  isLight,
}: {
  name: string;
  email: string;
  party: string;
  time: string;
  status: string;
  statusClass: string;
  isLight: boolean;
}) {
  return (
    <tr className={`group transition-colors ${isLight ? 'hover:bg-[#FAFAFA]' : 'hover:bg-[#1A1A1A]'}`}>
      <td className="py-5 pl-4 rounded-l-2xl">
        <div className={`text-card-title text-[15px] ${isLight ? 'text-[#111111]' : 'text-white'}`}>{name}</div>
        <div className={`text-body text-[12px] mt-1 ${isLight ? 'text-[#6B7280]' : 'text-[#888888]'}`}>{email}</div>
      </td>
      <td className={`py-5 text-body text-[14px] ${isLight ? 'text-[#4B5563]' : 'text-[#A1A1AA]'}`}>{party}</td>
      <td className={`py-5 text-body text-[14px] ${isLight ? 'text-[#4B5563]' : 'text-[#A1A1AA]'}`}>{time}</td>
      <td className="py-5">
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2 w-max ${statusClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" /> {status}
        </span>
      </td>
      <td className="py-5 pr-4 text-right rounded-r-2xl">
        <Link href="/dashboard/bookings" className={`inline-block px-5 py-2.5 rounded-xl text-label text-[11px] uppercase tracking-widest font-bold transition-all border shadow-sm hover-lift ${
          isLight
            ? 'bg-white border-black/10 text-[#111111] hover:bg-[#FAFAFA]'
            : 'bg-[#111111] border-white/10 text-white hover:bg-[#1A1A1A]'
        }`}>
          Manage
        </Link>
      </td>
    </tr>
  );
}

function NotionScoreRow({ label, weight, score, percent, isLight }: { label: string; weight: string; score: string; percent: string; isLight: boolean }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className={`text-label uppercase text-[10px] tracking-widest font-bold ${isLight ? 'text-[#666666]' : 'text-[#9CA3AF]'}`}>
          {label} <span className={isLight ? 'text-[#9CA3AF]' : 'text-[#666666]'}>{weight}</span>
        </span>
        <span className={`text-card-title text-[15px] ${isLight ? 'text-[#111111]' : 'text-white'}`}>
          {score} <span className={`text-[11px] ${isLight ? 'text-[#9CA3AF]' : 'text-[#666666]'}`}>/ 5.0</span>
        </span>
      </div>
      <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-[#F3F4F6]' : 'bg-[#222222]'}`}>
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
          isLight ? 'bg-[#111111]' : 'bg-white'
        }`} style={{ width: percent }} />
      </div>
    </div>
  );
}
