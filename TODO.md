# TODO
- [x] (Plan approved) Add debugging + base64 normalization to `supabase/functions/parse-resume/index.ts` to surface Anthropic’s exact 400 reason.

- [x] Re-run resume upload with a failing file; capture edge logs for Anthropic 400 response body.
- [x] Cause identified: Anthropic 400 due to insufficient credit balance.
- [ ] Apply minimal remaining UX fix: show correct user-facing credit/insufficient message.

- [ ] Apply the minimal payload fix based on Anthropic’s error message.
- [ ] Verify with PDF + PNG test resumes.

