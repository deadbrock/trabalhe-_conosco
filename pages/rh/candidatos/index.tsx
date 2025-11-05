import React, { useEffect, useState, useMemo } from "react";
import { apiGet, apiPut, getApiBase } from "@/lib/api";
import RHLayout from "@/components/RHLayout";
import { motion } from "framer-motion";
import { Search, Users, FileText, Briefcase, MapPin, ChevronRight, Clock, ArrowLeft, Mail, Phone, Download, MessageCircle, CheckCircle, XCircle, Star, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import ComentariosCandidato from "@/components/ComentariosCandidato";
import TagsCandidato from "@/components/TagsCandidato";
import AgendamentosCandidato from "@/components/AgendamentosCandidato";
import PontuacaoCandidato from "@/components/PontuacaoCandidato";
import { StatusBadge, StatusEmoji } from "@/components/StatusEmoji";
import CandidateTimeline from "@/components/CandidateTimeline";
import { NotasRapidas, AvaliacaoCandidato } from "@/components/NotasAvaliacao";
import { ActivityLogCompact } from "@/components/ActivityLog";

export type Vaga = {
  id: number;
  titulo: string;
  tipo_contrato: string;
  endereco: string;
  descricao?: string;
  status: string;
  criado_em?: string;
};

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
  score?: number;
};

type VagaComCandidatos = Vaga & {
  total_candidatos: number;
  novos: number;
  em_analise: number;
  aprovados: number;
};

