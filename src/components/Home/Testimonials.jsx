import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  Leaf,
  CheckCircle2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote:
      'Varta Chai ka taste aur aroma dono hi lajawab hai. Ab ye hamari daily chai ban chuki hai. Unique taste that stands out.',
    name: 'Neha Sharma',
    location: 'Delhi, India',
    role: 'Verified Buyer · Assam CTC',
    category: 'ctc',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 24,
  },
  {
    id: 2,
    quote:
      'Freshness packaging dekh kar hi pata chal jata hai. Best premium Assam tea I have ever tried. Unmatched warmth and aroma.',
    name: 'Rohit Verma',
    location: 'Mumbai, India',
    role: 'Verified Buyer · Gold Leaf Chai',
    category: 'leaf',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 19,
  },
  {
    id: 3,
    quote:
      'Elaichi Tea is my absolute favorite! So light, so refreshing and beautifully aromatic. Makes every morning special.',
    name: 'Anjali Mehta',
    location: 'Bangalore, India',
    role: 'Verified Buyer · Elaichi Tea',
    category: 'flavored',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 31,
  },
  {
    id: 4,
    quote:
      'Ordered for the first time and already a repeat customer. The kadak CTC blend is exactly what chai lovers dream about.',
    name: 'Arjun Singh',
    location: 'Jaipur, India',
    role: 'Verified Buyer · Kadak CTC Blend',
    category: 'ctc',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 17,
  },
  {
    id: 5,
    quote:
      'Subah ki shuruat Varta Chai ke sath alag hi energy deti hai. The rich color and strong taste are unmatched.',
    name: 'Kavita Patel',
    location: 'Ahmedabad, India',
    role: 'Verified Buyer · Masala Chai',
    category: 'flavored',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 28,
  },
  {
    id: 6,
    quote:
      'Garden fresh aroma is real! As soon as you open the pouch, the rich scent fills the kitchen. Highly recommended.',
    name: 'Suresh Menon',
    location: 'Kochi, India',
    role: 'Verified Buyer · Royal CTC',
    category: 'ctc',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 15,
  },
  {
    id: 7,
    quote:
      'Authentic taste of Assam tea. Rich strength without any bitter aftertaste. Truly a luxury tea experience.',
    name: 'Priya Nair',
    location: 'Chennai, India',
    role: 'Verified Buyer · Assam Orthodox',
    category: 'leaf',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 22,
  },
  {
    id: 8,
    quote:
      'Mehmaan bhi tareef kiye bina nahi reh paate. Vaarta Chai has become our official family tea brand.',
    name: 'Rajesh Gupta',
    location: 'Kolkata, India',
    role: 'Verified Buyer · Premium Leaf Chai',
    category: 'leaf',
    avatar:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    rating: 5,
    likes: 35,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Reviews' },
  { id: 'ctc', label: 'Kadak CTC' },
  { id: 'flavored', label: 'Flavored Tea' },
  { id: 'leaf', label: 'Premium Leaf' },
];

