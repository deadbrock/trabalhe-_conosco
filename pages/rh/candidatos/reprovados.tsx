import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { apiGet, getApiBase } from "@/lib/api";
import RHLayout from "@/components/RHLayout";
import { motion } from "framer-motion";
import {
  UserX,
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Eye,
  MessageCircle,
  MapPin,
  Briefcase,
  Download,
  AlertTriangle,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export type ReprovadoRow = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  curriculo?: string | null;
  vaga_id: number;
  vaga_titulo?: string;
  status: string;
  data_cadastro?: string;
  data_nascimento?: string;
  estado?: string;
  cidade?: string;
  bairro?: string;
  motivo_reprovacao?: string | null;
  data_reprovacao?: string | null;
};

export default function CandidatosReprovados() {
  const [items, setItems] = useState<ReprovadoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<ReprovadoRow | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet<ReprovadoRow[]>("/candidatos?status=reprovado", token);
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar reprovados:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bloqueia scroll do body quando o modal de detalhes está aberto
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const TZ = "America/Sao_Paulo";

  const formatDate = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("pt-BR", { timeZone: TZ });
  };

  const formatDateTime = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-BR", {
      timeZone: TZ,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " (horário de Brasília)";
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.cpf.includes(q) ||
        (c.vaga_titulo && c.vaga_titulo.toLowerCase().includes(q)) ||
        (c.motivo_reprovacao && c.motivo_reprovacao.toLowerCase().includes(q)) ||
        (c.cidade && c.cidade.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  const getWhatsAppLink = (telefone?: string) => {
    if (!telefone) return null;
    const n = telefone.replace(/\D/g, "");
    const full = n.startsWith("55") ? n : `55${n}`;
    return `https://wa.me/${full}`;
  };

  return (
    <RHLayout>
      <div className="space-y-10">
        <SectionTitle
          title="Reprovados"
          subtitle="Candidatos reprovados no processo seletivo, com registro do motivo"
          icon={<UserX className="h-5 w-5" />}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total reprovados</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Com motivo registrado</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {items.filter((c) => c.motivo_reprovacao && c.motivo_reprovacao.trim()).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Acesso rápido</p>
                <Link
                  href="/rh/candidatos"
                  className="text-sm font-semibold text-primary hover:underline mt-2 inline-block"
                >
                  Voltar a candidatos por vaga
                </Link>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Busca</CardTitle>
            <CardDescription>Nome, e-mail, CPF, vaga, cidade ou trecho do motivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="Filtrar na lista…"
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Button onClick={load} disabled={loading} variant="outline" tone="primary">
                <Filter className="h-4 w-4" />
                {loading ? "Atualizando…" : "Atualizar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                {items.length === 0 ? "Nenhum candidato reprovado" : "Nenhum resultado na busca"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {items.length === 0
                  ? "Reprovações feitas no Kanban ou na lista passam a aparecer aqui."
                  : "Tente outro termo de busca."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-6 hover:bg-red-50/40 transition-all"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserX className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{c.nome}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
                            <Briefcase className="w-3.5 h-3.5" />
                            {c.vaga_titulo || `Vaga #${c.vaga_id}`}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-900 mb-3">
                        <span className="font-semibold text-red-800">Motivo da reprovação</span>
                        <p className="mt-1 text-red-900/90 whitespace-pre-wrap">
                          {c.motivo_reprovacao?.trim() ? c.motivo_reprovacao : "Não registrado (reprovação anterior à atualização do sistema)."}
                        </p>
                        <p className="text-xs text-red-700/80 mt-2">
                          Reprovado em: {formatDateTime(c.data_reprovacao)}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-2 min-w-0">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                        {c.telefone && (
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {c.telefone}
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Inscrição: {formatDate(c.data_cadastro)}
                        </span>
                        {(c.cidade || c.estado) && (
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            {[c.cidade, c.estado].filter(Boolean).join(" — ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-stretch sm:w-auto">
                      <Button type="button" variant="outline" tone="primary" onClick={() => setSelected(c)} className="w-full sm:w-auto">
                        <Eye className="h-4 w-4" />
                        Ver detalhes
                      </Button>
                      <Link
                        href={`/rh/candidatos/${c.vaga_id}`}
                        className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 hover:bg-gray-100"
                      >
                        <Briefcase className="h-4 w-4" />
                        Kanban da vaga
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && typeof document !== "undefined" && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          style={{ touchAction: "none" }}
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">{selected.nome}</h2>
              <p className="text-white/90 text-sm mt-1">{selected.email}</p>
            </div>

            <div className="p-8 space-y-5 overflow-y-auto flex-1">
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <h3 className="text-sm font-bold text-red-900 uppercase tracking-wide">Motivo da reprovação</h3>
                <p className="mt-2 text-red-950 whitespace-pre-wrap">
                  {selected.motivo_reprovacao?.trim()
                    ? selected.motivo_reprovacao
                    : "Não registrado."}
                </p>
                <p className="text-xs text-red-800/80 mt-3">
                  Data da reprovação: {formatDateTime(selected.data_reprovacao)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Vaga</label>
                  <p className="text-gray-900 mt-1">{selected.vaga_titulo || `#${selected.vaga_id}`}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">CPF</label>
                  <p className="text-gray-900 mt-1">{selected.cpf}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Telefone</label>
                  <p className="text-gray-900 mt-1">{selected.telefone || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Data de cadastro</label>
                  <p className="text-gray-900 mt-1">{formatDate(selected.data_cadastro)}</p>
                </div>
              </div>

              {selected.data_nascimento && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nascimento</label>
                  <p className="text-gray-900 mt-1">{formatDate(selected.data_nascimento)}</p>
                </div>
              )}

              {(selected.cidade || selected.bairro || selected.estado) && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Localização
                  </label>
                  <p className="text-gray-900">
                    {[selected.bairro, selected.cidade, selected.estado].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}

              {selected.curriculo && (
                <a
                  href={
                    selected.curriculo.startsWith("http")
                      ? selected.curriculo
                      : `${getApiBase()}/uploads/${selected.curriculo}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                  <Download className="w-4 h-4" />
                  Abrir currículo
                </a>
              )}
            </div>

            <div className="bg-gray-50 px-8 py-4 flex flex-wrap justify-between gap-3 flex-shrink-0 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-white transition-all font-semibold text-gray-700"
              >
                Fechar
              </button>
              <div className="flex flex-wrap gap-2">
                {getWhatsAppLink(selected.telefone) && (
                  <a
                    href={getWhatsAppLink(selected.telefone)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all"
                >
                  <Mail className="w-5 h-5" />
                  E-mail
                </a>
                <Link
                  href={`/rh/candidatos/${selected.vaga_id}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 font-semibold text-gray-800 hover:bg-white"
                >
                  <Briefcase className="w-5 h-5" />
                  Kanban
                </Link>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </RHLayout>
  );
}
