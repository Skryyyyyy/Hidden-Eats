'use client';

import React, { useState } from 'react';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import { Radio, Clock, Users, Flame, Check } from 'lucide-react';

export default function LiveCrowdRadarPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [checkInSuccess, setCheckInSuccess] = useState(false);

  const spots = [
    {
      name: 'Grand Secret Kitchen',
      crowd: 'Busy',
      crowdColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      waitTime: '15 - 20 min wait',
      lastUpdated: '12 mins ago (8 check-ins)',
    },
    {
      name: 'Alleyway Street Bakes',
      crowd: 'Moderate',
      crowdColor: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
      waitTime: '5 min wait',
      lastUpdated: '4 mins ago (14 check-ins)',
    },
    {
      name: 'Café De Quietude',
      crowd: 'Low',
      crowdColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      waitTime: 'No wait',
      lastUpdated: 'Just now (5 check-ins)',
    },
  ];

  const handleCheckIn = () => {
    setCheckInSuccess(true);
    setTimeout(() => setCheckInSuccess(false), 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      <main className="max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-6 flex-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1 mb-1">
            <Radio className="w-3.5 h-3.5 text-[#f59e0b] animate-pulse" /> LIVE DINER CROWD RADAR
          </span>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Real-Time Venue Crowd & Wait Times
          </h1>
          <p className="text-xs text-[#777777] mt-1">Aggregated live check-ins from diners over the last 2 hours.</p>
        </div>

        {checkInSuccess && (
          <div className="p-3 bg-[#092615] border border-[#0f4424] rounded-xl text-xs text-[#10b981] flex items-center gap-2">
            <Check className="w-4 h-4" /> Live check-in submitted! Explorer XP added to your profile.
          </div>
        )}

        <div className="space-y-4">
          {spots.map((spot, idx) => (
            <div
              key={idx}
              className={`border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                isLight ? 'bg-white border-slate-200 hover:shadow-lg' : 'bg-[#0a0a0a] border-[#1c1c1c]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{spot.name}</h2>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${spot.crowdColor}`}>
                    ● {spot.crowd}
                  </span>
                </div>
                <p className="text-xs text-[#888888] mt-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#f59e0b]" /> Predicted Wait: <strong className="text-white">{spot.waitTime}</strong>
                </p>
                <span className="text-[10px] text-[#555555] mt-1 block">Updated: {spot.lastUpdated}</span>
              </div>

              <button
                onClick={handleCheckIn}
                className="px-4 py-2 bg-[#181818] hover:bg-[#222222] text-[#cccccc] font-semibold text-xs rounded-xl border border-[#2a2a2a] transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Users className="w-3.5 h-3.5 text-[#f59e0b]" /> Post Live Check-In
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
