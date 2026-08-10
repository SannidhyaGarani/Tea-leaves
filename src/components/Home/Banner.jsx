import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-[#f8f3e9] py-12 lg:py-16">

      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dce7d7]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#e8dcc7]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* =====================================================
              IMAGE SIDE
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >

            {/* Small decorative label */}
            <div className="absolute -left-2 top-6 z-20 hidden sm:block">
              <div className="flex items-center gap-2 bg-[#173b25] px-4 py-2.5 text-white shadow-xl">
                <Leaf size={13} />
                <span className="text-[9px] font-bold uppercase tracking-[0.18em]">
                  From Assam
                </span>
              </div>
            </div>

            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">

              <img
                src="https://res.cloudinary.com/dcjn4y284/image/upload/v1786381086/Gemini_Generated_Image_5amn675amn675amn_yqzczh.png"
                alt="Fresh Assam tea leaves in a lush tea garden"
                className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.04]"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102b1b]/50 via-transparent to-transparent" />

              {/* Bottom image caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">

                <p className="font-serif text-2xl italic text-white sm:text-3xl">
                  From the gardens
                </p>

                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/80">
                  To your everyday conversations
                </p>

              </div>
            </div>

            {/* Floating small image/card */}
            <div className="absolute -bottom-6 -right-4 hidden w-36 overflow-hidden border-4 border-[#f8f3e9] shadow-2xl sm:block lg:-right-8 lg:w-44">
              <img
                src="https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=500&auto=format&fit=crop"
                alt="Fresh tea leaves"
                className="aspect-square w-full object-cover"
              />
            </div>

          </motion.div>


          {/* =====================================================
              CONTENT SIDE
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: 'easeOut',
            }}
            className="lg:pl-4 xl:pl-8"
          >

            {/* Eyebrow */}
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="h-px w-7 bg-[#B38A45]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B38A45]">
                Our Story
              </span>
              <span className="h-px w-7 bg-[#B38A45]" />
            </div>

            {/* Main heading */}
            <h2 className="max-w-xl font-serif text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#173b25]">
              Every Conversation <span className="italic text-[#B38A45]">Begins With Tea.</span>
            </h2>

            {/* Divider */}
            <div className="my-5 h-px w-14 bg-[#B38A45]" />


            {/* Story */}
            <div className="max-w-xl space-y-5 text-sm leading-7 text-[#66645c] sm:text-base">

              <p>
                <span className="font-semibold text-[#173b25]">
                  Varta
                </span>{' '}
                ka matlab hai baatcheet.
              </p>

              <p>
                Hamara maanna hai ki zindagi ki sabse khoobsurat
                baatein aksar ek cup chai ke saath shuru hoti hain.
              </p>

              <p>
                Assam ke lush tea gardens se carefully selected
                leaves lekar, hum har cup mein woh warmth,
                aroma aur authenticity laana chahte hain jo
                conversations ko yaadgaar bana de.
              </p>

            </div>


            {/* Quote */}
            <div className="mt-8 border-l border-[#b59a62] pl-5">

              <p className="font-serif text-lg italic leading-relaxed text-[#36543d]">
                "Because some of life's best conversations
                deserve a beautiful cup of tea."
              </p>

            </div>


            {/* CTA */}
            <div className="mt-9 flex flex-wrap items-center gap-6">

              <Link
                to="/about"
                className="group inline-flex items-center gap-4 bg-[#173b25] px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#245433]"
              >
                <span>Discover Our Story</span>

                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>


              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#173b25]"
              >
                <span>Explore Our Teas</span>

                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

          </motion.div>

        </div>


        {/* =====================================================
            BOTTOM BRAND STATEMENT
        ====================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-24 grid border-t border-[#d8cfbe] pt-8 sm:grid-cols-3"
        >

          <div className="pb-6 sm:pb-0">
            <p className="font-serif text-xl text-[#173b25]">
              Carefully Selected
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#8a8578]">
              Premium tea leaves
            </p>
          </div>


          <div className="border-[#d8cfbe] pb-6 sm:border-l sm:px-8 sm:pb-0">
            <p className="font-serif text-xl text-[#173b25]">
              Rooted In Assam
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#8a8578]">
              Authentic origin
            </p>
          </div>


          <div className="border-[#d8cfbe] sm:border-l sm:px-8">
            <p className="font-serif text-xl text-[#173b25]">
              Made For Conversations
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#8a8578]">
              More than just tea
            </p>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default Banner;