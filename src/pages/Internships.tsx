import { useState } from "react";
import { Search, MapPin, Building2, ExternalLink, Loader2, Sparkles, IndianRupee, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { invokeFunction } from "@/integrations/cloud-functions/client";
import { PageLayout } from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
  stipend: string;
  posted_at: string;
}

const COUNTRIES = [
  { code: "in", label: "India" },
  { code: "us", label: "United States" },
  { code: "gb", label: "United Kingdom" },
  { code: "ca", label: "Canada" },
  { code: "au", label: "Australia" },
  { code: "de", label: "Germany" },
  { code: "sg", label: "Singapore" },
];

export default function Internships() {
  const [what, setWhat] = useState("software intern");
  const [where, setWhere] = useState("");
  const [country, setCountry] = useState("in");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Internship[]>([]);
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await invokeFunction<any>("search-internships", { what, where, country });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResults(data?.internships ?? []);
      setSearched(true);
      if (!data?.internships?.length) toast.info("No internships found. Try different keywords.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageLayout>
      <section className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Real-time listings
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find <span className="text-gradient-brand">Live Internships</span> with Stipend
          </h1>
          <p className="text-muted-foreground">
            Search 1M+ live opportunities across India and the world. Direct apply links to verified employers.
          </p>
        </div>

        <form
          onSubmit={search}
          className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-4 md:p-5 grid md:grid-cols-[1.4fr_1fr_auto_auto] gap-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="what" className="text-xs">Role / Skill</Label>
            <div className="relative">
              <Briefcase className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="what"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="software intern, marketing intern..."
                className="pl-9"
                maxLength={100}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="where" className="text-xs">Location</Label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="where"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Bengaluru, Remote..."
                className="pl-9"
                maxLength={100}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs opacity-0 hidden md:block">Search</Label>
            <Button
              type="submit"
              disabled={busy}
              className="w-full md:w-auto bg-gradient-brand text-primary-foreground hover:opacity-90"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Search</>}
            </Button>
          </div>
        </form>

        <div className="max-w-4xl mx-auto mt-8 space-y-4">
          {!searched && !busy && (
            <div className="text-center py-16 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Search above to discover live internship opportunities.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{results.length}</span> live opportunities
              </p>
              <Badge variant="outline" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live
              </Badge>
            </div>
          )}

          {results.map((job, i) => (
            <article
              key={job.id}
              className="group rounded-2xl border border-border bg-card p-5 hover:shadow-card-hover hover:border-primary/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-11 w-11 shrink-0 rounded-lg bg-gradient-brand grid place-items-center text-primary-foreground font-bold">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 gap-1">
                  <IndianRupee className="h-3 w-3" />{job.stipend}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Posted {new Date(job.posted_at).toLocaleDateString()}
                </span>
                <Button asChild size="sm" className="bg-gradient-brand text-primary-foreground hover:opacity-90">
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                    Apply Now <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
