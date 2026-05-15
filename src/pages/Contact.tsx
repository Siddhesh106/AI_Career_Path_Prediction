import { useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/external-supabase/client";
import { invokeFunction } from "@/integrations/cloud-functions/client";
import { PageLayout } from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message is too short").max(2000),
});

export default function Contact() {
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const form = e.currentTarget;
    const { error } = await supabase.from("contact_messages").insert([parsed.data as Required<typeof payload>]);
    if (error) {
      setBusy(false);
      toast.error("Could not send message");
      return;
    }
    // Forward to support inbox via edge function (best-effort)
    try {
      await invokeFunction("send-contact-error", { ...parsed.data, page: window.location.href }, false);
    } catch (e) {
      console.warn("notification email failed", e);
    }
    setBusy(false);
    toast.success("Message sent! We'll respond within 24 hours.");
    form.reset();
  };

  return (
    <PageLayout>
      <section className="container py-16 md:py-20 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold">Get in touch</h1>
            <p className="text-muted-foreground">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: "sidheshmhatre903@gmail.com" },
              { icon: Phone, label: "Phone", value: "+91 8424092130" },
              { icon: MapPin, label: "Office", value: "Mumbai, Maharashtra, India" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-brand grid place-items-center shrink-0">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" required maxLength={150} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required rows={6} maxLength={2000} />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-gradient-brand text-primary-foreground hover:opacity-90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
          </Button>
        </form>
      </section>
    </PageLayout>
  );
}
