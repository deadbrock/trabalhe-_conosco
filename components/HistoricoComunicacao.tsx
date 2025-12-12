import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, CheckCircle, XCircle, Clock, Eye, Filter } from 'lucide-react';
import { apiGet } from '../lib/api';

interface Comunicacao {
  id: number;
  candidato_id: number;
  candidato_nome: string;
  candidato_email: string;
  vaga_id?: number;
  vaga_titulo?: string;
  usuario_nome?: string;
  template_nome?: string;
  tipo: 'email' | 'whatsapp';
  destinatario: string;
  assunto?: string;
  conteudo: string;
  status: 'pendente' | 'enviado' | 'entregue' | 'lido' | 'falhou';
  erro?: string;
  enviado_por: 'automatico' | 'manual';
  enviado_em: string;
}

interface HistoricoComunicacaoProps {
  candidatoId?: number;
  vagaId?: number;
  limite?: number;
}

export default function HistoricoComunicacao({ candidatoId, vagaId, limite = 50 }: HistoricoComunicacaoProps) {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<'all' | 'email' | 'whatsapp'>('all');
  const [filtroStatus, setFiltroStatus] = useState<'all' | 'enviado' | 'lido' | 'falhou'>('all');
  const [comunicacaoSelecionada, setComunicacaoSelecionada] = useState<Comunicacao | null>(null);
  const [total, setTotal] = useState(0);

  const carregarHistorico = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (candidatoId) params.append('candidato_id', candidatoId.toString());
      if (vagaId) params.append('vaga_id', vagaId.toString());
      if (filtroTipo !== 'all') params.append('tipo', filtroTipo);
      if (filtroStatus !== 'all') params.append('status', filtroStatus);
      params.append('limit', limite.toString());

      const data = await apiGet<{ historico: Comunicacao[]; total: number }>(`/comunicacao/historico?${params.toString()}`);
      setComunicacoes(data.historico);
      setTotal(data.total);
    } catch (error) {
      console.error('Erro ao carregar histÃ³rico:', error);
    } finally {
      setLoading(false);
    }
  }, [candidatoId, vagaId, filtroTipo, filtroStatus, limite]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  const getStatusConfig = (status: Comunicacao['status']) => {
    const configs = {
      pendente: { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pendente' },
      enviado: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Enviado' },
      entregue: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Entregue' },
      lido: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Lido' },
      falhou: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', label: 'Falhou' },
    };
    return configs[status];
  };

  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const dataLocal = data.toLocaleDateString('pt-BR');
    const horaLocal = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (data.toDateString() === hoje.toDateString()) {
      return `Hoje Ã s ${horaLocal}`;
    } else if (data.toDateString() === ontem.toDateString()) {
      return `Ontem Ã s ${horaLocal}`;
    } else {
      return `${dataLocal} Ã s ${horaLocal}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ðŸ“œ HistÃ³rico de ComunicaÃ§Ãµes</h2>
          <p className="text-gray-600 mt-1">
            {total} {total === 1 ? 'comunicaÃ§Ã£o' : 'comunicaÃ§Ãµes'} registrada{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as 'all' | 'email' | 'whatsapp')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            <option value="all">Todos os tipos</option>
            <option value="email">ðŸ“§ Email</option>
            <option value="whatsapp">ðŸ’¬ WhatsApp</option>
          </select>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as 'all' | 'enviado' | 'lido' | 'falhou')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            <option value="all">Todos os status</option>
            <option value="enviado">âœ… Enviado</option>
            <option value="lido">ðŸ‘ï¸ Lido</option>
            <option value="falhou">âŒ Falhou</option>
          </select>

          <div className="flex-1"></div>

          <div className="text-sm text-gray-600">
            ðŸ“§ {comunicacoes.filter(c => c.tipo === 'email').length} emails â€¢ 
            ðŸ’¬ {comunicacoes.filter(c => c.tipo === 'whatsapp').length} WhatsApp
          </div>
        </div>
      </div>

      {/* Lista */}
      {comunicacoes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">ðŸ“­</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma comunicaÃ§Ã£o encontrada</h3>
          <p className="text-gray-600">
            NÃ£o hÃ¡ comunicaÃ§Ãµes registradas com os filtros aplicados
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
          {comunicacoes.map((com) => {
            const statusConfig = getStatusConfig(com.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={com.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setComunicacaoSelecionada(com)}
              >
                <div className="flex items-start gap-4">
                  {/* Ãcone do Tipo */}
                  <div className={`p-2 rounded-lg ${
                    com.tipo === 'email' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    {com.tipo === 'email' ? (
                      <Mail className="w-5 h-5 text-blue-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    )}
                  </div>

                  {/* ConteÃºdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {com.candidato_nome}
                      </span>
                      {com.vaga_titulo && (
                        <>
                          <span className="text-gray-400">â€¢</span>
                          <span className="text-sm text-gray-600">{com.vaga_titulo}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{com.destinatario}</span>
                      {com.template_nome && (
                        <>
                          <span className="text-gray-400">â€¢</span>
                          <span>Template: {com.template_nome}</span>
                        </>
                      )}
                    </div>

                    {com.assunto && (
                      <div className="text-sm text-gray-700 mb-1">
                        <strong>Assunto:</strong> {com.assunto}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{formatarData(com.enviado_em)}</span>
                      <span className="text-gray-400">â€¢</span>
                      <span className={`px-2 py-0.5 rounded ${
                        com.enviado_por === 'automatico' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {com.enviado_por === 'automatico' ? 'ðŸ¤– AutomÃ¡tico' : 'ðŸ‘¤ Manual'}
                      </span>
                      {com.usuario_nome && (
                        <>
                          <span className="text-gray-400">â€¢</span>
                          <span>por {com.usuario_nome}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${statusConfig.bg} ${statusConfig.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{statusConfig.label}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setComunicacaoSelecionada(com);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {com.erro && (
                  <div className="mt-2 ml-14 p-2 bg-red-50 rounded text-sm text-red-700">
                    <strong>Erro:</strong> {com.erro}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes */}
      {comunicacaoSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {comunicacaoSelecionada.tipo === 'email' ? 'ðŸ“§' : 'ðŸ’¬'} Detalhes da ComunicaÃ§Ã£o
                </h3>
                <button
                  onClick={() => setComunicacaoSelecionada(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  âœ•
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Candidato:</span>
                  <p className="text-gray-900">{comunicacaoSelecionada.candidato_nome}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">DestinatÃ¡rio:</span>
                  <p className="text-gray-900">{comunicacaoSelecionada.destinatario}</p>
                </div>
                {comunicacaoSelecionada.vaga_titulo && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Vaga:</span>
                    <p className="text-gray-900">{comunicacaoSelecionada.vaga_titulo}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Enviado em:</span>
                  <p className="text-gray-900">{formatarData(comunicacaoSelecionada.enviado_em)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <p className="text-gray-900">{getStatusConfig(comunicacaoSelecionada.status).label}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Tipo de envio:</span>
                  <p className="text-gray-900">
                    {comunicacaoSelecionada.enviado_por === 'automatico' ? 'ðŸ¤– AutomÃ¡tico' : 'ðŸ‘¤ Manual'}
                  </p>
                </div>
                {comunicacaoSelecionada.template_nome && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">Template usado:</span>
                    <p className="text-gray-900">{comunicacaoSelecionada.template_nome}</p>
                  </div>
                )}
              </div>

              {comunicacaoSelecionada.assunto && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Assunto:</span>
                  <p className="text-gray-900 mt-1">{comunicacaoSelecionada.assunto}</p>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-600">ConteÃºdo:</span>
                {comunicacaoSelecionada.tipo === 'email' ? (
                  <div
                    className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: comunicacaoSelecionada.conteudo }}
                  />
                ) : (
                  <pre className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans text-sm text-gray-900 max-h-96 overflow-y-auto">
                    {comunicacaoSelecionada.conteudo}
                  </pre>
                )}
              </div>

              {comunicacaoSelecionada.erro && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <span className="text-sm font-medium text-red-900">Erro:</span>
                  <p className="text-red-700 mt-1">{comunicacaoSelecionada.erro}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setComunicacaoSelecionada(null)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

