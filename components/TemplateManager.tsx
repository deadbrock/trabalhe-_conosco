import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, Edit2, Copy, Trash2, Eye, Power, Plus, Search } from 'lucide-react';
import { apiGet, apiDelete, apiPost, apiPatch } from '../lib/api';

interface Template {
  id: number;
  tipo: 'email' | 'whatsapp';
  nome: string;
  assunto?: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
  estatisticas: {
    enviados: number;
    entregues: number;
    lidos: number;
    falhas: number;
  };
  criado_em: string;
  atualizado_em: string;
}

interface TemplateManagerProps {
  onEdit?: (template: Template) => void;
  onNew?: () => void;
}

export default function TemplateManager({ onEdit, onNew }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<'all' | 'email' | 'whatsapp'>('all');
  const [filtroStatus, setFiltroStatus] = useState<'all' | 'ativo' | 'inativo'>('all');
  const [busca, setBusca] = useState('');
  const [templatePreview, setTemplatePreview] = useState<Template | null>(null);

  const carregarTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filtroTipo !== 'all') params.append('tipo', filtroTipo);
      if (filtroStatus !== 'all') params.append('ativo', filtroStatus === 'ativo' ? 'true' : 'false');

      const data = await apiGet<{ templates: Template[] }>(`/templates?${params.toString()}`);
      setTemplates(data.templates);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      alert('Erro ao carregar templates');
    } finally {
      setLoading(false);
    }
  }, [filtroTipo, filtroStatus]);

  useEffect(() => {
    carregarTemplates();
  }, [carregarTemplates]);

  const handleDuplicar = async (id: number) => {
    if (!confirm('Deseja duplicar este template?')) return;

    try {
      await apiPost(`/templates/${id}/duplicate`, {});
      alert('Template duplicado com sucesso!');
      carregarTemplates();
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      alert('Erro ao duplicar template');
    }
  };

  const handleDeletar = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este template? Esta ação não pode ser desfeita.')) return;

    try {
      await apiDelete(`/templates/${id}`);
      alert('Template deletado com sucesso!');
      carregarTemplates();
    } catch (error: unknown) {
      console.error('Erro ao deletar template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao deletar template';
      alert(errorMessage);
    }
  };

  const handleToggleAtivo = async (id: number) => {
    try {
      await apiPatch(`/templates/${id}/toggle`, {});
      carregarTemplates();
    } catch (error) {
      console.error('Erro ao alternar status:', error);
      alert('Erro ao alternar status do template');
    }
  };

  const handlePreview = async (template: Template) => {
    setTemplatePreview(template);
  };

  const templatesFiltrados = templates.filter(t => {
    if (busca && !t.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getTaxaSucesso = (stats: Template['estatisticas']) => {
    if (stats.enviados === 0) return 0;
    return Math.round((stats.entregues / stats.enviados) * 100);
  };

  const getTaxaLeitura = (stats: Template['estatisticas']) => {
    if (stats.enviados === 0) return 0;
    return Math.round((stats.lidos / stats.enviados) * 100);
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
          <h2 className="text-2xl font-bold text-gray-900">📬 Templates de Comunicação</h2>
          <p className="text-gray-600 mt-1">Gerencie templates de Email e WhatsApp</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Template
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Busca */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar templates..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro Tipo */}
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as 'all' | 'email' | 'whatsapp')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos os tipos</option>
            <option value="email">📧 Email</option>
            <option value="whatsapp">💬 WhatsApp</option>
          </select>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as 'all' | 'ativo' | 'inativo')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Todos os status</option>
            <option value="ativo">✅ Ativos</option>
            <option value="inativo">❌ Inativos</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total: <strong>{templatesFiltrados.length}</strong> templates</span>
          <span>•</span>
          <span>📧 Email: <strong>{templatesFiltrados.filter(t => t.tipo === 'email').length}</strong></span>
          <span>•</span>
          <span>💬 WhatsApp: <strong>{templatesFiltrados.filter(t => t.tipo === 'whatsapp').length}</strong></span>
        </div>
      </div>

      {/* Lista de Templates */}
      {templatesFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum template encontrado</h3>
          <p className="text-gray-600 mb-6">
            {busca ? 'Tente ajustar os filtros de busca' : 'Comece criando seu primeiro template!'}
          </p>
          {!busca && (
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Template
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {templatesFiltrados.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                template.ativo ? 'border-green-200 hover:border-green-300' : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Ícone do Tipo */}
                    <div className={`p-3 rounded-lg ${
                      template.tipo === 'email' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-green-50 text-green-600'
                    }`}>
                      {template.tipo === 'email' ? (
                        <Mail className="w-6 h-6" />
                      ) : (
                        <MessageSquare className="w-6 h-6" />
                      )}
                    </div>

                    {/* Info do Template */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{template.nome}</h3>
                        {!template.ativo && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                            Inativo
                          </span>
                        )}
                      </div>

                      {template.assunto && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Assunto:</strong> {template.assunto}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {template.variaveis.map((variavel) => (
                          <span
                            key={variavel}
                            className="px-2 py-1 text-xs font-mono bg-purple-50 text-purple-700 rounded border border-purple-200"
                          >
                            {`{{${variavel}}}`}
                          </span>
                        ))}
                      </div>

                      {/* Estatísticas */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Enviados:</span>
                          <span className="font-semibold text-gray-900">{template.estatisticas.enviados}</span>
                        </div>
                        {template.estatisticas.enviados > 0 && (
                          <>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">Taxa sucesso:</span>
                              <span className="font-semibold text-green-600">
                                {getTaxaSucesso(template.estatisticas)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">Taxa {template.tipo === 'email' ? 'abertura' : 'leitura'}:</span>
                              <span className="font-semibold text-blue-600">
                                {getTaxaLeitura(template.estatisticas)}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAtivo(template.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        template.ativo
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={template.ativo ? 'Desativar' : 'Ativar'}
                    >
                      <Power className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handlePreview(template)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => onEdit && onEdit(template)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDuplicar(template.id)}
                      className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDeletar(template.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Preview */}
      {templatePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">👁️ Preview do Template</h3>
                <button
                  onClick={() => setTemplatePreview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Nome:</span>
                  <p className="text-gray-900">{templatePreview.nome}</p>
                </div>

                {templatePreview.assunto && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Assunto:</span>
                    <p className="text-gray-900">{templatePreview.assunto}</p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-600">Conteúdo:</span>
                  {templatePreview.tipo === 'email' ? (
                    <div
                      className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: templatePreview.conteudo }}
                    />
                  ) : (
                    <pre className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans text-sm text-gray-900 max-h-96 overflow-y-auto">
                      {templatePreview.conteudo}
                    </pre>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setTemplatePreview(null)}
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

