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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/40 ${
        scrolled ? "h-14" : "h-20"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
        <div className="text-lg font-semibold text-white">
          <span className="text-white">Trabalhe</span>{" "}
          <span className="text-white">Conosco</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#oportunidades" className="text-white opacity-90 hover:opacity-100 transition font-medium">
            Oportunidades
          </a>
        </nav>
      </div>
    </header>
  );
}

