import React from "react";

export default function ConclusionSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="at-card">
          <div className="at-card-header">
            <div className="text-sm font-medium text-slate-500">Nosso compromisso</div>
            <h2 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Fazendo a diferença
            </h2>
            <p className="mt-2 text-slate-600">
              Confiança, excelência e inovação em terceirização de serviços especializados.
            </p>
          </div>

          <div className="at-card-body">
            <div className="rounded-[24px] border border-slate-200 bg-white/70 p-6 sm:p-8">
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
                Hoje, a <span className="font-semibold text-slate-900">FG Services</span> é sinônimo de confiança, excelência e inovação.
                Com uma equipe presente em diferentes setores e regiões do Brasil, seguimos firmes em nossa missão: oferecer soluções
                eficientes, sustentáveis e que façam diferença na vida de nossos clientes, colaboradores e comunidades.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#oportunidades"
                  className="at-btn at-btn-primary inline-flex items-center justify-center w-full sm:w-auto px-6"
                >
                  Ver oportunidades
                </a>
                <a
                  href="#nossa-historia"
                  className="at-btn at-btn-secondary inline-flex items-center justify-center w-full sm:w-auto px-6"
                >
                  Conhecer nossa história
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
