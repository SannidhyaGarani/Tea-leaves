import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight, X, CheckCircle, Clock, MessageSquare, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/Home/PageHeader';

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const communicationChannels = [
    { icon: Mail, label: 'Email Us', val: 'hello@vartachai.com', href: 'mailto:hello@vartachai.com', desc: 'We reply within 24 hours' },
    { icon: Phone, label: 'Call Us', val: '+91 12345 67890', href: 'tel:+911234567890', desc: 'Mon–Sat, 10am – 7pm IST' },
    { icon: MapPin, label: 'Visit Us', val: 'Indore, MP, India', href: '#', desc: 'Vaarta Chai Head Office' }
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }
  };

  return (
    <div className="min-h-screen bg-[#faf5ec] font-sans">
      <PageHeader
        title="Get In Touch"
        subtitle="We'd love to hear from you. Reach out anytime for orders, inquiries or tea stories."
        breadcrumbItems={[{ label: 'Home', path: '/' }, { label: 'Contact' }]}
      />

      {/* Success Toast */}
      <AnimatePresence>
        {formSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#173b25] text-white px-6 py-4 shadow-2xl flex items-center gap-3 border border-[#B38A45] rounded-md"
          >
            <CheckCircle size={16} className="text-[#B38A45]" />
            <p className="text-xs font-bold uppercase tracking-wider">Message sent! We'll respond shortly.</p>
            <button onClick={() => setFormSubmitted(false)} className="opacity-60 hover:opacity-100 ml-2"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14 py-12 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* LEFT: Channels */}
          <motion.div {...fadeUp} className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.28em] uppercase text-[#B38A45] block mb-2">Reach Out</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#173b25] leading-tight">
                We're Here <span className="italic text-[#B38A45]">To Help</span>
              </h2>
              
              {/* Hindi Tagline */}
              <h3 
                className="text-xl font-normal text-[#173b25] mt-1 mb-3"
                style={{ fontFamily: '"Noto Serif Devanagari", "Rozha One", Georgia, serif' }}
              >
                बातचीत की शुरुआत करें
              </h3>

              {/* Leaf Emblem Line Divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="w-12 h-[1px] bg-[#B38A45]/40" />
                <div className="text-[#2d5a27]"><Leaf size={15} fill="#2d5a27" /></div>
                <div className="w-12 h-[1px] bg-[#B38A45]/40" />
              </div>

              <p className="text-xs sm:text-sm text-[#524f46] font-medium leading-relaxed max-w-sm">
                Whether you have a question about tea varieties, need brewing advice, or want to discuss a wholesale order — our team is ready.
              </p>
            </div>

            <div className="space-y-3">
              {communicationChannels.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    href={item.href}
                    key={i}
                    onMouseEnter={() => setActiveChannel(i)}
                    onMouseLeave={() => setActiveChannel(null)}
                    className="flex items-center gap-4 p-4 sm:p-5 bg-[#f7f2e8] border border-[#e8dfcf] hover:border-[#B38A45] rounded-2xl transition-all duration-300 group shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center transition-all duration-300 shrink-0">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#B38A45] mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold text-[#173b25] truncate">{item.val}</p>
                      <p className="text-[11px] text-[#524f46] font-medium">{item.desc}</p>
                    </div>
                    <ArrowUpRight size={16} className={`text-[#173b25] transition-all duration-300 shrink-0 ${activeChannel === i ? 'rotate-45 text-[#B38A45]' : ''}`} />
                  </a>
                );
              })}
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#f7f2e8] border border-[#e8dfcf] rounded-2xl shadow-2xs">
              <Clock size={16} className="text-[#B38A45] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25] mb-1">Business Hours</p>
                <p className="text-xs text-[#524f46] font-medium">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
                <p className="text-xs text-[#827963]">Sunday: Closed</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Form */}
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="lg:col-span-7">
            <div className="bg-[#f7f2e8] border border-[#e8dfcf] p-6 sm:p-8 md:p-10 shadow-lg rounded-3xl">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={16} className="text-[#B38A45]" />
                <h3 className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#173b25]">Send A Message</h3>
              </div>

              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">Full Name</label>
                    <input type="text" required
                      className="w-full bg-[#faf5ec] border border-[#e2d7c5] rounded-md px-4 py-3 text-xs sm:text-sm text-[#173b25] outline-none focus:border-[#173b25] transition-colors placeholder:text-[#827963]"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">Email Address</label>
                    <input type="email" required
                      className="w-full bg-[#faf5ec] border border-[#e2d7c5] rounded-md px-4 py-3 text-xs sm:text-sm text-[#173b25] outline-none focus:border-[#173b25] transition-colors placeholder:text-[#827963]"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">Subject</label>
                  <select className="w-full bg-[#faf5ec] border border-[#e2d7c5] rounded-md px-4 py-3 text-xs sm:text-sm text-[#173b25] outline-none focus:border-[#173b25] transition-colors appearance-none cursor-pointer">
                    <option>Order Inquiry</option>
                    <option>Tea Product Question</option>
                    <option>Brewing Guide Help</option>
                    <option>Returns & Support</option>
                    <option>Wholesale / B2B Estate Orders</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">Your Message</label>
                  <textarea rows="5" required
                    className="w-full bg-[#faf5ec] border border-[#e2d7c5] rounded-md px-4 py-3 text-xs sm:text-sm text-[#173b25] outline-none focus:border-[#173b25] transition-colors resize-none placeholder:text-[#827963]"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button type="submit"
                  className="w-full py-4 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
                >
                  <Send size={14} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
