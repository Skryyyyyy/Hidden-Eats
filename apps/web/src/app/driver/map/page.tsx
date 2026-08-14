'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, Navigation2, Check, X, Clock, Navigation as NavIcon, Flame, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverMapPage() {
  const [activeRequest, setActiveRequest] = useState<boolean>(true);
  const [acceptedOrder, setAcceptedOrder] = useState<boolean>(false);
  const [isBatched, setIsBatched] = useState<boolean>(true);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-64px)] md:min-h-screen bg-[#111] overflow-hidden flex flex-col">
      
      {/* Map Background Placeholder & Heatmaps */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}>
        {/* Fake Map Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-[#333] rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/3 w-64 h-2 bg-[#333] rotate-45 opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-2 bg-[#333] -rotate-12 opacity-50" />
        
        {/* Heatmap / Surge Zones */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[40%] right-[30%] w-48 h-48 bg-[#f8b11c]/30 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Heatmap Labels */}
        <div className="absolute top-[35%] right-[28%] bg-red-500 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1">
          <Flame className="w-3 h-3" /> +₹50 Surge
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8">
        {/* Header */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display uppercase tracking-wider text-white">Map & Deliveries</h1>
          <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Flame className="w-4 h-4" /> High Demand Zone
          </div>
        </div>

        {/* Order Request Card Overlay */}
        <div className="flex-1 flex items-end md:items-start justify-center md:justify-end mt-auto md:mt-0">
          <AnimatePresence>
            {activeRequest && !acceptedOrder && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="w-full max-w-md bg-[#1a1a1a] border border-[#f8b11c]/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(248,177,28,0.15)] mb-4 md:mb-0 relative overflow-hidden"
              >
                {/* Radar sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8b11c]/10 to-transparent opacity-50 animate-pulse pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-[#f8b11c] text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                          New Request
                        </span>
                        {isBatched && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                            Batched Order (x2)
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-4xl font-display text-white">₹{isBatched ? '245.50' : '185.50'}</h3>
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-2 font-medium">
                        <Clock className="w-4 h-4 text-[#f8b11c]" /> Est. {isBatched ? '35' : '22'} mins
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col items-center">
                        <span className="text-xl font-bold text-white">{isBatched ? '6.8' : '4.2'}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">KM</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                        <MapPin className="w-4 h-4 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Pick up</p>
                        <p className="font-medium text-white">Ambur Star Biryani {isBatched && '& A2B Sweets'}</p>
                        <p className="text-sm text-gray-400">Anna Nagar East</p>
                      </div>
                    </div>
                    
                    <div className="pl-4 border-l-2 border-white/10 ml-4 h-6"></div>

                    {isBatched && (
                      <>
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                            <Navigation2 className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-xs text-blue-500 uppercase tracking-widest font-bold mb-1">Drop off 1</p>
                            <p className="font-medium text-white">Customer A (4.9 ★)</p>
                            <p className="text-sm text-gray-400">Shenoy Nagar</p>
                          </div>
                        </div>
                        <div className="pl-4 border-l-2 border-white/10 ml-4 h-6"></div>
                      </>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#f8b11c]/20 flex items-center justify-center shrink-0 mt-1">
                        <Navigation2 className="w-4 h-4 text-[#f8b11c]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#f8b11c] uppercase tracking-widest font-bold mb-1">Drop off {isBatched && '2'}</p>
                        <p className="font-medium text-white">Customer {isBatched ? 'B' : ''} (4.8 ★)</p>
                        <p className="text-sm text-gray-400">T-Nagar</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveRequest(false)}
                      className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                    <button 
                      onClick={() => setAcceptedOrder(true)}
                      className="flex-[2] py-4 rounded-2xl bg-[#f8b11c] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#e0a019] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(248,177,28,0.4)]"
                    >
                      <Check className="w-4 h-4" /> Accept Order
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {acceptedOrder && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md bg-[#1a1a1a] border border-[#f8b11c]/30 rounded-3xl p-6 shadow-2xl mb-4 md:mb-0 relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Heading to Pickup 1 of {isBatched ? '2' : '1'}</span>
                    <h3 className="text-2xl font-display text-white">Ambur Star Biryani</h3>
                  </div>
                  <div className="bg-[#f8b11c]/20 p-3 rounded-full animate-pulse">
                    <NavIcon className="w-6 h-6 text-[#f8b11c]" />
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm font-medium">Order #</span>
                    <span className="text-white font-mono font-bold">HE-8492</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-medium">Items</span>
                    <span className="text-white font-medium">3 items (Paid)</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setAcceptedOrder(false);
                    setActiveRequest(false);
                    setTimeout(() => {
                      setIsBatched(false); // Simulate single order next
                      setActiveRequest(true);
                    }, 3000);
                  }}
                  className="w-full py-5 rounded-2xl bg-[#f8b11c] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#e0a019] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#f8b11c]/20 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">Slide to Confirm Pickup <ChevronRight className="w-4 h-4 opacity-50" /></span>
                  {/* Fake slide effect */}
                  <div className="absolute left-2 top-2 bottom-2 w-12 bg-black/20 rounded-xl group-hover:w-[calc(100%-16px)] transition-all duration-500 ease-in-out" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map centering button */}
          <button className="absolute bottom-24 md:bottom-8 right-4 md:right-8 bg-[#1a1a1a] p-4 rounded-full border border-white/10 shadow-xl hover:bg-white/5 transition-colors">
            <Navigation className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Add ChevronRight icon import since it's used in the button now
function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
