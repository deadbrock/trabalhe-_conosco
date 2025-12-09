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
  autodeclaracao_ip: string;
  autodeclaracao_user_agent: string;
  autodeclaracao_hash: string;
  autodeclaracao_aceite_termos: boolean;
  autodeclaracao_aceite_data: string;
  
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

  // Função para baixar formulário em branco de autodeclaração
  const baixarFormularioEmBranco = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Formulário de Autodeclaração Racial - Em Branco</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; }
    h1 { text-align: center; color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #0f4c81; }
    .form-group { margin: 20px 0; }
    .form-group label { display: block; font-weight: bold; margin-bottom: 5px; }
    .field-line { border-bottom: 1px solid #333; min-height: 25px; margin-top: 5px; }
    .checkbox-group { margin: 15px 0; padding-left: 20px; }
    .checkbox-group label { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
    .checkbox-box { width: 18px; height: 18px; border: 2px solid #333; display: inline-block; }
    .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; text-align: center; }
    .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 5px; }
    .legal-text { font-size: 11px; color: #666; margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
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
    <div class="field-line"></div>
  </div>
  
  <div class="form-group">
    <label>CPF:</label>
    <div class="field-line" style="width: 200px;"></div>
  </div>
  
  <div class="form-group">
    <label>Cargo/Vaga:</label>
    <div class="field-line"></div>
  </div>
  
  <h2>Declaro que me identifico como:</h2>
  
  <div class="checkbox-group">
    <label><span class="checkbox-box"></span> Branca</label>
    <label><span class="checkbox-box"></span> Preta</label>
    <label><span class="checkbox-box"></span> Parda</label>
    <label><span class="checkbox-box"></span> Amarela</label>
    <label><span class="checkbox-box"></span> Indígena</label>
    <label><span class="checkbox-box"></span> Prefiro não declarar</label>
  </div>
  
  <div class="legal-text">
    <strong>DECLARAÇÃO:</strong><br><br>
    Declaro, para os devidos fins, que as informações aqui prestadas são verdadeiras e de minha inteira responsabilidade, ciente de que a prestação de informações falsas poderá acarretar responsabilização civil, administrativa e penal, nos termos do art. 299 do Código Penal Brasileiro e demais disposições legais vigentes.
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
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Função para baixar autodeclaração preenchida do candidato
  const baixarAutodeclaracaoPreenchida = (doc: Documento) => {
    if (!doc.autodeclaracao_racial) {
      alert('Este candidato ainda não preencheu a autodeclaração racial.');
      return;
    }

    const racaLabels: Record<string, string> = {
      branca: 'Branca',
      preta: 'Preta',
      parda: 'Parda',
      amarela: 'Amarela',
      indigena: 'Indígena',
      nao_declarar: 'Prefere não declarar',
    };

    const racaDeclarada = racaLabels[doc.autodeclaracao_racial] || doc.autodeclaracao_racial;
    const dataDeclaracao = doc.autodeclaracao_data 
      ? new Date(doc.autodeclaracao_data).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        })
      : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    
    const horaDeclaracao = doc.autodeclaracao_data
      ? new Date(doc.autodeclaracao_data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '';
    
    // Dados de verificação
    const codigoVerificacao = doc.autodeclaracao_hash || 'N/D';
    const ipOrigem = doc.autodeclaracao_ip || 'Não registrado';
    const aceiteTermos = doc.autodeclaracao_aceite_termos ? 'Sim' : 'Não';

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Autodeclaração Racial - ${doc.candidato_nome}</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.8; color: #333; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px double #0f4c81; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #0f4c81; letter-spacing: 2px; }
    .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
    h1 { text-align: center; color: #0f4c81; font-size: 22px; margin: 30px 0; text-transform: uppercase; letter-spacing: 1px; }
    .documento-info { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #0f4c81; }
    .documento-info p { margin: 12px 0; font-size: 15px; }
    .documento-info strong { color: #0f4c81; min-width: 180px; display: inline-block; }
    .declaracao-box { background: #fff3cd; border: 2px solid #ffc107; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; }
    .declaracao-box h3 { color: #856404; margin-bottom: 15px; font-size: 16px; }
    .declaracao-box .raca { font-size: 28px; font-weight: bold; color: #0f4c81; text-transform: uppercase; letter-spacing: 2px; padding: 15px; background: white; border-radius: 8px; display: inline-block; margin-top: 10px; border: 2px solid #0f4c81; }
    .legal-text { font-size: 12px; color: #666; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: justify; }
    .legal-text strong { color: #333; }
    .confirmacao { background: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 12px; margin: 25px 0; }
    .confirmacao p { margin: 5px 0; color: #155724; font-weight: 500; }
    .confirmacao .check { color: #28a745; font-size: 20px; margin-right: 10px; }
    .verificacao-box { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 2px solid #1976d2; padding: 20px; border-radius: 12px; margin: 25px 0; }
    .verificacao-box h4 { color: #1565c0; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .verificacao-box .codigo { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #0d47a1; background: white; padding: 10px 20px; border-radius: 8px; display: inline-block; letter-spacing: 3px; border: 2px dashed #1976d2; }
    .verificacao-box .info-tecnica { margin-top: 15px; font-size: 11px; color: #555; }
    .verificacao-box .info-tecnica p { margin: 5px 0; }
    .signature-area { margin-top: 60px; display: flex; justify-content: space-between; gap: 40px; }
    .signature-box { flex: 1; text-align: center; }
    .signature-line { border-top: 2px solid #333; margin-top: 80px; padding-top: 10px; font-size: 13px; color: #666; }
    .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 20px; }
    .data-geracao { font-size: 11px; color: #999; text-align: right; margin-top: 20px; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(15, 76, 129, 0.05); font-weight: bold; pointer-events: none; z-index: -1; }
    .aviso-verificacao { background: #fff8e1; border: 1px solid #ffc107; padding: 12px; border-radius: 8px; margin-top: 15px; font-size: 11px; color: #856404; }
    @media print { 
      body { padding: 20px; } 
      .watermark { display: none; }
    }
  </style>
</head>
<body>
  <div class="watermark">FG SERVICES</div>
  
  <div class="header">
    <div class="logo">FG SERVICES</div>
    <div class="subtitle">Sistema de Gestão de Candidatos</div>
  </div>
  
  <h1>Autodeclaração Étnico-Racial</h1>
  
  <div class="documento-info">
    <p><strong>Nome Completo:</strong> ${doc.candidato_nome}</p>
    <p><strong>E-mail:</strong> ${doc.candidato_email}</p>
    <p><strong>Telefone:</strong> ${doc.candidato_telefone || 'Não informado'}</p>
    <p><strong>Vaga/Cargo:</strong> ${doc.vaga_titulo}</p>
    <p><strong>Data da Declaração:</strong> ${dataDeclaracao}${horaDeclaracao ? ` às ${horaDeclaracao}` : ''}</p>
  </div>
  
  <div class="declaracao-box">
    <h3>DECLARO QUE ME IDENTIFICO COMO:</h3>
    <div class="raca">${racaDeclarada}</div>
  </div>
  
  <div class="confirmacao">
    <p><span class="check">✓</span> O(A) candidato(a) confirmou eletronicamente que leu e concorda com os termos desta declaração.</p>
    <p><span class="check">✓</span> Aceite dos termos legais: <strong>${aceiteTermos}</strong></p>
  </div>
  
  <!-- Seção de Verificação de Autenticidade -->
  <div class="verificacao-box">
    <h4>Verificação de Autenticidade</h4>
    <p style="margin: 0 0 10px 0; font-size: 12px; color: #555;">Código único que comprova a autenticidade desta declaração:</p>
    <div class="codigo">${codigoVerificacao}</div>
    
    <div class="info-tecnica">
      <p><strong>IP de origem:</strong> ${ipOrigem}</p>
      <p><strong>Data/hora do registro:</strong> ${dataDeclaracao}${horaDeclaracao ? ` às ${horaDeclaracao}` : ''}</p>
    </div>
    
    <div class="aviso-verificacao">
      <strong>Como verificar:</strong> Acesse <em>trabalheconoscofg.com.br/verificar</em> e insira o código acima para confirmar a autenticidade desta declaração.
    </div>
  </div>
  
  <div class="legal-text">
    <strong>DECLARAÇÃO LEGAL:</strong><br><br>
    Declaro, para os devidos fins, que as informações aqui prestadas são verdadeiras e de minha inteira responsabilidade, ciente de que a prestação de informações falsas poderá acarretar responsabilização civil, administrativa e penal, nos termos do <strong>art. 299 do Código Penal Brasileiro</strong> e demais disposições legais vigentes.
    <br><br>
    <strong>COMPROVAÇÃO ELETRÔNICA:</strong> Esta declaração foi registrada eletronicamente pelo sistema FG Services, com captura de dados de identificação digital (IP, data/hora, aceite de termos) que garantem sua autenticidade e não-repúdio.
  </div>
  
  <div class="signature-area">
    <div class="signature-box">
      <div class="signature-line">Assinatura do(a) Candidato(a)</div>
    </div>
    <div class="signature-box">
      <div class="signature-line">Assinatura do(a) Responsável RH</div>
    </div>
  </div>
  
  <div class="footer">
    <p>Documento gerado eletronicamente pelo Sistema FG Services</p>
    <p>Este documento é válido como comprovante de autodeclaração étnico-racial para fins de admissão.</p>
    <p style="margin-top: 10px;"><strong>Código de Verificação: ${codigoVerificacao}</strong></p>
  </div>
  
  <div class="data-geracao">
    Gerado em: ${new Date().toLocaleString('pt-BR')}
  </div>
  
  <script>window.print();</script>
</body>
</html>
    `;
    
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
          
          {/* Botão Download Formulário em Branco */}
          <button
            onClick={baixarFormularioEmBranco}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            Formulário em Branco
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
                onBaixarAutodeclaracao={baixarAutodeclaracaoPreenchida}
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
  onBaixarAutodeclaracao: (doc: Documento) => void;
}

function DocumentoCard({ doc, onValidar, onValidarTodos, onBaixarAutodeclaracao }: DocumentoCardProps) {
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
              <div className="flex items-center gap-2">
                {doc.autodeclaracao_racial && (
                  <>
                    <button
                      onClick={() => onBaixarAutodeclaracao(doc)}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all flex items-center gap-1 shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Baixar Declaração
                    </button>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Preenchida
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Dados de Verificação */}
            {doc.autodeclaracao_racial && (
              <div className="mt-3 pt-3 border-t border-orange-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2 rounded-lg">
                    <span className="text-gray-500">Data/Hora:</span>
                    <p className="font-medium text-gray-700">
                      {doc.autodeclaracao_data 
                        ? new Date(doc.autodeclaracao_data).toLocaleString('pt-BR')
                        : 'N/D'}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <span className="text-gray-500">Código de Verificação:</span>
                    <p className="font-mono font-bold text-blue-700 tracking-wider">
                      {doc.autodeclaracao_hash || 'N/D'}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <span className="text-gray-500">Aceite dos Termos:</span>
                    <p className={`font-medium ${doc.autodeclaracao_aceite_termos ? 'text-green-700' : 'text-red-700'}`}>
                      {doc.autodeclaracao_aceite_termos ? '✓ Sim' : '✗ Não'}
                    </p>
                  </div>
                </div>
                {doc.autodeclaracao_ip && (
                  <p className="text-xs text-gray-400 mt-2">
                    IP de origem: {doc.autodeclaracao_ip}
                  </p>
                )}
              </div>
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

