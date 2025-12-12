/**
 * ðŸ” PAINEL RH - GestÃ£o de SolicitaÃ§Ãµes LGPD
 * 
 * Permite ao RH:
 * - Visualizar todas as solicitaÃ§Ãµes
 * - Aprovar exportaÃ§Ãµes
 * - Aprovar exclusÃµes
 * - Rejeitar solicitaÃ§Ãµes
 */

import React, { useState, useEffect, useCallback } from 'react';
import RHLayout from '../../components/RHLayout';
import { apiGet, apiPost } from '../../lib/api';

interface Solicitacao {
  id: number;
  tipo: 'exportacao' | 'exclusao';
  status: 'pendente' | 'em_analise' | 'aprovada' | 'concluida' | 'rejeitada' | 'aguardando_aprovacao_rh' | 'email_nao_encontrado';
  candidato_id: number | null;
  candidato_nome: string;
  candidato_email: string;
  candidato_telefone: string;
  email_solicitante: string;
  telefone_solicitante: string;
  created_at: string;
  data_conclusao: string;
  aprovado_por_nome: string;
  motivo_rejeicao: string;
  observacoes: string;
}

interface ApiResponse {
  protocolo: string;
  message?: string;
}

export default function LGPDSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTipo, setModalTipo] = useState<'exportar' | 'excluir' | 'rejeitar' | 'detalhes' | 'notificar'>('detalhes');
  const [motivo, setMotivo] = useState('');
  const [processando, setProcessando] = useState(false);

  // ==========================================
  // CARREGAR SOLICITAÃ‡Ã•ES
  // ==========================================
  const carregarSolicitacoes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroStatus) params.append('status', filtroStatus);
      if (filtroTipo) params.append('tipo', filtroTipo);

      const response = await apiGet<{ solicitacoes: Solicitacao[] }>(
        `/lgpd/solicitacoes?${params.toString()}`
      );
      setSolicitacoes(response.solicitacoes);
    } catch (error) {
      console.error('Erro ao carregar solicitaÃ§Ãµes:', error);
    } finally {
      setLoading(false);
    }
  }, [filtroStatus, filtroTipo]);

  useEffect(() => {
    carregarSolicitacoes();
  }, [carregarSolicitacoes]);

  // ==========================================
  // EXPORTAR DADOS
  // ==========================================
  const handleExportar = async () => {
    if (!solicitacaoSelecionada) return;

    setProcessando(true);
    try {
      const response = await apiPost<ApiResponse>(`/lgpd/exportar/${solicitacaoSelecionada.id}`, {});
      alert(`âœ… Dados exportados com sucesso!\n\nProtocolo: ${response.protocolo}\n\nO candidato receberÃ¡ os dados por email.`);
      setShowModal(false);
      carregarSolicitacoes();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      alert(`âŒ Erro ao exportar dados:\n${err.response?.data?.error || err.message || 'Erro desconhecido'}`);
    } finally {
      setProcessando(false);
    }
  };

  // ==========================================
  // EXCLUIR DADOS
  // ==========================================
  const handleExcluir = async () => {
    if (!solicitacaoSelecionada) return;

    if (!confirm('âš ï¸ ATENÃ‡ÃƒO: Esta aÃ§Ã£o Ã© IRREVERSÃVEL!\n\nTodos os dados do candidato serÃ£o ANONIMIZADOS.\n\nDeseja continuar?')) {
      return;
    }

    setProcessando(true);
    try {
      const response = await apiPost<ApiResponse>(`/lgpd/excluir/${solicitacaoSelecionada.id}`, {
        motivo: motivo || 'SolicitaÃ§Ã£o aprovada pelo titular'
      });
      alert(`âœ… Dados excluÃ­dos com sucesso!\n\nProtocolo: ${response.protocolo}\n\nComprovante enviado por email.`);
      setShowModal(false);
      setMotivo('');
      carregarSolicitacoes();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      alert(`âŒ Erro ao excluir dados:\n${err.response?.data?.error || err.message || 'Erro desconhecido'}`);
    } finally {
      setProcessando(false);
    }
  };

  // ==========================================
  // REJEITAR SOLICITAÃ‡ÃƒO
  // ==========================================
  const handleRejeitar = async () => {
    if (!solicitacaoSelecionada || !motivo) {
      alert('Por favor, informe o motivo da rejeiÃ§Ã£o');
      return;
    }

    setProcessando(true);
    try {
      await apiPost(`/lgpd/rejeitar/${solicitacaoSelecionada.id}`, { motivo });
      alert('âœ… SolicitaÃ§Ã£o rejeitada');
      setShowModal(false);
      setMotivo('');
      carregarSolicitacoes();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      alert(`âŒ Erro ao rejeitar:\n${err.response?.data?.error || err.message || 'Erro desconhecido'}`);
    } finally {
      setProcessando(false);
    }
  };

  // ==========================================
  // NOTIFICAR EMAIL NÃƒO ENCONTRADO
  // ==========================================
  const handleNotificarEmailNaoEncontrado = async () => {
    if (!solicitacaoSelecionada) return;

    const confirmar = window.confirm(
      `âš ï¸ CONFIRMAR ENVIO\n\n` +
      `SerÃ¡ enviado um email para ${solicitacaoSelecionada.email_solicitante} informando que:\n\n` +
      `"NÃ£o encontramos uma candidatura associada a este email em nossa base de dados."\n\n` +
      `O email pedirÃ¡ para que o solicitante verifique se usou o email correto na candidatura.\n\n` +
      `Deseja continuar?`
    );

    if (!confirmar) return;

    setProcessando(true);
    try {
      const response = await apiPost<ApiResponse>(`/lgpd/notificar-email-nao-encontrado/${solicitacaoSelecionada.id}`, {});
      alert(`âœ… Email enviado com sucesso!\n\nProtocolo: ${response.protocolo}\n\nO solicitante foi notificado sobre o email nÃ£o encontrado.`);
      setShowModal(false);
      carregarSolicitacoes();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      alert(`âŒ Erro ao enviar notificaÃ§Ã£o:\n${err.response?.data?.error || err.message || 'Erro desconhecido'}`);
    } finally {
      setProcessando(false);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================
  const getStatusBadge = (status: string) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_analise: 'bg-blue-100 text-blue-800',
      aprovada: 'bg-green-100 text-green-800',
      concluida: 'bg-green-100 text-green-800',
      rejeitada: 'bg-red-100 text-red-800',
      aguardando_aprovacao_rh: 'bg-orange-100 text-orange-800',
      email_nao_encontrado: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'exportacao' 
      ? 'bg-indigo-100 text-indigo-800' 
      : 'bg-red-100 text-red-800';
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    return new Date(data).toLocaleString('pt-BR');
  };

  // ==========================================
  // MODAL
  // ==========================================
  const abrirModal = (solicitacao: Solicitacao, tipo: typeof modalTipo) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalTipo(tipo);
    setShowModal(true);
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <RHLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ðŸ” SolicitaÃ§Ãµes LGPD
          </h1>
          <p className="text-gray-600">
            Gerencie solicitaÃ§Ãµes de exportaÃ§Ã£o e exclusÃ£o de dados pessoais
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em AnÃ¡lise</option>
                <option value="aprovada">Aprovada</option>
                <option value="concluida">ConcluÃ­da</option>
                <option value="rejeitada">Rejeitada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="exportacao">ExportaÃ§Ã£o</option>
                <option value="exclusao">ExclusÃ£o</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={carregarSolicitacoes}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                ðŸ”„ Atualizar
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Carregando solicitaÃ§Ãµes...</p>
          </div>
        )}

        {/* Lista de SolicitaÃ§Ãµes */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {solicitacoes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-4 text-gray-600">Nenhuma solicitaÃ§Ã£o encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidato
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data SolicitaÃ§Ã£o
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AÃ§Ãµes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {solicitacoes.map((solicitacao) => (
                      <tr key={solicitacao.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {solicitacao.candidato_nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {solicitacao.candidato_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoBadge(solicitacao.tipo)}`}>
                            {solicitacao.tipo === 'exportacao' ? 'ðŸ“¦ ExportaÃ§Ã£o' : 'ðŸ—‘ï¸ ExclusÃ£o'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(solicitacao.status)}`}>
                            {solicitacao.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatarData(solicitacao.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => abrirModal(solicitacao, 'detalhes')}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            ðŸ‘ï¸ Ver
                          </button>

                          {solicitacao.status === 'aguardando_aprovacao_rh' && (
                            <button
                              onClick={() => abrirModal(solicitacao, 'notificar')}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              ðŸ“§ Notificar
                            </button>
                          )}

                          {(solicitacao.status === 'em_analise' || solicitacao.status === 'pendente') && (
                            <>
                              {solicitacao.tipo === 'exportacao' && (
                                <button
                                  onClick={() => abrirModal(solicitacao, 'exportar')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  ðŸ“¦ Exportar
                                </button>
                              )}

                              {solicitacao.tipo === 'exclusao' && (
                                <button
                                  onClick={() => abrirModal(solicitacao, 'excluir')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  ðŸ—‘ï¸ Excluir
                                </button>
                              )}

                              <button
                                onClick={() => abrirModal(solicitacao, 'rejeitar')}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                âŒ Rejeitar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && solicitacaoSelecionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header Modal */}
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {modalTipo === 'detalhes' && 'ðŸ“‹ Detalhes da SolicitaÃ§Ã£o'}
                    {modalTipo === 'exportar' && 'ðŸ“¦ Exportar Dados'}
                    {modalTipo === 'excluir' && 'ðŸ—‘ï¸ Excluir Dados'}
                    {modalTipo === 'rejeitar' && 'âŒ Rejeitar SolicitaÃ§Ã£o'}
                    {modalTipo === 'notificar' && 'ðŸ“§ Notificar Solicitante'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setMotivo('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Detalhes */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">InformaÃ§Ãµes do Candidato</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Nome:</span>
                        <p className="font-medium">{solicitacaoSelecionada.candidato_nome}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium">{solicitacaoSelecionada.candidato_email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Telefone:</span>
                        <p className="font-medium">{solicitacaoSelecionada.candidato_telefone || '-'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <p className="font-medium">{solicitacaoSelecionada.status}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Detalhes da SolicitaÃ§Ã£o</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">ID:</span>
                        <p className="font-medium">#{solicitacaoSelecionada.id}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Tipo:</span>
                        <p className="font-medium">{solicitacaoSelecionada.tipo === 'exportacao' ? 'ExportaÃ§Ã£o' : 'ExclusÃ£o'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Data:</span>
                        <p className="font-medium">{formatarData(solicitacaoSelecionada.created_at)}</p>
                      </div>
                      {solicitacaoSelecionada.data_conclusao && (
                        <div>
                          <span className="text-gray-600">ConcluÃ­da em:</span>
                          <p className="font-medium">{formatarData(solicitacaoSelecionada.data_conclusao)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AÃ§Ãµes do Modal */}
                {modalTipo === 'exportar' && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Ao confirmar, os dados do candidato serÃ£o exportados e enviados por email.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleExportar}
                        disabled={processando}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                      >
                        {processando ? 'Exportando...' : 'âœ… Confirmar ExportaÃ§Ã£o'}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {modalTipo === 'excluir' && (
                  <div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 font-medium">âš ï¸ ATENÃ‡ÃƒO: Esta aÃ§Ã£o Ã© IRREVERSÃVEL!</p>
                      <p className="text-red-700 text-sm mt-2">
                        Todos os dados pessoais serÃ£o anonimizados e nÃ£o poderÃ£o ser recuperados.
                      </p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo (opcional)
                      </label>
                      <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Ex: SolicitaÃ§Ã£o aprovada conforme LGPD..."
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleExcluir}
                        disabled={processando}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors"
                      >
                        {processando ? 'Excluindo...' : 'ðŸ—‘ï¸ Confirmar ExclusÃ£o'}
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setMotivo('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {modalTipo === 'notificar' && (
                  <div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-orange-800 font-medium">âš ï¸ Email nÃ£o encontrado na base de dados</p>
                      <p className="text-orange-700 text-sm mt-2">
                        NÃ£o encontramos uma candidatura com o email informado pelo solicitante.
                      </p>
                    </div>

                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Email solicitante:</strong> {solicitacaoSelecionada.email_solicitante}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Tipo de solicitaÃ§Ã£o:</strong> {solicitacaoSelecionada.tipo === 'exportacao' ? 'ExportaÃ§Ã£o' : 'ExclusÃ£o'}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Data da solicitaÃ§Ã£o:</strong> {formatarData(solicitacaoSelecionada.created_at)}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-blue-800 font-medium text-sm">ðŸ“§ O que serÃ¡ enviado?</p>
                      <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc space-y-1">
                        <li>Email informando que nÃ£o encontramos dados cadastrados</li>
                        <li>OrientaÃ§Ã£o para verificar se o email estÃ¡ correto</li>
                        <li>SugestÃ£o para tentar com outro email caso possua</li>
                        <li>Contatos da empresa para suporte</li>
                      </ul>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={handleNotificarEmailNaoEncontrado}
                        disabled={processando}
                        className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-300 transition-colors"
                      >
                        {processando ? 'Enviando...' : 'ðŸ“§ Enviar NotificaÃ§Ã£o'}
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {modalTipo === 'rejeitar' && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motivo da RejeiÃ§Ã£o *
                      </label>
                      <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={4}
                        placeholder="Explique o motivo da rejeiÃ§Ã£o..."
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleRejeitar}
                        disabled={processando || !motivo}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 transition-colors"
                      >
                        {processando ? 'Rejeitando...' : 'âŒ Confirmar RejeiÃ§Ã£o'}
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setMotivo('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {modalTipo === 'detalhes' && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </RHLayout>
  );
}

