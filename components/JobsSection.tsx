import React from "react";
import Link from "next/link";
import { jobs } from "@/lib/jobs";

export default function JobsSection() {
  return (
    <section id="oportunidades" className="relative py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Vagas Disponíveis</h2>
            <p className="text-white/70 text-sm sm:text-base">Encontre a oportunidade ideal para você.</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-5 shadow-lg backdrop-blur-sm transition duration-300"
            >
              {/* Conteúdo fixo (texto nunca muda) */}
              <div className="relative z-10 flex h-56 flex-col justify-between pb-12">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-[#0c0c0c] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#1a1a1a]/80">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1">
                      {job.contractType}
                    </span>
                    <span className="opacity-90">{job.address}</span>
                  </div>
                </div>
              </div>

              {/* CTA (apenas no hover, no rodapé, sem sobrepor texto) */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-20">
                <div className="flex justify-center">
                  <Link
                    href={`/vagas/${job.id}`}
                    className="pointer-events-auto btn-gradient rounded-lg px-4 py-2 text-sm font-medium text-white"
                  >
                    Ver Oportunidade
                  </Link>
                </div>
              </div>

              {/* Efeito glassmorphism sutil no fundo ao hover (somente background) */}
              <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-0" />
              <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,theme(colors.primary/12),theme(colors.secondary/12))] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none z-0" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

