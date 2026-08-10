import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreProvider';

const PREMIUM_TEAS = [
  {
    id: 'tea_1',
    name: 'Premium CTC Tea',
    subtitle: 'Strong • Kadak • Rich',
    price: 499,
    image:
      'https://res.cloudinary.com/dcjn4y284/image/upload/v1786381088/Gemini_Generated_Image_8p7lxa8p7lxa8p7l_albcws.png',
    tag: 'BESTSELLER',
  },
  {
    id: 'tea_2',
    name: 'Premium Leaf Tea',
    subtitle: 'Smooth • Aromatic • Pure',
    price: 599,
    image:
      'https://res.cloudinary.com/dcjn4y284/image/upload/v1786381104/Gemini_Generated_Image_dxr8v3dxr8v3dxr8_caaglu.png',
    tag: 'SIGNATURE',
  },
  {
    id: 'tea_3',
    name: 'Masala Tea',
    subtitle: 'Perfect Blend of Spices',
    price: 549,
    image:
      'https://res.cloudinary.com/dcjn4y284/image/upload/v1786381086/Gemini_Generated_Image_mhgaehmhgaehmhga_ac4xjp.png',
    tag: 'FAVOURITE',
  },
  {
    id: 'tea_4',
    name: 'Elaichi Tea',
    subtitle: 'Fragrant • Light • Refreshing',
    price: 549,
    image:
      'https://res.cloudinary.com/dcjn4y284/image/upload/v1786381086/Gemini_Generated_Image_9g103v9g103v9g10_x6kukq.png',
    tag: 'POPULAR',
  },
  {
    id: 'tea_5',
    name: 'Gift Collection',
    subtitle: 'Perfect for Every Occasion',
    price: 899,
    image:
      'https://res.cloudinary.com/dcjn4y284/image/upload/v1786381086/Gemini_Generated_Image_5amn675amn675amn_yqzczh.png',
    tag: 'GIFTING',
  },
];

const Bestsellers = () => {
  const navigate = useNavigate();

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist,
  } = useStore();

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleWishlistToggle = (e, tea) => {
    e.stopPropagation();

    const isWishlisted = wishlist.some(
      (item) => item.id === tea.id
    );

    if (isWishlisted) {
      removeFromWishlist(tea.id);
      showToast(`Removed ${tea.name} from wishlist`);
    } else {
      addToWishlist(tea);
      showToast(`Added ${tea.name} to wishlist`);
    }
  };

  const handleCartAdd = (e, tea) => {
    e.stopPropagation();

    addToCart(tea, null);
    showToast(`${tea.name} added to cart`);
  };

  return (
    <section className="relative overflow-hidden bg-[#f8f3e9] py-12 md:py-16">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#dfe8d8]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#eadcc4]/50 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* =========================
            SECTION HEADER
        ========================== */}
        <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">

            {/* Eyebrow */}
            <div className="mb-2.5 flex items-center gap-2.5">
              <span className="h-px w-7 bg-[#B38A45]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B38A45]">
                Our Collection
              </span>
              <span className="h-px w-7 bg-[#B38A45]" />
            </div>

            {/* Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#173b25]">
              Explore Our <span className="italic text-[#B38A45]">Premium Teas</span>
            </h2>

            <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-[#6d6b61]">
              Carefully selected leaves, authentic flavours and timeless recipes — crafted to make every cup a little more special.
            </p>
          </div>

          {/* View all */}
          <Link
            to="/shop"
            className="group inline-flex w-fit items-center gap-2 border-b border-[#173b25]/40 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#173b25] transition-all hover:border-[#173b25]"
          >
            <span>View All Collection</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>


        {/* =========================
            PRODUCT GRID
        ========================== */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">

          {PREMIUM_TEAS.map((tea, index) => {

            const isWishlisted = wishlist.some(
              (item) => item.id === tea.id
            );

            return (
              <motion.article
                key={tea.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                onClick={() => navigate(`/product/${tea.id}`)}
                className="group cursor-pointer"
              >

                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden border border-[#ded6c7] bg-[#eee7d9]">

                  {/* Product tag */}
                  <div className="absolute left-3 top-3 z-10">
                    <span className="bg-[#173b25] px-2.5 py-1 text-[8px] font-bold tracking-[0.15em] text-white">
                      {tea.tag}
                    </span>
                  </div>

                  {/* Wishlist */}
                  <button
                    type="button"
                    onClick={(e) =>
                      handleWishlistToggle(e, tea)
                    }
                    aria-label={
                      isWishlisted
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#d9d1c2] bg-[#fffdf8]/90 text-[#173b25] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white"
                  >
                    <Heart
                      size={15}
                      strokeWidth={1.7}
                      fill={
                        isWishlisted
                          ? '#173b25'
                          : 'none'
                      }
                    />
                  </button>

                  {/* Image */}
                  <img
                    src={tea.image}
                    alt={tea.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  {/* Bottom gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Quick add */}
                  <div className="absolute bottom-4 left-3 right-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleCartAdd(e, tea)}
                      className="flex w-full items-center justify-center gap-2 bg-[#173b25] py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#245433]"
                    >
                      <ShoppingCart size={13} />
                      Add To Cart
                    </button>
                  </div>
                </div>


                {/* Product Details */}
                <div className="px-1 pt-4">

                  <div className="flex items-start justify-between gap-2">

                    <div>
                      <h3 className="font-serif text-base font-medium leading-tight text-[#173b25] sm:text-lg">
                        {tea.name}
                      </h3>

                      <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.08em] text-[#888275] sm:text-[10px]">
                        {tea.subtitle}
                      </p>
                    </div>

                  </div>

                  <div className="mt-3 flex items-center justify-between">

                    <span className="text-sm font-semibold text-[#1d2c22]">
                      ₹{tea.price}
                    </span>

                    <button
                      type="button"
                      onClick={(e) =>
                        handleCartAdd(e, tea)
                      }
                      className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#6f5930] transition-colors hover:text-[#173b25] sm:hidden"
                    >
                      Add +
                    </button>

                  </div>

                </div>
              </motion.article>
            );
          })}

        </div>


        {/* =========================
            COLLECTION CTA
        ========================== */}
        <div className="mt-14 flex justify-center md:mt-16">

          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-[#173b25] bg-[#173b25] px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#245433]"
          >
            <Sparkles size={13} />

            <span>Discover The Complete Collection</span>

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>


      {/* =========================
          TOAST
      ========================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.96,
            }}
            className="fixed bottom-6 right-6 z-[100] flex max-w-[calc(100vw-32px)] items-center gap-3 bg-[#173b25] px-5 py-3.5 text-xs font-medium text-white shadow-2xl"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
              <Check
                size={14}
                className="text-[#d8c17b]"
              />
            </span>

            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default Bestsellers;