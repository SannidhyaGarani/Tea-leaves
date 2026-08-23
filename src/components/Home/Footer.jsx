import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Check,
  Leaf,
  ShieldCheck,
  Truck,
  Award,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0B1E13] via-[#0E2719] to-[#07150C] font-sans text-white border-t border-[#B38A45]/30 overflow-hidden">
      {/* Top Gold Gradient Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#B38A45] to-transparent opacity-80" />

      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#B38A45]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#173B25]/30 rounded-full blur-3xl" />

      {/* ── 1. VALUE PILLARS & TRUST BADGES ── */}
      <section className="border-b border-[#B38A45]/20 bg-[#08170F]/60 backdrop-blur-sm relative z-10">
        <div className="max-w-[1350px] mx-auto px-5 py-8 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#B38A45]/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#B38A45]/15 border border-[#B38A45]/40 flex items-center justify-center text-[#D4B66F] shrink-0">
                <Leaf size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#F7F2E8] tracking-wide">100% Pure Assam Tea</h5>
                <p className="text-[10px] text-white/50 mt-0.5">Sourced directly from pristine garden estates</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#B38A45]/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#B38A45]/15 border border-[#B38A45]/40 flex items-center justify-center text-[#D4B66F] shrink-0">
                <Truck size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#F7F2E8] tracking-wide">Complimentary Shipping</h5>
                <p className="text-[10px] text-white/50 mt-0.5">Free delivery on all prepaid orders over ₹499</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#B38A45]/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#B38A45]/15 border border-[#B38A45]/40 flex items-center justify-center text-[#D4B66F] shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#F7F2E8] tracking-wide">Encrypted Checkout</h5>
                <p className="text-[10px] text-white/50 mt-0.5">100% secure payments via UPI, Cards & Netbanking</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#B38A45]/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#B38A45]/15 border border-[#B38A45]/40 flex items-center justify-center text-[#D4B66F] shrink-0">
                <Award size={18} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#F7F2E8] tracking-wide">Artisanal Small Batches</h5>
                <p className="text-[10px] text-white/50 mt-0.5">Hand-picked leaves crafted for rich aroma</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NEWSLETTER VIP CLUB SECTION ── */}
      <section className="border-b border-[#B38A45]/20 relative z-10">
        <div className="max-w-[1350px] mx-auto px-5 py-12 sm:px-8 lg:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B38A45]/15 border border-[#B38A45]/30 text-[#D4B66F] text-[9.5px] font-extrabold uppercase tracking-[0.25em] mb-3">
              <Sparkles size={11} className="text-[#D4B66F]" />
              <span>Vaarta Tea Club</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-tight text-[#F7F2E8]">
              Join Our <span className="italic text-[#D4B66F]">Connoisseur Circle</span>
            </h2>
            <p className="text-sm font-medium text-[#D4B66F] mt-1" style={{ fontFamily: '"Noto Serif Devanagari", Georgia, serif' }}>
              हर घूंट में छुपी एक कहानी
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/60 font-normal max-w-md">
              Subscribe to receive private tasting invitations, new seasonal flush announcements, and exclusive tea pairing guides.
            </p>
          </div>

          {/* Email Subscription Box */}
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-2xl bg-white/[0.05] border border-white/15 backdrop-blur-md max-w-md shadow-2xl focus-within:border-[#B38A45] transition-all">
              <div className="flex items-center gap-2.5 px-4 py-3 flex-1">
                <Mail size={16} className="text-[#D4B66F] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/40"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#B38A45] hover:bg-[#c99e52] text-[#0B1E13] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shrink-0 shadow-lg shadow-[#B38A45]/20 hover:scale-[1.02] active:scale-95"
              >
                <span>{subscribed ? 'Joined!' : 'Subscribe'}</span>
                {subscribed ? <Check size={14} /> : <Send size={13} />}
              </button>
            </div>
            {subscribed && (
              <p className="text-[11px] text-[#D4B66F] mt-2 font-medium flex items-center gap-1.5">
                <Check size={12} /> Welcome to the Vaarta Chai family!
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ── 3. MAIN FOOTER CONTENT COLUMNS ── */}
      <div className="max-w-[1350px] mx-auto px-5 py-14 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Col 1: Brand Identity */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block group">
              <img
                src="https://res.cloudinary.com/dcjn4y284/image/upload/v1787474399/VARTA_CHAI_LOGO_NEW_PNG_2_gxlhbz.png"
                alt="Vaarta Chai Logo"
                className="h-16 sm:h-20 md:h-24 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-sm italic font-serif text-[#D4B66F]">
              "हर घूंट में छुपी एक कहानी"
            </p>

            <p className="text-xs leading-relaxed text-white/60 max-w-sm">
              Hand-picked from the lush tea gardens of Assam. Crafted to transform everyday moments into warm, memorable conversations.
            </p>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { icon: MessageCircle, href: 'https://whatsapp.com', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl border border-white/15 bg-white/[0.04] text-white/70 flex items-center justify-center transition-all duration-300 hover:bg-[#B38A45] hover:border-[#B38A45] hover:text-[#0B1E13] hover:scale-110 shadow-sm"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#D4B66F] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B38A45]" />
              Explore
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                ['Home', '/'],
                ['Shop Collection', '/shop'],
                ['Gift Boxes', '/shop?category=Gift+Collection'],
                ['Our Story', '/about'],
                ['Tea Journal', '/about'],
                ['Contact Us', '/contact'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="group inline-flex items-center gap-1.5 text-white/65 hover:text-[#D4B66F] transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#B38A45]/0 group-hover:bg-[#B38A45] transition-all" />
                    <span>{label}</span>
                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 text-[#D4B66F]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#D4B66F] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B38A45]" />
              Customer Support
            </h4>
            <ul className="space-y-3 text-xs font-medium">
              {[
                ['My Account', '/account'],
                ['Track Order', '/orders'],
                ['Wishlist', '/wishlist'],
                ['Privacy Policy', '/privacy'],
                ['Terms & Conditions', '/terms'],
                ['Refund Policy', '/terms'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="group inline-flex items-center gap-1.5 text-white/65 hover:text-[#D4B66F] transition-colors"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#B38A45]/0 group-hover:bg-[#B38A45] transition-all" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Boutique Info */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#D4B66F] mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B38A45]" />
              Get In Touch
            </h4>
            <div className="space-y-3.5 text-xs text-white/65">
              <a href="tel:+911234567890" className="flex items-center gap-3 hover:text-[#D4B66F] transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4B66F] group-hover:bg-[#B38A45] group-hover:text-[#0B1E13] transition-all">
                  <Phone size={12} />
                </div>
                <span>+91 12345 67890</span>
              </a>

              <a href="mailto:hello@vartachai.com" className="flex items-center gap-3 hover:text-[#D4B66F] transition-colors group">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4B66F] group-hover:bg-[#B38A45] group-hover:text-[#0B1E13] transition-all">
                  <Mail size={12} />
                </div>
                <span>hello@vartachai.com</span>
              </a>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4B66F] shrink-0 mt-0.5">
                  <MapPin size={12} />
                </div>
                <span className="leading-relaxed">Indore, Madhya Pradesh, India</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4B66F] shrink-0 mt-0.5">
                  <Clock size={12} />
                </div>
                <span>Mon – Sat: 10 AM – 7 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 4. PAYMENT & SECURITY ROW ── */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <ShieldCheck size={15} className="text-[#D4B66F]" />
            <span>Guaranteed 100% Safe & Secure Checkout</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {['VISA', 'MASTERCARD', 'UPI', 'NETBANKING', 'RAZORPAY'].map((item) => (
              <span key={item} className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[9px] font-bold tracking-wider text-white/60 uppercase">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── 5. BOTTOM COPYRIGHT BAR ── */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-medium tracking-wider text-white/40 uppercase">
          <p>© {new Date().getFullYear()} Vaarta Chai. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#D4B66F] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D4B66F] transition-colors">Terms of Service</Link>
            <Link to="/terms" className="hover:text-[#D4B66F] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/911234567890"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[99] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/40 active:scale-95"
      >
        <MessageCircle size={24} fill="currentColor" strokeWidth={0} />
      </a>
    </footer>
  );
};

export default Footer;