'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import ExplorerNav from '@/components/ExplorerNav';
import {
  Search,
  MapPin,
  Navigation,
  Layers,
  Plus,
  Minus,
  Calendar,
  Flame,
  Star,
  Clock,
  Radio,
  Sparkles,
} from 'lucide-react';

interface MapSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  gemScore: number;
  rating: number;
  image: string;
  hasSecretMenu: boolean;
  crowdLevel: 'Low' | 'Moderate' | 'Busy';
  waitTime: string;
  category: string;
}

const MOCK_MAP_SPOTS: MapSpot[] = [
  {
    id: 'res-1',
    name: 'Grand Secret Kitchen',
    address: '12-A Secret Alley, Off Brigade Road',
    lat: 12.9716,
    lng: 77.5946,
    gemScore: 9.4,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop',
    hasSecretMenu: true,
    crowdLevel: 'Busy',
    waitTime: '15-20 min wait',
    category: 'Mutton Biryani',
  },
  {
    id: 'res-2',
    name: 'Alleyway Street Bakes',
    address: '44 Corner Lane, Indiranagar',
    lat: 12.978,
    lng: 77.605,
    gemScore: 8.9,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop',
    hasSecretMenu: true,
    crowdLevel: 'Moderate',
    waitTime: '5 min wait',
    category: 'Street Food',
  },
  {
    id: 'res-3',
    name: 'Café De Quietude',
    address: '88 Peace Haven, Koramangala',
    lat: 12.965,
    lng: 77.588,
    gemScore: 9.1,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop',
    hasSecretMenu: false,
    crowdLevel: 'Low',
    waitTime: 'No wait',
    category: 'Work Cafe',
  },
];

