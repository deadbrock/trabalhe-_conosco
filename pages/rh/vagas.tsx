import React, { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export type Vaga = {
  id: number;
  titulo: string;
  tipo_contrato: string;
  endereco: string;
  descricao?: string;
  requisitos?: string;
  diferenciais?: string;
  status: string;
  criado_em?: string;
};

export default function RHVagas() {
  const [items, setItems] = useState<Vaga[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ativa" | "inativa" | "all">("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vaga | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  const load = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("status", statusFilter);
      if (q.trim()) qs.set("q", q.trim());
      const data = await apiGet<Vaga[]>(`/vagas?${qs.toString()}`, token);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Partial<Vaga> = {
      titulo: String(formData.get("titulo") || ""),
      tipo_contrato: String(formData.get("tipo_contrato") || ""),
      endereco: String(formData.get("endereco") || ""),
      descricao: String(formData.get("descricao") || ""),
      requisitos: String(formData.get("requisitos") || ""),
      diferenciais: String(formData.get("diferenciais") || ""),
      status: String(formData.get("status") || "ativa"),
    };
    if (editing) {
      await apiPut(`/vagas/${editing.id}`, payload, token);
    } else {
      await apiPost("/vagas", payload, token);
    }
    setModalOpen(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Excluir esta vaga?")) return;
    await apiDelete(`/vagas/${id}`, token);
    await load();
  };

  const onToggle = async (vaga: Vaga) => {
    const newStatus = vaga.status === "ativa" ? "inativa" : "ativa";
    await apiPut(`/vagas/${vaga.id}`, { status: newStatus }, token);
    await load();
  };

  const filtered = useMemo(() => items, [items]);

  return (
    <section className="py-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título ou descrição" className="min-w-[260px] rounded-lg border border-white/15 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60">
          <option value="all">Todos</option>
          <option value="ativa">Ativas</option>
          <option value="inativa">Inativas</option>
        </select>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-gradient rounded-lg px-4 py-2 font-medium text-white">Nova Vaga</button>
        <button onClick={load} className="rounded-lg px-4 py-2 font-medium text-white bg-white/10 border border-white/15">{loading ? "Atualizando..." : "Atualizar"}</button>
      </div>

      <div className="overflow-auto rounded-2xl border border-white/15 bg-white/5">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Contrato</th>
              <th className="text-left p-3">Endereço</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-t border-white/10">
                <td className="p-3 font-semibold">{v.titulo}</td>
                <td className="p-3">{v.tipo_contrato}</td>
                <td className="p-3">{v.endereco}</td>
                <td className="p-3">{v.status}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => { setEditing(v); setModalOpen(true); }} className="rounded-lg px-3 py-1.5 bg-white text-[#0a0a0a] font-medium hover:bg-primary hover:text-white transition">Editar</button>
                    <button onClick={() => onToggle(v)} className="rounded-lg px-3 py-1.5 font-medium btn-gradient">{v.status === "ativa" ? "Despublicar" : "Publicar"}</button>
                    <button onClick={() => onDelete(v.id)} className="rounded-lg px-3 py-1.5 bg-white/10 border border-white/15">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/70">Nenhuma vaga encontrada.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-2xl rounded-2xl border border-white/15 bg-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{editing ? "Editar Vaga" : "Nova Vaga"}</h2>
                <button onClick={() => { setModalOpen(false); setEditing(null); }} className="rounded-lg px-3 py-1 bg-white/10 border border-white/15">Fechar</button>
              </div>
              <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                <input name="titulo" defaultValue={editing?.titulo} placeholder="Título" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2" required />
                <input name="tipo_contrato" defaultValue={editing?.tipo_contrato} placeholder="Tipo de contrato" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2" required />
                <input name="endereco" defaultValue={editing?.endereco} placeholder="Endereço" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2" required />
                <select name="status" defaultValue={editing?.status || "ativa"} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
                <textarea name="descricao" defaultValue={editing?.descricao} placeholder="Descrição" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2 min-h-[90px]" />
                <textarea name="requisitos" defaultValue={editing?.requisitos} placeholder="Requisitos" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2 min-h-[90px]" />
                <textarea name="diferenciais" defaultValue={editing?.diferenciais} placeholder="Diferenciais" className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 sm:col-span-2 min-h-[90px]" />
                <div className="sm:col-span-2 flex justify-end gap-2">
                  <button type="button" onClick={() => { setModalOpen(false); setEditing(null); }} className="rounded-lg px-4 py-2 bg-white/10 border border-white/15">Cancelar</button>
                  <button className="btn-gradient rounded-lg px-4 py-2 text-white font-medium">Salvar</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
