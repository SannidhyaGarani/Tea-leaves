import { adminDb } from './_lib/firebaseAdmin.js';
import { normalizeEmail, isValidEmail, generateSixDigitOtp, hashOtp } from './_lib/security.js';
import { sendOtpEmail } from './_lib/emailService.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawEmail = req.body?.email;
    if (!rawEmail || !isValidEmail(rawEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const email = normalizeEmail(rawEmail);
    // Hash email for safe document key
    const emailKey = crypto.createHash('sha256').update(email).digest('hex');

    const now = Date.now();
    const otpDocRef = adminDb.collection('_security_otps').doc(emailKey);
    const snap = await otpDocRef.get();

    if (snap.exists) {
      const data = snap.data();
      const lastSentAt = data.lastSentAt || 0;
      const cooldownMs = 60 * 1000; // 60 seconds cooldown
      const elapsed = now - lastSentAt;

      if (elapsed < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - elapsed) / 1000);
        return res.status(429).json({
          error: `Please wait ${remainingSec} seconds before requesting a new code.`,
          retryAfter: remainingSec,
        });
      }

      // Check hourly rate limit (max 5 requests per hour)
      const hourAgo = now - 60 * 60 * 1000;
      const requestTimestamps = (data.requestTimestamps || []).filter(ts => ts > hourAgo);
      if (requestTimestamps.length >= 5) {
        return res.status(429).json({
          error: 'Maximum verification attempts reached for this hour. Please try again later.',
        });
      }
    }

    // Generate secure 6-digit OTP and compute hash
    const otp = generateSixDigitOtp();
    const otpHash = hashOtp(email, otp);
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

    const hourAgo = now - 60 * 60 * 1000;
    const existingTimestamps = snap.exists ? (snap.data().requestTimestamps || []).filter(ts => ts > hourAgo) : [];

    // Store in Firestore (never plaintext OTP)
    await otpDocRef.set({
      emailKey,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
      lastSentAt: now,
      createdAt: now,
      requestTimestamps: [...existingTimestamps, now],
    });

    // Send email via Nodemailer
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: 'A verification code has been sent to your email.',
      expiresInMinutes: 10,
    });
  } catch (error) {
    console.error('[SendOTP Error]:', error.message);
    return res.status(500).json({
      error: 'Failed to dispatch verification code. Please try again.',
    });
  }
}
