import { adminAuth, adminDb } from './_lib/firebaseAdmin.js';
import { normalizeEmail } from './_lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Authentication token is missing.' });
    }

    const idToken = authHeader.split('Bearer ')[1].trim();
    // Verify Firebase ID token server-side - identity source of truth
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const authenticatedUid = decodedToken.uid;
    const verifiedEmail = normalizeEmail(decodedToken.email);

    if (!verifiedEmail) {
      return res.status(400).json({ error: 'User does not possess a verified email address.' });
    }

    // Query orders matching the verified email
    const ordersRef = adminDb.collection('orders');
    const snapshot = await ordersRef.where('customerEmail', '==', verifiedEmail).get();

    if (snapshot.empty) {
      return res.status(200).json({
        success: true,
        linkedCount: 0,
        message: 'No unclaimed guest orders found for this email.',
      });
    }

    const batch = adminDb.batch();
    const linkedOrderIds = [];

    snapshot.docs.forEach((docSnap) => {
      const order = docSnap.data();

      // SECURITY CHECKS:
      // 1. Never transfer an order already owned by another authenticated user
      if (order.userId && order.userId !== authenticatedUid && order.isGuest === false) {
        return;
      }

      // 2. Already linked to this user
      if (order.userId === authenticatedUid && order.isGuest === false) {
        return;
      }

      // 3. Must be an unclaimed guest order (userId is null/empty or isGuest is true)
      const isUnclaimedGuestOrder = order.isGuest === true || !order.userId;

      if (isUnclaimedGuestOrder) {
        batch.update(docSnap.ref, {
          userId: authenticatedUid,
          isGuest: false,
          linkedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        linkedOrderIds.push(docSnap.id);
      }
    });

    if (linkedOrderIds.length > 0) {
      await batch.commit();
    }

    return res.status(200).json({
      success: true,
      linkedCount: linkedOrderIds.length,
      linkedOrderIds,
      message: `Successfully linked ${linkedOrderIds.length} previous order(s) to your account.`,
    });
  } catch (error) {
    console.error('[LinkGuestOrders Error]:', error.message);
    return res.status(500).json({
      error: 'Failed to link guest orders: ' + error.message,
    });
  }
}
