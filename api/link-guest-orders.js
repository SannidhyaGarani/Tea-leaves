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

    const rawEmail = decodedToken.email ? decodedToken.email.trim() : '';

    // Query orders matching verified email or shipping address email
    const ordersRef = adminDb.collection('orders');
    const [snapCustomer, snapShipping] = await Promise.all([
      ordersRef.where('customerEmail', '==', verifiedEmail).get(),
      ordersRef.where('shippingAddress.email', '==', verifiedEmail).get(),
    ]);

    const docMap = new Map();
    snapCustomer.docs.forEach((d) => docMap.set(d.id, d));
    snapShipping.docs.forEach((d) => docMap.set(d.id, d));

    // Also check rawEmail if case differed
    if (rawEmail && rawEmail !== verifiedEmail) {
      try {
        const snapRaw = await ordersRef.where('customerEmail', '==', rawEmail).get();
        snapRaw.docs.forEach((d) => docMap.set(d.id, d));
      } catch (e) {
        console.warn('[LinkGuestOrders] Raw email check warning:', e.message);
      }
    }

    if (docMap.size === 0) {
      return res.status(200).json({
        success: true,
        linkedCount: 0,
        message: 'No unclaimed guest orders found for this email.',
      });
    }

    const batch = adminDb.batch();
    const linkedOrderIds = [];

    docMap.forEach((docSnap) => {
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

      // 3. Must be an unclaimed guest order (userId is null/empty or isGuest is true or userId matches)
      const isEligibleOrder = order.isGuest === true || !order.userId || order.userId === authenticatedUid;

      if (isEligibleOrder) {
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
