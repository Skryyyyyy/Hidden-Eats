'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DepthCarouselItem {
  image: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

export interface DepthCarouselProps {
  items: DepthCarouselItem[];
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: 'left' | 'right';
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  loop?: boolean;
  className?: string;
}

export default function DepthCarousel({
  items = [],
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = 'right',
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  autoplay = false,
  autoplayInterval = 3500,
  loop = true,
  className = '',
}: DepthCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = items.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (loop ? (prev + 1) % total : Math.min(prev + 1, total - 1)));
  }, [total, loop]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (loop ? (prev - 1 + total) % total : Math.max(prev - 1, 0)));
  }, [total, loop]);

  useEffect(() => {
    if (!autoplay || isPaused || total <= 1) return;
    const timer = setInterval(handleNext, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, isPaused, total, autoplayInterval, handleNext]);

  if (total === 0) return null;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ perspective: `${perspective}px` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] flex items-center justify-center">
        {items.map((item, index) => {
          // Calculate circular offset relative to currentIndex
          let offset = index - currentIndex;
          if (loop) {
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
          }

          const absOffset = Math.abs(offset);
          if (absOffset > visibleCards) return null;

          const isCenter = offset === 0;
          const sign = offset < 0 ? -1 : 1;
          const tiltAngle = (tiltDirection === 'right' ? 1 : -1) * (offset * tilt * 0.8);
          const xPos = offset * spread * 1.5;
          const zPos = -absOffset * depth;
          const scale = Math.max(0.4, 1 - absOffset * falloff);
          const cardBlur = absOffset > 0 ? Math.min(absOffset * blur, 12) : 0;
          const opacity = Math.max(0.15, 1 - absOffset * 0.25);
          const zIndex = 50 - Math.round(absOffset * 10);

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                x: xPos,
                z: zPos,
                scale,
                rotateY: tiltAngle,
                opacity,
                filter: `blur(${cardBlur}px)`,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }}
              onClick={() => {
                if (isCenter && item.onClick) {
                  item.onClick();
                } else {
                  setCurrentIndex(index);
                }
              }}
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              className="absolute w-[260px] sm:w-[320px] md:w-[360px] h-[360px] sm:h-[440px] rounded-3xl overflow-hidden cursor-pointer shadow-[0_25px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(248,177,28,0.15)] border border-white/20 bg-[#121318] group"
            >
              <img
                src={item.image}
                alt={item.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />

              {/* Gradient Overlay & Metadata */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                {item.title && (
                  <h4 className="text-lg font-black uppercase tracking-tight text-white drop-shadow-md">
                    {item.title}
                  </h4>
                )}
                {item.subtitle && (
                  <p className="text-xs text-[#f8b11c] font-bold tracking-wider uppercase mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Center Highlight Border Glow */}
              {isCenter && (
                <div className="absolute inset-0 rounded-3xl border-2 border-[#f8b11c] pointer-events-none shadow-[inset_0_0_20px_rgba(248,177,28,0.3)] animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-[#f8b11c] text-white hover:text-black border border-white/20 flex items-center justify-center backdrop-blur-xl transition-all z-50 cursor-pointer shadow-2xl group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-[#f8b11c] text-white hover:text-black border border-white/20 flex items-center justify-center backdrop-blur-xl transition-all z-50 cursor-pointer shadow-2xl group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentIndex
                ? 'w-8 bg-[#f8b11c] shadow-lg shadow-[#f8b11c]/50'
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
