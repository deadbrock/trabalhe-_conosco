import { useState, useEffect } from 'react';
import RHLayout from '../../components/RHLayout';
import api from '../../lib/api';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, ExternalLink, Eye, Download, CheckCheck, Ban } from 'lucide-react';

interface Documento {
  id: number;
  candidato_id: number;
  candidato_nome: string;
  candidato_email: string;
  candidato_telefone: string;
  vaga_titulo: string;
  status: string;
  data_envio_link: string;
  data_ultimo_upload: string;
  data_conclusao: string;
  token_acesso: string;
  
  // Autodeclaração Racial
  autodeclaracao_racial: string;
  autodeclaracao_data: string;
  
  // Documentos
  foto_3x4_url: string;
  foto_3x4_validado: boolean;
  foto_3x4_rejeitado: boolean;
  
  ctps_digital_url: string;
  ctps_digital_validado: boolean;
  ctps_digital_rejeitado: boolean;
  
  identidade_frente_url: string;
  identidade_frente_validado: boolean;
  identidade_frente_rejeitado: boolean;
  
  identidade_verso_url: string;
  identidade_verso_validado: boolean;
  identidade_verso_rejeitado: boolean;
  
  comprovante_residencia_url: string;
  comprovante_residencia_validado: boolean;
  comprovante_residencia_rejeitado: boolean;
  comprovante_residencia_data_emissao: string;
  
  certidao_nascimento_casamento_url: string;
  certidao_nascimento_casamento_validado: boolean;
  certidao_nascimento_casamento_rejeitado: boolean;
  
  reservista_url: string;
  reservista_validado: boolean;
  reservista_rejeitado: boolean;
  
  titulo_eleitor_url: string;
  titulo_eleitor_validado: boolean;
  titulo_eleitor_rejeitado: boolean;
  
  antecedentes_criminais_url: string;
  antecedentes_criminais_validado: boolean;
  antecedentes_criminais_rejeitado: boolean;
  
  // Documentos de Dependentes
  certidao_nascimento_dependente_url: string;
  certidao_nascimento_dependente_validado: boolean;
  certidao_nascimento_dependente_rejeitado: boolean;
  
