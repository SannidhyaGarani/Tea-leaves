import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeaJourney = () => {
  // Custom uploaded tea background image
  const BANNER_BG_IMAGE = 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787072932/Gemini_Generated_Image_w1rxb2w1rxb2w1rx_j7ldf0.png';

  return (
    <section className="relative w-full overflow-hidden font-sans py-2 sm:py-6 lg:py-8 bg-[#faf5ec]">
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-xl sm:rounded-3xl overflow-hidden shadow-xl min-h-[190px] sm:min-h-[260px] md:min-h-[310px] flex items-center bg-[#173b25]">
          
          {/* Background Image - High visibility */}
          <img 
            src={BANNER_BG_IMAGE} 
            alt="Ek Cup Chai Ek Kahani Ek Muskaan Ek Varta - Vaarta Chai"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center"
          />

          {/* Left Dark Forest Green Gradient Overlay Block - Scoped to left only for image visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#173b25] via-[#173b25]/90 sm:via-[#173b25]/85 to-transparent w-[72%] sm:w-[60%] lg:w-[45%]" />

          {/* Soft Bottom Mobile Gradient for text legibility without dimming image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#173b25]/30 via-transparent to-transparent sm:hidden" />

          {/* Left Editorial Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 p-4 sm:p-7 md:p-10 lg:p-12 max-w-[260px] sm:max-w-md text-left"
          >
            {/* Poetic Typography (Compact on Mobile) */}
            <div className="space-y-0 sm:space-y-1 font-serif text-sm sm:text-2xl md:text-3xl lg:text-[2.1rem] font-medium leading-[1.2] text-[#FAF5EC] tracking-tight">
              <p>Ek Cup Chai</p>
              <p>Ek Kahani</p>
              <p>Ek Muskaan</p>
              <p>Ek Varta</p>
            </div>

            {/* Gold Leaf Emblem Divider */}
            <div className="flex items-center gap-2 my-2 sm:my-4">
              <span className="w-5 sm:w-10 h-[1px] bg-[#B38A45]" />
              <Leaf size={11} fill="#B38A45" className="text-[#B38A45]" />
              <span className="w-5 sm:w-10 h-[1px] bg-[#B38A45]" />
            </div>

            {/* Read Our Story CTA Button (Compact on Mobile) */}
            <Link
              to="/about"
              className="inline-flex items-center justify-center border border-[#FAF5EC]/80 hover:border-[#B38A45] bg-transparent hover:bg-[#FAF5EC] text-[#FAF5EC] hover:text-[#173b25] px-3.5 sm:px-7 py-1.5 sm:py-3 text-[9px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.22em] rounded-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              <span>READ OUR STORY</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TeaJourney;