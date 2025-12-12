import React, { useState, useEffect, useCallback } from 'react';
import { Bell, X, Check, Trash2, MailOpen } from 'lucide-react';
import { apiGet, apiPut, apiDelete } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type Notificacao = {
  id: number;
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  link?: string;
  lida: boolean;
  criado_em: string;
};

type NotificacoesResponse = {
  notificacoes: Notificacao[];
  nao_lidas: number;
};

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [naoLidas, setNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const carregarNotificacoes = useCallback(async () => {
    try {
      const queryString = filter === 'unread' ? '?lida=false' : '';
      const data = await apiGet<NotificacoesResponse>(`/notificacoes${queryString}`);
      setNotificacoes(data.notificacoes);
      setNaoLidas(data.nao_lidas);
    } catch (error) {
      console.error('Erro ao carregar notificaÃ§Ãµes:', error);
    }
  }, [filter]);

  useEffect(() => {
    carregarNotificacoes();
    
    // Polling a cada 30 segundos
    const interval = setInterval(carregarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, [carregarNotificacoes]);

  const marcarComoLida = async (id: number) => {
    try {
      await apiPut(`/notificacoes/${id}/marcar-lida`, {});
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar notificaÃ§Ã£o:', error);
    }
  };

  const marcarTodasLidas = async () => {
    try {
      setLoading(true);
      await apiPut('/notificacoes/marcar-todas-lidas', {});
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
    } finally {
      setLoading(false);
    }
  };

  const excluirNotificacao = async (id: number) => {
    try {
      await apiDelete(`/notificacoes/${id}`);
      await carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao excluir notificaÃ§Ã£o:', error);
    }
  };

  const getTipoIcone = (tipo: string) => {
    const icons: Record<string, string> = {
      novo_candidato: 'ðŸ†•',
      status_alterado: 'ðŸ”„',
      novo_comentario: 'ðŸ’¬',
      nova_tag: 'ðŸ·ï¸',
      agendamento: 'ðŸ“…',
      avaliacao: 'â­',
      aprovado: 'âœ…',
      reprovado: 'âŒ'
    };
    return icons[tipo] || 'ðŸ””';
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      novo_candidato: 'bg-blue-100 text-blue-600',
      status_alterado: 'bg-yellow-100 text-yellow-600',
      novo_comentario: 'bg-purple-100 text-purple-600',
      nova_tag: 'bg-pink-100 text-pink-600',
      agendamento: 'bg-green-100 text-green-600',
      avaliacao: 'bg-orange-100 text-orange-600',
      aprovado: 'bg-green-100 text-green-600',
      reprovado: 'bg-red-100 text-red-600'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-600';
  };

  const formatarData = (data: string) => {
    const d = new Date(data);
    const agora = new Date();
    const diff = agora.getTime() - d.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Agora mesmo';
    if (minutos < 60) return `HÃ¡ ${minutos}m`;
    if (horas < 24) return `HÃ¡ ${horas}h`;
    if (dias < 7) return `HÃ¡ ${dias}d`;
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="relative">
      {/* BotÃ£o de NotificaÃ§Ãµes */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors h-10 flex items-center justify-center"
        title="NotificaÃ§Ãµes"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {/* Dropdown de NotificaÃ§Ãµes */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">NotificaÃ§Ãµes</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filtros e AÃ§Ãµes */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-white text-primary'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-white text-primary'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    NÃ£o lidas ({naoLidas})
                  </button>

                  {naoLidas > 0 && (
                    <button
                      onClick={marcarTodasLidas}
                      disabled={loading}
                      className="ml-auto px-3 py-1 rounded-lg text-sm font-medium bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
                      title="Marcar todas como lidas"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista de NotificaÃ§Ãµes */}
              <div className="max-h-96 overflow-y-auto">
                {notificacoes.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">
                      {filter === 'unread' ? 'Nenhuma notificaÃ§Ã£o nÃ£o lida' : 'Nenhuma notificaÃ§Ã£o'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notificacoes.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notif.lida ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Ãcone */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTipoColor(notif.tipo)}`}>
                            {getTipoIcone(notif.tipo)}
                          </div>

                          {/* ConteÃºdo */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                {notif.titulo}
                              </h4>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatarData(notif.criado_em)}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notif.mensagem}
                            </p>

                            {/* AÃ§Ãµes */}
                            <div className="flex items-center gap-2 mt-2">
                              {!notif.lida && (
                                <button
                                  onClick={() => marcarComoLida(notif.id)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
                                >
                                  <MailOpen className="w-3 h-3" />
                                  Marcar lida
                                </button>
                              )}

                              <button
                                onClick={() => excluirNotificacao(notif.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 text-xs font-medium text-gray-700 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notificacoes.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 text-center border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {notificacoes.length} notificaÃ§Ã£o{notificacoes.length !== 1 ? 'Ãµes' : ''}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

