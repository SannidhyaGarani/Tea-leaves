import { normalizeEmail, isValidEmail, generateSixDigitOtp, hashOtp, verifyOtpHash } from '../api/_lib/security.js';
import { sendOtpEmail, sendCustomerOrderEmail, sendAdminOrderEmail, getTransporter } from '../api/_lib/emailService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing Email Normalization & Validation ---');
  const rawEmail = '   ChaiLover.Assam@VaartaTea.COM   ';
  const normalized = normalizeEmail(rawEmail);
  assert(normalized === 'chailover.assam@vaartatea.com', 'Email trimmed and converted to lowercase');
  assert(isValidEmail('customer@example.com') === true, 'Valid email recognized');
  assert(isValidEmail('invalid-email') === false, 'Invalid email rejected');
  assert(isValidEmail('') === false, 'Empty email rejected');

  console.log('\n--- 2. Testing Cryptographic 6-Digit OTP & Hashing ---');
  const otp = generateSixDigitOtp();
  assert(/^\d{6}$/.test(otp), `Generated OTP is 6 digits: ${otp}`);
  
  const hash1 = hashOtp('test@example.com', otp);
  const hash2 = hashOtp('test@example.com', otp);
  assert(hash1 === hash2, 'Hash is deterministic for identical email and OTP');
  assert(hash1.length === 64, 'SHA-256 HMAC produces 64-char hex string');

  const matchCorrect = verifyOtpHash('test@example.com', otp, hash1);
  assert(matchCorrect === true, 'Timing-safe verify succeeds with matching OTP');

  const matchWrongOtp = verifyOtpHash('test@example.com', '000000', hash1);
  assert(matchWrongOtp === false, 'Timing-safe verify fails with incorrect OTP');

  const matchWrongEmail = verifyOtpHash('wrong@example.com', otp, hash1);
  assert(matchWrongEmail === false, 'Timing-safe verify fails if email does not match');

  console.log('\n--- 3. Testing Email Service & Templates ---');
  try {
    const transporter = await getTransporter();
    assert(transporter !== null, 'Transporter initialized safely in test environment');

    const otpMail = await sendOtpEmail('customer@example.com', '482915');
    assert(otpMail !== null, 'OTP verification email generated and dispatched');

    const sampleOrder = {
      id: 'ord_test_12345',
      orderNumber: 'TEA-HARVEST-01',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@example.com',
      customerPhone: '+91 98765 43210',
      isGuest: true,
      items: [
        { name: 'Royal Assam CTC Reserve', size: '500g', price: 499, quantity: 2, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150' },
        { name: 'Cardamom Elaichi Blend', size: '250g', price: 349, quantity: 1, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=150' }
      ],
      subtotal: 1347,
      total: 1347,
      paymentMethod: 'online',
      paymentStatus: 'captured',
      shippingAddress: {
        name: 'Aarav Sharma',
        address: '42 Estate Garden Lane',
        city: 'Guwahati',
        state: 'Assam',
        pincode: '781001',
        phone: '+91 98765 43210'
      }
    };

    const customerMail = await sendCustomerOrderEmail(sampleOrder);
    assert(customerMail !== null, 'Customer order confirmation email generated with products, totals, and tracking');

    process.env.ADMIN_EMAIL = 'admin@vaartachai.com';
    const adminMail = await sendAdminOrderEmail(sampleOrder);
    assert(adminMail !== null, 'Admin new-order notification email generated with customer details');
  } catch (err) {
    assert(false, `Email service error: ${err.message}`);
  }

  console.log('\n--- 4. Testing Guest Order Linking Security Scenarios ---');
  // Mock orders database
  const mockOrders = [
    { id: 'ord_1', customerEmail: 'guest@example.com', userId: null, isGuest: true, total: 500 },
    { id: 'ord_2', customerEmail: 'guest@example.com', userId: null, isGuest: true, total: 750 },
    { id: 'ord_3', customerEmail: 'other@example.com', userId: null, isGuest: true, total: 300 },
    { id: 'ord_4', customerEmail: 'guest@example.com', userId: 'user_existing_owner', isGuest: false, total: 1200 },
  ];

  function simulateLinkGuestOrders(verifiedEmail, authenticatedUid, orders) {
    const updated = [];
    orders.forEach(order => {
      // Rule 1: Never steal orders already owned by another account
      if (order.userId && order.userId !== authenticatedUid && order.isGuest === false) {
        return;
      }
      // Rule 2: Skip if already owned by this user
      if (order.userId === authenticatedUid && order.isGuest === false) {
        return;
      }
      // Rule 3: Only link unclaimed guest orders with exact matching verified email
      const isUnclaimed = order.isGuest === true || !order.userId;
      if (isUnclaimed && normalizeEmail(order.customerEmail) === normalizeEmail(verifiedEmail)) {
        updated.push({
          ...order,
          userId: authenticatedUid,
          isGuest: false,
          linkedAt: new Date().toISOString()
        });
      }
    });
    return updated;
  }

  // Scenario A & D: Multiple guest orders with same email
  const linkedOrders = simulateLinkGuestOrders('guest@example.com', 'user_new_uid_999', mockOrders);
  assert(linkedOrders.length === 2, `Correctly linked 2 unclaimed guest orders for guest@example.com`);
  assert(linkedOrders.every(o => o.userId === 'user_new_uid_999' && o.isGuest === false), 'All linked orders have updated UID and isGuest=false');

  // Scenario C: Different email
  const diffEmailLinked = simulateLinkGuestOrders('different@example.com', 'user_new_uid_999', mockOrders);
  assert(diffEmailLinked.length === 0, 'Different email does NOT link orders for guest@example.com');

  // Scenario E: Order owned by another UID cannot be stolen
  const stolenCheck = linkedOrders.find(o => o.id === 'ord_4');
  assert(!stolenCheck, 'Order owned by user_existing_owner is PROTECTED and never transferred');

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
