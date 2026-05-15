# Deploying Edge Functions to Your Supabase

Your frontend now talks to `lhktbabwrnjinnfhdelb.supabase.co`, but the four edge
functions (`parse-resume`, `predict-jobs`, `search-internships`,
`send-contact-error`) still live in the original Lovable Cloud project. To make
the app fully independent, deploy them to your Supabase using the script below.

## 1. One-time setup

```bash
# Install Supabase CLI
brew install supabase/tap/supabase        # macOS
# or:  scoop install supabase              (Windows)
# or:  npm i -g supabase                   (Linux/any)

# Login (opens browser)
supabase login
```

## 2. Add the required secrets in Supabase Dashboard

Go to **Project → Edge Functions → Manage secrets** and add:

| Secret             | Used by                        | Where to get it                                       |
| ------------------ | ------------------------------ | ----------------------------------------------------- |
| `LOVABLE_API_KEY`  | parse-resume, predict-jobs     | Lovable → Workspace → AI Gateway (or use OpenAI key)  |
| `ADZUNA_APP_ID`    | search-internships             | https://developer.adzuna.com/                         |
| `ADZUNA_API_KEY`   | search-internships             | https://developer.adzuna.com/                         |
| `RESEND_API_KEY`   | send-contact-error             | https://resend.com/api-keys                           |

> `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
> auto-injected by Supabase — don't set them manually.

## 3. Deploy

```bash
chmod +x supabase-external/deploy-functions.sh
./supabase-external/deploy-functions.sh
```

The script links your project (`lhktbabwrnjinnfhdelb`) and deploys all four
functions with `--no-verify-jwt` (matching the current Lovable Cloud config).

## 4. Verify

```bash
curl -i https://lhktbabwrnjinnfhdelb.supabase.co/functions/v1/search-internships \
  -H 'Content-Type: application/json' \
  -d '{"what":"frontend","where":"mumbai"}'
```

You should get a JSON response with `count` and `internships`.

## 5. (Optional) Switch the frontend to call YOUR functions

The frontend currently uses `supabase.functions.invoke(...)` against the
external client, so once deployed, **no code change is needed** — calls will
automatically hit your project.
