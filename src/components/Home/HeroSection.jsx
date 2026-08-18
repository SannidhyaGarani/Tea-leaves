import React from 'react';
import { motion } from 'framer-motion';
import { Play, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const HERO_BG_DESKTOP = "https://res.cloudinary.com/dcjn4y284/image/upload/v1787066369/watermark-removed-Gemini_Generated_Image_nx9xlnx9xlnx9xln_o100rh.png";
  const HERO_IMAGE_MOBILE = "/img/Gemini_Generated_Image_fro2ckfro2ckfro2.png";

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
      className="relative w-full font-sans overflow-hidden bg-[#faf5ec]"
      aria-label="Vaarta Chai Hero Section"
    >
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (lg:block - Full Cloudinary Background Image & Left Content) */}
      {/* ========================================================================= */}
      <div 
        className="hidden lg:block relative w-full min-h-[730px] xl:min-h-[790px] 2xl:min-h-[850px] bg-cover bg-center bg-no-repeat pt-[185px] xl:pt-[200px] 2xl:pt-[215px] pb-24 xl:pb-28"
        style={{ backgroundImage: `url("${HERO_BG_DESKTOP}")` }}
      >
        {/* Soft Ambient Shadow Overlay on left for maximum text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf5ec]/90 via-[#faf5ec]/65 to-transparent w-[55%] pointer-events-none" />

        <div className="relative mx-auto max-w-[1440px] px-8 xl:px-14 h-full flex items-center">
          <div className="w-full lg:w-[52%] xl:w-[48%] relative z-10">

            <motion.div
              className="relative z-10 max-w-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Main Headline */}
              <motion.h1 
                variants={itemVariants}
                className="font-serif text-4xl xl:text-5xl 2xl:text-[3.5rem] font-medium text-[#173b25] leading-[1.15] tracking-tight mb-3"
              >
                Har Cup <br />
                <span>Sirf Chai Nahi...</span>
              </motion.h1>

              {/* Hindi Tagline */}
              <motion.h2 
                variants={itemVariants}
                className="text-2xl xl:text-3xl font-normal text-[#173b25] mt-1 mb-4"
                style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
              >
                हर घूंट में छुपी एक कहानी
              </motion.h2>

              {/* Gold Emblem Line Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-3 my-5">
                <div className="w-12 h-[1px] bg-[#B38A45]/40" />
                <div className="text-[#2d5a27]"><Leaf size={15} fill="#2d5a27" /></div>
                <div className="w-12 h-[1px] bg-[#B38A45]/40" />
              </motion.div>

              {/* Narrative Subtext */}
              <motion.p 
                variants={itemVariants}
                className="text-sm xl:text-[0.98rem] text-[#4a4942] font-medium leading-relaxed mb-8 max-w-lg"
              >
                Varta Chai believes every cup starts a conversation. From family gatherings to quiet mornings, our carefully selected premium tea brings warmth, aroma and unforgettable moments to every sip.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <Link 
                  to="/shop" 
                  className="inline-flex items-center justify-center bg-[#173b25] hover:bg-[#245433] text-white px-8 py-4 text-xs font-extrabold tracking-[0.25em] uppercase rounded-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>EXPLORE COLLECTION</span>
                </Link>

                <Link 
                  to="/about" 
                  className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-[#173b25] border border-[#173b25]/40 hover:border-[#173b25] px-7 py-4 text-xs font-extrabold tracking-[0.25em] uppercase rounded-xs transition-all duration-300 shadow-xs"
                >
                  <div className="w-4 h-4 rounded-full border border-[#173b25] flex items-center justify-center pl-0.5">
                    <Play size={8} fill="currentColor" />
                  </div>
                  <span>OUR STORY</span>
                </Link>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. MOBILE & MEDIUM DEVICES VIEW (lg:hidden - Full Screen Image & Clean Text) */}
      {/* ========================================================================= */}
      <div className="lg:hidden relative w-full pt-[130px] sm:pt-[150px] pb-14 sm:pb-16 bg-[#faf5ec]">
        
        {/* Soft Ambient Background Glows */}
        <div className="pointer-events-none absolute -left-36 top-16 h-80 w-80 rounded-full bg-[#dce7d7]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-36 top-1/2 h-80 w-80 rounded-full bg-[#e8dcc7]/50 blur-3xl" />

        <div className="relative mx-auto w-full px-0 sm:px-6">
          <div className="flex flex-col gap-6 sm:gap-10 items-center">
            
            {/* ── 1. FULL SCREEN PRODUCT IMAGE (Mobile & Medium View) ── */}
            <div className="relative w-full overflow-hidden">
              
              {/* Product Photography Container - Full Screen Edge-to-Edge */}
              <div className="relative w-full aspect-[16/11] sm:aspect-[1.5/1] min-h-[280px] sm:min-h-[400px] overflow-hidden bg-white sm:rounded-2xl">
                
                {/* Top Floating Luxury Glass Badge */}
                

                {/* Full Screen Product Image */}
                <img 
                  src={HERO_IMAGE_MOBILE} 
                  alt="Vaarta Chai Premium Assam CTC Tea"
                  className="w-full h-full object-cover object-center" 
                />
              </div>
            </div>

            {/* ── 2. BOTTOM TEXT CONTENT PANEL (No Border, No Shadow) ── */}
            <div className="relative z-10 flex flex-col justify-center w-full px-5 sm:px-8">
              
              {/* Clean Text Wrap - No Border & No Background Shadow */}
              <div className="relative p-0 sm:p-2">

                {/* Background Leaf Line-Art Watermark */}
                <svg 
                  className="absolute -top-6 -right-6 w-36 h-36 text-[#173b25]/8 pointer-events-none z-0" 
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
                  className="relative z-10 max-w-xl mx-auto text-center sm:text-left"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Main Headline */}
                  <motion.h1 
                    variants={itemVariants}
                    className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#173b25] leading-[1.14] tracking-tight mb-2"
                  >
                    Har Cup <br />
                    <span className="italic text-[#B38A45]">Sirf Chai Nahi...</span>
                  </motion.h1>

                  {/* Hindi Tagline */}
                  <motion.h2 
                    variants={itemVariants}
                    className="text-xl sm:text-2xl font-normal text-[#173b25] mt-1 mb-3"
                    style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
                  >
                    हर घूंट में छुपी एक कहानी
                  </motion.h2>

                  {/* Gold Emblem Line Divider */}
                  <motion.div variants={itemVariants} className="flex items-center justify-center sm:justify-start gap-3 my-4 sm:my-5">
                    <div className="w-12 h-[1px] bg-[#B38A45]/40" />
                    <div className="text-[#2d5a27]"><Leaf size={14} fill="#2d5a27" /></div>
                    <div className="w-12 h-[1px] bg-[#B38A45]/40" />
                  </motion.div>

                  {/* Narrative Subtext */}
                  <motion.p 
                    variants={itemVariants}
                    className="text-xs sm:text-sm md:text-[0.95rem] text-[#524f46] font-medium leading-relaxed mb-7 max-w-md mx-auto sm:mx-0"
                  >
                    Varta Chai believes every cup starts a conversation. From family gatherings to quiet mornings, our carefully selected premium tea brings warmth, aroma and unforgettable moments to every sip.
                  </motion.p>

                  {/* Action Buttons */}
                  <motion.div 
                    variants={itemVariants}
                    className="flex items-center gap-3.5 sm:gap-4 flex-col sm:flex-row w-full sm:w-auto"
                  >
                    <Link 
                      to="/shop" 
                      className="w-full sm:w-auto inline-flex items-center justify-center bg-[#173b25] hover:bg-[#245433] text-white px-8 py-3.5 sm:py-4 text-xs font-extrabold tracking-[0.22em] uppercase rounded-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      <span>EXPLORE COLLECTION</span>
                    </Link>

                    <Link 
                      to="/about" 
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-50 text-[#173b25] border border-[#173b25]/40 hover:border-[#173b25] px-6 py-3.5 sm:py-4 text-xs font-extrabold tracking-[0.22em] uppercase rounded-xs transition-all duration-300 shadow-xs"
                    >
                      <div className="w-4 h-4 rounded-full border border-[#173b25] flex items-center justify-center pl-0.5">
                        <Play size={8} fill="currentColor" />
                      </div>
                      <span>OUR STORY</span>
                    </Link>
                  </motion.div>

                </motion.div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;







