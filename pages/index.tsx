import React from "react";
import Hero from "@/components/Hero";
import JobsSection from "@/components/JobsSection";
import TimelineSection from "@/components/TimelineSection";
import ValuesSection from "@/components/ValuesSection";
import { useTyping } from "@/hooks/useTyping";

export default function Home() {
  useTyping();
  return (
    <>
      <Hero />
      <ValuesSection />
      <JobsSection />
      <TimelineSection />
    </>
  );
}
