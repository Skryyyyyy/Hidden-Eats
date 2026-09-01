'use client';

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { TrendingUp, Users, Award, ShieldCheck, Sparkles, BarChart3, Radar, Zap, ChevronRight } from 'lucide-react';

export default function PartnerAnalyticsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const competitorRadar = [
    { rank: 1, name: 'Grand Secret Kitchen (Your Venue)', gemScore: 9.4, reviewsCount: 342, status: '🏆 #1 Leader' },
    { rank: 2, name: 'Alleyway Street Bakes', gemScore: 8.9, reviewsCount: 210, status: 'Competitor' },
    { rank: 3, name: 'Café De Quietude', gemScore: 8.7, reviewsCount: 185, status: 'Competitor' },
    { rank: 4, name: 'Indiranagar Secret Bistro', gemScore: 8.4, reviewsCount: 140, status: 'Competitor' },
    { rank: 5, name: 'Corner Spice House', gemScore: 8.1, reviewsCount: 98, status: 'Competitor' },
  ];

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
            <span className={isLight ? 'text-[#111111] font-bold' : 'text-white font-bold'}>Business Intelligence & AI Radar</span>
          </div>

          <Link href="/dashboard" className={`text-label text-[11px] uppercase tracking-widest font-bold transition-colors ${
            isLight ? 'text-[#666666] hover:text-[#111111]' : 'text-[#888888] hover:text-white'
          }`}>
            ← Back to Overview
          </Link>
        </header>

        <main className="p-6 sm:p-12 space-y-8 max-w-6xl mx-auto w-full animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-label text-[10px] px-3 py-1 rounded-2xl font-bold uppercase tracking-widest flex items-center gap-1.5 border ${
                isLight ? 'bg-[#F3F4F6] text-[#111111] border-[#D62828]/20' : 'bg-[#1A1A1A] text-white border-[#FFB703]/30'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> AI DEMAND & INVENTORY PREDICTOR
              </span>
            </div>
            <h1 className={`text-h1 text-4xl tracking-tight mb-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
              Restaurant Business Intelligence
            </h1>
            <p className="text-body text-[13px] text-[#666666] dark:text-[#aaaaaa]">AI demand forecasts and 3km radius competitor benchmarking.</p>
          </div>

          {/* 🔮 AI Ingredient Inventory Predictor Card */}
          <div className={`border rounded-[32px] p-8 space-y-6 shadow-md transition-all hover:shadow-lg ${
            isLight ? 'bg-gradient-to-br from-[#FFF3E8] via-white to-[#FFF8F1] border-[#D62828]/20' : 'bg-gradient-to-r from-[#241a08] via-[#0d0a04] to-[#0a0a0a] border-[#382607]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[24px] flex items-center justify-center shrink-0 ${
                  isLight ? 'bg-[#111111]/10' : 'bg-white/10'
                }`}>
                  <Zap className={`w-5 h-5 animate-pulse ${isLight ? 'text-[#111111]' : 'text-white'}`} />
                </div>
                <h2 className={`text-card-title text-lg ${isLight ? 'text-[#111111]' : 'text-white'}`}>AI Kitchen Demand & Prep Prediction <span className="opacity-70 font-normal text-[13px]">for Friday Night</span></h2>
              </div>
              <span className={`text-label text-[10px] uppercase font-bold px-4 py-1.5 rounded-2xl border flex items-center gap-1.5 shrink-0 ${
                isLight ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-[#092615] text-[#10b981] border-[#0f4424]'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_5px_currentColor]" /> +28% EXPECTED TRAFFIC SPIKE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className={`p-6 border rounded-[32px] transition-colors ${
                isLight ? 'bg-white border-black/5 hover:border-[#D62828]/30' : 'bg-[#111111] border-white/5 hover:border-[#FFB703]/30'
              }`}>
                <span className={`text-label text-[11px] font-bold uppercase tracking-wider block ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>Recommended Biryani Prep</span>
                <span className={`text-h2 text-4xl tracking-tight block mt-2 mb-1 ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}>45 Portions</span>
                <span className={`text-body text-[11px] font-bold block ${
                  isLight ? 'text-[#16A34A]' : 'text-[#10b981]'
                }`}>Estimated 100% Sellout by 9:30 PM</span>
              </div>
              <div className={`p-6 border rounded-[32px] transition-colors ${
                isLight ? 'bg-white border-black/5 hover:border-black/20' : 'bg-[#111111] border-white/5 hover:border-[#3b4c6b]'
              }`}>
                <span className={`text-label text-[11px] font-bold uppercase tracking-wider block ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>Recommended Chili Wings Prep</span>
                <span className={`text-h2 text-4xl tracking-tight block mt-2 mb-1 ${
                  isLight ? 'text-[#111111]' : 'text-white'
                }`}>30 Portions</span>
                <span className={`text-body text-[11px] block ${
                  isLight ? 'text-[#666666]' : 'text-[#777777]'
                }`}>Based on last weekend's check-ins</span>
              </div>
              <div className={`p-6 border rounded-[32px] transition-colors ${
                isLight ? 'bg-white border-black/5 hover:border-[#16A34A]/30' : 'bg-[#111111] border-white/5 hover:border-[#10b981]/30'
              }`}>
                <span className={`text-label text-[11px] font-bold uppercase tracking-wider block ${
                  isLight ? 'text-[#666666]' : 'text-[#888888]'
                }`}>Projected Night Revenue</span>
                <span className={`text-price text-4xl tracking-tight block mt-2 mb-1 ${
                  isLight ? 'text-[#16A34A]' : 'text-[#10b981]'
                }`}>₹22,400</span>
                <span className={`text-body text-[11px] font-bold block ${
                  isLight ? 'text-[#16A34A]' : 'text-[#10b981]'
                }`}>Direct Dine-in & Pre-Orders</span>
              </div>
            </div>
          </div>

          {/* 🗺️ Customer Discovery Heatmap & Peak Traffic Distribution */}
          <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
            isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-card-title text-lg flex items-center gap-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
                <TrendingUp className={`w-5 h-5 ${isLight ? 'text-[#111111]' : 'text-[#f59e0b]'}`} /> Customer Discovery Heatmap & Traffic Origins
              </h2>
              <span className={`text-label text-[11px] uppercase tracking-widest font-bold ${isLight ? 'text-[#666666]' : 'text-emerald-400'}`}>
                🔥 Peak: 7:30 PM - 10:00 PM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Indiranagar (0-2km)</span>
                <span className="text-xl font-black text-white block">48%</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#f59e0b] h-full w-[48%]" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Koramangala (3-5km)</span>
                <span className="text-xl font-black text-white block">26%</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[26%]" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">MG Road Corridor</span>
                <span className="text-xl font-black text-white block">16%</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[16%]" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">Other Districts</span>
                <span className="text-xl font-black text-white block">10%</span>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[10%]" />
                </div>
              </div>
            </div>
          </div>

          {/* 📊 Competitor Gem Radar Benchmarking */}
          <div className={`border rounded-[32px] p-8 space-y-6 shadow-sm transition-colors ${
            isLight ? 'bg-white border-black/5' : 'bg-[#111111] border-white/5'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-card-title text-lg flex items-center gap-2 ${isLight ? 'text-[#111111]' : 'text-white'}`}>
                <Radar className={`w-5 h-5 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> Competitor Gem Radar <span className="opacity-60 text-[13px] font-normal">(Within 3km)</span>
              </h2>
              <span className={`text-label text-[11px] uppercase tracking-widest font-bold ${isLight ? 'text-[#666666]' : 'text-[#777777]'}`}>Updated Live</span>
            </div>

            <div className="space-y-3">
              {competitorRadar.map((comp) => (
                <div
                  key={comp.rank}
                  className={`p-5 rounded-[32px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${
                    comp.rank === 1 
                      ? isLight 
                        ? 'bg-[#F3F4F6] border-[#D62828]/30 shadow-sm shadow-[#D62828]/10 scale-[1.01]' 
                        : 'bg-[#181206] border-[#FFB703]/50 shadow-md shadow-[#FFB703]/10 scale-[1.01]'
                      : isLight 
                        ? 'bg-white border-black/5 hover:border-black/15' 
                        : 'bg-[#0A0A0A] border-white/5 hover:border-[#3b4c6b]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-[24px] flex items-center justify-center font-bold text-[13px] shrink-0 shadow-sm ${
                      comp.rank === 1 
                        ? isLight ? 'bg-[#111111] text-white' : 'bg-white text-black' 
                        : isLight ? 'bg-[#F3F4F6] text-[#4B5563]' : 'bg-[#111111] text-[#888888] border border-white/5'
                    }`}>
                      #{comp.rank}
                    </span>
                    <div>
                      <span className={`text-card-title text-[15px] block ${isLight ? 'text-[#111111]' : 'text-white'}`}>{comp.name}</span>
                      <span className={`text-body text-[11px] mt-0.5 block ${isLight ? 'text-[#666666]' : 'text-[#777777]'}`}>{comp.reviewsCount} Verified Reviews</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <span className={`text-price text-lg font-bold flex items-center gap-1.5 ${
                      isLight ? 'text-[#111111]' : 'text-white'
                    }`}>
                      <Sparkles className={`w-4 h-4 ${isLight ? 'text-[#111111]' : 'text-white'}`} /> {comp.gemScore} GEM
                    </span>
                    <span className={`text-label text-[10px] uppercase font-bold px-3 py-1 rounded-2xl border ${
                      comp.rank === 1 
                        ? isLight ? 'bg-[#F3F4F6] text-[#111111] border-[#D62828]/30' : 'bg-[#1A1A1A] text-white border-[#FFB703]/40' 
                        : isLight ? 'bg-[#F3F4F6] text-[#666666] border-black/5' : 'bg-[#111111] text-[#888888] border-white/5'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
