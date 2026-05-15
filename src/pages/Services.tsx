import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/PageLayout";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Try CareerAI with no commitment.",
    features: ["1 resume parse / month", "Basic job matching", "Limited skill gap analysis", "Community support"],
    cta: "Get Started",
    href: "/auth?mode=signup",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For serious career growth.",
    features: [
      "Unlimited resume parses",
      "AI job matching with apply links",
      "Full skill gap + course recommendations",
      "Growth trajectory roadmap",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/auth?mode=signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For teams and bootcamps.",
    features: ["Everything in Pro", "Team dashboard", "Bulk resume processing", "API access", "Dedicated CSM"],
    cta: "Contact Sales",
    href: "/contact",
  },
];

export default function Services() {
  return (
    <PageLayout>
      <section className="container py-16 md:py-24 text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">Pricing that scales with you</h1>
        <p className="text-lg text-muted-foreground">Start free. Upgrade when you're ready. Cancel anytime.</p>
      </section>

      <section className="container pb-20 grid md:grid-cols-3 gap-6">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={cn(
              "rounded-2xl border bg-card p-6 space-y-5 flex flex-col",
              t.highlight ? "border-primary shadow-lg shadow-primary/10 relative" : "border-border",
            )}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-brand text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most popular
              </span>
            )}
            <div>
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{t.price}</span>
              <span className="text-sm text-muted-foreground">{t.period}</span>
            </div>
            <ul className="space-y-2 text-sm flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={cn(
                "w-full",
                t.highlight ? "bg-gradient-brand text-primary-foreground hover:opacity-90" : "",
              )}
              variant={t.highlight ? "default" : "outline"}
            >
              <Link to={t.href}>{t.cta}</Link>
            </Button>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}
