import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Job, getActiveJobs } from "@/lib/jobs";
import { Briefcase } from "lucide-react";

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const activeJobs = await getActiveJobs();
      setJobs(activeJobs);
      setLoading(false);
    }
    loadJobs();
  }, []);

  return (
    <section id="oportunidades" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="at-card mb-10">
          <div className="at-card-header">
            <div className="text-sm font-medium text-slate-500">Oportunidades</div>
            <h2 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Vagas disponíveis
            </h2>
            <p className="mt-2 text-slate-600">
              Encontre a oportunidade ideal para você.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="at-card">
            <div className="at-card-body flex items-center justify-center gap-3 text-slate-600">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#354A80] border-t-transparent" />
              Carregando vagas...
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="at-card">
            <div className="at-card-body text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-slate-900">Nenhuma vaga disponível no momento</h3>
              <p className="mt-2 text-slate-600">Novas oportunidades serão publicadas em breve.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <article key={job.id} className="at-card">
                <div className="at-card-body">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                      {job.titulo}
                    </h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Nova
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div>
                      <span className="font-medium text-slate-700">Contrato:</span> {job.tipo_contrato}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Local:</span> {job.endereco}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/vagas/${job.id}`}
                      className="at-btn at-btn-primary inline-flex w-full items-center justify-center"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
