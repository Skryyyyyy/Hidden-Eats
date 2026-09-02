import { calculateOrderSettlement, buildUPIDeepLink, verifyPaymentWebhookSignature, generateTransactionHash } from '../payment';
import { checkRateLimit, getClientIp } from '../rateLimit';
import { SecuritySchemas, hasSqlInjectionPattern, isValidIdentifier, verifyTrustedOrigin } from '../security';

/**
 * System Core Utilities Test Suite
 */
export function runSystemTests() {
  console.log('🧪 Running Hidden Eats System & Security Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Payment Settlement Calculations (85% Partner, 10% Driver, 5% Platform)
  const settlement = calculateOrderSettlement(1000, 50);
  assert(settlement.grossAmount === 1000, 'Settlement grossAmount matches input');
  assert(settlement.platformFee === 50, 'Platform fee calculates accurately (5%)');
  assert(settlement.driverShare === 200, 'Driver share includes base (15%) + tip (50)');
  assert(settlement.partnerPayout === 800, 'Partner payout matches net revenue');

  // 2. UPI Deep Link Protocol
  const upiLink = buildUPIDeepLink({
    payeeVPA: 'partner@upi',
    payeeName: 'Grand Secret Kitchen',
    amount: 340,
    transactionRef: 'ORD_101',
    note: 'Biryani Order',
  });
  assert(upiLink.startsWith('upi://pay?'), 'UPI deep link starts with upi://pay protocol');
  assert(upiLink.includes('pa=partner%40upi') || upiLink.includes('pa=partner@upi'), 'UPI payee VPA is encoded correctly');
  assert(upiLink.includes('am=340.00'), 'UPI amount is formatted with two decimals');

  // 3. Webhook Signature Verification (HMAC-SHA256)
  const secretKey = 'test_webhook_secret_key';
  const rawPayload = JSON.stringify({ event: 'payment.captured', orderId: 'ORD_101', amount: 340 });
  const crypto = require('crypto');
  const validSignature = crypto.createHmac('sha256', secretKey).update(rawPayload).digest('hex');

  assert(
    verifyPaymentWebhookSignature(rawPayload, validSignature, secretKey) === true,
    'Valid HMAC-SHA256 webhook signature is accepted'
  );
  assert(
    verifyPaymentWebhookSignature(rawPayload, 'invalid_forged_sig', secretKey) === false,
    'Invalid/forged webhook signature is rejected'
  );

  // 4. Rate Limiter (Sliding Window)
  const ipKey = 'test_client_ip_' + Date.now();
  const rl1 = checkRateLimit(ipKey, 2, 60000);
  assert(rl1.success === true && rl1.remaining === 1, 'First rate limit check succeeds with 1 remaining');
  const rl2 = checkRateLimit(ipKey, 2, 60000);
  assert(rl2.success === true && rl2.remaining === 0, 'Second rate limit check succeeds with 0 remaining');
  const rl3 = checkRateLimit(ipKey, 2, 60000);
  assert(rl3.success === false && rl3.remaining === 0, 'Third rate limit check is throttled');

  // 5. Security & Identifier Validation
  assert(isValidIdentifier('ORD_9912') === true, 'Standard order ID format is valid');
  assert(isValidIdentifier('res-101_v2') === true, 'Alphanumeric with dash/underscore is valid');
  assert(isValidIdentifier("ORD'; DROP TABLE users;--") === false, 'SQL injection identifier is rejected');

  // 6. SQL Injection Pattern Detection
  assert(hasSqlInjectionPattern("SELECT * FROM users WHERE '1'='1'") === true, 'SQL injection union/select pattern is detected');
  assert(hasSqlInjectionPattern("Sri Balaji Mutton Mess") === false, 'Clean restaurant name has no SQL injection pattern');

  // 7. Zod Security Schemas
  const validBooking = SecuritySchemas.bookingAction.safeParse({ bookingId: 'BK_101', action: 'APPROVE' });
  assert(validBooking.success === true, 'Valid booking payload passes schema check');

  const invalidBooking = SecuritySchemas.bookingAction.safeParse({ bookingId: 'BK_101', action: 'DELETE' });
  assert(invalidBooking.success === false, 'Illegal booking action is rejected');

  console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed.\n`);
  return failed === 0;
}

// Auto-execute if run directly
if (typeof require !== 'undefined' && require.main === module) {
  const success = runSystemTests();
  process.exit(success ? 0 : 1);
}
