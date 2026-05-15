import { Link } from "react-router-dom";
import { ArrowRight, Brain, Briefcase, CheckCircle2, FileText, LineChart, Shield, Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/PageLayout";

export default function Home() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />
        <div className="container relative py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered career platform
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Your Career Success,
              <br />
              Powered by <span className="text-gradient-brand">AI Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Join 25,000+ professionals who've transformed their careers using our AI-powered career guidance platform.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-gradient-brand text-primary-foreground hover:opacity-90 shadow-glow transition-all hover:scale-[1.02]">
                <Link to="/auth?mode=signup">
                  Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40">
                <Link to="/services">View Pricing</Link>
              </Button>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-medium text-foreground">4.9/5</span>
              <span>from 1,000+ reviews</span>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-brand p-[1.5px] shadow-glow animate-float">
              <div className="h-full w-full rounded-3xl bg-card grid place-items-center overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-6 w-full">
                  {[
                    { icon: FileText, label: "Resumes Parsed", value: "50k+" },
                    { icon: Briefcase, label: "Jobs Matched", value: "120k+" },
                    { icon: Users, label: "Active Users", value: "25k+" },
                    { icon: LineChart, label: "Match Accuracy", value: "94%" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-2xl bg-background/80 backdrop-blur border border-border/60 p-4 shadow-card-hover">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center mb-2">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-2xl font-bold tracking-tight">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-2 md:-right-6 glass rounded-2xl p-4 shadow-elegant flex items-center gap-3 animate-glow-pulse">
              <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center shadow-glow">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-lg font-bold">94% Match</p>
              </div>
            </div>
            <div className="absolute -top-4 -left-2 md:-left-6 glass rounded-2xl p-3 shadow-elegant flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 grid place-items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xs font-medium">Verified by AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="container py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "25k+", label: "Active Users" },
            { value: "120k+", label: "Job Matches" },
            { value: "94%", label: "Accuracy" },
            { value: "4.9★", label: "Avg Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-bold text-gradient-brand">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative">
        <div className="container py-20 md:py-24 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" /> Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to grow</h2>
            <p className="text-muted-foreground text-lg">From resume parsing to job matching and skill development.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Resume Parser", desc: "Upload any resume and instantly extract a structured career profile." },
              { icon: Briefcase, title: "Smart Job Matching", desc: "Get matched with roles that fit your skills and growth ambitions." },
              { icon: LineChart, title: "Skill Gap Analysis", desc: "See exactly what to learn next with curated courses and resources." },
              { icon: Shield, title: "Privacy First", desc: "Your data is encrypted and never sold. You stay in control." },
              { icon: TrendingUp, title: "Career Tracking", desc: "Track your applications, interviews, and growth over time." },
              { icon: Sparkles, title: "AI Coach", desc: "Get personalized advice 24/7 from our AI career assistant." },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-border bg-card p-6 space-y-3 shadow-card-hover overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-32 w-32 bg-gradient-brand opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-500" />
                <div className="relative h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg relative">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-brand p-10 md:p-16 text-center shadow-glow">
          <div className="absolute inset-0 bg-mesh opacity-30" />
          <div className="relative space-y-5 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
              Ready to accelerate your career?
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Sign up free and get your first AI-powered career analysis in minutes.
            </p>
            <Button asChild size="lg" variant="secondary" className="shadow-elegant hover:scale-[1.02] transition-transform">
              <Link to="/auth?mode=signup">
                Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
