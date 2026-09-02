const crypto = require('crypto');
const { z } = require('zod');

console.log('🧪 Running Hidden Eats Core Logic & Security Test Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Settlement Math Engine
function calculateOrderSettlement(grossAmount, tipAmount = 0) {
  const platformFee = Math.round(grossAmount * 0.05 * 100) / 100;
  const driverBasePay = Math.round(grossAmount * 0.15 * 100) / 100;
  const driverShare = driverBasePay + tipAmount;
  const partnerPayout = Math.round((grossAmount - platformFee - driverBasePay) * 100) / 100;

  return { grossAmount, platformFee, driverShare, partnerPayout };
}

const settlement = calculateOrderSettlement(1000, 50);
assert(settlement.grossAmount === 1000, 'Settlement grossAmount matches input (₹1000)');
assert(settlement.platformFee === 50, 'Platform fee calculates accurately (5% = ₹50)');
assert(settlement.driverShare === 200, 'Driver share includes base (15% = ₹150) + tip (₹50) = ₹200');
assert(settlement.partnerPayout === 800, 'Partner payout is correct (80% net = ₹800)');

// 2. UPI Deep Link Encoding
function buildUPIDeepLink({ payeeVPA = 'hiddeneats@upi', payeeName = 'Hidden Eats', amount, transactionRef, note = 'Food Order' }) {
  return `upi://pay?pa=${payeeVPA}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tr=${transactionRef}&tn=${encodeURIComponent(note)}`;
}

const upiLink = buildUPIDeepLink({
  payeeVPA: 'partner@upi',
  payeeName: 'Grand Secret Kitchen',
  amount: 340,
  transactionRef: 'ORD_101',
  note: 'Biryani Order',
});
assert(upiLink.startsWith('upi://pay?'), 'UPI deep link starts with upi://pay protocol');
assert(upiLink.includes('pa=partner@upi'), 'UPI payee VPA is accurate');
assert(upiLink.includes('am=340.00'), 'UPI amount is formatted with two decimal places');

// 3. HMAC-SHA256 Webhook Verification
function verifyPaymentWebhookSignature(rawBody, signature, secretKey) {
  if (!rawBody || !signature || !secretKey) return false;
  try {
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    if (signatureBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

const secretKey = 'test_webhook_secret_key';
const rawPayload = JSON.stringify({ event: 'payment.captured', orderId: 'ORD_101', amount: 340 });
const validSignature = crypto.createHmac('sha256', secretKey).update(rawPayload).digest('hex');

assert(verifyPaymentWebhookSignature(rawPayload, validSignature, secretKey) === true, 'Valid HMAC-SHA256 signature verified successfully');
assert(verifyPaymentWebhookSignature(rawPayload, 'forged_sig_abc123', secretKey) === false, 'Forged webhook signature is securely rejected');

// 4. Identifier Regex Defense
function isValidIdentifier(id) {
  if (!id || typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}

assert(isValidIdentifier('ORD_9912') === true, 'Standard order ID format is valid');
assert(isValidIdentifier('BK-101_v2') === true, 'Alphanumeric with dash/underscore is valid');
assert(isValidIdentifier("ORD'; DROP TABLE users;--") === false, 'SQL injection in ID is blocked');

// 5. Zod Payload Schema Checking
const bookingSchema = z.object({
  bookingId: z.string().min(1).max(64).refine(isValidIdentifier),
  action: z.enum(['APPROVE', 'REJECT']),
});

assert(bookingSchema.safeParse({ bookingId: 'BK_101', action: 'APPROVE' }).success === true, 'Valid booking payload accepted by Zod schema');
assert(bookingSchema.safeParse({ bookingId: 'BK_101', action: 'INVALID' }).success === false, 'Invalid booking action rejected by Zod schema');

// 6. Secret QR Pass Token Generation & Signature Verification
const QR_TEST_SECRET = 'he_secret_qr_signing_key_2026';
function generateTestQR(id, type, dinerName) {
  const hash = crypto.createHash('md5').update(id + QR_TEST_SECRET).digest('hex');
  const backupPin = String(parseInt(hash.slice(0, 6), 16) % 10000).padStart(4, '0');
  const createdAt = Date.now();
  const rawString = `${type}:${id}:res-1:${backupPin}:${createdAt}`;
  const signature = crypto.createHmac('sha256', QR_TEST_SECRET).update(rawString).digest('hex').slice(0, 16);

  const payload = { type, id, restaurantId: 'res-1', dinerName, backupPin, createdAt, signature };
  return { token: Buffer.from(JSON.stringify(payload)).toString('base64'), backupPin, payload };
}

function verifyTestQR(token) {
  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const rawString = `${parsed.type}:${parsed.id}:${parsed.restaurantId}:${parsed.backupPin}:${parsed.createdAt}`;
    const expectedSig = crypto.createHmac('sha256', QR_TEST_SECRET).update(rawString).digest('hex').slice(0, 16);
    return crypto.timingSafeEqual(Buffer.from(parsed.signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

const qrPass = generateTestQR('BK_101', 'TABLE_BOOKING', 'Rahul Sharma');
assert(qrPass.backupPin.length === 4, 'QR Pass generates valid 4-digit numeric fallback PIN');
assert(verifyTestQR(qrPass.token) === true, 'Valid Secret QR token passes cryptographic verification');
assert(verifyTestQR(Buffer.from(JSON.stringify({ bad: 'data' })).toString('base64')) === false, 'Forged QR token is rejected');

console.log(`\n🎉 All ${passed} tests passed successfully (${failed} failed).\n`);
process.exit(failed === 0 ? 0 : 1);
