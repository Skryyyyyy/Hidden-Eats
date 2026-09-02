'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Layers, Sparkles, Navigation, Compass, Star, Eye } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export type MapStyleMode = 'carto-dark' | 'deckgl-3d' | 'carto-voyager' | 'osm-street';

export interface MapSpotItem {
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

interface DualEngineMapProps {
  spots: MapSpotItem[];
  selectedSpot: MapSpotItem;
  onSelectSpot: (spot: MapSpotItem) => void;
  userPosition?: [number, number];
  isNavMode?: boolean;
}

// Leaflet Map Wrapper loaded strictly client-side to prevent SSR window issues
function LeafletEngine({
  spots,
  selectedSpot,
  onSelectSpot,
  styleMode,
  userPosition,
}: {
  spots: MapSpotItem[];
  selectedSpot: MapSpotItem;
  onSelectSpot: (spot: MapSpotItem) => void;
  styleMode: MapStyleMode;
  userPosition: [number, number];
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    const L = require('leaflet');

    // Fix default leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedSpot.lat, selectedSpot.lng],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottom-right' }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layer if style changes
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Configure Tile Layer based on chosen style
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; OpenStreetMap contributors &copy; CARTO';

    if (styleMode === 'carto-voyager') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    } else if (styleMode === 'osm-street') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Render Custom HTML Markers
    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();

      // 1. User Position Marker
      const userHtml = `
        <div style="position:relative;width:24px;height:24px;">
          <div style="width:24px;height:24px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 16px rgba(59,130,246,0.8);"></div>
          <div style="position:absolute;top:-8px;left:-8px;width:40px;height:40px;border-radius:50%;background:rgba(59,130,246,0.3);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
        </div>
      `;
      const userIcon = L.divIcon({ html: userHtml, className: 'custom-user-pin', iconSize: [24, 24], iconAnchor: [12, 12] });
      L.marker(userPosition, { icon: userIcon }).addTo(markersGroupRef.current);

      // 2. Food Spots Markers
      spots.forEach((spot) => {
        const isSelected = spot.id === selectedSpot.id;
        const iconHtml = `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;transform:scale(${isSelected ? 1.2 : 1});transition:transform 0.2s;">
            <div style="
              padding:3px 8px;border-radius:12px;font-size:10px;font-weight:900;
              background:${isSelected ? '#f59e0b' : '#0f141d'};color:${isSelected ? '#000' : '#fff'};
              border:1.5px solid ${isSelected ? '#ffffff' : '#2b3b54'};
              box-shadow:${isSelected ? '0 0 18px rgba(245,158,11,0.6)' : '0 4px 10px rgba(0,0,0,0.5)'};
              white-space:nowrap;
            ">💎 ${spot.gemScore}</div>
            <div style="
              width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;
              transform:rotate(45deg);
              background:${isSelected ? 'linear-gradient(135deg,#f59e0b,#d97706)' : '#1a2333'};
              border:${isSelected ? '2px solid #fff' : '2px solid #334155'};
              box-shadow:0 4px 12px rgba(0,0,0,0.4);
            ">
              <span style="transform:rotate(-45deg);font-size:14px;">🔥</span>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-food-pin',
          iconSize: [40, 56],
          iconAnchor: [20, 48],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });
        marker.on('click', () => {
          onSelectSpot(spot);
          map.flyTo([spot.lat, spot.lng], 15, { duration: 1.2 });
        });
        marker.addTo(markersGroupRef.current);
      });

      // 3. Navigation Route Polyline
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
      }
      const latlngs = [userPosition, [selectedSpot.lat, selectedSpot.lng]];
      routeLineRef.current = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(map);
    }
  }, [spots, selectedSpot, styleMode, userPosition, onSelectSpot]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />;
}

// 3D Deck.gl Spatial Radar View Engine (Canvas-based high performance 3D arcs)
function DeckGLEngine({
  spots,
  selectedSpot,
  onSelectSpot,
  userPosition,
}: {
  spots: MapSpotItem[];
  selectedSpot: MapSpotItem;
  onSelectSpot: (spot: MapSpotItem) => void;
  userPosition: [number, number];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Radar Grid Circles
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.lineWidth = 1.5;
      [80, 160, 240, 320].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. Rotating Radar Sweep Beam
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 320);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 320, 0, Math.PI / 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. User Origin
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Render Spots as 3D Spatial Nodes
      spots.forEach((spot, idx) => {
        const isSelected = spot.id === selectedSpot.id;
        const dx = (spot.lng - userPosition[1]) * 15000;
        const dy = -(spot.lat - userPosition[0]) * 15000;
        const spotX = centerX + dx;
        const spotY = centerY + dy;

        // Glowing Connection Arc
        ctx.strokeStyle = isSelected ? 'rgba(245, 158, 11, 0.9)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.setLineDash(isSelected ? [6, 4] : []);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(centerX + dx / 2, centerY + dy / 2 - 40, spotX, spotY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Spot Beacon
        ctx.fillStyle = isSelected ? '#f59e0b' : '#10b981';
        ctx.beginPath();
        ctx.arc(spotX, spotY, isSelected ? 12 : 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`${spot.name} (💎 ${spot.gemScore})`, spotX + 16, spotY + 4);
      });

      angle += 0.02;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [spots, selectedSpot, userPosition]);

  return (
    <div className="w-full h-full relative bg-[#05070d] flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="w-full h-full max-w-full max-h-full cursor-crosshair"
      />
      <div className="absolute top-6 left-6 bg-black/70 border border-[#f59e0b]/40 rounded-2xl p-3.5 backdrop-blur-xl text-xs space-y-1">
        <div className="flex items-center gap-2 text-[#f59e0b] font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> 3D Spatial Deck.gl Radar Active
        </div>
        <p className="text-gray-400 text-[11px]">Real-time spatial node arcs & beacon elevation projection</p>
      </div>
    </div>
  );
}

export default function DualEngineMap({
  spots,
  selectedSpot,
  onSelectSpot,
  userPosition = [12.9716, 77.5946],
  isNavMode = false,
}: DualEngineMapProps) {
  const [styleMode, setStyleMode] = useState<MapStyleMode>('carto-dark');
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  const styleOptions: { mode: MapStyleMode; label: string; desc: string; icon: string }[] = [
    { mode: 'carto-dark', label: 'CartoDB Dark Matter', desc: 'Luxury high-contrast obsidian dark map', icon: '🌑' },
    { mode: 'deckgl-3d', label: 'Deck.gl 3D Spatial Radar', desc: 'Futuristic beacon arcs & live sweep', icon: '✨' },
    { mode: 'carto-voyager', label: 'CartoDB Voyager', desc: 'Clean architectural navigation', icon: '🧭' },
    { mode: 'osm-street', label: 'OpenStreetMap Classic', desc: 'Standard open street tiles', icon: '🗺️' },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 1. Map Renderer Switcher */}
      {styleMode === 'deckgl-3d' ? (
        <DeckGLEngine
          spots={spots}
          selectedSpot={selectedSpot}
          onSelectSpot={onSelectSpot}
          userPosition={userPosition}
        />
      ) : (
        <LeafletEngine
          spots={spots}
          selectedSpot={selectedSpot}
          onSelectSpot={onSelectSpot}
          styleMode={styleMode}
          userPosition={userPosition}
        />
      )}

      {/* 2. Style Selector Pill / Dropdown in Top-Right */}
      <div className="absolute top-4 right-4 z-30">
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/80 hover:bg-black/95 text-white border border-white/20 backdrop-blur-xl shadow-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#f59e0b]" />
            <span>{styleOptions.find((s) => s.mode === styleMode)?.label}</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-1">Style</span>
          </button>

          {/* Style Options Menu */}
          {showStyleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0b101b]/95 border border-white/15 rounded-3xl p-2 shadow-2xl backdrop-blur-2xl z-50 animate-fade-in space-y-1">
              <div className="px-3 py-2 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Choose Map Rendering Engine
              </div>
              {styleOptions.map((opt) => (
                <button
                  key={opt.mode}
                  onClick={() => {
                    setStyleMode(opt.mode);
                    setShowStyleMenu(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-start gap-3 ${
                    styleMode === opt.mode
                      ? 'bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-white'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{opt.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
