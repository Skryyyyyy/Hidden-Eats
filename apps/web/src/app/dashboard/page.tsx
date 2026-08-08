'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';

export default function FoodStyleDashboard() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [searchFilter, setSearchFilter] = useState('');

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 selection:bg-[#E93B3B] selection:text-white ${
      isLight ? 'bg-[#FAFAFA] text-black' : 'bg-[#111111] text-white'
    }`}>
      {/* Shared Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className={`h-20 px-8 flex items-center justify-between sticky top-0 z-20 transition-all border-b backdrop-blur-xl ${
          isLight ? 'border-black/10 bg-white/90' : 'border-white/10 bg-[#111111]/90'
        }`}>
           <h1 className={`font-display text-2xl md:text-3xl tracking-wide uppercase ${isLight ? 'text-black/90' : 'text-white/90'}`}>
             WORKSPACE
           </h1>
           
           <div className="flex items-center gap-6">
             <input
                type="text"
                placeholder="SEARCH DATABASE"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`w-48 md:w-64 rounded-lg border px-4 py-2 font-display uppercase tracking-widest text-xs outline-none transition-all ${
                  isLight 
                    ? 'border-black/20 bg-transparent focus:border-black/50 text-black placeholder:text-black/50' 
                    : 'border-white/20 bg-transparent focus:border-white/50 text-white placeholder:text-white/50'
                }`}
             />
             <Link href="/dashboard/menu" className="bg-[#f8b11c] text-black px-6 py-2 rounded-lg font-display uppercase tracking-widest text-xs hover:bg-[#e0a019] transition-colors duration-300">
                + NEW DISH
             </Link>
           </div>
        </header>

        {/* Workspace Body */}
        <main className="p-8 space-y-12 max-w-[1440px] mx-auto w-full animate-fade-in">
           
           {/* Pro Tip Callout Box */}
           <div className={`rounded-2xl p-6 border ${isLight ? 'bg-white border-black/10' : 'bg-[#1c1c1c] border-white/10'}`}>
             <h2 className={`font-display text-xl uppercase tracking-wide mb-2 ${isLight ? 'text-black/90' : 'text-white/90'}`}>
               PRO TIP
             </h2>
             <p className={`font-sans text-sm md:text-base font-semibold opacity-90 ${isLight ? 'text-black/70' : 'text-white/70'}`}>
               Restaurants with at least 2 active secret off-menu items experience a 34% increase in community review engagement. Keep them guessing.
             </p>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <FoodMetricCard title="GEM SCORE" value="9.4" subtext="/ 10.0 (TOP 2%)" isLight={isLight} color="yellow" />
              <FoodMetricCard title="REVENUE" value="₹48K" subtext="142 ORDERS" isLight={isLight} color="red" />
              <FoodMetricCard title="BOOKINGS" value="38" subtext="8 PENDING" isLight={isLight} color="dark" />
              <FoodMetricCard title="CHECK-INS" value="184" subtext="LIVE NOW" isLight={isLight} color="light" />
           </div>

           {/* Content Columns */}
           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Main Content Column */}
              <div className="xl:col-span-2 space-y-8">
                 
                 {/* Table Reservations Section */}
                 <div>
                    <div className="flex items-end justify-between mb-6">
                       <h2 className={`font-display text-2xl md:text-3xl tracking-wide uppercase ${isLight ? 'text-black/90' : 'text-white/90'}`}>
                         RESERVATIONS
                       </h2>
                       <Link href="/dashboard/bookings" className={`font-display text-sm tracking-widest uppercase hover:underline ${
                          isLight ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
                       }`}>
                         VIEW ALL
                       </Link>
                    </div>

                    <div className={`overflow-x-auto rounded-2xl border ${isLight ? 'bg-white border-black/10' : 'bg-[#1c1c1c] border-white/10'}`}>
                       <table className="w-full text-left">
                          <thead>
                             <tr className={`border-b ${isLight ? 'border-black/10' : 'border-white/10'} font-display uppercase tracking-widest text-sm`}>
                                <th className={`p-4 font-normal ${isLight ? 'text-black/70' : 'text-white/70'}`}>GUEST</th>
                                <th className={`p-4 font-normal ${isLight ? 'text-black/70' : 'text-white/70'}`}>SIZE</th>
                                <th className={`p-4 font-normal ${isLight ? 'text-black/70' : 'text-white/70'}`}>TIME</th>
                                <th className={`p-4 font-normal ${isLight ? 'text-black/70' : 'text-white/70'}`}>STATUS</th>
                             </tr>
                          </thead>
                          <tbody className="font-sans font-medium text-sm">
                             <FoodTableRow guest="Rahul Sharma" size="4 Guests" time="Tonight, 8:30 PM" status="PENDING" isLight={isLight} />
                             <FoodTableRow guest="Priya Patel" size="2 Guests" time="Tmrw, 1:00 PM" status="CONFIRMED" isLight={isLight} />
                             <FoodTableRow guest="Vikram Singh" size="6 Guests" time="Aug 7, 9:00 PM" status="CONFIRMED" isLight={isLight} />
                          </tbody>
                       </table>
                    </div>
                 </div>

              </div>

              {/* Side Column */}
              <div className="space-y-8">
                 
                 {/* Gem Score Breakdown Section */}
                 <div className={`rounded-2xl p-6 border ${isLight ? 'bg-white border-black/10' : 'bg-[#1c1c1c] border-white/10'}`}>
                    <h2 className={`font-display text-2xl md:text-3xl tracking-wide uppercase mb-6 ${isLight ? 'text-black/90' : 'text-white/90'}`}>
                      BREAKDOWN
                    </h2>
                    
                    <div className="space-y-6">
                       <ScoreRow label="FOOD QUALITY" score="4.9" percent="98%" isLight={isLight} color="red" />
                       <ScoreRow label="PRICE WORTH" score="4.8" percent="96%" isLight={isLight} color="yellow" />
                       <ScoreRow label="CONSISTENCY" score="4.7" percent="94%" isLight={isLight} color="red" />
                       <ScoreRow label="SERVICE" score="4.3" percent="86%" isLight={isLight} color="yellow" />
                       <ScoreRow label="AMBIENCE" score="4.2" percent="84%" isLight={isLight} color="red" />
                    </div>
                 </div>

              </div>
           </div>

        </main>
      </div>
    </div>
  );
}

function FoodMetricCard({ title, value, subtext, isLight, color }: any) {
  return (
    <div className={`rounded-2xl p-6 flex flex-col justify-between border transition-colors ${
      isLight ? 'bg-white border-black/10 hover:border-black/30' : 'bg-[#1c1c1c] border-white/10 hover:border-white/30'
    }`}>
      <div>
        <h3 className={`font-display text-sm uppercase tracking-widest mb-2 ${isLight ? 'text-black/60' : 'text-white/60'}`}>{title}</h3>
        <div className={`font-display text-4xl uppercase tracking-wide mb-4 ${isLight ? 'text-black' : 'text-white'}`}>{value}</div>
      </div>
      <div className={`font-sans font-semibold uppercase tracking-widest text-[10px] border-t pt-4 ${isLight ? 'border-black/10 text-black/60' : 'border-white/10 text-white/60'}`}>
        {subtext}
      </div>
    </div>
  );
}

function FoodTableRow({ guest, size, time, status, isLight }: any) {
  return (
    <tr className={`border-b last:border-0 ${isLight ? 'border-black/5 hover:bg-black/5' : 'border-white/5 hover:bg-white/5'} transition-colors`}>
       <td className={`p-4 ${isLight ? 'text-black' : 'text-white'}`}>{guest}</td>
       <td className={`p-4 opacity-70 ${isLight ? 'text-black' : 'text-white'}`}>{size}</td>
       <td className={`p-4 opacity-70 ${isLight ? 'text-black' : 'text-white'}`}>{time}</td>
       <td className="p-4">
         <span className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-opacity-20 ${
           status === 'CONFIRMED' 
             ? 'text-[#10B981] bg-[#10B981]' 
             : 'text-[#f8b11c] bg-[#f8b11c]'
         }`}>
           {status}
         </span>
       </td>
    </tr>
  );
}

function ScoreRow({ label, score, percent, isLight, color }: any) {
  return (
    <div>
      <div className={`flex justify-between font-display text-lg tracking-wide uppercase mb-2 ${isLight ? 'text-black/90' : 'text-white/90'}`}>
         <span>{label}</span>
         <span>{score}</span>
      </div>
      <div className={`h-2 w-full rounded-full overflow-hidden ${isLight ? 'bg-black/5' : 'bg-white/5'}`}>
        <div className={`h-full ${color === 'red' ? 'bg-[#E93B3B]' : 'bg-[#f8b11c]'}`} style={{ width: percent }}></div>
      </div>
    </div>
  );
}
