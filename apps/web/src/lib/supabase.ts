import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Browser-side Supabase Client
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Server-side Supabase Client for API Routes and Server Components
 */
export function createServerSupabaseClient(request?: Request) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        if (!request) return undefined;
        const cookieHeader = request.headers.get('cookie') || '';
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map((c) => {
            const [k, ...v] = c.split('=');
            return [k, decodeURIComponent(v.join('='))];
          })
        );
        return cookies[name];
      },
      set(name: string, value: string, options: CookieOptions) {
        // Handled via response headers in Next.js
      },
      remove(name: string, options: CookieOptions) {
        // Handled via response headers in Next.js
      },
    },
  });
}

/**
 * Administrative Service Role Client (Strictly for Server-Side / Cron Operations)
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return createSupabaseClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
