import React from "react";

type Milestone = {
  year: string;
  description: string;
};

const milestones: Milestone[] = [
  { year: "2010", description: "Fundação como loja de materiais de limpeza." },
  { year: "2012", description: "Início da distribuição de materiais de limpeza." },
  { year: "2015", description: "Virada de chave: primeiros contratos de terceirização." },
  { year: "2020", description: "Pandemia: manutenção de todos os empregos e crescimento de 30%." },
  { year: "2022", description: "Alcançamos 1.500 colaboradores." },
  { year: "2023", description: "Conquista do selo GPTW (Great Place to Work)." },
  { year: "2024", description: "Expansão para 15 estados e marca de 3.500 colaboradores." },
  { year: "2025", description: "Inauguração da nova sede administrativa e consolidação nacional." },
];

export default function HistorySection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="at-card">
          <div className="at-card-header">
            <div className="text-sm font-medium text-slate-500">Cronologia</div>
            <h2 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Marcos da nossa jornada
            </h2>
            <p className="mt-2 text-slate-600">Os principais momentos que definiram nossa trajetória.</p>
          </div>

          <div className="at-card-body">
            <div className="grid gap-4">
              {milestones.map((m) => (
                <div key={m.year} className="rounded-[24px] border border-slate-200 bg-white/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-2xl font-semibold text-[#354A80]">{m.year}</div>
                    <div className="text-slate-700 leading-relaxed">{m.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
