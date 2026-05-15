import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  /** 0-100 — drives the bottom progress bar. */
  progress: number;
}

export function StatCard({ label, value, hint, icon: Icon, progress }: Props) {
  const v = Math.max(0, Math.min(100, progress));
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-700"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
