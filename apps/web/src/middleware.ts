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
