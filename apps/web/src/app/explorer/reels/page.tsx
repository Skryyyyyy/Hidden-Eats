'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  Plus,
  ChevronLeft,
  Volume2,
  VolumeX,
  Bookmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Vertical food videos from Pexels (free) for demonstration
const MOCK_REELS = [
  {
    id: 'r1',
    title: "Tasting the Legendary Secret Smoked Biryani 🔥 This is truly one of the most hidden gems in the city. The meat just falls off the bone and the aroma is incredible! Definitely worth the 40 minute wait.",
    spotName: 'Grand Secret Kitchen',
    distance: '2.4 km away',
    author: '@biryani_baba',
    views: '24.5K',
    videoUrl: 'https://videos.pexels.com/video-files/3206478/3206478-uhd_2160_4096_25fps.mp4',
    dishTagged: 'Smoked Mutton Biryani (₹340)',
    rating: 5,
    commentsCount: 142,
    location: [80.2707, 13.0827],
  },
  {
    id: 'r2',
    title: 'Double Smashed Secret Cheese Burger Prep 🍔 Look at that cheese pull! The crust on these patties is absolutely insane. You have to ask for the secret menu to get this double-stacked masterpiece.',
    spotName: 'Alleyway Street Bakes',
    distance: '5.1 km away',
    author: '@foodie_nikita',
    views: '18.2K',
    videoUrl: 'https://videos.pexels.com/video-files/2822238/2822238-uhd_3840_2160_24fps.mp4',
    dishTagged: 'Secret Cheese Smash Burger (₹180)',
    rating: 5,
    commentsCount: 89,
    location: [77.5946, 12.9716],
  },
  {
    id: 'r3',
    title: 'Hidden Latte Art in the quietest cafe ☕ A peaceful morning at my favorite spot. They roast their own beans and the baristas are basically artists.',
    spotName: 'Café De Quietude',
    distance: '1.2 km away',
    author: '@coffee_explorer',
    views: '10.1K',
    videoUrl: 'https://videos.pexels.com/video-files/3125434/3125434-uhd_3840_2160_25fps.mp4',
    dishTagged: 'Signature Matcha Latte (₹220)',
    rating: 4.8,
    commentsCount: 45,
    location: [80.2458, 13.0515],
  }
];

const VIBES = ['🔥 Trending', '☕ Hidden Cafes', '🌶️ Street Food', '✨ Date Night', '🌙 Late Night'];

// Haptic feedback utility
const vibrate = () => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(50);
  }
};

