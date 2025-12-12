import React, { useState } from 'react';
import { Mail, FileText, Settings, BarChart3, History } from 'lucide-react';
import RHLayout from '../../components/RHLayout';
import TemplateManager from '../../components/TemplateManager';
import TemplateEditor from '../../components/TemplateEditor';
import HistoricoComunicacao from '../../components/HistoricoComunicacao';
import DashboardComunicacao from '../../components/DashboardComunicacao';
import ConfiguracaoGatilhos from '../../components/ConfiguracaoGatilhos';
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
      <div className="space-y-10">
        <SectionTitle
          title="Comunicação"
          subtitle="Templates, histórico e gatilhos de e-mail e WhatsApp"
          icon={<Mail className="h-5 w-5" />}
        />

          {/* Tabs de Navegação */}
          <Card className="p-0">
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
                  Histórico
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
          </Card>

          {/* Conteúdo das Abas */}
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
            <Card>
              <CardHeader>
                <CardTitle>Sistema ativo</CardTitle>
                <CardDescription>Comunicação automatizada para acelerar o processo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
                  <li>
                    <strong>E-mail:</strong> comunicação formal com histórico rastreável
                  </li>
                  <li>
                    <strong>WhatsApp:</strong> alta taxa de leitura e engajamento rápido
                  </li>
                  <li>
                    <strong>Gatilhos:</strong> envios automáticos em eventos-chave
                  </li>
                  <li>
                    <strong>Templates:</strong> mensagens com variáveis dinâmicas
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => setAbaAtiva('templates')} gradient>
                    Ver templates
                  </Button>
                  <Button onClick={() => setAbaAtiva('gatilhos')} variant="outline" tone="primary">
                    Configurar gatilhos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    </RHLayout>
  );
}

