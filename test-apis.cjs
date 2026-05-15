const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    env[match[1].trim()] = val;
  }
});

const GEMINI_API_KEY = env["VITE_GEMINI_API_KEY"];
const ADZUNA_APP_ID = env["ADZUNA_APP_ID"];
const ADZUNA_API_KEY = env["ADZUNA_API_KEY"];

async function run() {
  console.log("Testing Gemini API...");
  const testResume = "Software Engineer with 5 years of experience in React and Node.js.";
  const PROFILE_SCHEMA = {
    type: "object",
    properties: {
      name: { type: "string" },
      skills: { type: "array", items: { type: "object", properties: { name: { type: "string" } } } }
    }
  };
  const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
  if (modelsRes.ok) {
    const models = await modelsRes.json();
    console.log("Available Gemini Models:", models.models.map(m => m.name).join(", "));
  } else {
    console.error("ListModels failed:", await modelsRes.text());
  }

  const aiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    console.log("Gemini parsed successfully!", JSON.stringify(data.candidates[0].content));
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
}

run();
