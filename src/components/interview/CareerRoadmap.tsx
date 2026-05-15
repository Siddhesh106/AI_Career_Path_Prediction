import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, Circle, ExternalLink, Clock, Target, BookOpen,
  Sparkles, RotateCcw, ArrowRight, ArrowLeft, Trophy, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  CAREER_PATHS, QUIZ, scoreQuiz, TRAITS,
  type RoadmapPath, type TraitKey,
} from "@/data/careerPaths";

const STORAGE_KEY = "career-roadmap-progress-v2";
const QUIZ_KEY = "career-roadmap-quiz-v2";

function loadProgress(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function loadQuiz(): { answers: Record<string, number>; submitted: boolean } {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || "") || { answers: {}, submitted: false }; }
  catch { return { answers: {}, submitted: false }; }
}

const DOMAINS = ["All", "Tech", "Data & AI", "Design", "Business", "Creative", "Other"] as const;

export function CareerRoadmap() {
  const [quiz, setQuiz] = useState(loadQuiz);
  const [step, setStep] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>(loadProgress);
  const [domain, setDomain] = useState<typeof DOMAINS[number]>("All");
  const [search, setSearch] = useState("");

  const result = useMemo(
    () => (quiz.submitted ? scoreQuiz(quiz.answers) : null),
    [quiz],
  );

  const visiblePaths = useMemo(() => {
    let list: RoadmapPath[] = CAREER_PATHS;
    if (domain !== "All") list = list.filter((p) => p.domain === domain);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q),
      );
    }
    return list;
  }, [domain, search]);

  const path = useMemo(
    () => CAREER_PATHS.find((p) => p.id === activeId) ?? null,
    [activeId],
  );

  const saveQuiz = (next: typeof quiz) => {
    setQuiz(next);
    localStorage.setItem(QUIZ_KEY, JSON.stringify(next));
  };

  const answer = (idx: number) => {
    const q = QUIZ[step];
    const next = { ...quiz, answers: { ...quiz.answers, [q.id]: idx } };
    saveQuiz(next);
    if (step < QUIZ.length - 1) setStep(step + 1);
    else saveQuiz({ ...next, submitted: true });
  };

  const resetQuiz = () => {
    saveQuiz({ answers: {}, submitted: false });
    setStep(0);
    setActiveId(null);
  };

  const toggle = (i: number) => {
    if (!path) return;
    const key = `${path.id}:${i}`;
    const next = { ...done, [key]: !done[key] };
    setDone(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  /* ---------- ASSESSMENT (Step 1) ---------- */
  if (!quiz.submitted) {
    const q = QUIZ[step];
    const pct = Math.round((step / QUIZ.length) * 100);
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-primary via-fuchsia-500 to-orange-500" />
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" /> Career Interest Assessment
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                10 quick questions. We'll predict the career paths that fit your interests, then build a personalized roadmap.
              </p>
            </div>
            <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> ~2 min</Badge>
          </div>
          <div className="space-y-1.5 mt-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Question {step + 1} of {QUIZ.length}</span><span>{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">{q.prompt}</h3>
              <div className="grid gap-2">
                {q.options.map((opt, i) => {
                  const selected = quiz.answers[q.id] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      className={cn(
                        "group flex items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-all hover:border-primary hover:bg-accent",
                        selected && "border-primary bg-primary/5",
                      )}
                    >
                      <span className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        selected ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                      )}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <span className="text-xs text-muted-foreground">Tap an option to continue →</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  /* ---------- ROADMAP DETAIL ---------- */
  if (path) {
    const completed = path.steps.filter((_, i) => done[`${path.id}:${i}`]).length;
    const pct = Math.round((completed / path.steps.length) * 100);
    return (
      <div className="space-y-5">
        <Button variant="ghost" size="sm" onClick={() => setActiveId(null)} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Button>

        <Card className="overflow-hidden border-0 shadow-lg">
          <div className={cn("h-1.5 bg-gradient-to-r", path.color)} />
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <path.icon className="h-6 w-6" /> {path.name} Roadmap
                </CardTitle>
                <p className="text-muted-foreground mt-1 text-sm">{path.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {path.totalDuration}</Badge>
                <Badge variant="outline" className="gap-1"><Target className="h-3 w-3" /> {path.steps.length} phases</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <span className="font-semibold">🎯 Outcome: </span>
              <span className="text-muted-foreground">{path.outcome}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{completed}/{path.steps.length} · {pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="relative space-y-3 pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {path.steps.map((s, i) => {
            const isDone = !!done[`${path.id}:${i}`];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative"
              >
                <button
                  onClick={() => toggle(i)}
                  className="absolute -left-6 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background hover:border-primary transition-colors"
                  style={{ borderColor: isDone ? "hsl(var(--primary))" : undefined }}
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                </button>
                <Card className={cn("transition-all", isDone && "opacity-70")}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <CardTitle className={cn("text-base", isDone && "line-through")}>{s.title}</CardTitle>
                      <Badge variant="secondary" className="gap-1 text-xs"><Clock className="h-3 w-3" /> {s.duration}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">What to learn</div>
                      <ul className="grid sm:grid-cols-2 gap-1.5">
                        {s.topics.map((t) => (
                          <li key={t} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" /> <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Resources
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.resources.map((r) => (
                          <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs hover:bg-accent transition-colors">
                            {r.label} <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                    {s.project && (
                      <div className="rounded-md border-l-2 border-primary bg-primary/5 px-3 py-2 text-xs">
                        <span className="font-semibold">🛠 Project: </span>
                        <span className="text-muted-foreground">{s.project}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------- RESULTS / PATH PICKER ---------- */
  const top = result!.topPaths.slice(0, 3);
  const sortedTraits = TRAITS
    .map((t) => ({ ...t, score: result!.traitScores[t.key] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const maxTrait = Math.max(1, ...sortedTraits.map((t) => t.score));

  return (
    <div className="space-y-6">
      {/* Trait profile */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-primary via-fuchsia-500 to-orange-500" />
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" /> Your Career Profile
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your answers — here's what you naturally lean toward and the careers that fit best.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetQuiz} className="gap-1">
              <RotateCcw className="h-3.5 w-3.5" /> Retake quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {sortedTraits.slice(0, 5).map((t) => (
              <div key={t.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{t.label}</span>
                  <span className="text-muted-foreground">{t.score} pts</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-fuchsia-500 transition-all"
                    style={{ width: `${(t.score / maxTrait) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
            <div className="font-semibold flex items-center gap-1"><Sparkles className="h-4 w-4 text-primary" /> Your top 3 matches</div>
            <ol className="space-y-1.5 ml-5 list-decimal">
              {top.map(({ path: p, score }) => (
                <li key={p.id}>
                  <button onClick={() => setActiveId(p.id)} className="hover:underline font-medium">
                    {p.name}
                  </button>
                  <span className="text-muted-foreground"> — {score}% match</span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Top recommended cards */}
      <div>
        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Recommended for you
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {top.map(({ path: p, score }) => (
            <button key={p.id} onClick={() => setActiveId(p.id)} className="text-left">
              <Card className="overflow-hidden h-full border-2 border-primary/40 shadow-md hover:shadow-xl transition-all">
                <div className={cn("h-1.5 bg-gradient-to-r", p.color)} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <p.icon className="h-6 w-6" />
                    <Badge className="bg-gradient-to-r from-primary to-fuchsia-500 text-primary-foreground border-0">{score}% match</Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{p.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <p className="text-muted-foreground">{p.tagline}</p>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.totalDuration}</span>
                    <span className="text-primary font-medium flex items-center gap-1">View roadmap <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Browse all */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="font-semibold text-lg">Browse all {CAREER_PATHS.length}+ career paths</h3>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers…"
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                domain === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-accent",
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visiblePaths.map((p) => {
            const matchScore = result!.topPaths.find((t) => t.path.id === p.id)?.score ?? 0;
            return (
              <button key={p.id} onClick={() => setActiveId(p.id)} className="text-left">
                <Card className="h-full hover:shadow-lg hover:border-primary/40 transition-all">
                  <div className={cn("h-1 bg-gradient-to-r", p.color)} />
                  <CardHeader className="pb-1.5">
                    <div className="flex items-center justify-between">
                      <p.icon className="h-5 w-5" />
                      {matchScore > 0 && (
                        <Badge variant="outline" className="text-[10px]">{matchScore}%</Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm mt-1.5">{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p className="line-clamp-2">{p.tagline}</p>
                    <div className="flex items-center gap-1 pt-1">
                      <Clock className="h-3 w-3" /> {p.totalDuration}
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
          {visiblePaths.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-8">
              No careers match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
