import crypto from 'crypto';

/**
 * Normalizes email by trimming whitespace and converting to lowercase.
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Validates email format.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Generates a 6-digit cryptographically secure OTP.
 */
export function generateSixDigitOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Computes a secure hash of the OTP combined with normalized email and server secret.
 * Never stores plain OTP in database.
 */
export function hashOtp(email, otp) {
  const normalized = normalizeEmail(email);
  const secret = process.env.OTP_SECRET || 'vaarta-tea-secret-otp-fallback-key-2026';
  return crypto
    .createHmac('sha256', secret)
    .update(`${normalized}:${otp}`)
    .digest('hex');
}

/**
 * Securely compares submitted OTP against the stored hash using timingSafeEqual
 * to protect against timing attacks.
 */
export function verifyOtpHash(email, otp, storedHash) {
  if (!email || !otp || !storedHash) return false;
  try {
    const computedHash = hashOtp(email, otp);
    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
