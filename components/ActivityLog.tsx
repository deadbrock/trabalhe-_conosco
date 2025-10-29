import React, { useState, useEffect, useCallback } from 'react';
import { History, Filter, User, Calendar, Tag, FileText, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { motion } from 'framer-motion';

type Atividade = {
  id: number;
  usuario_id?: number;
  usuario_nome: string;
  candidato_id?: number;
  candidato_nome?: string;
  vaga_id?: number;
  vaga_titulo?: string;
  tipo: string;
  descricao: string;
  dados_extras?: Record<string, unknown>;
  criado_em: string;
};

interface ActivityLogProps {
  candidatoId?: number;
  vagaId?: number;
  limite?: number;
  showFilters?: boolean;
}

export default function ActivityLog({ 
  candidatoId, 
  vagaId, 
  limite = 50,
  showFilters = true 
}: ActivityLogProps) {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoFiltro, setTipoFiltro] = useState<string>('all');

  const carregarAtividades = useCallback(async () => {
    try {
      setLoading(true);
      
      // Construir query params
      const params = new URLSearchParams();
      params.append('limit', limite.toString());
      if (candidatoId) params.append('candidato_id', candidatoId.toString());
      if (vagaId) params.append('vaga_id', vagaId.toString());
      if (tipoFiltro !== 'all') params.append('tipo', tipoFiltro);

      const data = await apiGet<Atividade[]>(`/atividades?${params.toString()}`);
      setAtividades(data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
  }, [candidatoId, vagaId, tipoFiltro, limite]);

  useEffect(() => {
    carregarAtividades();
  }, [carregarAtividades]);

  const getTipoIcone = (tipo: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      candidato_criado: User,
      status_alterado: ArrowRight,
      comentario_adicionado: MessageCircle,
      tag_adicionada: Tag,
      tag_removida: Tag,
      agendamento_criado: Calendar,
      agendamento_modificado: Calendar,
      nota_adicionada: FileText,
      avaliacao_adicionada: Star,
      curriculo_baixado: FileText,
      email_enviado: MessageCircle,
    };
    return icons[tipo] || History;
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      candidato_criado: 'bg-blue-100 text-blue-600',
      status_alterado: 'bg-yellow-100 text-yellow-600',
      comentario_adicionado: 'bg-purple-100 text-purple-600',
      tag_adicionada: 'bg-pink-100 text-pink-600',
      tag_removida: 'bg-gray-100 text-gray-600',
      agendamento_criado: 'bg-green-100 text-green-600',
      agendamento_modificado: 'bg-orange-100 text-orange-600',
      nota_adicionada: 'bg-indigo-100 text-indigo-600',
      avaliacao_adicionada: 'bg-yellow-100 text-yellow-600',
      curriculo_baixado: 'bg-teal-100 text-teal-600',
      email_enviado: 'bg-blue-100 text-blue-600',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-600';
  };

  const formatarData = (data: string) => {
    const d = new Date(data);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const dataStr = d.toLocaleDateString('pt-BR');
    const hojeStr = hoje.toLocaleDateString('pt-BR');
    const ontemStr = ontem.toLocaleDateString('pt-BR');

    const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (dataStr === hojeStr) return `Hoje às ${hora}`;
    if (dataStr === ontemStr) return `Ontem às ${hora}`;
    return `${dataStr} às ${hora}`;
  };

  const tiposFiltro = [
    { value: 'all', label: 'Todas' },
    { value: 'status_alterado', label: 'Status' },
    { value: 'comentario_adicionado', label: 'Comentários' },
    { value: 'tag_adicionada', label: 'Tags' },
    { value: 'agendamento_criado', label: 'Agendamentos' },
    { value: 'avaliacao_adicionada', label: 'Avaliações' },
  ];

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 p-4 rounded-lg border border-gray-200 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com Filtros */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          {tiposFiltro.map((tipo) => (
            <button
              key={tipo.value}
              onClick={() => setTipoFiltro(tipo.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                tipoFiltro === tipo.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tipo.label}
            </button>
          ))}
        </div>
      )}

      {/* Timeline de Atividades */}
      {atividades.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma atividade registrada</p>
        </div>
      ) : (
        <div className="relative">
          {/* Linha vertical da timeline */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {atividades.map((atividade, index) => {
              const IconeComponent = getTipoIcone(atividade.tipo);
              
              return (
                <motion.div
                  key={atividade.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-14"
                >
                  {/* Ícone da atividade */}
                  <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${getTipoColor(atividade.tipo)} shadow-md z-10`}>
                    <IconeComponent className="w-5 h-5" />
                  </div>

                  {/* Card da atividade */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-gray-900 flex-1">
                        {atividade.descricao}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatarData(atividade.criado_em)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {atividade.usuario_nome}
                      </span>

                      {atividade.candidato_nome && (
                        <span className="flex items-center gap-1">
                          👤 {atividade.candidato_nome}
                        </span>
                      )}

                      {atividade.vaga_titulo && (
                        <span className="flex items-center gap-1">
                          💼 {atividade.vaga_titulo}
                        </span>
                      )}
                    </div>

                    {/* Dados extras (se houver) */}
                    {atividade.dados_extras && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(atividade.dados_extras, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer com contagem */}
      {atividades.length > 0 && (
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {atividades.length} atividade{atividades.length !== 1 ? 's' : ''} registrada{atividades.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

// Componente compacto para exibição em modal
export function ActivityLogCompact({ candidatoId }: { candidatoId: number }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-primary" />
        Histórico de Atividades
      </h3>
      <ActivityLog 
        candidatoId={candidatoId} 
        limite={10} 
        showFilters={false}
      />
    </div>
  );
}

