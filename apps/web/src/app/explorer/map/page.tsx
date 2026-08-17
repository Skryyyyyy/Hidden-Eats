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

    // Try to use real geolocation, fallback to Bangalore center
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

/* ─── Route between user and selected spot ─── */
function NavigationRoute({ selectedSpot }: { selectedSpot: MapSpot }) {
  const { map } = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    async function fetchRoute() {
      try {
        // Use Bangalore center as user location fallback
        const userLng = 77.5946;
        const userLat = 12.9716;

        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${selectedSpot.lng},${selectedSpot.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes?.[0]) {
          setRouteCoords(data.routes[0].geometry.coordinates);
        }
      } catch (err) {
        // Fallback straight line
        setRouteCoords([
          [77.5946, 12.9716],
          [selectedSpot.lng, selectedSpot.lat],
        ]);
      }
    }
    fetchRoute();
  }, [selectedSpot.lng, selectedSpot.lat]);

  if (routeCoords.length === 0) return null;

  return (
    <MapRoute
      id="nav-route"
      coordinates={routeCoords}
      color="#3b82f6"
      width={5}
      opacity={0.85}
    />
  );
}

function CustomGemGridMapContent() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const searchParams = useSearchParams();
  const spotParam = searchParams.get('spot');

  const [selectedSpot, setSelectedSpot] = useState<MapSpot>(MOCK_MAP_SPOTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModal, setBookingModal] = useState(false);

  useEffect(() => {
    if (spotParam) {
      const matched = MOCK_MAP_SPOTS.find((s) => s.id === spotParam);
      if (matched) setSelectedSpot(matched);
    }
  }, [spotParam]);

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      {/* Full-Screen MapLibre GL Dark Map */}
      <div className="flex-1 relative w-full overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        <Map center={[77.5946, 12.9716]} zoom={13} className="rounded-none">

          {/* Map Controls (Zoom, Compass, Locate, Fullscreen) */}
          <MapControls
            position="top-right"
            showZoom
            showCompass
            showLocate
            showFullscreen
          />

          {/* Render real map markers for each hidden spot */}
          <SpotMarkers
            spots={MOCK_MAP_SPOTS}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
          />

          {/* User live GPS marker */}
          <UserLocationMarker />

          {/* OSRM driving route line */}
          <NavigationRoute selectedSpot={selectedSpot} />
        </Map>

        {/* Top Search Overlay */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-96 z-40 space-y-2">
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
          </div>
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

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0d14] border border-[#1e2638] rounded-2xl p-6 space-y-4">
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
    <Suspense fallback={<div className="min-h-screen bg-[#05070a] text-white p-10">Loading Map...</div>}>
      <CustomGemGridMapContent />
    </Suspense>
  );
}
