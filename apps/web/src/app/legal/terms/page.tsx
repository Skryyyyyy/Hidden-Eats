'use client';

import React from 'react';
import Link from 'next/link';
import { HiddenEatsLogo } from '@/components/Sidebar';
import { ShieldCheck, ArrowLeft, FileText, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function LegalTermsPage() {
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
              <ShieldCheck className="w-3.5 h-3.5" /> GOVERNMENT COMPLIANCE & LEGAL NORMS
            </span>
          </div>
          <h1 className={`text-h1 text-4xl sm:text-5xl tracking-tight ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
            Terms & Conditions of Service
          </h1>
          <p className={`text-body text-sm font-bold ${isLight ? 'text-[#6B7280]' : 'text-[#aaaaaa]'}`}>
            Last Updated: August 2026 • Compliant with IT Act 2000 & FSSAI Guidelines
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>1</span>
              Regulatory Compliance (FSSAI & Consumer Affairs)
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              All restaurant partners listed on Hidden Eats warrant compliance with Food Safety and Standards Authority of India (FSSAI) License Rules under the Food Safety and Standards Act, 2006. Partner restaurants must display valid FSSAI registration numbers on their digital storefronts.
            </p>
          </section>

          {/* Section 2 */}
          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>2</span>
              Data Protection & Privacy
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              Hidden Eats collects user geolocation data solely for dynamic proximity sorting and table reservation validation. User data is processed strictly in accordance with Information Technology Act, 2000 and DPDP Act provisions. Users retain the explicit right to download or permanently delete their account data at any time under Settings ➔ Privacy.
            </p>
          </section>

          {/* Section 3 */}
          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>3</span>
              Table Reservation & Pre-Order Rules
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              Table seat reservations made via Hidden Eats are valid for up to 15 minutes past the confirmed time slot. Restaurant partners reserve the right to reallocate unfulfilled tables after 15 minutes of non-arrival.
            </p>
          </section>

          {/* Section 4 */}
          <section className={`rounded-3xl p-8 border shadow-sm transition-all hover:shadow-md ${
            isLight ? 'bg-white border-black/8 hover:border-black/15' : 'bg-[#131A2C] border-[#23314a] hover:border-[#3b4c6b]'
          }`}>
            <h2 className={`text-card-title text-lg mb-4 flex items-center gap-3 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                isLight ? 'bg-[#FFF3E8] text-[#D62828]' : 'bg-[#261c07] text-[#FFB703]'
              }`}>4</span>
              User Review & Content Guidelines
            </h2>
            <p className={`text-body text-[15px] leading-relaxed ml-11 ${isLight ? 'text-[#4B5563]' : 'text-[#cccccc]'}`}>
              Diners submitting reviews must provide genuine feedback based on actual dining experiences. Defamatory, spammy, or artificially inflated reviews violate community standards and will result in instant account suspension.
            </p>
          </section>
        </div>

        <footer className={`text-center pt-8 border-t pb-8 ${
          isLight ? 'border-black/5' : 'border-[#23314a]'
        }`}>
          <div className="flex flex-col items-center gap-3">
            <HiddenEatsLogo />
            <p className={`text-label text-[11px] uppercase tracking-widest font-bold ${
              isLight ? 'text-[#6B7280]' : 'text-[#777777]'
            }`}>
              Hidden Eats Legal Operations • Support Contact: legal@hiddeneats.com
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
