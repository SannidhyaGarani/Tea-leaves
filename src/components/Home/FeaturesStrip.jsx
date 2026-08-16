import React from 'react';

const features = [
  {
    title: "PREMIUM QUALITY",
    desc: "Freshly selected tea leaves.",
    icon: (
      <svg className="w-9 h-9 text-[#7c6d3d] shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 25C7 25 9 14 20 8C20 8 20 18 13 22C11 23 8 24 7 25Z" />
        <path d="M7 25Q13 17 20 8" />
        <path d="M14 21C14 21 18 15 25 12C25 12 24 19 19 22C17.5 23 15 23.5 14 24" />
        <path d="M14 24Q19 18 25 12" />
      </svg>
    ),
  },
  {
    title: "RICH TASTE",
    desc: "Kadak taste with natural aroma.",
    icon: (
      <svg className="w-9 h-9 text-[#7c6d3d] shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 14H22V20C22 23.3 19.3 26 16 26H12C8.7 26 6 23.3 6 20V14Z" />
        <path d="M22 16H24.5C26.4 16 28 17.6 28 19.5C28 21.4 26.4 23 24.5 23H22" />
        <path d="M5 28H23" />
        <path d="M10 10C10 8.5 11.5 7.5 11.5 6" />
        <path d="M14 11C14 9.5 15.5 8.5 15.5 7" />
        <path d="M18 10C18 8.5 19.5 7.5 19.5 6" />
      </svg>
    ),
  },
  {
    title: "FRESH PACKING",
    desc: "Packed carefully to maintain freshness.",
    icon: (
      <svg className="w-9 h-9 text-[#7c6d3d] shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24C8 24 10 13 21 7C21 7 21 17 14 21C12 22 9 23 8 24Z" />
        <path d="M8 24Q14 16 21 7" />
        <path d="M15 20C15 20 19 14 26 11C26 11 25 18 20 21C18.5 22 16 22.5 15 23" />
        <path d="M15 23Q19 18 26 11" />
      </svg>
    ),
  },
  {
    title: "PAN INDIA DELIVERY",
    desc: "Fast and safe delivery.",
    icon: (
      <svg className="w-9 h-9 text-[#7c6d3d] shrink-0" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="13" height="11" rx="1" />
        <path d="M17 13H23L26 17V21H17V13Z" />
        <circle cx="8.5" cy="23.5" r="2.5" />
        <circle cx="21.5" cy="23.5" r="2.5" />
        <path d="M11 23.5H19" />
      </svg>
    ),
  },
];

const FeaturesStrip = () => {
  return (
    <section className="w-full bg-[#faf5ec] border-t border-b border-[#e8dfcf] py-6 sm:py-8 lg:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-[#dfd4c2]">
          {features.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 px-3 sm:px-6 lg:px-8 py-3 sm:py-1 justify-start lg:justify-center ${
                idx % 2 === 0 ? 'sm:border-r sm:border-[#dfd4c2]' : ''
              } lg:border-r lg:border-[#dfd4c2] lg:last:border-r-0`}
            >
              {/* Icon */}
              {item.icon}

              {/* Text */}
              <div className="flex flex-col text-left">
                <h3 className="text-xs sm:text-[0.8rem] font-bold text-[#1f2e23] tracking-[0.12em] uppercase leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#525e55] font-normal leading-tight mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesStrip;

