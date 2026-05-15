import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Building2, ExternalLink, Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/external-supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageLayout } from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_range: string | null;
  description: string;
  apply_url: string;
  tags: string[];
  is_remote: boolean;
}

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");

  useEffect(() => {
    // Hybrid approach:
    // - Prefer live JSearch results.
    // - Fall back to internal DB jobs if JSearch fails or returns empty.
    const bootstrap = async () => {
      setLoading(true);
      try {
        const { data: fnData, error } = await (await import("@/integrations/cloud-functions/client")).invokeFunction<any>(
          "search-jobs",
          { query: q || "Software Engineer", page: 1 }
        );

        const returnedJobs: Job[] | undefined = fnData?.jobs ?? fnData?.data ?? fnData;
        if (!error && Array.isArray(returnedJobs) && returnedJobs.length) {
          setJobs(returnedJobs as Job[]);
          return;
        }

        // fallback
        const { data, error: dbError } = await supabase
          .from("jobs")
          .select("*")
          .order("posted_at", { ascending: false })
          .limit(300);
        if (dbError) toast.error("Failed to load jobs");
        else setJobs((data ?? []) as Job[]);
      } catch (e) {
        // final fallback
        const { data, error: dbError } = await supabase
          .from("jobs")
          .select("*")
          .order("posted_at", { ascending: false })
          .limit(300);
        if (dbError) toast.error("Failed to load jobs");
        else setJobs((data ?? []) as Job[]);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", user.id)
      .then(({ data }) => setSaved(new Set((data ?? []).map((r) => r.job_id))));
  }, [user]);

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return jobs.filter((j) => {
      if (type === "remote" && !j.is_remote) return false;
      if (type === "onsite" && j.is_remote) return false;
      if (!ql) return true;
      return (
        j.title.toLowerCase().includes(ql) ||
        j.company.toLowerCase().includes(ql) ||
        j.location.toLowerCase().includes(ql) ||
        j.tags.some((t) => t.toLowerCase().includes(ql))
      );
    });
  }, [jobs, q, type]);

  const toggleSave = async (jobId: string) => {
    if (!user) {
      toast.error("Sign in to save jobs");
      return;
    }
    if (saved.has(jobId)) {
      await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
      setSaved((s) => {
        const n = new Set(s);
        n.delete(jobId);
        return n;
      });
    } else {
      const { error } = await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
      if (error) {
        toast.error("Could not save");
        return;
      }
      setSaved((s) => new Set(s).add(jobId));
      toast.success("Job saved");
    }
  };

  return (
    <PageLayout>
      {/* Hero strip */}
      <section className="relative overflow-hidden bg-mesh border-b border-border/60">
        <div className="container py-12 md:py-16 text-center space-y-4">
          <Badge variant="secondary" className="mx-auto">Live job board</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find your <span className="text-gradient-brand">next role</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Curated openings from top companies. Save jobs, filter by location, and apply in one click.
          </p>
        </div>
      </section>

      <section className="container py-10 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sticky top-16 z-20 bg-background/80 backdrop-blur py-3 -mx-2 px-2 rounded-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, company, skill..."
              className="pl-9 h-11"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="sm:w-44 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="onsite">On-site</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!loading && (
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "opening" : "openings"} matching your search
          </p>
        )}

        {loading ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No jobs match your search.</p>
        ) : (
          <div className="grid gap-4">
            {filtered.map((j) => (
              <article
                key={j.id}
                className="group relative rounded-2xl border border-border bg-card p-5 md:p-6 space-y-3 hover:border-primary/40 hover:shadow-card-hover transition-all overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 bg-gradient-brand opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-brand grid place-items-center text-primary-foreground font-bold shadow-glow">
                      {j.company.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors truncate">
                        {j.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{j.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                        {j.salary_range && <span className="font-medium text-foreground">{j.salary_range}</span>}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => toggleSave(j.id)} aria-label="Save job" className="shrink-0">
                    {saved.has(j.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="relative text-sm text-muted-foreground line-clamp-2">{j.description}</p>
                <div className="relative flex flex-wrap gap-2">
                  {j.is_remote && <Badge variant="secondary">Remote</Badge>}
                  <Badge variant="outline">{j.job_type}</Badge>
                  {j.tags.slice(0, 6).map((t) => (
                    <Badge key={t} variant="outline" className="text-muted-foreground">{t}</Badge>
                  ))}
                </div>
                <div className="relative flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">Open role</span>
                  <Button asChild size="sm" className="bg-gradient-brand text-primary-foreground hover:opacity-90">
                    <a href={j.apply_url} target="_blank" rel="noopener noreferrer">
                      Apply <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
