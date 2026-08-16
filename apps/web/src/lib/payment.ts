/**
 * Instant UPI Deep-Linking & Payment Settlement Engine
 * Supports upi://pay protocol for Google Pay, PhonePe, Paytm, BHIM, CRED
 */

export interface UPIPaymentParams {
  payeeVPA: string; // Virtual Payment Address e.g., hiddeneats@upi
  payeeName: string; // Restaurant / Merchant Name
  amount: number; // Transaction Amount in INR (₹)
  transactionRef: string; // Unique Order Ref ID
  note?: string; // Note e.g. "Order ORD-8812 Hidden Eats"
}

/**
 * Generate standard upi://pay deep link URL
 */
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
