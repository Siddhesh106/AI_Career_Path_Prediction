// Edge functions live in Lovable Cloud (this project's Supabase), but auth/data
// live in the user's external Supabase project. This client is ONLY used to
// invoke edge functions. It forwards the external session token via a custom
// header (`x-user-token`) which the functions validate against the external
// project's auth.
import { createClient } from "@supabase/supabase-js";
import { supabase as externalSupabase } from "@/integrations/external-supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const cloud = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function invokeFunction<T = unknown>(
  name: string,
  body?: Record<string, unknown>,
  requiresAuth = true,
): Promise<{ data: T | null; error: Error | null }> {
  const { data: { session } } = await externalSupabase.auth.getSession();
  if (requiresAuth && !session) return { data: null, error: new Error("Not authenticated") };

  return cloud.functions.invoke<T>(name, {
    body,
    headers: session ? { "x-user-token": session.access_token } : {},
  });
}
