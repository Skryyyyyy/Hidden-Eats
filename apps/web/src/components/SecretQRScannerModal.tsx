'use client';

import React, { useState } from 'react';
import { QrCode, Sparkles, CheckCircle2, X, Lock, Flame } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface SecretQRScannerModalProps {
  onClose: () => void;
  onSecretUnlocked?: (dishName: string, xp: number) => void;
}

export default function SecretQRScannerModal({ onClose, onSecretUnlocked }: SecretQRScannerModalProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [qrCodeInput, setQrCodeInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [unlockedDish, setUnlockedDish] = useState<{ name: string; desc: string; xp: number } | null>(null);

  const handleScanSecret = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const unlocked = {
        name: 'Midnight Ghost Pepper Mutton Chukka',
        desc: 'Unlisted secret recipe passed down through 3 generations. Only orderable with table passcode.',
        xp: 50,
      };
      setUnlockedDish(unlocked);
      if (onSecretUnlocked) {
        onSecretUnlocked(unlocked.name, unlocked.xp);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in text-white">
      <div className="relative w-full max-w-md bg-[#121214] border border-white/15 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#f8b11c]/20 text-[#f8b11c] flex items-center justify-center border border-[#f8b11c]/30">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-tight">Table Secret QR Scanner</h3>
            <p className="text-xs text-gray-400">Scan restaurant table QR to unlock off-menu dishes</p>
          </div>
        </div>

        {unlockedDish ? (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-yellow-300 text-black rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                🎉 SECRET DISH UNLOCKED (+{unlockedDish.xp} XP)
              </span>
              <h4 className="text-xl font-black uppercase tracking-tight mt-3 text-white">
                {unlockedDish.name}
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed px-4">
                {unlockedDish.desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#f8b11c] shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Secret Passcode for Waiter</p>
                <p className="font-mono text-sm text-[#f8b11c] font-black">#VAULT-88</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-[#f8b11c] hover:bg-[#e0a019] text-black font-bold text-xs uppercase tracking-widest transition-all shadow-lg"
            >
              Add to Active Order
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Viewfinder simulation */}
            <div className="relative w-full h-48 rounded-2xl bg-black border-2 border-dashed border-[#f8b11c]/50 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-x-8 top-1/2 h-0.5 bg-[#f8b11c] shadow-[0_0_12px_#f8b11c] animate-pulse" />
              <QrCode className="w-16 h-16 text-white/20" />
              <p className="text-[11px] text-gray-400 mt-2 font-medium">Point camera at table card QR</p>
            </div>

            <form onSubmit={handleScanSecret} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  Or Enter Table Passcode Manually
                </label>
                <input
                  type="text"
                  value={qrCodeInput}
                  onChange={(e) => setQrCodeInput(e.target.value)}
                  placeholder="e.g. HE-TABLE-04"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-mono text-white outline-none focus:border-[#f8b11c] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {isScanning ? 'Unlocking Secret Vault...' : 'Unlock Off-Menu Dish'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
