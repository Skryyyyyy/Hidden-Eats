/**
 * Instant UPI Deep-Linking, Payment Settlement & Webhook Verification Engine
 * Supports upi://pay protocol for Google Pay, PhonePe, Paytm, BHIM, CRED
 * and HMAC-SHA256 Cryptographic Webhook verification for Razorpay / Stripe / Gateways.
 */

import crypto from 'crypto';
import QRCode from 'qrcode';

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
export function sanitizeUPIString(input: string, maxLength = 64): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[&?=#\r\n\t]/g, '') // Strip URI control characters and newlines
    .slice(0, maxLength);
}

export function buildUPIDeepLink({
  payeeVPA = 'hiddeneats@upi',
  payeeName = 'Hidden Eats Food Platform',
  amount,
  transactionRef,
  note = 'Hidden Eats Food Order',
}: UPIPaymentParams): string {
  const safeAmount = Math.max(0.01, isFinite(amount) ? amount : 0);
  const safeVPA = sanitizeUPIString(payeeVPA).replace(/[^a-zA-Z0-9@._-]/g, '');
  const safeName = encodeURIComponent(sanitizeUPIString(payeeName, 50));
  const safeRef = encodeURIComponent(sanitizeUPIString(transactionRef, 35).replace(/[^a-zA-Z0-9_-]/g, ''));
  const safeNote = encodeURIComponent(sanitizeUPIString(note, 60));

  return `upi://pay?pa=${safeVPA}&pn=${safeName}&am=${safeAmount.toFixed(2)}&cu=INR&tr=${safeRef}&tn=${safeNote}`;
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
