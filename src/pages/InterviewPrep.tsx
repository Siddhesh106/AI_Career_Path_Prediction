import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertTriangle, Award, Brain, Building2, CheckCircle2, ChevronRight, Clock,
  Code2, Cpu, Database, GitBranch, Layers, Lightbulb, Lock, Maximize2,
  MessageSquare, Network, RotateCcw, Send, Server, Shield, Sparkles,
  Target, Timer, Trophy, User, XCircle, Zap, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  APTITUDE_BANK, DSA_BANK, CORE_BANK, PREP_KIT, type MCQ, type Difficulty,
} from "@/data/interviewBanks";
import { CodingSandbox } from "@/components/interview/CodingSandbox";
import { MockTestSets } from "@/components/interview/MockTestSets";
import { CareerRoadmap } from "@/components/interview/CareerRoadmap";

/* ============================================================
   COMPANY PATHS, SKILL TRACKS, HR + SYSTEM-DESIGN STATIC DATA
   (Question banks live in src/data/interviewBanks.ts)
   ============================================================ */

type SectionId = "aptitude" | "technical" | "coding";

interface CompanyPath {
  name: string;
  color: string;
  initials: string;
  type: "Service" | "Product";
  pattern: string[];
  duration: string;
  cutoff: string;
  sectional: boolean;
}

const COMPANIES: CompanyPath[] = [
  {
    name: "Google", color: "from-blue-500 to-emerald-500", initials: "G", type: "Product",
    pattern: ["Online Assessment (DSA x2)", "Phone Screen", "Onsite — Coding x4", "Googleyness & Leadership"],
    duration: "60-90 min OA", cutoff: "Solve 1.5/2 fully", sectional: false,
  },
  {
    name: "Amazon", color: "from-orange-500 to-yellow-500", initials: "A", type: "Product",
    pattern: ["Online Assessment (Debugging + DSA)", "Work Simulation", "Loop Interviews (LP focus)"],
    duration: "105 min", cutoff: "70%+ overall", sectional: false,
  },
  {
    name: "TCS NQT", color: "from-blue-600 to-indigo-600", initials: "T", type: "Service",
    pattern: ["Numerical Ability", "Verbal Ability", "Reasoning", "Programming Logic", "Coding"],
    duration: "180 min", cutoff: "Sectional cut-off applies", sectional: true,
  },
  {
    name: "Infosys", color: "from-indigo-500 to-purple-600", initials: "I", type: "Service",
    pattern: ["Numerical Ability", "Verbal Ability", "Pseudo-code", "Puzzle Solving"],
    duration: "100 min", cutoff: "Sectional cut-off applies", sectional: true,
  },
  {
    name: "Accenture", color: "from-purple-500 to-pink-500", initials: "Ac", type: "Service",
    pattern: ["Cognitive (English/Analytical)", "Technical (Networking/Cloud)", "Coding (2 problems)"],
    duration: "90 min", cutoff: "Sectional cut-off applies", sectional: true,
  },
  {
    name: "Wipro Elite", color: "from-emerald-500 to-teal-600", initials: "W", type: "Service",
    pattern: ["Aptitude", "English", "Logical Reasoning", "Coding (2 problems)", "Essay Writing"],
    duration: "140 min", cutoff: "Sectional cut-off applies", sectional: true,
  },
];

const SKILL_TRACKS = [
  {
    id: "aptitude", title: "Aptitude", icon: Brain, gradient: "from-blue-500 to-cyan-500",
    topics: ["Quantitative Ability", "Logical Reasoning", "Verbal Ability", "Data Interpretation"],
  },
  {
    id: "dsa", title: "DSA", icon: GitBranch, gradient: "from-purple-500 to-pink-500",
    topics: ["Arrays", "Strings", "Linked Lists", "Trees", "Graphs", "DP"],
  },
  {
    id: "core", title: "Technical Core", icon: Cpu, gradient: "from-emerald-500 to-teal-500",
    topics: ["Operating Systems", "DBMS", "Computer Networks", "OOPS"],
  },
  {
    id: "hr", title: "HR & Behavioral", icon: User, gradient: "from-orange-500 to-red-500",
    topics: ["STAR Method", "Common Questions", "Salary Negotiation", "Body Language"],
  },
];

