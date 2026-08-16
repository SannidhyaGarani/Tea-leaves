import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const HERO_IMAGE_URL = "/img/Gemini_Generated_Image_fro2ckfro2ckfro2.png";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section 
      className="relative w-full bg-[#faf5ec] pt-[145px] sm:pt-[155px] lg:pt-[165px] pb-12 sm:pb-14 lg:pb-[65px] font-sans overflow-hidden"
      aria-label="Vaarta Chai Hero Section"
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dce7d7]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#e8dcc7]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ── LEFT PANEL: EDITORIAL BRAND NARRATIVE (5 Cols on LG) ── */}
          <div className="lg:col-span-5 relative z-10 flex flex-col justify-center">
            
            {/* Background Leaf Line-Art Watermark */}
            <svg 
              className="absolute -top-6 -left-6 w-40 h-40 text-[#173b25]/8 pointer-events-none z-0" 
              viewBox="0 0 200 200" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M20,180 C10,110 70,30 170,30 C150,110 70,180 20,180 Z" strokeWidth="1.2" />
              <path d="M20,180 Q85,105 170,30" strokeWidth="1.2" />
              <path d="M60,140 Q45,130 35,140" strokeWidth="0.8" />
              <path d="M90,110 Q75,95 65,105" strokeWidth="0.8" />
            </svg>

            <motion.div
              className="relative z-10 max-w-xl mx-auto lg:mx-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Eyebrow Tag */}
              <motion.div variants={itemVariants} className="mb-3 flex items-center gap-2.5">
                <span className="h-px w-8 bg-[#B38A45]" />
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#B38A45]">
                  100% Garden Fresh Assam Tea
                </span>
                <span className="h-px w-8 bg-[#B38A45]" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                variants={itemVariants}
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.35rem] font-medium text-[#173b25] leading-[1.12] tracking-tight mb-2"
              >
                Har Cup <span className="italic text-[#B38A45]">Sirf Chai Nahi...</span>
              </motion.h1>

              {/* Hindi Tagline */}
              <motion.h2 
                variants={itemVariants}
                className="text-xl sm:text-2xl lg:text-[1.85rem] font-normal text-[#173b25] mt-1 mb-4"
                style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
              >
                हर घूंट में छुपी एक कहानी
              </motion.h2>

              {/* Gold Emblem Line Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 my-4">
                <div className="w-10 h-[1px] bg-[#B38A45]/35" />
                <div className="text-[#B38A45]"><Leaf size={14} /></div>
                <div className="w-10 h-[1px] bg-[#B38A45]/35" />
              </motion.div>

              {/* Narrative Subtext */}
              <motion.p 
                variants={itemVariants}
                className="text-xs sm:text-sm md:text-[0.94rem] text-[#636156] font-normal leading-relaxed mb-8 max-w-md"
              >
                Vaarta Chai believes every cup starts a conversation. From family gatherings to quiet mornings, our carefully selected Assam tea brings warmth, aroma, and authentic taste to every sip.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-3 sm:gap-4 flex-col sm:flex-row w-full sm:w-auto"
              >
                <Link 
                  to="/shop" 
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#173b25] hover:bg-[#245433] text-white px-8 py-3.5 sm:py-4 text-xs font-extrabold tracking-[0.25em] uppercase rounded-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>EXPLORE COLLECTION</span>
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link 
                  to="/about" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-transparent hover:bg-[#173b25]/5 text-[#173b25] border border-[#173b25]/40 hover:border-[#173b25] px-6 py-3.5 sm:py-4 text-xs font-extrabold tracking-[0.25em] uppercase rounded-xs transition-all duration-300"
                >
                  <div className="w-4 h-4 rounded-full border border-[#173b25] flex items-center justify-center pl-0.5">
                    <Play size={8} fill="currentColor" />
                  </div>
                  <span>OUR STORY</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* ── RIGHT PANEL: ENLARGED CRISP PRODUCT IMAGE (7 Cols on LG) ── */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center lg:justify-end">
            
            {/* Ambient Backdrop Glow */}
            <div className="pointer-events-none absolute -inset-6 bg-[#B38A45]/20 rounded-full blur-3xl" />

            {/* Enlarged Pure, Crisp Image Container without card background */}
            <div className="relative w-full max-w-2xl lg:max-w-3xl aspect-[16/10] sm:aspect-[1.45/1] lg:aspect-[1.5/1] min-h-[360px] sm:min-h-[460px] lg:min-h-[560px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl z-10 bg-white">
              
              {/* Top Floating Glass Badge */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-[#173b25]/90 backdrop-blur-md text-[#F7F2E8] px-4 py-2.5 rounded-full border border-[#B38A45]/40 shadow-xl text-[9.5px] font-bold uppercase tracking-[0.22em]">
                <Sparkles size={12} className="text-[#B38A45]" />
                <span>Signature Assam CTC</span>
              </div>

              {/* 100% Crisp Large Product Photography */}
              <img 
                src={HERO_IMAGE_URL} 
                alt="Vaarta Chai Premium Assam CTC Tea"
                className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000 ease-out" 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;




