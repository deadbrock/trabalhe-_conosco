import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { apiGet, apiPut } from "@/lib/api";
import { motion } from "framer-motion";
import RHLayout from "@/components/RHLayout";
import { ArrowLeft, Mail, Phone, FileText, Calendar, MessageCircle, ExternalLink } from "lucide-react";
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
    
    // Modo DEMO
    if (token === "demo-token-temporario") {
      const demoCandidatos: Candidato[] = [
        { id: 1, nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 98765-4321", vaga_id: Number(vagaId), vaga_titulo: "Auxiliar de Limpeza", status: "novo", data_cadastro: "2025-01-10", estado: "SP", cidade: "São Paulo", bairro: "Centro" },
        { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", telefone: "(21) 91234-5678", vaga_id: Number(vagaId), vaga_titulo: "Auxiliar de Limpeza", status: "novo", data_cadastro: "2025-01-09", estado: "RJ", cidade: "Rio de Janeiro", bairro: "Copacabana" },
        { id: 3, nome: "Pedro Oliveira", cpf: "456.789.123-00", email: "pedro@email.com", telefone: "(81) 99876-5432", vaga_id: Number(vagaId), vaga_titulo: "Auxiliar de Limpeza", status: "em_analise", data_cadastro: "2025-01-08", estado: "PE", cidade: "Recife", bairro: "Boa Viagem" },
        { id: 4, nome: "Ana Costa", cpf: "321.654.987-00", email: "ana@email.com", telefone: "(85) 98765-1234", vaga_id: Number(vagaId), vaga_titulo: "Auxiliar de Limpeza", status: "entrevista", data_cadastro: "2025-01-07", estado: "CE", cidade: "Fortaleza", bairro: "Meireles" },
        { id: 5, nome: "Carlos Souza", cpf: "789.123.456-00", email: "carlos@email.com", telefone: "(11) 97654-3210", vaga_id: Number(vagaId), vaga_titulo: "Auxiliar de Limpeza", status: "aprovado", data_cadastro: "2025-01-06", estado: "SP", cidade: "São Paulo", bairro: "Vila Mariana" },
        { id: 6, nome: "Fernanda Costa", cpf: "258.369.147-00", email: "fernanda@email.com", telefone: "(11) 94321-0987", vaga_id: Number(vagaId), vaga_titulo: "Auxiliar de Limpeza", status: "banco_talentos", data_cadastro: "2024-12-20", estado: "SP", cidade: "São Paulo", bairro: "Mooca" },
      ];
      setItems(demoCandidatos);
      return;
    }

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
    // Modo DEMO
    if (token === "demo-token-temporario") {
      setItems(prev => prev.map(c => c.id === candidatoId ? { ...c, status: newStatus } : c));
      return;
    }

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
                              <span>{new Date(c.data_cadastro).toLocaleDateString('pt-BR')}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                          {c.curriculo ? (
                            <a 
                              href={`http://localhost:3333/uploads/${c.curriculo}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText className="w-3 h-3" />
                              Ver CV
                            </a>
                          ) : <span className="text-xs text-gray-400">Sem CV</span>}
                          <div className="flex gap-1">
                            {getWhatsAppLink(c.telefone) && (
                              <a 
                                href={getWhatsAppLink(c.telefone)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-1.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            )}
                            <a 
                              href={`mailto:${c.email}`} 
                              className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-red-700 text-white font-medium hover:shadow-md transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Email
                            </a>
                          </div>
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
