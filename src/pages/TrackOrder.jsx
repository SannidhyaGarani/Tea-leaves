import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../components/useAuth";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/Home/PageHeader";
import MiniLoader from "../components/MiniLoader";

const TrackOrder = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || searchParams.get("orderId") || localStorage.getItem("last_order_number") || "";
  const initialEmail = searchParams.get("email") || user?.email || localStorage.getItem("guest_checkout_email") || localStorage.getItem("last_order_email") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTracking = async (searchNum, searchEmail) => {
    if (!searchNum || !searchEmail) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: searchNum,
          email: searchEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order not found. Please verify the order number and email.");
      }
      setOrder(data.order);
    } catch (err) {
      setError(err.message || "Failed to load tracking details.");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialEmail) {
      fetchTracking(initialOrderNumber, initialEmail);
    }
  }, [initialOrderNumber, initialEmail]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      setError("Please provide both order reference and email address.");
      return;
    }
    fetchTracking(orderNumber.trim(), email.trim());
  };

  return (
    <div className="min-h-screen bg-[#faf5ec] font-sans text-[#173b25]">
      <PageHeader
        title="Track Shipment"
        subtitle="Live delivery status & artisanal harvest fulfillment"
        breadcrumbItems={[
          { label: "Home", path: "/" },
          { label: "Track Order" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-10 md:py-16">
        {/* Lookup Card */}
        <div className="bg-white border border-[#e2d7c5] p-6 md:p-8 rounded-2xl shadow-sm mb-10">
          <div className="max-w-xl mx-auto text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8860b]">
              Direct Estate Delivery
            </span>
            <h2 className="text-xl md:text-2xl font-serif font-medium text-[#173b25] mt-1 mb-2">
              Trace Your Tea Shipment
            </h2>
            <p className="text-xs text-[#524f46] leading-relaxed">
              Enter your unique order number and the email address used during checkout to view live status.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 max-w-2xl mx-auto">
            <div className="md:col-span-5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Order Number
              </label>
              <input
                type="text"
                placeholder="e.g. TEA-XXXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="w-full bg-[#faf5ec] border border-[#e2d7c5] rounded-md px-3.5 py-2.5 text-xs text-[#173b25] outline-none focus:border-[#173b25]"
              />
            </div>

            <div className="md:col-span-5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                Checkout Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#faf5ec] border border-[#e2d7c5] rounded-md px-3.5 py-2.5 text-xs text-[#173b25] outline-none focus:border-[#173b25]"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={12} />
                    <span>Track</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-md flex items-center gap-2 max-w-2xl mx-auto"
            >
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        {/* Tracking Details Result */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Header */}
            <div className="bg-[#f7f2e8] border border-[#e8dfcf] p-6 md:p-8 rounded-3xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2d7c5]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8860b]">
                    Tracking Status
                  </span>
                  <h3 className="text-xl font-bold font-mono text-[#173b25] mt-0.5">
                    #{order.orderNumber}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-[#173b25] text-[#ecdcb9] text-[10px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 size={12} /> {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {[
                    { label: "Order Confirmed", desc: "Harvest verified", active: true },
                    { label: "Estate Packed", desc: "Aroma-locked pouching", active: true },
                    { label: "In Transit", desc: "Garden direct courier", active: order.orderStatus !== "pending" },
                    { label: "Delivered", desc: "To your doorstep", active: order.orderStatus === "delivered" },
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-start bg-white/70 p-4 rounded-xl border border-[#e2d7c5]">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            step.active
                              ? "bg-[#173b25] text-white"
                              : "bg-zinc-200 text-zinc-500"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#173b25]">
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#524f46] pl-8">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier info */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs bg-white/60 p-4 rounded-xl border border-[#e2d7c5] gap-2">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#b8860b]" />
                  <span className="text-zinc-600">Carrier: <strong>{order.trackingDetails?.carrier || "Express Courier"}</strong></span>
                </div>
                <div className="text-zinc-600">
                  Estimated Delivery: <strong className="text-[#173b25]">{order.trackingDetails?.estimatedDelivery || "3-5 Business Days"}</strong>
                </div>
              </div>
            </div>

            {/* Items & Shipping Address Grid */}
            <div className="grid md:grid-cols-12 gap-8">
              {/* Items */}
              <div className="md:col-span-7 bg-white border border-[#e2d7c5] p-6 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#173b25] mb-4 pb-3 border-b border-[#eee]">
                  Purchased Items ({order.items?.length || 0})
                </h4>

                <div className="divide-y divide-[#eee]">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150"}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-[#FAF5EC] border border-[#e2d7c5] rounded-lg p-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#173b25]">{item.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            {item.size ? `Pack: ${item.size} • ` : ""}Qty: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#173b25]">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#eee] flex justify-between items-center text-sm font-bold text-[#173b25]">
                  <span>Total Paid</span>
                  <span>₹{(order.total || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Destination */}
              <div className="md:col-span-5 bg-white border border-[#e2d7c5] p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#173b25] mb-4 pb-3 border-b border-[#eee] flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#b8860b]" /> Delivery Destination
                  </h4>

                  <div className="text-xs leading-relaxed text-[#524f46] space-y-1">
                    <p className="font-bold text-[#173b25] text-sm">{order.shippingAddress?.name || "Customer"}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="text-[#b8860b] font-mono text-[11px] pt-1">
                      Phone: {order.shippingAddress?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* If Guest: Account Linking Prompt */}
                {order.isGuest && (
                  <div className="mt-6 pt-4 border-t border-[#eee] bg-[#faf5ec] p-4 rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#b8860b] block mb-1">
                      Save This Order
                    </span>
                    <p className="text-[11px] text-zinc-600 mb-3 leading-snug">
                      Sign in or create an account with <strong>{order.customerEmail}</strong> to link all past orders.
                    </p>
                    <Link
                      to={`/signup?email=${encodeURIComponent(order.customerEmail)}&redirect=orders`}
                      className="w-full py-2 bg-[#173b25] hover:bg-[#245433] text-white text-[10px] font-extrabold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Create Account & Link</span>
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
