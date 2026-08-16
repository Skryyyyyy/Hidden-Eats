'use client';

import React, { useState } from 'react';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import YouTubeScraperModal from '@/components/YouTubeScraperModal';
import { ScrapedHiddenShop } from '@/lib/videoScraperNLP';
import { Radio, Clock, Users, MapPin, Navigation, Check, ShieldCheck, Flame, Youtube, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveCrowdRadarPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<number | null>(0);

  const [spots, setSpots] = useState([
    {
      id: 1,
      name: 'Grand Secret Kitchen',
      location: 'T. Nagar, Chennai',
      crowd: 'High Demand',
      crowdColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      waitTime: '15 - 20 min wait',
      lastUpdated: '12 mins ago (8 check-ins)',
      distance: '1.2 km away',
      activeDrivers: 4,
      coords: { x: '45%', y: '35%' },
    },
    {
      id: 2,
      name: 'Alleyway Street Bakes',
      location: 'Nungambakkam, Chennai',
      crowd: 'Moderate',
      crowdColor: 'bg-[#f8b11c]/10 text-[#f8b11c] border-[#f8b11c]/30',
      waitTime: '5 min wait',
      lastUpdated: '4 mins ago (14 check-ins)',
      distance: '2.8 km away',
      activeDrivers: 6,
      coords: { x: '68%', y: '55%' },
    },
    {
      id: 3,
      name: 'Café De Quietude',
      location: 'Anna Nagar, Chennai',
      crowd: 'Low Crowd',
      crowdColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      waitTime: 'No wait',
      lastUpdated: 'Just now (5 check-ins)',
      distance: '4.1 km away',
      activeDrivers: 3,
      coords: { x: '30%', y: '70%' },
    },
  ]);

  React.useEffect(() => {
    // Automatically fetch ML Model extracted hidden spots from backend database
    async function fetchMlExtractedSpots() {
      try {
        const res = await fetch('/api/scrape-youtube');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mlSpots = json.data.map((item: any, idx: number) => ({
            id: item.id || idx + 100,
            name: item.extractedShopName,
            location: item.extractedLocationText,
            crowd: 'AI ML Discovered',
            crowdColor: 'bg-amber-500/10 text-[#f8b11c] border-amber-500/30',
            waitTime: item.signatureDish || 'Secret Dish',
            lastUpdated: `Extracted via Whisper ASR + SpaCy NER (${(item.confidenceScore * 100).toFixed(0)}% Match)`,
            distance: '1.8 km away',
            activeDrivers: 6,
            coords: { x: `${35 + idx * 20}%`, y: `${30 + idx * 22}%` },
          }));
          setSpots((prev) => [...mlSpots, ...prev]);
        }
      } catch (err) {
        console.error('Failed to fetch ML extracted spots from backend:', err);
      }
    }
    fetchMlExtractedSpots();
  }, []);

  const handleCheckIn = () => {
    setCheckInSuccess(true);
    setTimeout(() => setCheckInSuccess(false), 2500);
  };

  const handleAddExtractedSpot = (scraped: ScrapedHiddenShop) => {
    const newSpot = {
      id: Date.now(),
      name: scraped.extractedShopName,
      location: scraped.extractedLocationText,
      crowd: 'AI Discovered Gem',
      crowdColor: 'bg-amber-500/10 text-[#f8b11c] border-amber-500/30',
      waitTime: 'Secret Spot',
      lastUpdated: 'Extracted from YouTube NLP Engine',
      distance: '2.1 km away',
      activeDrivers: 5,
      coords: { x: '50%', y: '45%' },
    };
    setSpots([newSpot, ...spots]);
    setSelectedSpot(0);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      <main className="max-w-6xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f8b11c] flex items-center gap-1.5 mb-1">
              <Radio className="w-4 h-4 text-[#f8b11c] animate-pulse" /> LIVE DINER CROWD & DRIVER RADAR
            </span>
            <h1 className={`text-2xl sm:text-4xl font-black tracking-tight uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Real-Time Radius Radar
            </h1>
            <p className="text-xs text-[#777777] mt-1">
              Live venue check-ins and active delivery driver coverage within 5 km.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowScraperModal(true)}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
            >
              <Youtube className="w-4 h-4 text-white" /> AI Scrape YouTube Food Spot
            </button>

            <button
              onClick={handleCheckIn}
              className="px-5 py-3 bg-[#f8b11c] hover:bg-[#e0a019] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
            >
              <Users className="w-4 h-4" /> Post Live Check-In
            </button>
          </div>
        </div>

        {checkInSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> Live check-in submitted! Explorer XP added to your profile.
          </div>
        )}

        {/* Radar Map & List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Visual Interactive Animated Radar Sweep Widget */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f8b11c]">
                <Navigation className="w-4 h-4" /> Radar Active Range: 5 KM
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                GPS LAT: 13.0827 | LNG: 80.2707
              </span>
            </div>

            {/* Radar Circle Grid Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[280px] rounded-full border border-[#f8b11c]/20 relative flex items-center justify-center">
                <div className="w-[180px] h-[180px] rounded-full border border-[#f8b11c]/25 flex items-center justify-center">
                  <div className="w-[90px] h-[90px] rounded-full border border-[#f8b11c]/30" />
                </div>
                {/* Center User Dot */}
                <div className="w-3 h-3 bg-[#f8b11c] rounded-full shadow-[0_0_15px_#f8b11c] z-20" />
              </div>

              {/* Animated Rotating Radar Sweep */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[320px] h-[320px] rounded-full origin-center pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(248, 177, 35, 0.25) 0deg, transparent 60deg, transparent 360deg)',
                }}
              />
            </div>

            {/* Spot Pins on Radar */}
            {spots.map((spot, idx) => (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(idx)}
                style={{ left: spot.coords.x, top: spot.coords.y }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full border transition-all flex items-center gap-1.5 ${
                  selectedSpot === idx
                    ? 'bg-[#f8b11c] text-black border-white shadow-[0_0_20px_#f8b11c] scale-110'
                    : 'bg-black/80 text-white border-white/20 hover:border-[#f8b11c]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wider uppercase hidden sm:inline">
                  {spot.name.split(' ')[0]}
                </span>
              </button>
            ))}

            <div className="z-10 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4 border-t border-white/5">
              <span>Live Scanning...</span>
              <span className="text-emerald-400 flex items-center gap-1">
                ● 13 Active Drivers Online
              </span>
            </div>
          </div>

          {/* Spots List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#f8b11c] border-b border-white/10 pb-2">
              Detected Venues ({spots.length})
            </h3>

            {spots.map((spot, idx) => (
              <div
                key={spot.id}
                onClick={() => setSelectedSpot(idx)}
                className={`border rounded-2xl p-5 cursor-pointer transition-all ${
                  selectedSpot === idx
                    ? 'bg-[#141414] border-[#f8b11c] shadow-xl'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-400'
                    : 'bg-[#0a0a0a] border-[#1c1c1c] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {spot.name}
                  </h4>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${spot.crowdColor}`}>
                    {spot.crowd}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  {spot.location} • <strong className="text-[#f8b11c]">{spot.distance}</strong>
                </p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-white/5">
                  <span className="flex items-center gap-1 text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-[#f8b11c]" /> {spot.waitTime}
                  </span>
                  <span className="text-[10px] text-gray-500">{spot.activeDrivers} Drivers Nearby</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* AI YouTube Scraper & NLP Location Extraction Modal */}
      {showScraperModal && (
        <YouTubeScraperModal
          onClose={() => setShowScraperModal(false)}
          onSpotExtracted={handleAddExtractedSpot}
        />
      )}
    </div>
  );
}
