import React from 'react';
import { motion } from 'framer-motion';

// Animated Tea Leaves Icon (Multi-layer Sway & Pulse)
const AnimatedLeafIcon = () => (
  <div className="relative flex items-center justify-center shrink-0">
    {/* Animated Ambient Pulse Glow Ring */}
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.6, 0.25] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full bg-[#B38A45]/25 blur-sm pointer-events-none group-hover:bg-[#B38A45]/50 group-hover:scale-125 transition-all duration-500"
    />

    <motion.div
      className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fdf9f2] to-[#f4e6ce] border-2 border-[#B38A45]/35 text-[#173b25] group-hover:border-[#B38A45] group-hover:bg-[#173b25] group-hover:text-[#B38A45] transition-all duration-400 shadow-md group-hover:shadow-[0_10px_25px_-4px_rgba(23,59,37,0.35)]"
      whileHover={{ scale: 1.15, rotate: 6 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M7 25C7 25 9 14 20 8C20 8 20 18 13 22C11 23 8 24 7 25Z"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <path d="M7 25Q13 17 20 8" />
        <motion.path
          d="M14 21C14 21 18 15 25 12C25 12 24 19 19 22C17.5 23 15 23.5 14 24"
          animate={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <path d="M14 24Q19 18 25 12" />
      </svg>
    </motion.div>
  </div>
);

// Animated Tea Cup with 3 Rising Steam Vapor Trails & Gentle Wobble
const AnimatedCupIcon = () => (
  <div className="relative flex items-center justify-center shrink-0">
    {/* Animated Ambient Pulse Glow Ring */}
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.6, 0.25] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      className="absolute inset-0 rounded-full bg-[#B38A45]/25 blur-sm pointer-events-none group-hover:bg-[#B38A45]/50 group-hover:scale-125 transition-all duration-500"
    />

    <motion.div
      className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fdf9f2] to-[#f4e6ce] border-2 border-[#B38A45]/35 text-[#173b25] group-hover:border-[#B38A45] group-hover:bg-[#173b25] group-hover:text-[#B38A45] transition-all duration-400 shadow-md group-hover:shadow-[0_10px_25px_-4px_rgba(23,59,37,0.35)]"
      whileHover={{ scale: 1.15, rotate: -6 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible transition-colors duration-300"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 14H22V20C22 23.3 19.3 26 16 26H12C8.7 26 6 23.3 6 20V14Z" />
        <path d="M22 16H24.5C26.4 16 28 17.6 28 19.5C28 21.4 26.4 23 24.5 23H22" />
        <path d="M5 28H23" />

        {/* Animated Steam Vapor Line 1 */}
        <motion.path
          d="M9.5 10C9.5 8 11 7 11 5"
          animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Animated Steam Vapor Line 2 */}
        <motion.path
          d="M14 11C14 8.5 15.5 7.5 15.5 5.5"
          animate={{ y: [0, -7, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        {/* Animated Steam Vapor Line 3 */}
        <motion.path
          d="M18.5 10C18.5 8 20 7 20 5"
          animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
      </svg>
    </motion.div>
  </div>
);

// Animated Fresh Packing (Sparkles & Shimmering Seal)
const AnimatedPackingIcon = () => (
  <div className="relative flex items-center justify-center shrink-0">
    {/* Animated Ambient Pulse Glow Ring */}
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.6, 0.25] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      className="absolute inset-0 rounded-full bg-[#B38A45]/25 blur-sm pointer-events-none group-hover:bg-[#B38A45]/50 group-hover:scale-125 transition-all duration-500"
    />

    <motion.div
      className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fdf9f2] to-[#f4e6ce] border-2 border-[#B38A45]/35 text-[#173b25] group-hover:border-[#B38A45] group-hover:bg-[#173b25] group-hover:text-[#B38A45] transition-all duration-400 shadow-md group-hover:shadow-[0_10px_25px_-4px_rgba(23,59,37,0.35)]"
      whileHover={{ scale: 1.15, rotate: 6 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="6" y="10" width="20" height="16" rx="2.5" />
        <motion.path
          d="M12 10V6.5C12 5 13.5 3.5 16 3.5C18.5 3.5 20 5 20 6.5V10"
          animate={{ scaleY: [1, 1.12, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M6 16H26"
          strokeDasharray="2 2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        {/* Animated Sparkle Star 1 */}
        <motion.path
          d="M23 7L24.5 5.5M24.5 8.5L23 7"
          animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        {/* Animated Sparkle Star 2 */}
        <motion.circle
          cx="9"
          cy="7"
          r="1"
          fill="currentColor"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </svg>
    </motion.div>
  </div>
);

// Animated Delivery Truck (Rumble, Exhaust & Spinning Wheels)
const AnimatedTruckIcon = () => (
  <div className="relative flex items-center justify-center shrink-0">
    {/* Animated Ambient Pulse Glow Ring */}
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.6, 0.25] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute inset-0 rounded-full bg-[#B38A45]/25 blur-sm pointer-events-none group-hover:bg-[#B38A45]/50 group-hover:scale-125 transition-all duration-500"
    />

    <motion.div
      className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fdf9f2] to-[#f4e6ce] border-2 border-[#B38A45]/35 text-[#173b25] group-hover:border-[#B38A45] group-hover:bg-[#173b25] group-hover:text-[#B38A45] transition-all duration-400 shadow-md group-hover:shadow-[0_10px_25px_-4px_rgba(23,59,37,0.35)]"
      whileHover={{ scale: 1.15, x: 4 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.g
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
        >
          <rect x="4" y="10" width="13" height="11" rx="1.5" />
          <path d="M17 13H23L26 17V21H17V13Z" />
        </motion.g>

        {/* Exhaust Puffs */}
        <motion.path
          d="M2 18H0"
          animate={{ x: [-2, -6], opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Wheel 1 */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '8.5px 23.5px' }}
        >
          <circle cx="8.5" cy="23.5" r="2.5" />
          <line x1="8.5" y1="21" x2="8.5" y2="26" />
        </motion.g>

        {/* Wheel 2 */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '21.5px 23.5px' }}
        >
          <circle cx="21.5" cy="23.5" r="2.5" />
          <line x1="21.5" y1="21" x2="21.5" y2="26" />
        </motion.g>

        <path d="M11 23.5H19" />
      </svg>
    </motion.div>
  </div>
);

const features = [
  {
    title: 'PREMIUM QUALITY',
    desc: 'Freshly handpicked tea leaves from Assam.',
    icon: <AnimatedLeafIcon />,
  },
  {
    title: 'RICH TASTE',
    desc: 'Kadak strength with natural tea aroma.',
    icon: <AnimatedCupIcon />,
  },
  {
    title: 'FRESH PACKING',
    desc: 'Sealed carefully to preserve freshness.',
    icon: <AnimatedPackingIcon />,
  },
  {
    title: 'PAN INDIA DELIVERY',
    desc: 'Fast, secure & express door delivery.',
    icon: <AnimatedTruckIcon />,
  },
];

const FeaturesStrip = () => {
  return (
    <section className="w-full bg-[#fbf8f3] border-t border-b border-[#e8dfcf] py-8 sm:py-10 lg:py-12 relative overflow-hidden font-sans">
      {/* Background Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#B38A45]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-[#173b25]/5 blur-3xl" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-[#e2d6c1]">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -4 }}
              className={`group flex items-center gap-4.5 sm:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-2 justify-start lg:justify-center transition-all duration-300 ${
                idx % 2 === 0 ? 'sm:border-r sm:border-[#e2d6c1]' : ''
              } lg:border-r lg:border-[#e2d6c1] lg:last:border-r-0`}
            >
              {/* Larger Animated Icon */}
              {item.icon}

              {/* Text */}
              <div className="flex flex-col text-left">
                <h3 className="text-xs sm:text-[0.88rem] font-extrabold text-[#173b25] group-hover:text-[#B38A45] transition-colors duration-300 tracking-[0.14em] uppercase leading-tight flex items-center gap-1.5">
                  <span>{item.title}</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-[#524f46] font-medium leading-normal mt-1 max-w-[200px]">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesStrip;



