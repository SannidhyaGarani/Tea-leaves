import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "./Firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "./useAuth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to link unclaimed guest orders matching the authenticated user's verified email
  const linkGuestOrders = useCallback(async (firebaseUser) => {
    const targetUser = firebaseUser || auth.currentUser;
    if (!targetUser || !targetUser.email) return;

    try {
      const idToken = await targetUser.getIdToken();
      const res = await fetch("/api/link-guest-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (data.linkedCount > 0) {
        console.log(`[Guest Orders] Successfully linked ${data.linkedCount} guest orders.`);
      }
      return data;
    } catch (err) {
      console.warn("[Guest Orders] Auto-linking check skipped:", err.message);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setLoading(false);

      if (u) {
        try {
          const userDoc = doc(db, "users", u.uid);
          const snap = await getDoc(userDoc);
          if (!snap.exists()) {
            await setDoc(userDoc, {
              email: u.email || "",
              displayName: u.displayName || u.email?.split("@")[0] || "",
              createdAt: serverTimestamp(),
            });
          }

          // Automatically link eligible guest orders matching verified email
          linkGuestOrders(u);
        } catch (err) {
          console.error("Auth state sync error:", err);
        }
      }
    });
    return () => unsub();
  }, [linkGuestOrders]);

  // Request a 6-digit cryptographic OTP to email
  const sendOtp = async (email) => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to send verification code.");
    }
    return data;
  };

  // Verify OTP and establish genuine Firebase Authentication identity
  const verifyOtp = async (email, otp) => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to verify code.");
    }

    if (!data.customToken) {
      throw new Error("Server authentication failed: Missing custom authentication token.");
    }

    // Authenticate Firebase user with custom token
    const userCredential = await signInWithCustomToken(auth, data.customToken);

    // Securely trigger guest order linking
    await linkGuestOrders(userCredential.user);

    return {
      user: userCredential.user,
      isNewUser: data.isNewUser,
      email: data.email,
    };
  };

  // Set or update user password
  const setAccountPassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error("No authenticated user found.");
    try {
      // 1. Try native Firebase Auth updatePassword
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch {
      // 2. Fallback to server-side admin updateUser
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch("/api/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set password.");
      return data;
    }
  };

  // Standard Email + Password Login
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await linkGuestOrders(cred.user);
    return cred;
  };

  // Standard Signup
  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const userDoc = doc(db, "users", cred.user.uid);
    await setDoc(userDoc, {
      email: cred.user.email || "",
      displayName: displayName || email.split("@")[0] || "",
      createdAt: serverTimestamp(),
    });
    await linkGuestOrders(cred.user);
    return cred;
  };

  // Google Provider Login
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    await linkGuestOrders(cred.user);
    return cred;
  };

  // Password Reset Email
  const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    sendOtp,
    verifyOtp,
    setAccountPassword,
    sendPasswordReset,
    login,
    signup,
    loginWithGoogle,
    linkGuestOrders,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
