import { NextResponse } from 'next/server';
import { verifySecretQRToken } from '@/lib/qrPass';
import { verifyTrustedOrigin } from '@/lib/security';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Origin & CSRF Verification
    if (!verifyTrustedOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Untrusted origin' },
        { status: 403 }
      );
    }

    // 2. Distributed Rate Limiting (Max 30 scans per minute per IP)
    const clientIp = getClientIp(request);
    const rateLimit = await checkDistributedRateLimit(`qr_scan_${clientIp}`, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many scan attempts. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { tokenOrPin, restaurantId } = body;

    if (!tokenOrPin || typeof tokenOrPin !== 'string') {
      return NextResponse.json(
        { error: 'Scanned QR token or 4-digit PIN is required' },
        { status: 400 }
      );
    }

    // 3. Verify Cryptographic Token
    const result = verifySecretQRToken(tokenOrPin, restaurantId);

    if (!result.isValid || !result.payload) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid or expired QR pass' },
        { status: 400 }
      );
    }

    // Return successfully decoded pass details
    return NextResponse.json({
      success: true,
      message: `${result.payload.type === 'TABLE_BOOKING' ? 'Table Reservation Verified' : 'Food Order Pickup Verified'}!`,
      pass: result.payload,
      verifiedAt: new Date().toISOString(),
      actionStatus: result.payload.type === 'TABLE_BOOKING' ? 'SEATED' : 'HANDED_OVER',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to verify QR pass' },
      { status: 500 }
    );
  }
}
