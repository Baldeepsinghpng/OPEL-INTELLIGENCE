import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback client or real client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Diagnostic status object to display in Settings & Garage
 */
export function getSupabaseStatus() {
  return {
    isConfigured: isSupabaseConfigured,
    url: isSupabaseConfigured ? supabaseUrl : 'Demo Local Mode (In-Browser Storage)',
    mode: isSupabaseConfigured ? 'Cloud Synced' : 'Local Sandbox Mode',
  };
}
