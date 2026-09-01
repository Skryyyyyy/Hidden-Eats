'use client';

import React, { useState } from 'react';
import { Route, Sparkles, MapPin, Clock, ArrowRight, Check, X, Compass, ChevronRight } from 'lucide-react';
import { FoodCrawlSpot, optimizeFoodCrawlRoute, OptimizedFoodCrawl } from '@/lib/foodCrawlOptimizer';

interface FoodCrawlDrawerProps {
  availableSpots: FoodCrawlSpot[];
  onClose: () => void;
  onApplyCrawlRoute: (crawl: OptimizedFoodCrawl) => void;
}

export default function FoodCrawlDrawer({
  availableSpots,
  onClose,
  onApplyCrawlRoute,
}: FoodCrawlDrawerProps) {
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>(
    availableSpots.slice(0, 3).map((s) => s.id)
  );

  const toggleSpot = (id: string) => {
    if (selectedSpotIds.includes(id)) {
      if (selectedSpotIds.length > 2) {
        setSelectedSpotIds(selectedSpotIds.filter((sId) => sId !== id));
      }
    } else {
      if (selectedSpotIds.length < 5) {
        setSelectedSpotIds([...selectedSpotIds, id]);
      }
    }
  };

  const selectedSpots = availableSpots.filter((s) => selectedSpotIds.includes(s.id));

  // Current user starting point (default Bangalore / Chennai coordinate)
  const startLoc = { lat: 12.9716, lng: 77.5946 };
  const optimizedCrawl = optimizeFoodCrawlRoute(startLoc, selectedSpots);

  const handleStartCrawl = () => {
    onApplyCrawlRoute(optimizedCrawl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0a0d14] border-l border-white/10 h-full flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Multi-Stop Food Crawl</h3>
              <p className="text-[10px] text-gray-400">TSP Optimized Food Trail Route</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Trail Summary Card */}
        <div className="p-6 bg-gradient-to-br from-[#121929] to-[#0a0d14] border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#f59e0b] font-bold">
              Optimized Sequence ({optimizedCrawl.orderedSpots.length} Gems)
            </span>
            <span className="text-xs font-black text-emerald-400">
              {optimizedCrawl.totalDistanceKm} km total
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Est. Tour: {optimizedCrawl.totalDurationMins} Mins</span>
            </div>
            <div className="flex items-center gap-1 text-gray-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>+250 Gem XP</span>
            </div>
          </div>
        </div>

        {/* Spot Selection List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Select 2 to 5 Spots for Your Evening Trail:
          </label>

          {availableSpots.map((spot) => {
            const isSelected = selectedSpotIds.includes(spot.id);
            const stopIndex = optimizedCrawl.orderedSpots.findIndex((s) => s.id === spot.id);

            return (
              <div
                key={spot.id}
                onClick={() => toggleSpot(spot.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#f59e0b]/10 border-[#f59e0b]/50 shadow-lg shadow-[#f59e0b]/10'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                      isSelected
                        ? 'bg-[#f59e0b] text-black shadow-md'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {isSelected ? stopIndex + 1 : '+'}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                      {spot.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                      {spot.signatureDish}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#f59e0b] block">
                    💎 {spot.gemScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <button
            onClick={handleStartCrawl}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-black uppercase tracking-wider text-xs shadow-xl shadow-[#f59e0b]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Launch Multi-Stop Trail Route</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
