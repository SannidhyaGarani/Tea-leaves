import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function initFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'vaarta-bbc3f';
  let credential = null;

  // 1. Full JSON service account key
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      const jsonStr = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
      const serviceAccount = JSON.parse(jsonStr);
      credential = cert(serviceAccount);
    } catch (err) {
      console.warn('[FirebaseAdmin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', err.message);
    }
  }

  // 2. Individual environment variables
  if (!credential && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      credential = cert({
        projectId,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      });
    } catch (err) {
      console.warn('[FirebaseAdmin] Failed to init cert from individual env vars:', err.message);
    }
  }

  // 3. Fallback warning if credentials are not configured yet
  if (!credential) {
    console.warn(
      '[FirebaseAdmin] Notice: No service account credential found (FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY).\n' +
      'Admin SDK initialized with projectId only. Serverless routes requiring privileged Firebase Admin access will need service account credentials configured in .env.'
    );
  }

  const appOptions = { projectId };
  if (credential) {
    appOptions.credential = credential;
  }

  try {
    return initializeApp(appOptions);
  } catch (err) {
    if (getApps().length > 0) return getApp();
    throw err;
  }
}

const app = initFirebaseApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export default app;
