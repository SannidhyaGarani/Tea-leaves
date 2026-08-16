import React, { useEffect, useState } from 'react';
import MiniLoader from '../components/MiniLoader';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { db } from '../components/Firebase';
import { doc, onSnapshot, collection, getDocs, query, limit } from 'firebase/firestore';
import { useAuth } from '../components/useAuth';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Star, Truck, Check, Sparkles, ShieldCheck, Flame, Leaf, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from "../components/StoreProvider";

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState('description');

  const { addToCart, addToWishlist, removeFromWishlist, wishlist, cart } = useStore();
  const isWishlisted = wishlist?.some(item => item.id === id);
  const currentCartId = selectedSize ? `${id}-${selectedSize.size}` : id;
  const isInCart = cart?.some(item => (item.cartId || item.id) === currentCartId);

  // Per-variant out-of-stock: check selected variant's stock first
  const variantStock = selectedSize?.stock ?? product?.stock ?? 999;
  const isOutOfStock = variantStock === 0 || product?.stock_status === 'Out of Stock';

  const handleSelectVariant = (sp) => {
    setSelectedSize(sp);
    if (sp?.size) {
      const params = new URLSearchParams(searchParams);
      params.set("variant", sp.size);
      setSearchParams(params, { replace: true });
    }
  };

  useEffect(() => {
    if (product) {
      if (isOutOfStock) {
        setQuantity(0);
      } else {
        setQuantity(1);
      }
    }
  }, [product, isOutOfStock]);

  // Live onSnapshot listener — stock updates without refresh
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const unsub = onSnapshot(doc(db, "products", id), async (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setProduct(data);

        // Check if a URL variant parameter is present (e.g. ?variant=500g)
        const urlVariant = searchParams.get("variant") || searchParams.get("size");

        setSelectedSize(prev => {
          if (prev) {
            const refreshed = (data.size_prices || []).find(sp => sp.size === prev.size);
            return refreshed || prev;
          }
          if (data.size_prices && Array.isArray(data.size_prices) && data.size_prices.length > 0) {
            if (urlVariant) {
              const matchedUrlVariant = data.size_prices.find(sp =>
                String(sp.size).toLowerCase().replace(/\s+/g, '') === String(urlVariant).toLowerCase().replace(/\s+/g, '')
              );
              if (matchedUrlVariant) return matchedUrlVariant;
            }
            return data.size_prices[0];
          }
          return null;
        });

        // Fetch related products once (on first load)
        if (!relatedProducts.length) {
          try {
            const q = query(collection(db, "products"), limit(6));
            const snap = await getDocs(q);
            const related = snap.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(p => p.id !== id)
              .slice(0, 4);
            setRelatedProducts(related);
          } catch (_) {}
        }
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Product detail listener error:", err);
      setProduct(null);
      setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => unsub();
  }, [id]);


  const triggerToast = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const addToCollection = async (type) => {
    if (!product) return;
    if (type === 'cart') {
      const cartItemId = selectedSize ? `${product.id}-${selectedSize.size}` : product.id;
      if (cart?.some(item => (item.cartId || item.id) === cartItemId)) {
        navigate('/cart');
        return;
      }
      for (let i = 0; i < quantity; i++) {
        await addToCart(product, selectedSize);
      }
      triggerToast(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to your bag!`);
    } else {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        triggerToast("Removed from wishlist!");
      } else {
        await addToWishlist(product);
        triggerToast("Added to wishlist!");
      }
    }
  };

  if (loading) {
    return <MiniLoader message="Preparing Tea Details..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex flex-col items-center justify-center text-center p-6 pt-24">
        <div className="w-16 h-16 rounded-full bg-zinc-200 flex items-center justify-center mb-4 text-zinc-600">
          <Leaf size={28} />
        </div>
        <h3 className="text-lg font-bold tracking-wider uppercase text-zinc-900 mb-2">Tea Product Not Found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mb-6">
          The requested tea product could not be loaded or may have been removed.
        </p>
        <Link to="/shop" className="px-8 py-3 bg-[#0a140f] text-white font-semibold text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-lg shadow-md flex items-center gap-2">
          <ArrowLeft size={14} /> Return To Tea Collection
        </Link>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop'];

  const currentImageIndex = Math.min(selectedImage, images.length - 1);
  const currentPrice = selectedSize?.price || product.price || 0;
  const currentOriginalPrice = selectedSize?.original_price || product.original_price || 0;

  const discountPercent = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const accordions = [
    { id: 'description', label: 'Tasting Notes & Description' },
    { id: 'size', label: 'Recommended Brewing Guide' },
    { id: 'spec', label: 'Tea Specifications & Origin' },
    { id: 'shipping', label: 'Shipping & Delivery' },
    { id: 'return', label: 'Vaarta Chai Freshness Guarantee' }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-900 pt-[80px] pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 10, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 bg-[#0a140f] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-[#c9a962]/40 min-w-[280px]"
          >
            <ShoppingBag size={16} className="text-[#c9a962] shrink-0" />
            <p className="text-[11px] font-semibold uppercase tracking-wider flex-1 text-zinc-100">{feedbackMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-900 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 self-start space-y-4 z-10">
            <div className="aspect-[4/5] bg-white overflow-hidden relative group border border-zinc-200 rounded-2xl shadow-sm">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-[#0a140f] text-[#c9a962] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-[#c9a962]/40 shadow">
                    SAVE {discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-[4/5] overflow-hidden rounded-xl transition-all duration-300 bg-white border-2 cursor-pointer ${
                      currentImageIndex === idx ? 'border-black ring-2 ring-black/20 opacity-100' : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover object-center" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col space-y-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[9px] tracking-widest font-black uppercase px-3 py-1 bg-[#12221a] text-[#c9a962] rounded-full border border-[#1b3327]">
                  {product.category || "Artisanal Tea"}
                </span>
                {product.caffeine && (
                  <span className="text-[9px] tracking-widest font-bold uppercase px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200 flex items-center gap-1">
                    <Flame size={11} className="text-[#b8860b]" /> {product.caffeine}
                  </span>
                )}
                <span className="text-[9px] tracking-widest font-bold uppercase px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex items-center gap-1">
                  <Star size={11} fill="currentColor" strokeWidth={0} className="text-amber-500" /> {product.rating || 4.8} Stars
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-zinc-900 uppercase font-serif mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Price Display */}
              <div className="flex items-baseline gap-3.5 mb-2">
                <span className="text-3xl font-light tracking-widest text-zinc-900 font-mono">
                  ₹{currentPrice?.toLocaleString()}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-base text-zinc-400 line-through font-mono">
                    ₹{currentOriginalPrice?.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 tracking-wide">Taxes included. Fast dispatch from Assam estates.</p>

              {/* Stock Status Badge */}
              <div className="mt-4 flex items-center gap-3">
                <span className={`text-[10px] tracking-widest font-black uppercase px-3 py-1 rounded-md border ${
                  isOutOfStock 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : (variantStock <= 5)
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  {isOutOfStock 
                    ? '• Out of Stock' 
                    : (variantStock <= 5)
                      ? `• Low Stock: Only ${variantStock} left`
                      : '• In Stock & Ready to Ship'
                  }
                </span>
                {variantStock > 0 && variantStock < 999 && (
                  <span className="text-[11px] text-zinc-500 font-medium">
                    ({variantStock} packs available)
                  </span>
                )}
              </div>
            </div>

            {/* Flavor Notes (if present) */}
            {product.flavors && (
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-900 block mb-1">
                  Flavor & Aroma Profile
                </span>
                <p className="text-xs text-amber-950 font-medium">{product.flavors}</p>
              </div>
            )}

            {/* Weight Variants Selector */}
            {product.size_prices && Array.isArray(product.size_prices) && product.size_prices.length > 0 && (
              <div className="border-t border-zinc-200 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Select Pack Weight Variant</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Current: {selectedSize?.size || product.size_prices[0]?.size}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.size_prices.map((sp, idx) => {
                    const spStock = sp.stock ?? 999;
                    const spOutOfStock = spStock === 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => !spOutOfStock && handleSelectVariant(sp)}
                        disabled={spOutOfStock}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-2 ${
                          spOutOfStock
                            ? 'border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed'
                            : selectedSize?.size === sp.size
                              ? 'border-black bg-black text-white shadow-md cursor-pointer'
                              : 'border-zinc-300 bg-white text-zinc-800 hover:border-black cursor-pointer'
                        }`}
                      >
                        <span className={spOutOfStock ? 'line-through' : ''}>{sp.size}</span>
                        <span className={`text-[10px] font-mono ${selectedSize?.size === sp.size ? 'text-[#c9a962]' : spOutOfStock ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          ₹{sp.price}
                        </span>
                        {spOutOfStock && <span className="text-[8px] text-red-400 font-black uppercase">OOS</span>}
                        {!spOutOfStock && spStock <= 5 && (
                          <span className="text-[8px] text-amber-500 font-black uppercase">{spStock} left</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions: Quantity + Cart + Buy Now */}
            <div className="border-t border-zinc-200 pt-5 space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className={`flex items-center justify-between border rounded-xl ${isOutOfStock ? 'border-zinc-200 opacity-40 pointer-events-none' : 'border-zinc-300'} h-12 px-2 w-32 bg-white shadow-sm`}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-black transition-colors disabled:opacity-20 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold text-zinc-900 w-6 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(prev => Math.min(variantStock || 999, prev + 1))} 
                    disabled={isOutOfStock || quantity >= (variantStock || 999)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-black transition-colors disabled:opacity-20 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => addToCollection('wishlist')}
                  className="flex-1 h-12 flex items-center justify-center border border-zinc-300 hover:border-black bg-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-zinc-800">
                    <Heart size={15} fill={isWishlisted ? '#111111' : 'none'} className={isWishlisted ? 'text-black' : 'text-zinc-500'} />
                    {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                  </div>
                </button>
              </div>

              {/* Delivery Assurance */}
              <div className="flex items-center gap-2.5 text-xs text-zinc-600 bg-white p-3 rounded-xl border border-zinc-200/80">
                <Truck size={16} className="text-[#b8860b] shrink-0" />
                <span>Express Shipping: Priority dispatch within 24-48 hours across India</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => !isOutOfStock && addToCollection('cart')}
                  disabled={isOutOfStock}
                  className={`w-full h-13 rounded-xl border-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'border-zinc-200 text-zinc-400 bg-transparent cursor-not-allowed'
                      : 'border-black text-black bg-transparent hover:bg-black hover:text-white shadow-md'
                  }`}
                >
                  <ShoppingBag size={16} />
                  {isOutOfStock ? 'Sold Out' : isInCart ? 'View Shopping Bag' : 'Add to Bag'}
                </button>

                {!isOutOfStock && (
                  <button 
                    onClick={async () => {
                      const cartItemId = selectedSize ? `${product.id}-${selectedSize.size}` : product.id;
                      if (!cart?.some(item => (item.cartId || item.id) === cartItemId)) {
                        await addToCart(product, selectedSize);
                      }
                      if (!user) {
                        navigate(`/signup?redirect=${encodeURIComponent('/checkout')}`);
                      } else {
                        navigate('/checkout');
                      }
                    }}
                    className="w-full h-13 bg-[#0a140f] text-[#c9a962] font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#c9a962]/30"
                  >
                    Buy Now Directly
                  </button>
                )}
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-zinc-200 pt-3 divide-y divide-zinc-200">
              {accordions.map((acc) => (
                <div key={acc.id}>
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-4 text-left group cursor-pointer"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 group-hover:text-black transition-colors">
                      {acc.label}
                    </span>
                    <ChevronRight size={14} className={`text-zinc-400 transition-transform duration-300 ease-out ${activeAccordion === acc.id ? 'rotate-90 text-black' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {activeAccordion === acc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 pt-1 text-xs text-zinc-600 leading-relaxed space-y-2">
                          {acc.id === 'description' && (
                            <p>{product.description || 'Premium handpicked single origin tea leaves harvested for exceptional aroma, rich amber brew, and soothing taste.'}</p>
                          )}
                          {acc.id === 'size' && (
                            <div className="space-y-1">
                              <p>• <strong>Water Temp:</strong> 90°C - 100°C fresh boiling water</p>
                              <p>• <strong>Steeping Time:</strong> 3–5 minutes for full leaf extraction</p>
                              <p>• <strong>Serving:</strong> Enjoy pure black, or add milk & raw sugar to taste</p>
                            </div>
                          )}
                          {acc.id === 'spec' && (
                            <div className="space-y-1">
                              <p><strong className="text-zinc-900">Ingredients:</strong> {product.ingredients || '100% Pure Assam Single Origin Tea Leaves'}</p>
                              <p><strong className="text-zinc-900">Caffeine Strength:</strong> {product.caffeine || 'Standard Tea Extract'}</p>
                              <p><strong className="text-zinc-900">Storage:</strong> Keep in an airtight jar in a cool, dry place.</p>
                            </div>
                          )}
                          {acc.id === 'shipping' && (
                            <p>Free standard shipping on orders above ₹999. Packaged in sealed foil pouches for guaranteed estate freshness.</p>
                          )}
                          {acc.id === 'return' && (
                            <p>100% Freshness Guarantee: If you receive damaged packaging, we provide an immediate free replacement within 7 days.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-zinc-200 pt-14">
            <div className="pb-8 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b8860b] block mb-2">Curated Recommendations</span>
              <h2 className="text-2xl font-light text-zinc-900 uppercase tracking-widest font-serif">You May Also Enjoy</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item) => {
                const itemDiscount = item.original_price && item.original_price > item.price
                  ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                  : 0;
                return (
                  <Link key={item.id} to={`/product/${item.id}`} className="group bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all">
                    <div className="relative aspect-[3/4] bg-zinc-50 rounded-xl mb-3 overflow-hidden border border-zinc-100">
                      <img
                        src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      {itemDiscount > 0 && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-[#0a140f] text-[#c9a962] text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#c9a962]/40">
                            -{itemDiscount}%
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs font-bold tracking-wide uppercase text-zinc-800 truncate mb-1 group-hover:text-[#b8860b] transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 font-mono">₹{item.price?.toLocaleString()}</span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-[10px] text-zinc-400 line-through font-mono">₹{item.original_price?.toLocaleString()}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;