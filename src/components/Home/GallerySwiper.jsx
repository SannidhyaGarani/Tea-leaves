import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Leaf, ArrowRight, Sparkles } from 'lucide-react';

const GallerySwiper = () => {
  return (
    <section
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 font-sans bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dcjn4y284/image/upload/v1788005626/ChatGPT_Image_Aug_29_2026_05_42_00_PM_axurix.png')`,
      }}
    >
      {/* Semi-transparent soft parchment tint for depth */}
      <div className="absolute inset-0 bg-[#FAF5EC]/30 pointer-events-none" />

      <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">

        {/* ── SECTION HEADER (MATCHING TESTIMONIALS STYLE & COMPACT) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-5 sm:mb-6 flex flex-col items-center text-center max-w-3xl mx-auto relative"
        >
          {/* Badge */}
         

          {/* Main Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#173b25] mb-0.5">
            Follow Us On <span className="italic text-[#B38A45]">Instagram</span>
          </h2>

          {/* Gold Emblem Line Divider */}
          <div className="flex items-center justify-center gap-2.5 my-2">
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
            <div className="text-[#2d5a27]">
              <Leaf size={13} fill="#2d5a27" />
            </div>
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
          </div>

          {/* Subtext */}
          <p className="max-w-xs text-xs text-[#524f46] font-medium leading-relaxed">
            Tea rituals &amp; garden harvest moments.
          </p>
        </motion.div>

        {/* ── 4 COLUMNS CARD GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:h-[480px]">
          
          {/* ── COLUMN 1: Morning Rituals (Tall Card) ── */}
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="group relative h-[380px] sm:h-[420px] lg:h-full rounded-2xl overflow-hidden shadow-md border border-[#b38a45]/20 hover:shadow-xl transition-all duration-300 block"
          >
            <img
              src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop"
              alt="Morning Rituals"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end text-white">
              <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-white">
                Morning Rituals
              </h3>
              <p className="text-xs sm:text-sm text-white font-normal mt-1 leading-snug">
                A perfect cup to begin the day
              </p>
              <div className="mt-4 w-9 h-9 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#173b25] transition-all duration-300">
                <ArrowRight size={16} />
              </div>
            </div>
          </motion.a>

          {/* ── COLUMN 2: 2 Stacked Cards ── */}
          <div className="flex flex-col gap-4 md:gap-5 h-[380px] sm:h-[420px] lg:h-full">
            
            {/* Top Card: Handpicked */}
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative flex-1 rounded-2xl overflow-hidden shadow-md border border-[#b38a45]/20 hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop"
                alt="Handpicked"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-white">
                  Handpicked
                </h3>
                <p className="text-xs sm:text-sm text-white font-normal mt-0.5 leading-snug">
                  Only the finest makes the cut
                </p>
              </div>
            </motion.a>

            {/* Bottom Card: Crafted with Care */}
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group relative flex-1 rounded-2xl overflow-hidden shadow-md border border-[#b38a45]/20 hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop"
                alt="Crafted with Care"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end text-right sm:text-right text-white">
                <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-white">
                  Crafted with Care
                </h3>
                <p className="text-xs sm:text-sm text-white font-normal mt-0.5 leading-snug">
                  Blended to preserve nature&apos;s best
                </p>
              </div>
            </motion.a>

          </div>

          {/* ── COLUMN 3: Assam, Our Home (Tall Card) ── */}
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative h-[380px] sm:h-[420px] lg:h-full rounded-2xl overflow-hidden shadow-md border border-[#b38a45]/20 hover:shadow-xl transition-all duration-300 block"
          >
            <img
              src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800&auto=format&fit=crop"
              alt="Assam, Our Home"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end text-white">
              <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-white">
                Assam, Our Home
              </h3>
              <p className="text-xs sm:text-sm text-white font-normal mt-1 leading-snug">
                Where every leaf tells a story
              </p>
            </div>
          </motion.a>

          {/* ── COLUMN 4: Tea & More (Tall Card) ── */}
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="group relative h-[380px] sm:h-[420px] lg:h-full rounded-2xl overflow-hidden shadow-md border border-[#b38a45]/20 hover:shadow-xl transition-all duration-300 block"
          >
            <img
              src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop"
              alt="Tea & More"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex flex-col justify-end text-white">
              <h3 className="font-serif text-xl sm:text-2xl font-medium tracking-wide text-white">
                Tea &amp; More
              </h3>
              <p className="text-xs sm:text-sm text-white font-normal mt-1 leading-snug">
                Exploring blends, flavours &amp; pairings
              </p>
            </div>
          </motion.a>

        </div>

        {/* ── PREMIUM COMPACT INSTAGRAM BUTTON ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-7 sm:mt-9"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2.5 bg-[#173b25] hover:bg-[#1e482f] text-white font-bold tracking-[0.18em] uppercase text-xs px-6 sm:px-7 py-3 rounded-full border border-[#B38A45]/40 hover:border-[#B38A45] shadow-md hover:shadow-[0_4px_20px_rgba(179,138,69,0.22)] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <div className="flex items-center justify-center text-[#e5be6b] group-hover:scale-110 transition-transform">
              <Instagram size={16} strokeWidth={2} />
            </div>
            <span className="text-white text-xs font-bold">FOLLOW US @VARTACHAI</span>
            <span className="text-[#e5be6b] text-xs transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default GallerySwiper;