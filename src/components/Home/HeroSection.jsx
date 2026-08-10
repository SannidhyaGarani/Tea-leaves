import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const VIDEO_URL = "https://res.cloudinary.com/dcjn4y284/video/upload/v1786380180/Assam_tea_plantation_sunrise_202608102210_zj4cua.mp4";
  const POSTER_URL = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1920&auto=format&fit=crop";

  const handleScrollDown = () => {
    const nextSection = document.getElementById('home-content') || document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  // Staggered motion variants (respects prefers-reduced-motion)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.18,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section 
      className="relative w-full h-screen min-h-[580px] md:min-h-[650px] overflow-hidden flex items-end md:items-center justify-end bg-[#0b1a0e] text-white pb-12 md:pb-0"
      aria-label="Vaarta Chai Luxury Hero Section"
    >
      {/* ── CINEMATIC VIDEO BACKGROUND ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={POSTER_URL}
        onLoadedData={() => setIsVideoLoaded(true)}
        onError={() => setVideoError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-[center_left] z-0 transition-opacity duration-1000 ease-out ${
          isVideoLoaded || videoError ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <source src={VIDEO_URL} type="video/mp4" />
        Your browser does not support full screen HTML5 background video.
      </video>

      {/* Fallback Static Image if Video fails */}
      {videoError && (
        <img
          src={POSTER_URL}
          alt="Assam Tea Plantation Sunrise"
          className="absolute inset-0 w-full h-full object-cover object-[center_left] z-0 opacity-100"
        />
      )}

      {/* ── TAILWIND EDITORIAL GRADIENT OVERLAYS ── */}
      {/* Horizontal / Mobile gradient: calm right side on desktop, dark bottom on mobile */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b md:bg-gradient-to-r from-[#0b1a0e]/45 via-[#0b1a0e]/20 md:via-[#0b1a0e]/15 to-[#0b1a0e]/95 md:to-[#0b1a0e]/90 via-[35%] md:via-[40%]" 
      />
      {/* Top & bottom subtle vignette for luxury editorial depth */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#0a160c]/70 via-transparent to-[#0a160c]/80 via-[25%] to-[95%]" 
      />

      {/* ── HERO CONTENT (RIGHT-ALIGNED) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex justify-start md:justify-end">
        <motion.div
          className="w-full max-w-[520px] flex flex-col items-start text-left pt-16 md:pt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow Tag */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 font-sans text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-[#e6c875] mb-3 md:mb-5"
          >
            <Sparkles size={14} className="text-[#e6c875]" />
            <span>100% PREMIUM ASSAM TEA</span>
          </motion.div>

          {/* Main English Heading (Editorial High-Contrast Serif) */}
          <motion.h1 
            variants={itemVariants} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-white mb-2 drop-shadow-md"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
          >
            Har Cup Sirf Chai Nahi...
          </motion.h1>

          {/* Hindi Tagline Subheading */}
          <motion.h2 
            variants={itemVariants} 
            className="text-xl sm:text-2xl md:text-3xl font-normal leading-snug text-[#e6dfd3] mb-4 md:mb-6 drop-shadow-sm"
            style={{ fontFamily: '"Noto Sans Devanagari", Georgia, serif' }}
          >
            हर घूंट में छुपी एक कहानी
          </motion.h2>

          {/* Short Description */}
          <motion.p 
            variants={itemVariants} 
            className="font-sans text-sm sm:text-base font-light leading-relaxed text-[#f7f2ea]/90 max-w-md mb-7 md:mb-9 tracking-wide"
          >
            Carefully selected Assam tea, crafted to bring warmth, aroma and unforgettable moments to every cup.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-3 sm:gap-4 flex-wrap w-full sm:w-auto"
          >
            <Link 
              to="/shop" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1b3b1a] hover:bg-[#244b23] text-white border border-[#d4af37]/40 hover:border-[#e6c875] px-7 py-3.5 md:py-4 text-xs font-bold tracking-[0.22em] uppercase rounded-xs transition-all duration-300 shadow-lg shadow-[#0b1a0e]/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40" 
              aria-label="Explore Collection"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight size={14} />
            </Link>

            <Link 
              to="/about" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/15 backdrop-blur-md text-[#e6dfd3] hover:text-white border border-white/25 hover:border-white/60 px-7 py-3.5 md:py-4 text-xs font-bold tracking-[0.22em] uppercase rounded-xs transition-all duration-300 hover:-translate-y-0.5" 
              aria-label="Our Story"
            >
              <Play size={10} fill="currentColor" />
              <span>OUR STORY</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── SCROLL TO EXPLORE INDICATOR ── */}
      <motion.button
        type="button"
        onClick={handleScrollDown}
        className="hidden md:flex absolute bottom-8 left-10 lg:left-14 z-10 items-center gap-3 cursor-pointer group bg-transparent border-0 p-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-label="Scroll to explore more content"
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-white/70 group-hover:text-white transition-colors duration-300">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[1px] h-9 bg-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#e6c875] to-white"
            animate={{ y: ['-100%', '200%'], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
