'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import ExplorerNav from '@/components/ExplorerNav';
import { Map, MapControls, MapRoute, useMap } from '@/components/ui/map';
import * as maplibregl from 'maplibre-gl';
import {
  Search,
  MapPin,
  Navigation,
  Calendar,
  Star,
  Clock,
  Sparkles,
  Compass,
  Volume2,
  VolumeX,
  X,
  QrCode,
  Youtube,
  ArrowUpRight,
  CornerUpLeft,
  CornerUpRight,
} from 'lucide-react';
import YouTubeScraperModal from '@/components/YouTubeScraperModal';
import FoodCrawlDrawer from '@/components/FoodCrawlDrawer';
import ARAlleyCompassModal from '@/components/ARAlleyCompassModal';
import { ScrapedHiddenShop } from '@/lib/videoScraperNLP';
import { voiceGuidance } from '@/lib/voiceGuidance';
import { OptimizedFoodCrawl, FoodCrawlSpot } from '@/lib/foodCrawlOptimizer';

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

const INITIAL_MAP_SPOTS: MapSpot[] = [
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

/* ─── MapLibre Spot Markers (rendered as real map markers) ─── */
function SpotMarkers({
  spots,
  selectedSpot,
  onSelectSpot,
}: {
  spots: MapSpot[];
  selectedSpot: MapSpot;
  onSelectSpot: (spot: MapSpot) => void;
}) {
  const { map } = useMap();
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    spots.forEach((spot) => {
      const isSelected = selectedSpot.id === spot.id;

      const el = document.createElement('div');
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform 0.3s;transform:scale(${isSelected ? 1.25 : 1});">
          <div style="
            padding:4px 10px;
            border-radius:12px;
            font-size:11px;
            font-weight:800;
            display:flex;align-items:center;gap:4px;
            white-space:nowrap;
            border:1px solid ${isSelected ? '#fff' : '#222e42'};
            background:${isSelected ? '#f59e0b' : '#0f141d'};
            color:${isSelected ? '#000' : '#fff'};
            box-shadow:${isSelected ? '0 0 16px rgba(245,158,11,0.4)' : '0 4px 12px rgba(0,0,0,0.4)'};
          ">💎 ${spot.gemScore}</div>
          <div style="
            width:36px;height:36px;
            border-radius:14px;
            display:flex;align-items:center;justify-content:center;
            transform:rotate(45deg);
            background:${isSelected ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#182232'};
            color:${isSelected ? '#000' : '#f59e0b'};
            border:${isSelected ? 'none' : '2px solid #2b3b54'};
            box-shadow:${isSelected ? '0 0 20px rgba(245,158,11,0.5)' : '0 4px 12px rgba(0,0,0,0.3)'};
          ">
            <svg style="width:20px;height:20px;transform:rotate(-45deg);fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      `;

      el.addEventListener('click', () => onSelectSpot(spot));

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    };
  }, [map, spots, selectedSpot, onSelectSpot]);

  return null;
}

/* ─── User Live GPS Marker ─── */
function UserLocationMarker() {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const el = document.createElement('div');
    el.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="position:relative;">
          <div style="width:40px;height:40px;border-radius:50%;background:rgba(59,130,246,0.2);position:absolute;top:-12px;left:-12px;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 12px rgba(59,130,246,0.5);"></div>
        </div>
        <span style="background:rgba(0,0,0,0.85);color:#60a5fa;font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;border:1px solid rgba(59,130,246,0.3);white-space:nowrap;">📍 Live Explorer Position</span>
      </div>
    `;

    let marker: maplibregl.Marker;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([pos.coords.longitude, pos.coords.latitude])
            .addTo(map);
        },
        () => {
          marker = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat([77.5946, 12.9716])
            .addTo(map);
        }
      );
    } else {
      marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([77.5946, 12.9716])
        .addTo(map);
    }

    return () => {
      marker?.remove();
    };
  }, [map]);

  return null;
}

/* ─── OSRM Live Driving Route Line with Numbered Stop Pins ─── */
function NavigationRoute({ selectedSpot, isNavMode }: { selectedSpot: MapSpot; isNavMode: boolean }) {
  const { map } = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const stopMarkersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!map || !selectedSpot) return;

    let isMounted = true;
    const originLng = 77.5946;
    const originLat = 12.9716;
    const destLng = selectedSpot.lng;
    const destLat = selectedSpot.lat;

    // Fetch real OSRM driving route
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
          const coords = data.routes[0].geometry.coordinates as [number, number][];
          setRouteCoords(coords);

          // Clear previous stop markers
          stopMarkersRef.current.forEach(m => m.remove());
          stopMarkersRef.current = [];

          // Pin [1]: Origin (User position)
          const startEl = document.createElement('div');
          startEl.innerHTML = `
            <div style="
              width:28px;height:28px;border-radius:50%;
              background:#10b981;color:#000;
              font-size:12px;font-weight:900;
              display:flex;align-items:center;justify-content:center;
              border:2.5px solid #ffffff;
              box-shadow:0 0 14px rgba(16,185,129,0.7);
            ">1</div>
          `;
          const startMarker = new maplibregl.Marker({ element: startEl, anchor: 'center' })
            .setLngLat([originLng, originLat])
            .addTo(map);
          stopMarkersRef.current.push(startMarker);

          // Pin [2]: Destination (Selected spot)
          const endEl = document.createElement('div');
          endEl.innerHTML = `
            <div style="
              width:28px;height:28px;border-radius:50%;
              background:#ef4444;color:#ffffff;
              font-size:12px;font-weight:900;
              display:flex;align-items:center;justify-content:center;
              border:2.5px solid #ffffff;
              box-shadow:0 0 14px rgba(239,68,68,0.7);
            ">2</div>
          `;
          const endMarker = new maplibregl.Marker({ element: endEl, anchor: 'center' })
            .setLngLat([destLng, destLat])
            .addTo(map);
          stopMarkersRef.current.push(endMarker);

          // Adjust camera
          if (isNavMode) {
            map.flyTo({
              center: [originLng, originLat],
              zoom: 17.5,
              pitch: 60,
              bearing: 35,
              duration: 1500,
            });
          } else {
            const bounds = new maplibregl.LngLatBounds();
            bounds.extend([originLng, originLat]);
            bounds.extend([destLng, destLat]);
            map.fitBounds(bounds, { padding: 100, maxZoom: 15.5 });
          }
        }
      })
      .catch(() => {
        // Fallback straight line
        const directLine: [number, number][] = [
          [originLng, originLat],
          [destLng, destLat],
        ];
        setRouteCoords(directLine);
      });

    return () => {
      isMounted = false;
      stopMarkersRef.current.forEach(m => m.remove());
      stopMarkersRef.current = [];
    };
  }, [map, selectedSpot, isNavMode]);

  return (
    <>
      {routeCoords.length > 0 && (
        <MapRoute
          id="active-driving-osrm-route"
          coordinates={routeCoords}
          color="#f59e0b"
          width={5}
          opacity={0.9}
        />
      )}
    </>
  );
}

function CustomGemGridMapContent() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [spots, setSpots] = useState<MapSpot[]>(INITIAL_MAP_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<MapSpot>(INITIAL_MAP_SPOTS[0]);
  const [bookingModal, setBookingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScraperModal, setShowScraperModal] = useState(false);
  const [showCrawlDrawer, setShowCrawlDrawer] = useState(false);
  const [showARCompass, setShowARCompass] = useState(false);
  const [isNavMode, setIsNavMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const startNavigationWithVoice = () => {
    setIsNavMode(true);
    voiceGuidance.setMuted(isMuted);
    voiceGuidance.announceNavigationStart(selectedSpot.name, 4, '1.2');
    setTimeout(() => {
      voiceGuidance.announceManeuver('right', 250, 'MG Road');
    }, 3500);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    voiceGuidance.setMuted(nextMuted);
  };

  const handleSpotExtracted = (scraped: ScrapedHiddenShop) => {
    const newSpot: MapSpot = {
      id: `scraped-${Date.now()}`,
      name: scraped.extractedShopName,
      address: scraped.extractedLocationText,
      lat: scraped.latitude,
      lng: scraped.longitude,
      gemScore: Number((scraped.confidenceScore * 9.5).toFixed(1)),
      rating: 4.8,
      image: scraped.thumbnailUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      hasSecretMenu: true,
      crowdLevel: 'Moderate',
      waitTime: '10 min wait',
      category: scraped.signatureDish || 'Hidden Gem',
    };

    setSpots(prev => [newSpot, ...prev]);
    setSelectedSpot(newSpot);
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans">
      <ExplorerNav />

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-[calc(100vh-64px)] overflow-hidden">
        <Map
          center={[77.5946, 12.9716]}
          zoom={13.5}
          pitch={isNavMode ? 60 : 0}
          bearing={isNavMode ? 35 : 0}
        >
          <MapControls position="bottom-right" />

          {/* Render real map markers for each hidden spot */}
          <SpotMarkers
            spots={spots}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
          />

          {/* User live GPS marker */}
          <UserLocationMarker />

          {/* OSRM driving route line */}
          <NavigationRoute selectedSpot={selectedSpot} isNavMode={isNavMode} />
        </Map>

        {/* 🧭 LIVE TURN-BY-TURN HUD BANNER (When Navigation Mode is Active) */}
        {isNavMode && (
          <div className="absolute top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[500px] z-50 animate-fade-in">
            <div className="bg-[#0b101b]/95 border-2 border-[#f59e0b] rounded-3xl p-4 shadow-[0_10px_40px_rgba(245,158,11,0.3)] backdrop-blur-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f59e0b] text-black flex items-center justify-center font-black">
                    <CornerUpRight className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">Turn Right in 250m</h4>
                    <p className="text-xs text-[#f59e0b] font-semibold">Onto MG Road / Brigade Junction</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMute}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setIsNavMode(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Speed & ETA Gauge */}
              <div className="flex items-center justify-between pt-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 block font-bold">Speed</span>
                    <span className="text-base font-black text-emerald-400">28 km/h</span>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 block font-bold">Distance</span>
                    <span className="text-base font-black text-white">1.2 km</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 block font-bold">ETA</span>
                  <span className="text-base font-black text-[#f59e0b]">4 Mins Remaining</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Search & Actions Overlay */}
        {!isNavMode && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-[440px] z-40 space-y-2">
            <div className={`border rounded-2xl p-2.5 shadow-2xl flex items-center gap-2 backdrop-blur-xl ${
              isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0a0d14]/90 border-[#1e2638]'
            }`}>
              <Search className="w-4 h-4 text-[#f59e0b] ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Gem Grid locations..."
                className="w-full bg-transparent text-xs outline-none text-white placeholder-[#777777]"
              />
              <button
                onClick={() => setShowScraperModal(true)}
                title="Scrape from YouTube URL"
                className="px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-red-600/30 transition-all shrink-0 cursor-pointer"
              >
                <Youtube className="w-3.5 h-3.5" /> NLP Scraper
              </button>
            </div>

            {/* Quick Action Pill Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCrawlDrawer(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/30 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xl flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Navigation className="w-3 h-3 fill-[#f59e0b]" />
                <span>Food Crawl Tour (TSP)</span>
              </button>

              <button
                onClick={() => setShowARCompass(true)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xl flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                <span>AR Alley Vision</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Spot Drawer Card */}
        {selectedSpot && !isNavMode && (
          <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-auto sm:w-[420px] z-40 animate-fade-in">
            <div className={`border rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4 ${
              isLight ? 'bg-white/95 border-slate-200' : 'bg-[#0a0d14]/95 border-[#1e2638]'
            }`}>
              <div className="flex items-start gap-4">
                <img
                  src={selectedSpot.image}
                  alt={selectedSpot.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-md border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-2 py-0.5 rounded-full">
                      💎 {selectedSpot.gemScore} GEM SCORE
                    </span>
                    <span className="text-[10px] font-extrabold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedSpot.waitTime}
                    </span>
                  </div>
                  <h3 className={`text-base font-black mt-1 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedSpot.name}
                  </h3>
                  <p className="text-xs text-[#888888] truncate mt-0.5">{selectedSpot.address}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#f59e0b] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#f59e0b]" /> {selectedSpot.rating} Google Rating
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2638] flex items-center gap-2">
                <button
                  onClick={startNavigationWithVoice}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation className="w-4 h-4 fill-white" /> Start GPS Navigation HUD
                </button>
                <button
                  onClick={() => setBookingModal(true)}
                  className="px-4 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs rounded-2xl transition-all shadow-lg shadow-[#f59e0b]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Seat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0d14] border border-[#1e2638] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <h3 className="text-base font-bold text-white">Reserve Table at {selectedSpot.name}</h3>
              <button onClick={() => setBookingModal(false)} className="text-[#777777] font-bold text-sm">✕</button>
            </div>
            <p className="text-xs text-[#888888]">
              Reserve directly inside Hidden Eats without any middleman fees.
            </p>
            <button
              onClick={() => {
                alert('Table seat reservation requested successfully!');
                setBookingModal(false);
              }}
              className="w-full py-3.5 bg-[#f59e0b] text-black font-bold text-xs rounded-2xl shadow-lg shadow-[#f59e0b]/20"
            >
              Confirm Reservation Request
            </button>
          </div>
        </div>
      )}

      {/* YouTube / Instagram Scraper Modal */}
      {showScraperModal && (
        <YouTubeScraperModal
          onClose={() => setShowScraperModal(false)}
          onSpotExtracted={handleSpotExtracted}
        />
      )}

      {/* Multi-Stop Food Crawl TSP Drawer */}
      {showCrawlDrawer && (
        <FoodCrawlDrawer
          availableSpots={spots.map((s) => ({
            id: s.id,
            name: s.name,
            address: s.address,
            lat: s.lat,
            lng: s.lng,
            signatureDish: s.category || 'Special Dish',
            gemScore: s.gemScore,
          }))}
          onClose={() => setShowCrawlDrawer(false)}
          onApplyCrawlRoute={(crawl) => {
            if (crawl.orderedSpots.length > 0) {
              setSelectedSpot(spots.find((s) => s.id === crawl.orderedSpots[0].id) || spots[0]);
              startNavigationWithVoice();
            }
          }}
        />
      )}

      {/* AR Alley Compass & Camera Vision Modal */}
      {showARCompass && (
        <ARAlleyCompassModal
          onClose={() => setShowARCompass(false)}
        />
      )}
    </div>
  );
}

export default function InternalInAppWebMapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070a] text-white p-10">Loading Map...</div>}>
      <CustomGemGridMapContent />
    </Suspense>
  );
}
