import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import RHLayout from "@/components/RHLayout";
import { motion } from "framer-motion";
import { Search, Filter, Users, FileText, Mail, Phone, Calendar, Download, Eye, MessageCircle, CheckCircle, XCircle, Clock } from "lucide-react";
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
};

const STATUS_COLORS: Record<string, string> = {
  "novo": "bg-blue-100 text-blue-700",
  "em_analise": "bg-yellow-100 text-yellow-700",
  "entrevista": "bg-purple-100 text-purple-700",
  "aprovado": "bg-green-100 text-green-700",
  "reprovado": "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  "novo": "Novo",
  "em_analise": "Em Análise",
  "entrevista": "Entrevista",
  "aprovado": "Aprovado",
  "reprovado": "Reprovado",
};

export default function RHCandidatos() {
  const [items, setItems] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  const load = async () => {
    setLoading(true);
    try {
      // Modo DEMO
      if (token === "demo-token-temporario") {
        const demoCandidatos: Candidato[] = [
          { id: 1, nome: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 98765-4321", vaga_id: 1, vaga_titulo: "Auxiliar de Limpeza", status: "novo", data_cadastro: "2025-01-10" },
          { id: 2, nome: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", telefone: "(21) 91234-5678", vaga_id: 1, vaga_titulo: "Auxiliar de Limpeza", status: "em_analise", data_cadastro: "2025-01-09" },
          { id: 3, nome: "Pedro Oliveira", cpf: "456.789.123-00", email: "pedro@email.com", telefone: "(81) 99876-5432", vaga_id: 2, vaga_titulo: "Supervisor de Limpeza", status: "entrevista", data_cadastro: "2025-01-08" },
          { id: 4, nome: "Ana Costa", cpf: "321.654.987-00", email: "ana@email.com", telefone: "(85) 98765-1234", vaga_id: 3, vaga_titulo: "Porteiro", status: "aprovado", data_cadastro: "2025-01-07" },
          { id: 5, nome: "Carlos Souza", cpf: "789.123.456-00", email: "carlos@email.com", telefone: "(11) 97654-3210", vaga_id: 1, vaga_titulo: "Auxiliar de Limpeza", status: "reprovado", data_cadastro: "2025-01-06" },
          { id: 6, nome: "Juliana Lima", cpf: "654.987.321-00", email: "juliana@email.com", telefone: "(21) 96543-2109", vaga_id: 5, vaga_titulo: "Copeira", status: "novo", data_cadastro: "2025-01-05" },
          { id: 7, nome: "Roberto Alves", cpf: "147.258.369-00", email: "roberto@email.com", telefone: "(31) 95432-1098", vaga_id: 2, vaga_titulo: "Supervisor de Limpeza", status: "em_analise", data_cadastro: "2025-01-04" },
        ];
        
        let filtered = demoCandidatos;
        
        if (statusFilter !== "all") {
          filtered = filtered.filter(c => c.status === statusFilter);
        }
        
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(c => 
            c.nome.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            c.vaga_titulo?.toLowerCase().includes(query)
          );
        }
        
        setItems(filtered);
        setLoading(false);
        return;
      }

      const data = await apiGet<Candidato[]>("/candidatos", token);
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar candidatos:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = () => {
    load();
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getWhatsAppLink = (telefone?: string) => {
    if (!telefone) return null;
    // Remove caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '');
    // Se não tiver o código do país (55), adiciona
    const numeroCompleto = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    return `https://wa.me/${numeroCompleto}`;
  };

  const handleStatusChange = async (candidatoId: number, newStatus: string) => {
    // Modo DEMO
    if (token === "demo-token-temporario") {
      setItems(prev => prev.map(c => 
        c.id === candidatoId ? { ...c, status: newStatus } : c
      ));
      alert(`✅ Status alterado para: ${STATUS_LABELS[newStatus]}`);
      return;
    }

    try {
      await apiPut(`/candidatos/${candidatoId}`, { status: newStatus }, token);
      await load();
      alert(`✅ Status alterado com sucesso!`);
    } catch (error) {
      alert("❌ Erro ao alterar status");
    }
  };

  return (
    <RHLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatos</h1>
          <p className="text-gray-600">Gerencie todos os candidatos das vagas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Novos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {items.filter(c => c.status === "novo").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Em Análise</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {items.filter(c => c.status === "em_analise").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Aprovados</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {items.filter(c => c.status === "aprovado").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow min-w-[280px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar por nome, email ou vaga..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 font-medium"
            >
              <option value="all">Todos os Status</option>
              <option value="novo">Novos</option>
              <option value="em_analise">Em Análise</option>
              <option value="entrevista">Entrevista</option>
              <option value="aprovado">Aprovados</option>
              <option value="reprovado">Reprovados</option>
            </select>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Filter className="w-5 h-5" />
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* Lista de Candidatos */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Nenhum candidato encontrado</p>
              <p className="text-gray-400 text-sm mt-2">Aguarde as primeiras candidaturas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((candidato, idx) => (
                <motion.div
                  key={candidato.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{candidato.nome}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[candidato.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[candidato.status] || candidato.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {candidato.email}
                        </span>
                        {candidato.telefone && (
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {candidato.telefone}
                          </span>
                        )}
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {candidato.vaga_titulo || `Vaga #${candidato.vaga_id}`}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(candidato.data_cadastro)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedCandidato(candidato)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                        title="Ver detalhes"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {/* WhatsApp */}
                      {getWhatsAppLink(candidato.telefone) && (
                        <a
                          href={getWhatsAppLink(candidato.telefone)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-all"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}
                      
                      <a
                        href={`mailto:${candidato.email}`}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                        title="Enviar email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      
                      {candidato.curriculo && (
                        <button
                          className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-all"
                          title="Baixar currículo"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}

                      {/* Ações de Status */}
                      <div className="flex items-center gap-1 ml-2 border-l pl-2">
                        {candidato.status !== "aprovado" && (
                          <button
                            onClick={() => handleStatusChange(candidato.id, "aprovado")}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-all"
                            title="Aprovar"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {candidato.status !== "reprovado" && (
                          <button
                            onClick={() => handleStatusChange(candidato.id, "reprovado")}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                            title="Reprovar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        {candidato.status === "novo" && (
                          <button
                            onClick={() => handleStatusChange(candidato.id, "em_analise")}
                            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-all"
                            title="Colocar em análise"
                          >
                            <Clock className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Link para Kanban */}
        {items.length > 0 && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Visualização Kanban</h3>
                <p className="text-gray-600">Gerencie candidatos por vaga com arrastar e soltar</p>
              </div>
              <Link
                href="/rh/candidatos/1"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all"
              >
                Abrir Kanban
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedCandidato && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCandidato(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
              <h2 className="text-2xl font-bold text-white">Detalhes do Candidato</h2>
            </div>

            {/* Content */}
            <div className="p-8 space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nome Completo</label>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedCandidato.nome}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1">{selectedCandidato.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Telefone</label>
                  <p className="text-gray-900 mt-1">{selectedCandidato.telefone || "-"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">CPF</label>
                  <p className="text-gray-900 mt-1">{selectedCandidato.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Data de Cadastro</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedCandidato.data_cadastro)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Vaga</label>
                <p className="text-gray-900 mt-1">{selectedCandidato.vaga_titulo || `Vaga #${selectedCandidato.vaga_id}`}</p>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">Status Atual</label>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${STATUS_COLORS[selectedCandidato.status]}`}>
                  {STATUS_LABELS[selectedCandidato.status]}
                </span>
              </div>

              {/* Ações de Status */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <label className="text-sm font-semibold text-gray-700 block mb-3">Alterar Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedCandidato.id, "em_analise");
                      setSelectedCandidato(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-all"
                  >
                    Em Análise
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedCandidato.id, "entrevista");
                      setSelectedCandidato(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-all"
                  >
                    Agendar Entrevista
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedCandidato.id, "aprovado");
                      setSelectedCandidato(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-all"
                  >
                    ✓ Aprovar
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedCandidato.id, "reprovado");
                      setSelectedCandidato(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all"
                  >
                    ✗ Reprovar
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-8 py-4 flex justify-between gap-3">
              <button
                onClick={() => setSelectedCandidato(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-white transition-all font-semibold text-gray-700"
              >
                Fechar
              </button>
              <div className="flex gap-2">
                {getWhatsAppLink(selectedCandidato.telefone) && (
                  <a
                    href={getWhatsAppLink(selectedCandidato.telefone)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${selectedCandidato.email}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </RHLayout>
  );
}

