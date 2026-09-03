'use client';

import React, { useState, useEffect, useRef } from 'react';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import YouTubeScraperModal from '@/components/YouTubeScraperModal';
import { ScrapedHiddenShop } from '@/lib/videoScraperNLP';
import { Radio, Clock, Users, MapPin, Navigation, Check, ShieldCheck, Flame, Youtube, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Map, MapControls, useMap } from '@/components/ui/map';
import * as maplibregl from 'maplibre-gl';

interface RadarSpot {
  id: number;
  name: string;
  location: string;
  crowd: string;
  crowdColor: string;
  waitTime: string;
  lastUpdated: string;
  distance: string;
  activeDrivers: number;
  lat: number;
  lng: number;
}

const INITIAL_SPOTS: RadarSpot[] = [
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
    lat: 13.0418,
    lng: 80.2341,
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
    lat: 13.0614,
    lng: 80.2425,
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
    lat: 13.0860,
    lng: 80.2101,
  },
];

/* ─── MapLibre markers for radar spots ─── */
function RadarMapMarkers({
  spots,
  selectedSpot,
  onSelectSpot,
}: {
  spots: RadarSpot[];
  selectedSpot: number | null;
  onSelectSpot: (idx: number) => void;
}) {
  const { map } = useMap();
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    spots.forEach((spot, idx) => {
      const isSelected = selectedSpot === idx;

      const el = document.createElement('div');
      el.style.cursor = 'pointer';

      const crowdColor =
        spot.crowd === 'High Demand'
          ? '#ef4444'
          : spot.crowd === 'Moderate'
          ? '#f59e0b'
          : '#10b981';

      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform 0.3s;transform:scale(${isSelected ? 1.3 : 1});">
          <div style="
            padding:4px 10px;
            border-radius:12px;
            font-size:11px;
            font-weight:800;
            white-space:nowrap;
            border:1px solid ${isSelected ? '#fff' : crowdColor + '55'};
            background:${isSelected ? crowdColor : '#0f141d'};
            color:${isSelected ? '#fff' : crowdColor};
            box-shadow:${isSelected ? `0 0 16px ${crowdColor}66` : '0 4px 12px rgba(0,0,0,0.4)'};
          ">📍 ${spot.name.split(' ').slice(0, 2).join(' ')}</div>
          <div style="
            width:14px;height:14px;
            border-radius:50%;
            background:${crowdColor};
            border:3px solid ${isSelected ? '#fff' : '#0a0a0a'};
            box-shadow:0 0 ${isSelected ? '20' : '8'}px ${crowdColor}${isSelected ? '99' : '55'};
          "></div>
        </div>
      `;

      el.addEventListener('click', () => onSelectSpot(idx));

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [map, spots, selectedSpot, onSelectSpot]);

  return null;
}

export default function LiveCrowdRadarPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<number | null>(0);

  const [spots, setSpots] = useState<RadarSpot[]>(INITIAL_SPOTS);

  useEffect(() => {
    // Automatically fetch ML Model extracted hidden spots from backend database
    async function fetchMlExtractedSpots() {
      try {
        const res = await fetch('/api/scrape-youtube');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mlSpots: RadarSpot[] = json.data.map((item: any, idx: number) => ({
            id: item.id || idx + 100,
            name: item.extractedShopName,
            location: item.extractedLocationText,
            crowd: 'AI ML Discovered',
            crowdColor: 'bg-amber-500/10 text-[#f8b11c] border-amber-500/30',
            waitTime: item.signatureDish || 'Secret Dish',
            lastUpdated: `Extracted via Whisper ASR + SpaCy NER (${(item.confidenceScore * 100).toFixed(0)}% Match)`,
            distance: '1.8 km away',
            activeDrivers: 6,
            lat: 13.0827 + (Math.random() - 0.5) * 0.04,
            lng: 80.2707 + (Math.random() - 0.5) * 0.04,
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
    const newSpot: RadarSpot = {
      id: Date.now(),
      name: scraped.extractedShopName,
      location: scraped.extractedLocationText,
      crowd: 'AI Discovered Gem',
      crowdColor: 'bg-amber-500/10 text-[#f8b11c] border-amber-500/30',
      waitTime: 'Secret Spot',
      lastUpdated: 'Extracted from YouTube NLP Engine',
      distance: '2.1 km away',
      activeDrivers: 5,
      lat: 13.0827 + (Math.random() - 0.5) * 0.03,
      lng: 80.2707 + (Math.random() - 0.5) * 0.03,
    };
    setSpots([newSpot, ...spots]);
    setSelectedSpot(0);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      <main className="max-w-7xl mx-auto w-full p-6 sm:p-10 space-y-8 flex-1">
        
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
          
          {/* Real Interactive MapLibre GL Map with Radar Overlay */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden relative min-h-[420px] shadow-2xl border border-white/10">
            <Map 
              center={[80.2707, 13.0827]} 
              zoom={12}
              styles={{
                light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
              }}
            >
              <MapControls position="top-right" showZoom showCompass showLocate showFullscreen />

              {/* Radar markers */}
              <RadarMapMarkers
                spots={spots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
              />

              {/* Rotating radar sweep overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-[320px] h-[320px] rounded-full origin-center pointer-events-none opacity-30"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(248, 177, 35, 0.25) 0deg, transparent 60deg, transparent 360deg)',
                  }}
                />
              </div>

              {/* Top-left info badge */}
              <div className="absolute top-4 left-4 z-30 pointer-events-auto flex items-center gap-2">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f8b11c]">
                  <Navigation className="w-3.5 h-3.5" /> Radar: 5 KM
                </div>
                <span className="text-[10px] font-mono text-gray-400 bg-black/60 backdrop-blur-xl px-2.5 py-1.5 rounded-xl border border-white/10">
                  GPS 13.08 | 80.27
                </span>
              </div>

              {/* Bottom status bar */}
              <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-black/70 backdrop-blur-xl rounded-xl px-4 py-2.5 border border-white/10">
                <span className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-[#f8b11c] animate-pulse" /> Live Scanning...</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  ● 13 Active Drivers Online
                </span>
              </div>
            </Map>
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
