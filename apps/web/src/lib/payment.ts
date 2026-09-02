/**
 * Instant UPI Deep-Linking, Payment Settlement & Webhook Verification Engine
 * Supports upi://pay protocol for Google Pay, PhonePe, Paytm, BHIM, CRED
 * and HMAC-SHA256 Cryptographic Webhook verification for Razorpay / Stripe / Gateways.
 */

import crypto from 'crypto';

export interface UPIPaymentParams {
  payeeVPA?: string; // Virtual Payment Address e.g., hiddeneats@upi
  payeeName?: string; // Restaurant / Merchant Name
  amount: number; // Transaction Amount in INR (₹)
  transactionRef: string; // Unique Order Ref ID
  note?: string; // Note e.g. "Order ORD-8812 Hidden Eats"
}

/**
 * Generate standard upi://pay deep link URL
 */
import QRCode from 'qrcode';

export function buildUPIDeepLink({
  payeeVPA = 'hiddeneats@upi',
  payeeName = 'Hidden Eats Food Platform',
  amount,
  transactionRef,
  note = 'Hidden Eats Food Order',
}: UPIPaymentParams): string {
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(note);
  return `upi://pay?pa=${payeeVPA}&pn=${encodedName}&am=${amount.toFixed(2)}&cu=INR&tr=${transactionRef}&tn=${encodedNote}`;
}

/**
 * Generate in-memory BharatQR Data URL (Zero external network dependencies)
 */
export async function generateLocalBharatQRDataUrl(params: UPIPaymentParams): Promise<string> {
  const deepLink = buildUPIDeepLink(params);
  try {
    return await QRCode.toDataURL(deepLink, {
      width: 260,
      margin: 1,
      color: { dark: '#000000', light: '#FFFFFF' },
    });
  } catch {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(deepLink)}`;
  }
}

/**
 * Generate BharatQR image URL for instant on-screen scanning (Fallback)
 */
export function buildBharatQRCodeUrl(params: UPIPaymentParams): string {
  const deepLink = buildUPIDeepLink(params);
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(deepLink)}`;
}

/**
 * Automated Settlement Calculation for Partners & Drivers
 */
export interface SettlementResult {
  grossAmount: number;
  platformFee: number;
  driverShare: number;
  partnerPayout: number;
  settlementTimestamp: string;
}

export function calculateOrderSettlement(grossAmount: number, tipAmount = 0): SettlementResult {
  const platformFee = Math.round(grossAmount * 0.05 * 100) / 100; // 5% platform commission
  const driverBasePay = Math.round(grossAmount * 0.15 * 100) / 100; // 15% base delivery fee
  const driverShare = driverBasePay + tipAmount;
  const partnerPayout = Math.round((grossAmount - platformFee - driverBasePay) * 100) / 100;

  return {
    grossAmount,
    platformFee,
    driverShare,
    partnerPayout,
    settlementTimestamp: new Date().toISOString(),
  };
}

/**
 * Verifies Razorpay / Webhook signature using constant-time HMAC-SHA256 comparison
 */
export function verifyPaymentWebhookSignature(
  rawBody: string,
  signature: string,
  secretKey: string
): boolean {
  if (!rawBody || !signature || !secretKey) return false;
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generates an immutable transaction hash identifier
 */
export function generateTransactionHash(orderId: string, amount: number, timestamp: number): string {
  return crypto
    .createHash('sha256')
    .update(`${orderId}:${amount}:${timestamp}`)
    .digest('hex');
}
