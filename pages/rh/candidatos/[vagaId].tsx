import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { apiGet, apiPut } from "@/lib/api";
import { motion } from "framer-motion";

export type Candidato = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  curriculo?: string | null;
  vaga_id: number;
  status: string;
  data_cadastro?: string;
};

const STATUSES = ["Recebido", "Em análise", "Entrevista", "Aprovado", "Reprovado"] as const;

export default function RHCandidatosPorVaga() {
  const router = useRouter();
  const { vagaId } = router.query as { vagaId?: string };
  const [items, setItems] = useState<Candidato[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  const load = async () => {
    if (!vagaId) return;
    const data = await apiGet<Candidato[]>(`/candidatos/${vagaId}`, token);
    setItems(data);
  };

  useEffect(() => { load(); }, [vagaId]);

  const grouped = useMemo(() => {
    const g: Record<string, Candidato[]> = {};
    for (const st of STATUSES) g[st] = [];
    for (const c of items) {
      const key = (STATUSES as readonly string[]).includes(c.status) ? c.status : "Recebido";
      g[key].push(c);
    }
    return g;
  }, [items]);

  const onDrop = async (candidatoId: number, newStatus: string) => {
    await apiPut(`/candidatos/${candidatoId}`, { status: newStatus }, token);
    await load();
  };

  return (
    <section className="py-8 space-y-8">
      <div className="rounded-2xl border border-white/15 bg-white/5 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">E-mail</th>
              <th className="text-left p-3">Telefone</th>
              <th className="text-left p-3">Currículo</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="p-3 font-semibold">{c.nome}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.telefone || "-"}</td>
                <td className="p-3">
                  {c.curriculo ? (
                    <a href={`http://localhost:3333/uploads/${c.curriculo}`} target="_blank" rel="noreferrer" className="underline">Ver PDF</a>
                  ) : (
                    <span className="opacity-70">Sem arquivo</span>
                  )}
                </td>
                <td className="p-3">{c.status}</td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/70">Nenhum candidato encontrado.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {STATUSES.map((st) => (
          <div key={st} className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3">
            <h3 className="text-sm font-semibold mb-2">{st}</h3>
            <div
              className="min-h-[200px] space-y-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const id = Number(e.dataTransfer.getData("text/plain"));
                onDrop(id, st);
              }}
            >
              {grouped[st].map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", String(c.id))}
                  className="cursor-grab active:cursor-grabbing rounded-xl border border-white/15 bg-white/20 p-3"
                >
                  <div className="font-medium">{c.nome}</div>
                  <div className="text-xs text-white/70">{c.email}</div>
                  <div className="mt-2 flex justify-between items-center">
                    {c.curriculo ? (
                      <a href={`http://localhost:3333/uploads/${c.curriculo}`} target="_blank" rel="noreferrer" className="underline text-xs">Ver currículo</a>
                    ) : <span />}
                    <a href={`mailto:${c.email}`} className="text-xs btn-gradient rounded px-2 py-1 text-white">E-mail</a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
