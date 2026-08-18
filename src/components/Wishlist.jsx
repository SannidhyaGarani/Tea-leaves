import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "./Home/PageHeader";
import { useStore } from "./StoreProvider";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart, loading, products } = useStore();
  const navigate = useNavigate();
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Derive live stock from the global products store
  const getStockInfo = (itemId) => {
    const liveProduct = products.find(p => p.id === itemId);
    if (liveProduct) {
      const firstVariantStock = liveProduct.size_prices?.[0]?.stock ?? liveProduct.stock ?? 999;
      return {
        stock: firstVariantStock,
        stock_status: liveProduct.stock_status || 'In Stock',
      };
    }
    return { stock: 999, stock_status: 'In Stock' };
  };

  const triggerToast = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleMoveToCart = async (product) => {
    const defaultSize = product.size_prices && product.size_prices.length > 0
      ? (product.size_prices.find(s => s.size?.toUpperCase() === 'L') || product.size_prices[0])
      : null;
    await addToCart(product, defaultSize);
    await removeFromWishlist(product.id);
    triggerToast("Moved to your bag!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf5ec] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border border-[#B38A45] border-t-[#173b25] rounded-full animate-spin" />
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#173b25]">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf5ec] font-sans">
      <PageHeader
        title="Wishlist"
        subtitle="Your saved tea blends and favorites"
        breadcrumbItems={[{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }, { label: 'Wishlist' }]}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14 py-10 md:py-14">
        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 sm:py-20 max-w-md mx-auto bg-[#f7f2e8] border border-[#e8dfcf] p-8 shadow-md rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Heart size={24} fill="#B38A45" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#173b25] mb-1">Your Wishlist Is Empty</h3>
            <p className="text-xs text-[#524f46] font-medium leading-relaxed mb-6">Save tea blends you love and come back to them anytime.</p>
            <Link to="/shop" className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all shadow-md">
              <span>EXPLORE COLLECTION</span> <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#B38A45]/20">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#173b25]">
                {wishlist.length} {wishlist.length === 1 ? 'TEA ITEM' : 'TEA ITEMS'} SAVED
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-5 md:gap-y-8">
              {wishlist.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${idx}`}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.4 }}
                  className="group relative flex flex-col bg-[#f7f2e8] border border-[#e8dfcf] hover:border-[#B38A45] p-3.5 shadow-2xs hover:shadow-md transition-all rounded-2xl"
                >
                  <button
                    onClick={() => { removeFromWishlist(item.id); triggerToast("Removed from wishlist"); }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#faf5ec] border border-[#e2d7c5] text-[#173b25] hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-all duration-300 shadow-2xs"
                  >
                    <X size={13} strokeWidth={2} />
                  </button>

                  {
                    (() => {
                      const stockInfo = getStockInfo(item.id);
                      const isOutOfStock = stockInfo.stock === 0 || stockInfo.stock_status === "Out of Stock";

                      return (
                        <>
                          <div onClick={() => navigate(`/product/${item.id}`)} className="relative w-full aspect-[3/4] overflow-hidden bg-[#FAF5EC] cursor-pointer border border-[#e2d7c5] rounded-xl p-2">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                            {isOutOfStock && (
                              <div className="absolute inset-0 z-20 bg-[#173b25]/75 backdrop-blur-xs flex items-center justify-center">
                                <span className="bg-[#FAF5EC] text-[#173b25] font-extrabold uppercase text-[9px] tracking-widest px-3 py-1.5 rounded">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 flex-grow flex flex-col">
                            {item.category && <span className="text-[9px] uppercase tracking-[0.2em] text-[#B38A45] font-extrabold mb-0.5">{item.category}</span>}
                            <h3 onClick={() => navigate(`/product/${item.id}`)}
                              className="font-serif text-sm font-medium text-[#173b25] leading-snug mb-2 group-hover:text-[#B38A45] transition-colors cursor-pointer line-clamp-2"
                            >{item.name}</h3>
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e8dfcf]">
                              <span className="text-sm font-bold text-[#173b25]">₹{Number(item.price).toLocaleString("en-IN")}</span>
                              <button 
                                onClick={() => !isOutOfStock && handleMoveToCart(item)}
                                disabled={isOutOfStock}
                                className={`w-9 h-9 rounded-md flex items-center justify-center transition-all shadow-2xs ${
                                  isOutOfStock 
                                    ? 'bg-[#faf5ec] text-zinc-300 border border-[#e2d7c5] cursor-not-allowed' 
                                    : 'bg-[#173b25] text-white hover:bg-[#245433]'
                                }`}
                              >
                                <ShoppingBag size={14} strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()
                  }
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {feedbackMessage && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#173b25] text-white px-6 py-3.5 shadow-2xl flex items-center gap-3 border border-[#B38A45] rounded-md"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider whitespace-nowrap">{feedbackMessage}</p>
            <button onClick={() => setFeedbackMessage(null)} className="opacity-60 hover:opacity-100 ml-2"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
