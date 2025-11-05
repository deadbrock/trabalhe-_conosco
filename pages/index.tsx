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
    <>
      <Hero />
      <OurStorySection />
      <HistorySection />
      <JobsSection />
      <ConclusionSection />
    </>
  );
}
