import { adminAuth, adminDb } from './_lib/firebaseAdmin.js';
import { normalizeEmail, isValidEmail, verifyOtpHash } from './_lib/security.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawEmail = req.body?.email;
    const rawOtp = req.body?.otp;

    if (!rawEmail || !isValidEmail(rawEmail)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    if (!rawOtp || typeof rawOtp !== 'string' || !/^\d{6}$/.test(rawOtp.trim())) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit verification code.' });
    }

    const email = normalizeEmail(rawEmail);
    const otp = rawOtp.trim();
    const emailKey = crypto.createHash('sha256').update(email).digest('hex');

    const otpDocRef = adminDb.collection('_security_otps').doc(emailKey);
    const snap = await otpDocRef.get();

    if (!snap.exists) {
      return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new one.' });
    }

    const data = snap.data();
    const now = Date.now();

    // Check expiry
    if (now > (data.expiresAt || 0)) {
      await otpDocRef.delete();
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Check max attempts
    const attempts = data.attempts || 0;
    const maxAttempts = data.maxAttempts || 5;
    if (attempts >= maxAttempts) {
      await otpDocRef.delete();
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new code.' });
    }

    // Verify cryptographic hash
    const isValid = verifyOtpHash(email, otp, data.otpHash);
    if (!isValid) {
      const newAttempts = attempts + 1;
      if (newAttempts >= maxAttempts) {
        await otpDocRef.delete();
        return res.status(429).json({
          error: 'Maximum incorrect attempts reached. Please request a new verification code.',
        });
      } else {
        await otpDocRef.update({ attempts: newAttempts });
        const remaining = maxAttempts - newAttempts;
        return res.status(400).json({
          error: `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
          attemptsRemaining: remaining,
        });
      }
    }

    // OTP is valid! Invalidate immediately to prevent replay attack
    await otpDocRef.delete();

    // Check if user already exists in Firebase Auth
    let userRecord = null;
    let isNewUser = false;

    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        userRecord = null;
      } else {
        throw err;
      }
    }

    if (!userRecord) {
      // Create new user account in Firebase Auth
      isNewUser = true;
      const defaultName = email.split('@')[0];
      userRecord = await adminAuth.createUser({
        email,
        emailVerified: true,
        displayName: defaultName,
      });

      // Initialize Firestore profile
      await adminDb.collection('users').doc(userRecord.uid).set(
        {
          email,
          displayName: defaultName,
          createdAt: new Date().toISOString(),
          authProvider: 'otp',
        },
        { merge: true }
      );
    } else {
      // Existing user: mark email verified if not already
      if (!userRecord.emailVerified) {
        await adminAuth.updateUser(userRecord.uid, { emailVerified: true });
      }
    }

    // Generate genuine Firebase Authentication custom token
    const customToken = await adminAuth.createCustomToken(userRecord.uid, {
      email,
      emailVerified: true,
    });

    return res.status(200).json({
      success: true,
      isNewUser,
      customToken,
      uid: userRecord.uid,
      email,
      displayName: userRecord.displayName || email.split('@')[0],
      message: 'Email verified successfully.',
    });
  } catch (error) {
    console.error('[VerifyOTP Error]:', error.message);
    return res.status(500).json({
      error: 'Failed to complete verification. Please try again.',
    });
  }
}
