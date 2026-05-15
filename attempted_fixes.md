# attempted_fixes

- Updated `supabase/functions/parse-resume/index.ts` to prefer JSON-only response for Gemini (agent-friendly), with legacy function_call fallback.
- Added `PROFILE_SCHEMA` and updated system prompt to require a single JSON object matching schema.

Note: IDE/tsserver may still show Deno/esm.sh type errors because it’s not configured for Deno edge runtime; runtime execution in Supabase/Deno should be fine.

