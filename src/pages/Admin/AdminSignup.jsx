import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../components/Firebase";
import { ShieldCheck, Lock, UserCheck, ArrowRight, CheckCircle2, AlertCircle, Leaf, Eye, EyeOff } from "lucide-react";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanAdminId = formData.adminId.trim();

    if (!cleanAdminId) {
      setError("Please enter your Admin ID.");
      return;
    }
    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);

    try {
      // Format email for Firebase Auth (supports both email format & raw username/ID)
      const authEmail = cleanAdminId.includes("@")
        ? cleanAdminId
        : `${cleanAdminId.toLowerCase().replace(/\s+/g, "")}@vaartachai.com`;

      // 1. Create Auth User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, formData.password);
      const user = userCredential.user;

      // 2. Update Auth Display Name with Admin ID
      await updateProfile(user, {
        displayName: cleanAdminId,
      });

      // 3. Save Admin User details in Firestore with role: 'admin' & isAdmin: true
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        adminId: cleanAdminId,
        email: authEmail,
        displayName: cleanAdminId,
        role: "admin",
        isAdmin: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin");
      }, 1200);
    } catch (err) {
      console.error("Admin Signup Error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This Admin ID is already registered. You can log in directly.");
      } else {
        setError(err.message || "Failed to register Admin. Please check details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a140f] text-[#f4f6f4] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#c9a962]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#162a20] border border-[#c9a962]/30 shadow-xl mb-4 text-[#c9a962]">
          <ShieldCheck size={28} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Leaf size={16} className="text-[#c9a962]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c9a962]">Vaarta Chai</span>
        </div>
        <h2 className="text-2xl font-bold tracking-wider text-white uppercase font-serif">
          Admin Registration
        </h2>
        <p className="mt-1 text-xs text-[#9cb5a4]">
          Create administrative login credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-[#12221a] border border-[#1b3327] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Account Created!</h3>
              <p className="text-sm text-[#9cb5a4]">
                Redirecting to Admin Control Center...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Admin ID */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#9cb5a4] mb-1.5">
                  Admin ID
                </label>
                <div className="relative">
                  <UserCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#648773]" />
                  <input
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleChange}
                    placeholder="Enter Admin ID (e.g. admin@vaarta.in or admin_master)"
                    className="w-full bg-[#0a140f] border border-[#1b3327] focus:border-[#c9a962] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-[#648773] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#9cb5a4] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#648773]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0a140f] border border-[#1b3327] focus:border-[#c9a962] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-[#648773] outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#648773] hover:text-[#c9a962] transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#9cb5a4] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#648773]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#0a140f] border border-[#1b3327] focus:border-[#c9a962] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-[#648773] outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#648773] hover:text-[#c9a962] transition-colors focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 py-3.5 bg-[#c9a962] text-[#0a140f] font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#d9b871] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0a140f] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Register Admin <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#1b3327] text-center text-xs text-[#9cb5a4] flex items-center justify-between">
            <Link to="/admin" className="hover:text-[#c9a962] transition-colors flex items-center gap-1">
              ← Back to Admin Login
            </Link>
            <Link to="/" className="hover:text-[#c9a962] transition-colors">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
