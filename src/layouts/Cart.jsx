import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ShieldCheck, Truck, RotateCcw, ChevronRight, Gift, ArrowRight, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/Home/PageHeader";
import { useStore } from "../components/StoreProvider";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { doc, getDoc } from "firebase/firestore";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGiftNoteOpen, setIsGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const total = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (item.quantity || 1)), 0);
  const [productStocks, setProductStocks] = useState({});

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const stocksMap = {};
        for (const item of cart) {
          const docSnap = await getDoc(doc(db, "products", item.id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            stocksMap[item.id] = {
              stock: data.stock !== undefined ? data.stock : 10,
              stock_status: data.stock_status || "In Stock"
            };
          }
        }
        setProductStocks(stocksMap);
      } catch (err) {
        console.error("Error fetching cart stock:", err);
      }
    };
    if (cart.length > 0) {
      fetchStocks();
    }
  }, [cart]);

  const hasOutOfStockItem = cart.some(item => {
    const stockInfo = productStocks[item.id];
    if (!stockInfo) return false;
    return stockInfo.stock === 0 || stockInfo.stock_status === "Out of Stock" || item.quantity > stockInfo.stock;
  });

  const handleCheckout = () => {
    if (!user) navigate(`/signup?redirect=${encodeURIComponent('/checkout')}`);
    else navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf5ec] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border border-[#B38A45] border-t-[#173b25] rounded-full animate-spin" />
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#173b25]">Loading your bag...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf5ec] font-sans">
      <PageHeader
        title="Shopping Bag"
        subtitle="Review your artisanal tea selections before checkout"
        breadcrumbItems={[{ label: 'Home', path: '/' }, { label: 'Shop', path: '/shop' }, { label: 'Cart' }]}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-8 w-full">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 sm:py-20 max-w-md mx-auto bg-[#f7f2e8] border border-[#e8dfcf] p-8 shadow-md rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#173b25] mb-1">Your Bag Is Empty</h3>
                  <h4 
                    className="text-lg font-normal text-[#173b25] mt-1 mb-3"
                    style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
                  >
                    आपकी टोकरी खाली है
                  </h4>
                  <p className="text-xs text-[#524f46] font-medium leading-relaxed mb-6">Explore our artisanal tea collection and find your favorite daily brew.</p>
                  <Link to="/shop" className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all shadow-md">
                    <span>EXPLORE SHOP</span> <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#B38A45]/20">
                    <h2 className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#173b25]">
                      {cart.length} {cart.length === 1 ? 'TEA BLEND' : 'TEA BLENDS'} IN BAG
                    </h2>
                  </div>
                  <motion.div layout className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {cart.map((item, idx) => {
                        const stockInfo = productStocks[item.id] || { stock: 999, stock_status: "In Stock" };
                        const isOutOfStock = stockInfo.stock === 0 || stockInfo.stock_status === "Out of Stock";

                        return (
                          <motion.div
                          key={`${item.cartId || item.id}-${idx}`}
                          layout
                          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.4 }}
                          className="group bg-[#f7f2e8] border border-[#e8dfcf] hover:border-[#B38A45] p-4 flex flex-col sm:flex-row items-center gap-4 transition-all shadow-2xs rounded-2xl"
                        >
                          <Link to={`/product/${item.id}`} className="w-20 h-24 bg-[#FAF5EC] shrink-0 overflow-hidden border border-[#e2d7c5] rounded-xl p-1">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </Link>
                          <div className="flex-1 text-center sm:text-left space-y-0.5">
                            {item.category && <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#B38A45]">{item.category}</span>}
                            <h3 className="font-serif text-base font-medium text-[#173b25] group-hover:text-[#B38A45] transition-colors leading-tight">{item.name}</h3>
                            {item.size && <p className="text-[11px] font-semibold text-[#827963] uppercase tracking-wider">Pack Weight: {item.size}</p>}
                            <div className="flex flex-wrap items-center gap-2 mt-1 sm:justify-start justify-center">
                              <p className="text-sm font-bold text-[#173b25]">₹{Number(item.price).toLocaleString("en-IN")}</p>
                              {isOutOfStock ? (
                                <span className="bg-red-500/10 border border-red-500/20 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider">Out of Stock</span>
                              ) : item.quantity > stockInfo.stock ? (
                                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-700 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider">Only {stockInfo.stock} left</span>
                              ) : null}
                            </div>
                          </div>
                          <div className="flex items-center bg-[#faf5ec] border border-[#e2d7c5] rounded-md h-9">
                            <button 
                              onClick={() => updateQuantity(item.cartId || item.id, -1)} 
                              disabled={item.quantity <= 1}
                              className="w-8 h-full flex items-center justify-center text-[#173b25] hover:text-[#B38A45] transition-colors text-sm font-bold disabled:opacity-20"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-[13px] font-bold text-[#173b25]">{item.quantity || 1}</span>
                            <button 
                              onClick={() => {
                                if (item.quantity < stockInfo.stock) {
                                  updateQuantity(item.cartId || item.id, 1);
                                }
                              }} 
                              disabled={isOutOfStock || item.quantity >= stockInfo.stock}
                              className="w-8 h-full flex items-center justify-center text-[#173b25] hover:text-[#B38A45] transition-colors text-sm font-bold disabled:opacity-20"
                            >
                              +
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.cartId || item.id)}
                            className="p-2.5 bg-[#faf5ec] text-[#524f46] border border-[#e2d7c5] rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <aside className="lg:col-span-4 w-full sticky top-28">
              <div className="bg-[#f7f2e8] border border-[#e8dfcf] p-6 shadow-md rounded-3xl">
                <h2 className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#173b25] mb-5 pb-3 border-b border-[#B38A45]/20">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-xs text-[#524f46] font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#173b25]">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#524f46] font-medium">
                    <span>Garden Direct Shipping</span>
                    <span className="text-[#173b25] font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#524f46] font-medium">
                    <span>GST (Included)</span>
                    <span className="font-bold text-[#173b25]">₹0</span>
                  </div>

                  {/* Gift Note */}
                  <div className="pt-2 border-t border-[#e8dfcf]">
                    <button onClick={() => setIsGiftNoteOpen(!isGiftNoteOpen)}
                      className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#B38A45] hover:text-[#173b25] transition-colors"
                    >
                      <Gift size={13} />
                      {isGiftNoteOpen ? 'Remove gift note' : 'Add a gift note'}
                    </button>
                    <AnimatePresence>
                      {isGiftNoteOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-2">
                          <textarea value={giftNote} onChange={(e) => setGiftNote(e.target.value)}
                            placeholder="Write your personal tea gift message..." maxLength={180}
                            className="w-full h-16 bg-[#faf5ec] border border-[#e2d7c5] rounded-md p-2.5 text-xs text-[#173b25] placeholder-[#827963] focus:outline-none focus:border-[#173b25] resize-none"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 mt-2 border-t border-dashed border-[#B38A45]/30 flex justify-between items-end">
                    <span className="text-[10px] font-extrabold text-[#173b25] uppercase tracking-[0.2em]">Total</span>
                    <span className="text-2xl font-serif font-bold text-[#173b25]">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button 
                  onClick={() => !hasOutOfStockItem && handleCheckout()}
                  disabled={hasOutOfStockItem}
                  className={`w-full py-4 font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all duration-300 flex items-center justify-center gap-2 mb-5 cursor-pointer shadow-md ${
                    hasOutOfStockItem
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-[#173b25] hover:bg-[#245433] text-white hover:shadow-lg'
                  }`}
                >
                  {hasOutOfStockItem ? 'Remove Out of Stock Items' : 'PROCEED TO CHECKOUT'} <ChevronRight size={15} />
                </button>

                <div className="space-y-3 pt-4 border-t border-[#e8dfcf]">
                  {[
                    { icon: ShieldCheck, title: 'Secure Checkout', sub: '256-bit encryption' },
                    { icon: Truck, title: 'Garden Fresh Shipping', sub: 'Direct from Assam' },
                    { icon: RotateCcw, title: '100% Quality Guarantee', sub: 'Pure Assam CTC & Leaf' },
                  ].map(({ icon: Icon, title, sub }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#faf5ec] border border-[#e2d7c5] flex items-center justify-center text-[#B38A45] shrink-0">
                        <Icon size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-[#173b25] uppercase tracking-wide">{title}</p>
                        <p className="text-[10px] text-[#524f46] font-medium">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;