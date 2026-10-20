import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const { sendOtp, verifyOtp, setAccountPassword, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: "register" -> "otp_verify" -> "password_setup"
  const [mode, setMode] = useState("register");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  const handleStartOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setInfoMessage("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(email);
      setMode("otp_verify");
      setResendCooldown(60);
      setInfoMessage(res.message || "A 6-digit verification code has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to dispatch verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned && value !== "") return;

    const newOtp = [...otp];
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split("");
      pasted.forEach((char, idx) => {
        newOtp[idx] = char;
      });
      setOtp(newOtp);
      const nextInput = document.getElementById(`signup-otp-${Math.min(pasted.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`signup-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`signup-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, code);
      setMode("password_setup");
      setInfoMessage("Email verified successfully! You may create a password for faster login next time.");
    } catch (err) {
      setError(err.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await setAccountPassword(password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Could not set password. You can set it later in Account Settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(redirectPath);
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Google registration was cancelled or failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col justify-center items-center relative overflow-hidden px-5 py-12">
      <Link
        to="/"
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-all duration-300"
      >
        <span className="text-xs">←</span> Back to Home
      </Link>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-12 gap-12 lg:gap-0 border border-zinc-200 bg-white min-h-[600px] z-10 shadow-xl">
        {/* Left Side: Brand Story */}
        <div className="lg:col-span-5 bg-[#f4f1ea] p-8 md:p-12 lg:p-14 flex flex-col justify-between border-r border-zinc-200 relative overflow-hidden text-zinc-900">
          <div className="relative z-10 my-auto">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#b8860b]">
              Signature Blends
            </span>
            <h1 className="text-3xl md:text-4xl font-light text-zinc-900 tracking-[0.16em] uppercase leading-[1.25] mt-3 mb-5">
              Begin Your<br />Tea Journey
            </h1>
            <div className="w-8 h-[1px] bg-[#b8860b]/50" />
            <p className="text-[12px] text-zinc-600 leading-relaxed mt-5 max-w-xs">
              Create an account to track shipments, save favorite blends, link your guest orders, and receive member privileges.
            </p>

            <div className="mt-8 flex items-center gap-3 text-xs text-[#173b25] bg-[#FAF5EC] border border-[#e2d7c5] p-3 rounded-lg">
              <ShieldCheck size={18} className="text-[#b8860b] shrink-0" />
              <span className="text-[11px] leading-snug">
                Instant OTP authentication securely confirms your email with zero password friction.
              </span>
            </div>
          </div>

          <div className="relative z-10 pt-6">
            <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium">
              © VAARTA TEA CLUB
            </span>
          </div>
        </div>

        {/* Right Side: Signup Forms */}
        <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between bg-white text-zinc-900">
          <div className="relative z-10 h-9 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-400">
              TEA CLUB MEMBERSHIP
            </span>

            {mode === "otp_verify" && (
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); setInfoMessage(""); }}
                className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-black flex items-center gap-1"
              >
                <ChevronLeft size={12} /> Edit Details
              </button>
            )}
          </div>

          <div className="max-w-[420px] w-full relative z-10 my-auto py-6">
            <div className="mb-6">
              <h2 className="text-xl font-light text-zinc-900 tracking-[0.2em] uppercase">
                {mode === "password_setup"
                  ? "Welcome to the Club"
                  : mode === "otp_verify"
                  ? "Verify Email"
                  : "Create Account"}
              </h2>
              <p className="text-[11px] text-[#b8860b] tracking-wider font-medium mt-1 uppercase">
                {mode === "password_setup"
                  ? "Optional Password Setup"
                  : mode === "otp_verify"
                  ? `Verification Code Sent to ${email}`
                  : "Fast & Secure OTP Signup"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                  <div className="p-3.5 bg-red-50 border border-red-200 flex items-start gap-3 text-red-600 text-[11px] rounded-sm">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {infoMessage && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-5 overflow-hidden">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-700 text-[11px] rounded-sm">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                    <span>{infoMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 1: Registration Entry */}
            {mode === "register" && (
              <form onSubmit={handleStartOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-[#173b25] transition-all rounded-sm placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-[#173b25] transition-all rounded-sm placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#173b25] hover:bg-[#245433] text-white font-semibold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-sm shadow-md mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue with Email</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center pt-2">
                  <div className="w-full border-t border-zinc-200" />
                  <span className="bg-white px-3 text-[9px] text-zinc-400 uppercase tracking-widest absolute">
                    or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full py-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-[10px] font-bold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 rounded-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {mode === "otp_verify" && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500 block mb-3 text-center">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-between gap-2 max-w-[340px] mx-auto">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`signup-otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        autoFocus={idx === 0}
                        className="w-11 h-13 text-center text-lg font-mono font-bold bg-zinc-50 border border-zinc-300 focus:border-[#173b25] text-zinc-900 outline-none rounded-sm transition-all"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-400 text-center mt-3">
                    Code expires in 10 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full py-4 bg-[#173b25] hover:bg-[#245433] text-white font-semibold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-sm shadow-md"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify Code & Continue</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  {resendCooldown > 0 ? (
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Resend code in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartOtp}
                      disabled={loading}
                      className="text-[11px] text-[#b8860b] hover:text-[#173b25] font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <RefreshCw size={12} /> Resend Verification Code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* STEP 3: Optional Password Creation */}
            {mode === "password_setup" && (
              <form onSubmit={handleSavePassword} className="space-y-5">
                <div className="p-3.5 bg-[#FAF5EC] border border-[#e2d7c5] rounded-sm text-xs text-[#173b25]">
                  <p className="font-bold flex items-center gap-1.5 text-[#173b25]">
                    <CheckCircle2 size={15} className="text-emerald-600" /> Email Verified Successfully
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                    Create an optional password for faster login next time, or skip and log in with OTP anytime.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-[#173b25] transition-all rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-300 text-xs text-zinc-900 outline-none focus:border-[#173b25] transition-all rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                    >
                      {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#173b25] hover:bg-[#245433] text-white font-semibold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-sm shadow-md"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full py-3 bg-transparent hover:bg-zinc-100 text-zinc-600 font-bold text-[10px] uppercase tracking-[0.18em] transition-all rounded-sm text-center"
                  >
                    Skip for Now
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="relative z-10 pt-6 border-t border-zinc-100">
            <span className="text-[12px] text-zinc-500 tracking-wider">
              Already have an account?{" "}
              <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-[#173b25] font-bold hover:underline uppercase text-[11px] tracking-wider ml-1">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
