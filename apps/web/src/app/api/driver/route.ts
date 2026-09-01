import { NextResponse } from 'next/server';
import { SecuritySchemas, hasSqlInjectionPattern } from '@/lib/security';

export async function GET() {
  return NextResponse.json({
    activeMissions: [
      {
        id: 'ORD_9912',
        restaurantName: 'Grand Secret Kitchen',
        pickupAddress: 'T. Nagar, Chennai',
        deliveryAddress: 'Nungambakkam High Road, Chennai',
        dinerPhone: '+91 98765 43210',
        otpCode: '4892',
        status: 'DISPATCHED',
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
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

    // Verify 4-Digit Handover OTP
    const isValidOtp = String(inputOtp) === '4892';

    if (!isValidOtp) {
      return NextResponse.json(
        { success: false, error: 'Invalid 4-digit handover OTP code' },
        { status: 400 }
      );
    }

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
