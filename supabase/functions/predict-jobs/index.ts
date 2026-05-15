import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/** Strip markdown code fences that Claude sometimes wraps JSON in. */
function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();
  return raw.trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json();
    const { skills, bio } = body;

    if (!skills || !Array.isArray(skills) || !bio) {
      return new Response(
        JSON.stringify({ error: 'Invalid input: skills (array) and bio (string) required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      console.error('❌ GOOGLE_API_KEY is not configured in Supabase secrets');
      return new Response(
        JSON.stringify({ error: 'GOOGLE_API_KEY not configured. Please set it via: npx supabase secrets set GOOGLE_API_KEY=<key>' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔍 Calling Gemini API with ${skills.length} skills`);

    // Stable endpoint to avoid v1beta quota/verification restrictions
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
    const promptText = `Generate exactly 20 job titles that match these skills and experience.

Skills: ${skills.join(', ')}
Bio: ${bio}

Respond with ONLY a valid JSON object (no markdown, no extra text):
{"roles": ["Title 1", "Title 2", ..., "Title 20"]}`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini API error ${response.status}:`, errorData);
      return new Response(
        JSON.stringify({ error: `Gemini API failed with status ${response.status}`, details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error('Unexpected Gemini response format:', JSON.stringify(result));
      return new Response(
        JSON.stringify({ error: 'Unexpected Gemini response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Raw Gemini output (first 200 chars):', rawText.slice(0, 200));

    const cleanedText = extractJson(rawText);
    let data: { roles: string[] };

    try {
      data = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('Failed to parse Claude JSON:', cleanedText.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'Claude returned non-JSON output', raw: rawText.slice(0, 300) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data.roles || !Array.isArray(data.roles) || data.roles.length === 0) {
      console.error('Claude did not return roles array:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Claude did not return a roles array' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Trim to 20 max (be lenient; log if different)
    if (data.roles.length !== 20) {
      console.warn(`Claude returned ${data.roles.length} roles (expected 20) — using what was returned`);
    }
    data.roles = data.roles.slice(0, 20);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('predict-jobs unhandled error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
