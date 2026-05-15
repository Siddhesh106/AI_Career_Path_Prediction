import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Index = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6 p-8 text-center">
    <Sparkles className="h-10 w-10 text-primary" />
    <h1 className="text-4xl font-bold tracking-tight">CareerAI Resume Parser</h1>
    <p className="text-muted-foreground max-w-md">
      Upload a resume and get an instantly structured career profile, powered by Gemini.
    </p>
    <Button asChild size="lg">
      <Link to="/resume">Open Resume Parser</Link>
    </Button>
  </div>
);

export default Index;
