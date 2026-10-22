import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

let client: SupabaseClient | null = null;

/** Anonymous client without cookies, so public pages can be statically cached. */
export function publicClient() {
  client ??= createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  return client;
}
