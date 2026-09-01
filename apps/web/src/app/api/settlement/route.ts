import { NextResponse } from 'next/server';
import { calculateOrderSettlement, buildUPIDeepLink } from '@/lib/payment';
import { SecuritySchemas, hasSqlInjectionPattern } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parseResult = SecuritySchemas.settlement.safeParse({
      ...rawBody,
      totalAmount: Number(rawBody.totalAmount),
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid settlement amount or UPI parameters' },
        { status: 400 }
      );
    }

    const { totalAmount, payeeVPA, payeeName } = parseResult.data;

    if ((payeeVPA && hasSqlInjectionPattern(payeeVPA)) || (payeeName && hasSqlInjectionPattern(payeeName))) {
      return NextResponse.json(
        { error: 'Security violation: Disallowed SQL characters detected in payee parameters' },
        { status: 403 }
      );
    }

    // 1. Calculate 3-Way Revenue Settlement Split (85% Restaurant, 10% Driver, 5% Platform)
    const settlement = calculateOrderSettlement(totalAmount);

    // 2. Generate 1-Tap UPI Deep Link
    const vpa = payeeVPA || 'hiddeneats@upi';
    const name = payeeName || 'Hidden Eats Partner';
    const upiLink = buildUPIDeepLink({
      payeeVPA: vpa,
      payeeName: name,
      amount: totalAmount,
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
