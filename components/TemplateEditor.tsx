import React, { useState, useEffect, useCallback } from 'react';
import { Save, X, Eye, Sparkles } from 'lucide-react';
import { apiPost, apiPut, apiGet } from '../lib/api';

interface Template {
  id?: number;
  tipo: 'email' | 'whatsapp';
  nome: string;
  assunto?: string;
  conteudo: string;
  variaveis: string[];
  ativo: boolean;
}

interface TemplateEditorProps {
  templateId?: number;
  onSave?: () => void;
  onCancel?: () => void;
}

const VARIAVEIS_DISPONIVEIS = [
  { key: 'nome', label: 'Nome do candidato', exemplo: 'JoÃ£o Silva' },
  { key: 'email', label: 'Email do candidato', exemplo: 'joao@example.com' },
  { key: 'telefone', label: 'Telefone do candidato', exemplo: '(11) 98765-4321' },
  { key: 'vaga', label: 'TÃ­tulo da vaga', exemplo: 'Desenvolvedor Full Stack' },
  { key: 'empresa', label: 'Nome da empresa', exemplo: 'FG Services' },
  { key: 'data', label: 'Data atual ou agendada', exemplo: '15/01/2024' },
  { key: 'hora', label: 'Hora do agendamento', exemplo: '14:00' },
  { key: 'local', label: 'Local da entrevista', exemplo: 'Rua Exemplo, 123' },
  { key: 'link', label: 'Link da videochamada', exemplo: 'https://meet.google.com/...' },
  { key: 'rh_nome', label: 'Nome do RH', exemplo: 'Maria Santos' },
  { key: 'rh_email', label: 'Email do RH', exemplo: 'rh@fgservices.com.br' },
  { key: 'rh_telefone', label: 'Telefone do RH', exemplo: '(11) 3456-7890' },
];

