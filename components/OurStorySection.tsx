import React from "react";

const highlights = [
  { number: "15", label: "Estados" },
  { number: "3.500+", label: "Colaboradores" },
  { number: "GPTW", label: "Certificação" },
  { number: "30%+", label: "Crescimento" },
];

export default function OurStorySection() {
  return (
    <section id="nossa-historia" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="at-card">
          <div className="at-card-header">
            <div className="text-sm font-medium text-slate-500">Desde 2010</div>
            <h2 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Nossa história
            </h2>
            <p className="mt-2 text-slate-600">
              Uma trajetória construída com consistência, cuidado com pessoas e excelência em serviços.
            </p>
          </div>

          <div className="at-card-body">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-[18px] border border-slate-200 bg-white/70 p-5">
                  <div className="text-2xl font-semibold text-slate-900">{item.number}</div>
                  <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6">
              <div className="rounded-[24px] border border-slate-200 bg-white/70 p-6">
                <h3 className="text-xl font-semibold text-slate-900">O início</h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  A FG Services nasceu em 2010 como uma pequena loja de materiais de limpeza em Igarassu/PE. Em 2015,
                  a empresa deu o grande passo rumo à terceirização de serviços, conquistando seus primeiros contratos e
                  iniciando uma expansão sustentável.
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white/70 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Crescimento e conquistas</h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  Em 2023, a FG conquistou o selo GPTW (Great Place to Work). Em 2024, ultrapassamos 3.500 colaboradores
                  em 15 estados e, em 2025, inauguramos a nova sede administrativa, consolidando nossa presença nacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
