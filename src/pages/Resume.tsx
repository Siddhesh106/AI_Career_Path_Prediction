import { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/external-supabase/client";
import { invokeFunction } from "@/integrations/cloud-functions/client";
import {
  Sparkles, Upload, Loader2, AlertCircle,
  Target, ExternalLink, FileText, PencilLine, ArrowLeft,
  TrendingUp, BookOpen, Lightbulb, Settings, RefreshCw,
  DollarSign, Award, Cpu, Briefcase, Clock, Users,
} from "lucide-react";
import { ManualProfileForm, type ManualProfile } from "@/components/ManualProfileForm";
import { SkillGapChart, PriorityBar } from "@/components/SkillGapChart";
import { AppHeader } from "@/components/AppHeader";
import { StatCard } from "@/components/StatCard";

interface ParsedSkill {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
}
interface ParsedEducation { institution: string; degree: string; field: string; startYear: number; endYear: number | null; }
interface ParsedWork { company: string; title: string; startDate: string; endDate: string; description: string; }
interface ParsedProfile {
  name: string; email: string; phone: string; location: string; bio: string;
  experienceYears: number; skills: ParsedSkill[]; education: ParsedEducation[];
  workExperience: ParsedWork[]; preferredRoles: string[]; preferredStack: string[];
}
interface JobPrediction {
  title: string; seniority: string; matchScore: number; reasoning: string;
  matchingSkills: string[]; suggestedCompanies: string[];
}
interface LearningResource {
  title: string; provider: string; url: string;
  type: "course" | "video" | "docs" | "book" | "article" | "interactive";
}
interface SkillGap {
  skill: string;
  currentLevel: "none" | "beginner" | "intermediate" | "advanced";
  targetLevel: "beginner" | "intermediate" | "advanced" | "expert";
  importance: number; reason: string; resources: LearningResource[];
}
interface TrajectoryStep { step: number; role: string; timeframe: string; milestones: string[]; }
interface CareerPlan { predictions: JobPrediction[]; skillGaps: SkillGap[]; trajectory: TrajectoryStep[]; }

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export default function Resume() {
  const [mode, setMode] = useState<null | "upload" | "manual">(null);
  const [profile, setProfile] = useState<ParsedProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [plan, setPlan] = useState<CareerPlan | null>(null);
  const [predicting, setPredicting] = useState(false);

  const fetchPredictions = useCallback(async (p: ParsedProfile) => {
    setPredicting(true); setPlan(null);
    try {
      const { data, error: fnErr } = await invokeFunction<any>("predict-jobs", { profile: p });
      if (fnErr) {
        // The SDK swallows the response body on non-2xx; recover it from .context
        let detail = fnErr.message;
        try {
          const ctx = (fnErr as unknown as { context?: Response }).context;
          if (ctx && typeof ctx.json === "function") {
            const body = await ctx.clone().json();
            if (body?.error) detail = body.error;
          }
        } catch { /* ignore */ }
        console.error("[predict-jobs] edge error:", detail);
        throw new Error(detail);
      }
      if (data?.error) throw new Error(data.error);
      setPlan({
        predictions: (data.predictions ?? []) as JobPrediction[],
        skillGaps: (data.skillGaps ?? []) as SkillGap[],
        trajectory: (data.trajectory ?? []) as TrajectoryStep[],
      });
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Could not generate predictions";
      const friendly = /402|credits|quota|exhausted/i.test(raw)
        ? "Google Gemini quota is restricted (limit=0). Link billing / verify API access in Google AI Studio (Pay-as-you-go) and retry."
        : /429|rate/i.test(raw)
          ? "Too many requests. Please wait a moment and try again."
          : raw;

      toast.error(friendly);
    } finally { setPredicting(false); }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null); setProfile(null); setFileName(file.name);
    if (file.size > 10 * 1024 * 1024) { setError("File is too large. Max 10 MB."); return; }
    const allowed = ["application/pdf", "text/plain", "image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) { setError("Unsupported file type."); return; }
    setLoading(true);
    try {
      const fileBase64 = await fileToBase64(file);
      const { data, error: fnErr } = await invokeFunction<any>("parse-resume", { fileBase64, mimeType: file.type, fileName: file.name });
      if (fnErr) {
        // Extract the real error body that supabase-js hides on non-2xx
        let detail = fnErr.message;
        try {
          const ctx = (fnErr as unknown as { context?: Response }).context;
          if (ctx && typeof ctx.json === "function") {
            const body = await ctx.clone().json();
            if (body?.error) detail = body.error;
          }
        } catch { /* ignore */ }
        console.error("[parse-resume] edge error:", detail);
        throw new Error(detail);
      }
      if (data?.error) throw new Error(data.error);
      const p = data.profile as ParsedProfile;
      setProfile(p);
      toast.success("Resume parsed successfully");
      fetchPredictions(p);
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Parsing failed";
      const msg =
        /402|credits|quota|exhausted/i.test(raw) || /credit balance is too low/i.test(raw)
          ? "Google Gemini API quota exhausted/insufficient. Please check your Google AI Studio Console."
          : /429|rate/i.test(raw)
            ? "Too many requests. Please wait a moment and try again."
            : raw;

      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  }, [fetchPredictions]);

  const handleManualSubmit = useCallback((m: ManualProfile) => {
    const p: ParsedProfile = { ...m };
    setProfile(p); setError(null); fetchPredictions(p);
  }, [fetchPredictions]);

  const reset = () => {
    setMode(null); setProfile(null); setPlan(null); setError(null); setFileName("");
  };

  // ---- Stats derived from plan ----
  const stats = useMemo(() => {
    const topMatch = plan?.predictions?.[0]?.matchScore ?? 0;
    const totalGaps = plan?.skillGaps?.length ?? 0;
    const haveSkills = profile?.skills?.length ?? 0;
    const totalSkills = haveSkills + totalGaps;
    const resources = plan?.skillGaps?.reduce((n, g) => n + (g.resources?.length ?? 0), 0) ?? 0;
    const fields: Array<unknown> = [
      profile?.name, profile?.email, profile?.phone, profile?.location, profile?.bio,
      profile?.experienceYears, profile?.skills?.length, profile?.workExperience?.length,
      profile?.education?.length, profile?.preferredRoles?.length,
    ];
    const filled = fields.filter(Boolean).length;
    const completion = Math.round((filled / fields.length) * 100);
    return {
      match: topMatch,
      skillsHave: haveSkills,
      skillsTotal: totalSkills || haveSkills || 1,
      resources,
      completion,
    };
  }, [plan, profile]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="container py-8 space-y-8">
        {/* ---------- Onboarding choices ---------- */}
        {!profile && (
          <section className="space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto pt-6">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Set up your career profile</h1>
              <p className="text-muted-foreground">
                Choose how you'd like to get started. You can always update everything later.
              </p>
            </div>

            {mode === null && (
              <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className="text-left rounded-2xl border border-border bg-card hover:border-primary/60 hover:shadow-lg transition-all p-6 space-y-4 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Upload Resume</h3>
                    <Badge>Fastest</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Let AI parse your resume and auto-fill everything in under 30 seconds.
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>✓ Auto-extracts skills, experience &amp; education</li>
                    <li>✓ Supports PDF and TXT files</li>
                    <li>✓ Review everything before saving</li>
                  </ul>
                  <Button className="w-full mt-2">Upload Resume →</Button>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("manual")}
                  className="text-left rounded-2xl border border-border bg-card hover:border-primary/60 hover:shadow-lg transition-all p-6 space-y-4 group"
                >
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    <PencilLine className="h-6 w-6 text-foreground/70" />
                  </div>
                  <h3 className="font-semibold text-lg">Fill Manually</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your profile details step by step in a guided form.
                  </p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>✓ Guided form</li>
                    <li>✓ Add skills, experience, goals</li>
                    <li>✓ No file required</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-2">Fill Manually →</Button>
                </button>
              </div>
            )}

            {mode !== null && (
              <div className="max-w-3xl mx-auto">
                <Button variant="ghost" size="sm" onClick={reset} className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Change method
                </Button>

                {mode === "upload" && (
                  <label
                    htmlFor="resume-file"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                    className="flex flex-col items-center justify-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-border bg-card hover:bg-accent/40 transition-colors p-12 text-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Parsing {fileName}…</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary" />
                        <p className="text-sm font-medium">Click to upload or drag &amp; drop</p>
                        <p className="text-xs text-muted-foreground">PDF, image, or .txt — up to 10 MB</p>
                      </>
                    )}
                    <input
                      id="resume-file" type="file" className="hidden"
                      accept=".pdf,.txt,image/*"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                      disabled={loading}
                    />
                  </label>
                )}

                {mode === "manual" && (
                  <ManualProfileForm loading={predicting} onSubmit={handleManualSubmit} />
                )}
              </div>
            )}

            {error && (
              <Card className="max-w-2xl mx-auto border-destructive/50">
                <CardContent className="py-6 flex flex-col items-center text-center gap-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <p className="font-semibold">Something went wrong</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => setError(null)}>Try again</Button>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        {/* ---------- Dashboard view ---------- */}
        {profile && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Heading row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {profile.name || "there"}. Here's your career overview.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1.5" /> Settings
                </Button>
                <Button size="sm" onClick={reset}>
                  <RefreshCw className="h-4 w-4 mr-1.5" /> Update Profile
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Match Score"
                value={`${stats.match}%`}
                hint="For top career path match"
                icon={DollarSign}
                progress={stats.match}
              />
              <StatCard
                label="Skills Completed"
                value={`${stats.skillsHave}/${stats.skillsTotal}`}
                hint="For career path requirements"
                icon={Award}
                progress={(stats.skillsHave / stats.skillsTotal) * 100}
              />
              <StatCard
                label="Learning Resources"
                value={String(stats.resources)}
                hint="Recommended courses for you"
                icon={BookOpen}
                progress={Math.min(100, stats.resources * 10)}
              />
              <StatCard
                label="Profile Completion"
                value={`${stats.completion}%`}
                hint="Complete to improve predictions"
                icon={Cpu}
                progress={stats.completion}
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="paths" className="space-y-6">
              <TabsList className="bg-transparent p-0 h-auto justify-start gap-2 border-b border-border w-full rounded-none">
                <TabsTrigger value="paths" className="data-[state=active]:bg-secondary data-[state=active]:shadow-none rounded-md px-4 py-2">Career Paths</TabsTrigger>
                <TabsTrigger value="gap" className="data-[state=active]:bg-secondary data-[state=active]:shadow-none rounded-md px-4 py-2">Skill Gap</TabsTrigger>
                <TabsTrigger value="trajectory" className="data-[state=active]:bg-secondary data-[state=active]:shadow-none rounded-md px-4 py-2">Growth Trajectory</TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-secondary data-[state=active]:shadow-none rounded-md px-4 py-2">Learning Resources</TabsTrigger>
              </TabsList>

              {/* ---- Career Paths ---- */}
              <TabsContent value="paths" className="space-y-4">
                {predicting && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-12 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your profile…
                  </div>
                )}
                {!predicting && plan && plan.predictions.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {plan.predictions.map((job, i) => {
                      const query = encodeURIComponent(`${job.title} ${job.seniority}`);
                      const loc = profile.location ? `&location=${encodeURIComponent(profile.location)}` : "";
                      const applyUrl = `https://www.linkedin.com/jobs/search/?keywords=${query}${loc}`;
                      return (
                        <Card key={i} className="flex flex-col">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <Badge variant={job.matchScore >= 80 ? "default" : "secondary"}>
                                {job.matchScore}% Match
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{job.reasoning}</p>
                          </CardHeader>
                          <CardContent className="space-y-4 flex-1 flex flex-col">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Match Score</span>
                                <span className="font-semibold">{job.matchScore}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${job.matchScore}%` }} />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                              <span className="flex items-center gap-1.5 text-emerald-500"><TrendingUp className="h-3.5 w-3.5" /> High Growth</span>
                              <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Competitive</span>
                              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> {job.seniority}</span>
                              <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-muted-foreground" /> {job.matchingSkills?.length ?? 0} Skills</span>
                            </div>
                            {job.suggestedCompanies?.length > 0 && (
                              <div className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <Users className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span>{job.suggestedCompanies.slice(0, 4).join(", ")}</span>
                              </div>
                            )}
                            <Button asChild variant="outline" className="mt-auto w-full">
                              <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                                View Details <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
                {!predicting && (!plan || plan.predictions.length === 0) && (
                  <Card>
                    <CardContent className="py-12 flex flex-col items-center text-center gap-3">
                      <Target className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No predictions yet.</p>
                      <Button size="sm" onClick={() => fetchPredictions(profile)}>Generate predictions</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* ---- Skill Gap ---- */}
              <TabsContent value="gap" className="space-y-6">
                {plan && plan.skillGaps.length > 0 ? (
                  <>
                    <Card>
                      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Lightbulb className="h-5 w-5 text-primary" /> Skill Gap Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SkillGapChart
                          data={plan.skillGaps.map((g) => ({
                            skill: g.skill,
                            currentLevel: g.currentLevel,
                            targetLevel: g.targetLevel,
                            importance: g.importance,
                          }))}
                        />
                      </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base text-destructive">
                            <AlertCircle className="h-4 w-4" /> Skills to Develop
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {plan.skillGaps.map((g, i) => (
                            <div key={i} className="rounded-lg border border-border bg-card p-3 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{g.skill}</span>
                                  <Badge variant="secondary" className="text-[10px] capitalize">{g.targetLevel}</Badge>
                                </div>
                                <Badge variant={g.importance >= 75 ? "default" : "outline"}>{g.importance}%</Badge>
                              </div>
                              <PriorityBar value={g.importance} />
                              <p className="text-xs text-muted-foreground">{g.reason}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base text-emerald-500">
                            <Award className="h-4 w-4" /> Skills You Already Have
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {profile.skills.map((s) => (
                            <div key={s.name} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                              <span className="font-medium text-sm">{s.name}</span>
                              <Badge variant="outline" className="capitalize">{s.level}</Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No skill gaps identified yet.</CardContent></Card>
                )}
              </TabsContent>

              {/* ---- Growth Trajectory ---- */}
              <TabsContent value="trajectory">
                {plan && plan.trajectory.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-primary" /> Growth Trajectory
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Potential career paths based on your current role
                      </p>
                      {profile.workExperience?.[0] && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Current Role: </span>
                          <span className="font-semibold">{profile.workExperience[0].title}</span>
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <ol className="relative border-l-2 border-border ml-3 space-y-6">
                        {plan.trajectory.map((s) => (
                          <li key={s.step} className="ml-6">
                            <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                              {s.step}
                            </span>
                            <div className="space-y-1.5 rounded-lg border border-border bg-card p-4">
                              <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                  <p className="font-semibold">{s.role}</p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" />{s.timeframe}</p>
                                </div>
                                <Badge variant="secondary">Step {s.step}</Badge>
                              </div>
                              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5 pt-1">
                                {s.milestones.map((m, j) => <li key={j}>{m}</li>)}
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ) : (
                  <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No trajectory data yet.</CardContent></Card>
                )}
              </TabsContent>

              {/* ---- Learning Resources ---- */}
              <TabsContent value="resources">
                {plan && plan.skillGaps.some((g) => g.resources?.length) ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {plan.skillGaps.flatMap((g) =>
                      (g.resources ?? []).map((r, j) => (
                        <Card key={`${g.skill}-${j}`}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{r.title}</CardTitle>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              <Badge variant="secondary" className="text-[10px] capitalize">{g.skill}</Badge>
                              <Badge variant="outline" className="text-[10px] capitalize">{r.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Provider:</span>
                              <span className="font-medium">{r.provider}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium capitalize">{r.type}</span>
                            </div>
                            <Button asChild variant="outline" className="w-full">
                              <a href={r.url} target="_blank" rel="noopener noreferrer">
                                View Course <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      )),
                    )}
                  </div>
                ) : (
                  <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No learning resources yet.</CardContent></Card>
                )}
              </TabsContent>
            </Tabs>
          </section>
        )}
      </main>
    </div>
  );
}
