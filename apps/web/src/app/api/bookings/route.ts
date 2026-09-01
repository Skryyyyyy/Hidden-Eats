import { NextResponse } from 'next/server';
import { SecuritySchemas, hasSqlInjectionPattern } from '@/lib/security';

export async function GET() {
  return NextResponse.json({
    bookings: [
      {
        id: 'BK_101',
        dinerName: 'Rahul Sharma',
        partySize: 4,
        timeSlot: '8:00 PM - 9:00 PM',
        date: 'Today',
        specialNotes: 'Window seating preferred for birthday celebration',
        status: 'PENDING',
      },
      {
        id: 'BK_102',
        dinerName: 'Priya Sundaram',
        partySize: 2,
        timeSlot: '8:30 PM - 9:30 PM',
        date: 'Today',
        specialNotes: 'Authentic Seeraga Samba Biryani tasting',
        status: 'CONFIRMED',
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const parseResult = SecuritySchemas.bookingAction.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid booking payload or illegal characters detected' },
        { status: 400 }
      );
    }

    const { bookingId, action } = parseResult.data;

    if (hasSqlInjectionPattern(bookingId)) {
      return NextResponse.json(
        { error: 'Security violation: SQL injection signature detected in identifier' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking ${bookingId} has been ${action === 'APPROVE' ? 'Approved & Confirmed' : 'Rejected'}`,
      bookingId,
      status: action === 'APPROVE' ? 'CONFIRMED' : 'REJECTED',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
