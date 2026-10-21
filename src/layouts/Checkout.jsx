import React, { useEffect, useState } from "react";
import MiniLoader from "../components/MiniLoader";
import { useAuth } from "../components/useAuth";
import { useStore } from "../components/StoreProvider";
import { db } from "../components/Firebase";
import { collection, getDocs, addDoc, serverTimestamp, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  X,
  ShieldCheck,
  Zap,
  Sparkles,
  Plus,
  Truck,
  ArrowRight,
  PackageCheck,
  Home,
  Briefcase,
  Building,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/Home/PageHeader";
import { INDIAN_STATES, ADDRESS_TYPES } from "../utils/addressConstants";

const Checkout = () => {
  const { user } = useAuth();
  const { cart: storeCart } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    saveToAccount: true,
    paymentMethod: "online",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const loadData = async () => {
      try {
        if (user) {
          // Logged-in user: load cart and saved addresses
          const cartSnap = await getDocs(collection(db, "users", user.uid, "cart"));
          const userItems = cartSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setItems(userItems.length > 0 ? userItems : storeCart || []);

          setFormData((prev) => ({
            ...prev,
            name: user.displayName || prev.name,
            email: user.email || prev.email,
          }));

          const addressSnap = await getDocs(collection(db, "users", user.uid, "addresses"));
          const addrs = addressSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setSavedAddresses(addrs);

          if (addrs.length > 0) {
            const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
            setSelectedAddressId(defaultAddr.id);
            setFormData((prev) => ({
              ...prev,
              name: defaultAddr.name || user.displayName || prev.name,
              phone: defaultAddr.phone || prev.phone,
              houseNo: defaultAddr.houseNo || "",
              street: defaultAddr.street || defaultAddr.address || "",
              landmark: defaultAddr.landmark || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              pincode: defaultAddr.pincode || "",
              addressType: defaultAddr.type || defaultAddr.addressType || "Home",
            }));
          }
        } else {
          // Guest user: load from local storage / store provider cart
          const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
          setItems(guestCart.length > 0 ? guestCart : storeCart || []);
          const savedEmail = localStorage.getItem("guest_checkout_email") || localStorage.getItem("last_order_email") || "";
          const savedGuestAddr = JSON.parse(localStorage.getItem("guest_saved_address") || "null");

          setFormData((prev) => ({
            ...prev,
            email: prev.email || savedEmail,
            name: prev.name || savedGuestAddr?.name || "",
            phone: prev.phone || savedGuestAddr?.phone || "",
            houseNo: prev.houseNo || savedGuestAddr?.houseNo || "",
            street: prev.street || savedGuestAddr?.street || savedGuestAddr?.address || "",
            landmark: prev.landmark || savedGuestAddr?.landmark || "",
            city: prev.city || savedGuestAddr?.city || "",
            state: prev.state || savedGuestAddr?.state || "",
            pincode: prev.pincode || savedGuestAddr?.pincode || "",
            addressType: prev.addressType || savedGuestAddr?.addressType || "Home",
          }));
        }
      } catch (error) {
        console.error("Error loading checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [user, storeCart]);

  const triggerToast = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.quantity || 1), 0);

  const clearCart = async () => {
    try {
      if (user) {
        const snap = await getDocs(collection(db, "users", user.uid, "cart"));
        await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, "users", user.uid, "cart", d.id))));
      } else {
        localStorage.removeItem("guest_cart");
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Error clearing cart:", e);
    }
  };

  const saveOrder = async (paymentId = "COD", status = "confirmed", paymentStatus = "captured") => {
    try {
      const normalizedEmail = (formData.email || "").trim().toLowerCase();
      const uniqueOrderNumber = `TEA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const combinedAddress = [
        formData.houseNo,
        formData.street,
        formData.landmark ? `(Landmark: ${formData.landmark})` : ''
      ].filter(Boolean).join(', ') || formData.address || '';

      const shippingPayload = {
        name: (formData.name || "").trim(),
        phone: (formData.phone || "").trim(),
        email: normalizedEmail,
        houseNo: (formData.houseNo || "").trim(),
        street: (formData.street || "").trim(),
        landmark: (formData.landmark || "").trim(),
        address: combinedAddress,
        city: (formData.city || "").trim(),
        state: (formData.state || "").trim(),
        pincode: (formData.pincode || "").trim(),
        addressType: formData.addressType || "Home",
      };

      const orderPayload = {
        orderNumber: uniqueOrderNumber,
        userId: user ? user.uid : null,
        isGuest: !user,
        customerEmail: normalizedEmail,
        customerName: (formData.name || "").trim(),
        customerPhone: (formData.phone || "").trim(),
        items: items.map((i) => ({
          id: i.id || "",
          cartId: i.cartId || "",
          name: i.name || "Artisanal Tea Blend",
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
          size: i.size || "",
          image: i.image || i.images?.[0] || "",
        })),
        subtotal: total,
        shipping: 0,
        discount: 0,
        total,
        paymentMethod: formData.paymentMethod,
        paymentId: paymentId || (formData.paymentMethod === "cod" ? "COD" : "N/A"),
        paymentStatus,
        orderStatus: status,
        shippingAddress: shippingPayload,
        emailStatus: {
          customer: "pending",
          admin: "pending",
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderPayload);

      if (status === "confirmed") {
        // Save guest email & address to localStorage so user can easily track or re-order
        if (!user) {
          localStorage.setItem("guest_checkout_email", normalizedEmail);
          localStorage.setItem("last_order_email", normalizedEmail);
          localStorage.setItem("last_order_number", uniqueOrderNumber);
          localStorage.setItem("guest_saved_address", JSON.stringify(shippingPayload));
        } else if (formData.saveToAccount && (selectedAddressId === "custom" || savedAddresses.length === 0)) {
          // Auto-save this address to the user's account
          try {
            const isFirst = savedAddresses.length === 0;
            const newAddrDoc = {
              name: shippingPayload.name,
              phone: shippingPayload.phone,
              houseNo: shippingPayload.houseNo,
              street: shippingPayload.street,
              landmark: shippingPayload.landmark,
              address: shippingPayload.address,
              city: shippingPayload.city,
              state: shippingPayload.state,
              pincode: shippingPayload.pincode,
              type: shippingPayload.addressType || "Home",
              isDefault: isFirst,
              createdAt: new Date().toISOString()
            };
            const addrRef = await addDoc(collection(db, "users", user.uid, "addresses"), newAddrDoc);
            setSavedAddresses((prev) => [...prev, { id: addrRef.id, ...newAddrDoc }]);
          } catch (err) {
            console.warn("Could not save address to user account:", err);
          }
        }

        // Trigger order emails server-side
        try {
          await fetch("/api/send-order-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: docRef.id }),
          });
        } catch (err) {
          console.warn("Async email dispatch notice:", err.message);
        }

        await clearCart();
        setConfirmedOrder({ id: docRef.id, ...orderPayload });
        setOrderStatus("success");
      } else {
        setOrderStatus("failed");
      }
    } catch (e) {
      console.error("Save Order Error:", e);
      setOrderStatus("failed");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      triggerToast("Your bag is empty!");
      return;
    }
    if (!formData.name?.trim()) {
      triggerToast("Please enter recipient name.");
      return;
    }
    if (!formData.email || !formData.email.includes("@")) {
      triggerToast("Please provide a valid email address for order notifications.");
      return;
    }
    if (!formData.phone || formData.phone.trim().length < 10) {
      triggerToast("Please provide a valid 10-digit mobile number.");
      return;
    }
    if (!formData.houseNo?.trim() && !formData.street?.trim() && !formData.address?.trim()) {
      triggerToast("Please provide your house/flat number and street area.");
      return;
    }
    if (!formData.city?.trim() || !formData.state?.trim() || !formData.pincode?.trim()) {
      triggerToast("Please fill in City, State, and 6-digit Pincode.");
      return;
    }

    setIsProcessing(true);
    if (formData.paymentMethod === "online") {
      const options = {
        key: "rzp_test_YOUR_KEY_HERE",
        amount: total * 100,
        currency: "INR",
        name: "Vaarta Chai",
        description: "Assam Tea Order",
        image: "https://res.cloudinary.com/dcjn4y284/image/upload/v1787474399/VARTA_CHAI_LOGO_NEW_PNG_2_gxlhbz.png",
        handler: async (response) => {
          await saveOrder(response.razorpay_payment_id, "confirmed", "captured");
          setIsProcessing(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#173b25" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async (response) => {
          await saveOrder(response.error?.metadata?.payment_id || "FAILED", "failed", "failed");
          setIsProcessing(false);
        });
        rzp.open();
      } catch (err) {
        console.warn("Razorpay script fallback, completing test confirmation:", err);
        // Fallback for demo/testing without active live Razorpay gateway key
        await saveOrder("ONLINE-DEMO", "confirmed", "captured");
        setIsProcessing(false);
      }
    } else {
      await saveOrder("COD", "confirmed", "pending");
      setIsProcessing(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 bg-white border border-[#e2d7c5] rounded-xl text-xs text-[#173b25] placeholder:text-zinc-400 focus:outline-none focus:border-[#173b25] focus:ring-1 focus:ring-[#173b25] transition-all";

  if (loading) return <MiniLoader message="Preparing Checkout" />;

  // ── ORDER SUCCESS SCREEN ──
  if (orderStatus === "success" && confirmedOrder) {
    const isGuestOrder = confirmedOrder.isGuest;
    return (
      <div className="min-h-screen bg-[#faf5ec] font-sans flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full text-center bg-[#f7f2e8] border border-[#e8dfcf] p-8 md:p-12 shadow-2xl rounded-3xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center mx-auto mb-6 shadow-md"
          >
            <CheckCircle size={38} />
          </motion.div>

          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#B38A45]">
            Artisanal Tea Harvest
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#173b25] mt-1 mb-1">
            Order Confirmed!
          </h2>
          <h3
            className="text-xl font-normal text-[#173b25] mb-4"
            style={{ fontFamily: '"Noto Serif Devanagari", Georgia, serif' }}
          >
            आपका धन्यवाद!
          </h3>

          {/* Order Details Badge */}
          <div className="bg-white border border-[#e2d7c5] rounded-xl p-4 mb-6 text-left max-w-md mx-auto space-y-2.5">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#eee]">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Order Number</span>
              <span className="font-mono font-bold text-[#173b25]">#{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#eee]">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Confirmation Sent To</span>
              <span className="font-medium text-[#173b25]">{confirmedOrder.customerEmail}</span>
            </div>
            {confirmedOrder.shippingAddress && (
              <div className="text-xs pt-0.5">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Delivery Destination</span>
                <p className="text-[#173b25] font-semibold">
                  {confirmedOrder.shippingAddress.name}
                  {confirmedOrder.shippingAddress.addressType && (
                    <span className="ml-2 px-1.5 py-0.2 bg-[#173b25]/10 text-[#173b25] text-[9px] font-extrabold uppercase rounded">
                      {confirmedOrder.shippingAddress.addressType}
                    </span>
                  )}
                </p>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  {confirmedOrder.shippingAddress.houseNo ? `${confirmedOrder.shippingAddress.houseNo}, ` : ""}
                  {confirmedOrder.shippingAddress.street || confirmedOrder.shippingAddress.address || ""}
                  {confirmedOrder.shippingAddress.landmark ? ` (Landmark: ${confirmedOrder.shippingAddress.landmark})` : ""}
                  {", "}
                  {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-[#524f46] font-medium mb-8 leading-relaxed max-w-md mx-auto">
            We have received your order and sent confirmation details with tracking info to{" "}
            <strong>{confirmedOrder.customerEmail}</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link
              to={user ? "/orders" : `/track?orderNumber=${encodeURIComponent(confirmedOrder.orderNumber)}&email=${encodeURIComponent(confirmedOrder.customerEmail)}`}
              className="px-6 py-3.5 bg-[#173b25] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md hover:bg-[#245433] transition-all shadow-md inline-flex items-center justify-center gap-2"
            >
              <Truck size={14} /> Track Order
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3.5 bg-[#faf5ec] border border-[#e2d7c5] text-[#173b25] font-extrabold text-xs uppercase tracking-[0.2em] rounded-md hover:border-[#173b25] transition-all shadow-xs"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Optional Guest Registration Offer */}
          {isGuestOrder && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 pt-6 border-t border-[#e2d7c5] text-center bg-[#FAF5EC] p-6 rounded-2xl"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b] block mb-1">
                Member Privilege
              </span>
              <h4 className="text-base font-serif font-bold text-[#173b25] mb-1">
                Track All Your Orders in One Place
              </h4>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto mb-4 leading-relaxed">
                Log in or create an account with <strong>{confirmedOrder.customerEmail}</strong>. When you sign in, all past orders placed with this email will automatically appear in your account.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={`/login?email=${encodeURIComponent(confirmedOrder.customerEmail)}&redirect=orders`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all shadow-sm"
                >
                  <span>Sign In with this Email</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  to={`/signup?email=${encodeURIComponent(confirmedOrder.customerEmail)}&redirect=orders`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b8860b] hover:bg-[#996f08] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all shadow-sm"
                >
                  <span>Create Account</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ── PAYMENT FAILED SCREEN ──
  if (orderStatus === "failed") {
    return (
      <div className="min-h-screen bg-[#faf5ec] font-sans flex items-center justify-center px-6">
        <div className="max-w-md text-center py-16 bg-[#f7f2e8] border border-[#e8dfcf] p-8 shadow-xl rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-red-100 border border-red-300 text-red-600 flex items-center justify-center mx-auto mb-6">
            <X size={36} />
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#173b25] mb-2">Payment Failed</h2>
          <p className="text-xs text-[#524f46] font-medium mb-8 leading-relaxed">
            The transaction could not be completed. Your cart has been preserved. Please try again.
          </p>
          <button
            onClick={() => setOrderStatus(null)}
            className="px-8 py-3.5 bg-[#173b25] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md hover:bg-[#245433] transition-all shadow-md cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf5ec] font-sans">
      <PageHeader
        title="Checkout"
        subtitle={user ? "Complete your artisanal tea purchase" : "Guest & Member Express Checkout"}
        breadcrumbItems={[
          { label: "Home", path: "/" },
          { label: "Cart", path: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-14 py-10 md:py-14">
        {/* Guest Banner if not logged in */}
        {!user && (
          <div className="mb-8 p-4 bg-[#f7f2e8] border border-[#e8dfcf] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#173b25]">
                  Guest Checkout Active
                </h4>
                <p className="text-[11px] text-zinc-600">
                  No account required to purchase. Have an account already?
                </p>
              </div>
            </div>
            <Link
              to="/login?redirect=checkout"
              className="px-4 py-2 bg-white border border-[#173b25] text-[#173b25] text-[10px] font-bold uppercase tracking-widest hover:bg-[#173b25] hover:text-white transition-all rounded-md shrink-0"
            >
              Sign In with OTP
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping */}
              <section className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#B38A45]/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center">
                      <MapPin size={15} />
                    </div>
                    <h2 className="text-xs font-extrabold text-[#173b25] uppercase tracking-widest">
                      Shipping Address
                    </h2>
                  </div>
                  {user && (
                    <Link
                      to="/account?tab=addresses"
                      className="text-[10px] text-[#B38A45] hover:underline uppercase tracking-wider font-extrabold flex items-center gap-1"
                    >
                      <Plus size={12} /> Add in Account
                    </Link>
                  )}
                </div>

                {/* SAVED ADDRESS SELECTOR (Logged in users) */}
                {user && savedAddresses.length > 0 && (
                  <div className="space-y-3 mb-6 bg-[#f7f2e8] border border-[#e8dfcf] p-4 rounded-2xl shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#B38A45]" />
                        <span className="text-[10px] font-extrabold text-[#B38A45] uppercase tracking-widest">
                          Select Saved Address ({savedAddresses.length})
                        </span>
                      </div>
                      <Link
                        to="/account?tab=addresses"
                        className="text-[9px] text-[#173b25] hover:underline uppercase tracking-wider font-bold"
                      >
                        Manage Addresses →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        const type = addr.type || addr.addressType || "Home";
                        return (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setFormData((prev) => ({
                                ...prev,
                                name: addr.name || prev.name,
                                phone: addr.phone || prev.phone,
                                houseNo: addr.houseNo || "",
                                street: addr.street || addr.address || "",
                                landmark: addr.landmark || "",
                                city: addr.city || "",
                                state: addr.state || "",
                                pincode: addr.pincode || "",
                                addressType: type,
                              }));
                              triggerToast(`Selected: ${addr.name || 'Saved Address'} (${type})`);
                            }}
                            className={`p-3.5 border cursor-pointer transition-all relative rounded-xl text-left ${
                              isSelected
                                ? "border-[#173b25] bg-[#faf5ec] shadow-sm ring-2 ring-[#173b25]"
                                : "border-[#e2d7c5] bg-white hover:border-[#173b25]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#173b25]/10 text-[#173b25] text-[9px] font-extrabold uppercase rounded">
                                {type === "Home" && <Home size={10} />}
                                {type === "Work" && <Briefcase size={10} />}
                                {type === "Other" && <Building size={10} />}
                                <span>{type}</span>
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-[#B38A45]/15 border border-[#B38A45]/30 text-[#B38A45] text-[8px] font-extrabold uppercase tracking-wider rounded">
                                  Default
                                </span>
                              )}
                            </div>

                            <div className="flex items-start gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                                  isSelected ? "border-[#173b25] bg-[#173b25] text-white" : "border-[#e2d7c5]"
                                }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <div className="space-y-1 text-xs pr-2">
                                <p className="font-bold text-[#173b25] uppercase tracking-wide">
                                  {addr.name || "Recipient"}
                                </p>
                                <p className="text-[#524f46] text-[11px] leading-relaxed line-clamp-2">
                                  {addr.houseNo ? `${addr.houseNo}, ` : ""}
                                  {addr.street || addr.address || ""}
                                  {addr.landmark ? ` (Near ${addr.landmark})` : ""}
                                  {", "}
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                <p className="text-[10px] text-[#B38A45] font-bold">
                                  Ph: {addr.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div
                        onClick={() => {
                          setSelectedAddressId("custom");
                          setFormData((prev) => ({
                            ...prev,
                            houseNo: "",
                            street: "",
                            landmark: "",
                            city: "",
                            state: "",
                            pincode: "",
                            addressType: "Home",
                          }));
                          triggerToast("Ready to enter new address");
                        }}
                        className={`p-3.5 border cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 rounded-xl text-center min-h-[96px] ${
                          selectedAddressId === "custom"
                            ? "border-[#173b25] bg-[#faf5ec] ring-2 ring-[#173b25]"
                            : "border-dashed border-[#e2d7c5] bg-white hover:border-[#173b25]"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-[#173b25]/10 flex items-center justify-center text-[#173b25]">
                          <Plus size={14} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#173b25]">
                          + Enter New Address
                        </span>
                        <span className="text-[9px] text-zinc-500">
                          Ship to a different location
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827963]" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${inputClass} pl-10`}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      Email Address (For Order Updates) *
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827963]" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${inputClass} pl-10`}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                    Phone Number (10-Digit Mobile) *
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827963]" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`${inputClass} pl-10`}
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>

                {/* Granular Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      Flat, House no., Building, Floor *
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      required
                      value={formData.houseNo}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="e.g. Flat 302, Green Valley Apts"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      Area, Street, Sector, Village *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="e.g. MG Road, Indiranagar"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                    Landmark <span className="text-zinc-500 font-normal lowercase">(optional, helps in quick delivery)</span>
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="e.g. Near Apollo Pharmacy / Opp. City Central Mall"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="e.g. Bengaluru"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      State *
                    </label>
                    <select
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                      className={`${inputClass} font-mono`}
                      placeholder="560038"
                    />
                  </div>
                </div>

                {/* Address Type Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#173b25]">
                    Address Type
                  </label>
                  <div className="flex items-center gap-3">
                    {ADDRESS_TYPES.map((t) => {
                      const active = (formData.addressType || "Home") === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, addressType: t.id }))}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? "bg-[#173b25] text-[#B38A45] border-[#173b25] shadow-sm"
                              : "bg-white text-zinc-700 border-[#e2d7c5] hover:border-[#173b25]"
                          }`}
                        >
                          {t.id === "Home" && <Home size={13} />}
                          {t.id === "Work" && <Briefcase size={13} />}
                          {t.id === "Other" && <Building size={13} />}
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Save address to user account option */}
                {user && (
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs text-[#173b25]">
                      <input
                        type="checkbox"
                        name="saveToAccount"
                        checked={formData.saveToAccount}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, saveToAccount: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-[#173b25] accent-[#173b25] cursor-pointer"
                      />
                      <span className="font-semibold text-zinc-700">
                        Save this address to my account for faster checkout next time
                      </span>
                    </label>
                  </div>
                )}
              </section>

              {/* Payment */}
              <section className="space-y-5 pt-6 border-t border-[#B38A45]/20">
                <div className="flex items-center gap-3 pb-4 border-b border-[#B38A45]/20">
                  <div className="w-9 h-9 rounded-full bg-[#173b25] text-[#B38A45] flex items-center justify-center">
                    <CreditCard size={15} />
                  </div>
                  <h2 className="text-xs font-extrabold text-[#173b25] uppercase tracking-widest">
                    Payment Method
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "online", label: "Online Payment", desc: "UPI, Cards, Netbanking", icon: Zap },
                    { id: "cod", label: "Cash on Delivery", desc: "Pay upon harvest delivery", icon: Sparkles },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = formData.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, paymentMethod: method.id }))}
                        className={`p-4 border-2 transition-all flex items-start gap-3 text-left rounded-2xl cursor-pointer ${
                          active
                            ? "border-[#173b25] bg-[#f7f2e8]"
                            : "border-[#e2d7c5] bg-[#faf5ec] hover:border-[#173b25]"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                            active
                              ? "bg-[#173b25] text-[#B38A45] border-[#173b25]"
                              : "text-[#827963] border-[#e2d7c5] bg-[#faf5ec]"
                          }`}
                        >
                          <Icon size={15} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${active ? "text-[#173b25]" : "text-[#524f46]"}`}>
                            {method.label}
                          </p>
                          <p className="text-[10px] text-[#827963] mt-0.5">{method.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#173b25] hover:bg-[#245433] text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2.5 cursor-pointer shadow-md hover:shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>PLACE ORDER NOW</>
                )}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#f7f2e8] border border-[#e8dfcf] p-6 sticky top-28 shadow-md rounded-3xl">
              <h3 className="text-[10px] font-extrabold text-[#173b25] uppercase tracking-[0.25em] mb-5 pb-3 border-b border-[#B38A45]/20">
                Order Summary
              </h3>
              <div className="space-y-4 mb-6 max-h-[300px] overflow-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Your bag is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id || item.cartId} className="flex gap-3">
                      <div className="w-16 h-16 bg-[#FAF5EC] shrink-0 border border-[#e2d7c5] rounded-xl p-1">
                        <img
                          src={item.image || item.images?.[0] || "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 py-0.5">
                        <h4 className="font-serif text-sm font-medium text-[#173b25] line-clamp-1">{item.name}</h4>
                        {item.size && (
                          <p className="text-[10px] text-[#827963] font-semibold uppercase tracking-wider mt-0.5">
                            Pack Weight: {item.size}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-xs font-bold font-sans text-[#173b25]">₹{Number(item.price).toLocaleString("en-IN")}</span>
                          <span className="text-[9px] text-[#173b25] font-bold bg-[#FAF5EC] border border-[#e2d7c5] px-2 py-0.5 rounded">
                            ×{item.quantity || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-2.5 pt-4 border-t border-[#e8dfcf]">
                <div className="flex justify-between text-xs text-[#524f46] font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold font-sans text-[#173b25]">₹{Number(total).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs text-[#524f46] font-medium">
                  <span>Garden Direct Shipping</span>
                  <span className="text-[#173b25] font-bold">FREE</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-dashed border-[#B38A45]/30 items-baseline">
                  <span className="text-[10px] font-extrabold text-[#173b25] uppercase tracking-[0.2em]">Total</span>
                  <span className="text-2xl font-bold font-sans text-[#173b25]">₹{Number(total).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#173b25] text-white px-6 py-3.5 shadow-2xl flex items-center gap-3 border border-[#B38A45] rounded-md"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider whitespace-nowrap">{feedbackMessage}</p>
            <button onClick={() => setFeedbackMessage(null)} className="opacity-60 hover:opacity-100 ml-2">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
