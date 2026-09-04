'use client';

import React from 'react';
import Link from 'next/link';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { Lock, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function LegalPrivacyPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen font-sans antialiased text-body transition-colors ${
      isLight ? 'bg-[#FFF8F1] text-[#1F2937]' : 'bg-[#05070D] text-white'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 border-b glass-header transition-colors ${
        isLight ? 'border-black/5 bg-[#FFF8F1]/70' : 'border-[#23314a] bg-[#05070D]/70'
      }`}>
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <HiddenEatsLogo />
          <Link href="/" className={`text-label text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-colors ${
            isLight ? 'text-[#6B7280] hover:text-[#D62828]' : 'text-[#888888] hover:text-[#FFB703]'
          }`}>
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
        </div>
      </header>

      <main className="p-6 sm:p-12 max-w-4xl mx-auto space-y-12 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <span className={`text-label text-[10px] uppercase font-bold px-4 py-1.5 rounded-full border flex items-center gap-2 ${
              isLight ? 'bg-[#FFF3E8] text-[#D62828] border-[#D62828]/20' : 'bg-[#261c07] text-[#FFB703] border-[#FFB703]/30'
            }`}>
              <Lock className="w-3.5 h-3.5" /> PRIVACY & DATA PROTECTION
            </span>
          </div>
          <h1 className={`text-h1 text-4xl sm:text-5xl tracking-tight ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
            Privacy Policy
          </h1>
          <p className={`text-body text-sm font-bold ${isLight ? 'text-[#6B7280]' : 'text-[#aaaaaa]'}`}>
            Last Updated: August 2026 • Compliant with DPDP Act & Global Privacy Standards
          </p>
        </div>

        <div className="space-y-6">
          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>1</span>
              Information We Collect
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              We collect information you provide directly to us when creating an account, ordering dishes, or submitting hidden gems. This includes your name, email address, phone number, delivery addresses, and payment information (handled securely via PCI-DSS certified gateways).
            </p>
          </section>

          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>2</span>
              Location Data Usage
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              With your permission, we use high-precision GPS signals to calculate accurate delivery radii, estimated arrival times, and display secret food spots on our live radar map. You can revoke location access anytime via your device settings.
            </p>
          </section>

          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>3</span>
              Security & Encryption
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              All user traffic is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. We never sell your personal contact details or browsing history to third-party advertising brokers.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
