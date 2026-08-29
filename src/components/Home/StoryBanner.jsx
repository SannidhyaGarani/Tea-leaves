import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, Sparkles, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const StoryBanner = () => {
  const BG_IMAGE =
    'https://res.cloudinary.com/dcjn4y284/image/upload/v1788006323/Gemini_Generated_Image_aof7l0aof7l0aof7_udhtjj.png';

  return (
    <section
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-20 font-sans bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: `url('${BG_IMAGE}')`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      {/* Subtle Overlay to maximize background image visibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/15 pointer-events-none" />

      {/* Full-width container content */}
      <div className="relative z-10 mx-auto max-w-[1380px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Narrative Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
          >
            {/* Gold Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B38A45]/25 border border-[#B38A45]/50 text-[#f5d78a] text-[11px] font-bold tracking-[0.22em] uppercase mb-3.5 backdrop-blur-md">
              <Sparkles size={13} />
              <span>DIRECT FROM ASSAM ESTATES</span>
            </div>

            {/* Main Headline */}
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight text-white leading-tight">
              Authentic Garden Freshness <span className="italic text-[#e5be6b]">In Every Brew</span>
            </h3>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-white/90 font-normal mt-2.5 leading-relaxed max-w-xl">
              Experience single-origin Assam tea, hand-harvested by master pluckers and delivered fresh to preserve every drop of natural aroma.
            </p>

            {/* Micro Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-5 text-xs sm:text-sm font-medium text-white/95">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Leaf size={14} className="text-[#e5be6b]" />
                <span>100% Whole Leaf</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={14} className="text-[#e5be6b]" />
                <span>Zero Artificial Flavours</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                <Award size={14} className="text-[#e5be6b]" />
                <span>Garden Fresh Seal</span>
              </div>
            </div>
          </motion.div>

          {/* Right Action CTA Button */}
          

        </div>
      </div>
    </section>
  );
};

export default StoryBanner;
