import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected path prefixes
const PROTECTED_DASHBOARD_PATHS = ['/dashboard', '/driver'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Maintenance Mode Interceptor
  const isMaintenanceEnv = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const hasStaffBypass = request.cookies.get('he_staff_bypass')?.value === 'true';

  if (isMaintenanceEnv && !hasStaffBypass && pathname !== '/maintenance' && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = '/maintenance';
    return NextResponse.redirect(maintenanceUrl);
  }

  // 2. Edge Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), geolocation=(self), microphone=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
