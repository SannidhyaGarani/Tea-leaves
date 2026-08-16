import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, Menu, X, Heart, ShoppingBag, ChevronDown, Instagram, Facebook, MessageCircle, Leaf, ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useStore } from './StoreProvider';
import { db } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';

const DEFAULT_COLLECTIONS = [
  'Premium CTC Tea',
  'Premium Leaf Tea',
  'Masala Tea',
  'Elaichi Tea',
  'Gift Collection'
];

const POPULAR_SEARCHES = [
  'Assam Tea',
  'Masala Chai',
  'Elaichi Tea',
  'CTC Tea'
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [allProducts, setAllProducts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, wishlist } = useStore();

  const isHomePage = location.pathname === '/';
  const isTransparent = false;

  const cartCount = cart ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    setIsSearchActive(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const productsList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(productsList);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    const term = searchQuery.trim();
    setIsSearchActive(false);
    setSearchQuery('');
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  const handleCategorySelect = (col) => {
    setIsShopDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (col === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(col)}`);
    }
  };

  const liveSearchResults = searchQuery.trim()
    ? allProducts.filter(p => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      })
    : [];

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'COLLECTION', path: '/shop', hasDropdown: true },
    // { label: 'GIFT BOX', path: '/shop?category=Gift+Collection' },
    { label: 'OUR STORY', path: '/about' },
    { label: 'TEA JOURNAL', path: '/about' },
    { label: 'CONTACT US', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] font-sans transition-all duration-300">
      {/* ── 1. TOP ANNOUNCEMENT BAR (28-30px slim) ── */}
      <div className="h-[28px] sm:h-[30px] bg-[#173B25] text-[#F7F2E8] text-[9.5px] sm:text-[11px] tracking-wider font-medium px-3 sm:px-4 md:px-10 flex items-center justify-between transition-colors duration-300">
        <div className="hidden sm:block w-24" /> {/* Spacer */}

        <div className="flex-1 text-center flex items-center justify-center gap-1.5 sm:gap-2">
         
          <span>FREE SHIPPING on all prepaid orders above ₹499</span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[#F7F2E8]/80 text-xs">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#B38A45] transition-colors" aria-label="Instagram">
            <Instagram size={13} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#B38A45] transition-colors" aria-label="Facebook">
            <Facebook size={13} />
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-[#B38A45] transition-colors" aria-label="WhatsApp">
            <MessageCircle size={13} />
          </a>
        </div>
      </div>

      {/* ── 2. MAIN NAVBAR ── */}
      <nav 
        className={`transition-all duration-300 ${
          isTransparent 
            ? 'bg-transparent border-b border-white/10 py-4 md:py-5' 
            : 'bg-[#F7F2E8]/95 backdrop-blur-md border-b border-[#EFE6D7] py-3 md:py-3.5 shadow-xs'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">

          {/* Logo (Left) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center gap-2">
              <svg width="38" height="40" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-105">
                <path d="M25 5C15 15 8 28 8 38C8 44 12 48 18 48C26 48 30 38 30 30" stroke={isTransparent ? "#B38A45" : "#173B25"} strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M25 5C35 15 42 28 42 38C42 44 38 48 32 48C24 48 20 38 20 30" stroke={isTransparent ? "#F7F2E8" : "#B38A45"} strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M25 8V44" stroke={isTransparent ? "#B38A45" : "#173B25"} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold tracking-tight leading-none transition-colors duration-300 ${isTransparent ? 'text-[#F7F2E8]' : 'text-[#173B25]'}`} style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                  Vaarta
                </span>
                <span className={`text-xs font-semibold tracking-[0.2em] leading-none mt-0.5 transition-colors duration-300 ${isTransparent ? 'text-[#B38A45]' : 'text-[#173B25]'}`} style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>
                  चाय
                </span>
                <span className={`text-[8px] font-medium tracking-tighter leading-none mt-1 transition-colors duration-300 ${isTransparent ? 'text-[#EFE6D7]/80' : 'text-[#1D2A21]/70'}`}>
                  हर घूंट में छुपी एक कहानी
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path && item.label === 'HOME';

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative py-1"
                    onMouseEnter={() => setIsShopDropdownOpen(true)}
                    onMouseLeave={() => setIsShopDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className={`flex items-center gap-1 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 relative group ${
                        isTransparent 
                          ? 'text-[#F7F2E8] hover:text-[#B38A45]' 
                          : 'text-[#173B25] hover:text-[#B38A45]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={12} className={`transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B38A45] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </button>

                    <AnimatePresence>
                      {isShopDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-52 bg-[#F7F2E8] border border-[#EFE6D7] shadow-xl rounded-xs py-2 z-50 normal-case"
                        >
                          <button
                            onClick={() => handleCategorySelect('All')}
                            className="w-full text-left px-4 py-2 text-xs font-bold text-[#173B25] hover:bg-[#EFE6D7] transition-colors border-b border-[#EFE6D7]"
                          >
                            All Teas
                          </button>
                          {collections.map((col) => (
                            <button
                              key={col}
                              onClick={() => handleCategorySelect(col)}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-[#1D2A21] hover:bg-[#EFE6D7] hover:text-[#173B25] transition-colors"
                            >
                              {col}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative py-1 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 group ${
                    isActive
                      ? 'text-[#B38A45] border-b-2 border-[#B38A45] pb-0.5'
                      : isTransparent
                      ? 'text-[#F7F2E8] hover:text-[#B38A45]'
                      : 'text-[#173B25] hover:text-[#B38A45]'
                  }`}
                >
                  <span>{item.label}</span>
                  {!isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#B38A45] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions (Search, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchActive(!isSearchActive)}
              className={`p-1.5 transition-colors duration-300 ${
                isTransparent 
                  ? 'text-[#F7F2E8] hover:text-[#B38A45]' 
                  : 'text-[#173B25] hover:text-[#B38A45]'
              }`}
              aria-label="Search"
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            {/* Account Icon */}
            <Link 
              to="/account" 
              className={`p-1.5 hidden sm:block transition-colors duration-300 ${
                isTransparent 
                  ? 'text-[#F7F2E8] hover:text-[#B38A45]' 
                  : 'text-[#173B25] hover:text-[#B38A45]'
              }`}
              aria-label="Account"
            >
              <User size={19} strokeWidth={1.8} />
            </Link>

            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className={`p-1.5 relative transition-colors duration-300 group ${
                isTransparent 
                  ? 'text-[#F7F2E8] hover:text-[#B38A45]' 
                  : 'text-[#173B25] hover:text-[#B38A45]'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-[#B38A45] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <Link 
              to="/cart" 
              className={`p-1.5 relative transition-colors duration-300 group ${
                isTransparent 
                  ? 'text-[#F7F2E8] hover:text-[#B38A45]' 
                  : 'text-[#173B25] hover:text-[#B38A45]'
              }`}
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={19} strokeWidth={1.8} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-[#173B25] text-[#F7F2E8] text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-1.5 ml-1 transition-colors duration-300 ${
                isTransparent ? 'text-[#F7F2E8]' : 'text-[#173B25]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </nav>

      {/* ── 3. SEARCH OVERLAY (Compact & Premium) ── */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full w-full bg-[#F7F2E8]/98 backdrop-blur-xl border-b border-[#EFE6D7] px-4 sm:px-8 py-3.5 z-[90] shadow-2xl"
          >
            <div className="max-w-3xl mx-auto">
              {/* Search Bar + Visible Exit/Close Button */}
              <div className="flex items-center gap-2 sm:gap-3">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 bg-white border border-[#EFE6D7] focus-within:border-[#173B25] px-3.5 py-2 rounded-full shadow-xs transition-colors">
                  <Search size={16} className="text-[#173B25] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Assam teas, masala chai, gift boxes..."
                    className="w-full bg-transparent text-xs sm:text-sm text-[#1D2A21] placeholder-[#1D2A21]/50 outline-none font-medium"
                    autoFocus
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-zinc-400 hover:text-[#173B25] transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  <button type="submit" className="bg-[#173B25] text-[#F7F2E8] text-[10px] uppercase font-black tracking-widest px-3.5 py-1.5 rounded-full hover:bg-[#B38A45] transition-colors shrink-0">
                    Search
                  </button>
                </form>

                {/* Explicit Exit/Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-1 bg-[#173B25]/10 hover:bg-[#173B25] text-[#173B25] hover:text-[#F7F2E8] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-2 rounded-full transition-all shrink-0 cursor-pointer border border-[#173B25]/20"
                  aria-label="Close search"
                >
                  <X size={15} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>

              {/* Popular Search Tag Chips */}
              {!searchQuery.trim() && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-[#1D2A21]/60 font-extrabold tracking-widest uppercase">Popular:</span>
                  {POPULAR_SEARCHES.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        navigate(`/shop?search=${encodeURIComponent(tag)}`);
                        setIsSearchActive(false);
                      }}
                      className="text-[10px] font-bold bg-[#EFE6D7] hover:bg-[#173B25] hover:text-[#F7F2E8] text-[#173B25] px-3 py-1 rounded-full transition-colors duration-200 uppercase tracking-wider cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Live Search Results (Compact Layout) */}
              {liveSearchResults.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {liveSearchResults.slice(0, 4).map(product => (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setIsSearchActive(false);
                      }}
                      className="cursor-pointer bg-white p-2 rounded-lg border border-[#EFE6D7] hover:border-[#173B25] hover:shadow-md transition-all duration-200 flex items-center gap-2.5 group"
                    >
                      <img src={product.image || 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400'} alt={product.name} className="w-11 h-11 object-cover rounded-md shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-[#1D2A21] truncate group-hover:text-[#B38A45] transition-colors">{product.name}</p>
                        <p className="text-[10px] text-[#173B25] font-extrabold font-mono">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. FULL-SCREEN PREMIUM MOBILE NAVIGATION DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[120] bg-[#F7F2E8] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
          >
            {/* Top Bar inside Mobile Drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-[#EFE6D7]">
              <div className="flex items-center gap-2">
                <svg width="34" height="36" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 5C15 15 8 28 8 38C8 44 12 48 18 48C26 48 30 38 30 30" stroke="#173B25" strokeWidth="3.5" strokeLinecap="round"/>
                  <path d="M25 5C35 15 42 28 42 38C42 44 38 48 32 48C24 48 20 38 20 30" stroke="#B38A45" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M25 8V44" stroke="#173B25" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <span className="text-2xl font-bold text-[#173B25] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                  Vaarta Chai
                </span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#173B25] bg-[#EFE6D7]/60 hover:bg-[#EFE6D7] rounded-full transition-colors"
                aria-label="Close mobile menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex flex-col py-8 gap-2 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3.5 border-b border-[#EFE6D7] text-xl font-medium tracking-[0.15em] text-[#173B25] hover:text-[#B38A45] flex items-center justify-between transition-colors group"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={18} className="text-[#B38A45] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-[#EFE6D7] flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#B38A45] uppercase">
                <Leaf size={14} />
                <span>100% PREMIUM ASSAM TEA</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#1D2A21]/70">
                <span>© {new Date().getFullYear()} Vaarta Chai</span>
                <div className="flex items-center gap-4">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#173B25]">Instagram</a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#173B25]">Facebook</a>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default Header;