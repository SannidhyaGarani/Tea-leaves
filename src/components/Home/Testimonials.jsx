import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Leaf, CheckCircle2, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote:
      'Varta Chai ka taste aur aroma dono hi lajawab hai. Ab ye hamari daily chai ban chuki hai. Unique taste that stands out.',
    name: 'Neha Sharma',
    location: 'Delhi, India',
    role: 'Verified Buyer · Assam CTC',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Freshness packaging dekh kar hi pata chal jata hai. Best premium Assam tea I have ever tried. Unmatched warmth and aroma.',
    name: 'Rohit Verma',
    location: 'Mumbai, India',
    role: 'Verified Buyer · Gold Leaf Chai',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'Elaichi Tea is my absolute favorite! So light, so refreshing and beautifully aromatic. Makes every morning special.',
    name: 'Anjali Mehta',
    location: 'Bangalore, India',
    role: 'Verified Buyer · Elaichi Tea',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf5ec] py-14 sm:py-20 lg:py-24 font-sans">
      {/* ── Ambient Luxury Glow Orbs ── */}
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-[#B38A45]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-[#173b25]/8 blur-3xl" />

      <div className="pointer-events-none absolute right-10 top-14 opacity-[0.03] text-[#173b25]">
        <Leaf size={280} strokeWidth={0.7} />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14 flex flex-col items-center text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-[#B38A45]" />
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#B38A45]">
              Customer Stories
            </span>
            <span className="h-px w-8 bg-[#B38A45]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#173b25]">
            Loved By <span className="italic text-[#B38A45]">Tea Lovers</span>
          </h2>
          <p className="mt-3 max-w-lg text-xs sm:text-sm text-[#6d6b61] leading-relaxed">
            Real stories and heartfelt moments shared by tea enthusiasts across India.
          </p>
        </motion.div>

        {/* ── MOBILE VIEW: INTERACTIVE SWIPER CAROUSEL (SWIPER / SLIDER) ── */}
        <div className="block md:hidden">
          <div className="relative bg-[#f7f2e8] rounded-2xl p-6 border border-[#e8dfcf] shadow-xs overflow-hidden">
            
            {/* Top Indicator & Stars */}
            <div className="flex items-center justify-between border-b border-[#e8dfcf] pb-4 mb-5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} fill="#B38A45" strokeWidth={0} className="text-[#B38A45]" />
                ))}
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B38A45]">
                STORY {activeSlide + 1} OF {REVIEWS.length}
              </span>
            </div>

            {/* Slide Content with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div className="relative">
                  <Quote size={32} strokeWidth={1} className="text-[#B38A45]/25 absolute -top-2 -left-2" />
                  <p className="relative z-10 pt-2 font-serif text-lg leading-relaxed text-[#173b25] italic">
                    "{REVIEWS[activeSlide].quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e8dfcf] flex items-center gap-3.5">
                  <img
                    src={REVIEWS[activeSlide].avatar}
                    alt={REVIEWS[activeSlide].name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#B38A45]/50 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#173b25] flex items-center gap-1.5">
                      <span>{REVIEWS[activeSlide].name}</span>
                      <CheckCircle2 size={13} className="text-[#B38A45]" />
                    </h3>
                    <span className="text-[10px] font-semibold text-[#827963]">
                      {REVIEWS[activeSlide].role}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls Bar */}
            <div className="mt-6 pt-4 border-t border-[#e8dfcf] flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#173b25]/30 text-[#173b25] text-xs font-bold uppercase tracking-wider hover:bg-[#173b25]/5"
              >
                <ArrowLeft size={13} />
                <span>PREV</span>
              </button>

              <div className="flex items-center gap-1.5">
                {REVIEWS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeSlide ? 'w-6 bg-[#173b25]' : 'w-2 bg-[#d8cebe]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#173b25] text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#245433]"
              >
                <span>NEXT</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── DESKTOP VIEW: 3 LUXURY REVIEWS CARDS GRID ── */}
        <div className="hidden md:grid grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#f7f2e8] border border-[#e8dfcf] hover:border-[#B38A45] p-7 lg:p-8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl rounded-2xl flex flex-col justify-between"
            >
              <Quote
                size={32}
                strokeWidth={1}
                className="absolute right-7 top-7 text-[#B38A45]/25 group-hover:text-[#B38A45]/50 transition-colors"
              />

              <div>
                {/* 5 Stars */}
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill="#B38A45"
                      strokeWidth={0}
                      className="text-[#B38A45]"
                    />
                  ))}
                </div>

                {/* Review Quote Text */}
                <p className="pr-4 font-serif text-base lg:text-[1.1rem] leading-relaxed text-[#173b25] italic mb-6">
                  “{review.quote}”
                </p>
              </div>

              {/* Reviewer Profile */}
              <div>
                <div className="my-4 h-px bg-[#e8dfcf]" />

                <div className="flex items-center gap-3.5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#B38A45]/40"
                  />

                  <div className="leading-tight">
                    <h3 className="text-xs font-bold text-[#173b25] flex items-center gap-1.5">
                      <span>{review.name}</span>
                      <CheckCircle2 size={13} className="text-[#B38A45]" />
                    </h3>

                    <span className="mt-1 block text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[#827963]">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TRUST BADGE FOOTER ── */}
        <div className="mt-12 md:mt-16 flex items-center justify-center gap-4 text-center">
          <div className="h-px w-12 bg-[#B38A45]/30" />
          <div className="flex items-center gap-2 text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#827963]">
            <Heart size={12} className="text-[#B38A45] fill-[#B38A45]" />
             </div>
          <div className="h-px w-12 bg-[#B38A45]/30" />
        </div>

      </div>
    </section>
  );
};

export default Testimonials;