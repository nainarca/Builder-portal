import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Environment } from '../../environments/environment.model';

export function createSupabaseClient(environment: Environment): SupabaseClient {
  return createClient(environment.supabase.url, environment.supabase.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
