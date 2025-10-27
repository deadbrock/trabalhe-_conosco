import React, { useEffect, useState, useMemo } from "react";
import { apiGet } from "@/lib/api";
import RHLayout from "@/components/RHLayout";
import { motion } from "framer-motion";
import { Search, Users, FileText, Briefcase, MapPin, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

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

  const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;

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
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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
              <Link key={vaga.id} href={`/rh/candidatos/${vaga.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </RHLayout>
  );
}