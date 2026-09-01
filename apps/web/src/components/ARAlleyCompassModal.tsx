'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Compass, X, Sparkles, Navigation, MapPin, Eye, Zap } from 'lucide-react';

interface ARGMRSpot {
  id: string;
  name: string;
  distanceMeters: number;
  bearingDeg: number;
  signatureDish: string;
  gemScore: number;
}

const SAMPLE_AR_SPOTS: ARGMRSpot[] = [
  {
    id: 'AR_1',
    name: 'Sri Balaji Mutton Mess',
    distanceMeters: 85,
    bearingDeg: 25,
    signatureDish: 'Seeraga Samba Mutton Biryani',
    gemScore: 9.6,
  },
  {
    id: 'AR_2',
    name: 'Kallu Kadai Secret Corner',
    distanceMeters: 140,
    bearingDeg: -40,
    signatureDish: 'Kallu Kadai Mutton Chukka',
    gemScore: 9.3,
  },
  {
    id: 'AR_3',
    name: 'Heritage Degree Coffee Vault',
    distanceMeters: 210,
    bearingDeg: 60,
    signatureDish: 'Degree Filter Coffee & Podi Dosa',
    gemScore: 9.8,
  },
];

interface ARAlleyCompassModalProps {
  onClose: () => void;
}

export default function ARAlleyCompassModal({ onClose }: ARAlleyCompassModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [heading, setHeading] = useState<number>(0);
  const [selectedSpot, setSelectedSpot] = useState<ARGMRSpot>(SAMPLE_AR_SPOTS[0]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        }
      } catch (err) {
        console.warn('Camera stream permission not granted or unsupported, showing radar simulation mode:', err);
      }
    }

    initCamera();

    // Simulated / live compass sweep
    const interval = setInterval(() => {
      setHeading((prev) => (prev + 1) % 360);
    }, 100);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-4">
      <div className="relative w-full max-w-2xl h-[85vh] bg-[#05070a] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                AR Alley Compass & Vision HUD
              </h3>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Spatial Gem Radar Active
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Camera Viewport or High-Tech Radar Simulation Grid */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111827_0%,_#05070a_100%)] flex flex-col items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="w-72 h-72 rounded-full border border-amber-500/20 flex items-center justify-center relative animate-spin-slow">
                <div className="w-48 h-48 rounded-full border border-amber-500/30 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-amber-500/40 flex items-center justify-center">
                    <Compass className="w-8 h-8 text-[#f59e0b] opacity-80" />
                  </div>
                </div>
                {/* Radar Sweep Line */}
                <div className="absolute top-1/2 left-1/2 w-36 h-0.5 bg-gradient-to-r from-[#f59e0b] to-transparent origin-left" />
              </div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-6">
                Point Camera Down Alley to Lock In Target
              </p>
            </div>
          )}

          {/* Floating 3D AR Spot Markers */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-around px-8">
            {SAMPLE_AR_SPOTS.map((spot, index) => {
              const isSelected = selectedSpot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className={`pointer-events-auto cursor-pointer transition-all duration-300 transform ${
                    isSelected ? 'scale-110 -translate-y-4' : 'scale-95 opacity-85'
                  }`}
                >
                  <div className="bg-[#0b101b]/90 border-2 border-[#f59e0b] rounded-2xl p-3 shadow-[0_0_30px_rgba(245,158,11,0.4)] backdrop-blur-xl text-white text-center space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                      <span className="text-[9px] font-black uppercase text-[#f59e0b]">
                        💎 {spot.gemScore} GEM
                      </span>
                    </div>

                    <h4 className="text-xs font-black truncate max-w-[140px]">{spot.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-bold">{spot.distanceMeters}m Straight</p>

                    <div className="w-2 h-2 rounded-full bg-[#f59e0b] mx-auto animate-ping" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom AR Target Card */}
        <div className="p-5 bg-[#0a0d14] border-t border-white/10 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#f59e0b]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{selectedSpot.name}</h4>
              <p className="text-xs text-gray-400">{selectedSpot.signatureDish}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5 fill-black" />
            <span>Guide Here</span>
          </button>
        </div>
      </div>
    </div>
  );
}
