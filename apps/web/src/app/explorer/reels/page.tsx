'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import ExplorerNav from '@/components/ExplorerNav';
import { useTheme } from '@/context/ThemeContext';
import {
  Play,
  Flame,
  Heart,
  Share2,
  MessageCircle,
  MapPin,
  PlusCircle,
  Check,
  Video,
  Send,
  UploadCloud,
  FileVideo,
  X,
} from 'lucide-react';

interface FoodReel {
  id: string;
  title: string;
  spotName: string;
  author: string;
  views: string;
  image: string;
  dishTagged?: string;
  rating?: number;
  commentsCount: number;
}

export default function FoodieReelsPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Reels Data State
  const [reels, setReels] = useState<FoodReel[]>([
    {
      id: 'r1',
      title: "Making of Chef's Secret Smoked Biryani 🔥",
      spotName: 'Grand Secret Kitchen',
      author: '@biryani_baba',
      views: '24.5K Views',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
      dishTagged: 'Smoked Mutton Biryani (₹340)',
      rating: 5,
      commentsCount: 142,
    },
    {
      id: 'r2',
      title: 'Double Smashed Secret Cheese Burger Prep 🍔',
      spotName: 'Alleyway Street Bakes',
      author: '@foodie_nikita',
      views: '18.2K Views',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
      dishTagged: 'Secret Cheese Smash Burger (₹180)',
      rating: 5,
      commentsCount: 89,
    },
  ]);

  const [likes, setLikes] = useState<Record<string, number>>({ r1: 1420, r2: 890 });
  const [likedState, setLikedState] = useState<Record<string, boolean>>({ r1: false, r2: false });

  // Modal & Drag-and-Drop File Upload State
  const [createModal, setCreateModal] = useState(false);
  const [reelTitle, setReelTitle] = useState('');
  const [selectedSpot, setSelectedSpot] = useState('Grand Secret Kitchen');
  const [authorHandle, setAuthorHandle] = useState('@foodie_explorer');
  const [dishTagged, setDishTagged] = useState('');
  const [reelRating, setReelRating] = useState(5);
  const [postSuccess, setPostSuccess] = useState(false);

  // File Upload State (Drag and Drop / PC Explorer)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLike = (id: string) => {
    setLikedState((prev) => {
      const isLiked = !prev[id];
      setLikes((l) => ({ ...l, [id]: isLiked ? (l[id] || 0) + 1 : (l[id] || 0) - 1 }));
      return { ...prev, [id]: isLiked };
    });
  };

  // Drag and Drop File Handlers
  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('video/') || file.type.startsWith('image/'))) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handlePostReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelTitle.trim()) return;

    const newReel: FoodReel = {
      id: `r-${Date.now()}`,
      title: reelTitle,
      spotName: selectedSpot,
      author: authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`,
      views: '1 View • Just Now',
      image: previewUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop',
      dishTagged: dishTagged || undefined,
      rating: reelRating,
      commentsCount: 0,
    };

    setReels([newReel, ...reels]);
    setLikes((prev) => ({ ...prev, [newReel.id]: 1 }));
    setLikedState((prev) => ({ ...prev, [newReel.id]: true }));

    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setCreateModal(false);
      setReelTitle('');
      setUploadedFile(null);
      setPreviewUrl('');
      setDishTagged('');
    }, 1500);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isLight ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#000000] text-[#e1e1e1]'}`}>
      <ExplorerNav />

      <main className="max-w-xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1 my-auto animate-fade-in">
        {/* Instagram Header */}
        <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-[#f59e0b]" /> INSTAGRAM-STYLE FOOD BLOGGING
            </span>
            <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Foodie Reels & Spot Reviews
            </h1>
          </div>

          <button
            onClick={() => setCreateModal(true)}
            className="px-4 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#f59e0b]/20 transition-all flex items-center gap-1.5 hover-lift"
          >
            <PlusCircle className="w-4 h-4" /> Upload PC / Gallery Reel
          </button>
        </div>

        {/* Reels Feed */}
        <div className="space-y-6">
          {reels.map((reel) => {
            const isLiked = likedState[reel.id];
            const count = likes[reel.id] || 0;

            return (
              <div
                key={reel.id}
                className="border border-[#1c1c1c] rounded-3xl overflow-hidden bg-[#0a0a0a] shadow-2xl relative group hover-lift"
              >
                <div className="h-[520px] w-full relative overflow-hidden">
                  <img
                    src={reel.image}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#f59e0b]/90 text-black flex items-center justify-center shadow-2xl backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-black ml-1" />
                    </div>
                  </div>

                  {/* Right Actions Bar */}
                  <div className="absolute right-4 bottom-16 z-20 flex flex-col gap-4 items-center text-white">
                    <button
                      onClick={() => toggleLike(reel.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      <div className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                        isLiked ? 'bg-red-500 border-red-500 text-white scale-110' : 'bg-black/60 border-white/20 hover:bg-black'
                      }`}>
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                      </div>
                      <span className="text-[10px] font-bold">{count}</span>
                    </button>

                    <button className="flex flex-col items-center gap-1">
                      <div className="p-3 rounded-full bg-black/60 border border-white/20 backdrop-blur-md">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold">{reel.commentsCount}</span>
                    </button>

                    <button className="flex flex-col items-center gap-1">
                      <div className="p-3 rounded-full bg-black/60 border border-white/20 backdrop-blur-md">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold">Share</span>
                    </button>
                  </div>

                  {/* Bottom Video Details */}
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-10 text-left space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-[#f59e0b] bg-[#f59e0b]/20 border border-[#f59e0b]/40 px-2.5 py-0.5 rounded-full inline-block">
                        {reel.views}
                      </span>
                      {reel.rating && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          ★ {reel.rating} / 5 Rating
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-white leading-tight">{reel.title}</h2>

                    {reel.dishTagged && (
                      <div className="text-[11px] font-semibold text-[#10b981] bg-[#092615] px-2.5 py-1 rounded-lg border border-[#0f4424] w-fit">
                        🏷️ Tagged Dish: {reel.dishTagged}
                      </div>
                    )}

                    <p className="text-xs text-[#aaaaaa] flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" /> {reel.spotName} • <strong className="text-white">{reel.author}</strong>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 📸 PC File Drag & Drop + Mobile Gallery Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-scale-in">
          <div className="w-full max-w-lg bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {postSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#10b981]/20 border border-[#10b981] text-[#10b981] flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-white">Reel Published Live! 🚀</h3>
                <p className="text-xs text-[#888888]">
                  Your uploaded food video for {selectedSpot} is now live in the community feed.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostReel} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#262626] pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#f59e0b]" />
                    <h3 className="text-base font-bold text-white">Upload Food Reel Video</h3>
                  </div>
                  <button type="button" onClick={() => setCreateModal(false)} className="text-[#777777] font-bold text-sm">
                    ✕
                  </button>
                </div>

                {/* 📂 Drag & Drop Zone + PC File Picker */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#f59e0b] bg-[#f59e0b]/10 scale-102'
                      : previewUrl
                      ? 'border-[#10b981] bg-[#092615]/30'
                      : 'border-[#333333] hover:border-[#f59e0b] bg-[#181818]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />

                  {previewUrl ? (
                    <div className="space-y-2">
                      <div className="relative h-40 max-w-xs mx-auto rounded-xl overflow-hidden border border-[#222222]">
                        {uploadedFile?.type.startsWith('video/') ? (
                          <video src={previewUrl} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={previewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#10b981] flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" /> File Selected: {uploadedFile?.name || 'Media Uploaded'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <UploadCloud className="w-10 h-10 text-[#f59e0b] mx-auto animate-bounce" />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Drag & Drop Food Video / Photo Here
                        </span>
                        <span className="text-[11px] text-[#777777]">
                          or click to browse local PC files & phone gallery
                        </span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#222222] text-[#888888] inline-block font-mono">
                        Supports MP4, MOV, WEBM, JPG, PNG
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Select Hotel / Restaurant</label>
                  <select
                    value={selectedSpot}
                    onChange={(e) => setSelectedSpot(e.target.value)}
                    className="w-full bg-[#181818] border border-[#262626] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#f59e0b]"
                  >
                    <option value="Grand Secret Kitchen">Grand Secret Kitchen (Brigade Road)</option>
                    <option value="Alleyway Street Bakes">Alleyway Street Bakes (Indiranagar)</option>
                    <option value="Café De Quietude">Café De Quietude (Koramangala)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Reel Title / Blog Caption</label>
                  <input
                    type="text"
                    required
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    placeholder="e.g. Tasting the Secret Smoked Biryani 🤤🔥"
                    className="w-full bg-[#181818] border border-[#262626] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#777777] uppercase mb-1">Tagged Secret Dish & Price</label>
                  <input
                    type="text"
                    value={dishTagged}
                    onChange={(e) => setDishTagged(e.target.value)}
                    placeholder="e.g. Smoked Biryani (₹340)"
                    className="w-full bg-[#181818] border border-[#262626] text-white rounded-xl p-2.5 text-xs outline-none focus:border-[#f59e0b]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-[#777777] uppercase">Star Rating:</label>
                    <select
                      value={reelRating}
                      onChange={(e) => setReelRating(Number(e.target.value))}
                      className="bg-[#181818] border border-[#262626] text-[#f59e0b] font-bold rounded-lg px-2 py-1 text-xs"
                    >
                      {[5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>★ {s} Stars</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#f59e0b]/20 transition-all flex items-center gap-1.5 hover-lift"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish Reel Live
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
