import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { apiGet } from '../lib/api';

interface Estatisticas {
  email: {
    total: number;
    sucesso: number;
    falhas: number;
    lidos: number;
    taxa_sucesso: number;
    taxa_abertura: number;
  };
  whatsapp: {
    total: number;
    sucesso: number;
    falhas: number;
    lidos: number;
    taxa_sucesso: number;
    taxa_leitura: number;
  };
}

export default function DashboardComunicacao() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState(30);

  const carregarEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet<Estatisticas>(`/comunicacao/estatisticas?dias=${periodo}`);
      setEstatisticas(data);
    } catch (error) {
      console.error('Erro ao carregar estatÃ­sticas:', error);
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    carregarEstatisticas();
  }, [carregarEstatisticas]);

  if (loading || !estatisticas) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalGeral = estatisticas.email.total + estatisticas.whatsapp.total;
  const sucessoGeral = estatisticas.email.sucesso + estatisticas.whatsapp.sucesso;
  const falhasGeral = estatisticas.email.falhas + estatisticas.whatsapp.falhas;
  const taxaSucessoGeral = totalGeral > 0 ? Math.round((sucessoGeral / totalGeral) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ðŸ“Š MÃ©tricas de ComunicaÃ§Ã£o</h2>
          <p className="text-gray-600 mt-1">AnÃ¡lise detalhada dos Ãºltimos {periodo} dias</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value={7}>Ãšltimos 7 dias</option>
          <option value={15}>Ãšltimos 15 dias</option>
          <option value={30}>Ãšltimos 30 dias</option>
          <option value={60}>Ãšltimos 60 dias</option>
          <option value={90}>Ãšltimos 90 dias</option>
        </select>
      </div>

      {/* Cards de Resumo Geral */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{totalGeral}</div>
          </div>
          <div className="text-blue-100 text-sm font-medium">Total Enviado</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{sucessoGeral}</div>
          </div>
          <div className="text-green-100 text-sm font-medium">Entregues com Sucesso</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{falhasGeral}</div>
          </div>
          <div className="text-red-100 text-sm font-medium">Falhas</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <div className="text-3xl font-bold">{taxaSucessoGeral}%</div>
          </div>
          <div className="text-purple-100 text-sm font-medium">Taxa de Sucesso Geral</div>
        </div>
      </div>

      {/* Comparativo Email vs WhatsApp */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ðŸ“§ Email</h3>
              <p className="text-sm text-gray-600">{estatisticas.email.total} emails enviados</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Taxa de Sucesso */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Taxa de Entrega</span>
                <span className="text-lg font-bold text-blue-600">{estatisticas.email.taxa_sucesso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${estatisticas.email.taxa_sucesso}%` }}
                />
              </div>
            </div>

            {/* Taxa de Abertura */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Taxa de Abertura</span>
                <span className="text-lg font-bold text-green-600">{estatisticas.email.taxa_abertura}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${estatisticas.email.taxa_abertura}%` }}
                />
              </div>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{estatisticas.email.sucesso}</div>
                <div className="text-xs text-gray-600 mt-1">Entregues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{estatisticas.email.lidos}</div>
                <div className="text-xs text-gray-600 mt-1">Abertos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{estatisticas.email.falhas}</div>
                <div className="text-xs text-gray-600 mt-1">Falhas</div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">ðŸ’¬ WhatsApp</h3>
              <p className="text-sm text-gray-600">{estatisticas.whatsapp.total} mensagens enviadas</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Taxa de Sucesso */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Taxa de Entrega</span>
                <span className="text-lg font-bold text-green-600">{estatisticas.whatsapp.taxa_sucesso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${estatisticas.whatsapp.taxa_sucesso}%` }}
                />
              </div>
            </div>

            {/* Taxa de Leitura */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Taxa de Leitura</span>
                <span className="text-lg font-bold text-blue-600">{estatisticas.whatsapp.taxa_leitura}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${estatisticas.whatsapp.taxa_leitura}%` }}
                />
              </div>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{estatisticas.whatsapp.sucesso}</div>
                <div className="text-xs text-gray-600 mt-1">Entregues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{estatisticas.whatsapp.lidos}</div>
                <div className="text-xs text-gray-600 mt-1">Lidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{estatisticas.whatsapp.falhas}</div>
                <div className="text-xs text-gray-600 mt-1">Falhas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights e RecomendaÃ§Ãµes */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ðŸ’¡ Insights e RecomendaÃ§Ãµes</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* WhatsApp vs Email */}
          {estatisticas.whatsapp.taxa_leitura > estatisticas.email.taxa_abertura && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ðŸ“±</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">WhatsApp tem melhor engajamento</h4>
                  <p className="text-sm text-gray-600">
                    A taxa de leitura do WhatsApp ({estatisticas.whatsapp.taxa_leitura}%) Ã© 
                    {' '}{Math.round(estatisticas.whatsapp.taxa_leitura - estatisticas.email.taxa_abertura)}% 
                    maior que a taxa de abertura de emails. Continue priorizando WhatsApp para comunicaÃ§Ãµes urgentes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Falhas */}
          {falhasGeral > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">âš ï¸</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">AtenÃ§Ã£o Ã s falhas</h4>
                  <p className="text-sm text-gray-600">
                    {falhasGeral} {falhasGeral === 1 ? 'comunicaÃ§Ã£o falhou' : 'comunicaÃ§Ãµes falharam'} nos Ãºltimos {periodo} dias.
                    Verifique se as credenciais de API estÃ£o corretas e se os dados dos candidatos estÃ£o atualizados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Taxa de Sucesso Alta */}
          {taxaSucessoGeral >= 95 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ðŸŽ‰</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Excelente desempenho!</h4>
                  <p className="text-sm text-gray-600">
                    Sua taxa de sucesso de {taxaSucessoGeral}% estÃ¡ Ã³tima! Continue monitorando para manter
                    este alto padrÃ£o de entrega.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Uso Equilibrado */}
          {totalGeral > 0 && (
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ðŸ“Š</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">DistribuiÃ§Ã£o dos canais</h4>
                  <p className="text-sm text-gray-600">
                    {Math.round((estatisticas.email.total / totalGeral) * 100)}% Email â€¢ 
                    {' '}{Math.round((estatisticas.whatsapp.total / totalGeral) * 100)}% WhatsApp
                    {estatisticas.whatsapp.total > estatisticas.email.total * 2 
                      ? ' - Considere usar mais emails para comunicaÃ§Ãµes formais.'
                      : estatisticas.email.total > estatisticas.whatsapp.total * 2
                      ? ' - Considere usar mais WhatsApp para aumentar engajamento.'
                      : ' - DistribuiÃ§Ã£o equilibrada entre os canais!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparativo Visual */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">ðŸ“ˆ Comparativo de Performance</h3>
        <div className="space-y-6">
          {/* Total */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Volume Total</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600 font-semibold">ðŸ“§ {estatisticas.email.total}</span>
                <span className="text-green-600 font-semibold">ðŸ’¬ {estatisticas.whatsapp.total}</span>
              </div>
            </div>
            <div className="flex gap-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="bg-blue-500"
                style={{ width: `${totalGeral > 0 ? (estatisticas.email.total / totalGeral) * 100 : 0}%` }}
              />
              <div
                className="bg-green-500"
                style={{ width: `${totalGeral > 0 ? (estatisticas.whatsapp.total / totalGeral) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Taxa de Entrega */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Taxa de Entrega</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600 font-semibold">ðŸ“§ {estatisticas.email.taxa_sucesso}%</span>
                <span className="text-green-600 font-semibold">ðŸ’¬ {estatisticas.whatsapp.taxa_sucesso}%</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${estatisticas.email.taxa_sucesso}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{ width: `${estatisticas.whatsapp.taxa_sucesso}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Taxa de Leitura/Abertura */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Taxa de Leitura/Abertura</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-blue-600 font-semibold">ðŸ“§ {estatisticas.email.taxa_abertura}%</span>
                <span className="text-green-600 font-semibold">ðŸ’¬ {estatisticas.whatsapp.taxa_leitura}%</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{ width: `${estatisticas.email.taxa_abertura}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{ width: `${estatisticas.whatsapp.taxa_leitura}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