  cpf_dependente_url: string;
  cpf_dependente_validado: boolean;
  cpf_dependente_rejeitado: boolean;
}

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'pendente' | 'documentos_enviados' | 'em_analise' | 'aprovado' | 'rejeitado'>('todos');

  useEffect(() => {
    buscarDocumentos();
  }, []);

  const buscarDocumentos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documentos/rh/listar');
      setDocumentos(response.data.documentos);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      alert('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const validarDocumento = async (docId: number, tipoDocumento: string, acao: 'aprovar' | 'rejeitar') => {
    try {
      let motivo = null;
      
      if (acao === 'rejeitar') {
        motivo = prompt('Informe o motivo da rejeição:');
        if (!motivo) return;
      }
      
      await api.put(`/documentos/rh/${docId}/validar`, {
        tipo_documento: tipoDocumento,
        acao,
        motivo_rejeicao: motivo,
      });
      
      alert(acao === 'aprovar' ? '✅ Documento aprovado' : '❌ Documento rejeitado');
      buscarDocumentos();
    } catch (error) {
      console.error('Erro ao validar documento:', error);
      alert('Erro ao validar documento');
    }
  };

  const validarTodosDocumentos = async (docId: number, acao: 'aprovar' | 'rejeitar') => {
    try {
      let motivo = null;
      
      if (acao === 'rejeitar') {
        motivo = prompt('Informe o motivo da rejeição de todos os documentos:');
        if (!motivo) return;
      }
      
      const confirmacao = confirm(
        acao === 'aprovar' 
          ? '✅ Deseja APROVAR TODOS os documentos deste candidato?' 
          : '❌ Deseja REPROVAR TODOS os documentos deste candidato?'
      );
      
      if (!confirmacao) return;
      
      await api.put(`/documentos/rh/${docId}/validar-todos`, {
        acao,
        motivo_rejeicao: motivo,
      });
      
      alert(acao === 'aprovar' ? '✅ Todos os documentos foram aprovados!' : '❌ Todos os documentos foram rejeitados!');
      buscarDocumentos();
    } catch (error) {
      console.error('Erro ao validar todos os documentos:', error);
      alert('Erro ao validar documentos');
    }
  };

  // Função para baixar formulário de autodeclaração
  const baixarFormularioAutodeclaracao = () => {
    // Criar conteúdo do formulário em HTML para impressão
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Formulário de Autodeclaração Racial</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; }
    h1 { text-align: center; color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0f4c81; }
    .form-group { margin: 20px 0; }
    .form-group label { display: block; font-weight: bold; margin-bottom: 5px; }
    .form-group input[type="text"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
    .checkbox-group { margin: 15px 0; padding-left: 20px; }
    .checkbox-group label { display: flex; align-items: center; gap: 10px; margin: 10px 0; cursor: pointer; }
    .checkbox-group input[type="checkbox"] { width: 20px; height: 20px; }
    .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; text-align: center; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; }
    .legal-text { font-size: 12px; color: #666; margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    .date-field { margin-top: 30px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">FG Services</div>
    <p>Sistema de Gestão de Candidatos</p>
  </div>
  
  <h1>FORMULÁRIO DE AUTODECLARAÇÃO RACIAL</h1>
  
  <div class="form-group">
    <label>Nome Completo:</label>
    <input type="text" style="border-bottom: 1px solid #333; border-top: none; border-left: none; border-right: none;" />
  </div>
  
  <div class="form-group">
    <label>CPF:</label>
    <input type="text" style="width: 200px; border-bottom: 1px solid #333; border-top: none; border-left: none; border-right: none;" />
  </div>
  
  <div class="form-group">
    <label>Cargo/Vaga:</label>
    <input type="text" style="border-bottom: 1px solid #333; border-top: none; border-left: none; border-right: none;" />
  </div>
  
  <h2>Declaro que me identifico como:</h2>
  
  <div class="checkbox-group">
    <label><input type="checkbox" /> Branca</label>
    <label><input type="checkbox" /> Preta</label>
    <label><input type="checkbox" /> Parda</label>
    <label><input type="checkbox" /> Amarela</label>
    <label><input type="checkbox" /> Indígena</label>
    <label><input type="checkbox" /> Prefiro não declarar</label>
  </div>
  
  <div class="legal-text">
    <strong>DECLARAÇÃO:</strong><br><br>
    Declaro, para os devidos fins e sob as penas da lei, que as informações prestadas neste formulário são verdadeiras e de minha inteira responsabilidade, conforme o disposto na Lei nº 12.990/2014 e na Portaria Normativa nº 4/2018 do Ministério do Planejamento, Desenvolvimento e Gestão.
    <br><br>
    Estou ciente de que a prestação de declaração falsa caracteriza crime previsto no art. 299 do Código Penal Brasileiro, bem como pode acarretar a eliminação do processo seletivo ou a rescisão do contrato de trabalho, caso já tenha sido admitido(a).
  </div>
  
  <div class="date-field">
    <label>Local e Data: _________________________________, _____ de _______________ de 20_____</label>
  </div>
  
  <div class="signature-area">
    <div class="signature-box">
      <div class="signature-line">Assinatura do(a) Candidato(a)</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">Assinatura do(a) Responsável RH</div>
    </div>
  </div>
  
  <script>window.print();</script>
</body>
</html>
    `;
    
    // Criar blob e abrir em nova janela para impressão/download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const documentosFiltrados = documentos.filter(doc => {
    if (filtro === 'todos') return true;
    return doc.status === filtro;
  });

  const contadores = {
    todos: documentos.length,
    pendente: documentos.filter(d => d.status === 'pendente').length,
    documentos_enviados: documentos.filter(d => d.status === 'documentos_enviados').length,
    em_analise: documentos.filter(d => d.status === 'em_analise').length,
    aprovado: documentos.filter(d => d.status === 'aprovado').length,
    rejeitado: documentos.filter(d => d.status === 'rejeitado').length,
  };

  return (
    <RHLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Documentos de Admissão</h1>
            <p className="text-gray-600">Visualize e valide os documentos enviados pelos candidatos aprovados</p>
          </div>
          
          {/* Botão Download Formulário */}
          <button
            onClick={baixarFormularioAutodeclaracao}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Baixar Formulário Autodeclaração
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtro === 'todos'
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Todos ({contadores.todos})
          </button>
          <button
            onClick={() => setFiltro('pendente')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtro === 'pendente'
                ? 'bg-yellow-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Pendente ({contadores.pendente})
          </button>
          <button
            onClick={() => setFiltro('documentos_enviados')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtro === 'documentos_enviados'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            📋 Docs Enviados ({contadores.documentos_enviados})
          </button>
          <button
            onClick={() => setFiltro('em_analise')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtro === 'em_analise'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Em Análise ({contadores.em_analise})
          </button>
          <button
            onClick={() => setFiltro('aprovado')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtro === 'aprovado'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Aprovado ({contadores.aprovado})
          </button>
          <button
            onClick={() => setFiltro('rejeitado')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              filtro === 'rejeitado'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Rejeitado ({contadores.rejeitado})
          </button>
        </div>

        {/* Lista de Documentos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando documentos...</p>
          </div>
        ) : documentosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum documento encontrado</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {documentosFiltrados.map(doc => (
              <DocumentoCard 
                key={doc.id} 
                doc={doc} 
                onValidar={validarDocumento} 
                onValidarTodos={validarTodosDocumentos}
              />
            ))}
          </div>
        )}
      </div>
    </RHLayout>
  );
}

interface DocumentoCardProps {
  doc: Documento;
  onValidar: (docId: number, tipoDocumento: string, acao: 'aprovar' | 'rejeitar') => void;
  onValidarTodos: (docId: number, acao: 'aprovar' | 'rejeitar') => void;
}

function DocumentoCard({ doc, onValidar, onValidarTodos }: DocumentoCardProps) {
  const [expandido, setExpandido] = useState(false);

  const documentosLista = [
    { key: 'foto_3x4', label: '📸 Foto 3x4' },
    { key: 'ctps_digital', label: '📄 CTPS Digital' },
    { key: 'identidade_frente', label: '🪪 Identidade (Frente)' },
    { key: 'identidade_verso', label: '🪪 Identidade (Verso)' },
    { key: 'comprovante_residencia', label: '🏠 Comprovante de Residência' },
    { key: 'certidao_nascimento_casamento', label: '📜 Certidão Nascimento/Casamento' },
    { key: 'reservista', label: '🎖️ Reservista' },
    { key: 'titulo_eleitor', label: '🗳️ Título de Eleitor' },
    { key: 'antecedentes_criminais', label: '📋 Antecedentes Criminais' },
    { key: 'certidao_nascimento_dependente', label: '👶 Certidão Dependente' },
    { key: 'cpf_dependente', label: '📋 CPF Dependente' },
  ];

  // Mapeamento de raça/cor
  const racaLabels: Record<string, string> = {
    branca: 'Branca',
    preta: 'Preta',
    parda: 'Parda',
    amarela: 'Amarela',
    indigena: 'Indígena',
    nao_declarar: 'Prefere não declarar',
  };

  const getStatusBadge = () => {
    const badges = {
      pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente', icon: Clock },
      documentos_enviados: { bg: 'bg-purple-100', text: 'text-purple-800', label: '📋 Docs Enviados', icon: FileText },
      em_analise: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Análise', icon: AlertCircle },
      aprovado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aprovado', icon: CheckCircle },
      rejeitado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeitado', icon: XCircle },
    };

    const badge = badges[doc.status as keyof typeof badges] || badges.pendente;
    const Icon = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text} flex items-center gap-1`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{doc.candidato_nome}</h3>
            <p className="text-sm text-gray-600 mb-2">{doc.vaga_titulo}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>📧 {doc.candidato_email}</span>
              {doc.candidato_telefone && <span>📱 {doc.candidato_telefone}</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <button className="text-primary hover:text-red-700 transition-colors">
              {expandido ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {/* Documentos (expandido) */}
      {expandido && (
        <div className="border-t border-gray-200 p-6 bg-gray-50 space-y-4">
          {/* Botões de Ação em Massa */}
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-xl border-2 border-gray-200">
            <span className="text-sm font-semibold text-gray-700 flex items-center">
              ⚡ Ações Rápidas:
            </span>
            <button
              onClick={() => onValidarTodos(doc.id, 'aprovar')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
            >
              <CheckCheck className="w-5 h-5" />
              Aprovar Todos os Documentos
            </button>
            <button
              onClick={() => onValidarTodos(doc.id, 'rejeitar')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
            >
              <Ban className="w-5 h-5" />
              Reprovar Todos os Documentos
            </button>
          </div>

          {/* Autodeclaração Racial */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌍</span>
                <div>
                  <h4 className="font-bold text-gray-900">Autodeclaração Racial</h4>
                  {doc.autodeclaracao_racial ? (
                    <p className="text-lg font-semibold text-orange-700">
                      {racaLabels[doc.autodeclaracao_racial] || doc.autodeclaracao_racial}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Não preenchida</p>
                  )}
                </div>
              </div>
              {doc.autodeclaracao_racial && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Preenchida
                </span>
              )}
            </div>
            {doc.autodeclaracao_data && (
              <p className="text-xs text-gray-500 mt-2">
                Declarado em: {new Date(doc.autodeclaracao_data).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <h4 className="font-bold text-gray-700 mb-2">📄 Documentos Enviados</h4>
          {documentosLista.map(({ key, label }) => {
            const urlKey = `${key}_url` as keyof Documento;
            const validadoKey = `${key}_validado` as keyof Documento;
            const rejeitadoKey = `${key}_rejeitado` as keyof Documento;
            
            const url = doc[urlKey] as string;
            const validado = doc[validadoKey] as boolean;
            const rejeitado = doc[rejeitadoKey] as boolean;

            if (!url) {
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-xs text-gray-400">Não enviado</span>
                </div>
              );
            }

            return (
              <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                  {validado && <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />}
                  {rejeitado && <XCircle className="w-4 h-4 text-red-500 inline ml-2" />}
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </a>
                  
                  {!validado && !rejeitado && (
                    <>
                      <button
                        onClick={() => onValidar(doc.id, key, 'aprovar')}
                        className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        onClick={() => onValidar(doc.id, key, 'rejeitar')}
                        className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        ✗ Rejeitar
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Link de acesso */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Link de acesso do candidato:</p>
            <a
              href={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/documentos/${doc.token_acesso}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir página de documentos
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

