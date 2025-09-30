import React, { PropsWithChildren } from "react";
import Header from "@/components/Header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-24 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 py-8 border-t border-white/10 text-sm">
        <div className="rounded-xl p-4 text-center text-white" style={{
          background: "linear-gradient(135deg, var(--secondary), var(--primary))"
        }}>
          <div className="flex items-center justify-center gap-4 mb-2">
            <a aria-label="LinkedIn" href="#" className="text-white/90 hover:text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] transition">in</a>
            <a aria-label="Instagram" href="#" className="text-white/90 hover:text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] transition">ig</a>
            <a aria-label="YouTube" href="#" className="text-white/90 hover:text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] transition">yt</a>
          </div>
          © {new Date().getFullYear()} Trabalhe Conosco
        </div>
      </footer>
    </div>
  );
}