const AUTO_SCROLL_DELAY = 4000; // 4 seconds per slide

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedMap, setLikedMap] = useState({});

  // Touch and drag swipe refs/state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Filter reviews by selected category
  const filteredReviews =
    selectedCategory === 'all'
      ? REVIEWS
      : REVIEWS.filter((review) => review.category === selectedCategory);

  // Update items per page based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(4);
      } else if (width >= 768) {
        setItemsPerPage(3);
      } else if (width >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, filteredReviews.length - itemsPerPage);

  // Clamp current index when maxIndex changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Reset index when changing filter category
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentIndex(0);
  };

  // Next / Prev slide handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-scroll Timer
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(timer);
  }, [isAutoPlaying, maxIndex, currentIndex]);

  // Toggle Heart/Like on a card
  const toggleLike = (reviewId) => {
    setLikedMap((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Swipe / Drag handling
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragDistance = dragStartX - e.clientX;
    const minDragDistance = 40;
    if (dragDistance > minDragDistance) {
      handleNext();
    } else if (dragDistance < -minDragDistance) {
      handlePrev();
    }
  };

  const handleMouseLeaveTrack = () => {
    if (isDragging) {
      setIsDragging(false);
    }
    setIsHovered(false);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf5ec] py-8 sm:py-10 lg:py-12 font-sans select-none">
      {/* Background Image (90% Visibility) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="https://res.cloudinary.com/dcjn4y284/image/upload/v1787921851/Gemini_Generated_Image_z6mv92z6mv92z6mv_dagdev.png"
          alt=""
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-[#faf5ec]/10" />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12 z-10">
        {/* ── SECTION HEADER & CONTROLS ── */}
        <div className="mb-5 sm:mb-6 flex flex-col items-center text-center max-w-3xl mx-auto relative">
          {/* Badge */}
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#B38A45]/30 bg-[#B38A45]/10 px-3 py-0.5 text-[11px] font-semibold text-[#8a682c]">
            <Sparkles size={12} className="text-[#B38A45]" />
            <span>Customer Stories</span>
          </div>

          {/* Main Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-[#173b25] mb-0.5">
            Loved By <span className="italic text-[#B38A45]">Tea Lovers</span>
          </h2>

          {/* Hindi Tagline */}
        
          {/* Gold Emblem Line Divider */}
          <div className="flex items-center justify-center gap-2.5 my-2">
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
            <div className="text-[#2d5a27]">
              <Leaf size={13} fill="#2d5a27" />
            </div>
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
          </div>

          {/* Subtext */}
          <p className="max-w-md text-xs text-[#524f46] font-medium leading-relaxed mb-4">
            Real stories shared by tea lovers across India.
          </p>

          {/* Carousel Control Buttons & Auto-scroll Toggle */}
          <div className="flex items-center justify-center gap-3">
            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
                isAutoPlaying
                  ? 'border-[#173b25]/20 bg-[#faf5ec] text-[#173b25] hover:bg-[#173b25]/10'
                  : 'border-[#B38A45] bg-[#B38A45] text-white shadow-sm'
              }`}
              title={isAutoPlaying ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
              aria-label={isAutoPlaying ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
            >
              {isAutoPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>

            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-[#173b25]/30 hover:border-[#173b25] bg-[#faf5ec] hover:bg-[#173b25] text-[#173b25] hover:text-white transition-all duration-300 shadow-2xs cursor-pointer active:scale-95"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Counter */}
            <div className="text-xs font-serif text-[#827963] px-2 font-medium">
              <span className="text-[#173b25] font-bold">{currentIndex + 1}</span> /{' '}
              {maxIndex + 1}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-[#173b25]/30 hover:border-[#173b25] bg-[#faf5ec] hover:bg-[#173b25] text-[#173b25] hover:text-white transition-all duration-300 shadow-2xs cursor-pointer active:scale-95"
              aria-label="Next testimonials"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Auto-play status indicator banner */}
          {isAutoPlaying && maxIndex > 0 && (
            <div className="w-36 h-0.5 bg-[#e8dfcf] rounded-full overflow-hidden mt-3">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: AUTO_SCROLL_DELAY / 1000, ease: 'linear' }}
                className="h-full bg-[#B38A45]"
              />
            </div>
          )}
        </div>

        {/* ── RESPONSIVE CAROUSEL SLIDER TRACK (DRAGGABLE & TOUCH SWIPE) ── */}
        <div
          className="overflow-hidden py-3 px-1 cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeaveTrack}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
            }}
          >
            {filteredReviews.map((review) => {
              const isLiked = likedMap[review.id];
              const currentLikes = review.likes + (isLiked ? 1 : 0);

              return (
                <div
                  key={review.id}
                  className="px-2.5 shrink-0"
                  style={{
                    width: `${100 / itemsPerPage}%`,
                  }}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="group relative bg-[#f7f2e8] border border-[#e8dfcf] hover:border-[#B38A45] p-5 lg:p-6 transition-all duration-300 hover:shadow-xl rounded-2xl flex flex-col justify-between h-full min-h-[240px]"
                  >
                    {/* Quote watermark */}
                    <Quote
                      size={26}
                      strokeWidth={1}
                      className="absolute right-5 top-5 text-[#B38A45]/20 group-hover:text-[#B38A45]/40 transition-colors pointer-events-none"
                    />

                    <div>
                      {/* 5 Stars */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              fill="#B38A45"
                              strokeWidth={0}
                              className="text-[#B38A45]"
                            />
                          ))}
                        </div>

                        {/* Interactive Like/Heart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(review.id);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-300 cursor-pointer ${
                            isLiked
                              ? 'bg-[#173b25] text-white shadow-xs'
                              : 'bg-[#ede5d6]/80 text-[#827963] hover:text-[#173b25] hover:bg-[#e2d6c1]'
                          }`}
                          aria-label="Helpful review"
                        >
                          <Heart
                            size={11}
                            className={isLiked ? 'fill-current text-red-400' : ''}
                          />
                          <span>{currentLikes}</span>
                        </button>
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
                         
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
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