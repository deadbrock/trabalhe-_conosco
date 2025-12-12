import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/api";
import RHLayout from "@/components/RHLayout";
import { motion } from "framer-motion";
import { Star, Search, Filter, Mail, Phone, Calendar, Eye, MessageCircle, MapPin, Briefcase, CheckCircle, ArrowRight } from "lucide-react";

export type Talento = {
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

export default function BancoTalentos() {
  const [items, setItems] = useState<Talento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTalento, setSelectedTalento] = useState<Talento | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Talento[]>("/candidatos?status=banco_talentos", token);
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar banco de talentos:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    load();
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  // Filtrar talentos pela busca
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    return items.filter(talento => 
      talento.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talento.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talento.cpf.includes(searchQuery) ||
      talento.vaga_titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talento.cidade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talento.estado?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const getWhatsAppLink = (telefone?: string) => {
    if (!telefone) return null;
    const numeroLimpo = telefone.replace(/\D/g, '');
    const numeroCompleto = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    return `https://wa.me/${numeroCompleto}`;
  };

  const handleMoveToVaga = async (talentoId: number, newStatus: string) => {
    try {
      await apiPut(`/candidatos/${talentoId}`, { status: newStatus }, token);
      await load();
      alert(` Talento ativado com sucesso!`);
    } catch {
      alert(" Erro ao mover talento");
    }
  };

  return (
    <RHLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              Banco de Talentos
            </h1>
            <p className="text-gray-600 mt-2">Candidatos com potencial para futuras oportunidades</p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total de Talentos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Adicionados Este Mês</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {items.filter(t => {
                    if (!t.data_cadastro) return false;
                    const date = new Date(t.data_cadastro);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Disponíveis</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{items.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-grow min-w-[280px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar por nome, email, vaga ou localização..."
                  className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Filter className="w-5 h-5" />
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* Lista de Talentos */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                {items.length === 0 ? "Nenhum talento no banco" : "Nenhum talento encontrado"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {items.length === 0 ? "Adicione candidatos com potencial para futuras vagas" : "Tente ajustar sua busca"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((talento, idx) => (
                <motion.div
                  key={talento.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{talento.nome}</h3>
                          <p className="text-sm text-gray-600">Vaga anterior: {talento.vaga_titulo || "Não informada"}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {talento.email}
                        </span>
                        {talento.telefone && (
                          <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {talento.telefone}
                          </span>
                        )}
                        {(talento.cidade || talento.bairro) && (
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                              {talento.bairro && `${talento.bairro}, `}
                              {talento.cidade && `${talento.cidade}`}
                              {talento.estado && ` - ${talento.estado}`}
                            </span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Adicionado em: {formatDate(talento.data_cadastro)}
                        </span>
                        {talento.data_nascimento && (
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Nascimento: {formatDate(talento.data_nascimento)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedTalento(talento)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                        title="Ver detalhes"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {getWhatsAppLink(talento.telefone) && (
                        <a
                          href={getWhatsAppLink(talento.telefone)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-all"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                      )}
                      
                      <a
                        href={`mailto:${talento.email}`}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                        title="Enviar email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>

                      {/* Ações */}
                      <div className="flex items-center gap-1 ml-2 border-l pl-2">
                        <button
                          onClick={() => handleMoveToVaga(talento.id, "novo")}
                          className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-all"
                          title="Mover para Nova Vaga"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedTalento && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTalento(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-white" fill="currentColor" />
                <h2 className="text-2xl font-bold text-white">Talento no Banco</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nome Completo</label>
                <p className="text-lg font-bold text-gray-900 mt-1">{selectedTalento.nome}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1">{selectedTalento.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Telefone</label>
                  <p className="text-gray-900 mt-1">{selectedTalento.telefone || "-"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">CPF</label>
                  <p className="text-gray-900 mt-1">{selectedTalento.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Data de Cadastro</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedTalento.data_cadastro)}</p>
                </div>
              </div>
              
              {selectedTalento.data_nascimento && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Data de Nascimento</label>
                  <p className="text-gray-900 mt-1">{formatDate(selectedTalento.data_nascimento)}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-semibold text-gray-600">Vaga Anterior</label>
                <p className="text-gray-900 mt-1">{selectedTalento.vaga_titulo || "Não informada"}</p>
              </div>
              
              {(selectedTalento.cidade || selectedTalento.bairro || selectedTalento.estado) && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Localização
                  </label>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {selectedTalento.estado && (
                      <div>
                        <span className="text-gray-600 block text-xs">Estado</span>
                        <span className="font-semibold text-gray-900">{selectedTalento.estado}</span>
                      </div>
                    )}
                    {selectedTalento.cidade && (
                      <div>
                        <span className="text-gray-600 block text-xs">Cidade</span>
                        <span className="font-semibold text-gray-900">{selectedTalento.cidade}</span>
                      </div>
                    )}
                    {selectedTalento.bairro && (
                      <div>
                        <span className="text-gray-600 block text-xs">Bairro</span>
                        <span className="font-semibold text-gray-900">{selectedTalento.bairro}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <label className="text-sm font-semibold text-gray-700 block mb-3">Ações</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      handleMoveToVaga(selectedTalento.id, "novo");
                      setSelectedTalento(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Nova Vaga
                  </button>
                  <button
                    onClick={() => {
                      handleMoveToVaga(selectedTalento.id, "em_analise");
                      setSelectedTalento(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Em Análise
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-8 py-4 flex justify-between gap-3">
              <button
                onClick={() => setSelectedTalento(null)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:bg-white transition-all font-semibold text-gray-700"
              >
                Fechar
              </button>
              <div className="flex gap-2">
                {getWhatsAppLink(selectedTalento.telefone) && (
                  <a
                    href={getWhatsAppLink(selectedTalento.telefone)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${selectedTalento.email}`}
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

