import { NextResponse } from 'next/server';
import { SecuritySchemas, hasSqlInjectionPattern } from '@/lib/security';

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
    const rawBody = await request.json();
    const parseResult = SecuritySchemas.profileUpdate.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid profile data or illegal character format' },
        { status: 400 }
      );
    }

    const { fullName, username, email, avatarUrl, bitmojiConfig, preferredLanguage } = parseResult.data;

    if (
      hasSqlInjectionPattern(fullName) ||
      hasSqlInjectionPattern(username) ||
      hasSqlInjectionPattern(email)
    ) {
      return NextResponse.json(
        { error: 'Security violation: Disallowed SQL syntax detected in profile fields' },
        { status: 403 }
      );
    }

    // Return updated profile response
    return NextResponse.json({
      success: true,
      message: 'Profile and Bitmoji avatar updated successfully',
      profile: {
        fullName,
        username,
        email,
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
