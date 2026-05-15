// External Supabase client — points to the user's own Supabase project.
// The anon key is a public JWT and is safe to ship in the client bundle.
// To deploy the schema/RLS/triggers into this project, run the SQL in
// `supabase-external/schema.sql` inside the Supabase SQL editor.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const SUPABASE_URL = "https://lhktbabwrnjinnfhdelb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3RiYWJ3cm5qaW5uZmhkZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTE2NjQsImV4cCI6MjA5MzcyNzY2NH0.Pdy8iaY_RiHNg5FNG2T-dBR0sY5M_OqRUWxqVvNRjTQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
