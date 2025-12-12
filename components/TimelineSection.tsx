import React from "react";
import { motion } from "framer-motion";

type Milestone = {
  year: string;
  title: string;
  text: string;
};

const milestones: Milestone[] = [
  { year: "2018", title: "FundaÃ§Ã£o", text: "Nasce nossa missÃ£o de conectar talentos a propÃ³sito." },
  { year: "2020", title: "ExpansÃ£o", text: "Ampliamos operaÃ§Ãµes e times em todo o paÃ­s." },
  { year: "2022", title: "Parcerias", text: "Firmamos alianÃ§as estratÃ©gicas para crescer mais rÃ¡pido." },
  { year: "2024", title: "InovaÃ§Ã£o", text: "Novas soluÃ§Ãµes digitais e foco em experiÃªncia." },
];

export default function TimelineSection() {
  return (
    <section className="relative py-16">
      {/* Camada clara translÃºcida para destacar timeline */}
      <div className="absolute inset-0 -z-10 bg-[color-mix(in_oklab,var(--secondary),white_75%)]/20 backdrop-blur-sm" />
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Nossa HistÃ³ria</h2>

        <div className="relative overflow-x-auto pb-6">
          {/* Linha base */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/20" />

          <div className="flex min-w-[800px] gap-10">
            {milestones.map((m, idx) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative w-[280px] shrink-0"
              >
                {/* Ponto na linha */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_6px_rgba(162,18,42,0.25)] transition-transform duration-200 group-hover:scale-110" />

                {/* Card */}
                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-secondary font-bold">{m.year}</div>
                  <div className="text-lg font-semibold">{m.title}</div>
                  <p className="mt-1 text-white/70 text-sm">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

