import { TrendingUp } from "lucide-react";

export type Level = "none" | "beginner" | "intermediate" | "advanced" | "expert";

const LEVEL_VALUE: Record<Level, number> = {
  none: 0,
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};
const LEVEL_LABELS: Level[] = ["none", "beginner", "intermediate", "advanced", "expert"];

export interface SkillGapDatum {
  skill: string;
  currentLevel: Level;
  targetLevel: Level;
  importance: number;
}

interface Props {
  data: SkillGapDatum[];
}

/** Horizontal grouped bar chart: current vs target proficiency per skill. */
export function SkillGapChart({ data }: Props) {
  if (!data.length) return null;

  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-card to-accent/20 p-5 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Current vs Required Proficiency</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-r from-primary/60 to-primary" />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm border-2 border-dashed border-primary" />
            Required
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((d) => {
          const current = LEVEL_VALUE[d.currentLevel] ?? 0;
          const target = LEVEL_VALUE[d.targetLevel] ?? 100;
          const gap = Math.max(0, target - current);
          return (
            <div key={d.skill} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate pr-2">{d.skill}</span>
                <span className="text-muted-foreground capitalize whitespace-nowrap">
                  {d.currentLevel} → {d.targetLevel}
                  {gap > 0 && <span className="ml-2 text-primary font-medium">+{gap}%</span>}
                </span>
              </div>
              {/* Track */}
              <div className="relative h-6 w-full rounded-md bg-muted/60 overflow-hidden">
                {/* Gridlines for each level (25/50/75) */}
                {[25, 50, 75].map((p) => (
                  <span
                    key={p}
                    className="absolute top-0 h-full w-px bg-border/60"
                    style={{ left: `${p}%` }}
                  />
                ))}
                {/* Current proficiency fill */}
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-700 ease-out"
                  style={{ width: `${current}%` }}
                />
                {/* Gap fill (lighter, between current and target) */}
                {gap > 0 && (
                  <div
                    className="absolute top-0 h-full bg-primary/15 border-l border-dashed border-primary/40 transition-all duration-700"
                    style={{ left: `${current}%`, width: `${gap}%` }}
                  />
                )}
                {/* Target marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-primary"
                  style={{ left: `calc(${target}% - 1px)` }}
                  aria-label={`Target ${d.targetLevel}`}
                />
              </div>
              {/* Axis */}
              <div className="flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground/70 px-0.5">
                {LEVEL_LABELS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Compact priority/importance bar. */
export function PriorityBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary transition-all duration-700"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}