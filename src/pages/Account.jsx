import React, { useState, useEffect } from "react";
import MiniLoader from "../components/MiniLoader";
import { useAuth } from "../components/useAuth";
import { auth, db } from "../components/Firebase";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where, updateDoc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { uploadToCloudinary } from "../utils/cloudinary";
import {
  User, Package, Heart, LogOut, ChevronRight, Settings, ShoppingBag,
  CreditCard, MapPin, Bell, Camera, Plus, Trash2, Edit3, Check, X,
  ShieldCheck, Truck, RotateCcw, Download, Printer, Phone, CheckCircle2, Clock, AlertCircle,
  Home, Briefcase, Building
} from "lucide-react";
import { INDIAN_STATES, ADDRESS_TYPES } from "../utils/addressConstants";

const Account = () => {
  const { user, logout, setAccountPassword, linkGuestOrders } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userData, setUserData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ cart: 0, wishlist: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  const tabFromUrl = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTabState] = useState(tabFromUrl);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTabState(tabParam);
    }
  }, [searchParams]);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true });
  };

  // Modals & Feedback
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Forms
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Saved Addresses
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    type: "Home",
    isDefault: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Stored Payments
  const [payments, setPayments] = useState([
    { id: "p1", cardHolder: "MEMBER USER", cardNumber: "•••• •••• •••• 4242", expiry: "12/29", brand: "Visa" }
  ]);
  const [newCard, setNewCard] = useState({ cardHolder: "", cardNumber: "", expiry: "", brand: "Visa" });
  const [showCardForm, setShowCardForm] = useState(false);

  // Notifications Preferences
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotionalOffers: false,
    newsletter: true,
    securityAlerts: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Security & Password setup
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [syncingOrders, setSyncingOrders] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters in length.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast("Passwords do not match. Please re-enter.");
      return;
    }
    setSavingPassword(true);
    try {
      await setAccountPassword(newPassword);
      showToast("Password updated successfully! You can now log in using either OTP or password.");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      showToast(err.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleManualSyncOrders = async () => {
    setSyncingOrders(true);
    try {
      const res = await linkGuestOrders(user);
      if (res?.linkedCount > 0) {
        showToast(`Linked ${res.linkedCount} previous guest order(s) to your account!`);
        fetchData();
      } else {
        showToast("All eligible orders for your email are already linked.");
      }
    } catch (err) {
      showToast("Order sync notice: " + err.message);
    } finally {
      setSyncingOrders(false);
    }
  };

  const fetchData = async () => {
    if (!user) return;
    try {
      // 1. User doc
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        const d = userSnap.data();
        setUserData(d);
        setDisplayName(d.displayName || user.displayName || "");
        setPhone(d.phone || user.phoneNumber || "");
        setBio(d.bio || "");
      } else {
        setDisplayName(user.displayName || "");
        setPhone(user.phoneNumber || "");
      }

      // 2. Stats & Orders
      const cartSnap = await getDocs(collection(db, "users", user.uid, "cart"));
      const wishlistSnap = await getDocs(collection(db, "users", user.uid, "wishlist"));
      const ordersMap = new Map();
      try {
        const ordersSnap = await getDocs(query(collection(db, "orders"), where("userId", "==", user.uid)));
        ordersSnap.docs.forEach((d) => ordersMap.set(d.id, { id: d.id, ...d.data() }));
      } catch (err) {
        console.warn("Account orders by userId error:", err);
      }

      if (user.email) {
        const cleanEmail = user.email.trim().toLowerCase();
        try {
          const emailSnap = await getDocs(query(collection(db, "orders"), where("customerEmail", "==", cleanEmail)));
          emailSnap.docs.forEach((d) => {
            if (!ordersMap.has(d.id)) {
              ordersMap.set(d.id, { id: d.id, ...d.data() });
            }
          });
        } catch (err) {
          console.warn("Account orders by email error:", err);
        }
      }

      const ordersList = Array.from(ordersMap.values());
      ordersList.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0);
        return timeB - timeA;
      });
      setRecentOrders(ordersList);
      setStats({
        cart: cartSnap.size,
        wishlist: wishlistSnap.size,
        orders: ordersList.length
      });

      // 3. Addresses
      const addressSnap = await getDocs(collection(db, "users", user.uid, "addresses"));
      setAddresses(addressSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error loading account data:", error);
    } finally {
      setLoading(false);
      setDataReady(true);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Avatar Upload directly to Cloudinary
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const imageUrl = await uploadToCloudinary(file, "avatars");

      await updateProfile(auth.currentUser, { photoURL: imageUrl });
      await setDoc(doc(db, "users", user.uid), { photoURL: imageUrl }, { merge: true });

      setUserData(prev => ({ ...prev, photoURL: imageUrl }));
      showToast("Profile picture updated!");
    } catch (err) {
      showToast("Avatar update failed: " + err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Profile fields submit
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        phone,
        bio,
        email: user.email,
        updatedAt: new Date()
      }, { merge: true });

      setUserData(prev => ({ ...prev, displayName, phone, bio }));
      showToast("Profile details updated successfully!");
    } catch (err) {
      showToast("Error saving profile: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Addresses CRUD
  const resetAddressForm = () => {
    setAddressForm({
      name: "",
      phone: "",
      houseNo: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      type: "Home",
      isDefault: false
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || (!addressForm.street && !addressForm.houseNo) || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      showToast("Please fill all required address fields (Name, Phone, Address, City, State, Pincode).");
      return;
    }

    const combinedAddress = [
      addressForm.houseNo,
      addressForm.street,
      addressForm.landmark ? `(Landmark: ${addressForm.landmark})` : ''
    ].filter(Boolean).join(', ') || addressForm.address || '';

    const payload = {
      ...addressForm,
      address: combinedAddress,
      name: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      houseNo: (addressForm.houseNo || "").trim(),
      street: (addressForm.street || "").trim(),
      landmark: (addressForm.landmark || "").trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: addressForm.pincode.trim(),
      type: addressForm.type || "Home",
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingAddressId) {
        // If set as default, update other addresses
        if (payload.isDefault) {
          for (const a of addresses) {
            if (a.id !== editingAddressId && a.isDefault) {
              await updateDoc(doc(db, "users", user.uid, "addresses", a.id), { isDefault: false });
            }
          }
        }
        await updateDoc(doc(db, "users", user.uid, "addresses", editingAddressId), payload);
        setAddresses(prev => prev.map(a => a.id === editingAddressId ? { ...a, ...payload } : (payload.isDefault ? { ...a, isDefault: false } : a)));
        showToast("Address updated successfully!");
      } else {
        const isFirst = addresses.length === 0;
        if (payload.isDefault || isFirst) {
          payload.isDefault = true;
          for (const a of addresses) {
            if (a.isDefault) {
              await updateDoc(doc(db, "users", user.uid, "addresses", a.id), { isDefault: false });
            }
          }
        }
        const docRef = await addDoc(collection(db, "users", user.uid, "addresses"), {
          ...payload,
          createdAt: new Date().toISOString()
        });
        setAddresses(prev => [
          ...(payload.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev),
          { id: docRef.id, ...payload }
        ]);
        showToast("New address added successfully!");
      }
      resetAddressForm();
    } catch (err) {
      console.error(err);
      showToast("Failed to save address: " + err.message);
    }
  };

  const handleEditAddressInit = (addr) => {
    setAddressForm({
      name: addr.name || "",
      phone: addr.phone || "",
      houseNo: addr.houseNo || "",
      street: addr.street || addr.address || "",
      landmark: addr.landmark || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      type: addr.type || "Home",
      isDefault: addr.isDefault || false
    });
    setEditingAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "addresses", id));
      setAddresses(prev => prev.filter(a => a.id !== id));
      showToast("Address deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const updatedList = addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }));
      setAddresses(updatedList);
      for (const a of updatedList) {
        await updateDoc(doc(db, "users", user.uid, "addresses", a.id), { isDefault: a.id === id });
      }
      showToast("Default address updated!");
    } catch (err) {
      console.error(err);
    }
  };

  // Payment Cards
  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCard.cardNumber || !newCard.cardHolder) return;
    const maskedCard = `•••• •••• •••• ${newCard.cardNumber.slice(-4)}`;
    const cardData = { ...newCard, id: Date.now().toString(), cardNumber: maskedCard };
    setPayments(prev => [...prev, cardData]);
    setNewCard({ cardHolder: "", cardNumber: "", expiry: "", brand: "Visa" });
    setShowCardForm(false);
    showToast("Card saved to profile!");
  };

  const handleDeleteCard = (cardId) => {
    setPayments(prev => prev.filter(p => p.id !== cardId));
    showToast("Card removed");
  };

  // INVOICE GENERATION & PRINT
  const handleDownloadInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank', 'width=850,height=950');
    if (!invoiceWindow) {
      alert("Please allow popups to download or print your invoice.");
      return;
    }

    const orderDate = order.createdAt?.toDate
      ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : (order.createdAt?.toMillis
        ? new Date(order.createdAt.toMillis()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Recent Date');

    const itemsList = order.items || [];
    const itemsRows = itemsList.map((item, idx) => `
      <tr>
        <td style="padding: 12px 14px; border-bottom: 1px solid #eeeeee; font-size: 12px; color: #555;">${idx + 1}</td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #eeeeee; font-size: 12px; font-weight: 600; color: #111;">
          ${item.name}
          ${item.size ? `<span style="font-size:10px; color:#777; font-weight: normal; margin-left: 6px;">(Size: ${item.size})</span>` : ''}
        </td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #eeeeee; font-size: 12px; text-align: center; color: #333;">${item.quantity || 1}</td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #eeeeee; font-size: 12px; text-align: right; color: #333;">₹${(item.price || 0).toLocaleString()}</td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #eeeeee; font-size: 12px; text-align: right; font-weight: 700; color: #000;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    const shippingAddr = order.shippingAddress || order.shipping || {};
    const recipientName = shippingAddr.name || displayName || user?.displayName || 'Valued Customer';
    const recipientPhone = shippingAddr.phone || phone || 'N/A';

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Invoice #${order.id.slice(0, 10).toUpperCase()} - VAARTA CHAI</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; background: #fafafa; }
            .container { max-width: 800px; margin: 0 auto; background: #ffffff; padding: 40px; border: 1px solid #e5e5e5; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111111; padding-bottom: 24px; margin-bottom: 32px; }
            .brand { font-size: 28px; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; color: #000; margin: 0; }
            .tagline { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-top: 4px; }
            .inv-meta { text-align: right; }
            .inv-meta h2 { margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #111; }
            .inv-meta p { margin: 4px 0 0; font-size: 11px; color: #666; }
            .addresses { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 36px; }
            .address-box { width: 48%; font-size: 12px; line-height: 1.6; }
            .address-box h3 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin: 0 0 10px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f5f5f5; padding: 12px 14px; text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #444; border-bottom: 1px solid #ddd; }
            .summary { display: flex; justify-content: flex-end; margin-bottom: 30px; }
            .summary-table { width: 320px; font-size: 12px; }
            .summary-table td { padding: 8px 12px; }
            .total-row { font-weight: 800; font-size: 15px; border-top: 2px solid #111; border-bottom: 2px solid #111; color: #000; }
            .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px; text-align: center; font-size: 11px; color: #888; }
            .actions { margin-bottom: 24px; text-align: right; }
            .btn-print { background: #000; color: #fff; border: none; padding: 12px 24px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer; border-radius: 2px; }
            .btn-print:hover { background: #222; }
            @media print {
              body { padding: 0; background: #fff; }
              .container { border: none; shadow: none; padding: 0; }
              .actions { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="actions">
            <button class="btn-print" onclick="window.print()">Print / Save PDF Invoice</button>
          </div>
          <div class="container">
            <div class="header">
              <div>
                <h1 class="brand">VAARTA CHAI</h1>
                <div class="tagline">Artisanal Tea Estate & Blends</div>
              </div>
              <div class="inv-meta">
                <h2>TAX INVOICE</h2>
                <p>Invoice #: <strong>INV-${order.id.slice(0, 10).toUpperCase()}</strong></p>
                <p>Date: ${orderDate}</p>
                <p>Status: <strong style="color: #10B981;">PAID</strong></p>
              </div>
            </div>

            <div class="addresses">
              <div class="address-box">
                <h3>Billed & Shipped To</h3>
                <strong>${recipientName}</strong><br />
                ${shippingAddr.address || 'Standard Address'}<br />
                ${shippingAddr.city ? `${shippingAddr.city}, ${shippingAddr.state} - ${shippingAddr.pincode}` : ''}<br />
                Phone: ${recipientPhone}<br />
                Email: ${user?.email || 'N/A'}
              </div>
              <div class="address-box" style="text-align: right;">
                <h3>Order Info</h3>
                Order Reference: #${order.id.slice(0, 14).toUpperCase()}<br />
                Payment Method: ${(order.paymentMethod || 'Online').toUpperCase()}<br />
                Fulfillment Status: <strong>${(order.status || 'Confirmed').toUpperCase()}</strong><br />
                Shipping Standard: Free Priority Delivery
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40px;">#</th>
                  <th>Item Specification</th>
                  <th style="text-align: center; width: 60px;">Qty</th>
                  <th style="text-align: right; width: 110px;">Unit Price</th>
                  <th style="text-align: right; width: 110px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="summary">
              <table class="summary-table">
                <tr>
                  <td>Items Subtotal</td>
                  <td style="text-align: right;">₹${(order.total || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Express Shipping</td>
                  <td style="text-align: right; color: #10B981; font-weight: 600;">FREE</td>
                </tr>
                <tr>
                  <td>Estimated GST (Included)</td>
                  <td style="text-align: right;">₹0</td>
                </tr>
                <tr class="total-row">
                  <td style="padding-top: 12px; padding-bottom: 12px;">Grand Total</td>
                  <td style="text-align: right; padding-top: 12px; padding-bottom: 12px;">₹${(order.total || 0).toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>Thank you for choosing Vaarta Chai. For support or queries regarding this invoice, please reach us at support@vartachai.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
  };

  if (loading) {
    return <MiniLoader message="Loading Account" />;
  }

  return (
    <div className="min-h-screen bg-[#faf5ec] font-sans text-zinc-900 pt-[72px] md:pt-[80px] pb-24 px-4 sm:px-6 md:px-10 lg:px-14 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-[100] bg-black text-white px-6 py-3.5 shadow-2xl flex items-center gap-3 border border-zinc-800 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <p className="text-[11px] font-bold uppercase tracking-wider">{toastMessage}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto pt-8 md:pt-12">

        {/* PROFILE HEADER CARD */}
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 md:p-10 mb-8 relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="relative group">
                <div className="w-24 h-24 bg-zinc-100 border border-zinc-300 flex items-center justify-center text-zinc-800 overflow-hidden relative rounded-full">
                  {userData?.photoURL ? (
                    <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} strokeWidth={1.2} className="text-zinc-400" />
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity rounded-full">
                  <Camera size={20} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl font-light text-zinc-900 uppercase tracking-widest">
                    {userData?.displayName || user?.displayName || "Tea Connoisseur"}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-[#b8860b]/10 border border-[#b8860b]/30 text-[#b8860b] text-[8px] font-black uppercase tracking-widest">Client Member</span>
                </div>
                <p className="text-xs text-zinc-500">{user?.email}</p>
                {phone && (
                  <p className="text-[11px] text-[#b8860b] flex items-center justify-center md:justify-start gap-1 font-semibold">
                    <Phone size={10} /> {phone}
                  </p>
                )}
                {userData?.bio && <p className="text-[11px] text-zinc-500 italic max-w-sm leading-relaxed">{userData.bio}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activeTab !== "overview" && (
                <button onClick={() => setActiveTab("overview")} className="h-10 px-5 border border-zinc-300 text-zinc-700 text-[10px] font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all bg-white">
                  Overview
                </button>
              )}
              <button onClick={handleLogout}
                className="h-10 px-5 bg-zinc-100 border border-zinc-300 text-zinc-700 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all flex items-center gap-2"
              >
                <LogOut size={12} strokeWidth={2} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* CONTAINER GRID */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Link to="/cart" className="group bg-white border border-zinc-200 p-4 hover:border-black/30 transition-all text-center sm:text-left shadow-sm">
                <div className="w-8 h-8 border border-zinc-300 flex items-center justify-center text-zinc-500 mb-2 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all mx-auto sm:mx-0">
                  <ShoppingBag size={13} strokeWidth={1.5} />
                </div>
                <p className="text-xl font-light text-zinc-900 tracking-wider">{stats.cart}</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">In Cart</p>
              </Link>

              <Link to="/wishlist" className="group bg-white border border-zinc-200 p-4 hover:border-black/30 transition-all text-center sm:text-left shadow-sm">
                <div className="w-8 h-8 border border-zinc-300 flex items-center justify-center text-zinc-500 mb-2 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all mx-auto sm:mx-0">
                  <Heart size={13} strokeWidth={1.5} />
                </div>
                <p className="text-xl font-light text-zinc-900 tracking-wider">{stats.wishlist}</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Wishlist</p>
              </Link>

              <button onClick={() => setActiveTab("orders")} className="group bg-white border border-zinc-200 p-4 hover:border-black/30 transition-all text-center sm:text-left shadow-sm">
                <div className="w-8 h-8 border border-zinc-300 flex items-center justify-center text-zinc-500 mb-2 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all mx-auto sm:mx-0">
                  <Package size={13} strokeWidth={1.5} />
                </div>
                <p className="text-xl font-light text-zinc-900 tracking-wider">{stats.orders}</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Orders</p>
              </button>
            </div>

            {/* Nav Menu */}
            <div className="bg-white border border-zinc-200 p-1.5 shadow-sm">
              <span className="block px-3 py-2 text-[9px] font-bold text-zinc-400 uppercase tracking-[0.3em]">Account Panel</span>
              {[
                { id: "profile", icon: Settings, label: "Profile & Phone" },
                { id: "orders", icon: Package, label: "Orders & Invoices" },
                { id: "addresses", icon: MapPin, label: "Shipping Addresses" },
                { id: "payments", icon: CreditCard, label: "Saved Cards" },
                { id: "security", icon: ShieldCheck, label: "Security & Password" },
                { id: "notifications", icon: Bell, label: "Notification Preferences" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 transition-all group text-left ${activeTab === item.id ? 'bg-zinc-100' : 'hover:bg-zinc-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 border flex items-center justify-center transition-colors ${activeTab === item.id ? 'bg-black text-white border-black' : 'border-zinc-300 text-zinc-500 group-hover:bg-black group-hover:text-white group-hover:border-black'}`}>
                      <item.icon size={11} strokeWidth={1.5} />
                    </div>
                    <span className={`text-[12px] font-semibold transition-colors ${activeTab === item.id ? 'text-zinc-900' : 'text-zinc-600 group-hover:text-black'}`}>{item.label}</span>
                  </div>
                  <ChevronRight size={11} className={`text-zinc-400 group-hover:text-black transition-all ${activeTab === item.id ? 'translate-x-1 text-black' : 'group-hover:translate-x-0.5'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* MAIN DYNAMIC CONTENT */}
          <div className="lg:col-span-8">

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Recent Orders Overview */}
                <div className="bg-white border border-zinc-200 p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200">
                    <div>
                      <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Recent Purchases</h3>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Track shipment timeline & download tax invoices</p>
                    </div>
                    {recentOrders.length > 0 && (
                      <button onClick={() => setActiveTab("orders")} className="h-8 px-4 border border-zinc-300 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider hover:border-black hover:text-black transition-all flex items-center">
                        View All ({recentOrders.length})
                      </button>
                    )}
                  </div>

                  {recentOrders.length > 0 ? (
                    <div className="divide-y divide-zinc-200">
                      {recentOrders.slice(0, 3).map((order) => (
                        <div key={order.id}
                          className="group py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <div className="w-10 h-10 border border-zinc-300 flex items-center justify-center text-zinc-500 group-hover:border-black group-hover:text-black transition-all">
                              <Package size={16} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-zinc-800 group-hover:text-black transition-colors">
                                #{order.id.slice(0, 10).toUpperCase()}
                              </p>
                              <p className="text-[11px] text-zinc-500">
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                              </p>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto flex sm:flex-row items-center justify-between sm:justify-end gap-3">
                            <div className="text-right">
                              <p className="text-sm font-bold text-zinc-900">₹{order.total?.toLocaleString()}</p>
                              <span className={`inline-block px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${order.status === 'confirmed' || order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : order.status === 'failed' ? 'bg-red-50 text-red-700 border-red-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-300'
                                }`}>{order.status || 'Confirmed'}</span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-2 bg-zinc-100 border border-zinc-300 text-zinc-800 text-[9px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleDownloadInvoice(order)}
                                className="p-2 border border-zinc-300 text-[#b8860b] hover:bg-[#b8860b] hover:text-white transition-all"
                                title="Download Invoice"
                              >
                                <Download size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border border-zinc-300 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                      </div>
                      <h4 className="text-sm font-light text-zinc-900 uppercase tracking-widest mb-1">No orders yet</h4>
                      <p className="text-[11px] text-zinc-500 mb-4">Start exploring the shop to place your first order.</p>
                      <Link to="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-[9px] uppercase tracking-widest hover:bg-zinc-800 transition-all">
                        Explore Shop <ChevronRight size={11} />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Primary Shipping Address Overview */}
                <div className="bg-white border border-zinc-200 p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#b8860b]" />
                      <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Primary Shipping Address</h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          resetAddressForm();
                          setActiveTab("addresses");
                          setShowAddressForm(true);
                        }}
                        className="text-[10px] text-[#173b25] hover:text-[#b8860b] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                      >
                        <Plus size={12} /> Add New Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("addresses")}
                        className="text-[10px] text-zinc-500 hover:text-black font-semibold uppercase tracking-wider"
                      >
                        Manage ({addresses.length})
                      </button>
                    </div>
                  </div>

                  {addresses.length > 0 ? (
                    (() => {
                      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
                      const displayAddr = [
                        defaultAddr.houseNo,
                        defaultAddr.street || defaultAddr.address,
                        defaultAddr.landmark ? `(Landmark: ${defaultAddr.landmark})` : '',
                      ].filter(Boolean).join(', ');

                      return (
                        <div className="text-xs text-zinc-700 space-y-1.5 bg-zinc-50 p-4 border border-zinc-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-900 uppercase tracking-wider">{defaultAddr.name}</span>
                            <span className="px-2 py-0.5 bg-[#173b25] text-white text-[9px] font-bold uppercase rounded">
                              {defaultAddr.type || "Default"}
                            </span>
                          </div>
                          <p className="text-zinc-600 leading-relaxed text-[11px]">{displayAddr}</p>
                          <p className="text-zinc-700 font-medium text-[11px]">{defaultAddr.city}, {defaultAddr.state} - {defaultAddr.pincode}</p>
                          <p className="text-[11px] text-[#173b25] font-semibold pt-0.5 flex items-center gap-1">
                            <Phone size={11} /> +91 {defaultAddr.phone}
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-6 bg-zinc-50 border border-dashed border-zinc-300 rounded-lg p-6">
                      <p className="text-xs text-zinc-600 mb-3">You don't have any saved shipping addresses yet.</p>
                      <button
                        type="button"
                        onClick={() => {
                          resetAddressForm();
                          setActiveTab("addresses");
                          setShowAddressForm(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#173b25] text-white hover:bg-[#245433] text-[10px] font-bold uppercase tracking-widest rounded transition-all shadow-xs"
                      >
                        <Plus size={12} /> Add Shipping Address
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: PROFILE & PHONE */}
            {activeTab === "profile" && (
              <div className="bg-white border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="pb-4 border-b border-zinc-200">
                  <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Personal Information</h3>
                  <p className="text-[11px] text-zinc-500">Update your profile name, contact number, and biography</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Profile Name</label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        placeholder="Your Full Name"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Registered Email (Read-only)</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 text-xs text-zinc-500 cursor-not-allowed outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Short Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share your fashion preferences..."
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-8 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {savingProfile ? "Saving Details..." : "Save Profile Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB: ORDERS & INVOICES */}
            {activeTab === "orders" && (
              <div className="bg-white border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="pb-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Order History & Invoices</h3>
                    <p className="text-[11px] text-zinc-500">Track shipments and download official invoices</p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Total Orders: {recentOrders.length}</span>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 bg-zinc-50 border border-zinc-200 hover:border-zinc-400 transition-all rounded space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                          <div>
                            <span className="text-[9px] text-[#b8860b] font-black uppercase tracking-widest">Order Reference</span>
                            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">#{order.id.slice(0, 14).toUpperCase()}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest border ${order.status === 'confirmed' || order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : order.status === 'failed' ? 'bg-red-50 text-red-700 border-red-300'
                                  : 'bg-amber-50 text-amber-700 border-amber-300'
                              }`}>{order.status || 'Confirmed'}</span>

                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="px-3 py-1 bg-white border border-zinc-300 hover:bg-[#b8860b] hover:text-white text-[#b8860b] text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                            >
                              <Download size={11} /> Invoice
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] text-zinc-600">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Date Placed</span>
                            <span className="text-zinc-900">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN') : 'Recent'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Total Amount</span>
                            <span className="text-zinc-900 font-bold">₹{order.total?.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Payment Method</span>
                            <span className="text-zinc-900 uppercase">{order.paymentMethod || 'Online'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Items</span>
                            <span className="text-zinc-900">{order.items?.length || 1} Item(s)</span>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-[10px] text-zinc-600 hover:text-black font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                          >
                            Track & View Full Order Details <ChevronRight size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">No order history available.</p>
                    <Link to="/shop" className="px-6 py-3 bg-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all inline-block">
                      Browse Shop
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SHIPPING ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-white border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="pb-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Saved Addresses</h3>
                    <p className="text-[11px] text-zinc-500">Manage your delivery destinations for fast & seamless checkout</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (showAddressForm) resetAddressForm();
                      else {
                        resetAddressForm();
                        setShowAddressForm(true);
                      }
                    }}
                    className="h-9 px-4 bg-[#173b25] text-white hover:bg-[#245433] text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-sm shadow-xs shrink-0"
                  >
                    <Plus size={13} /> {showAddressForm ? "Close Form" : "Add New Address"}
                  </button>
                </div>

                {/* COMPLETE ADDRESS FORM */}
                {showAddressForm && (
                  <form onSubmit={handleSaveAddress} className="bg-[#faf5ec] border border-[#e2d7c5] p-6 space-y-5 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e2d7c5]">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#173b25] flex items-center gap-2">
                        <MapPin size={14} className="text-[#b8860b]" />
                        {editingAddressId ? "Edit Shipping Address" : "Add New Shipping Address"}
                      </h4>
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="text-zinc-400 hover:text-zinc-800 text-xs"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Address Type Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider block">
                        Address Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ADDRESS_TYPES.map((t) => {
                          const isSelected = addressForm.type === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setAddressForm({ ...addressForm, type: t.id })}
                              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#173b25] text-white border-[#173b25] shadow-xs"
                                  : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                              }`}
                            >
                              {t.id === "Home" && <Home size={12} />}
                              {t.id === "Work" && <Briefcase size={12} />}
                              {t.id === "Other" && <Building size={12} />}
                              <span>{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          required
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          10-Digit Mobile Number *
                        </label>
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                          placeholder="e.g. 9876543210"
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none"
                        />
                      </div>
                    </div>

                    {/* Flat / House No & Street */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          Flat, House no., Building, Floor *
                        </label>
                        <input
                          type="text"
                          value={addressForm.houseNo}
                          onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
                          required
                          placeholder="e.g. Flat 302, Sunrise Heights"
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          Area, Street, Sector, Village *
                        </label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          required
                          placeholder="e.g. MG Road, Indiranagar"
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none"
                        />
                      </div>
                    </div>

                    {/* Landmark */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                        Landmark <span className="text-zinc-400 font-normal">(Optional, helps in faster delivery)</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        placeholder="e.g. Near Apollo Pharmacy / Opp. City Central Mall"
                        className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none"
                      />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                          placeholder="e.g. Bengaluru"
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          State *
                        </label>
                        <select
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none cursor-pointer"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                          6-Digit PIN Code *
                        </label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                          required
                          maxLength={6}
                          placeholder="e.g. 560038"
                          className="w-full px-3 py-2 bg-white border border-[#e2d7c5] rounded-md text-xs text-zinc-900 focus:border-[#173b25] outline-none font-mono"
                        />
                      </div>
                    </div>

                    {/* Set Default */}
                    <div className="pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault}
                          onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          className="rounded text-[#173b25] focus:ring-0 w-4 h-4 cursor-pointer border-zinc-300"
                        />
                        <span className="font-semibold">Set as default delivery address</span>
                      </label>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#173b25] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#245433] transition-colors rounded-md shadow-xs"
                      >
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </button>
                      <button
                        type="button"
                        onClick={resetAddressForm}
                        className="px-5 py-2.5 bg-white border border-zinc-300 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-colors rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* SAVED ADDRESSES LIST */}
                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-14 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl p-8">
                    <div className="w-12 h-12 rounded-full bg-[#173b25]/10 text-[#173b25] flex items-center justify-center mx-auto mb-3">
                      <MapPin size={22} />
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-1">
                      No Saved Addresses Yet
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-5 leading-relaxed">
                      Save your home, office, or frequent shipping addresses here to speed up checkout.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#173b25] hover:bg-[#245433] text-white text-xs font-bold uppercase tracking-widest rounded-md transition-all shadow-sm"
                    >
                      <Plus size={14} /> Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((a) => {
                      const displayAddr = [
                        a.houseNo,
                        a.street || a.address,
                        a.landmark ? `(Landmark: ${a.landmark})` : "",
                      ].filter(Boolean).join(", ");

                      return (
                        <div
                          key={a.id}
                          className={`p-5 bg-zinc-50 border transition-all rounded-xl flex flex-col justify-between space-y-4 relative ${
                            a.isDefault ? "border-[#173b25] shadow-xs" : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {/* Badges */}
                          <div className="flex items-center gap-1.5 absolute top-3.5 right-3.5">
                            <span className="px-2 py-0.5 bg-white border border-zinc-300 text-zinc-700 text-[9px] font-bold uppercase tracking-wider rounded">
                              {a.type || "Home"}
                            </span>
                            {a.isDefault && (
                              <span className="px-2 py-0.5 bg-[#173b25] text-white text-[9px] font-bold uppercase tracking-wider rounded">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 text-xs pr-20">
                            <h4 className="font-bold text-zinc-900 tracking-wide uppercase text-sm">
                              {a.name}
                            </h4>
                            <p className="text-zinc-600 leading-relaxed text-[11px]">
                              {displayAddr}
                            </p>
                            <p className="text-zinc-700 font-medium text-[11px]">
                              {a.city}, {a.state} - <span className="font-mono font-bold">{a.pincode}</span>
                            </p>
                            <p className="text-[11px] text-[#173b25] font-semibold flex items-center gap-1 pt-1">
                              <Phone size={11} /> +91 {a.phone}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-zinc-200 text-xs">
                            <div className="flex items-center gap-2">
                              {!a.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(a.id)}
                                  className="text-[10px] text-zinc-600 hover:text-[#173b25] uppercase tracking-wider font-bold transition-colors"
                                >
                                  Set Default
                                </button>
                              )}
                              <Link
                                to="/checkout"
                                className="text-[10px] text-[#b8860b] hover:underline uppercase tracking-wider font-bold transition-colors"
                              >
                                Use in Checkout →
                              </Link>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditAddressInit(a)}
                                className="p-1.5 text-zinc-500 hover:text-black transition-colors rounded hover:bg-zinc-200"
                                title="Edit Address"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(a.id)}
                                className="p-1.5 text-zinc-500 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                                title="Delete Address"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PAYMENT METHODS */}
            {activeTab === "payments" && (
              <div className="bg-white border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="pb-4 border-b border-zinc-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Saved Payment Cards</h3>
                    <p className="text-[11px] text-zinc-500">Manage cards saved for express checkout</p>
                  </div>
                  <button
                    onClick={() => setShowCardForm(!showCardForm)}
                    className="h-8 px-4 border border-zinc-300 text-[9px] font-bold text-[#b8860b] uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all flex items-center gap-1.5"
                  >
                    <Plus size={11} /> {showCardForm ? "Cancel" : "Add Card"}
                  </button>
                </div>

                {showCardForm && (
                  <form onSubmit={handleAddCard} className="bg-zinc-50 border border-zinc-200 p-5 space-y-4 rounded">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Cardholder Name</label>
                        <input
                          type="text"
                          value={newCard.cardHolder}
                          onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                          required
                          placeholder="John Doe"
                          className="w-full px-3 py-2 bg-white border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Card Number</label>
                        <input
                          type="text"
                          value={newCard.cardNumber}
                          onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                          required
                          maxLength={16}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 bg-white border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Expiry Date</label>
                        <input
                          type="text"
                          value={newCard.expiry}
                          onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                          required
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Card Network</label>
                        <select
                          value={newCard.brand}
                          onChange={(e) => setNewCard({ ...newCard, brand: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none"
                        >
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="Rupay">Rupay</option>
                          <option value="Amex">American Express</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="px-4 py-2 bg-black text-white text-[9px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors">
                        Save Card
                      </button>
                      <button type="button" onClick={() => setShowCardForm(false)} className="px-4 py-2 border border-zinc-300 text-zinc-600 text-[9px] font-bold uppercase tracking-wider hover:text-black transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {payments.map((p) => (
                    <div key={p.id} className="p-5 bg-gradient-to-br from-zinc-900 to-black text-white border border-zinc-800 rounded relative overflow-hidden flex flex-col justify-between h-40 shadow-md">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-[#c9a962] tracking-[0.25em] uppercase">{p.brand}</span>
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} strokeWidth={1.2} className="text-white/40" />
                          <button onClick={() => handleDeleteCard(p.id)} className="text-white/40 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-mono tracking-widest text-white">{p.cardNumber}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="block text-[7px] uppercase tracking-wider text-zinc-400 font-bold">Holder</span>
                            <span className="text-[10px] font-bold text-white/80">{p.cardHolder}</span>
                          </div>
                          <div>
                            <span className="block text-[7px] uppercase tracking-wider text-zinc-400 font-bold">Expiry</span>
                            <span className="text-[10px] font-mono font-bold text-white/80">{p.expiry}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: NOTIFICATION PREFERENCES */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-zinc-200 p-6 md:p-8 space-y-6 shadow-sm">
                <div className="pb-4 border-b border-zinc-200">
                  <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Notification Settings</h3>
                  <p className="text-[11px] text-zinc-500">Manage your communication channels and alert preferences</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "orderUpdates", title: "Order Timeline & Tracking Alerts", sub: "Receive real-time SMS & email notifications when shipment status changes" },
                    { key: "promotionalOffers", title: "Exclusive Drops & Offers", sub: "Be first to know about capsule collection releases and exclusive client discounts" },
                    { key: "newsletter", title: "Editorial Newsletter", sub: "Curated brand stories and style guidance" },
                    { key: "securityAlerts", title: "Account Security Alerts", sub: "Instant notifications for password updates or login location flags" }
                  ].map((notif) => (
                    <div key={notif.key} className="flex justify-between items-center p-4 bg-zinc-50 border border-zinc-200 rounded">
                      <div className="max-w-[80%] space-y-0.5">
                        <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{notif.title}</h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed">{notif.sub}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications[notif.key]}
                        onChange={(e) => {
                          setNotifications({ ...notifications, [notif.key]: e.target.checked });
                          showToast("Preference updated");
                        }}
                        className="rounded text-[#b8860b] focus:ring-0 w-4 h-4 cursor-pointer border-zinc-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECURITY & PASSWORD */}
            {activeTab === "security" && (
              <div className="bg-white border border-zinc-200 p-6 md:p-8 space-y-8 shadow-sm">
                <div className="pb-4 border-b border-zinc-200">
                  <h3 className="text-lg font-light text-zinc-900 uppercase tracking-widest">Security & Access</h3>
                  <p className="text-[11px] text-zinc-500">Configure password login and sync past guest orders</p>
                </div>

                {/* Account Details Box */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">Verified Email</span>
                    <strong className="text-zinc-900 font-mono">{user?.email}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">Authentication</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold uppercase tracking-wider rounded">
                      OTP Verified
                    </span>
                  </div>
                </div>

                {/* Set/Update Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1">
                      Set or Update Account Password
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      You can log in anytime with an email OTP. Setting a password enables optional faster password login.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 focus:border-zinc-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-8 py-3.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {savingPassword ? "Updating Password..." : "Save Account Password"}
                  </button>
                </form>

                {/* Guest Orders Sync Box */}
                <div className="pt-6 border-t border-zinc-200 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1">
                      Guest Orders Association
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      If you previously placed tea orders as a guest using <strong>{user?.email}</strong>, click below to re-verify and attach them to your member order history.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleManualSyncOrders}
                    disabled={syncingOrders}
                    className="px-6 py-3 bg-white border border-zinc-300 text-zinc-800 text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck size={14} className="text-[#b8860b]" />
                    <span>{syncingOrders ? "Checking..." : "Re-Sync Guest Orders"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* TRACKING & ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-zinc-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded shadow-2xl text-zinc-900">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[9px] text-[#b8860b] font-black uppercase tracking-widest">Order Details & Tracking</span>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 mt-0.5">
                  Order #{selectedOrder.id.slice(0, 16).toUpperCase()}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="px-3 py-1.5 bg-black text-white text-[9px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                >
                  <Download size={11} /> Invoice
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-zinc-100 rounded text-zinc-500 hover:text-black">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 text-xs">
              {/* STEPPER TIMELINE */}
              <div className="space-y-4 bg-zinc-50 border border-zinc-200 p-5 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Shipment Status</span>
                  <span className="px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider border border-[#b8860b]/40 text-[#b8860b] bg-[#b8860b]/10 rounded">
                    {selectedOrder.status || 'Confirmed'}
                  </span>
                </div>

                <div className="relative pt-2">
                  <div className="h-1 bg-zinc-200 w-full rounded" />
                  <div className={`absolute top-2 h-1 bg-[#b8860b] rounded transition-all duration-500 ${selectedOrder.status === 'delivered' ? 'w-full' : selectedOrder.status === 'shipped' || selectedOrder.status === 'shipping' ? 'w-2/3' : 'w-1/3'
                    }`} />
                  <div className="flex justify-between text-[9px] uppercase tracking-wider mt-3 text-zinc-500 font-bold">
                    <span className="text-zinc-900 flex items-center gap-1"><CheckCircle2 size={10} className="text-[#b8860b]" /> Confirmed</span>
                    <span className={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'text-zinc-900 flex items-center gap-1' : ''}>
                      <Truck size={10} /> Shipped
                    </span>
                    <span className={selectedOrder.status === 'delivered' ? 'text-zinc-900 flex items-center gap-1' : ''}>
                      <Package size={10} /> Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* PURCHASED ITEMS */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Purchased Items ({selectedOrder.items?.length || 1})</span>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center bg-zinc-50 border border-zinc-200 p-3.5 rounded">
                      <div className="w-12 h-14 bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-900 truncate uppercase tracking-wider">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 uppercase mt-0.5">Qty: {item.quantity || 1} {item.size && `| Size: ${item.size}`}</p>
                      </div>
                      <span className="font-bold text-zinc-900 text-sm">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHIPPING & SUMMARY INFO */}
              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-200">
                <div className="space-y-1.5">
                  <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Shipping Destination</span>
                  <p className="text-zinc-700 leading-relaxed">
                    <strong>{selectedOrder.shipping?.name || displayName || 'Valued Customer'}</strong><br />
                    {selectedOrder.shipping?.address}, {selectedOrder.shipping?.city}, {selectedOrder.shipping?.state} - {selectedOrder.shipping?.pincode}<br />
                    Phone: {selectedOrder.shipping?.phone || phone || 'N/A'}
                  </p>
                </div>
                <div className="space-y-2 text-right">
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Payment Status</span>
                    <span className="text-emerald-700 font-bold uppercase">PAID ({selectedOrder.paymentMethod || 'Online'})</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-bold">Grand Total</span>
                    <span className="text-lg font-bold text-zinc-900">₹{(selectedOrder.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder)}
                  className="w-full py-3 bg-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={13} /> Print / Download Tax Invoice
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
