import React from "react";

export default function Hero() {
  return (
    <section className="relative">
      {/* Hero corporativo (limpo, sem partículas/temas) */}
      <div className="bg-gradient-to-br from-[#354A80] to-[#1f2937]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
              Oportunidades FG Services
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
              Trabalhe conosco
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
              Faça parte do nosso time. Encontre a vaga ideal e acompanhe sua candidatura com uma experiência moderna e profissional.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#oportunidades"
                className="at-btn at-btn-primary inline-flex items-center justify-center w-full sm:w-auto px-6"
              >
                Ver vagas
              </a>
              <a
                href="#nossa-historia"
                className="at-btn inline-flex items-center justify-center w-full sm:w-auto px-6 bg-white/10 text-white border border-white/20 hover:bg-white/15"
              >
                Nossa história
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