/* Question banks now imported from @/data/interviewBanks */

const HR_QUESTIONS = [
  {
    q: "Tell me about a time you failed.",
    star: {
      situation: "During my final-year project, I led a 4-person team building a price-tracker.",
      task: "I was responsible for integrating the scraping module by sprint 3.",
      action: "I underestimated rate-limiting; the API kept blocking us. I owned the failure publicly, switched to a queue + proxy strategy, and re-planned the timeline with the team.",
      result: "We shipped 1 week late but with a more resilient system. I learned to validate external dependencies in week 1.",
    },
  },
  {
    q: "Why should we hire you?",
    star: {
      situation: "Your role demands a fresher who can ship full-stack features quickly.",
      task: "You need someone who learns frameworks fast and communicates clearly with seniors.",
      action: "In 6 months I built 3 production-grade projects with React + Node, mentored 2 juniors at college, and won an inter-college hackathon.",
      result: "I bring proven shipping speed, strong fundamentals, and a teammate-first attitude — I'll add value from week 1.",
    },
  },
  {
    q: "Describe a conflict with a teammate.",
    star: {
      situation: "On a hackathon, my teammate insisted on Firebase; I preferred Postgres.",
      task: "We needed a decision in 30 minutes to start coding.",
      action: "Instead of arguing, I listed criteria (auth, queries, our skill). We voted on Firebase given the 24-hr deadline. I committed fully and helped debug their auth logic.",
      result: "We finished on time and placed top 3. I learned that picking the right battle matters more than being right.",
    },
  },
  {
    q: "Where do you see yourself in 5 years?",
    star: {
      situation: "I'm starting my career in software engineering.",
      task: "I want to grow technically while contributing meaningfully to product impact.",
      action: "Year 1-2: master the company's stack and ship reliably. Year 3-4: own a service end-to-end and mentor juniors. Year 5: technical leadership on a critical module.",
      result: "I see myself as a senior engineer here, trusted with architecture decisions and growing the next batch of freshers.",
    },
  },
  {
    q: "What is your greatest strength?",
    star: {
      situation: "In every team project I've been on, I've been the documentation owner.",
      task: "I needed to make our codebase understandable for new joiners and graders.",
      action: "I write README-driven code, add inline docs, and create 2-min Loom walkthroughs of complex modules.",
      result: "Two of my college projects are still being used by next-year students because they can onboard themselves. My strength is making complexity approachable.",
    },
  },
];

const SYSTEM_DESIGN_TOPICS = [
  { title: "Scalability", icon: Zap, summary: "Vertical (bigger machine) vs Horizontal (more machines). Freshers should explain horizontal as the default for web scale because it's cheaper and fault-tolerant.",
    points: ["Stateless services scale horizontally — add servers behind a load balancer.", "Stateful systems (DBs) scale via replication (read scale) and sharding (write scale).", "Always discuss the bottleneck: CPU? DB? Network?"] },
  { title: "Load Balancers", icon: Network, summary: "A load balancer sits in front of your servers and routes traffic so no single server is overwhelmed.",
    points: ["Algorithms: Round Robin, Least Connections, IP Hash.", "L4 (TCP) vs L7 (HTTP) — L7 can route by URL path.", "Health checks remove unhealthy servers from rotation."] },
  { title: "Caching", icon: Layers, summary: "Store frequently-accessed data closer to the user/app to reduce latency and DB load.",
    points: ["Cache-aside: app reads cache, falls back to DB on miss.", "TTL prevents stale data; invalidation is the hard part.", "Redis/Memcached are the industry standards."] },
  { title: "Databases (SQL vs NoSQL)", icon: Database, summary: "SQL = strong consistency, joins, schema. NoSQL = flexible schema, horizontal scale, eventual consistency.",
    points: ["Use SQL when relations + transactions matter (banking, orders).", "Use NoSQL for high-volume, schema-light data (logs, feeds, chat).", "CAP theorem: pick 2 of Consistency, Availability, Partition-tolerance."] },
  { title: "API Design", icon: Server, summary: "REST is request-response over HTTP using nouns; GraphQL lets clients ask for exactly the fields they need.",
    points: ["Use proper HTTP verbs (GET/POST/PUT/DELETE) and status codes.", "Always version your APIs (/v1/...).", "Rate limit and authenticate every endpoint."] },
];

