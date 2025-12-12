import React from "react";
import Hero from "@/components/Hero";
import OurStorySection from "@/components/OurStorySection";
import HistorySection from "@/components/HistorySection";
import JobsSection from "@/components/JobsSection";
import ConclusionSection from "@/components/ConclusionSection";
import { useTyping } from "@/hooks/useTyping";

export default function Home() {
  useTyping();
  return (
    <div className="relative">
      {/* Fundo azul/gradiente apenas na Home */}
      <div className="home-blue-bg pointer-events-none fixed inset-0 -z-10" />
      <Hero />
      <OurStorySection />
      <HistorySection />
      <JobsSection />
      <ConclusionSection />
    </div>
  );
}
