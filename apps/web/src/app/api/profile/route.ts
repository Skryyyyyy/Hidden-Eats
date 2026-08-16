import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    profile: {
      fullName: 'Rahul Sharma',
      username: 'foodie_explorer',
      email: 'explorer@hiddeneats.com',
      mobile: '+91 98765 43210',
      avatarUrl: null,
      preferredLanguage: 'en',
      currency: 'INR',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, username, email, avatarUrl, bitmojiConfig, preferredLanguage } = body;

    // Return updated profile response
    return NextResponse.json({
      success: true,
      message: 'Profile and Bitmoji avatar updated successfully',
      profile: {
        fullName: fullName || 'Rahul Sharma',
        username: username || 'foodie_explorer',
        email: email || 'explorer@hiddeneats.com',
        avatarUrl: avatarUrl || null,
        bitmojiConfig: bitmojiConfig || null,
        preferredLanguage: preferredLanguage || 'en',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile settings' },
      { status: 500 }
    );
  }
}
