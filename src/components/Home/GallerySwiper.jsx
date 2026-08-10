import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight, Sparkles } from 'lucide-react';

const INSTAGRAM_PHOTOS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=700&auto=format&fit=crop',
    alt: 'Steaming Cup of Assam Tea',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=700&auto=format&fit=crop',
    alt: 'Fresh Assam Tea Leaves',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=700&auto=format&fit=crop',
    alt: 'Spiced Masala Chai Brew',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=700&auto=format&fit=crop',
    alt: 'Vaarta Tea Garden Collection',
  },
  {
    id: 5,
    src: 'https://plus.unsplash.com/premium_photo-1692049123825-8d43174c9c5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhJTIwbGVhdmVzfGVufDB8fDB8fHww',
    alt: 'Assam Tea Garden Sunrise',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=700&auto=format&fit=crop',
    alt: 'Fresh Cup of Warm Chai',
  },
];

const GallerySwiper = () => {
  return (
    <section className="relative overflow-hidden bg-[#12281b] text-white py-16 md:py-24 border-t border-[#b38a45]/30">
      {/* ── Ambient Radial Gold Glow Orbs ── */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 h-[450px] w-[600px] rounded-full bg-[#b38a45]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#173b25]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-12 flex flex-col items-center text-center"
        >
          <div className="mb-2.5 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-[#b38a45]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b38a45] flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#b38a45]" />
              <span>Follow Our Journey</span>
            </span>
            <span className="h-px w-8 bg-[#b38a45]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f7f2e8]">
            @varta.chai
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#e6dfd3]/70 font-light tracking-wide">
            Capturing morning mists, garden harvests, and quiet tea rituals.
          </p>
        </motion.div>

        {/* ── 6 EDITORIAL INSTAGRAM PHOTO FRAMES ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 lg:gap-4">
          {INSTAGRAM_PHOTOS.map((photo, index) => (
            <motion.a
              key={photo.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group relative aspect-square overflow-hidden border border-[#b38a45]/30 hover:border-[#b38a45] transition-all duration-500 rounded-xs bg-[#173b25]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.09]"
              />

              {/* Hover Dark Overlay & Center Icon */}
              <div className="absolute inset-0 bg-[#173b25]/75 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b38a45] bg-[#12281b] text-[#b38a45] shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Instagram size={17} strokeWidth={1.8} />
                </div>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#f7f2e8]">
                  View Post
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── CALL TO ACTION BUTTON ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 md:mt-12 flex justify-center"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-[#b38a45] hover:bg-[#967233] text-white font-bold tracking-[0.22em] uppercase text-xs px-8 py-3.5 rounded-xs transition-all duration-300 shadow-xl shadow-black/30 hover:-translate-y-0.5"
          >
            <Instagram size={15} strokeWidth={1.8} />
            <span>Follow @varta.chai</span>
            <ArrowUpRight size={14} />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default GallerySwiper;