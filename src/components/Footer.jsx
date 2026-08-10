import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Send, Phone, Mail, MapPin, Clock, Tag, Sparkles, BookOpen, Gift } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white font-sans border-t border-zinc-200">
      
      {/* ── 1. JOIN THE VARTA FAMILY (DARK GREEN NEWSLETTER BANNER) ── */}
      <div className="bg-[#1b3b1a] text-white py-12 px-4 md:px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Newsletter Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-white/15 pb-10">
            <div className="lg:col-span-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                JOIN THE VARTA FAMILY
              </h2>
              <p className="text-xs md:text-sm text-zinc-300 font-normal">
                Be the first to know about new blends, exclusive offers and tea stories.
              </p>
            </div>

            {/* Email Form */}
            <div className="lg:col-span-6 flex justify-start lg:justify-end">
              <form onSubmit={handleSubscribe} className="flex items-center w-full max-w-md bg-white rounded-md p-1 shadow-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent px-4 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#1b3b1a] hover:bg-[#2e5b2a] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>{subscribed ? 'THANKS!' : 'SUBSCRIBE'}</span>
                  <Send size={13} />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Features Strip inside Banner */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                <Tag size={16} />
              </div>
              <div className="text-[11px]">
                <p className="font-bold">Exclusive Offers</p>
                <p className="text-zinc-300 text-[10px]">Just For You</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                <Sparkles size={16} />
              </div>
              <div className="text-[11px]">
                <p className="font-bold">Early Access</p>
                <p className="text-zinc-300 text-[10px]">To New Blends</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                <BookOpen size={16} />
              </div>
              <div className="text-[11px]">
                <p className="font-bold">Tea Tips & Stories</p>
                <p className="text-zinc-300 text-[10px]">Curated Articles</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-amber-300">
                <Gift size={16} />
              </div>
              <div className="text-[11px]">
                <p className="font-bold">Special Birthday</p>
                <p className="text-zinc-300 text-[10px]">Surprises</p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── 2. FOOTER MAIN COLUMNS ── */}
      <div className="py-12 px-4 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Col 1: Logo & Info */}
          <div className="lg:col-span-2 flex flex-col items-start pr-4">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <svg width="36" height="38" viewBox="0 0 50 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 5C15 15 8 28 8 38C8 44 12 48 18 48C26 48 30 38 30 30" stroke="#2e5b2a" strokeWidth="3.5" strokeLinecap="round"/>
                <path d="M25 5C35 15 42 28 42 38C42 44 38 48 32 48C24 48 20 38 20 30" stroke="#b8860b" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M25 8V44" stroke="#2e5b2a" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#1b3b1a] tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                  Vaarta
                </span>
                <span className="text-xs font-bold text-[#2e5b2a] tracking-widest leading-none mt-0.5" style={{ fontFamily: '"Noto Sans Devanagari", sans-serif' }}>
                  चाय
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-zinc-500 font-medium mb-1">
              हर घूंट में छुपी एक कहानी
            </p>
            <p className="text-xs text-zinc-500 font-normal leading-relaxed mb-4 max-w-xs">
              Premium Assam Tea from nature, for your moments of conversation.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-zinc-600">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-[#1b3b1a] hover:text-white transition-colors">
                <Instagram size={14} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-[#1b3b1a] hover:text-white transition-colors">
                <Facebook size={14} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-[#1b3b1a] hover:text-white transition-colors">
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

          {/* Col 2: QUICK LINKS */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              <li><Link to="/" className="hover:text-[#1b3b1a]">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#1b3b1a]">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-[#1b3b1a]">Shop</Link></li>
              <li><Link to="/shop?category=Gift+Collection" className="hover:text-[#1b3b1a]">Gift Box</Link></li>
              <li><Link to="/about" className="hover:text-[#1b3b1a]">Varta Journal</Link></li>
              <li><Link to="/contact" className="hover:text-[#1b3b1a]">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3: CUSTOMER CARE */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              <li><Link to="/account" className="hover:text-[#1b3b1a]">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-[#1b3b1a]">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#1b3b1a]">Wishlist</Link></li>
              <li><Link to="/contact" className="hover:text-[#1b3b1a]">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-[#1b3b1a]">Shipping Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-[#1b3b1a]">Return Policy</Link></li>
            </ul>
          </div>

          {/* Col 4: POLICIES */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              POLICIES
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              <li><Link to="/privacy" className="hover:text-[#1b3b1a]">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#1b3b1a]">Terms & Conditions</Link></li>
              <li><Link to="/terms" className="hover:text-[#1b3b1a]">Refund Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-[#1b3b1a]">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Col 5: CONTACT US & PAYMENT METHODS */}
          <div>
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              CONTACT US
            </h4>
            <div className="space-y-2 text-xs text-zinc-600 font-medium mb-4">
              <p className="flex items-center gap-1.5">
                <Phone size={13} className="text-[#1b3b1a]" />
                <span>+91 12345 67890</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail size={13} className="text-[#1b3b1a]" />
                <span>hello@vartachai.com</span>
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin size={13} className="text-[#1b3b1a] shrink-0 mt-0.5" />
                <span>Indore, Madhya Pradesh, India</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#1b3b1a]" />
                <span>Mon - Sat | 10AM - 7PM</span>
              </p>
            </div>

            <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider mb-2">
              PAYMENT METHODS
            </h4>
            <div className="flex items-center gap-2 flex-wrap text-[10px] font-extrabold text-zinc-700">
              <span className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200 text-[#1a1f71]">VISA</span>
              <span className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200 text-[#eb001b]">MC</span>
              <span className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200 text-[#097939]">UPI</span>
              <span className="bg-zinc-100 px-2 py-1 rounded border border-zinc-200 text-[#072654]">Razorpay</span>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-zinc-200 mt-10 pt-6 text-center text-xs text-zinc-500 font-medium">
          <p>© 2024 Varta Chai. All Rights Reserved.</p>
        </div>

      </div>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href="https://wa.me/911234567890"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[99] w-12 h-12 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} fill="currentColor" stroke="none" />
      </a>
    </footer>
  );
};

export default Footer;
