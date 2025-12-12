import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, Save, Power, Clock, Calendar } from 'lucide-react';
import { apiGet, apiPut, apiPatch } from '../lib/api';

interface Template {
  id: number;
  tipo: 'email' | 'whatsapp';
  nome: string;
}

interface Gatilho {
  id: number;
  evento: string;
  descricao: string;
  email_ativo: boolean;
  whatsapp_ativo: boolean;
  template_email_id: number | null;
  template_whatsapp_id: number | null;
  template_email_nome?: string;
  template_whatsapp_nome?: string;
  delay_minutos: number;
  horario_comercial: boolean;
  dias_uteis: boolean;
  horario_inicio: string;
  horario_fim: string;
}

const EVENTOS_LABELS: Record<string, { icon: string; nome: string; descricao: string }> = {
  inscricao_recebida: {
    icon: 'âœ…',
    nome: 'InscriÃ§Ã£o Recebida',
    descricao: 'Quando um candidato se inscreve em uma vaga'
  },
  status_em_analise: {
    icon: 'ðŸ“‹',
    nome: 'Em AnÃ¡lise',
    descricao: 'Quando o status muda para "Em AnÃ¡lise"'
  },
  status_pre_selecionado: {
    icon: 'â­',
    nome: 'PrÃ©-Selecionado',
    descricao: 'Quando o candidato Ã© prÃ©-selecionado'
  },
  convite_entrevista: {
    icon: 'ðŸŽ‰',
    nome: 'Convite para Entrevista',
    descricao: 'Quando uma entrevista Ã© agendada'
  },
  status_aprovado: {
    icon: 'ðŸŽŠ',
    nome: 'Candidato Aprovado',
    descricao: 'Quando o candidato Ã© aprovado'
  },
  status_reprovado: {
    icon: 'ðŸ’¼',
    nome: 'Candidato Reprovado',
    descricao: 'Quando o candidato Ã© reprovado'
  }
};

