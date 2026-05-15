import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Code2, Play, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CODING_BANK, type CodingQ } from "@/data/interviewBanks";

interface TestResult { description: string; pass: boolean; got?: string; expected: string; error?: string; }

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    return ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

function runTests(code: string, q: CodingQ): TestResult[] {
  return q.tests.map((t) => {
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${code}\nreturn ${q.fnName};`)();
      if (typeof fn !== "function") {
        return { description: t.description, pass: false, expected: JSON.stringify(t.expected), error: `Function "${q.fnName}" is not defined` };
      }
      const got = fn(...t.input);
      const pass = deepEqual(got, t.expected);
      return { description: t.description, pass, got: JSON.stringify(got), expected: JSON.stringify(t.expected) };
    } catch (e) {
      return { description: t.description, pass: false, expected: JSON.stringify(t.expected), error: (e as Error).message };
    }
  });
}

export function CodingSandbox() {
  const [qIdx, setQIdx] = useState(0);
  const q = CODING_BANK[qIdx];
  const [code, setCode] = useState(q.starter);
  const [results, setResults] = useState<TestResult[] | null>(null);

  function selectQ(i: number) {
    setQIdx(i);
    setCode(CODING_BANK[i].starter);
    setResults(null);
  }

  function reset() {
    setCode(q.starter);
    setResults(null);
  }

  function run() {
    setResults(runTests(code, q));
  }

  const passed = results?.filter((r) => r.pass).length ?? 0;
  const total = results?.length ?? 0;

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-4">
      {/* Problem list */}
      <div className="space-y-1.5 lg:max-h-[600px] lg:overflow-y-auto pr-1">
        {CODING_BANK.map((c, i) => (
          <button
            key={c.id}
            onClick={() => selectQ(i)}
            className={cn(
              "w-full text-left rounded-lg border p-3 transition-all",
              i === qIdx ? "border-blue-500 bg-blue-500/5 shadow-sm" : "border-border hover:border-blue-300 hover:bg-accent/40",
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
              <Badge variant="outline" className={cn(
                "text-[10px]",
                c.difficulty === "Easy" && "border-emerald-500/30 text-emerald-600",
                c.difficulty === "Medium" && "border-amber-500/30 text-amber-600",
                c.difficulty === "Hard" && "border-red-500/30 text-red-600",
              )}>{c.difficulty}</Badge>
            </div>
            <p className="font-medium text-sm">{c.title}</p>
            <p className="text-xs text-muted-foreground">{c.topic}</p>
          </button>
        ))}
      </div>

      {/* Editor */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{q.topic}</Badge>
            <Badge className={cn(
              q.difficulty === "Easy" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
              q.difficulty === "Medium" && "bg-amber-500/15 text-amber-700 hover:bg-amber-500/15",
              q.difficulty === "Hard" && "bg-red-500/15 text-red-700 hover:bg-red-500/15",
            )}>{q.difficulty}</Badge>
          </div>
          <CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-blue-600" /> {q.title}</CardTitle>
          <CardDescription className="leading-relaxed">{q.prompt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-slate-400 font-mono">solution.js</span>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm bg-slate-950 text-emerald-300 border-0 rounded-none min-h-[240px] focus-visible:ring-0 resize-y"
              spellCheck={false}
            />
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Button onClick={run} className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Play className="h-4 w-4 mr-1.5" /> Run Tests
            </Button>
            <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-1.5" /> Reset</Button>
            {results && (
              <Badge className={cn(
                "ml-auto",
                passed === total ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15"
                  : "bg-red-500/15 text-red-700 hover:bg-red-500/15"
              )}>
                {passed}/{total} passed
              </Badge>
            )}
          </div>

          {results && (
            <div className="mt-4 space-y-2">
              {results.map((r, i) => (
                <div key={i} className={cn(
                  "rounded-lg border p-3 text-sm",
                  r.pass ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                )}>
                  <div className="flex items-start gap-2">
                    {r.pass ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
                    <div className="flex-1 font-mono text-xs space-y-0.5">
                      <p className="font-semibold">Test {i + 1}: {r.description}</p>
                      {r.error ? (
                        <p className="text-red-600">Error: {r.error}</p>
                      ) : (
                        <>
                          <p>Expected: <span className="text-emerald-700">{r.expected}</span></p>
                          {!r.pass && <p>Got: <span className="text-red-700">{r.got}</span></p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
