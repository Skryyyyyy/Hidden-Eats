'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const [progress, setProgress] = useState(0);

  // Simulate order progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 100 ? p + 1 : 100));
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Determine current stage based on progress
  let currentStage = 'Preparing';
  let eta = '35-45 min';
  if (progress > 30) {
    currentStage = 'Driver at Restaurant';
    eta = '25-30 min';
  }
  if (progress > 60) {
    currentStage = 'On the Way';
    eta = '10-15 min';
  }
  if (progress > 90) {
    currentStage = 'Arriving Soon';
    eta = '1-2 min';
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 selection:bg-[#f8b11c] selection:text-black">
      <div className="max-w-4xl mx-auto animate-fade-in">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-display uppercase tracking-widest text-white">Live Tracking</h1>
            <p className="text-gray-400 mt-2">Order #HE-8492 • Ambur Star Biryani</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-1">Estimated Arrival</span>
            <span className="text-3xl font-bold text-[#f8b11c]">{eta}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Map */}
          <div className="lg:col-span-2 relative h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
            {/* Map Background Placeholder */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
            
            {/* Fake Route */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" preserveAspectRatio="none">
              <path d="M 200 400 Q 300 300, 400 350 T 600 200" fill="none" stroke="#f8b11c" strokeWidth="4" strokeDasharray="10 10" className="animate-[dash_20s_linear_infinite]" />
            </svg>

            {/* Restaurant Marker */}
            <div className="absolute top-[200px] right-[25%] bg-[#1a1a1a] p-3 rounded-full border-2 border-white shadow-xl">
              <span className="text-xl">🏪</span>
            </div>

            {/* Home Marker */}
            <div className="absolute bottom-[100px] left-[25%] bg-[#1a1a1a] p-3 rounded-full border-2 border-[#f8b11c] shadow-xl">
              <MapPin className="w-6 h-6 text-[#f8b11c]" />
            </div>

            {/* Moving Car Marker */}
            <motion.div 
              className="absolute top-[50%] left-[50%] bg-white p-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"
              animate={{ 
                x: [0, 50, -50, -150],
                y: [0, 20, 100, 150]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Navigation className="w-6 h-6 text-black -rotate-45" />
            </motion.div>

          </div>

          {/* Right Column: Status & Driver */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status Card */}
            <div className="bg-[#111] p-6 rounded-3xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Status</h2>
              
              <div className="relative pt-4">
                {/* Progress Line */}
                <div className="absolute left-[15px] top-8 bottom-4 w-[2px] bg-white/10" />
                <motion.div 
                  className="absolute left-[15px] top-8 w-[2px] bg-[#f8b11c]" 
                  initial={{ height: 0 }}
                  animate={{ height: `${progress}%` }}
                />

                <div className="space-y-8 relative z-10">
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${progress >= 0 ? 'bg-[#f8b11c] border-[#f8b11c]' : 'bg-[#111] border-white/20'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${progress >= 0 ? 'text-black' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${progress >= 0 ? 'text-white' : 'text-gray-500'}`}>Order Confirmed</h3>
                      <p className="text-xs text-gray-500 mt-1">7:15 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${progress >= 30 ? 'bg-[#f8b11c] border-[#f8b11c]' : 'bg-[#111] border-white/20'}`}>
                      <CheckCircle2 className={`w-4 h-4 ${progress >= 30 ? 'text-black' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${progress >= 30 ? 'text-white' : 'text-gray-500'}`}>Preparing your food</h3>
                      <p className="text-xs text-gray-500 mt-1">Ambur Star Biryani</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${progress >= 60 ? 'bg-[#f8b11c] border-[#f8b11c]' : 'bg-[#111] border-white/20'}`}>
                      <Navigation className={`w-4 h-4 ${progress >= 60 ? 'text-black' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${progress >= 60 ? 'text-white' : 'text-gray-500'}`}>On the way</h3>
                      <p className="text-xs text-gray-500 mt-1">Rahul is arriving soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Card */}
            {progress > 30 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111] p-6 rounded-3xl border border-white/10"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-[#f8b11c] flex items-center justify-center font-bold text-white">
                      R
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Rahul Sharma</h3>
                      <p className="text-xs text-gray-400">4.9 ★ • Honda Activa</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-green-500/10 hover:bg-green-500/20 transition-colors border border-green-500/20 flex items-center justify-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                    <Phone className="w-4 h-4" /> Call
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
