import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Leaf, Sparkles } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Tea Gardens',
    shortTitle: 'The Origin',
    subtitle: 'Misty Assam Estates',
    desc: "Our journey begins in the lush tea gardens of Assam, where rich fertile soil and morning mist nurture exceptional tea leaves.",
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '02',
    title: 'Tea Picking',
    shortTitle: 'Handpicked',
    subtitle: 'Selective Harvest',
    desc: 'Only the finest tender leaves are handpicked at peak morning freshness to preserve their natural aroma and rich flavor profile.',
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '03',
    title: 'Crafted With Care',
    shortTitle: 'The Craft',
    subtitle: 'Artisanal Blending',
    desc: 'Our master blenders expertly process every batch to create the signature strength, rich liquor, and malty taste of Vaarta Chai.',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '04',
    title: 'Packed Fresh',
    shortTitle: 'Sealed In',
    subtitle: 'Aroma Lock Packaging',
    desc: 'Sealed in foil-lined, garden-fresh packs to lock in aroma and freshness from the estate straight to your doorstep.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '05',
    title: 'Your Cup',
    shortTitle: 'The Experience',
    subtitle: 'Pure Daily Joy',
    desc: 'From garden to cup, your tea arrives ready to elevate your daily rituals and inspire warm, memorable conversations.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop',
  },
];

const TeaJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = JOURNEY_STEPS[activeStep];

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % JOURNEY_STEPS.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + JOURNEY_STEPS.length) % JOURNEY_STEPS.length);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf5ec] py-14 sm:py-20 lg:py-24 font-sans">
      
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dce7d7]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#e8dcc7]/45 blur-3xl" />

      {/* Decorative leaf graphic */}
      <div className="pointer-events-none absolute right-6 top-16 opacity-[0.035] text-[#173b25]">
        <Leaf size={300} strokeWidth={0.7} />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-4 sm:px-8 lg:px-12">

        {/* ── SECTION HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
        >
          {/* Eyebrow */}
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-[#B38A45]" />
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#B38A45]">
              The Varta Journey
            </span>
            <span className="h-px w-8 bg-[#B38A45]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium leading-tight tracking-tight text-[#173b25]">
            From Our Gardens <span className="italic text-[#B38A45]">To Your Cup</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#6d6b61]">
            Every cup has a story. From misty Assam tea estates to quiet mornings at home, discover the care behind every Vaarta blend.
          </p>
        </motion.div>

        {/* ==============================================================
            MOBILE & TABLET VIEW: SLEEK ULTRA-PREMIUM CAROUSEL CARD
        ============================================================== */}
        <div className="block lg:hidden">
          
          {/* Top Timeline Step Numbers Bar */}
          <div className="mb-8 max-w-sm mx-auto px-2">
            <div className="flex items-center justify-between relative">
              {/* Connecting background line */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1.5px] bg-[#e2d7c5] z-0" />
              
              {JOURNEY_STEPS.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(idx)}
                    className="relative z-10 flex flex-col items-center group cursor-pointer"
                  >
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                        isActive 
                          ? 'bg-[#173b25] text-white shadow-md ring-4 ring-[#B38A45]/20 border border-[#B38A45]' 
                          : 'bg-[#faf5ec] text-[#6d6b61] border border-[#e2d7c5] hover:border-[#173b25]'
                      }`}
                    >
                      {step.number}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Centered Active Step Badge */}
            <div className="mt-3 text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#173b25] bg-[#B38A45]/15 px-3 py-1 rounded-full border border-[#B38A45]/30 inline-block">
                Step {currentStep.number}: {currentStep.shortTitle}
              </span>
            </div>
          </div>

          {/* Luxury Card Box */}
          <div className="relative bg-[#f7f2e8] rounded-2xl p-5 sm:p-7 shadow-xs border border-[#e8dfcf] overflow-hidden">
            
            {/* Header Status Bar (Clean Single Line, Reduced Tracking) */}
            <div className="mb-4 flex items-center justify-between border-b border-[#e8dfcf] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#B38A45]">
                  STEP {currentStep.number} OF 05
                </span>
                <span className="text-xs text-[#B38A45]">•</span>
                <span className="text-[11px] font-semibold text-[#173b25] tracking-tight">
                  {currentStep.subtitle}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Sparkles size={12} className="text-[#B38A45]" />
              </div>
            </div>

            {/* Step Card Content with Motion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Crisp Photo Container */}
                <div className="relative aspect-[16/10] sm:aspect-[1.5/1] rounded-xl overflow-hidden shadow-sm bg-white border border-[#e5dccb]">
                  <img 
                    src={currentStep.image} 
                    alt={currentStep.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 bg-[#173b25]/90 backdrop-blur-md text-[#F7F2E8] px-3.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-[0.2em] border border-[#B38A45]/40 shadow-md">
                    {currentStep.shortTitle}
                  </div>
                </div>

                {/* Narrative Description */}
                <div className="pt-1">
                  <h3 className="font-serif text-2xl font-medium text-[#173b25] mb-2 leading-tight">
                    {currentStep.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#636156] leading-relaxed font-normal">
                    {currentStep.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Controls Bar */}
            <div className="mt-6 pt-4 border-t border-[#e8dfcf] flex items-center justify-between">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#173b25]/30 text-[#173b25] text-xs font-bold uppercase tracking-wider hover:bg-[#173b25]/5 transition-colors"
                aria-label="Previous Step"
              >
                <ArrowLeft size={14} />
                <span>PREV</span>
              </button>

              {/* Step indicator dots */}
              <div className="flex items-center gap-1.5">
                {JOURNEY_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeStep ? 'w-6 bg-[#173b25]' : 'w-2 bg-[#d8cebe]'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#173b25] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#245433] transition-colors"
                aria-label="Next Step"
              >
                <span>NEXT</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>

        {/* ==============================================================
            DESKTOP VIEW: ULTRA-PREMIUM 5-COLUMN STORY CARDS
        ============================================================== */}
        <div className="hidden lg:block relative">
          
          {/* Connector Line across steps */}
          <div className="absolute left-[8%] right-[8%] top-[38%] h-[1px] bg-[#B38A45]/30 pointer-events-none z-0" />

          <div className="grid grid-cols-5 gap-6">
            {JOURNEY_STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                className="group relative flex flex-col justify-between bg-[#f7f2e8] rounded-2xl p-4 border border-[#e5dccb] hover:border-[#B38A45] hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 z-10"
              >
                {/* Top Image Box */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#e7dfd0] shadow-xs mb-4">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                  
                  {/* Subtle Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102c1c]/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Step Number Badge */}
                  <div className="absolute top-3 left-3 bg-[#173b25]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#B38A45]/40 shadow-sm">
                    <span className="font-serif text-sm font-semibold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Subtitle Label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e5d29d] block">
                      {step.shortTitle}
                    </span>
                  </div>
                </div>

                {/* Step Narrative Content */}
                <div className="flex-1 flex flex-col justify-between pt-1">
                  <div>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-[0.22em] text-[#B38A45] block mb-1">
                      Step {step.number}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-[#173b25] group-hover:text-[#B38A45] transition-colors leading-snug mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-[#6d6b61] font-normal leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e5dccb] flex items-center justify-between text-[10px] font-bold text-[#173b25] group-hover:text-[#B38A45] transition-colors uppercase tracking-wider">
                    <span>{step.subtitle}</span>
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM PHILOSOPHY STATEMENT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl border-t border-[#B38A45]/30 pt-8 text-center md:mt-16"
        >
          <div className="mb-3 flex justify-center">
            <Leaf size={18} strokeWidth={1.2} className="text-[#B38A45]" />
          </div>

          <p className="font-serif text-xl sm:text-2xl italic leading-relaxed text-[#173b25]">
            "Good tea begins with good leaves.<br />Great tea begins with a story."
          </p>

          <span className="mt-3 block text-[9.5px] font-extrabold uppercase tracking-[0.3em] text-[#B38A45]">
            The Varta Philosophy
          </span>
        </motion.div>

      </div>
    </section>
  );
};

export default TeaJourney;