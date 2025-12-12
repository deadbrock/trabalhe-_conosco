import React, { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 at-navbar ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
        <div className="text-lg font-semibold text-slate-900 tracking-tight">
          <span className="text-slate-900">Trabalhe</span>{" "}
          <span className="text-slate-900">Conosco</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a
            href="#oportunidades"
            className="text-slate-700 hover:text-slate-900 transition font-medium"
          >
            Oportunidades
          </a>
        </nav>
      </div>
    </header>
  );
}

