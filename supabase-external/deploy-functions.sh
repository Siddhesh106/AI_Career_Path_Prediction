#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Deploy all CareerAI edge functions to YOUR Supabase project.
#
# Prereqs (one-time):
#   1. Install Supabase CLI:  https://supabase.com/docs/guides/cli
#        macOS:   brew install supabase/tap/supabase
#        Windows: scoop install supabase
#        Linux:   npm i -g supabase   (or use the install script)
#   2. Log in:    supabase login
#   3. Get a Personal Access Token from:
#        https://supabase.com/dashboard/account/tokens
#   4. Get your project ref ("lhktbabwrnjinnfhdelb") from your Supabase URL.
#
# Usage:
#   chmod +x supabase-external/deploy-functions.sh
#   ./supabase-external/deploy-functions.sh
#
# Or override the ref:
#   PROJECT_REF=xxxxxxxxxx ./supabase-external/deploy-functions.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT_REF="${PROJECT_REF:-lhktbabwrnjinnfhdelb}"
FUNCTIONS=(parse-resume predict-jobs search-internships send-contact-error)

# Sanity checks
command -v supabase >/dev/null 2>&1 || {
  echo "❌ Supabase CLI not found. Install it: https://supabase.com/docs/guides/cli"
  exit 1
}

echo "🔗 Linking project: $PROJECT_REF"
supabase link --project-ref "$PROJECT_REF" || true

# ─── Step 1: Set required secrets on YOUR Supabase project ──────────────────
# These are needed by the edge functions at runtime.
# Uncomment + fill in real values, OR run them manually before deploying.
#
# supabase secrets set --project-ref "$PROJECT_REF" \
#   LOVABLE_API_KEY="sk-..."         `# for parse-resume + predict-jobs (Lovable AI Gateway)` \
#   ADZUNA_APP_ID="..."              `# for search-internships` \
#   ADZUNA_API_KEY="..."             `# for search-internships` \
#   RESEND_API_KEY="re_..."          `# for send-contact-error`
#
# NOTE: SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are
# automatically injected by Supabase — do NOT set them manually.

echo ""
echo "⚠️  Make sure these secrets exist on your project (Dashboard → Edge Functions → Secrets):"
echo "    LOVABLE_API_KEY, ADZUNA_APP_ID, ADZUNA_API_KEY, RESEND_API_KEY"
echo ""
read -p "Press ENTER to continue with deploy, or Ctrl+C to abort..."

# ─── Step 2: Deploy each function with verify_jwt = false ───────────────────
# (Matches the current Lovable Cloud config — your frontend can call them
#  without an auth token.)
for fn in "${FUNCTIONS[@]}"; do
  echo ""
  echo "🚀 Deploying $fn ..."
  supabase functions deploy "$fn" \
    --project-ref "$PROJECT_REF" \
    --no-verify-jwt
done

echo ""
echo "✅ All edge functions deployed to https://${PROJECT_REF}.supabase.co/functions/v1/"
echo ""
echo "Test them:"
echo "  curl -i https://${PROJECT_REF}.supabase.co/functions/v1/search-internships \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"what\":\"frontend\",\"where\":\"mumbai\"}'"
