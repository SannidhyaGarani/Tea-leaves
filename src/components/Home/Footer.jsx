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
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email.trim()) {
      setSubscribed(true);
      setEmail('');

      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#173b25] font-sans text-white">

      {/* =====================================================
          NEWSLETTER
      ====================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1250px] flex-col gap-7 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">

          {/* Text */}

          <div className="max-w-md">

            <div className="mb-3 flex items-center gap-2">

              <span className="h-px w-6 bg-[#b38a45]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#d4b66f]">
                Stay In The Loop
              </span>

            </div>

            <h2 className="font-serif text-3xl font-medium leading-tight text-[#f7f2e8]">
              Join The Varta Family
            </h2>

            <p className="mt-2 text-xs leading-6 text-white/55">
              New blends, special offers and stories from the world of tea.
            </p>

          </div>


          {/* Email */}

          <form
            onSubmit={handleSubscribe}
            className="flex w-full max-w-md border border-white/20 bg-white/[0.06] p-1 backdrop-blur-sm"
          >

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-xs text-white outline-none placeholder:text-white/35"
            />

            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 bg-[#b38a45] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#c49a55]"
            >
              <span>{subscribed ? 'THANKS' : 'SUBSCRIBE'}</span>

              {subscribed ? (
                <Check size={13} />
              ) : (
                <Send size={12} />
              )}
            </button>

          </form>

        </div>
      </section>


      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-[1250px] px-5 py-12 sm:px-8 lg:px-10">

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-5">


          {/* =================================================
              BRAND
          ================================================== */}

          <div className="col-span-2 md:col-span-2 lg:col-span-1">

            <Link
              to="/"
              className="group inline-flex items-center gap-2"
            >

              {/* Logo */}

              <div className="relative flex h-10 w-10 items-center justify-center">

                <svg
                  width="38"
                  height="40"
                  viewBox="0 0 50 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >

                  <path
                    d="M25 5C15 15 8 28 8 38C8 44 12 48 18 48C26 48 30 38 30 30"
                    stroke="#d4b66f"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M25 5C35 15 42 28 42 38C42 44 38 48 32 48C24 48 20 38 20 30"
                    stroke="#d4b66f"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M25 8V44"
                    stroke="#f7f2e8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                </svg>

              </div>


              <div>

                <span className="block font-serif text-2xl leading-none text-[#f7f2e8]">
                  Vaarta
                </span>

                <span className="mt-1 block text-[9px] font-bold tracking-[0.3em] text-[#d4b66f]">
                  चाय
                </span>

              </div>

            </Link>


            <p className="mt-5 font-serif text-sm italic text-[#d4b66f]">
              हर घूंट में छुपी एक कहानी
            </p>

            <p className="mt-3 max-w-[230px] text-[11px] leading-6 text-white/50">
              Premium Assam tea crafted for conversations,
              quiet mornings and memorable moments.
            </p>


            {/* Social */}

            <div className="mt-6 flex items-center gap-2">

              {[
                {
                  icon: Instagram,
                  href: 'https://instagram.com',
                  label: 'Instagram',
                },
                {
                  icon: Facebook,
                  href: 'https://facebook.com',
                  label: 'Facebook',
                },
                {
                  icon: MessageCircle,
                  href: 'https://whatsapp.com',
                  label: 'WhatsApp',
                },
              ].map(({ icon: Icon, href, label }) => (

                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center border border-white/15 text-white/60 transition-all duration-300 hover:border-[#b38a45] hover:bg-[#b38a45] hover:text-white"
                >
                  <Icon size={13} />
                </a>

              ))}

            </div>

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <div>

            <h4 className="mb-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4b66f]">
              Explore
            </h4>

            <ul className="space-y-3">

              {[
                ['Home', '/'],
                ['About Us', '/about'],
                ['Shop', '/shop'],
                ['Gift Box', '/shop?category=Gift+Collection'],
                ['Varta Journal', '/about'],
                ['Contact Us', '/contact'],
              ].map(([label, path]) => (

                <li key={label}>

                  <Link
                    to={path}
                    className="group inline-flex items-center gap-1 text-[11px] text-white/55 transition-colors hover:text-white"
                  >
                    {label}

                    <ArrowUpRight
                      size={9}
                      className="opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70"
                    />
                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* =================================================
              CUSTOMER CARE
          ================================================== */}

          <div>

            <h4 className="mb-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4b66f]">
              Customer Care
            </h4>

            <ul className="space-y-3">

              {[
                ['My Account', '/account'],
                ['Track Order', '/orders'],
                ['Wishlist', '/wishlist'],
                ['FAQ', '/contact'],
                ['Shipping Policy', '/terms'],
                ['Returns', '/privacy'],
              ].map(([label, path]) => (

                <li key={label}>

                  <Link
                    to={path}
                    className="text-[11px] text-white/55 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* =================================================
              CONTACT
          ================================================== */}

          <div>

            <h4 className="mb-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4b66f]">
              Get In Touch
            </h4>

            <div className="space-y-3">

              <a
                href="tel:+911234567890"
                className="flex items-start gap-2.5 text-[11px] text-white/55 transition-colors hover:text-white"
              >
                <Phone
                  size={13}
                  className="mt-0.5 shrink-0 text-[#b38a45]"
                />

                <span>+91 12345 67890</span>
              </a>


              <a
                href="mailto:hello@vartachai.com"
                className="flex items-start gap-2.5 text-[11px] text-white/55 transition-colors hover:text-white"
              >
                <Mail
                  size={13}
                  className="mt-0.5 shrink-0 text-[#b38a45]"
                />

                <span>hello@vartachai.com</span>
              </a>


              <div className="flex items-start gap-2.5 text-[11px] leading-5 text-white/55">

                <MapPin
                  size={13}
                  className="mt-0.5 shrink-0 text-[#b38a45]"
                />

                <span>
                  Indore, Madhya Pradesh,
                  <br />
                  India
                </span>

              </div>


              <div className="flex items-start gap-2.5 text-[11px] text-white/55">

                <Clock
                  size={13}
                  className="mt-0.5 shrink-0 text-[#b38a45]"
                />

                <span>Mon – Sat · 10AM – 7PM</span>

              </div>

            </div>

          </div>


          {/* =================================================
              PAYMENT
          ================================================== */}

          <div>

            <h4 className="mb-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#d4b66f]">
              Secure Payments
            </h4>

            <p className="mb-4 text-[10px] leading-5 text-white/40">
              Safe and secure checkout powered by trusted payment methods.
            </p>


            <div className="flex flex-wrap gap-1.5">

              {['VISA', 'MC', 'UPI', 'Razorpay'].map((method) => (

                <span
                  key={method}
                  className="border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[8px] font-bold tracking-wide text-white/60"
                >
                  {method}
                </span>

              ))}

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[9px] uppercase tracking-[0.12em] text-white/35 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © 2024 Varta Chai. All Rights Reserved.
          </p>

          <div className="flex gap-5">

            <Link
              to="/privacy"
              className="transition-colors hover:text-white/70"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition-colors hover:text-white/70"
            >
              Terms
            </Link>

            <Link
              to="/terms"
              className="transition-colors hover:text-white/70"
            >
              Refunds
            </Link>

          </div>

        </div>

      </div>


      {/* =====================================================
          WHATSAPP
      ====================================================== */}

      <a
        href="https://wa.me/911234567890"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-[99] flex h-11 w-11 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <MessageCircle
          size={22}
          fill="currentColor"
          strokeWidth={0}
        />
      </a>

    </footer>
  );
};

export default Footer;