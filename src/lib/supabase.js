// IMPORTANT: To enable Realtime, go to Supabase Dashboard > Database > Replication
// and toggle ON the 'reviews' and 'inquiries' tables.
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.error(
    'CRITICAL: Supabase URL or Anon Key is missing from the environment variables. Please check your .env file.'
  );
}

// Only create a real client if correctly configured.
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
