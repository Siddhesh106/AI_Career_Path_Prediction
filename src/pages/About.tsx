import { Brain, Heart, Target, Users } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

export default function About() {
  return (
    <PageLayout>
      <section className="container py-16 md:py-24 space-y-6 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">
          Helping professionals find their <span className="text-gradient-brand">true potential</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          CareerAI was built by engineers and career coaches who believed AI could finally make personalized career
          guidance accessible to everyone — not just those who can afford a $300/hr consultant.
        </p>
      </section>

      <section className="container pb-16 grid md:grid-cols-2 gap-8">
        {[
          { icon: Target, title: "Our Mission", body: "Democratize world-class career guidance using AI so every professional can grow with confidence." },
          { icon: Heart, title: "Our Values", body: "Honest feedback. Privacy first. Always actionable. We never sell your data — ever." },
          { icon: Users, title: "Who We Serve", body: "Students entering the workforce, mid-career changers, and senior leaders planning their next move." },
          { icon: Brain, title: "Our Tech", body: "Built on modern LLMs fine-tuned on millions of career trajectories and market data points." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-brand grid place-items-center">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="container py-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["25k+", "Active users"],
            ["94%", "Match accuracy"],
            ["1M+", "Skills analyzed"],
            ["50+", "Countries"],
          ].map(([v, l]) => (
            <div key={l} className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold text-gradient-brand">{v}</p>
              <p className="text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
