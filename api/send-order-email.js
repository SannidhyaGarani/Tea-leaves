import { adminDb } from './_lib/firebaseAdmin.js';
import { sendCustomerOrderEmail, sendAdminOrderEmail } from './_lib/emailService.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId } = req.body || {};
    if (!orderId || typeof orderId !== 'string') {
      return res.status(400).json({ error: 'Valid orderId is required.' });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const snap = await orderRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const orderData = { id: snap.id, ...snap.data() };

    // Validate trusted customerEmail exists on the order
    if (!orderData.customerEmail) {
      return res.status(400).json({ error: 'Order does not have a customerEmail on record.' });
    }

    const emailStatus = orderData.emailStatus || { customer: 'pending', admin: 'pending' };

    let customerResult = emailStatus.customer;
    let adminResult = emailStatus.admin;
    const errors = [];

    // 1. Send Customer Confirmation Email (if not already sent)
    if (emailStatus.customer !== 'sent') {
      try {
        await sendCustomerOrderEmail(orderData);
        customerResult = 'sent';
      } catch (err) {
        customerResult = 'failed';
        errors.push(`Customer email failed: ${err.message}`);
        console.error('[SendOrderEmail] Customer dispatch error:', err.message);
      }
    }

    // 2. Send Admin Notification Email (if not already sent)
    if (emailStatus.admin !== 'sent') {
      try {
        await sendAdminOrderEmail(orderData);
        adminResult = 'sent';
      } catch (err) {
        adminResult = 'failed';
        errors.push(`Admin email failed: ${err.message}`);
        console.error('[SendOrderEmail] Admin dispatch error:', err.message);
      }
    }

    // Update order email status in Firestore
    await orderRef.update({
      emailStatus: {
        customer: customerResult,
        admin: adminResult,
        updatedAt: new Date().toISOString(),
        ...(errors.length > 0 ? { lastError: errors.join('; ') } : {}),
      },
    });

    return res.status(200).json({
      success: true,
      emailStatus: {
        customer: customerResult,
        admin: adminResult,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('[SendOrderEmail Error]:', error.message);
    // Never fail the order itself due to email delivery errors
    return res.status(500).json({
      error: 'Email notification service encountered an error: ' + error.message,
    });
  }
}
