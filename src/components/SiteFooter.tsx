import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Brain className="h-5 w-5 text-primary" />
            CareerAI
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            AI-powered career guidance helping professionals land their dream roles.
          </p>
        </div>
        <FooterCol title="Product" links={[["Resume Parser", "/resume"], ["Job Board", "/jobs"], ["Pricing", "/services"]]} />
        <FooterCol title="Company" links={[["About", "/about"], ["Contact", "/contact"]]} />
        <FooterCol title="Account" links={[["Sign In", "/auth"], ["Profile", "/profile"]]} />
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} CareerAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="hover:text-foreground transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