export default function FoodieReelsPage() {
  const [reels, setReels] = useState(MOCK_REELS);
  const [likes, setLikes] = useState<Record<string, number>>({ r1: 1420, r2: 890, r3: 450 });
  const [likedState, setLikedState] = useState<Record<string, boolean>>({});
  const [savedState, setSavedState] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState(true);
  const [activeVibe, setActiveVibe] = useState('🔥 Trending');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local blob URL for the uploaded video
    const videoUrl = URL.createObjectURL(file);
    const newReel = {
      id: `local-${Date.now()}`,
      title: "My Uploaded Foodie Reel ✨ Just testing out a custom upload from my own device!",
      spotName: "My Local Spot",
      distance: "Just now",
      author: "@you",
      views: "1",
      videoUrl: videoUrl,
      dishTagged: "Custom Upload",
      rating: 5,
      commentsCount: 0,
      location: [0, 0]
    };

    // Prepend the new reel to the list
    setReels(prev => [newReel, ...prev]);
    vibrate();
  };

  const toggleLike = useCallback((id: string) => {
    vibrate();
    setLikedState((prev) => {
      const isLiked = !prev[id];
      setLikes((l) => ({ ...l, [id]: isLiked ? (l[id] || 0) + 1 : (l[id] || 0) - 1 }));
      return { ...prev, [id]: isLiked };
    });
  }, []);

  const toggleSave = useCallback((id: string) => {
    vibrate();
    setSavedState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-black text-white overflow-hidden relative">
      {/* Floating Top Navigation & Vibe Pills */}
      <div className="absolute top-0 inset-x-0 z-50 pt-6 px-6 flex flex-col gap-4 pointer-events-none">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 pointer-events-auto">
            <Link href="/explorer" onClick={vibrate} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors">
              <ChevronLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight drop-shadow-md">Reels</h1>
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            <button 
              onClick={() => { vibrate(); setMuted(!muted); }}
              className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors"
            >
              {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
            <button onClick={() => { vibrate(); fileInputRef.current?.click(); }} className="p-3 bg-[#FFB703] text-black rounded-full shadow-lg hover:bg-[#E5A503] transition-colors flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </button>
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </div>
        </div>

        {/* Vibe Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pointer-events-auto pb-2">
          {VIBES.map(vibe => (
            <button
              key={vibe}
              onClick={() => { vibrate(); setActiveVibe(vibe); }}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md transition-colors border",
                activeVibe === vibe 
                  ? "bg-white text-black border-white" 
                  : "bg-black/40 text-white/90 border-white/20 hover:bg-black/60"
              )}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
        {reels.map((reel) => (
          <ReelItem 
            key={reel.id} 
            reel={reel} 
            isLiked={!!likedState[reel.id]} 
            isSaved={!!savedState[reel.id]}
            likeCount={likes[reel.id] || 0}
            onToggleLike={() => toggleLike(reel.id)}
            onToggleSave={() => toggleSave(reel.id)}
            isMuted={muted}
          />
        ))}
      </div>
    </div>
  );
}

function ReelItem({ reel, isLiked, isSaved, likeCount, onToggleLike, onToggleSave, isMuted }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  // Intersection Observer to auto-play/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.error('Play failed:', e));
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.8 } // Trigger when 80% visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleVideoClick = () => {
    vibrate();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent normal click pause
    vibrate();
    
    // Show heart animation
    setShowBigHeart(true);
    setTimeout(() => setShowBigHeart(false), 1000);

    // If not liked already, like it
    if (!isLiked) {
      onToggleLike();
    }
  };

  return (
    <div className="h-[100dvh] w-full snap-start snap-always relative flex items-center justify-center bg-[#111]">
      
      {/* Video Container with Double Tap tracking */}
      <div 
        className="w-full h-full relative" 
        onClick={handleVideoClick} 
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={reel.videoUrl}
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover"
        />

        {/* Double Tap Big Heart Animation */}
        <AnimatePresence>
          {showBigHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
            >
              <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && !showBigHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-20 h-20 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white ml-2" />
            </div>
          </div>
        )}
      </div>

      {/* Gradient Overlay for text readability */}
      <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* UI Overlay */}
      <div className="absolute bottom-0 inset-x-0 pb-6 pt-4 px-6 z-30 flex items-end justify-between pointer-events-none">
        
        {/* Left Side: Info */}
        <div className={cn("flex-1 pr-16 space-y-3 pointer-events-auto transition-all", captionExpanded ? "bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-white/10" : "")}>
          {!captionExpanded && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#FFB703] bg-[#FFB703]/20 border border-[#FFB703]/40 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                {reel.views} Views
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                ★ {reel.rating} / 5
              </span>
            </div>
          )}

          <div>
            <p className="text-sm font-bold text-white/90 drop-shadow-md pb-1">
              {reel.author}
            </p>
            <h2 className={cn("font-bold leading-tight drop-shadow-md", captionExpanded ? "text-base" : "text-xl sm:text-2xl line-clamp-2")}>
              {reel.title}
            </h2>
            <button 
              onClick={(e) => { e.stopPropagation(); vibrate(); setCaptionExpanded(!captionExpanded); }}
              className="text-[#FFB703] text-sm font-bold mt-1 drop-shadow-md active:opacity-70"
            >
              {captionExpanded ? "Show less" : "...more"}
            </button>
          </div>

          {!captionExpanded && (
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#10b981] bg-[#092615]/80 px-3 py-2 rounded-xl border border-[#0f4424] w-fit backdrop-blur-md">
                <span className="text-base">🏷️</span> {reel.dishTagged}
              </div>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-white bg-white/10 px-3 py-2 rounded-xl border border-white/20 w-fit backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer" onClick={() => vibrate()}>
                <MapPin className="w-4 h-4 text-[#FFB703]" /> 
                <span>{reel.spotName}</span>
                <span className="text-white/50">•</span>
                <span className="text-[#10b981]">{reel.distance}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Actions Stack */}
        {!captionExpanded && (
          <div className="flex flex-col items-center gap-5 pointer-events-auto">
            <button 
              onClick={onToggleLike}
              className="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform"
            >
              <div className={cn(
                "p-3.5 rounded-full backdrop-blur-md transition-colors",
                isLiked ? "bg-red-500 text-white shadow-lg shadow-red-500/40" : "bg-black/40 border border-white/20 hover:bg-black/60"
              )}>
                <Heart className={cn("w-6 h-6", isLiked && "fill-white")} />
              </div>
              <span className="text-xs font-bold drop-shadow-md">{likeCount}</span>
            </button>

            <button onClick={vibrate} className="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform">
              <div className="p-3.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md hover:bg-black/60 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold drop-shadow-md">{reel.commentsCount}</span>
            </button>

            <button onClick={onToggleSave} className="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform">
              <div className={cn(
                "p-3.5 rounded-full backdrop-blur-md transition-colors",
                isSaved ? "bg-[#FFB703] text-black shadow-lg shadow-[#FFB703]/40" : "bg-black/40 border border-white/20 hover:bg-black/60 text-white"
              )}>
                <Bookmark className={cn("w-6 h-6", isSaved && "fill-black")} />
              </div>
              <span className="text-xs font-bold drop-shadow-md">Save</span>
            </button>

            <button onClick={vibrate} className="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform">
              <div className="p-3.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-md hover:bg-black/60 transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold drop-shadow-md">Share</span>
            </button>

            <Link href="/explorer/map" onClick={vibrate} className="flex flex-col items-center gap-1.5 mt-2 hover:scale-105 active:scale-95 transition-transform">
              <div className="w-12 h-12 rounded-full border-2 border-[#FFB703] overflow-hidden relative shadow-lg shadow-[#FFB703]/20">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&auto=format&fit=crop" 
                  className="w-full h-full object-cover"
                  alt="Map"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#FFB703] uppercase">Radar</span>
            </Link>
          </div>
        )}
      </div>

      {/* Interactive Progress Bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-40">
        <div 
          className="h-full bg-[#FFB703] transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