export default function RHCandidatos() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCandidato, setSearchCandidato] = useState("");
  const [vagaSelecionada, setVagaSelecionada] = useState<VagaComCandidatos | null>(null);
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'detalhes' | 'comentarios' | 'tags' | 'agendamentos' | 'pontuacao' | 'notas' | 'avaliacoes' | 'atividades'>('detalhes');

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;
  const userId = typeof window !== "undefined" ? parseInt(localStorage.getItem("rh_user_id") || "1") : 1;
  const userName = typeof window !== "undefined" ? localStorage.getItem("rh_user_name") || "Usuário RH" : "Usuário RH";

  const load = async () => {
    setLoading(true);
    try {
      // Buscar vagas ativas
      const vagasData = await apiGet<Vaga[]>("/vagas?status=ativa", token);
      setVagas(vagasData);

      // Buscar todos os candidatos
      const candidatosData = await apiGet<Candidato[]>("/candidatos", token);
      setCandidatos(candidatosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setVagas([]);
      setCandidatos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agrupar candidatos por vaga e calcular estatísticas
  const vagasComCandidatos = useMemo<VagaComCandidatos[]>(() => {
    return vagas.map(vaga => {
      const candidatosDaVaga = candidatos.filter(c => c.vaga_id === vaga.id);
      return {
        ...vaga,
        total_candidatos: candidatosDaVaga.length,
        novos: candidatosDaVaga.filter(c => c.status === "novo").length,
        em_analise: candidatosDaVaga.filter(c => c.status === "em_analise").length,
        aprovados: candidatosDaVaga.filter(c => c.status === "aprovado").length,
      };
    });
  }, [vagas, candidatos]);

  // Filtrar vagas por busca
  const filteredVagas = useMemo(() => {
    if (!searchQuery.trim()) return vagasComCandidatos;
    
    const query = searchQuery.toLowerCase();
    return vagasComCandidatos.filter(vaga => 
      vaga.titulo.toLowerCase().includes(query) ||
      vaga.endereco.toLowerCase().includes(query) ||
      vaga.tipo_contrato.toLowerCase().includes(query)
    );
  }, [vagasComCandidatos, searchQuery]);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  // Estatísticas gerais
  const totalCandidatos = candidatos.length;
  const totalNovos = candidatos.filter(c => c.status === "novo").length;
  const totalEmAnalise = candidatos.filter(c => c.status === "em_analise").length;
  const totalAprovados = candidatos.filter(c => c.status === "aprovado").length;

  // Candidatos da vaga selecionada
  const candidatosDaVaga = useMemo(() => {
    if (!vagaSelecionada) return [];
    let filtered = candidatos.filter(c => c.vaga_id === vagaSelecionada.id);
    
    // Aplicar filtro de busca
    if (searchCandidato.trim()) {
      const query = searchCandidato.toLowerCase();
      filtered = filtered.filter(c => 
        c.nome.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.cpf.includes(query) ||
        c.telefone?.includes(query) ||
        c.cidade?.toLowerCase().includes(query) ||
        c.estado?.toLowerCase().includes(query) ||
        c.bairro?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [candidatos, vagaSelecionada, searchCandidato]);

  const getWhatsAppLink = (telefone?: string) => {
    if (!telefone) return null;
    const numeroLimpo = telefone.replace(/\D/g, '');
    const numeroCompleto = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    return `https://wa.me/${numeroCompleto}`;
  };

  const handleStatusChange = async (candidatoId: number, newStatus: string) => {
    try {
      await apiPut(`/candidatos/${candidatoId}`, { status: newStatus }, token);
      await load();
      setSelectedCandidato(null);
      alert(`✅ Status alterado com sucesso!`);
    } catch {
      alert("❌ Erro ao alterar status");
    }
  };

  // Se uma vaga foi selecionada, mostra os candidatos
  if (vagaSelecionada) {
    return (
      <RHLayout>
        <div className="space-y-6">
          {/* Header com botão Voltar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setVagaSelecionada(null)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vagaSelecionada.titulo}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {vagaSelecionada.tipo_contrato}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {vagaSelecionada.endereco}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {vagaSelecionada.total_candidatos} candidatos
                </span>
              </div>
            </div>
            <Link
              href={`/rh/candidatos/${vagaSelecionada.id}`}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Abrir Kanban
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{candidatosDaVaga.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    Novos <StatusEmoji status="novo" size="sm" />
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{vagaSelecionada.novos}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    Em Análise <StatusEmoji status="em_analise" size="sm" />
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{vagaSelecionada.em_analise}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                    Aprovados <StatusEmoji status="aprovado" size="sm" />
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{vagaSelecionada.aprovados}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Busca de Candidatos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={searchCandidato}
                    onChange={(e) => setSearchCandidato(e.target.value)}
                    placeholder="Buscar candidato por nome, email, telefone ou localização..."
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              {searchCandidato && (
                <button
                  onClick={() => setSearchCandidato("")}
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-white transition-all text-gray-700 font-medium"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Lista de Candidatos */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {candidatosDaVaga.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium">Nenhum candidato ainda</p>
                <p className="text-gray-400 text-sm mt-2">Aguarde as primeiras candidaturas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {candidatosDaVaga.map((candidato, idx) => (
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
                          <StatusBadge status={candidato.status} showEmoji={true} showText={true} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-2">
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
                            <Calendar className="w-4 h-4" />
                            Inscrito: {formatDate(candidato.data_cadastro)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {(candidato.cidade || candidato.estado || candidato.bairro) && (
                            <span className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-medium">
                                {candidato.bairro && `${candidato.bairro}, `}
                                {candidato.cidade && `${candidato.cidade}`}
                                {candidato.estado && ` - ${candidato.estado}`}
                              </span>
                            </span>
                          )}
                          {candidato.data_nascimento && (
                            <span className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              Nascimento: {formatDate(candidato.data_nascimento)}
                            </span>
                          )}
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
                          <a
                            href={candidato.curriculo.startsWith('http') ? candidato.curriculo : `${getApiBase()}/uploads/${candidato.curriculo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg hover:bg-purple-50 text-purple-600 transition-all"
                            title="Baixar currículo"
                          >
                            <Download className="w-5 h-5" />
                          </a>
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
                          {candidato.status !== "banco_talentos" && (
                            <button
                              onClick={() => handleStatusChange(candidato.id, "banco_talentos")}
                              className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-all"
                              title="Adicionar ao Banco de Talentos"
                            >
                              <Star className="w-5 h-5" />
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

          {/* Modal de Detalhes do Candidato */}
          {selectedCandidato && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedCandidato(null);
                setAbaAtiva('detalhes');
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-primary to-red-700 p-6">
                  <h2 className="text-2xl font-bold text-white">{selectedCandidato.nome}</h2>
                  <p className="text-white/90 text-sm mt-1">{selectedCandidato.email}</p>
                </div>

                {/* Abas */}
                <div className="bg-gray-100 px-8 py-2 flex gap-2 overflow-x-auto border-b border-gray-200">
                  <button
                    onClick={() => setAbaAtiva('detalhes')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'detalhes'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📋 Detalhes
                  </button>
                  <button
                    onClick={() => setAbaAtiva('comentarios')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'comentarios'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    💬 Comentários
                  </button>
                  <button
                    onClick={() => setAbaAtiva('tags')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'tags'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🏷️ Tags
                  </button>
                  <button
                    onClick={() => setAbaAtiva('agendamentos')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'agendamentos'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📅 Agendamentos
                  </button>
                  <button
                    onClick={() => setAbaAtiva('pontuacao')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'pontuacao'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ⭐ Pontuação
                  </button>
                  <button
                    onClick={() => setAbaAtiva('notas')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'notas'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📝 Notas
                  </button>
                  <button
                    onClick={() => setAbaAtiva('avaliacoes')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'avaliacoes'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ⭐ Avaliações
                  </button>
                  <button
                    onClick={() => setAbaAtiva('atividades')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      abaAtiva === 'atividades'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📜 Atividades
                  </button>
                </div>

                <div className="p-8 space-y-5 overflow-y-auto flex-1">
                  {/* Aba Detalhes */}
                  {abaAtiva === 'detalhes' && (
                    <>
                      {/* Timeline de Progresso */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Progresso no Processo Seletivo</h3>
                        <CandidateTimeline currentStatus={selectedCandidato.status} />
                      </div>

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

                      {selectedCandidato.data_nascimento && (
                        <div>
                          <label className="text-sm font-semibold text-gray-600">Data de Nascimento</label>
                          <p className="text-gray-900 mt-1">{formatDate(selectedCandidato.data_nascimento)}</p>
                        </div>
                      )}

                      {/* Endereço */}
                      {(selectedCandidato.cidade || selectedCandidato.estado || selectedCandidato.bairro) && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Endereço
                          </label>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            {selectedCandidato.estado && (
                              <div>
                                <span className="text-gray-600 block text-xs">Estado</span>
                                <span className="font-semibold text-gray-900">{selectedCandidato.estado}</span>
                              </div>
                            )}
                            {selectedCandidato.cidade && (
                              <div>
                                <span className="text-gray-600 block text-xs">Cidade</span>
                                <span className="font-semibold text-gray-900">{selectedCandidato.cidade}</span>
                              </div>
                            )}
                            {selectedCandidato.bairro && (
                              <div>
                                <span className="text-gray-600 block text-xs">Bairro</span>
                                <span className="font-semibold text-gray-900">{selectedCandidato.bairro}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-semibold text-gray-600 block mb-2">Status Atual</label>
                        <StatusBadge status={selectedCandidato.status} showEmoji={true} showText={true} />
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4">
                        <label className="text-sm font-semibold text-gray-700 block mb-3">Alterar Status</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleStatusChange(selectedCandidato.id, "em_analise")}
                            className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-all"
                          >
                            Em Análise
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedCandidato.id, "entrevista")}
                            className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200 transition-all"
                          >
                            Entrevista
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedCandidato.id, "aprovado")}
                            className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition-all"
                          >
                            ✓ Aprovar
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedCandidato.id, "banco_talentos")}
                            className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition-all flex items-center justify-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Banco de Talentos
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedCandidato.id, "reprovado")}
                            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all col-span-2"
                          >
                            ✗ Reprovar
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Aba Comentários */}
                  {abaAtiva === 'comentarios' && (
                    <ComentariosCandidato
                      candidatoId={selectedCandidato.id}
                      usuarioId={userId}
                      usuarioNome={userName}
                    />
                  )}

                  {/* Aba Tags */}
                  {abaAtiva === 'tags' && (
                    <TagsCandidato candidatoId={selectedCandidato.id} />
                  )}

                  {/* Aba Agendamentos */}
                  {abaAtiva === 'agendamentos' && (
                    <AgendamentosCandidato
                      candidatoId={selectedCandidato.id}
                      vagaId={selectedCandidato.vaga_id}
                      usuarioId={userId}
                    />
                  )}

                  {/* Aba Pontuação */}
                  {abaAtiva === 'pontuacao' && (
                    <PontuacaoCandidato
                      candidatoId={selectedCandidato.id}
                      scoreAtual={selectedCandidato.score || 0}
                    />
                  )}

                  {/* Aba Notas */}
                  {abaAtiva === 'notas' && (
                    <NotasRapidas
                      candidatoId={selectedCandidato.id}
                      usuarioId={userId}
                    />
                  )}

                  {/* Aba Avaliações */}
                  {abaAtiva === 'avaliacoes' && (
                    <AvaliacaoCandidato
                      candidatoId={selectedCandidato.id}
                    />
                  )}

                  {/* Aba Atividades */}
                  {abaAtiva === 'atividades' && (
                    <ActivityLogCompact candidatoId={selectedCandidato.id} />
                  )}
                </div>

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
        </div>
      </RHLayout>
    );
  }

  // Visualização principal: Grid de vagas
  return (
    <RHLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidatos por Vaga</h1>
          <p className="text-gray-600">Selecione uma vaga para ver os candidatos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift smooth-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total de Candidatos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalCandidatos}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift smooth-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Novos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalNovos}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift smooth-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Em Análise</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalEmAnalise}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover-lift smooth-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Aprovados</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{totalAprovados}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar vagas por título, endereço ou tipo de contrato..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-white transition-all text-gray-700 font-medium"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Grid de Vagas com Candidatos */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredVagas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              {vagas.length === 0 ? "Nenhuma vaga ativa encontrada" : "Nenhuma vaga corresponde à busca"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {vagas.length === 0 ? "Publique vagas para começar a receber candidaturas" : "Tente ajustar sua busca"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVagas.map((vaga, idx) => (
              <motion.div
                key={vaga.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setVagaSelecionada(vaga)}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer group hover-lift hover-glow"
              >
                  {/* Badge de Candidatos */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-700 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Total de Candidatos</p>
                        <p className="text-2xl font-bold text-gray-900">{vaga.total_candidatos}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Título da Vaga */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {vaga.titulo}
                  </h3>

                  {/* Informações */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span className="font-medium">{vaga.tipo_contrato}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="line-clamp-1">{vaga.endereco}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Publicada em {formatDate(vaga.criado_em)}</span>
                    </div>
                  </div>

                  {/* Estatísticas de Candidatos */}
                  <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{vaga.novos}</p>
                      <p className="text-xs text-gray-500">Novos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{vaga.em_analise}</p>
                      <p className="text-xs text-gray-500">Em Análise</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{vaga.aprovados}</p>
                      <p className="text-xs text-gray-500">Aprovados</p>
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </RHLayout>
  );
}