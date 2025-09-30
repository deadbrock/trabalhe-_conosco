import React from "react";
import { useRouter } from "next/router";
import { getJobById } from "@/lib/jobs";

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const job = id ? getJobById(id) : undefined;

  if (!job) {
    return (
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-white/70">Vaga não encontrada.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16">
      <div className="absolute inset-0 -z-10 animated-gradient" />
      <div className="mx-auto max-w-6xl px-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Coluna esquerda: detalhes */}
        <article className="rounded-xl border border-white/10 bg-black/40 backdrop-blur p-6">
          <h1 className="text-3xl font-bold">
            {job.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/80">
            <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1">{job.contractType}</span>
            <span className="opacity-80">{job.address}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Descrição</h2>
            <p className="mt-2 text-white/80">{job.description}</p>
          </div>

          {job.requirements?.length ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Requisitos</h2>
              <ul className="mt-2 list-disc list-inside text-white/80">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>

        {/* Coluna direita: formulário */}
        <aside className="rounded-xl border border-white/10 bg-black/40 backdrop-blur p-6">
          <h2 className="text-xl font-semibold">Candidate-se</h2>
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm mb-1">Nome</label>
              <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" placeholder="Seu nome completo" />
            </div>
            <div>
              <label className="block text-sm mb-1">CPF</label>
              <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="block text-sm mb-1">E-mail</label>
              <input type="email" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">Telefone</label>
              <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className="block text-sm mb-1">Currículo (PDF)</label>
              <input type="file" accept="application/pdf" className="w-full rounded-lg border border-white/10 bg-white/5 file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white hover:file:brightness-110" />
            </div>
            <button type="button" className="btn-gradient w-full rounded-lg px-4 py-2 font-medium text-white">Enviar Candidatura</button>
          </form>
        </aside>
      </div>
    </section>
  );
}

