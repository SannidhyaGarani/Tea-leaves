import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeaJourney = () => {
  // Custom uploaded tea background images
  const DESKTOP_BG_IMAGE = 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787072932/Gemini_Generated_Image_w1rxb2w1rxb2w1rx_j7ldf0.png';
  const MOBILE_BG_IMAGE = 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787930030/Gemini_Generated_Image_hpvkxhpvkxhpvkxh_nnvyoo.png';

  return (
    <section className="relative w-full min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] flex items-center overflow-hidden font-sans">
      {/* Mobile Background Image (Fixed Attachment) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed sm:hidden"
        style={{ 
          backgroundImage: `url(${MOBILE_BG_IMAGE})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      {/* Desktop Background Image (Fixed Attachment) */}
      <div 
        className="absolute inset-0 hidden sm:block bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url(${DESKTOP_BG_IMAGE})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      {/* Left Dark Forest Green Gradient Overlay Block */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#173b25] via-[#173b25]/90 sm:via-[#173b25]/80 to-transparent w-full sm:w-[75%] lg:w-[55%] pointer-events-none z-0" />

      {/* Soft Bottom Mobile Gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#173b25]/50 via-transparent to-transparent sm:hidden pointer-events-none z-0" />

      {/* Left Editorial Text Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[280px] sm:max-w-md text-left"
        >
          {/* Poetic Typography (Compact) */}
          <div className="space-y-0 sm:space-y-0.5 font-serif text-sm sm:text-2xl md:text-3xl font-medium leading-[1.2] text-[#FAF5EC] tracking-tight">
            <p>Ek Cup Chai</p>
            <p>Ek Kahani</p>
            <p>Ek Muskaan</p>
            <p>Ek Varta</p>
          </div>

          {/* Gold Leaf Emblem Divider */}
          <div className="flex items-center gap-2 my-3 sm:my-4">
            <span className="w-6 sm:w-10 h-[1px] bg-[#B38A45]" />
            <Leaf size={13} fill="#B38A45" className="text-[#B38A45]" />
            <span className="w-6 sm:w-10 h-[1px] bg-[#B38A45]" />
          </div>

          {/* Read Our Story CTA Button */}
          <Link
            to="/about"
            className="inline-flex items-center justify-center border border-[#FAF5EC]/80 hover:border-[#B38A45] bg-transparent hover:bg-[#FAF5EC] text-[#FAF5EC] hover:text-[#173b25] px-5 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.22em] rounded-xs transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <span>READ OUR STORY</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TeaJourney;