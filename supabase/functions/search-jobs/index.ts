import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json().catch(() => ({}));
    const JSEARCH_API_KEY = Deno.env.get('JSEARCH_API_KEY');

    if (!JSEARCH_API_KEY) {
      throw new Error('JSEARCH_API_KEY not configured');
    }

    const searchQuery = query || "Software Engineer";
    const location = "India";

    console.log(`Searching jobs for: ${searchQuery} in ${location}`);

    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery + " in " + location)}&page=1&num_pages=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JSearch API Error:", errorText);
      throw new Error(`JSearch API responded with ${response.status}`);
    }

    const data = await response.json();

    const formattedJobs = (data?.data ?? []).map((job: any) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city || job.job_country,
      type: job.job_employment_type,
      url: job.job_apply_link,
      logo: job.employer_logo
    }));

    return new Response(
      JSON.stringify(formattedJobs),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    )

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Function Error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    )
  }
})

