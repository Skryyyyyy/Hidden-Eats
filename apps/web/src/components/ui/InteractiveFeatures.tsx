'use client';

import React, { useState, MouseEvent } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Zap, MapPin, ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react';

const FEATURES = [
  { 
    icon: <Zap className="w-6 h-6 text-[#f8b11c]" />, 
    title: 'Lightning Fast', 
    desc: 'Average delivery time of 25 minutes. We take hot food seriously.',
    img: '/img/burger.png',
    overlayTitle: 'Hot & Ready',
    overlayDesc: 'Prep time: 5 mins',
    overlayIcon: <Clock className="w-6 h-6 text-white" />
  },
  { 
    icon: <MapPin className="w-6 h-6 text-[#f8b11c]" />, 
    title: 'Live Tracking', 
    desc: 'Watch your order travel from the kitchen straight to your door in real-time.',
    img: '/img/pizza.png',
    overlayTitle: 'Out for Delivery',
    overlayDesc: 'Arriving in 12 mins',
    overlayIcon: <Truck className="w-6 h-6 text-white" />
  },
  { 
    icon: <ShieldCheck className="w-6 h-6 text-[#f8b11c]" />, 
    title: 'No Minimum Order', 
    desc: 'Craving just a coffee? We\'ve got you covered. No hidden fees.',
    img: '/img/sushi.png',
    overlayTitle: 'Payment Secure',
    overlayDesc: 'Zero hidden fees',
    overlayIcon: <CreditCard className="w-6 h-6 text-white" />
  }
];

export default function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Damping for smooth physics
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Convert mouse position to rotation values (tilt range: -15deg to 15deg)
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize mouse coordinates between -0.5 and 0.5
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset to center smoothly
    mouseX.set(0);
    mouseY.set(0);
  };

  // Stagger variants for the feature list
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100
      }
    }
  };

  const activeData = FEATURES[activeFeature];

  return (
    <div className="w-full bg-[#111111] py-24 md:py-32 px-6 md:px-12 flex flex-col items-center z-20 relative border-t border-white/5">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Side: Text and Interactive Feature List */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#f8b11c] font-bold tracking-widest uppercase text-sm mb-4 block">Why Choose Us</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight font-black leading-[1.1]">
              More Than Just<br />Delivery.
            </h2>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {FEATURES.map((feat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                onMouseEnter={() => setActiveFeature(idx)}
                className={`flex gap-6 group cursor-pointer p-4 rounded-2xl transition-colors duration-300 ${
                  activeFeature === idx ? 'bg-white/10 border border-white/20' : 'bg-transparent border border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  activeFeature === idx ? 'bg-[#f8b11c]/20 border border-[#f8b11c]/50' : 'bg-white/5 border border-white/10'
                }`}>
                  {feat.icon}
                </div>
                <div>
                  <h4 className={`font-bold text-xl mb-2 transition-colors duration-300 ${
                    activeFeature === idx ? 'text-[#f8b11c]' : 'text-white group-hover:text-white/90'
                  }`}>
                    {feat.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Side: 3D Interactive Mockup */}
        <div className="relative hidden md:block" style={{ perspective: 1000 }}>
           <div className="w-full aspect-square bg-[#f8b11c] rounded-full blur-[120px] opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
           
           <motion.div 
             className="relative z-10 w-full h-[600px] rounded-[3rem] overflow-hidden border-8 border-[#1a1a1a] shadow-2xl"
             onMouseMove={handleMouseMove}
             onMouseLeave={handleMouseLeave}
             style={{
               rotateX: rotateX,
               rotateY: rotateY,
               transformStyle: 'preserve-3d'
             }}
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
           >
             <AnimatePresence mode="wait">
               <motion.img 
                 key={activeData.img}
                 src={activeData.img} 
                 alt="App interface" 
                 className="absolute inset-0 w-full h-full object-cover" 
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.5 }}
               />
             </AnimatePresence>

             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
             
             {/* Floating Interactive Overlay Card */}
             <motion.div 
               className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl pointer-events-none"
               style={{ transform: 'translateZ(50px)' }} // 3D pop effect
             >
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={activeFeature}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                       {activeData.overlayIcon}
                     </div>
                     <div>
                       <h5 className="text-white font-bold text-lg">{activeData.overlayTitle}</h5>
                       <p className="text-green-400 text-sm font-medium">{activeData.overlayDesc}</p>
                     </div>
                   </div>
                   <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-green-500 rounded-full"
                       initial={{ width: "0%" }}
                       animate={{ width: activeFeature === 1 ? "66%" : "100%" }}
                       transition={{ duration: 1, ease: "easeInOut" }}
                     ></motion.div>
                   </div>
                 </motion.div>
               </AnimatePresence>
             </motion.div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
