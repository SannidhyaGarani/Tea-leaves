import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Shield, Heart, Compass, Leaf, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/Home/PageHeader';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }
};

const About = () => {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <PageHeader
        title="Our Story"
        subtitle="Crafted with intention, designed for the modern wardrobe."
        breadcrumbItems={[
          { label: 'Home', path: '/' },
          { label: 'About Us' },
        ]}
      />

      {/* HERO EDITORIAL */}
      <section className="py-16 md:py-24 bg-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image Grid */}
            <motion.div {...fadeUp} className="grid grid-cols-12 gap-3 sm:gap-4">
              <div className="col-span-7 aspect-[3/4] overflow-hidden relative group border border-zinc-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop"
                  alt="Vaarta Chai craftsmanship"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
              <div className="col-span-5 aspect-[3/4] overflow-hidden mt-10 sm:mt-16 relative group border border-zinc-200 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=600&auto=format&fit=crop"
                  alt="Vaarta Chai tea estate"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-7 lg:pl-4">
              <motion.div {...fadeUp}>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500 block mb-4">Our Philosophy</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-zinc-900 leading-[1.1] tracking-widest uppercase">
                  Tea That<br />Warms Your Soul
                </h2>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="space-y-4 text-[14px] sm:text-[15px] text-zinc-600 leading-relaxed"
              >
                <p>At Vaarta Chai, we believe that tea is more than a beverage — it's an expression of warmth and togetherness. Every blend is thoughtfully crafted to bridge the gap between rich Assam heritage and memorable daily conversations.</p>
                <p>We work directly with ethical tea gardens and master blenders, ensuring every leaf carries authentic flavor and purpose.</p>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="grid grid-cols-2 gap-6 py-7 border-y border-zinc-200"
              >
                <div>
                  <span className="text-4xl font-light text-zinc-900 tracking-widest">50+</span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold mt-1">Artisanal Blends</p>
                </div>
                <div>
                  <span className="text-4xl font-light text-zinc-900 tracking-widest">10K+</span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold mt-1">Happy Customers</p>
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                <Link to="/shop" className="inline-flex items-center gap-3 group">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-black text-zinc-700 group-hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-black/40">
                    Explore Our Tea Collection
                  </span>
                  <div className="w-9 h-9 rounded-full border border-zinc-300 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-400">
                    <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white transition-colors duration-400" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-16 md:py-20 bg-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="pb-10 border-b border-zinc-200 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold block mb-3">What Defines Us</span>
            <h2 className="text-3xl md:text-4xl font-light text-zinc-900 uppercase tracking-widest">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: Gem, title: 'Premium Quality', desc: 'Every blend is crafted with the finest handpicked tea leaves, rigorously tested for aroma, flavor, and purity.' },
              { icon: Leaf, title: 'Sustainable Sourcing', desc: 'We prioritize ethical sourcing directly from gardens to minimize environmental footprint and support local growers.' },
              { icon: Heart, title: 'Crafted with Love', desc: 'Our tea masters pour passion into every blend, creating teas that offer authentic warmth in every cup.' },
              { icon: Compass, title: 'Timeless Blends', desc: 'From classic CTC chai to rare herbal infusions, we craft timeless recipes for every moment of your day.' }
            ].map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="group bg-white border border-zinc-200 p-6 sm:p-7 hover:border-black/30 transition-all duration-400 shadow-sm"
                >
                  <div className="w-10 h-10 border border-zinc-300 flex items-center justify-center text-zinc-600 mb-5 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-400">
                    <Icon size={17} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[12px] font-semibold text-zinc-900 uppercase tracking-wide mb-2">{pillar.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{pillar.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL WIDTH BANNER */}
      <section className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=2000&auto=format&fit=crop"
          alt="vaarta Tea Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/70 text-[10px] uppercase tracking-[0.4em] font-bold mb-4">Our Promise</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white max-w-2xl leading-[1.1] tracking-widest uppercase">
              Designed to Inspire.<br />Built to Last.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-16 md:py-24 bg-[#faf9f5]">
        <div className="max-w-4xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="pb-10 border-b border-zinc-200 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold block mb-3">Our Journey</span>
            <h2 className="text-3xl font-light text-zinc-900 uppercase tracking-widest">Milestones That Define Us</h2>
          </div>
          {[
            { year: '2024', title: 'The Beginning', desc: 'Vaarta Chai was born from a vision to bring pure, single-origin Assam tea directly from gardens to tea lovers across India.' },
            { year: '2024', title: 'First Estate Harvest', desc: 'Launched our debut artisanal tea blends, celebrating rich natural flavors and traditional brewing.' },
            { year: '2025', title: 'Growing Community', desc: 'Reached 10,000+ satisfied tea connoisseurs and expanded our collection to curated herbal & spiced blends.' },
            { year: '2026', title: 'Looking Ahead', desc: 'Continuing to innovate in biological wellness while staying true to our commitment to garden freshness.' },
          ].map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex gap-6 sm:gap-10 group py-7 border-b border-zinc-200 last:border-0"
            >
              <div className="shrink-0 pt-1">
                <span className="text-[10px] font-black tracking-widest text-zinc-500 border border-zinc-300 px-2.5 py-1 bg-white">
                  {milestone.year}
                </span>
              </div>
              <div>
                <h3 className="text-[15px] sm:text-base font-bold text-zinc-900 mb-1 group-hover:text-[#b8860b] transition-colors">{milestone.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{milestone.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