function CustomGemGridMapContent() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const searchParams = useSearchParams();
  const spotParam = searchParams.get('spot');

  // Proprietary Map Camera Center (Lat / Lng)
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [zoom, setZoom] = useState(14); // 10 to 18 scale
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [selectedSpot, setSelectedSpot] = useState<MapSpot>(MOCK_MAP_SPOTS[0]);
  const [mapTheme, setMapTheme] = useState<'pitch_black' | 'cyber_amber' | 'clean_light'>('pitch_black');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModal, setBookingModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (spotParam) {
      const matched = MOCK_MAP_SPOTS.find((s) => s.id === spotParam);
      if (matched) {
        setSelectedSpot(matched);
        setCenter({ lat: matched.lat, lng: matched.lng });
      }
    }
  }, [spotParam]);

  // Proprietary Mouse Drag & Inertia Panning Math
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Convert (Lat, Lng) coordinates to 2D Canvas Pixel Offsets relative to camera center
  const latLngToPixel = (lat: number, lng: number) => {
    const scale = Math.pow(2, zoom) * 0.4;
    const x = (lng - center.lng) * scale * 1000 + panOffset.x;
    const y = (center.lat - lat) * scale * 1000 + panOffset.y;
    return { x, y };
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      {/* Main Vector Map Engine Viewport */}
      <div className="flex-1 relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-[#05070a] select-none">
        {/* Top Search Overlay */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 z-40 space-y-2">
          <div className={`border rounded-2xl p-2.5 shadow-2xl flex items-center gap-2 backdrop-blur-xl ${
            isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0a0d14]/95 border-[#1e2638]'
          }`}>
            <Search className="w-4 h-4 text-[#f59e0b] ml-1" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Gem Grid locations..."
              className="w-full bg-transparent text-xs outline-none text-white placeholder-[#777777]"
            />
          </div>
        </div>

        {/* Map Control Buttons */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
          <button
            onClick={() => setMapTheme(mapTheme === 'pitch_black' ? 'cyber_amber' : 'pitch_black')}
            className="p-2.5 rounded-xl border shadow-2xl backdrop-blur-xl bg-[#0a0d14] border-[#1e2638] text-[#f59e0b] hover:bg-[#121724]"
            title="Toggle Proprietary Vector Style"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <div className="rounded-xl border border-[#1e2638] bg-[#0a0d14] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl text-white">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.5, 18))}
              className="p-2.5 hover:bg-[#141b2a] border-b border-[#1e2638] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.5, 10))}
              className="p-2.5 hover:bg-[#141b2a] transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setCenter({ lat: 12.9716, lng: 77.5946 });
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-2.5 rounded-xl border shadow-2xl backdrop-blur-xl bg-[#0a0d14] border-[#1e2638] text-blue-400 hover:bg-[#121724]"
            title="Recenter Camera"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* PROPRIETARY VECTOR MAP CANVAS ENGINE */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-colors duration-300 ${
            mapTheme === 'cyber_amber' ? 'bg-[#0f0c06]' : 'bg-[#05070a]'
          }`}
        >
          {/* Custom Procedural Grid & Vector Roads Engine */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="gemHeatmap" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>

              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapTheme === 'cyber_amber' ? '#2a1a04' : '#101622'} strokeWidth="1" />
              </pattern>
            </defs>

            {/* Background Grid Pattern */}
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            {/* Custom Heatmap Glowing Zones */}
            <circle cx="50%" cy="45%" r="280" fill="url(#gemHeatmap)" />

            {/* Custom Vector Highway Arteries */}
            <g stroke={mapTheme === 'cyber_amber' ? '#442a08' : '#1e293b'} strokeWidth="8" fill="none">
              <path d="M -200 300 Q 400 150 1400 350" />
              <path d="M 300 -100 Q 500 500 700 1000" />
              <path d="M 0 600 Q 700 400 1400 700" />
            </g>

            {/* Custom Glowing Sector Ring */}
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.3" />
          </svg>

          {/* User Live GPS Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex items-center justify-center">
            <span className="w-10 h-10 rounded-full bg-blue-500/20 animate-ping absolute" />
            <span className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30 border-2 border-white shadow-lg" />
            <span className="absolute top-6 text-[10px] font-bold text-blue-400 bg-black/80 px-2 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">
              📍 Live Explorer Position
            </span>
          </div>

          {/* Proprietary Pin Markers Placed using Local Mercator Vector Math */}
          {MOCK_MAP_SPOTS.map((spot) => {
            const isSelected = selectedSpot.id === spot.id;
            const px = latLngToPixel(spot.lat, spot.lng);

            // Compute screen position relative to viewport center
            const screenX = `calc(50% + ${px.x}px)`;
            const screenY = `calc(50% + ${px.y}px)`;

            return (
              <div
                key={spot.id}
                style={{ top: screenY, left: screenX }}
                className="absolute -translate-x-1/2 -translate-y-full z-30 pointer-events-auto"
              >
                <button
                  onClick={() => setSelectedSpot(spot)}
                  className={`group relative flex flex-col items-center transition-all duration-300 ${
                    isSelected ? 'scale-125 z-40' : 'scale-100 hover:scale-110'
                  }`}
                >
                  {/* Glowing Radar Pulse behind Pin */}
                  <span className={`w-12 h-12 rounded-full absolute -top-2 animate-ping pointer-events-none ${
                    isSelected ? 'bg-[#f59e0b]/30' : 'bg-transparent'
                  }`} />

                  {/* Gem Score Chip */}
                  <div className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold shadow-2xl flex items-center gap-1 border whitespace-nowrap mb-1 transition-all ${
                    isSelected
                      ? 'bg-[#f59e0b] text-black border-white ring-4 ring-[#f59e0b]/40 font-bold'
                      : 'bg-[#0f141d] text-white border-[#222e42]'
                  }`}>
                    <span>💎</span> {spot.gemScore}
                  </div>

                  {/* Proprietary Gem Teardrop Pin */}
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-2xl transition-all rotate-45 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-black ring-4 ring-[#f59e0b]/40 scale-110'
                      : 'bg-[#182232] text-[#f59e0b] border-2 border-[#2b3b54]'
                  }`}>
                    <MapPin className="w-5 h-5 -rotate-45" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Dynamic Spot Drawer Card */}
        {selectedSpot && (
          <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-[420px] z-40">
            <div className={`border rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4 ${
              isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0a0d14]/95 border-[#1e2638]'
            }`}>
              <div className="flex items-start gap-4">
                <img
                  src={selectedSpot.image}
                  alt={selectedSpot.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2 py-0.5 rounded">
                      💎 {selectedSpot.gemScore} GEM SCORE
                    </span>
                    <span className="text-[10px] font-extrabold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedSpot.waitTime}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold mt-1 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedSpot.name}
                  </h3>
                  <p className="text-xs text-[#777777] truncate mt-0.5">{selectedSpot.address}</p>

                  <div className="flex items-center gap-2 mt-2 text-xs text-[#f59e0b] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#f59e0b]" /> {selectedSpot.rating} Google Rating
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#1e2638] flex items-center gap-2">
                <button
                  onClick={() => setBookingModal(true)}
                  className="flex-1 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#f59e0b]/20 flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Table Seat
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 bg-[#141b2a] hover:bg-[#1a2336] text-white text-xs font-semibold rounded-xl border border-[#223048] transition-colors"
                >
                  GPS Navigation ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Internal Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0d14] border border-[#1e2638] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <h3 className="text-base font-bold text-white">Reserve Table at {selectedSpot.name}</h3>
              <button onClick={() => setBookingModal(false)} className="text-[#777777] font-bold text-sm">
                ✕
              </button>
            </div>
            <p className="text-xs text-[#888888]">
              Reserve directly inside Hidden Eats without any middleman fees.
            </p>
            <button
              onClick={() => {
                alert('Table seat reservation requested successfully!');
                setBookingModal(false);
              }}
              className="w-full py-3 bg-[#f59e0b] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#f59e0b]/20"
            >
              Confirm Reservation Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InternalInAppWebMapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070a] text-white p-10">Loading Proprietary Gem Grid Map Engine...</div>}>
      <CustomGemGridMapContent />
    </Suspense>
  );
}
