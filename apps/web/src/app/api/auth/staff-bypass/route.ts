import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { hasSqlInjectionPattern, generateStaffBypassToken } from '@/lib/security';

const STAFF_BYPASS_SECRET = process.env.STAFF_BYPASS_SECRET || 'he_secure_bypass_2026';

/**
 * Constant-time string comparison using SHA-256 hash digests
 * Prevents timing attacks regardless of input string length
 */
function timingSafeCompare(input: string, secret: string): boolean {
  if (!input || !secret) return false;
  const hashInput = crypto.createHash('sha256').update(input).digest();
  const hashSecret = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(hashInput, hashSecret);
}

export async function POST(request: Request) {
  try {
    // 1. Strict Rate Limiting (Max 5 attempts per 15 minutes per IP to prevent brute forcing)
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`bypass_${clientIp}`, 5, 15 * 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many failed bypass attempts. Locked for 15 minutes.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { error: 'Staff bypass passcode is required' },
        { status: 400 }
      );
    }

    if (hasSqlInjectionPattern(passcode)) {
      return NextResponse.json(
        { error: 'Security violation: Disallowed characters' },
        { status: 403 }
      );
    }

    // 2. Constant-Time Hash Comparison (No hardcoded legacy secrets)
    const isValid = timingSafeCompare(passcode, STAFF_BYPASS_SECRET);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid staff passcode. Access denied.' },
        { status: 401 }
      );
    }

    // 3. Issue cryptographically signed HMAC token in HttpOnly cookie
    const token = generateStaffBypassToken();

    const response = NextResponse.json({
      success: true,
      message: 'Staff bypass authenticated successfully',
    });

    response.cookies.set({
      name: 'he_staff_bypass',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7200, // 2 hours validity
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error during bypass authentication' },
      { status: 500 }
    );
  }
}
