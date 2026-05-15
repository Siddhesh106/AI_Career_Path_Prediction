import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function requireUser(req: Request) {
  const EXTERNAL_URL = "https://lhktbabwrnjinnfhdelb.supabase.co";
  const EXTERNAL_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa3RiYWJ3cm5qaW5uZmhkZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTE2NjQsImV4cCI6MjA5MzcyNzY2NH0.Pdy8iaY_RiHNg5FNG2T-dBR0sY5M_OqRUWxqVvNRjTQ";
  const bearer = req.headers.get("Authorization");
  const token = req.headers.get("x-user-token") ?? (bearer ? bearer.replace(/^Bearer +/i, "") : "");
  if (!token) return { error: "Unauthorized", status: 401 } as const;
  const sb = createClient(EXTERNAL_URL, EXTERNAL_ANON);
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return { error: "Unauthorized", status: 401 } as const;
  return { user: data.user } as const;
}

const SYSTEM = `You are a resume parser. Extract information and return ONLY a valid JSON object with no markdown fences.

JSON structure:
{
  "name": "", "email": "", "phone": "", "location": "",
  "bio": "2-3 sentence professional summary",
  "experienceYears": 0,
  "skills": [{ "name": "", "level": "beginner|intermediate|advanced|expert", "yearsOfExperience": 0 }],
  "education": [{ "institution": "", "degree": "", "field": "", "startYear": 0, "endYear": 0 }],
  "workExperience": [{ "company": "", "title": "", "startDate": "", "endDate": "", "description": "" }],
  "preferredRoles": [],
  "preferredStack": []
}

Use "" for missing strings, 0 for missing numbers, [] for missing arrays. Never invent data.`;

function extractJson(raw: string) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const clean = (fenced ? fenced[1] : raw).trim();
  try { return JSON.parse(clean); } catch {
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) try { return JSON.parse(clean.slice(s, e + 1)); } catch { /**/ }
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = await requireUser(req);
    if ("error" in auth) {
      return new Response(JSON.stringify({ error: auth.error }), {
        status: auth.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Trim to remove any whitespace/quotes introduced by Windows secret storage
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY")?.trim().replace(/^["']|["']$/g, "");
    if (!GOOGLE_API_KEY) {
      return new Response(JSON.stringify({ error: "GOOGLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { fileBase64, mimeType, fileName } = (await req.json()) as {
      fileBase64: string;
      mimeType: string;
      fileName?: string;
    };

    if (!fileBase64 || !mimeType) {
      return new Response(JSON.stringify({ error: "fileBase64 and mimeType required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hadDataUriPrefix = fileBase64.includes(",");
    const sampleB64 = fileBase64.slice(0, 120);
    const looksLikeBase64 = /^[A-Za-z0-9+/\n\r=]+$/.test(sampleB64.replace(/\r|\n/g, ""));

    console.log("Parsing resume payload:", {
      fileName,
      mimeType,
      kb: Math.round(fileBase64.length / 1024),
      hadDataUriPrefix,
      sampleB64: sampleB64.replace(/\s+/g, ""),
      looksLikeBase64,
      // Avoid logging massive payloads; just confirm shape
      base64Len: fileBase64.length,
    });

    const normalizeB64 = (b64: string) => {
      // If frontend ever sends a data URI accidentally, strip it.
      return b64.includes(",") ? b64.split(",")[1] : b64;
    };

    const safeB64 = normalizeB64(fileBase64);

    // Hard fail early with a useful debug message.
    const safeSample = safeB64.slice(0, 120);
    const safeLooksLikeBase64 = /^[A-Za-z0-9+/\n\r=]+$/.test(safeSample.replace(/\r|\n/g, ""));

    if (!safeLooksLikeBase64) {
      return new Response(
        JSON.stringify({
          error: "Invalid base64 payload (failed character check)",
          mimeType,
          hadDataUriPrefix,
          base64Len: safeB64.length,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build Gemini request parts
    let parts: any[];

    if (mimeType === "text/plain") {
      const b64 = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
      const decoded = atob(b64);
      const text = new TextDecoder().decode(Uint8Array.from(decoded, (c) => c.charCodeAt(0)));
      parts = [
        { text: `${SYSTEM}\n\nParse this resume:\n\n${text}` },
      ];
    } else if (mimeType === "application/pdf" || mimeType.startsWith("image/")) {
      const b64 = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
      parts = [
        { text: SYSTEM },
        { inlineData: { mimeType, data: b64 } },
        { text: "Parse the resume above and return ONLY the JSON object." },
      ];
    } else {
      return new Response(JSON.stringify({ error: `Unsupported type: ${mimeType}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_URL =
      // Stable endpoint to avoid v1beta quota/verification restrictions
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;


    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
        // Disable safety filters that may flag resume keywords (medical, political, etc.)
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`Gemini ${geminiRes.status}:`, errText.slice(0, 400));
      return new Response(
        JSON.stringify({ error: `AI error: ${geminiRes.status}`, details: errText.slice(0, 300) }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await geminiRes.json();
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("Gemini output (first 200):", rawText.slice(0, 200));

    const profile = extractJson(rawText);
    if (!profile) {
      console.error("JSON parse failed. Raw:", rawText.slice(0, 400));
      return new Response(
        JSON.stringify({ error: "Model returned non-JSON output", raw: rawText.slice(0, 200) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ profile }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("parse-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});