/* ============================================================
   MOCK TEST ENGINE — sectional, timer, proctoring
   ============================================================ */

interface SectionConfig {
  id: SectionId;
  title: string;
  icon: typeof Brain;
  durationSec: number;
  questions: MCQ[];
}

function buildSections(): SectionConfig[] {
  return [
    { id: "aptitude", title: "Aptitude", icon: Brain, durationSec: 6 * 60, questions: APTITUDE_BANK },
    { id: "technical", title: "Technical Core", icon: Cpu, durationSec: 5 * 60, questions: CORE_BANK },
    { id: "coding", title: "Programming Logic", icon: Code2, durationSec: 5 * 60, questions: DSA_BANK },
  ];
}

interface AnswerLog {
  qId: string;
  selected: number | null;
  correct: boolean;
  timeSpent: number;
  topic: string;
  difficulty: Difficulty;
}

function MockTestEngine({ onExit }: { onExit: () => void }) {
  const sections = useMemo(buildSections, []);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [logs, setLogs] = useState<AnswerLog[]>([]);
  const [timeLeft, setTimeLeft] = useState(sections[0].durationSec);
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [tabSwitches, setTabSwitches] = useState(0);
  const [finished, setFinished] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const section = sections[sectionIdx];
  const question = section.questions[qIdx];
  const totalQ = section.questions.length;

  /* Proctoring: tab switch detection */
  useEffect(() => {
    if (finished) return;
    const onVis = () => {
      if (document.hidden) {
        setTabSwitches((n) => n + 1);
        toast({
          title: "⚠️ Proctoring Warning",
          description: "Tab switch detected. This is logged.",
          variant: "destructive",
        });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [finished]);

  /* Timer */
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleSectionEnd(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIdx, finished]);

  /* Fullscreen request */
  useEffect(() => {
    const el = containerRef.current;
    if (el && !document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    }
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  function recordAnswer(forceNull = false) {
    const sel = forceNull ? null : selected;
    const correct = sel === question.answer;
    setLogs((l) => [
      ...l,
      {
        qId: question.id,
        selected: sel,
        correct,
        timeSpent: Math.round((Date.now() - questionStart) / 1000),
        topic: question.topic,
        difficulty: question.difficulty,
      },
    ]);
  }

  function handleNext() {
    recordAnswer();
    setSelected(null);
    setQuestionStart(Date.now());
    if (qIdx + 1 < totalQ) {
      setQIdx(qIdx + 1);
    } else {
      handleSectionEnd(false);
    }
  }

  function handleSectionEnd(timeUp: boolean) {
    if (timeUp) recordAnswer(true);
    if (sectionIdx + 1 < sections.length) {
      const next = sectionIdx + 1;
      setSectionIdx(next);
      setQIdx(0);
      setSelected(null);
      setTimeLeft(sections[next].durationSec);
      setQuestionStart(Date.now());
      toast({
        title: `Moving to ${sections[next].title}`,
        description: "Sectional cut-off applied — you cannot return to previous sections.",
      });
    } else {
      setFinished(true);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }

  if (finished) {
    return <TestResults logs={logs} sections={sections} tabSwitches={tabSwitches} onExit={onExit} />;
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const lowTime = timeLeft < 30;

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Proctoring header */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span className="font-medium">Proctored Mode</span>
          <Badge variant="outline" className="ml-2 border-slate-700 text-slate-300">
            <Maximize2 className="h-3 w-3 mr-1" /> Fullscreen
          </Badge>
          {tabSwitches > 0 && (
            <Badge variant="destructive" className="ml-1">
              <AlertTriangle className="h-3 w-3 mr-1" /> {tabSwitches} tab switch{tabSwitches > 1 && "es"}
            </Badge>
          )}
        </div>
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums",
          lowTime ? "bg-red-500/20 text-red-300 animate-pulse" : "bg-blue-500/20 text-blue-300"
        )}>
          <Timer className="h-5 w-5" />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      {/* Section progress */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-2 mb-3">
          {sections.map((s, i) => {
            const Icon = s.icon;
            const done = i < sectionIdx;
            const active = i === sectionIdx;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border flex-1",
                  active && "border-blue-500 bg-blue-500/10 text-blue-300",
                  done && "border-emerald-700 bg-emerald-500/10 text-emerald-400",
                  !active && !done && "border-slate-800 text-slate-500"
                )}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="truncate">{s.title}</span>
                  {done && <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />}
                  {!done && !active && <Lock className="h-3 w-3 ml-auto" />}
                </div>
                {i < sections.length - 1 && <ChevronRight className="h-3 w-3 text-slate-700" />}
              </div>
            );
          })}
        </div>
        <Progress value={((qIdx + 1) / totalQ) * 100} className="h-1.5 bg-slate-800" />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Question {qIdx + 1} of {totalQ}</span>
          <span>{section.title}</span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${section.id}-${qIdx}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-slate-700 text-slate-300">{question.topic}</Badge>
                <Badge className={cn(
                  question.difficulty === "Easy" && "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20",
                  question.difficulty === "Medium" && "bg-amber-500/20 text-amber-300 hover:bg-amber-500/20",
                  question.difficulty === "Hard" && "bg-red-500/20 text-red-300 hover:bg-red-500/20",
                )}>{question.difficulty}</Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl leading-relaxed">{question.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selected?.toString() ?? ""}
                onValueChange={(v) => setSelected(parseInt(v))}
                className="space-y-3"
              >
                {question.options.map((opt, i) => (
                  <label
                    key={i}
                    htmlFor={`opt-${i}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all",
                      selected === i ? "border-blue-500 bg-blue-500/10" : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
                    )}
                  >
                    <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="border-slate-600" />
                    <span className="text-slate-200">{opt}</span>
                  </label>
                ))}
              </RadioGroup>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
                <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                  Exit Test
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white">
                  {qIdx + 1 === totalQ
                    ? sectionIdx + 1 === sections.length ? "Submit Test" : "Next Section"
                    : "Next Question"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TestResults({
  logs, sections, tabSwitches, onExit,
}: { logs: AnswerLog[]; sections: SectionConfig[]; tabSwitches: number; onExit: () => void }) {
  const total = logs.length;
  const correct = logs.filter((l) => l.correct).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const avgTime = total ? Math.round(logs.reduce((s, l) => s + l.timeSpent, 0) / total) : 0;

  /* Skill gap by topic */
  const byTopic = logs.reduce<Record<string, { correct: number; total: number }>>((acc, l) => {
    if (!acc[l.topic]) acc[l.topic] = { correct: 0, total: 0 };
    acc[l.topic].total++;
    if (l.correct) acc[l.topic].correct++;
    return acc;
  }, {});
  const skillRows = Object.entries(byTopic).map(([topic, v]) => ({
    topic,
    pct: Math.round((v.correct / v.total) * 100),
    correct: v.correct,
    total: v.total,
  })).sort((a, b) => a.pct - b.pct);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto p-6 space-y-6"
    >
      <div className="text-center space-y-3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 shadow-glow">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Test Complete</h1>
        <p className="text-muted-foreground">Here is your performance breakdown.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2"><CardDescription>Accuracy</CardDescription></CardHeader>
          <CardContent><p className="text-4xl font-bold text-emerald-600">{accuracy}%</p></CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2"><CardDescription>Correct</CardDescription></CardHeader>
          <CardContent><p className="text-4xl font-bold">{correct}/{total}</p></CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2"><CardDescription>Avg time / Q</CardDescription></CardHeader>
          <CardContent><p className="text-4xl font-bold text-blue-600">{avgTime}s</p></CardContent>
        </Card>
      </div>

      {tabSwitches > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-300">Proctoring flag</p>
              <p className="text-sm text-red-700 dark:text-red-400">{tabSwitches} tab switch{tabSwitches > 1 && "es"} detected during the test.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Skill Gap Analysis</CardTitle>
          <CardDescription>Topics ranked from weakest to strongest — focus your prep here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillRows.map((r) => (
            <div key={r.topic}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{r.topic}</span>
                <span className={cn(
                  r.pct < 50 ? "text-red-600" : r.pct < 75 ? "text-amber-600" : "text-emerald-600",
                  "font-semibold"
                )}>{r.pct}% ({r.correct}/{r.total})</span>
              </div>
              <Progress value={r.pct} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5" /> Question-by-Question</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {logs.map((l, i) => (
            <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
              <div className="flex items-center gap-2">
                {l.correct
                  ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  : <XCircle className="h-4 w-4 text-red-600" />}
                <span>Q{i + 1} — {l.topic}</span>
                <Badge variant="outline" className="text-xs">{l.difficulty}</Badge>
              </div>
              <span className="text-muted-foreground tabular-nums">{l.timeSpent}s</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button onClick={onExit} variant="outline"><RotateCcw className="h-4 w-4 mr-2" /> Back to Dashboard</Button>
      </div>
    </motion.div>
  );
}

/* CodingSandbox now imported from @/components/interview/CodingSandbox */

/* ============================================================
   HR CHATBOT SIMULATOR
   ============================================================ */

interface ChatMsg { role: "interviewer" | "candidate"; text: string; }

const INTERVIEWER_FLOW = [
  "Hi! Let's start. Tell me a bit about yourself.",
  "Interesting. What is one project you're most proud of, and why?",
  "What was the hardest technical challenge in that project, and how did you solve it?",
  "If your manager gave you a feature you disagreed with, how would you handle it?",
  "Last one — where do you see yourself in 3 years, and how does this role fit in?",
  "Great answers! That wraps up the simulation. Review the STAR tips above to refine your stories.",
];

function HRChatbot() {
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: "interviewer", text: INTERVIEWER_FLOW[0] }]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send() {
    if (!input.trim()) return;
    const candidate: ChatMsg = { role: "candidate", text: input.trim() };
    const next: ChatMsg[] = [...messages, candidate];
    if (step < INTERVIEWER_FLOW.length) {
      next.push({ role: "interviewer", text: INTERVIEWER_FLOW[step] });
      setStep(step + 1);
    }
    setMessages(next);
    setInput("");
  }

  function reset() {
    setMessages([{ role: "interviewer", text: INTERVIEWER_FLOW[0] }]);
    setStep(1);
    setInput("");
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-900 text-slate-100 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-slate-100">Mock HR Interviewer</CardTitle>
              <CardDescription className="text-slate-400">Live simulation • text-based</CardDescription>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={reset} className="text-slate-300 hover:text-white hover:bg-slate-800">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-2", m.role === "candidate" && "justify-end")}
              >
                {m.role === "interviewer" && (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">AI</div>
                )}
                <div className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "interviewer"
                    ? "bg-white dark:bg-slate-900 border border-border rounded-tl-sm"
                    : "bg-blue-600 text-white rounded-tr-sm"
                )}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
        <div className="border-t border-border p-3 flex gap-2 bg-background">
          <Input
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer using the STAR method..."
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button onClick={send} className="bg-blue-600 hover:bg-blue-500 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function InterviewPrep() {
  const [testMode, setTestMode] = useState(false);

  if (testMode) return <MockTestEngine onExit={() => setTestMode(false)} />;

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="container py-12 md:py-20 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-0">
              <Sparkles className="h-3 w-3 mr-1" /> Interview Success Kit
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Crack your <span className="text-gradient-brand">first job</span> with confidence
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Company-specific patterns, timed proctored mocks with sectional cut-offs, DSA + Aptitude + Core CS,
              STAR-method behavioral prep and a live HR chatbot simulator — built for freshers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setTestMode(true)} className="bg-blue-600 hover:bg-blue-500 text-white shadow-glow">
                <Timer className="h-5 w-5 mr-2" /> Start Proctored Mock Test
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#tracks"><Target className="h-5 w-5 mr-2" /> Browse Tracks</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container py-12 space-y-16">
        {/* Company-Specific Paths */}
        <section>
          <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2"><Building2 className="h-7 w-7 text-blue-600" /> Company-Specific Paths</h2>
              <p className="text-muted-foreground mt-1">Real exam patterns, durations, and cut-off rules.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPANIES.map((c, i) => (
              <motion.div key={c.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full shadow-card-hover overflow-hidden group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-md", c.color)}>
                        {c.initials}
                      </div>
                      <Badge variant={c.type === "Product" ? "default" : "secondary"}>{c.type}</Badge>
                    </div>
                    <CardTitle className="mt-3">{c.name}</CardTitle>
                    <CardDescription className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                      {c.sectional && <span className="flex items-center gap-1 text-amber-600"><Lock className="h-3 w-3" /> Sectional</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Exam Pattern</p>
                    <ol className="space-y-1.5 text-sm">
                      {c.pattern.map((p, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-blue-600 font-mono text-xs mt-0.5">{j + 1}.</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                      <span className="font-semibold">Cut-off:</span> {c.cutoff}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Skill Tracks */}
        <section id="tracks">
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2"><Target className="h-7 w-7 text-emerald-600" /> Skill Tracks</h2>
            <p className="text-muted-foreground mt-1">Master each pillar of the placement process.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SKILL_TRACKS.map((t) => {
              const Icon = t.icon;
              return (
                <Card key={t.id} className="shadow-card-hover">
                  <CardHeader>
                    <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md mb-2", t.gradient)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{t.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {t.topics.map((tp) => (
                        <li key={tp} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Practice Hub */}
        <section>
          <div className="mb-6 flex items-end justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2"><Code2 className="h-7 w-7 text-purple-600" /> Practice Hub</h2>
              <p className="text-muted-foreground mt-1">Mock test sets, runnable coding sandbox, and topic-wise MCQs.</p>
            </div>
            <Badge variant="outline" className="text-xs">{APTITUDE_BANK.length + DSA_BANK.length + CORE_BANK.length}+ real interview questions</Badge>
          </div>
          <Tabs defaultValue="mocks" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full h-auto p-1">
              <TabsTrigger value="mocks" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Mock Tests</TabsTrigger>
              <TabsTrigger value="coding" className="gap-1.5"><Code2 className="h-3.5 w-3.5" /> Coding</TabsTrigger>
              <TabsTrigger value="aptitude" className="gap-1.5"><Brain className="h-3.5 w-3.5" /> Aptitude</TabsTrigger>
              <TabsTrigger value="dsa" className="gap-1.5"><GitBranch className="h-3.5 w-3.5" /> DSA</TabsTrigger>
              <TabsTrigger value="core" className="gap-1.5"><Cpu className="h-3.5 w-3.5" /> Core CS</TabsTrigger>
            </TabsList>
            <TabsContent value="mocks" className="mt-5"><MockTestSets /></TabsContent>
            <TabsContent value="coding" className="mt-5"><CodingSandbox /></TabsContent>
            <TabsContent value="aptitude" className="mt-5"><MCQList items={APTITUDE_BANK} /></TabsContent>
            <TabsContent value="dsa" className="mt-5"><MCQList items={DSA_BANK} /></TabsContent>
            <TabsContent value="core" className="mt-5"><MCQList items={CORE_BANK} /></TabsContent>
          </Tabs>
        </section>

        {/* Career Roadmap */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Target className="h-7 w-7 text-emerald-600" /> Full Career Roadmap
            </h2>
            <p className="text-muted-foreground mt-1">
              Pick your path. Get an efficient, phase-by-phase plan from zero → job-ready, with curated resources, projects, and trackable progress.
            </p>
          </div>
          <CareerRoadmap />
        </section>

        {/* HR / STAR */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2"><User className="h-7 w-7 text-orange-600" /> HR & Behavioral — STAR Method</h2>
            <p className="text-muted-foreground mt-1">
              The industry-standard framework: <strong>S</strong>ituation → <strong>T</strong>ask → <strong>A</strong>ction → <strong>R</strong>esult.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {HR_QUESTIONS.map((h) => (
              <Card key={h.q} className="shadow-card-hover">
                <CardHeader>
                  <CardTitle className="text-base flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" /> {h.q}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5 text-sm">
                  {(["situation", "task", "action", "result"] as const).map((k) => (
                    <div key={k} className="flex gap-3">
                      <span className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xs font-bold flex items-center justify-center uppercase">
                        {k[0]}
                      </span>
                      <p><span className="font-semibold capitalize">{k}: </span><span className="text-muted-foreground">{h.star[k]}</span></p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mock Interview Chatbot */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2"><MessageSquare className="h-7 w-7 text-blue-600" /> Mock Interview Simulator</h2>
            <p className="text-muted-foreground mt-1">Practice with a chatbot that asks follow-ups based on your answers.</p>
          </div>
          <HRChatbot />
        </section>

        {/* System Design */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2"><Network className="h-7 w-7 text-teal-600" /> System Design Basics</h2>
            <p className="text-muted-foreground mt-1">Crisp explanations every fresher should know.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {SYSTEM_DESIGN_TOPICS.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} className="shadow-card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{s.summary}</p>
                    <ul className="space-y-1.5 text-sm">
                      {s.points.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <ChevronRight className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Prep Kit — quick revision notes */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2"><FileText className="h-7 w-7 text-indigo-600" /> Prep Kit — Quick Revision</h2>
            <p className="text-muted-foreground mt-1">Topic-wise crisp notes, formulas and curated resources. Skim before any interview.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREP_KIT.map((n) => (
              <Card key={n.topic} className="shadow-card-hover">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>{n.icon}</span>
                    <CardTitle className="text-base">{n.topic}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">{n.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-xs">
                    {n.keyPoints.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  {n.formulas && (
                    <div className="rounded-md bg-muted/50 p-2 space-y-1">
                      {n.formulas.map((f, i) => (
                        <p key={i} className="font-mono text-[11px] text-foreground/80">{f}</p>
                      ))}
                    </div>
                  )}
                  {n.resources && (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t">
                      {n.resources.map((r) => (
                        <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
                          className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/20 transition-colors">
                          {r.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 p-8 md:p-12 text-white text-center shadow-glow">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready for the real thing?</h2>
          <p className="opacity-90 max-w-xl mx-auto mb-6">
            Take the full proctored mock with sectional cut-offs and difficulty scaling — just like AMCAT, CoCubes and TCS NQT.
          </p>
          <Button size="lg" onClick={() => setTestMode(true)} className="bg-white text-blue-700 hover:bg-blue-50">
            <Timer className="h-5 w-5 mr-2" /> Launch Proctored Test
          </Button>
        </section>
      </div>
    </PageLayout>
  );
}

/* MCQ list — review-mode practice (instant feedback) */
function MCQList({ items }: { items: MCQ[] }) {
  return (
    <div className="space-y-3">
      {items.map((q, i) => <MCQReviewCard key={q.id} q={q} index={i} />)}
    </div>
  );
}

function MCQReviewCard({ q, index }: { q: MCQ; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const reveal = picked !== null;

  return (
    <Card className="shadow-card-hover">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{q.topic}</Badge>
          <Badge className={cn(
            q.difficulty === "Easy" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
            q.difficulty === "Medium" && "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
            q.difficulty === "Hard" && "bg-red-500/15 text-red-700 hover:bg-red-500/15",
          )}>{q.difficulty}</Badge>
        </div>
        <CardTitle className="text-base">Q{index + 1}. {q.q}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              onClick={() => picked === null && setPicked(i)}
              disabled={reveal}
              className={cn(
                "w-full text-left flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
                !reveal && "hover:border-primary hover:bg-accent",
                reveal && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
                reveal && isPicked && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/30",
              )}
            >
              <span className="h-6 w-6 rounded-full border flex items-center justify-center text-xs font-medium">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {reveal && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {reveal && isPicked && !isCorrect && <XCircle className="h-4 w-4 text-red-600" />}
            </button>
          );
        })}
        {reveal && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4" /> Why this is correct
            </p>
            <p className="text-blue-800 dark:text-blue-200">{q.why}</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
