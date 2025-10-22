import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { apiGet, apiPut, getApiBase } from "@/lib/api";
import { motion } from "framer-motion";
import RHLayout from "@/components/RHLayout";
import { ArrowLeft, Mail, Phone, FileText, Calendar, MessageCircle, ExternalLink, Download } from "lucide-react";
import Link from "next/link";

export type Candidato = {
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
};

const STATUSES = ["novo", "em_analise", "entrevista", "aprovado", "reprovado", "banco_talentos"] as const;
const STATUS_LABELS: Record<string, string> = {
  "novo": "Novo",
  "em_analise": "Em Análise",
  "entrevista": "Entrevista",
  "aprovado": "Aprovado",
  "reprovado": "Reprovado",
  "banco_talentos": "Banco de Talentos",
};
const STATUS_COLORS: Record<string, string> = {
  "novo": "from-blue-500 to-blue-600",
  "em_analise": "from-yellow-500 to-yellow-600",
  "entrevista": "from-purple-500 to-purple-600",
  "aprovado": "from-green-500 to-green-600",
  "reprovado": "from-red-500 to-red-600",
  "banco_talentos": "from-indigo-500 to-indigo-600",
};

export default function RHCandidatosPorVaga() {
  const router = useRouter();
  const { vagaId } = router.query as { vagaId?: string };
  const [items, setItems] = useState<Candidato[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  const load = useCallback(async () => {
    if (!vagaId) return;
    const data = await apiGet<Candidato[]>(`/candidatos/${vagaId}`, token);
    setItems(data);
  }, [vagaId, token]);

  useEffect(() => { load(); }, [load]);

  const grouped = useMemo(() => {
    const g: Record<string, Candidato[]> = {};
    for (const st of STATUSES) g[st] = [];
    for (const c of items) {
      const key = (STATUSES as readonly string[]).includes(c.status) ? c.status : "novo";
      g[key].push(c);
    }
    return g;
  }, [items]);

  const onDrop = async (candidatoId: number, newStatus: string) => {
    await apiPut(`/candidatos/${candidatoId}`, { status: newStatus }, token);
    await load();
  };

  const getWhatsAppLink = (telefone?: string) => {
    if (!telefone) return null;
    const numeroLimpo = telefone.replace(/\D/g, '');
    const numeroCompleto = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    return `https://wa.me/${numeroCompleto}`;
  };

  return (
    <RHLayout>
      <div className="space-y-6">
        {/* Header com voltar */}
        <div className="flex items-center gap-4">
          <Link
            href="/rh/candidatos"
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kanban de Candidatos</h1>
            <p className="text-gray-600">Arraste e solte para alterar o status</p>
          </div>
        </div>

        {/* Contadores */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {STATUSES.map((st) => (
              <div key={st}>
                <div className="text-3xl font-bold text-gray-900">{grouped[st].length}</div>
                <div className="text-sm text-gray-600 mt-1">{STATUS_LABELS[st]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {STATUSES.map((st) => {
            // Limita Banco de Talentos a 5 candidatos
            const candidatosExibir = st === "banco_talentos" 
              ? grouped[st].slice(0, 5) 
              : grouped[st];
            const temMais = st === "banco_talentos" && grouped[st].length > 5;
            
            return (
              <div key={st} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl bg-gradient-to-r ${STATUS_COLORS[st]} text-white font-semibold`}>
                  <span className="flex-grow">{STATUS_LABELS[st]}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{grouped[st].length}</span>
                </div>
                <div
                  className="min-h-[400px] space-y-3"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('bg-gray-100');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-gray-100');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('bg-gray-100');
                    const id = Number(e.dataTransfer.getData("text/plain"));
                    onDrop(id, st);
                  }}
                >
                  {candidatosExibir.map((c) => (
                    <motion.div 
                      key={c.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div
                        draggable
                        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                          e.dataTransfer.setData("text/plain", String(c.id));
                          e.currentTarget.classList.add('opacity-50');
                        }}
                        onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
                          e.currentTarget.classList.remove('opacity-50');
                        }}
                        className="cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="font-bold text-gray-900 mb-2">{c.nome}</div>
                        <div className="space-y-1.5 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{c.email}</span>
                          </div>
                          {c.telefone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{c.telefone}</span>
                            </div>
                          )}
                          {c.data_cadastro && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Inscrito: {new Date(c.data_cadastro).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                          {c.data_nascimento && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Nasc: {new Date(c.data_nascimento).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                          {/* Botão de Currículo */}
                          {c.curriculo ? (
                            <a 
                              href={c.curriculo.startsWith('http') ? c.curriculo : `${getApiBase()}/uploads/${c.curriculo}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center gap-1.5 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                              title="Baixar Currículo"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Currículo
                            </a>
                          ) : (
                            <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              Sem CV
                            </span>
                          )}
                          
                          {/* Botão WhatsApp */}
                          {getWhatsAppLink(c.telefone) && (
                            <a 
                              href={getWhatsAppLink(c.telefone)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all flex items-center gap-1.5 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>
                          )}
                          
                          {/* Botão Email */}
                          <a 
                            href={`mailto:${c.email}`} 
                            className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-red-700 text-white font-medium hover:shadow-md transition-all flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                            title="Enviar Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Email
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Botão "Ver Todos" para Banco de Talentos */}
                  {temMais && (
                    <Link href="/rh/banco-talentos">
                      <div className="rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 p-4 hover:bg-indigo-100 transition-all cursor-pointer group">
                        <div className="text-center">
                          <ExternalLink className="w-6 h-6 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <p className="text-sm font-semibold text-indigo-700">
                            + {grouped[st].length - 5} talentos
                          </p>
                          <p className="text-xs text-indigo-600 mt-1">
                            Ver Todos
                          </p>
                        </div>
                      </div>
                    </Link>
                  )}
                  
                  {grouped[st].length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                      {st === "banco_talentos" 
                        ? "Sem talentos salvos" 
                        : "Arraste candidatos aqui"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </RHLayout>
  );
}
