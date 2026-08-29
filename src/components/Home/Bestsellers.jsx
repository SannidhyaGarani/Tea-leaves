import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  ArrowRight,
  Check,
  Star,
  Leaf,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../StoreProvider';

const Bestsellers = () => {
  const navigate = useNavigate();

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    products,
    productsLoading,
  } = useStore();

  const [toastMessage, setToastMessage] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const displayProducts = products.slice(0, 4);


  const find250gVariant = (tea) => {
    if (!tea.size_prices || tea.size_prices.length === 0) return null;
    const match250 = tea.size_prices.find(sp => {
      const s = sp.size ? String(sp.size).toLowerCase().replace(/\s+/g, '') : '';
      return s.includes('250g') || s.includes('250gm');
    });
    return match250 || tea.size_prices[0];
  };

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

    const selectedVariant = find250gVariant(tea);
    addToCart(tea, selectedVariant);
    showToast(`${tea.name} (${selectedVariant?.size || 'Default'}) added to bag`);
  };

  return (
    <section className="relative overflow-hidden bg-[#faf5ec] py-8 sm:py-10 lg:py-12 font-sans">
      {/* Background Image (90% Visibility) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="https://res.cloudinary.com/dcjn4y284/image/upload/v1787924155/ChatGPT_Image_Aug_28_2026_07_05_29_PM_td5qkm.png"
          alt=""
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-[#faf5ec]/10" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 z-10">

        {/* =========================
            SECTION HEADER (COMPACT & SHORTER)
        ========================== */}
        <div className="mb-5 sm:mb-6 flex flex-col items-center text-center">
          {/* Main Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-[#173b25] mb-0.5">
            Our <span className="italic text-[#B38A45]">Bestsellers</span>
          </h2>

          {/* Hindi Tagline */}

          {/* Gold Emblem Line Divider */}
          <div className="flex items-center justify-center gap-2.5 my-2">
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
            <div className="text-[#2d5a27]"><Leaf size={13} fill="#2d5a27" /></div>
            <div className="w-10 h-[1px] bg-[#B38A45]/40" />
          </div>

          {/* Paragraph Subtext */}
          <p className="max-w-md text-xs text-[#524f46] font-medium leading-relaxed mb-3">
            Handpicked Assam leaves for rich aroma & authentic taste.
          </p>

          {/* Explore entire collection link */}
          <Link
            to="/shop"
            className="group inline-flex items-center gap-1.5 border-b-2 border-[#173b25] pb-0.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#173b25] transition-all hover:border-[#B38A45] hover:text-[#B38A45]"
          >
            <span>Explore Entire Collection</span>
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* =========================
            PRODUCT GRID OR SKELETON LOADER
        ========================== */}
        {productsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mx-auto">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse flex flex-col justify-between">
                <div className="aspect-[4/5] w-full bg-[#e5decb] mb-3.5 rounded-xl sm:rounded-none" />
                <div className="h-4 bg-[#e5decb] w-3/4 mb-2" />
                <div className="h-3 bg-[#e5decb]/70 w-1/2 mb-4" />
                <div className="h-6 bg-[#e5decb] w-1/3" />
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#fffdf8] border border-[#ded6c7] p-8">
            <p className="text-xs uppercase tracking-widest text-[#173b25] font-bold">
              No Tea Products Available Yet
            </p>
            <p className="text-[11px] text-[#7a786c] mt-1">
              Add tea products in your Admin Panel to showcase them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mx-auto">

            {displayProducts.map((tea, index) => {

              const isWishlisted = wishlist.some(
                (item) => item.id === tea.id
              );

              const isHovered = hoveredCardId === (tea.id || index);

              // 250g variant default or base variant available
              const selectedVariant = find250gVariant(tea);
              const variantName = selectedVariant?.size || (tea.sizes ? tea.sizes.split(',')[0] : '');

              const variantStock = selectedVariant?.stock ?? tea.stock ?? 999;
              const isOutOfStock = variantStock === 0 || tea.stock_status === 'Out of Stock';

              const displayPrice = selectedVariant ? selectedVariant.price : (tea.price || 499);
              const originalPrice = selectedVariant?.original_price || tea.original_price || tea.mrp || Math.round(displayPrice * 1.3);

              const discountPercent = originalPrice > displayPrice
                ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
                : 0;

              const primaryImage = tea.image || tea.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600';
              const secondaryImage = (tea.images && tea.images.length > 1) ? tea.images[1] : primaryImage;
              const currentDisplayImage = isHovered ? secondaryImage : primaryImage;

              const displayTag = tea.tag || tea.category || (index % 2 === 0 ? "BESTSELLER" : "SIGNATURE");
              const rating = tea.rating || (4.7 + (index % 3) * 0.1).toFixed(1);

              return (
                <motion.article
                  key={tea.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  onMouseEnter={() => setHoveredCardId(tea.id || index)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => navigate(`/product/${tea.id}`)}
                  className="group cursor-pointer flex flex-col justify-between bg-[#eee1c9]/95 backdrop-blur-md border border-[#d8c8aa] rounded-2xl p-3 sm:p-3.5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  {/* Top Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#eee7d9] border-0">

                    {/* Product Tag & Discount Badge */}
                    <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1 items-start">
                      <span className="bg-[#173b25] px-2 sm:px-2.5 py-0.5 text-[8px] font-black tracking-[0.16em] text-white uppercase rounded-xs">
                        {displayTag}
                      </span>
                      {discountPercent > 0 && (
                        <span className="bg-[#B38A45] text-white px-1.5 py-0.5 text-[7.5px] font-extrabold tracking-wider uppercase rounded-xs">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, tea)}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                      className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-0 bg-[#fffdf8]/90 text-[#173b25] backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white cursor-pointer shadow-sm"
                    >
                      <Heart
                        size={14}
                        fill={isWishlisted ? '#173b25' : 'none'}
                        className={
                          isWishlisted
                            ? 'text-[#173b25]'
                            : 'text-[#6d6b61] transition-colors group-hover:text-[#173b25]'
                        }
                      />
                    </button>

                    {/* Image */}
                    <img
                      src={currentDisplayImage}
                      alt={tea.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 z-20 bg-black/55 flex items-center justify-center">
                        <span className="bg-[#fffdf8] text-[#173b25] font-black uppercase text-[8.5px] tracking-[0.18em] px-3 py-1.5 rounded-xs">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Rating Overlay */}
                    <div className="absolute bottom-2.5 left-2.5 z-10 bg-[#173b25]/90 text-white backdrop-blur-md px-2 py-0.5 rounded-xs text-[8.5px] font-bold flex items-center gap-1 shadow-sm">
                      <Star size={9} fill="#B38A45" className="text-[#B38A45]" />
                      <span>{rating}</span>
                    </div>

                    {/* Quick Add To Cart Button */}
                    {!isOutOfStock && (
                      <div className="absolute inset-x-2.5 bottom-2.5 z-20 opacity-100 sm:opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => handleCartAdd(e, tea)}
                          className="flex w-full items-center justify-center gap-1.5 bg-[#173b25] py-2 sm:py-2.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-white shadow-lg transition-all duration-300 hover:bg-[#B38A45] cursor-pointer rounded-md"
                        >
                          <ShoppingCart size={12} />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product Info & Pricing */}
                  <div className="mt-2.5 sm:mt-3 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h3 className="font-serif text-sm sm:text-base font-bold tracking-wide text-[#173b25] group-hover:text-[#B38A45] transition-colors line-clamp-1">
                          {tea.name}
                        </h3>
                        {variantName && (
                          <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#B38A45] bg-[#B38A45]/15 px-1.5 py-0.5 rounded-xs border border-[#B38A45]/30 shrink-0">
                            {variantName}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#524f46] line-clamp-1 leading-snug">
                        {tea.subtitle || tea.flavors || tea.category || "Single Origin Assam Tea"}
                      </p>
                    </div>

                    {/* Pricing Bar */}
                    <div className="mt-2.5 sm:mt-3 pt-2.5 flex items-center justify-between border-t border-[#ded6c7]">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-mono text-lg sm:text-xl font-extrabold text-[#173b25]">
                          ₹{displayPrice.toLocaleString()}
                        </span>
                        {originalPrice > displayPrice && (
                          <span className="font-mono text-[11px] text-[#7a786c] line-through">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                        {variantName && (
                          <span className="text-[9.5px] font-mono text-[#524f46] font-semibold">
                            / {variantName}
                          </span>
                        )}
                      </div>

                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#173b25] group-hover:text-[#B38A45] group-hover:translate-x-1 transition-all flex items-center gap-0.5">
                        View &rarr;
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#173b25] px-5 py-3.5 rounded-none text-xs font-semibold tracking-wide text-white shadow-2xl border border-[#B38A45]/40"
          >
            <Check size={16} className="text-[#B38A45]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Bestsellers;