import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Leaf } from 'lucide-react';

const INSTAGRAM_PHOTOS = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=700&auto=format&fit=crop',
    alt: 'Steaming Cup of Assam Tea',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=700&auto=format&fit=crop',
    alt: 'Hands Holding Fresh Tea Leaves',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=700&auto=format&fit=crop',
    alt: 'Vaarta Chai Package & Cup',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=700&auto=format&fit=crop',
    alt: 'Misty Assam Tea Hills',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=700&auto=format&fit=crop',
    alt: 'Assam Tea Leaves and Wooden Scoop',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=700&auto=format&fit=crop',
    alt: 'Friends Enjoying Chai Together',
  },
];

const GallerySwiper = () => {
  return (
    <section className="relative overflow-hidden bg-[#faf5ec] py-8 sm:py-10 lg:py-12 font-sans">
      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER (COMPACT & SHORTER) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-5 sm:mb-6 flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Main Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#173b25] mb-0.5">
            Follow Us On <span className="italic text-[#B38A45]">Instagram</span>
          </h2>

          {/* Gold Emblem Line Divider */}
          <div className="flex items-center justify-center gap-2.5 my-2">
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
            <div className="text-[#2d5a27]"><Leaf size={13} fill="#2d5a27" /></div>
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
          </div>

          <p className="max-w-xs text-xs text-[#524f46] font-medium leading-relaxed">
            Tea rituals & garden harvest moments.
          </p>
        </motion.div>

        {/* ── 6 IMAGES IN A SINGLE ROW ON DESKTOP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-8 sm:mb-10">
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
              className="group relative aspect-[5/4] sm:aspect-square overflow-hidden rounded-xl bg-[#e7dfd0] shadow-sm border border-[#B38A45]/20 hover:border-[#173b25] transition-all duration-300"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Hover Dark Overlay & Center Instagram Icon */}
              <div className="absolute inset-0 bg-[#173b25]/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram size={22} className="text-white" strokeWidth={1.8} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── BOTTOM CENTER INSTAGRAM BUTTON ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold tracking-[0.2em] uppercase text-xs sm:text-sm px-7 sm:px-9 py-3.5 sm:py-4 rounded-md transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <Instagram size={17} strokeWidth={1.8} />
            <span>FOLLOW US @VARTACHAI</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default GallerySwiper;