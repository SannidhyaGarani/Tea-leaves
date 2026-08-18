import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Leaf, CheckCircle2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

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
  {
    id: 4,
    quote:
      'Ordered for the first time and already a repeat customer. The kadak CTC blend is exactly what chai lovers dream about.',
    name: 'Arjun Singh',
    location: 'Jaipur, India',
    role: 'Verified Buyer · Kadak CTC Blend',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 5,
    quote:
      'Subah ki shuruat Varta Chai ke sath alag hi energy deti hai. The rich color and strong taste are unmatched.',
    name: 'Kavita Patel',
    location: 'Ahmedabad, India',
    role: 'Verified Buyer · Masala Chai',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 6,
    quote:
      'Garden fresh aroma is real! As soon as you open the pouch, the rich scent fills the kitchen. Highly recommended.',
    name: 'Suresh Menon',
    location: 'Kochi, India',
    role: 'Verified Buyer · Royal CTC',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 7,
    quote:
      'Authentic taste of Assam tea. Rich strength without any bitter aftertaste. Truly a luxury tea experience.',
    name: 'Priya Nair',
    location: 'Chennai, India',
    role: 'Verified Buyer · Assam Orthodox',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 8,
    quote:
      'Mehmaan bhi tareef kiye bina nahi reh paate. Vaarta Chai has become our official family tea brand.',
    name: 'Rajesh Gupta',
    location: 'Kolkata, India',
    role: 'Verified Buyer · Premium Leaf Chai',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Update items per page based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(4); // 4 slides in large devices
      } else if (width >= 768) {
        setItemsPerPage(3); // 3 slides in mid devices
      } else if (width >= 640) {
        setItemsPerPage(2); // 2 slides in sm devices
      } else {
        setItemsPerPage(1); // 1 slide on extra small mobile
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, REVIEWS.length - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="relative overflow-hidden bg-[#faf5ec] py-10 sm:py-14 lg:py-16 font-sans">
      {/* ── Ambient Luxury Glow Orbs ── */}
      <div className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-[#B38A45]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-[#173b25]/8 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-14 opacity-[0.03] text-[#173b25]">
        <Leaf size={280} strokeWidth={0.7} />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER & CAROUSEL CONTROLS ── */}
        <div className="mb-8 sm:mb-10 flex flex-col items-center text-center max-w-3xl mx-auto relative">
          {/* Main Title */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#173b25] mb-1">
            Loved By <span className="italic text-[#B38A45]">Tea Lovers</span>
          </h2>

          {/* Hindi Tagline */}
          <h3
            className="text-xl sm:text-2xl font-normal text-[#173b25] mt-1 mb-2"
            style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
          >
            चाय प्रेमियों का भरोसेमंद नाम
          </h3>

          {/* Gold Emblem Line Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-12 h-[1px] bg-[#B38A45]/40" />
            <div className="text-[#2d5a27]"><Leaf size={15} fill="#2d5a27" /></div>
            <div className="w-12 h-[1px] bg-[#B38A45]/40" />
          </div>

          {/* Subtext */}
          <p className="max-w-lg text-xs sm:text-sm text-[#524f46] font-medium leading-relaxed mb-4">
            Real stories and heartfelt moments shared by tea enthusiasts across India.
          </p>

          {/* Prev / Next Slider Arrows */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-[#173b25]/30 hover:border-[#173b25] bg-[#faf5ec] hover:bg-[#173b25] text-[#173b25] hover:text-white transition-all duration-300 shadow-2xs cursor-pointer active:scale-95"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="text-xs font-serif text-[#827963] px-2 font-medium">
              <span className="text-[#173b25] font-bold">{currentIndex + 1}</span> / {maxIndex + 1}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-[#173b25]/30 hover:border-[#173b25] bg-[#faf5ec] hover:bg-[#173b25] text-[#173b25] hover:text-white transition-all duration-300 shadow-2xs cursor-pointer active:scale-95"
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ── RESPONSIVE CAROUSEL SLIDER TRACK ── */}
        <div className="overflow-hidden py-2 px-1">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="px-2.5 shrink-0"
                style={{
                  width: `${100 / itemsPerPage}%`,
                }}
              >
                <div className="group relative bg-[#f7f2e8] border border-[#e8dfcf] hover:border-[#B38A45] p-5 lg:p-6 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl rounded-2xl flex flex-col justify-between h-full min-h-[220px]">
                  {/* Quote watermark */}
                  <Quote
                    size={26}
                    strokeWidth={1}
                    className="absolute right-5 top-5 text-[#B38A45]/20 group-hover:text-[#B38A45]/40 transition-colors"
                  />

                  <div>
                    {/* 5 Stars */}
                    <div className="mb-3 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} fill="#B38A45" strokeWidth={0} className="text-[#B38A45]" />
                      ))}
                    </div>

                    {/* Review Quote Text */}
                    <p className="pr-4 font-serif text-xs sm:text-sm leading-relaxed text-[#173b25] italic mb-5">
                      "{review.quote}"
                    </p>
                  </div>

                  {/* Reviewer Profile */}
                  <div>
                    <div className="mb-3 h-px bg-[#e8dfcf]" />
                    <div className="flex items-center gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-[#B38A45]/40 flex-shrink-0"
                      />
                      <div className="leading-tight min-w-0">
                        <h3 className="text-xs font-bold text-[#173b25] flex items-center gap-1 truncate">
                          <span>{review.name}</span>
                          <CheckCircle2 size={11} className="text-[#B38A45] flex-shrink-0" />
                        </h3>
                        <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#827963] truncate">
                          {review.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DOTS INDICATOR ── */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-[#173b25]' : 'w-2 bg-[#d8cebe] hover:bg-[#B38A45]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* ── TRUST BADGE FOOTER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-3 text-center"
        >
          <div className="h-px w-10 bg-[#B38A45]/30" />
          <div className="flex items-center gap-2 text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-[#827963]">
            <Heart size={11} className="text-[#B38A45] fill-[#B38A45]" />
            <span>Trusted by 10,000+ Tea Lovers Across India</span>
            <Heart size={11} className="text-[#B38A45] fill-[#B38A45]" />
          </div>
          <div className="h-px w-10 bg-[#B38A45]/30" />
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;