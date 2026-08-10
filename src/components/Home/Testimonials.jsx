import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Leaf, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote:
      'Varta Chai ka taste aur aroma dono hi lajawab hai. Ab ye hamari daily chai ban chuki hai. Unique taste that stands out.',
    name: 'Neha Sharma',
    role: 'Verified Buyer · Assam CTC',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 2,
    quote:
      'Freshness packaging dekh kar hi pata chal jata hai. Best premium Assam tea I have ever tried. Unmatched warmth and aroma.',
    name: 'Rohit Verma',
    role: 'Verified Buyer · Gold Leaf Chai',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 3,
    quote:
      'Elaichi Tea is my absolute favorite! So light, so refreshing and beautifully aromatic. Makes every morning special.',
    name: 'Anjali Mehta',
    role: 'Verified Buyer · Elaichi Tea',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  },
];

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f4eb] via-[#f3e9d8] to-[#f8f4eb] py-16 md:py-24 border-t border-[#dfd5c4]/60">
      {/* ── Ambient Luxury Glow Orbs & Background Details ── */}
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-[#b38a45]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-[#173b25]/8 blur-3xl" />

      <div className="pointer-events-none absolute right-10 top-14 opacity-[0.035]">
        <Leaf size={260} strokeWidth={0.6} />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-14 flex flex-col items-center text-center"
        >
          <div className="mb-2.5 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-[#b38a45]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b38a45]">
              Customer Stories
            </span>
            <span className="h-px w-8 bg-[#b38a45]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#173b25]">
            Loved By <span className="italic text-[#b38a45]">Tea Lovers</span>
          </h2>
          <p className="mt-3 max-w-lg text-xs sm:text-sm text-[#706e65] leading-relaxed">
            Real stories and heartfelt moments shared by tea enthusiasts across India.
          </p>
        </motion.div>

        {/* ── 3 REVIEWS CARDS GRID ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#fdfaf4] border border-[#dfd5c4] hover:border-[#b38a45] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(23,59,37,0.09)] rounded-xs flex flex-col justify-between"
            >
              {/* Gold Quote watermark icon */}
              <Quote
                size={28}
                strokeWidth={1}
                className="absolute right-6 top-6 text-[#b38a45]/30 group-hover:text-[#b38a45]/60 transition-colors"
              />

              <div>
                {/* 5 Muted Gold Rating Stars */}
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={13}
                      fill="#b38a45"
                      strokeWidth={0}
                      className="text-[#b38a45]"
                    />
                  ))}
                </div>

                {/* Review Quote Text */}
                <p className="pr-4 font-serif text-base sm:text-[17px] leading-relaxed text-[#1d2a21] italic mb-6">
                  “{review.quote}”
                </p>
              </div>

              {/* Divider & Reviewer Profile */}
              <div>
                <div className="my-4 h-px bg-[#dfd5c4]/60" />

                <div className="flex items-center gap-3.5">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#b38a45]/40"
                  />

                  <div className="leading-tight">
                    <h3 className="text-xs font-bold text-[#173b25] flex items-center gap-1.5">
                      <span>{review.name}</span>
                      <CheckCircle2 size={12} className="text-[#b38a45]" />
                    </h3>

                    <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#827963]">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TRUST BADGE FOOTER ── */}
        <div className="mt-12 md:mt-14 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-[#d5cbb9]" />
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-[#827963]">
            <Leaf size={12} className="text-[#b38a45]" />
            <span>Crafted for conversations · Loved across India</span>
          </div>
          <div className="h-px w-12 bg-[#d5cbb9]" />
        </div>

      </div>
    </section>
  );
};

export default Testimonials;