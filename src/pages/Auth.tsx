import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Brain, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/external-supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passwordSchema = z.string().min(6, "At least 6 characters").max(72);
const nameSchema = z.string().trim().min(1, "Required").max(100);

export default function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialMode = params.get("mode") === "signup" ? "signup" : "signin";
  const [tab, setTab] = useState(initialMode);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/resume", { replace: true });
  }, [user, navigate]);

  const handleEmail = async (e: React.FormEvent<HTMLFormElement>, mode: "signin" | "signup") => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    const name = String(fd.get("name") ?? "");

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (mode === "signup") nameSchema.parse(name);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues[0].message);
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created! Welcome to CareerAI.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg.includes("Invalid login") ? "Invalid email or password" : msg);
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "apple") => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/resume`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error(`${provider} auth error:`, err);
      toast.error(`${provider} sign-in failed`);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-brand text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Brain className="h-6 w-6" />
          CareerAI
        </Link>
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Your career, accelerated.</h2>
          <p className="opacity-90 max-w-sm">
            Join 25,000+ professionals using AI-powered resume parsing and job matching to land their dream role.
          </p>
        </div>
        <p className="text-xs opacity-75">© {new Date().getFullYear()} CareerAI</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-2 font-semibold">
            <Brain className="h-5 w-5 text-primary" />
            CareerAI
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 pt-4">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <form onSubmit={(e) => handleEmail(e, "signin")} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email-in">Email</Label>
                  <Input id="email-in" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw-in">Password</Label>
                  <Input id="pw-in" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-brand text-primary-foreground hover:opacity-90">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
              <Divider />
              <SocialButtons onClick={oauth} disabled={busy} />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 pt-4">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <form onSubmit={(e) => handleEmail(e, "signup")} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-up">Email</Label>
                  <Input id="email-up" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw-up">Password</Label>
                  <Input id="pw-up" name="password" type="password" required minLength={6} autoComplete="new-password" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-brand text-primary-foreground hover:opacity-90">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </form>
              <Divider />
              <SocialButtons onClick={oauth} disabled={busy} />
            </TabsContent>
          </Tabs>

          <p className="text-xs text-center text-muted-foreground">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
      </div>
    </div>
  );
}

function SocialButtons({ onClick, disabled }: { onClick: (p: "google" | "apple") => void; disabled: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" disabled={disabled} onClick={() => onClick("google")} type="button">
        <GoogleIcon /> Google
      </Button>
      <Button variant="outline" disabled={disabled} onClick={() => onClick("apple")} type="button">
        <AppleIcon /> Apple
      </Button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 17.04c-.39.9-.575 1.31-1.077 2.1-.7 1.1-1.685 2.48-2.91 2.49-1.09.01-1.37-.71-2.85-.7-1.48.01-1.79.71-2.88.7-1.22-.01-2.16-1.25-2.86-2.35-1.95-3.05-2.16-6.63-.95-8.53.86-1.36 2.22-2.15 3.5-2.15 1.3 0 2.12.71 3.2.71 1.05 0 1.69-.71 3.19-.71 1.13 0 2.34.62 3.2 1.69-2.81 1.54-2.36 5.55.34 6.75z"/>
    </svg>
  );
}
