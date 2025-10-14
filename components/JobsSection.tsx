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
    <section id="oportunidades" className="relative py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4">
            <span className="text-primary font-semibold">Junte-se a nós</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
              Vagas Disponíveis
            </span>
          </h2>
          <p className="text-gray-600 text-lg">Encontre a oportunidade ideal para você.</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4" />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Carregando vagas...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma vaga disponível no momento</h3>
            <p className="text-gray-600">Novas oportunidades serão publicadas em breve. Volte mais tarde!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
            <article
              key={job.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Badge de destaque */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-xs font-bold">
                Nova
              </div>

              {/* Conteúdo */}
              <div className="relative z-10 flex flex-col h-full min-h-[200px]">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 pr-12 leading-tight">
                    {job.titulo}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-sm font-medium">
                        {job.tipo_contrato}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">{job.endereco}</span>
                    </div>
                  </div>
                </div>

                {/* CTA sempre visível no rodapé */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/vagas/${job.id}`}
                    className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
                  >
                    Ver Detalhes
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </article>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}

