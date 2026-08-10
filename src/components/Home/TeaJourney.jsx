import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Tea Gardens',
    shortTitle: 'The Origin',
    desc: "Our journey begins in the lush tea gardens of Assam, where misty mornings and fertile soil nurture exceptional tea leaves.",
    image:
      'https://plus.unsplash.com/premium_photo-1692049123825-8d43174c9c5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhJTIwbGVhdmVzfGVufDB8fDB8fHww',
  },
  {
    number: '02',
    title: 'Tea Picking',
    shortTitle: 'Handpicked',
    desc: 'Only carefully selected leaves are picked at the right moment to preserve their freshness, character and natural aroma.',
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '03',
    title: 'Crafted With Care',
    shortTitle: 'The Craft',
    desc: 'Our leaves are expertly processed and blended to create the distinctive taste and aroma that defines every Varta cup.',
    image:
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '04',
    title: 'Packed Fresh',
    shortTitle: 'Sealed In',
    desc: 'Every blend is carefully packed to preserve its freshness, fragrance and flavour until the moment it reaches you.',
    image:
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '05',
    title: 'Your Cup',
    shortTitle: 'The Varta Moment',
    desc: 'From our gardens to your home, your tea arrives ready to become part of your everyday moments and conversations.',
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1200&auto=format&fit=crop',
  },
];

const TeaJourney = () => {
  return (
    <section className="relative overflow-hidden bg-[#f5f0e6] py-12 md:py-16">

      {/* =========================================
          BACKGROUND DETAILS
      ========================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#dce5d4]/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#dfd1b8]/30 blur-3xl" />

      <div className="pointer-events-none absolute right-12 top-20 opacity-[0.035]">
        <Leaf size={280} strokeWidth={0.7} />
      </div>


      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >

          {/* Eyebrow */}
          <div className="mb-2.5 flex items-center justify-center gap-2.5">
            <span className="h-px w-7 bg-[#B38A45]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B38A45]">
              The Varta Journey
            </span>
            <span className="h-px w-7 bg-[#B38A45]" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#173b25]">
            From Our Gardens <span className="italic text-[#B38A45]">To Your Cup</span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#706e65]">
            Every cup has a journey. From the misty tea gardens of Assam to the quiet moments at home, discover the care behind every Varta blend.
          </p>

        </motion.div>


        {/* =========================================
            DESKTOP JOURNEY
        ========================================== */}

        <div className="relative hidden lg:block">

          {/* Connecting line */}

          <div className="absolute left-[10%] right-[10%] top-[43%] h-px bg-[#b49a62]/40" />

          <div className="relative grid grid-cols-5 gap-6">

            {JOURNEY_STEPS.map((step, index) => (

              <motion.div
                key={step.number}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                }}
                className="group relative"
              >

                {/* =================================
                    IMAGE
                ================================== */}

                <div className="relative">

                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e7dfd0]">

                    <img
                      src={step.image}
                      alt={step.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                    />

                    {/* Image overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#102c1c]/70 via-transparent to-transparent opacity-70" />

                    {/* Number */}

                    <div className="absolute left-5 top-5">

                      <span className="font-serif text-3xl font-medium text-white/90">
                        {step.number}
                      </span>

                    </div>

                    {/* Bottom label */}

                    <div className="absolute bottom-5 left-5 right-5">

                      <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#e5d29d]">
                        {step.shortTitle}
                      </span>

                    </div>

                  </div>


                  {/* Connection point */}

                  <div className="absolute -bottom-[11px] left-1/2 z-10 -translate-x-1/2">

                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-[#b49a62] bg-[#f5f0e6]">

                      <div className="h-2 w-2 rounded-full bg-[#8f743d]" />

                    </div>

                  </div>

                </div>


                {/* =================================
                    CONTENT
                ================================== */}

                <div className="pt-9">

                  <div className="mb-2 flex items-center gap-2">

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9a7d43]">
                      Step {step.number}
                    </span>

                    {index < JOURNEY_STEPS.length - 1 && (
                      <ArrowRight
                        size={12}
                        className="text-[#a58a52]"
                      />
                    )}

                  </div>


                  <h3 className="font-serif text-xl font-medium text-[#173b25]">
                    {step.title}
                  </h3>


                  <p className="mt-3 max-w-[230px] text-[11px] leading-6 text-[#77736a]">
                    {step.desc}
                  </p>

                </div>

              </motion.div>

            ))}

          </div>

        </div>


        {/* =========================================
            TABLET / MOBILE JOURNEY
        ========================================== */}

        <div className="lg:hidden">

          <div className="relative">

            {/* Vertical line */}

            <div className="absolute bottom-5 left-[18px] top-5 w-px bg-[#b49a62]/40" />

            <div className="space-y-10">

              {JOURNEY_STEPS.map((step, index) => (

                <motion.div
                  key={step.number}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                  }}
                  className="relative flex gap-5"
                >

                  {/* Timeline point */}

                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b49a62] bg-[#f5f0e6]">

                    <div className="h-2.5 w-2.5 rounded-full bg-[#8f743d]" />

                  </div>


                  {/* Content */}

                  <div className="min-w-0 flex-1">

                    <div className="relative aspect-[16/9] overflow-hidden bg-[#e7dfd0]">

                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#102c1c]/70 to-transparent" />

                      <div className="absolute bottom-4 left-4">

                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e5d29d]">
                          {step.number} — {step.shortTitle}
                        </span>

                      </div>

                    </div>


                    <div className="pt-4">

                      <h3 className="font-serif text-2xl font-medium text-[#173b25]">
                        {step.title}
                      </h3>

                      <p className="mt-2 max-w-lg text-xs leading-6 text-[#77736a]">
                        {step.desc}
                      </p>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </div>


        {/* =========================================
            BOTTOM STATEMENT
        ========================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="mx-auto mt-10 max-w-2xl border-t border-[#b49a62]/30 pt-6 text-center md:mt-12"
        >

          <div className="mb-4 flex justify-center">
            <Leaf
              size={18}
              strokeWidth={1.2}
              className="text-[#8f743d]"
            />
          </div>

          <p className="font-serif text-xl italic leading-relaxed text-[#173b25] sm:text-2xl">
            "Good tea begins with good leaves.
            <br />
            Great tea begins with a story."
          </p>

          <span className="mt-4 block text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8a877d]">
            The Varta Philosophy
          </span>

        </motion.div>

      </div>

    </section>
  );
};

export default TeaJourney;