import React, { useState } from 'react';
import { Mail, FileText, Settings, BarChart3, History } from 'lucide-react';
import RHLayout from '../../components/RHLayout';
import TemplateManager from '../../components/TemplateManager';
import TemplateEditor from '../../components/TemplateEditor';
import HistoricoComunicacao from '../../components/HistoricoComunicacao';
import DashboardComunicacao from '../../components/DashboardComunicacao';
import ConfiguracaoGatilhos from '../../components/ConfiguracaoGatilhos';

type AbaAtiva = 'dashboard' | 'templates' | 'historico' | 'gatilhos';
type ModoTemplate = 'lista' | 'novo' | 'editar';

export default function ComunicacaoPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('dashboard');
  const [modoTemplate, setModoTemplate] = useState<ModoTemplate>('lista');
  const [templateEditandoId, setTemplateEditandoId] = useState<number | undefined>();

  const handleNovoTemplate = () => {
    setTemplateEditandoId(undefined);
    setModoTemplate('novo');
  };

  const handleEditarTemplate = (template: { id: number }) => {
    setTemplateEditandoId(template.id);
    setModoTemplate('editar');
  };

  const handleVoltarTemplates = () => {
    setModoTemplate('lista');
    setTemplateEditandoId(undefined);
  };

  return (
    <RHLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-lg text-white">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ðŸ“¬ ComunicaÃ§Ã£o Automatizada</h1>
                <p className="text-gray-600 mt-1">
                  Gerencie templates, histÃ³rico e configuraÃ§Ãµes de Email e WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Tabs de NavegaÃ§Ã£o */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setAbaAtiva('dashboard')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    abaAtiva === 'dashboard'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setAbaAtiva('templates');
                    setModoTemplate('lista');
                  }}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    abaAtiva === 'templates'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  Templates
                </button>

                <button
                  onClick={() => setAbaAtiva('historico')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    abaAtiva === 'historico'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <History className="w-5 h-5" />
                  HistÃ³rico
                </button>

                <button
                  onClick={() => setAbaAtiva('gatilhos')}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    abaAtiva === 'gatilhos'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Gatilhos
                </button>
              </nav>
            </div>
          </div>

          {/* ConteÃºdo das Abas */}
          <div>
            {abaAtiva === 'dashboard' && <DashboardComunicacao />}

            {abaAtiva === 'templates' && (
              <>
                {modoTemplate === 'lista' && (
                  <TemplateManager
                    onEdit={handleEditarTemplate}
                    onNew={handleNovoTemplate}
                  />
                )}
                {(modoTemplate === 'novo' || modoTemplate === 'editar') && (
                  <TemplateEditor
                    templateId={templateEditandoId}
                    onSave={handleVoltarTemplates}
                    onCancel={handleVoltarTemplates}
                  />
                )}
              </>
            )}

            {abaAtiva === 'historico' && <HistoricoComunicacao />}

            {abaAtiva === 'gatilhos' && <ConfiguracaoGatilhos />}
          </div>

          {/* Info Box */}
          {abaAtiva === 'dashboard' && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">ðŸš€</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sistema de ComunicaÃ§Ã£o Automatizada Ativo!
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">âœ…</span>
                      <strong>Email:</strong> ComunicaÃ§Ã£o profissional e formal com histÃ³rico rastreÃ¡vel
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">âœ…</span>
                      <strong>WhatsApp:</strong> Alta taxa de leitura (90-95%) e engajamento instantÃ¢neo
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">âœ…</span>
                      <strong>Gatilhos AutomÃ¡ticos:</strong> Envios disparados automaticamente em eventos-chave
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-600">âœ…</span>
                      <strong>Templates PersonalizÃ¡veis:</strong> Crie e edite mensagens com variÃ¡veis dinÃ¢micas
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setAbaAtiva('templates')}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Ver Templates
                    </button>
                    <button
                      onClick={() => setAbaAtiva('gatilhos')}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-300"
                    >
                      Configurar Gatilhos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RHLayout>
  );
}