export default function TemplateEditor({ templateId, onSave, onCancel }: TemplateEditorProps) {
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [template, setTemplate] = useState<Template>({
    tipo: 'whatsapp',
    nome: '',
    assunto: '',
    conteudo: '',
    variaveis: [],
    ativo: true
  });

  const carregarTemplate = useCallback(async () => {
    if (!templateId) return;
    try {
      setLoading(true);
      const data = await apiGet<Template>(`/templates/${templateId}`);
      setTemplate(data);
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      alert('Erro ao carregar template');
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    carregarTemplate();
  }, [carregarTemplate]);

  const detectarVariaveis = (texto: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = texto.matchAll(regex);
    const vars = new Set<string>();
    
    for (const match of matches) {
      vars.add(match[1]);
    }
    
    return Array.from(vars);
  };

  const inserirVariavel = (variavel: string) => {
    const textarea = document.querySelector('textarea[name="conteudo"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template.conteudo;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const varText = `{{${variavel}}}`;

    const newConteudo = before + varText + after;
    setTemplate({ ...template, conteudo: newConteudo });

    // Reposicionar cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + varText.length, start + varText.length);
    }, 0);
  };

  const handleConteudoChange = (novoConteudo: string) => {
    const variaveisDetectadas = detectarVariaveis(novoConteudo);
    setTemplate({ 
      ...template, 
      conteudo: novoConteudo,
      variaveis: variaveisDetectadas
    });
  };

  const handleAssuntoChange = (novoAssunto: string) => {
    const variaveisConteudo = detectarVariaveis(template.conteudo);
    const variaveisAssunto = detectarVariaveis(novoAssunto);
    const todasVariaveis = [...new Set([...variaveisConteudo, ...variaveisAssunto])];
    
    setTemplate({ 
      ...template, 
      assunto: novoAssunto,
      variaveis: todasVariaveis
    });
  };

  const handleSave = async () => {
    // ValidaÃ§Ãµes
    if (!template.nome.trim()) {
      alert('Nome do template Ã© obrigatÃ³rio');
      return;
    }

    if (!template.conteudo.trim()) {
      alert('ConteÃºdo do template Ã© obrigatÃ³rio');
      return;
    }

    if (template.tipo === 'email' && !template.assunto?.trim()) {
      alert('Assunto Ã© obrigatÃ³rio para templates de email');
      return;
    }

    try {
      setLoading(true);

      if (templateId) {
        await apiPut(`/templates/${templateId}`, template);
        alert('Template atualizado com sucesso!');
      } else {
        await apiPost('/templates', template);
        alert('Template criado com sucesso!');
      }

      if (onSave) onSave();
    } catch (error: unknown) {
      console.error('Erro ao salvar template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar template';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const gerarPreview = () => {
    let conteudoPreview = template.conteudo;
    let assuntoPreview = template.assunto || '';

    VARIAVEIS_DISPONIVEIS.forEach(v => {
      const regex = new RegExp(`{{${v.key}}}`, 'g');
      conteudoPreview = conteudoPreview.replace(regex, `<span class="bg-yellow-100 text-yellow-800 px-1 rounded">${v.exemplo}</span>`);
      assuntoPreview = assuntoPreview.replace(regex, v.exemplo);
    });

    return { conteudo: conteudoPreview, assunto: assuntoPreview };
  };

  if (loading && templateId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const preview = gerarPreview();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {templateId ? 'âœï¸ Editar Template' : 'âž• Novo Template'}
          </h2>
          <p className="text-gray-600 mt-1">
            {previewMode ? 'Visualizando preview com dados de exemplo' : 'Preencha os campos abaixo'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-5 h-5" />
            {previewMode ? 'Modo EdiÃ§Ã£o' : 'Preview'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* FormulÃ¡rio */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">ðŸ“ InformaÃ§Ãµes BÃ¡sicas</h3>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Template *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTemplate({ ...template, tipo: 'email', assunto: template.assunto || '' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    template.tipo === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">ðŸ“§</div>
                  <div className="font-medium">Email</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTemplate({ ...template, tipo: 'whatsapp' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    template.tipo === 'whatsapp'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">ðŸ’¬</div>
                  <div className="font-medium">WhatsApp</div>
                </button>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Template *
              </label>
              <input
                type="text"
                value={template.nome}
                onChange={(e) => setTemplate({ ...template, nome: e.target.value })}
                placeholder="Ex: InscriÃ§Ã£o Confirmada"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Assunto (sÃ³ para email) */}
            {template.tipo === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto do Email *
                </label>
                <input
                  type="text"
                  value={template.assunto || ''}
                  onChange={(e) => handleAssuntoChange(e.target.value)}
                  placeholder="Ex: Bem-vindo Ã  {{empresa}}!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {`{{variavel}}`} para inserir dados dinÃ¢micos
                </p>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={template.ativo}
                  onChange={(e) => setTemplate({ ...template, ativo: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Template ativo (disponÃ­vel para uso)
                </span>
              </label>
            </div>
          </div>

          {/* VariÃ¡veis DisponÃ­veis */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">VariÃ¡veis DisponÃ­veis</h3>
            </div>
            <div className="grid gap-2">
              {VARIAVEIS_DISPONIVEIS.map((v) => (
                <button
                  key={v.key}
                  onClick={() => inserirVariavel(v.key)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 text-left transition-colors group"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{v.label}</div>
                    <div className="text-xs text-gray-500">Exemplo: {v.exemplo}</div>
                  </div>
                  <code className="text-xs font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded group-hover:bg-purple-200">
                    {`{{${v.key}}}`}
                  </code>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              ðŸ’¡ Clique para inserir no cursor ou digite manualmente
            </p>
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="space-y-6">
          {!previewMode ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">âœï¸ ConteÃºdo</h3>
              <textarea
                name="conteudo"
                value={template.conteudo}
                onChange={(e) => handleConteudoChange(e.target.value)}
                placeholder={
                  template.tipo === 'email'
                    ? 'Digite o conteÃºdo HTML do email...\n\nDica: Use tags HTML para formataÃ§Ã£o:\n<strong>Negrito</strong>\n<em>ItÃ¡lico</em>\n<a href="...">Link</a>'
                    : 'Digite a mensagem do WhatsApp...\n\nDica: Use formataÃ§Ã£o do WhatsApp:\n*Negrito*\n_ItÃ¡lico_\n~Riscado~'
                }
                rows={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm resize-none"
              />
              
              {/* Contador de caracteres */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{template.conteudo.length} caracteres</span>
                {template.tipo === 'whatsapp' && template.conteudo.length > 4096 && (
                  <span className="text-red-600 font-medium">
                    âš ï¸ WhatsApp tem limite de 4096 caracteres
                  </span>
                )}
              </div>

              {/* VariÃ¡veis detectadas */}
              {template.variaveis.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-900 mb-2">
                    ðŸŽ¯ VariÃ¡veis detectadas:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.variaveis.map((v) => (
                      <span
                        key={v}
                        className="px-2 py-1 text-xs font-mono bg-purple-100 text-purple-700 rounded border border-purple-200"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">ðŸ‘ï¸ Preview</h3>
              
              {template.tipo === 'email' && template.assunto && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs font-medium text-blue-900 mb-1">Assunto:</div>
                  <div className="text-sm text-blue-800">{preview.assunto}</div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {template.tipo === 'email' ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: preview.conteudo }}
                  />
                ) : (
                  <div
                    className="whitespace-pre-wrap text-sm text-gray-900"
                    dangerouslySetInnerHTML={{ __html: preview.conteudo }}
                  />
                )}
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                <strong>ðŸ’¡ Dica:</strong> As partes destacadas em amarelo serÃ£o substituÃ­das por dados reais ao enviar.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

