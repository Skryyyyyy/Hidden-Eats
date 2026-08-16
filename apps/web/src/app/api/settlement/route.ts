import { NextResponse } from 'next/server';
import { calculateOrderSettlement, buildUPIDeepLink } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { totalAmount, payeeVPA, payeeName } = body;

    const amount = Number(totalAmount) || 0;
    if (amount <= 0) {
      return NextResponse.json({ error: 'Valid total amount is required' }, { status: 400 });
    }

    // 1. Calculate 3-Way Revenue Settlement Split (85% Restaurant, 10% Driver, 5% Platform)
    const settlement = calculateOrderSettlement(amount);

    // 2. Generate 1-Tap UPI Deep Link
    const vpa = payeeVPA || 'hiddeneats@upi';
    const name = payeeName || 'Hidden Eats Partner';
    const upiLink = buildUPIDeepLink({
      payeeVPA: vpa,
      payeeName: name,
      amount,
      transactionRef: 'HE_' + Date.now(),
      note: 'Hidden Eats Food Order',
    });

    return NextResponse.json({
      success: true,
      settlement,
      upiDeepLink: upiLink,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process payment settlement' },
      { status: 500 }
    );
  }
}
