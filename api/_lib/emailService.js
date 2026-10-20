import nodemailer from 'nodemailer';

const BRAND_NAME = 'Vaarta Chai';
const BRAND_LOGO = 'https://res.cloudinary.com/dcjn4y284/image/upload/v1787474399/VARTA_CHAI_LOGO_NEW_PNG_2_gxlhbz.png';
const BRAND_PRIMARY = '#173b25';
const BRAND_GOLD = '#b8860b';
const BRAND_BG = '#faf5ec';
const SUPPORT_EMAIL = 'support@vaartachai.com';

let cachedTransporter = null;

export async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
    return cachedTransporter;
  }

  // Development / fallback test transporter
  console.warn('[EmailService] SMTP credentials not set. Using test/stream transporter for safe local dev.');
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return cachedTransporter;
  } catch (err) {
    // Fallback stream transporter that prints to console safely
    cachedTransporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows',
    });
    return cachedTransporter;
  }
}

function getFromAddress() {
  return process.env.SMTP_FROM || `"${BRAND_NAME}" <orders@vaartachai.com>`;
}

/**
 * Send OTP Verification Email
 */
export async function sendOtpEmail(recipientEmail, otp) {
  const transporter = await getTransporter();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${BRAND_NAME} Verification Code</title>
  <style>
    body { margin:0; padding:0; background-color:${BRAND_BG}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#222; }
    .container { max-width:580px; margin:24px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e7ded0; box-shadow:0 8px 24px rgba(23,59,37,0.06); }
    .header { background:${BRAND_PRIMARY}; padding:32px 24px; text-align:center; }
    .logo { height:56px; width:auto; display:inline-block; }
    .body-content { padding:36px 32px; text-align:center; }
    .tag { display:inline-block; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${BRAND_GOLD}; background:#f9f5ec; padding:4px 12px; border-radius:20px; border:1px solid #ecdcb9; margin-bottom:12px; }
    h1 { font-size:24px; font-weight:600; color:${BRAND_PRIMARY}; margin:0 0 12px; letter-spacing:0.5px; }
    p { font-size:14px; line-height:1.6; color:#555; margin:0 0 24px; }
    .otp-box { background:#f7f3ea; border:2px dashed ${BRAND_GOLD}; border-radius:10px; padding:20px; margin:24px 0; text-align:center; }
    .otp-code { font-size:36px; font-weight:800; letter-spacing:10px; color:${BRAND_PRIMARY}; font-family:'Courier New',Courier,monospace; }
    .expiry-note { font-size:12px; color:#777; margin-top:8px; font-weight:500; }
    .warning-box { background:#fef8e7; border-left:4px solid ${BRAND_GOLD}; padding:12px 16px; margin:24px 0; text-align:left; font-size:12px; color:#7a5813; border-radius:4px; }
    .footer { background:#f9f6f0; border-top:1px solid #eee5d8; padding:24px 32px; text-align:center; font-size:11px; color:#888; }
    .footer a { color:${BRAND_PRIMARY}; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${BRAND_LOGO}" alt="${BRAND_NAME}" class="logo" />
    </div>
    <div class="body-content">
      <div class="tag">Estate Tea Authentication</div>
      <h1>Verify Your Email</h1>
      <p>Use the six-digit verification code below to sign in or create your account with ${BRAND_NAME}.</p>
      
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <div class="expiry-note">This code expires in <strong>10 minutes</strong>.</div>
      </div>

      <div class="warning-box">
        <strong>Security Notice:</strong> Never share this code with anyone. ${BRAND_NAME} representatives will never ask for your verification code.
      </div>

      <p style="font-size:12px; color:#888; margin-bottom:0;">
        If you did not request this verification code, you can safely ignore this email. No changes have been made to your account.
      </p>
    </div>
    <div class="footer">
      <p style="margin:0 0 6px;">© ${new Date().getFullYear()} ${BRAND_NAME} • Artisanal Tea Estate & Blends</p>
      <p style="margin:0;">Fresh single-origin & blended teas from Assam. Need help? Contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: recipientEmail,
    subject: `Your ${BRAND_NAME} Verification Code`,
    html,
  });
}

/**
 * Send Customer Order Confirmation Email
 */
export async function sendCustomerOrderEmail(order) {
  const transporter = await getTransporter();
  const orderNumber = order.orderNumber || `TEA-${order.id?.slice(0, 8).toUpperCase()}`;
  const siteUrl = process.env.SITE_URL || 'https://vaartachai.com';
  const trackingLink = order.id
    ? `${siteUrl}/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(order.customerEmail)}`
    : `${siteUrl}/orders`;

  const orderDate = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const items = order.items || [];
  const itemsHtml = items.map((item) => {
    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
    const itemImg = item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150';
    return `
      <tr>
        <td style="padding:14px 10px; border-bottom:1px solid #ede4d5; width:64px; vertical-align:middle;">
          <img src="${itemImg}" alt="${item.name || 'Tea'}" style="width:56px; height:56px; object-fit:cover; border-radius:6px; border:1px solid #e2d7c5; display:block;" />
        </td>
        <td style="padding:14px 12px; border-bottom:1px solid #ede4d5; vertical-align:middle;">
          <div style="font-size:13px; font-weight:700; color:#173b25;">${item.name || 'Artisanal Tea Blend'}</div>
          ${item.size ? `<div style="font-size:11px; color:#827963; margin-top:2px;">Pack Weight: ${item.size}</div>` : ''}
          <div style="font-size:11px; color:#666; margin-top:2px;">Qty: ${item.quantity || 1} × ₹${item.price || 0}</div>
        </td>
        <td style="padding:14px 10px; border-bottom:1px solid #ede4d5; text-align:right; font-weight:700; font-size:13px; color:#173b25; vertical-align:middle;">
          ₹${itemTotal.toLocaleString('en-IN')}
        </td>
      </tr>
    `;
  }).join('');

  const shippingAddr = order.shippingAddress || order.shipping || {};
  const recipientName = order.customerName || shippingAddr.name || 'Valued Customer';
  const fullAddress = [
    shippingAddr.address,
    shippingAddr.city,
    shippingAddr.state ? `${shippingAddr.state} - ${shippingAddr.pincode || ''}` : shippingAddr.pincode,
  ].filter(Boolean).join(', ');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed — #${orderNumber}</title>
  <style>
    body { margin:0; padding:0; background-color:${BRAND_BG}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#222; }
    .container { max-width:620px; margin:24px auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e7ded0; box-shadow:0 8px 24px rgba(23,59,37,0.06); }
    .header { background:${BRAND_PRIMARY}; padding:28px 24px; text-align:center; }
    .logo { height:54px; width:auto; display:inline-block; }
    .hero { background:#f7f2e8; padding:28px 32px; border-bottom:1px solid #e8dfcf; text-align:center; }
    .order-status-badge { display:inline-block; background:#173b25; color:#ecdcb9; font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; padding:5px 14px; border-radius:20px; margin-bottom:12px; }
    h1 { font-size:24px; font-weight:700; color:${BRAND_PRIMARY}; margin:0 0 6px; }
    .order-ref { font-size:13px; color:#827963; font-weight:600; letter-spacing:1px; margin:0; }
    .content { padding:32px; }
    .section-title { font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:${BRAND_GOLD}; margin:0 0 16px; border-bottom:1px solid #ede4d5; padding-bottom:8px; }
    table { width:100%; border-collapse:collapse; margin-bottom:24px; }
    .summary-row { font-size:13px; color:#555; }
    .summary-row td { padding:6px 0; }
    .grand-total { font-size:16px; font-weight:800; color:${BRAND_PRIMARY}; border-top:2px solid ${BRAND_PRIMARY}; border-bottom:2px solid ${BRAND_PRIMARY}; }
    .grand-total td { padding:12px 0; }
    .grid-box { background:#fbf9f5; border:1px solid #ede4d5; border-radius:8px; padding:16px; margin-bottom:24px; font-size:12px; line-height:1.6; color:#444; }
    .btn-track { display:inline-block; background:${BRAND_PRIMARY}; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-size:11px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; margin-top:8px; }
    .footer { background:#f9f6f0; border-top:1px solid #eee5d8; padding:24px 32px; text-align:center; font-size:11px; color:#888; }
    .footer a { color:${BRAND_PRIMARY}; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${BRAND_LOGO}" alt="${BRAND_NAME}" class="logo" />
    </div>

    <div class="hero">
      <div class="order-status-badge">Order Confirmed</div>
      <h1>Thank You, ${recipientName}!</h1>
      <p class="order-ref">ORDER #${orderNumber}</p>
      <p style="font-size:12px; color:#555; margin:8px 0 0;">Placed on ${orderDate} • Payment: ${(order.paymentMethod || 'Online').toUpperCase()}</p>
    </div>

    <div class="content">
      <div class="section-title">Purchased Blends</div>
      <table>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Price Breakdown -->
      <table>
        <tr class="summary-row">
          <td>Subtotal</td>
          <td style="text-align:right; font-weight:600; color:#222;">₹${(order.subtotal || order.total || 0).toLocaleString('en-IN')}</td>
        </tr>
        <tr class="summary-row">
          <td>Garden Direct Express Shipping</td>
          <td style="text-align:right; font-weight:600; color:#173b25;">FREE</td>
        </tr>
        ${order.discount ? `
        <tr class="summary-row">
          <td>Special Discount</td>
          <td style="text-align:right; font-weight:600; color:#b8860b;">-₹${Number(order.discount).toLocaleString('en-IN')}</td>
        </tr>` : ''}
        <tr class="grand-total">
          <td>Grand Total</td>
          <td style="text-align:right;">₹${(order.total || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>

      <!-- Shipping Information -->
      <div class="section-title">Delivery & Shipping Address</div>
      <div class="grid-box">
        <strong style="color:${BRAND_PRIMARY}; font-size:13px;">${recipientName}</strong><br />
        ${fullAddress || 'Standard Delivery Address'}<br />
        <strong>Phone:</strong> ${shippingAddr.phone || order.customerPhone || 'N/A'}<br />
        <strong>Email:</strong> ${order.customerEmail}
      </div>

      <!-- Action -->
      <div style="text-align:center; padding:16px 0;">
        <a href="${trackingLink}" class="btn-track">Track Your Tea Shipment</a>
      </div>
    </div>

    <div class="footer">
      <p style="margin:0 0 6px;">© ${new Date().getFullYear()} ${BRAND_NAME} • Pure Assam Tea Harvest</p>
      <p style="margin:0;">Have questions about your harvest order? Reach out anytime at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>
    </div>
  </div>
</body>
</html>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: order.customerEmail,
    subject: `Order Confirmed — #${orderNumber}`,
    html,
  });
}

/**
 * Send Administrator New Order Notification Email
 */
export async function sendAdminOrderEmail(order) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('[EmailService] ADMIN_EMAIL not set. Skipping admin notification.');
    return null;
  }

  const transporter = await getTransporter();
  const orderNumber = order.orderNumber || `TEA-${order.id?.slice(0, 8).toUpperCase()}`;
  const siteUrl = process.env.SITE_URL || 'https://vaartachai.com';
  const adminUrl = `${siteUrl}/admin`;

  const orderDate = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleString('en-IN')
    : new Date().toLocaleString('en-IN');

  const items = order.items || [];
  const itemsText = items.map(i => `• ${i.name} (Qty: ${i.quantity || 1}, Size: ${i.size || 'Standard'}) - ₹${((i.price || 0) * (i.quantity || 1)).toLocaleString('en-IN')}`).join('\n');

  const shippingAddr = order.shippingAddress || order.shipping || {};
  const fullAddress = [
    shippingAddr.address,
    shippingAddr.city,
    shippingAddr.state,
    shippingAddr.pincode,
  ].filter(Boolean).join(', ');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Tea Order Received — #${orderNumber}</title>
  <style>
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif; background:#f4f1ea; padding:20px; }
    .box { max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #ddd; border-radius:8px; padding:28px; }
    h2 { color:#173b25; margin-top:0; border-bottom:2px solid #173b25; padding-bottom:8px; }
    .row { margin:10px 0; font-size:13px; line-height:1.6; }
    .label { font-weight:700; color:#555; display:inline-block; width:140px; }
    .badge { display:inline-block; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:700; }
    .guest { background:#fff3cd; color:#856404; }
    .member { background:#d4edda; color:#155724; }
    .items { background:#fbf9f5; border:1px solid #e2d7c5; border-radius:6px; padding:14px; margin:16px 0; }
    .btn { display:inline-block; background:#173b25; color:#fff; text-decoration:none; padding:10px 20px; border-radius:4px; font-size:12px; font-weight:700; margin-top:16px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>🍃 New Order Alert: #${orderNumber}</h2>
    
    <div class="row"><span class="label">Total Amount:</span> <strong style="font-size:16px; color:#173b25;">₹${(order.total || 0).toLocaleString('en-IN')}</strong></div>
    <div class="row"><span class="label">Date & Time:</span> ${orderDate}</div>
    <div class="row"><span class="label">Customer Name:</span> ${order.customerName || shippingAddr.name || 'N/A'}</div>
    <div class="row"><span class="label">Customer Email:</span> <a href="mailto:${order.customerEmail}">${order.customerEmail}</a></div>
    <div class="row"><span class="label">Customer Phone:</span> ${order.customerPhone || shippingAddr.phone || 'N/A'}</div>
    <div class="row"><span class="label">Account Status:</span> 
      <span class="badge ${order.isGuest ? 'guest' : 'member'}">${order.isGuest ? 'GUEST CHECKOUT' : 'REGISTERED MEMBER (UID: ' + (order.userId || 'N/A') + ')'}</span>
    </div>
    <div class="row"><span class="label">Payment Method:</span> ${(order.paymentMethod || 'Online').toUpperCase()}</div>
    <div class="row"><span class="label">Payment Status:</span> ${(order.paymentStatus || 'Pending').toUpperCase()}</div>
    <div class="row"><span class="label">Shipping Address:</span> ${fullAddress}</div>

    <div class="items">
      <strong>Ordered Items:</strong>
      <pre style="font-family:inherit; margin:8px 0 0; white-space:pre-wrap; font-size:12px; color:#333;">${itemsText}</pre>
    </div>

    <div>
      <a href="${adminUrl}" class="btn">View in Admin Portal</a>
    </div>
  </div>
</body>
</html>
  `;

  return transporter.sendMail({
    from: getFromAddress(),
    to: adminEmail,
    subject: `New Tea Order Received — #${orderNumber}`,
    html,
  });
}
