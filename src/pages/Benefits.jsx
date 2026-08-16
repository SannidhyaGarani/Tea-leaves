import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, ShieldCheck, Dumbbell, Feather, Sparkles,
  ArrowUpRight, Compass, LineChart, Droplet, Flame
} from 'lucide-react';

const Benefits = () => {
  const [activeMetric, setActiveMetric] = useState(0);
  const premiumEase = [0.25, 1, 0.5, 1];

  const biologicalMetrics = [
    {
      title: "Rich Polyphenol Antioxidants",
      value: "EGCG+",
      metric: "Cellular Shield",
      desc: "Harvested directly from high-altitude Assam estates, our whole tea leaves are rich in epigallocatechin gallate (EGCG) and flavonoids. These natural antioxidants neutralize free radicals, supporting cellular longevity and healthy vascular function.",
      icon: <Activity size={20} strokeWidth={1.5} />,
      stats: [
        { label: "Antioxidant Potency", value: "98.4%" },
        { label: "Additives / Extract", value: "Zero" }
      ]
    },
    {
      title: "L-Theanine Mental Clarity",
      value: "Calm Focus",
      metric: "Sustained Energy",
      desc: "Unlike synthetic caffeine drinks that trigger nervous jitters and sharp crashes, pure tea pairs caffeine naturally with the amino acid L-Theanine. This induces alpha brain waves for smooth, calm alertness and focused clarity throughout the day.",
      icon: <Sparkles size={20} strokeWidth={1.5} />,
      stats: [
        { label: "Alertness Half-Life", value: "4-6 Hrs" },
        { label: "Jitter Probability", value: "0.0%" }
      ]
    },
    {
      title: "Metabolic & Digestive Harmony",
      value: "100%",
      metric: "Natural Wellness",
      desc: "Revered for centuries across traditional wellness rituals, warm steeped tea aids in digestion, balances gut flora, and enhances metabolic thermogenesis, helping your body process nutrition effortlessly.",
      icon: <Droplet size={20} strokeWidth={1.5} />,
      stats: [
        { label: "Gut Thermal Index", value: "Soothing" },
        { label: "Botanical Purity", value: "100% Pure" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f5] pt-32 lg:pt-48 pb-32 text-[#1c2b21] relative selection:bg-[#b8860b] selection:text-white">
      {/* Light Luxury Geometric Dot Mesh Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        {/* ================= HERO ARCHITECTURE ================= */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: premiumEase }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="flex items-center gap-2.5 text-[#b8860b]">
              <Sparkles size={12} strokeWidth={1.5} />
              <span className="text-[12px] font-bold uppercase tracking-[0.35em]">The Wellness Science</span>
            </div>

            <h1 className="text-[11vw] sm:text-[8vw] lg:text-[5.5vw] font-light text-[#1c2b21] leading-[0.95] tracking-widest uppercase">
              PURE LEAVES. <br />
              <span className="italic text-[#b8860b] font-normal">UNCOMPROMISED</span> <br />
              WELLNESS.
            </h1>

            <div className="h-[1px] w-20 bg-[#b8860b]" />

            <p className="text-base sm:text-lg text-zinc-600 font-light leading-relaxed max-w-2xl">
              We reject artificial flavorings and chemical extracts. Vaarta Chai delivers single-origin botanical nourishment that aligns with your daily ritual, providing sustained energy and tranquility.
            </p>
          </motion.div>

          {/* Minimalist Sidebar Floating Counter */}
          <div className="lg:col-span-4 lg:text-right pt-6 hidden lg:block">
            <span className="text-[120px] font-poppins font-light text-[#b8860b]/10 leading-none select-none pointer-events-none">
              01
            </span>
            <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 mt-2">
              Garden Fresh & Certified Pure
            </p>
          </div>
        </div>

        {/* ================= INTERACTIVE METRICS EXPLORER ================= */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-stretch mb-40">

          {/* Navigation Track */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.25em] text-[#b8860b]">Botanical Vectors</p>
              <h2 className="text-2xl font-light tracking-widest uppercase text-[#1c2b21]">The Three Structural Pillars</h2>
            </div>

            <div className="space-y-4 flex-1 justify-center flex flex-col">
              {biologicalMetrics.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMetric(idx)}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-500 flex items-center justify-between group cursor-pointer ${activeMetric === idx
                      ? 'bg-white border-[#b8860b]/40 shadow-[0_20px_50px_rgba(28,43,33,0.06)]'
                      : 'bg-transparent border-zinc-200 hover:border-[#b8860b]/50'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-500 ${activeMetric === idx ? 'bg-[#1c2b21] text-[#c9a962]' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1c2b21] tracking-wide uppercase">{item.title}</h3>
                      <p className="text-[12px] text-zinc-500 tracking-wide mt-0.5">{item.metric}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className={`text-zinc-400 transition-transform duration-500 ${activeMetric === idx ? 'rotate-45 text-[#b8860b]' : 'group-hover:translate-x-0.5'
                    }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Display Panel */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-sm font-mono font-light text-zinc-300 tracking-wider">
              SYS_REF//00{activeMetric + 1}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMetric}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: premiumEase }}
                className="space-y-8 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-baseline gap-3">
                    <span className="text-5xl sm:text-6xl font-light text-[#1c2b21] tracking-tight">
                      {biologicalMetrics[activeMetric].value}
                    </span>
                    <span className="text-xs uppercase tracking-widest font-bold text-[#b8860b]">
                      {biologicalMetrics[activeMetric].metric}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-600 font-light leading-relaxed">
                    {biologicalMetrics[activeMetric].desc}
                  </p>
                </div>

                {/* Micro Technical Data Matrix */}
                <div className="pt-8 border-t border-zinc-100 grid grid-cols-2 gap-6">
                  {biologicalMetrics[activeMetric].stats.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">
                        {stat.label}
                      </span>
                      <span className="text-lg font-light text-[#1c2b21]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* ================= SECONDARY BENEFIT LAYERS GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-40">
          {[
            {
              icon: <Feather size={20} strokeWidth={1.5} />,
              title: "Weight & Wellness Alignment",
              desc: "Natural whole-leaf infusions contain polyphenols that aid digestive metabolism, supporting sustained gut harmony and overall lightness."
            },
            {
              icon: <Flame size={20} strokeWidth={1.5} />,
              title: "Cellular Thermogenesis",
              desc: "Fresh tea catechin compounds stimulate clean metabolic cellular activity, encouraging natural fat oxidation without synthetic supplements."
            },
            {
              icon: <ShieldCheck size={20} strokeWidth={1.5} />,
              title: "Immune & Vascular Integrity",
              desc: "Rich in bioflavonoids, daily tea steeping helps strengthen immunity, protect vascular walls, and promote vibrant skin radiance."
            }
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: premiumEase }}
              className="p-10 rounded-xl bg-white border border-zinc-200 hover:shadow-lg transition-all duration-500 space-y-6"
            >
              <div className="w-10 h-10 rounded-lg bg-[#faf9f5] border border-zinc-200 flex items-center justify-center text-[#b8860b]">
                {benefit.icon}
              </div>
              <h3 className="text-base font-bold text-[#1c2b21] tracking-wide uppercase">{benefit.title}</h3>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ================= CLINICAL OUTRO MANIFESTO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="bg-[#1c2b21] rounded-2xl p-10 md:p-20 text-[#faf9f5] relative overflow-hidden shadow-2xl"
        >
          {/* Asymmetric Artistic Overlay Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b8860b]/20 rounded-full blur-[160px] opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#b8860b]" />
              <span className="text-[12px] font-bold uppercase tracking-[0.35em] text-[#b8860b]">Botanical Charter</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light leading-[1.25] tracking-widest uppercase text-white">
              “We hold an uncompromising belief: true daily energy does not require synthetic chemical stimulants. Our tea blends are harvested directly from Assam gardens and crafted for biological harmony.”
            </h2>

            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-8 text-[12px] uppercase tracking-widest font-medium text-zinc-400">
                <span className="flex items-center gap-1.5"><Compass size={11} /> 100% Garden Fresh</span>
                <span className="flex items-center gap-1.5"><LineChart size={11} /> Bio-Antioxidant Verified</span>
              </div>
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#b8860b]">
                Vaarta Chai Tea Estate // Established Heritage
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Benefits;
