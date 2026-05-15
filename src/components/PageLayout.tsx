import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { SiteFooter } from "./SiteFooter";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
