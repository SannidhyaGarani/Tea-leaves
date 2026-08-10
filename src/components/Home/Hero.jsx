import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Leaf, Package, Coffee, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const featureBadges = [
    { icon: Leaf, label: 'Premium\nAssam Tea' },
    { icon: Package, label: 'Freshly\nPacked' },
    { icon: Coffee, label: 'Rich\nAroma' },
    { icon: Truck, label: 'Pan India\nDelivery' },
  ];

  return (
    <section className="bg-[#fbf8f3] pt-28 md:pt-32 pb-12 md:pb-16 px-4 md:px-10 overflow-hidden relative font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* ── LEFT CONTENT (Cols 1-6) ── */}
        <div className="lg:col-span-6 flex flex-col items-start z-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-[#2e5b2a] text-sm">🌱</span>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#2e5b2a] uppercase">
              100% PREMIUM ASSAM TEA
            </span>
          </motion.div>

          {/* Hindi Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold text-[#1b3b1a] leading-[1.1] mb-6"
            style={{ fontFamily: 'Georgia, "Noto Sans Devanagari", serif' }}
          >
            हर घूंट में<br />
            <span className="text-[#2e5b2a]">छुपी एक कहानी</span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-zinc-600 font-normal leading-relaxed max-w-md mb-8"
          >
            Varta Chai sirf ek cup chai nahi, balki un lamhon ka naam hai jo apno ke saath baatein, muskurahat aur yaadein banate hain.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mb-12 flex-wrap"
          >
            <Link
              to="/shop"
              className="bg-[#1b3b1a] hover:bg-[#2e5b2a] text-white text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/about"
              className="bg-white hover:bg-zinc-50 border border-[#1b3b1a] text-[#1b3b1a] text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-sm flex items-center gap-2 transition-all"
            >
              <div className="w-4 h-4 rounded-full bg-[#1b3b1a] text-white flex items-center justify-center text-[8px]">
                <Play size={8} fill="currentColor" />
              </div>
              <span>OUR STORY</span>
            </Link>
          </motion.div>

          {/* 4 Feature Badges Horizontal Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-4 gap-4 sm:gap-6 border-t border-zinc-200/80 pt-6 w-full max-w-lg"
          >
            {featureBadges.map((badge, idx) => {
              const IconComp = badge.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 rounded-full bg-[#f4efe6] flex items-center justify-center text-[#1b3b1a] mb-2 group-hover:scale-105 transition-transform">
                    <IconComp size={18} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-700 leading-tight whitespace-pre-line">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

        </div>

        {/* ── RIGHT IMAGE (Cols 7-12) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-6 relative flex justify-center"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full max-w-xl aspect-[4/3] sm:aspect-[16/11]">
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop"
              alt="Vaarta Chai Premium Tea Experience"
              className="w-full h-full object-cover"
            />
            {/* Overlay glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
