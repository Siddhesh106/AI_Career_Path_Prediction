import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CheckCircle2, ChevronRight, Clock, Lightbulb, RotateCcw, Target, Timer, Trophy, XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_SETS, type MockSet, type MCQ } from "@/data/interviewBanks";

interface Answer { qId: string; selected: number | null; correct: boolean; }

export function MockTestSets() {
  const [active, setActive] = useState<MockSet | null>(null);
  if (active) return <TimedMockRunner set={active} onExit={() => setActive(null)} />;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {MOCK_SETS.map((s, idx) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="h-full shadow-card-hover overflow-hidden border-border/60">
            <div className={cn(
              "h-2 w-full",
              s.difficulty === "Beginner" && "bg-gradient-to-r from-emerald-400 to-teal-500",
              s.difficulty === "Intermediate" && "bg-gradient-to-r from-amber-400 to-orange-500",
              s.difficulty === "Advanced" && "bg-gradient-to-r from-rose-500 to-purple-600",
            )} />
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">SET {idx + 1}</Badge>
                <Badge className={cn(
                  s.difficulty === "Beginner" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
                  s.difficulty === "Intermediate" && "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
                  s.difficulty === "Advanced" && "bg-rose-500/15 text-rose-700 hover:bg-rose-500/15",
                )}>{s.difficulty}</Badge>
              </div>
              <CardTitle className="mt-2 text-lg">{s.title}</CardTitle>
              <CardDescription>{s.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {s.durationMin} min</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Questions</p>
                  <p className="font-semibold flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> {s.questions.length}</p>
                </div>
              </div>
              <Button onClick={() => setActive(s)} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                <Timer className="h-4 w-4 mr-2" /> Start Test
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function TimedMockRunner({ set, onExit }: { set: MockSet; onExit: () => void }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(set.durationMin * 60);
  const [done, setDone] = useState(false);
  const total = set.questions.length;
  const q = set.questions[qIdx];

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); finish(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function record(forceNull = false) {
    const sel = forceNull ? null : selected;
    setAnswers((a) => [...a, { qId: q.id, selected: sel, correct: sel === q.answer }]);
  }

  function next() {
    record();
    setSelected(null);
    if (qIdx + 1 < total) setQIdx(qIdx + 1);
    else finish(false);
  }

  function finish(timeUp: boolean) {
    if (timeUp) record(true);
    setDone(true);
  }

  if (done) return <MockResults set={set} answers={answers} onExit={onExit} />;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const low = timeLeft < 60;

  return (
    <div className="rounded-2xl border bg-card p-4 md:p-6 shadow-elegant">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">{set.title}</p>
          <p className="text-sm font-semibold">Question {qIdx + 1} of {total}</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-base font-bold tabular-nums",
          low ? "bg-red-500/15 text-red-600 animate-pulse" : "bg-blue-500/10 text-blue-700 dark:text-blue-300"
        )}>
          <Timer className="h-4 w-4" />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>
      <Progress value={((qIdx + 1) / total) * 100} className="h-1.5 mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">{q.topic}</Badge>
            <Badge className={cn(
              q.difficulty === "Easy" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
              q.difficulty === "Medium" && "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
              q.difficulty === "Hard" && "bg-red-500/15 text-red-700 hover:bg-red-500/15",
            )}>{q.difficulty}</Badge>
          </div>
          <h3 className="text-lg md:text-xl font-semibold leading-relaxed mb-5">{q.q}</h3>
          <RadioGroup value={selected?.toString() ?? ""} onValueChange={(v) => setSelected(parseInt(v))} className="space-y-2.5">
            {q.options.map((opt, i) => (
              <label
                key={i} htmlFor={`mq-${q.id}-${i}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer transition-all",
                  selected === i ? "border-blue-500 bg-blue-500/5 shadow-sm" : "border-border hover:border-blue-300 hover:bg-accent/40",
                )}
              >
                <RadioGroupItem value={i.toString()} id={`mq-${q.id}-${i}`} />
                <span className="text-sm leading-snug">{opt}</span>
              </label>
            ))}
          </RadioGroup>

          <div className="flex items-center justify-between mt-6 pt-5 border-t">
            <Button variant="ghost" onClick={onExit} className="text-muted-foreground">Exit</Button>
            <Button onClick={next} className="bg-blue-600 hover:bg-blue-500 text-white">
              {qIdx + 1 === total ? "Submit Test" : "Next Question"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MockResults({ set, answers, onExit }: { set: MockSet; answers: Answer[]; onExit: () => void }) {
  const correct = answers.filter((a) => a.correct).length;
  const accuracy = answers.length ? Math.round((correct / answers.length) * 100) : 0;

  const byTopic = useMemo(() => {
    const map: Record<string, { c: number; t: number }> = {};
    answers.forEach((a) => {
      const q = set.questions.find((x) => x.id === a.qId);
      if (!q) return;
      if (!map[q.topic]) map[q.topic] = { c: 0, t: 0 };
      map[q.topic].t++;
      if (a.correct) map[q.topic].c++;
    });
    return Object.entries(map).map(([topic, v]) => ({
      topic, pct: Math.round((v.c / v.t) * 100), c: v.c, t: v.t,
    })).sort((a, b) => a.pct - b.pct);
  }, [answers, set.questions]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border bg-card p-6 md:p-8 shadow-elegant space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 shadow-glow">
          <Trophy className="h-7 w-7 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold">{set.title} — Complete</h3>
        <p className="text-muted-foreground text-sm">{set.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border p-4 text-center">
          <p className="text-xs text-muted-foreground">Accuracy</p>
          <p className="text-3xl font-bold text-emerald-600">{accuracy}%</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-xs text-muted-foreground">Correct</p>
          <p className="text-3xl font-bold">{correct}/{answers.length}</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-xs text-muted-foreground">Total Questions</p>
          <p className="text-3xl font-bold text-blue-600">{set.questions.length}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2"><Target className="h-4 w-4" /> Topic-wise breakdown</h4>
        <div className="space-y-3">
          {byTopic.map((r) => (
            <div key={r.topic}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{r.topic}</span>
                <span className={cn("font-semibold",
                  r.pct < 50 ? "text-red-600" : r.pct < 75 ? "text-amber-600" : "text-emerald-600"
                )}>{r.pct}% ({r.c}/{r.t})</span>
              </div>
              <Progress value={r.pct} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Review answers</h4>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {answers.map((a, i) => {
            const q = set.questions.find((x) => x.id === a.qId)!;
            return (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <div className="flex items-start gap-2">
                  {a.correct ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
                  <div className="flex-1">
                    <p className="font-medium">Q{i + 1}. {q.q}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Correct answer: <span className="font-semibold text-emerald-600">{q.options[q.answer]}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{q.why}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-2">
        <Button variant="outline" onClick={onExit}><RotateCcw className="h-4 w-4 mr-2" /> Back to Mock Sets</Button>
      </div>
    </motion.div>
  );
}
