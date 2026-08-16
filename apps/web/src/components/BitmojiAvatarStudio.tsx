'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, RefreshCw, Wand2 } from 'lucide-react';

export interface BitmojiConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  expression: string;
  accessory: string;
  outfitColor: string;
  bgColor: string;
  style: string;
  seed: string;
}

interface BitmojiAvatarStudioProps {
  initialConfig?: BitmojiConfig;
  onSave: (avatarSvgUrl: string, config: BitmojiConfig) => void;
  onClose: () => void;
}

// DiceBear Open-Source GitHub Avatar Engines
const DICEBEAR_STYLES = [
  { id: 'lorelei', name: 'Lorelei (Modern Bitmoji)', preview: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Foodie1' },
  { id: 'avataaars', name: 'Avataaars (Pablo Stanley)', preview: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chef2' },
  { id: 'personas', name: 'Personas (Minimal Vector)', preview: 'https://api.dicebear.com/7.x/personas/svg?seed=Diner3' },
  { id: 'adventurer', name: 'Adventurer (3D Fantasy)', preview: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Explorer4' },
  { id: 'big-smile', name: 'Big Smile (Anime Vector)', preview: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Chef5' },
  { id: 'bottts', name: 'Bottts (Cyber Foodie)', preview: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber6' },
];

const SKIN_TONES = [
  { id: '#ffdfc4', label: 'Fair Ivory' },
  { id: '#f8d5b1', label: 'Warm Peach' },
  { id: '#e0ac69', label: 'Golden Wheat' },
  { id: '#c68642', label: 'Honey Bronze' },
  { id: '#8d5524', label: 'Rich Cocoa' },
  { id: '#583313', label: 'Deep Ebony' },
];

const HAIR_STYLES = [
  { id: 'chefHat', label: 'Chef Hat 👨‍🍳' },
  { id: 'shortFade', label: 'Sleek Fade' },
  { id: 'curlyAfro', label: 'Curly Afro' },
  { id: 'bun', label: 'South Indian Bun' },
  { id: 'beanie', label: 'Foodie Beanie 🧢' },
];

const EXPRESSIONS = [
  { id: 'gourmetSmile', label: 'Gourmet Smile 😁' },
  { id: 'chefKiss', label: 'Chef Kiss 😘' },
  { id: 'wink', label: 'Hungry Wink 😉' },
  { id: 'sunglasses', label: 'Foodie Sunglasses 😎' },
];

const ACCESSORIES = [
  { id: 'none', label: 'None' },
  { id: 'apron', label: 'Master Chef Apron 🎽' },
  { id: 'goldenSpoon', label: 'Golden Spoon 🥄' },
  { id: 'biryaniPot', label: 'Biryani Pot 🥘' },
  { id: 'coffee', label: 'Filter Coffee ☕' },
];

const BG_GRADIENTS = [
  { id: 'from-[#f59e0b] to-[#d97706]', label: 'Golden Ember' },
  { id: 'from-[#10b981] to-[#059669]', label: 'Emerald Mint' },
  { id: 'from-[#3b82f6] to-[#1d4ed8]', label: 'Cyber Sapphire' },
  { id: 'from-[#ec4899] to-[#be185d]', label: 'Berry Blast' },
  { id: 'from-[#8b5cf6] to-[#6d28d9]', label: 'Royal Purple' },
];

export default function BitmojiAvatarStudio({ initialConfig, onSave, onClose }: BitmojiAvatarStudioProps) {
  const [config, setConfig] = useState<BitmojiConfig>(
    initialConfig || {
      skinTone: '#e0ac69',
      hairStyle: 'chefHat',
      hairColor: '#1a1a1a',
      expression: 'gourmetSmile',
      accessory: 'apron',
      outfitColor: '#10b981',
      bgColor: 'from-[#f59e0b] to-[#d97706]',
      style: 'lorelei',
      seed: 'FoodieExplorer_' + Math.floor(Math.random() * 1000),
    }
  );

  const [activeTab, setActiveTab] = useState<'dicebear' | 'skin' | 'hair' | 'face' | 'props' | 'bg'>('dicebear');

  const diceBearUrl = `https://api.dicebear.com/7.x/${config.style}/svg?seed=${encodeURIComponent(config.seed)}`;

  const randomizeSeed = () => {
    setConfig({
      ...config,
      seed: 'Foodie_' + Math.floor(Math.random() * 99999),
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].id,
      bgColor: BG_GRADIENTS[Math.floor(Math.random() * BG_GRADIENTS.length)].id,
    });
  };

  const handleSave = () => {
    onSave(diceBearUrl, config);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0d0d0e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Bitmoji Avatar Studio (DiceBear & Avataaars Engine)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden p-6 gap-6">
          {/* Left Column: Live Vector Avatar Preview */}
          <div className="flex flex-col items-center justify-center space-y-4 bg-black/40 rounded-2xl p-6 border border-white/10 relative">
            <div className={`w-44 h-44 rounded-full bg-gradient-to-br ${config.bgColor} p-1.5 shadow-2xl relative flex items-center justify-center`}>
              <img
                src={diceBearUrl}
                alt="Live Vector Bitmoji"
                className="w-full h-full rounded-full object-cover bg-black/20"
              />
            </div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b] block">
                STYLE: {config.style.toUpperCase()}
              </span>
              <span className="text-xs text-white/60">Seed: {config.seed}</span>
            </div>

            {/* Randomize Button */}
            <button
              type="button"
              onClick={randomizeSeed}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#f59e0b]" /> Randomize Seed & Avatar
            </button>
          </div>

          {/* Right Column: Customizer Tabs & Options */}
          <div className="flex flex-col h-full overflow-hidden">
            {/* Customizer Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-white/10 pb-2 mb-4 overflow-x-auto">
              {[
                { id: 'dicebear', label: 'GitHub Vector Styles' },
                { id: 'skin', label: 'Skin Tone' },
                { id: 'hair', label: 'Hairstyle' },
                { id: 'face', label: 'Expression' },
                { id: 'bg', label: 'Background' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#f59e0b] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {/* 0. DiceBear GitHub Styles */}
              {activeTab === 'dicebear' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {DICEBEAR_STYLES.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setConfig({ ...config, style: st.id })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        config.style === st.id ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white font-bold' : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <img src={st.preview} alt={st.name} className="w-8 h-8 rounded-full bg-white/10 p-0.5 shrink-0" />
                      <span className="truncate text-left">{st.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 1. Skin Tone */}
              {activeTab === 'skin' && (
                <div className="grid grid-cols-3 gap-2.5">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setConfig({ ...config, skinTone: tone.id, seed: config.seed + '_tone' })}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                        config.skinTone === tone.id ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white' : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: tone.id }} />
                      <span className="truncate">{tone.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2. Hairstyle */}
              {activeTab === 'hair' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {HAIR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setConfig({ ...config, hairStyle: style.id, seed: config.seed + '_' + style.id })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        config.hairStyle === style.id ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white' : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 3. Expressions */}
              {activeTab === 'face' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {EXPRESSIONS.map((expr) => (
                    <button
                      key={expr.id}
                      onClick={() => setConfig({ ...config, expression: expr.id, seed: config.seed + '_' + expr.id })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        config.expression === expr.id ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white' : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {expr.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 4. Background */}
              {activeTab === 'bg' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {BG_GRADIENTS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setConfig({ ...config, bgColor: bg.id })}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        config.bgColor === bg.id ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-white' : 'border-white/10 text-white/70 hover:border-white/30'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs shadow-lg shadow-[#f59e0b]/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" /> Save & Apply Bitmoji Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
