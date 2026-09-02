import { NextResponse } from 'next/server';
import { SecuritySchemas, hasSqlInjectionPattern, verifyTrustedOrigin } from '@/lib/security';
import { checkDistributedRateLimit, getClientIp } from '@/lib/rateLimit';

// Simulated active order database store
const ACTIVE_MISSIONS = [
  {
    id: 'ORD_9912',
    restaurantName: 'Grand Secret Kitchen',
    pickupAddress: 'T. Nagar, Chennai',
    deliveryAddress: 'Nungambakkam High Road, Chennai',
    dinerPhone: '+91 98*** ***10', // PII Masked
    status: 'DISPATCHED',
    expectedOtpHash: '4892', // Secure server-side check
  },
];

export async function GET(request: Request) {
  // Public mission list with masked PII and zero OTP leakage
  const safeMissions = ACTIVE_MISSIONS.map(({ expectedOtpHash, ...safeMission }) => safeMission);

  return NextResponse.json({
    activeMissions: safeMissions,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    // 1. Origin & CSRF Verification
    if (!verifyTrustedOrigin(request)) {
      return NextResponse.json(
        { error: 'Forbidden: Untrusted cross-site request origin' },
        { status: 403 }
      );
    }

    // 2. Distributed Rate Limiting Protection (Max 10 OTP attempts per minute per IP to block brute force)
    const clientIp = getClientIp(request);
    const rateLimit = await checkDistributedRateLimit(`driver_otp_${clientIp}`, 10, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many OTP attempts. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.reset - Date.now()) / 1000)) } }
      );
    }

    const rawBody = await request.json();
    const parseResult = SecuritySchemas.driverHandover.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid handover parameters or malformed OTP' },
        { status: 400 }
      );
    }

    const { orderId, inputOtp } = parseResult.data;

    if (hasSqlInjectionPattern(orderId) || hasSqlInjectionPattern(inputOtp)) {
      return NextResponse.json(
        { error: 'Security violation: Disallowed SQL characters detected' },
        { status: 403 }
      );
    }

    // 3. Server-side OTP Verification against active mission records
    const mission = ACTIVE_MISSIONS.find((m) => m.id === orderId);
    if (!mission) {
      return NextResponse.json(
        { success: false, error: 'Order not found or already completed' },
        { status: 404 }
      );
    }

    const isValidOtp = String(inputOtp) === mission.expectedOtpHash;

    if (!isValidOtp) {
      return NextResponse.json(
        { success: false, error: 'Invalid 4-digit handover OTP code' },
        { status: 400 }
      );
    }

    mission.status = 'DELIVERED';

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} delivered successfully! Handover verified.`,
      status: 'DELIVERED',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to verify driver OTP handover' },
      { status: 500 }
    );
  }
}
