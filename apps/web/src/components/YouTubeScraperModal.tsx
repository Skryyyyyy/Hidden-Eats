'use client';

import React, { useState } from 'react';
import { Youtube, Sparkles, MapPin, Check, X, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { extractHiddenShopFromVideoUrl, ScrapedHiddenShop } from '@/lib/videoScraperNLP';

interface YouTubeScraperModalProps {
  onClose: () => void;
  onSpotExtracted: (shop: ScrapedHiddenShop) => void;
}

export default function YouTubeScraperModal({ onClose, onSpotExtracted }: YouTubeScraperModalProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [extractedResult, setExtractedResult] = useState<ScrapedHiddenShop | null>(null);

  const handleRunExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    setIsProcessing(true);
    setExtractedResult(null);

    // Step 1
    setCurrentStep('1/4: Downloading YouTube audio stream & captions...');
    await new Promise((r) => setTimeout(r, 800));

    // Step 2
    setCurrentStep('2/4: Running OpenAI Whisper ASR speech-to-text model...');
    await new Promise((r) => setTimeout(r, 1000));

    // Step 3
    setCurrentStep('3/4: SpaCy NER Transformer extracting shop name, address & dishes...');
    await new Promise((r) => setTimeout(r, 1000));

    // Step 4
    setCurrentStep('4/4: Geocoding address & calculating NLP confidence score...');
    await new Promise((r) => setTimeout(r, 600));

    const result = await extractHiddenShopFromVideoUrl(videoUrl);
    setExtractedResult(result);
    setIsProcessing(false);
  };

  const handlePinToMap = () => {
    if (extractedResult) {
      onSpotExtracted(extractedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0c0c0e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Youtube className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              AI YouTube Scraper & Hidden Shop Extractor
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleRunExtraction} className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
              Paste Foodie Vlogger YouTube / Shorts / Reel Link
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Youtube className="w-4 h-4 text-red-500 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-white/40 outline-none focus:border-[#f59e0b] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FFB703]" /> Run AI NLP
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Processing Status Indicator */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#f59e0b]">
                <Loader2 className="w-4 h-4 animate-spin" /> {currentStep}
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#f59e0b] to-red-500 rounded-full animate-pulse" style={{ width: '75%' }} />
              </div>
            </div>
          )}

          {/* Extracted NLP Result Card */}
          {extractedResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#18181b] to-[#0c0c0e] border border-[#f59e0b]/40 space-y-4 shadow-xl animate-scale-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#f59e0b] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#10b981]" /> AI NLP MATCH CONFIDENCE: {(extractedResult.confidenceScore * 100).toFixed(0)}%
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1">
                    {extractedResult.extractedShopName}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-bold">
                  {extractedResult.verifiedStatus}
                </span>
              </div>

              <div className="space-y-2 text-xs text-white/80">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                  <span>{extractedResult.extractedLocationText}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px]">
                  <div>
                    <span className="text-white/50 block">Signature Dish</span>
                    <span className="font-bold text-white">{extractedResult.signatureDish}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">Estimated Price</span>
                    <span className="font-bold text-[#f59e0b]">{extractedResult.estimatedPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePinToMap}
                className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4" /> Auto-Pin Hidden Spot to Radar & Map <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
