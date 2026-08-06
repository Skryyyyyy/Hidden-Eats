import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(supabaseUrl?: string, supabaseAnonKey?: string): SupabaseClient {
  if (supabaseInstance) return supabaseInstance;

  const url = supabaseUrl || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = supabaseAnonKey || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    console.warn('Supabase URL or Anon Key is missing. Check your environment variables.');
  }

  supabaseInstance = createClient(url, anonKey);
  return supabaseInstance;
}
