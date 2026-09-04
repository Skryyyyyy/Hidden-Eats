'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion';

export interface DockItemData {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export interface DockProps {
  items: DockItemData[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  className?: string;
  position?: 'bottom' | 'top';
}

function DockItem({
  item,
  mouseX,
  baseItemSize,
  magnification,
  distanceThreshold,
}: {
  item: DockItemData;
  mouseX: MotionValue<number>;
  baseItemSize: number;
  magnification: number;
  distanceThreshold: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-distanceThreshold, 0, distanceThreshold],
    [baseItemSize, magnification, baseItemSize]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 170,
    damping: 12,
  });

  const content = (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={item.onClick}
      className={`relative flex items-center justify-center rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 hover:border-[#f8b11c]/60 text-white hover:text-[#f8b11c] shadow-lg backdrop-blur-xl transition-colors cursor-pointer group select-none ${
        item.className || ''
      }`}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-1 px-3 py-1 rounded-xl bg-[#0d0e14]/95 border border-white/20 text-[#f8b11c] text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow-2xl pointer-events-none z-50 backdrop-blur-md flex items-center gap-1"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Wrapper with Dynamic Scaling */}
      <div className="flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-200">
        {item.icon}
      </div>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

export default function Dock({
  items = [],
  panelHeight = 80,
  baseItemSize = 54,
  magnification = 84,
  distance = 140,
  className = '',
  position = 'bottom',
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={`fixed ${
        position === 'bottom' ? 'bottom-6' : 'top-6'
      } left-1/2 -translate-x-1/2 z-50 pointer-events-auto ${className}`}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{ height: panelHeight }}
        className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-[#090a10]/85 border border-white/[0.14] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_25px_rgba(248,177,28,0.1)] transition-all"
      >
        {items.map((item, idx) => (
          <DockItem
            key={idx}
            item={item}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distanceThreshold={distance}
          />
        ))}
      </motion.div>
    </div>
  );
}
