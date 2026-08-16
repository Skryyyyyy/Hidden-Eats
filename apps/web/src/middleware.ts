import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected path prefixes requiring authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/driver',
  '/checkout',
  '/orders',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path matches any protected pattern
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Check Supabase or Auth session cookie
    const token =
      request.cookies.get('sb-access-token')?.value ||
      request.cookies.get('sb-auth-token')?.value ||
      request.cookies.get('next-auth.session-token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Security Headers for Edge responses
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/driver/:path*',
    '/checkout/:path*',
    '/orders/:path*',
  ],
};
