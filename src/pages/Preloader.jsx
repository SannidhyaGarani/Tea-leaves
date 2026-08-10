import React, { useEffect, useState } from 'react';

const PRELOADER_PHRASES = [
  'Selecting finest Assam tea leaves...',
  'Nurturing authentic aromas...',
  'Crafting your tea experience...',
  'Welcome to Vaarta Chai',
];

const Preloader = ({
  onComplete,
  label = 'Crafting Your Tea Experience',
  isDataReady,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Cycle status phrases smoothly based on progress percentage
  useEffect(() => {
    if (progress < 30) {
      setPhraseIndex(0);
    } else if (progress < 60) {
      setPhraseIndex(1);
    } else if (progress < 90) {
      setPhraseIndex(2);
    } else {
      setPhraseIndex(3);
    }
  }, [progress]);

  // Smooth, luxurious progress timing (~2.2 seconds total duration)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        let increment;
        if (isDataReady) {
          increment = 5;
        } else if (prev < 40) {
          increment = 1.4;
        } else if (prev < 80) {
          increment = 1.1;
        } else {
          increment = 0.8;
        }

        return Math.min(prev + increment, 100);
      });
    }, 24);

    return () => clearInterval(timer);
  }, [isDataReady]);

  // Exit trigger when progress reaches 100% with comfortable reading hold time
  useEffect(() => {
    if (progress >= 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);

        const completeTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 900);

        return () => clearTimeout(completeTimer);
      }, 700);

      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  const displayProgress = Math.floor(progress);

  return (
    <div
      className={`fixed inset-0 z-[10000] overflow-hidden bg-[#0e2115] font-sans select-none ${
        isExiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      aria-label="Vaarta Chai Preloader"
    >
      {/* ── 1. ATMOSPHERIC LUXURY BACKGROUND & AMBIENT LIGHT ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm central golden aura */}
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4a35d]/20 blur-[150px]" />
        
        {/* Soft deep forest green glow */}
        <div className="absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#173b25]/90 blur-[200px]" />

        {/* Subtle royal dot grid */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* ── 2. TOP EDGE SHIMMERING METALLIC GOLD PROGRESS BAR ── */}
      <div className="absolute left-0 right-0 top-0 z-40 h-[3px] bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#b38a45] via-[#d4b66f] to-[#f7f2e8] transition-all duration-150 ease-out shadow-[0_0_14px_rgba(212,182,111,0.8)]"
          style={{ width: `${displayProgress}%` }}
        />
      </div>

      {/* ── 3. LUXURY EDITORIAL CORNER EMBLEMS ── */}
      <div
        className={`pointer-events-none absolute inset-6 sm:inset-10 z-30 transition-opacity duration-600 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-[#c4a35d]/40" />
        <div className="absolute right-0 top-0 h-7 w-7 border-r-2 border-t-2 border-[#c4a35d]/40" />
        <div className="absolute bottom-0 left-0 h-7 w-7 border-b-2 border-l-2 border-[#c4a35d]/40" />
        <div className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-[#c4a35d]/40" />
      </div>

      {/* ── 4. CENTER BRAND HERO (IMMEDIATELY VISIBLE & PROMINENT) ── */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center px-6 transition-all duration-700 ${
          isExiting ? '-translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex w-full max-w-[480px] flex-col items-center text-center">

          {/* Leaf Emblem & Brand Header */}
          <div className="mb-8 flex flex-col items-center">
            {/* Golden Leaf Logo SVG */}
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-[#c4a35d]/30 rounded-full blur-xl animate-pulse" />
              <svg
                width="60"
                height="62"
                viewBox="0 0 50 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
              >
                <path
                  d="M25 5C15 15 8 28 8 38C8 44 12 48 18 48C26 48 30 38 30 30"
                  stroke="#c4a35d"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M25 5C35 15 42 28 42 38C42 44 38 48 32 48C24 48 20 38 20 30"
                  stroke="#f7f2e8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M25 8V44"
                  stroke="#c4a35d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Main Brand Title: Vaarta */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-none tracking-tight text-[#f7f2e8] drop-shadow-[0_4px_25px_rgba(196,163,93,0.4)] mb-1"
              style={{
                fontFamily:
                  "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              }}
            >
              Vaarta
            </h1>

            {/* Devanagari Brand Text: चाय */}
            <span
              className="text-sm font-bold tracking-[0.45em] text-[#c4a35d] uppercase leading-none mt-1"
              style={{
                fontFamily: '"Noto Sans Devanagari", sans-serif',
              }}
            >
              चाय
            </span>
          </div>

          {/* Hindi Tagline */}
          <p className="mb-9 text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[#f7f2e8]/80">
            हर घूंट में छुपी एक कहानी
          </p>

          {/* High-Precision Progress Counter & Status */}
          <div className="w-full max-w-[320px]">
            {/* Dynamic Status Text */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c4a35d] transition-all duration-300">
                {PRELOADER_PHRASES[phraseIndex]}
              </span>
              <span className="font-serif text-lg font-bold tabular-nums text-[#f7f2e8] tracking-wider">
                {displayProgress}%
              </span>
            </div>

            {/* Progress Track Bar */}
            <div className="relative h-[2.5px] w-full overflow-hidden bg-white/15 rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#b38a45] via-[#c4a35d] to-[#f7f2e8] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(196,163,93,0.9)]"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>

          {/* Shimmering Animated Loading Dots */}
          <div
            className={`mt-6 flex gap-2 transition-opacity duration-300 ${
              displayProgress >= 100 ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-[#c4a35d] animate-pulse"
                style={{
                  animationDelay: `${dot * 200}ms`,
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── 5. SPLIT CURTAIN EXIT ANIMATION ── */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-50 h-1/2 bg-[#0e2115] transition-transform duration-[950ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isExiting ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#c4a35d]/40" />
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-50 h-1/2 bg-[#0e2115] transition-transform duration-[950ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isExiting ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="absolute top-0 inset-x-0 h-[1px] bg-[#c4a35d]/40" />
      </div>
    </div>
  );
};

export default Preloader;