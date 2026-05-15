import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const NOTIFY_TO = "sidheshmhatre903@gmail.com";
// If user reports an issue, include our public support email in the notification
// so the customer can reach us if email delivery fails.
const SUPPORT_EMAIL = "sidheshmhatre903@gmail.com";

interface Payload {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  page?: string;
  errorContext?: string;
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const body = (await req.json()) as Payload;
    if (!body?.message || typeof body.message !== "string" || body.message.length > 4000) {
      return new Response(JSON.stringify({ error: "message is required (max 4000 chars)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (body.email && !EMAIL_RE.test(body.email)) {
      return new Response(JSON.stringify({ error: "invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safe = (s?: string) =>
      (s ?? "").replace(/[<>]/g, (c) => (c === "<" ? "&lt;" : "&gt;")).slice(0, 4000);

    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1;margin:0 0 12px">⚠️ CareerAI – User Reported Issue</h2>
        <p style="color:#475569">A user reported an error or issue while using the website.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">From</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe(body.name)} &lt;${safe(body.email)}&gt;</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Subject</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe(body.subject)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Page</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0">${safe(body.page)}</td></tr>
          ${body.errorContext ? `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:600">Context</td>
              <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-size:12px">${safe(body.errorContext)}</td></tr>` : ""}
        </table>
        <div style="background:#f8fafc;border-left:3px solid #6366f1;padding:12px 16px;border-radius:4px">
          <p style="margin:0;white-space:pre-wrap">${safe(body.message)}</p>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">Sent automatically by CareerAI contact form.</p>
      </div>`;

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "CareerAI <onboarding@resend.dev>",
        // Main internal recipient
        to: [NOTIFY_TO],
        reply_to: body.email,
        subject: `[CareerAI Issue] ${body.subject ?? "User reported a problem"}`,
        // Add our support email as blind copy so the customer can reach us
        // (helps when reply-to isn't preserved/deliverable).
        bcc: [SUPPORT_EMAIL],
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend failed [${res.status}]: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-contact-error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
