import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
const env = await load();
const GEMINI_API_KEY = env["VITE_GEMINI_API_KEY"];
const ADZUNA_APP_ID = env["ADZUNA_APP_ID"];
const ADZUNA_API_KEY = env["ADZUNA_API_KEY"];

console.log("Testing Gemini API...");
const testResume = "Software Engineer with 5 years of experience in React and Node.js.";
const PROFILE_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    skills: { type: "array", items: { type: "object", properties: { name: { type: "string" } } } }
  }
};
const aiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Extract profile details: " + testResume }] }],
      system_instruction: { parts: [{ text: "Return JSON matching the schema: " + JSON.stringify(PROFILE_SCHEMA) }] },
      generationConfig: { response_mime_type: "application/json" },
    }),
  }
);
if (aiRes.ok) {
  const data = await aiRes.json();
  console.log("Gemini parsed successfully!");
} else {
  console.error("Gemini failed:", await aiRes.text());
}

console.log("\nTesting Adzuna API...");
const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=1&what=Software%20Engineer`;
const adzunaRes = await fetch(url, { headers: { "Accept": "application/json" } });
if (adzunaRes.ok) {
  const data = await adzunaRes.json();
  console.log("Adzuna search successful! Found results:", data.results.length);
} else {
  console.error("Adzuna failed:", await adzunaRes.text());
}
