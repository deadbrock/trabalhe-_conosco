import React, { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import RHLayout from "@/components/RHLayout";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, RefreshCw, MapPin, Briefcase } from "lucide-react";

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
    <RHLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Vagas</h1>
            <p className="text-gray-600">Publique e gerencie as vagas disponíveis</p>
          </div>
          <button 
            onClick={() => { setEditing(null); setModalOpen(true); }} 
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Vaga
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow min-w-[280px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && load()}
                  placeholder="Buscar por título, endereço ou descrição..." 
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as "ativa" | "inativa" | "all")} 
              className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 font-medium"
            >
              <option value="all">Todos os Status</option>
              <option value="ativa">Ativas</option>
              <option value="inativa">Inativas</option>
            </select>
            <button 
              onClick={load} 
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all font-medium text-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </div>

        {/* Lista de Vagas */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Nenhuma vaga encontrada</p>
              <p className="text-gray-400 text-sm mt-2">Crie sua primeira vaga clicando no botão acima</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((v, idx) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{v.titulo}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          v.status === 'ativa' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {v.status === 'ativa' ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {v.tipo_contrato}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {v.endereco}
                        </span>
                      </div>
                      {v.descricao && (
                        <p className="text-gray-600 line-clamp-2">{v.descricao}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setEditing(v); setModalOpen(true); }}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => onToggle(v)}
                        className={`p-2 rounded-lg transition-all ${
                          v.status === 'ativa'
                            ? 'hover:bg-yellow-50 text-yellow-600'
                            : 'hover:bg-green-50 text-green-600'
                        }`}
                        title={v.status === 'ativa' ? 'Despublicar' : 'Publicar'}
                      >
                        {v.status === 'ativa' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => onDelete(v.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto"
            onClick={() => { setModalOpen(false); setEditing(null); }}
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 20, opacity: 0 }} 
              className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{editing ? "Editar Vaga" : "Criar Nova Vaga"}</h2>
                  <button 
                    onClick={() => { setModalOpen(false); setEditing(null); }} 
                    className="p-2 hover:bg-white/20 rounded-lg transition-all text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={onSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título da Vaga *</label>
                  <input 
                    name="titulo" 
                    defaultValue={editing?.titulo} 
                    placeholder="Ex: Auxiliar de Limpeza" 
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900"
                    required 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Contrato *</label>
                    <input 
                      name="tipo_contrato" 
                      defaultValue={editing?.tipo_contrato} 
                      placeholder="Ex: CLT" 
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Endereço *</label>
                    <input 
                      name="endereco" 
                      defaultValue={editing?.endereco} 
                      placeholder="Ex: São Paulo/SP" 
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select 
                    name="status" 
                    defaultValue={editing?.status || "ativa"} 
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 font-medium"
                  >
                    <option value="ativa">Ativa (Visível no site)</option>
                    <option value="inativa">Inativa (Oculta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                  <textarea 
                    name="descricao" 
                    defaultValue={editing?.descricao} 
                    placeholder="Descreva as principais atividades e responsabilidades..." 
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Requisitos</label>
                  <textarea 
                    name="requisitos" 
                    defaultValue={editing?.requisitos} 
                    placeholder="Liste os requisitos necessários (separados por vírgula ou linha)..." 
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Diferenciais</label>
                  <textarea 
                    name="diferenciais" 
                    defaultValue={editing?.diferenciais} 
                    placeholder="Diferenciais ou benefícios da vaga..." 
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setModalOpen(false); setEditing(null); }} 
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all font-semibold text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {editing ? "Salvar Alterações" : "Criar Vaga"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RHLayout>
  );
}
