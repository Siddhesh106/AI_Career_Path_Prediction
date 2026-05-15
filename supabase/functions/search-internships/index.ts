import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const corsHeadersWithUserToken = {
  ...corsHeaders,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-user-token",
};

async function requireUser(req: Request) {
  // Frontend auth lives in the user's external Supabase project; these
  // functions are deployed in Lovable Cloud. The external session token is
  // forwarded via `x-user-token` and validated against the external project.
  const EXTERNAL_URL = "https://lhktbabwrnjinnfhdelb.supabase.co";
  const EXTERNAL_ANON =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3RiYWJ3cm5qaW5uZmhkZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTE2NjQsImV4cCI6MjA5MzcyNzY2NH0.Pdy8iaY_RiHNg5FNG2T-dBR0sY5M_OqRUWxqVvNRjTQ";
  const bearer = req.headers.get("Authorization");
  const token =
    req.headers.get("x-user-token") ??
    (bearer ? bearer.replace(/^Bearer +/i, "") : "");
  if (!token) return { error: "Unauthorized", status: 401 } as const;
  const supabase = createClient(EXTERNAL_URL, EXTERNAL_ANON);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: "Unauthorized", status: 401 } as const;
  return { user: data.user } as const;
}

interface Payload {
  what?: string;
  where?: string;
  country?: string; // ISO code, default 'in'
}

interface AdzunaResult {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  contract_time?: string;
  created: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeadersWithUserToken });

  try {
    const auth = await requireUser(req);
    if ("error" in auth) {
      return new Response(JSON.stringify({ error: auth.error }), {
        status: auth.status,
        headers: { ...corsHeadersWithUserToken, "Content-Type": "application/json" },
      });
    }

    const APP_ID = Deno.env.get("ADZUNA_APP_ID");
    const API_KEY = Deno.env.get("ADZUNA_API_KEY");
    if (!APP_ID || !API_KEY) throw new Error("Adzuna credentials not configured");

    const body = (await req.json().catch(() => ({}))) as Payload;
    const what = (body.what?.trim() || "internship").slice(0, 100);
    const where = (body.where?.trim() || "").slice(0, 100);
    const country = (body.country?.trim() || "in").toLowerCase().slice(0, 2);

    const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/1`);
    url.searchParams.set("app_id", APP_ID);
    url.searchParams.set("app_key", API_KEY);
    url.searchParams.set("results_per_page", "50");
    // Use phrase + relevance sort for more accurate matching to the user's query
    url.searchParams.set("what_phrase", what);
    if (where) url.searchParams.set("where", where);
    url.searchParams.set("sort_by", "relevance");
    url.searchParams.set("max_days_old", "30");
    url.searchParams.set("content-type", "application/json");

    const res = await fetch(url.toString());
    const data = await res.json();
    if (!res.ok) throw new Error(`Adzuna failed [${res.status}]: ${JSON.stringify(data).slice(0, 300)}`);

    const internships = (data.results as AdzunaResult[])
      .slice(0, 50)
      .map((r) => {
        const stipend =
          r.salary_min && r.salary_max
            ? `${Math.round(r.salary_min).toLocaleString()} – ${Math.round(r.salary_max).toLocaleString()}`
            : r.salary_min
              ? `${Math.round(r.salary_min).toLocaleString()}+`
              : "Stipend on request";
        return {
          id: r.id,
          title: r.title,
          company: r.company?.display_name ?? "Company",
          location: r.location?.display_name ?? "Remote",
          description: (r.description ?? "").slice(0, 220) + "...",
          apply_url: r.redirect_url,
          stipend,
          posted_at: r.created,
        };
      });

    return new Response(JSON.stringify({ count: internships.length, internships }), {
      status: 200,
      headers: { ...corsHeadersWithUserToken, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("search-internships:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeadersWithUserToken, "Content-Type": "application/json" } },
    );
  }
});
