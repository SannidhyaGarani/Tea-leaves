import { adminDb } from './_lib/firebaseAdmin.js';
import { normalizeEmail } from './_lib/security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const params = req.method === 'POST' ? req.body : req.query;
    const { orderNumber, orderId, email } = params || {};

    if ((!orderNumber && !orderId) || !email) {
      return res.status(400).json({ error: 'Order reference and email address are required to track an order.' });
    }

    const normalizedEmail = normalizeEmail(email);
    let orderDoc = null;

    if (orderId) {
      const snap = await adminDb.collection('orders').doc(orderId).get();
      if (snap.exists) {
        orderDoc = { id: snap.id, ...snap.data() };
      }
    }

    if (!orderDoc && orderNumber) {
      const querySnap = await adminDb
        .collection('orders')
        .where('orderNumber', '==', orderNumber.trim())
        .limit(1)
        .get();

      if (!querySnap.empty) {
        const doc = querySnap.docs[0];
        orderDoc = { id: doc.id, ...doc.data() };
      }
    }

    // Security check: Must match normalized customerEmail
    if (!orderDoc || normalizeEmail(orderDoc.customerEmail) !== normalizedEmail) {
      return res.status(404).json({
        error: 'Order not found. Please verify the order number and email address.',
      });
    }

    // Return sanitized tracking payload
    const trackingPayload = {
      id: orderDoc.id,
      orderNumber: orderDoc.orderNumber || `TEA-${orderDoc.id.slice(0, 8).toUpperCase()}`,
      createdAt: orderDoc.createdAt,
      orderStatus: orderDoc.orderStatus || orderDoc.status || 'confirmed',
      paymentStatus: orderDoc.paymentStatus || 'captured',
      paymentMethod: orderDoc.paymentMethod || 'Online',
      items: orderDoc.items || [],
      total: orderDoc.total || 0,
      subtotal: orderDoc.subtotal || orderDoc.total || 0,
      shipping: orderDoc.shipping || 0,
      shippingAddress: orderDoc.shippingAddress || orderDoc.shipping || {},
      isGuest: orderDoc.isGuest,
      trackingDetails: orderDoc.trackingDetails || {
        carrier: 'Express Estate Delivery',
        status: orderDoc.orderStatus || 'Processing at Estate Garden',
        estimatedDelivery: '3-5 Business Days',
      },
    };

    return res.status(200).json({
      success: true,
      order: trackingPayload,
    });
  } catch (error) {
    console.error('[TrackOrder Error]:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve order tracking information.' });
  }
}
