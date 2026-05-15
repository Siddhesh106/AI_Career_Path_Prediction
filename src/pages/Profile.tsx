import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/external-supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ display_name: "", headline: "", bio: "", avatar_url: "" });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, headline, bio, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setForm({
          display_name: data.display_name ?? "",
          headline: data.headline ?? "",
          bio: data.bio ?? "",
          avatar_url: data.avatar_url ?? "",
        });
        setLoading(false);
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("user_id", user.id);
    setBusy(false);
    if (error) toast.error("Could not save profile");
    else toast.success("Profile updated");
  };

  return (
    <PageLayout>
      <section className="container max-w-2xl py-12 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
        </div>

        {loading ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-brand text-primary-foreground text-lg">
                  {(form.display_name || user?.email || "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input id="avatar" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dn">Display name</Label>
              <Input id="dn" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} maxLength={150} placeholder="Senior Frontend Engineer" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={1000} />
            </div>
            <Button type="submit" disabled={busy} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
            </Button>
          </form>
        )}
      </section>
    </PageLayout>
  );
}
