import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Banner = () => {
  const HERO_BANNER_IMAGE = "/img/banner_tea_story.png";

  return (
    <section className="relative overflow-hidden bg-[#f8f3e9] py-14 sm:py-20 lg:py-24 font-sans">
      {/* Decorative background ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dce7d7]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#e8dcc7]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">

          {/* ── LEFT COLUMN: EDITORIAL NARRATIVE CONTENT (5 Cols on LG) ── */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative z-10 max-w-xl mx-auto lg:mx-0"
          >
            {/* Eyebrow matching site sections */}
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-px w-8 bg-[#B38A45]" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#B38A45]">
                About Vaarta Chai
              </span>
              <span className="h-px w-8 bg-[#B38A45]" />
            </div>

            {/* Main Heading matching site typography */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium leading-[1.14] tracking-tight text-[#173b25] mb-4">
              Every Cup <span className="italic text-[#B38A45]">Has A Story</span>
            </h2>

            {/* Gold Accent Divider */}
            <div className="my-5 h-px w-16 bg-[#B38A45]" />

            {/* Narrative Story Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm md:text-base text-[#6d6b61] font-normal leading-relaxed mb-8">
              <p>
                <strong className="text-[#173b25] font-bold">Vaarta</strong> means conversation.
              </p>
              <p>
                Every memorable conversation starts with a warm cup of tea. We created Vaarta Chai to bring people together over authentic flavours.
              </p>
              <p>
                Handpicked directly from lush Assam tea gardens, every pack is carefully selected to deliver garden-fresh aroma, rich strength, and unforgettable taste.
              </p>
              <div className="pt-2 border-l-2 border-[#B38A45] pl-4 italic text-[#173b25] font-serif text-base sm:text-lg">
                "Because for us, tea is not just a beverage. It is an emotion."
              </div>
            </div>

            {/* Action CTA */}
            <Link 
              to="/about"
              className="group inline-flex items-center gap-3 bg-[#173b25] hover:bg-[#245433] text-white px-8 py-3.5 sm:py-4 text-xs font-extrabold uppercase tracking-[0.25em] rounded-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 border border-[#173b25]"
            >
              <span>DISCOVER OUR STORY</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* ── RIGHT COLUMN: BRUSH MASKED VISUAL (7 Cols on LG) ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative flex justify-center lg:justify-end"
          >
            {/* Ambient Gold Backdrop Glow */}
            <div className="pointer-events-none absolute -inset-6 bg-[#B38A45]/20 rounded-full blur-3xl" />

            <div className="relative w-full max-w-2xl lg:max-w-3xl aspect-[16/10] sm:aspect-[1.45/1] lg:aspect-[1.5/1] min-h-[340px] sm:min-h-[440px] lg:min-h-[520px] overflow-hidden drop-shadow-2xl z-10">
              
              {/* Top Floating Origin Badge */}
              <div className="absolute top-5 left-5 z-20 hidden sm:flex items-center gap-2 bg-[#173b25] px-4 py-2.5 text-white shadow-2xl border border-[#B38A45]/40">
                <Leaf size={13} className="text-[#B38A45]" />
                <span className="text-[9.5px] font-bold uppercase tracking-[0.22em]">
                  100% Assam Tea Gardens
                </span>
              </div>

              {/* Painted Brush-Stroke Edge Mask Container */}
              <div 
                className="w-full h-full relative bg-[#173b25]" 
                style={{ 
                  clipPath: 'polygon(3% 5%, 12% 1%, 25% 3.5%, 40% 0.5%, 58% 2.5%, 72% 0.8%, 86% 3%, 95% 1.5%, 98% 8%, 96.5% 20%, 99% 35%, 97.5% 50%, 100% 68%, 97% 82%, 98.5% 94%, 90% 97.5%, 76% 96%, 60% 99%, 45% 97%, 30% 98.5%, 16% 96.5%, 5% 98%, 1.5% 90%, 3.5% 75%, 0.8% 60%, 2.5% 45%, 0.5% 30%, 3% 15%)' 
                }}
              >
                <img 
                  src={HERO_BANNER_IMAGE} 
                  alt="Every Cup Has A Story - Vaarta Chai"
                  className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-1000 ease-out" 
                />
                {/* Ambient Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;