import React from 'react';
import { motion } from 'framer-motion';
import { Gem, Shield, Heart, Compass, Leaf, ArrowUpRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#faf5ec] font-sans">
      <PageHeader
        title="Our Story"
        subtitle="Every cup starts a conversation. Discover the passion, heritage, and care behind Vaarta Chai."
        breadcrumbItems={[
          { label: 'Home', path: '/' },
          { label: 'About Us' },
        ]}
      />

      {/* HERO EDITORIAL */}
      <section className="py-14 sm:py-16 md:py-20 bg-[#faf5ec]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image Grid */}
            <motion.div {...fadeUp} className="grid grid-cols-12 gap-3 sm:gap-4">
              <div className="col-span-7 aspect-[3/4] overflow-hidden relative group border border-[#B38A45]/30 shadow-md rounded-2xl bg-[#e7dfd0]">
                <img
                  src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop"
                  alt="Vaarta Chai craftsmanship"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
              <div className="col-span-5 aspect-[3/4] overflow-hidden mt-10 sm:mt-16 relative group border border-[#B38A45]/30 shadow-md rounded-2xl bg-[#e7dfd0]">
                <img
                  src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=600&auto=format&fit=crop"
                  alt="Vaarta Chai tea estate"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Content */}
            <div className="space-y-6 lg:pl-4">
              <motion.div {...fadeUp}>
                <span className="text-[10px] font-extrabold tracking-[0.28em] uppercase text-[#B38A45] block mb-2">Our Philosophy</span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#173b25] leading-[1.15] tracking-tight">
                  Tea That <span className="italic text-[#B38A45]">Warms Your Soul</span>
                </h2>
                
                {/* Hindi Tagline */}
                <h3 
                  className="text-xl sm:text-2xl font-normal text-[#173b25] mt-2 mb-3"
                  style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
                >
                  हर घूंट में छुपी एक कहानी
                </h3>

                {/* Leaf Emblem Line Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="w-12 h-[1px] bg-[#B38A45]/40" />
                  <div className="text-[#2d5a27]"><Leaf size={15} fill="#2d5a27" /></div>
                  <div className="w-12 h-[1px] bg-[#B38A45]/40" />
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="space-y-4 text-xs sm:text-sm md:text-base text-[#524f46] leading-relaxed font-medium"
              >
                <p>At Vaarta Chai, we believe that tea is more than a beverage — it's an expression of warmth, comfort, and togetherness. Every blend is thoughtfully crafted to bridge the gap between rich Assam tea heritage and memorable daily conversations.</p>
                <p>We work directly with ethical tea estates in Assam, ensuring every leaf is handpicked at peak morning freshness to deliver garden-fresh aroma, rich malty strength, and unforgettable taste.</p>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="grid grid-cols-2 gap-6 py-6 border-y border-[#B38A45]/25"
              >
                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#173b25] tracking-tight">100%</span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#B38A45] font-extrabold mt-1">Garden Fresh Assam</p>
                </div>
                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#173b25] tracking-tight">10K+</span>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#B38A45] font-extrabold mt-1">Happy Tea Lovers</p>
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
                <Link to="/shop" className="inline-flex items-center gap-3 bg-[#173b25] hover:bg-[#245433] text-white px-7 py-3.5 rounded-xs text-xs font-extrabold uppercase tracking-[0.22em] shadow-md hover:shadow-xl transition-all duration-300">
                  <span>Explore Our Collection</span>
                  <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-14 sm:py-16 md:py-20 bg-[#f7f2e8] border-t border-[#e8dfcf]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14">
          <div className="pb-8 border-b border-[#B38A45]/20 mb-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#173b25] tracking-tight mb-1">
              Our Core <span className="italic text-[#B38A45]">Values</span>
            </h2>
            <div className="flex items-center justify-center gap-3 my-3">
              <div className="w-12 h-[1px] bg-[#B38A45]/40" />
              <div className="text-[#2d5a27]"><Leaf size={15} fill="#2d5a27" /></div>
              <div className="w-12 h-[1px] bg-[#B38A45]/40" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Leaf,
                title: 'Garden Fresh',
                desc: 'Sealed directly at Assam estates within hours of processing for peak aroma.'
              },
              {
                icon: Shield,
                title: 'Uncompromised Quality',
                desc: '100% natural, pure CTC and whole orthodox leaves with no artificial colors.'
              },
              {
                icon: Heart,
                title: 'Made For Conversations',
                desc: 'Crafted to bring warmth to family gatherings, quiet mornings, and evening tea breaks.'
              },
              {
                icon: Gem,
                title: 'Artisanal Blending',
                desc: 'Master blenders testing strength, liquor color, and malty flavor profile.'
              }
            ].map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="bg-[#faf5ec] p-6 border border-[#e2d7c5] hover:border-[#B38A45] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center mb-4">
                  <v.icon size={18} />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#173b25] mb-2">{v.title}</h3>
                <p className="text-xs text-[#524f46] font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL WIDTH BANNER */}
      <section className="relative h-[40vh] sm:h-[45vh] overflow-hidden bg-[#173b25]">
        <img
          src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=2000&auto=format&fit=crop"
          alt="Vaarta Tea Estate"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#173b25]/75" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-[#B38A45] text-[10px] uppercase tracking-[0.3em] font-extrabold mb-2">Our Promise</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#f7f2e8] leading-tight mb-4">
              Pure Assam Tea <span className="italic text-[#B38A45]">In Every Single Cup</span>
            </h2>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#B38A45] hover:bg-[#967233] text-white px-7 py-3 text-xs font-extrabold uppercase tracking-[0.2em] rounded-xs transition-all duration-300 shadow-md">
              <span>EXPLORE SHOP</span>
              <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
