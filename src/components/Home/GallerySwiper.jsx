import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight, Sparkles } from 'lucide-react';

const INSTAGRAM_PHOTOS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=700&auto=format&fit=crop',
    alt: 'Steaming Cup of Assam Tea',
    caption: 'Golden morning brews filled with rich aroma.',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=700&auto=format&fit=crop',
    alt: 'Fresh Assam Tea Leaves',
    caption: 'Handpicked from the lush estates of Assam.',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=700&auto=format&fit=crop',
    alt: 'Spiced Masala Chai Brew',
    caption: 'Artisanal spices blended to perfection.',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=700&auto=format&fit=crop',
    alt: 'Vaarta Tea Garden Collection',
    caption: 'Sealed fresh for unforgettable tea moments.',
  },
  {
    id: 5,
    src: 'https://plus.unsplash.com/premium_photo-1692049123825-8d43174c9c5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhJTIwbGVhdmVzfGVufDB8fDB8fHww',
    alt: 'Assam Tea Garden Sunrise',
    caption: 'Misty garden sunrises in Assam hills.',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=700&auto=format&fit=crop',
    alt: 'Fresh Cup of Warm Chai',
    caption: 'Start every conversation over a warm cup.',
  },
];

const GallerySwiper = () => {
  return (
    <section className="relative overflow-hidden bg-[#12281b] text-white py-14 sm:py-20 lg:py-24 font-sans border-t border-[#B38A45]/30">
      {/* ── Ambient Radial Gold Glow Orbs ── */}
      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 h-[450px] w-[600px] rounded-full bg-[#B38A45]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#173b25]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 flex flex-col items-center text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-[#B38A45]" />
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#B38A45] flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#B38A45]" />
              <span>Follow Our Journey</span>
            </span>
            <span className="h-px w-8 bg-[#B38A45]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f7f2e8]">
            @varta.chai
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#e6dfd3]/80 font-normal tracking-wide max-w-md">
            Capturing morning mists, garden harvests, and quiet tea rituals across India.
          </p>
        </motion.div>

        {/* ── 2 SLIDES IN A ROW ON MOBILE / 3 ON TABLET / 6 ON DESKTOP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 lg:gap-4">
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
              className="group relative aspect-square overflow-hidden border border-[#B38A45]/30 hover:border-[#B38A45] transition-all duration-500 rounded-xl bg-[#173b25] shadow-md"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Hover Dark Overlay & Center Icon */}
              <div className="absolute inset-0 bg-[#173b25]/85 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 gap-2 p-2.5 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B38A45] bg-[#12281b] text-[#B38A45] shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Instagram size={17} strokeWidth={1.8} />
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] font-extrabold tracking-[0.2em] uppercase text-[#f7f2e8]">
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
          className="mt-10 md:mt-14 flex justify-center"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-[#B38A45] hover:bg-[#967233] text-white font-extrabold tracking-[0.25em] uppercase text-xs px-8 py-4 rounded-xs transition-all duration-300 shadow-xl shadow-black/30 hover:-translate-y-0.5"
          >
            <Instagram size={16} strokeWidth={1.8} />
            <span>Follow @varta.chai</span>
            <ArrowUpRight size={15} />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default GallerySwiper;