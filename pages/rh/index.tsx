import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";

type Metrics = {
  vagas_abertas: number;
  total_candidatos: number;
  candidatos_hoje: number;
};

export default function RHDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;
    apiGet<Metrics>("/metrics", token).then(setMetrics).catch(() => setMetrics({ vagas_abertas: 0, total_candidatos: 0, candidatos_hoje: 0 }));
  }, []);

  const cards = [
    { label: "Vagas Abertas", value: metrics?.vagas_abertas ?? "--" },
    { label: "Total de Candidatos", value: metrics?.total_candidatos ?? "--" },
    { label: "Candidatos Hoje", value: metrics?.candidatos_hoje ?? "--" },
  ];

  return (
    <section className="min-h-[60svh]">
      <h1 className="text-2xl font-bold mb-6">Dashboard RH</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md shadow-lg">
            <div className="text-sm text-white/70">{c.label}</div>
            <div className="mt-2 text-3xl font-extrabold">{c.value}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
