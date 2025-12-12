import React, { PropsWithChildren } from "react";
import Header from "@/components/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen text-foreground at-page">
      <Header />
      <main className="mx-auto max-w-6xl px-4 pt-24 pb-12">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm">
        <div className="at-card">
          <div className="at-card-body text-center text-slate-600 space-y-2">
            <div className="text-slate-900 font-semibold">AstronTalent</div>
            <div>© {new Date().getFullYear()} Aestron</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

