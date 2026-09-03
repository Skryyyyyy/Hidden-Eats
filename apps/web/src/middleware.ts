import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected path prefixes requiring authenticated session
const PROTECTED_DASHBOARD_PATHS = ['/dashboard'];
const PROTECTED_DRIVER_PATHS = ['/driver'];

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

  // 2. Authentication Route Guards for Dashboard & Driver routes
  const isDev = process.env.NODE_ENV === 'development';
  const hasAuthSession =
    isDev ||
    request.cookies.has('sb-access-token') ||
    request.cookies.has('supabase-auth-token') ||
    Array.from(request.cookies.getAll()).some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')) ||
    request.cookies.get('he_staff_bypass')?.value === 'true';

  // Check /dashboard protection — Redirect unauthenticated users to partner login
  if (PROTECTED_DASHBOARD_PATHS.some((prefix) => pathname.startsWith(prefix))) {
    if (!hasAuthSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login/partner';
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check /driver protection — Redirect unauthenticated drivers to user/driver login
  if (PROTECTED_DRIVER_PATHS.some((prefix) => pathname.startsWith(prefix))) {
    if (!hasAuthSession) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login/user';
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Edge Security Headers & Content Security Policy (CSP)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), geolocation=(self), microphone=()'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:;"
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