export default function ConfiguracaoGatilhos() {
  const [gatilhos, setGatilhos] = useState<Gatilho[]>([]);
  const [templatesEmail, setTemplatesEmail] = useState<Template[]>([]);
  const [templatesWhatsApp, setTemplatesWhatsApp] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      
      const [gatilhosData, templatesData] = await Promise.all([
        apiGet<{ gatilhos: Gatilho[] }>('/gatilhos'),
        apiGet<{ templates: Template[] }>('/templates?ativo=true')
      ]);

      setGatilhos(gatilhosData.gatilhos);
      setTemplatesEmail(templatesData.templates.filter(t => t.tipo === 'email'));
      setTemplatesWhatsApp(templatesData.templates.filter(t => t.tipo === 'whatsapp'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar configuraÃ§Ãµes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleToggleEmail = async (evento: string) => {
    try {
      await apiPatch(`/gatilhos/${evento}/toggle-email`, {});
      carregarDados();
    } catch (error) {
      console.error('Erro ao alternar email:', error);
      alert('Erro ao alternar status do email');
    }
  };

  const handleToggleWhatsApp = async (evento: string) => {
    try {
      await apiPatch(`/gatilhos/${evento}/toggle-whatsapp`, {});
      carregarDados();
    } catch (error) {
      console.error('Erro ao alternar WhatsApp:', error);
      alert('Erro ao alternar status do WhatsApp');
    }
  };

  const handleSalvar = async (gatilho: Gatilho) => {
    try {
      setSalvando(gatilho.evento);
      await apiPut(`/gatilhos/${gatilho.evento}`, {
        email_ativo: gatilho.email_ativo,
        whatsapp_ativo: gatilho.whatsapp_ativo,
        template_email_id: gatilho.template_email_id,
        template_whatsapp_id: gatilho.template_whatsapp_id,
        delay_minutos: gatilho.delay_minutos,
        horario_comercial: gatilho.horario_comercial,
        dias_uteis: gatilho.dias_uteis,
        horario_inicio: gatilho.horario_inicio,
        horario_fim: gatilho.horario_fim
      });
      alert('ConfiguraÃ§Ãµes salvas com sucesso!');
      carregarDados();
    } catch (error: unknown) {
      console.error('Erro ao salvar:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar configuraÃ§Ãµes';
      alert(errorMessage);
    } finally {
      setSalvando(null);
    }
  };

  const handleChange = (evento: string, campo: string, valor: string | number | boolean | null) => {
    setGatilhos(gatilhos.map(g => 
      g.evento === evento ? { ...g, [campo]: valor } : g
    ));
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">âš™ï¸ ConfiguraÃ§Ã£o de Gatilhos AutomÃ¡ticos</h2>
        <p className="text-gray-600 mt-1">
          Configure quando e como enviar comunicaÃ§Ãµes automÃ¡ticas aos candidatos
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ðŸ’¡</div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Como funcionam os gatilhos?</h3>
            <p className="text-sm text-blue-800">
              Gatilhos disparam automaticamente quando certos eventos acontecem no sistema (ex: nova inscriÃ§Ã£o, 
              mudanÃ§a de status). VocÃª pode configurar quais canais usar (Email e/ou WhatsApp), qual template 
              enviar, e quando enviar (imediatamente ou com delay).
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Gatilhos */}
      <div className="space-y-4">
        {gatilhos.map((gatilho) => {
          const eventoInfo = EVENTOS_LABELS[gatilho.evento] || { 
            icon: 'âš™ï¸', 
            nome: gatilho.evento,
            descricao: gatilho.descricao 
          };

          return (
            <div key={gatilho.id} className="bg-white rounded-lg shadow-sm border-2 border-gray-200">
              <div className="p-6">
                {/* Header do Gatilho */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{eventoInfo.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{eventoInfo.nome}</h3>
                      <p className="text-sm text-gray-600">{eventoInfo.descricao}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSalvar(gatilho)}
                    disabled={salvando === gatilho.evento}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {salvando === gatilho.evento ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${
                    gatilho.email_ativo ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">ðŸ“§ Email</span>
                      </div>
                      <button
                        onClick={() => handleToggleEmail(gatilho.evento)}
                        className={`p-2 rounded-lg transition-colors ${
                          gatilho.email_ativo
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                        title={gatilho.email_ativo ? 'Desativar' : 'Ativar'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template de Email
                      </label>
                      <select
                        value={gatilho.template_email_id || ''}
                        onChange={(e) => handleChange(gatilho.evento, 'template_email_id', e.target.value ? Number(e.target.value) : null)}
                        disabled={!gatilho.email_ativo}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <option value="">Selecione um template</option>
                        {templatesEmail.map(t => (
                          <option key={t.id} value={t.id}>{t.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className={`border-2 rounded-lg p-4 transition-all ${
                    gatilho.whatsapp_ativo ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">ðŸ’¬ WhatsApp</span>
                      </div>
                      <button
                        onClick={() => handleToggleWhatsApp(gatilho.evento)}
                        className={`p-2 rounded-lg transition-colors ${
                          gatilho.whatsapp_ativo
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                        title={gatilho.whatsapp_ativo ? 'Desativar' : 'Ativar'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template de WhatsApp
                      </label>
                      <select
                        value={gatilho.template_whatsapp_id || ''}
                        onChange={(e) => handleChange(gatilho.evento, 'template_whatsapp_id', e.target.value ? Number(e.target.value) : null)}
                        disabled={!gatilho.whatsapp_ativo}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        <option value="">Selecione um template</option>
                        {templatesWhatsApp.map(t => (
                          <option key={t.id} value={t.id}>{t.nome}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ConfiguraÃ§Ãµes AvanÃ§adas */}
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                    <span>âš™ï¸ ConfiguraÃ§Ãµes AvanÃ§adas</span>
                  </summary>
                  
                  <div className="mt-4 grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Delay */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4" />
                        Delay (minutos)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={gatilho.delay_minutos}
                        onChange={(e) => handleChange(gatilho.evento, 'delay_minutos', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        0 = Enviar imediatamente
                      </p>
                    </div>

                    {/* HorÃ¡rio Comercial */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gatilho.horario_comercial}
                          onChange={(e) => handleChange(gatilho.evento, 'horario_comercial', e.target.checked)}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Apenas em horÃ¡rio comercial
                        </span>
                      </label>

                      {gatilho.horario_comercial && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">InÃ­cio</label>
                            <input
                              type="time"
                              value={gatilho.horario_inicio}
                              onChange={(e) => handleChange(gatilho.evento, 'horario_inicio', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Fim</label>
                            <input
                              type="time"
                              value={gatilho.horario_fim}
                              onChange={(e) => handleChange(gatilho.evento, 'horario_fim', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dias Ãšteis */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gatilho.dias_uteis}
                          onChange={(e) => handleChange(gatilho.evento, 'dias_uteis', e.target.checked)}
                          className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Enviar apenas em dias Ãºteis (nÃ£o enviar sÃ¡bados e domingos)
                        </span>
                      </label>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-4">ðŸ“Š Resumo das ConfiguraÃ§Ãµes</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl mb-2">ðŸ“§</div>
            <div className="font-semibold text-gray-900">
              {gatilhos.filter(g => g.email_ativo).length} de {gatilhos.length}
            </div>
            <div className="text-gray-600">Gatilhos com email ativo</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl mb-2">ðŸ’¬</div>
            <div className="font-semibold text-gray-900">
              {gatilhos.filter(g => g.whatsapp_ativo).length} de {gatilhos.length}
            </div>
            <div className="text-gray-600">Gatilhos com WhatsApp ativo</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-2xl mb-2">âš¡</div>
            <div className="font-semibold text-gray-900">
              {gatilhos.filter(g => g.email_ativo || g.whatsapp_ativo).length} de {gatilhos.length}
            </div>
            <div className="text-gray-600">Gatilhos ativos (qualquer canal)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

