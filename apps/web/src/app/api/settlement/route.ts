import { NextResponse } from 'next/server';
import { calculateOrderSettlement, buildUPIDeepLink } from '@/lib/payment';
import { SecuritySchemas, hasSqlInjectionPattern, verifyTrustedOrigin } from '@/lib/security';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Origin & CSRF Verification
    if (!verifyTrustedOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Untrusted cross-site request origin' },
        { status: 403 }
      );
    }

    // 2. Rate Limiting Protection (Max 20 settlement calculations per minute per IP)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`settlement_post_${clientIp}`, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)) } }
      );
    }

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

    // 3. Calculate 3-Way Revenue Settlement Split (85% Restaurant, 10% Driver, 5% Platform)
    const settlement = calculateOrderSettlement(totalAmount);

    // 4. Generate 1-Tap UPI Deep Link
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
