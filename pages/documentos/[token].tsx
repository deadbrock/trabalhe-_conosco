import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Upload, CheckCircle, XCircle, FileText, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface DocumentoStatus {
  url: string | null;
  validado: boolean;
  rejeitado: boolean;
  motivo_rejeicao: string | null;
}

interface DadosDocumentos {
  candidato: {
    nome: string;
    email: string;
    telefone: string;
    vaga: string;
  };
  documentos: {
    ctps_digital: DocumentoStatus;
    identidade_frente: DocumentoStatus;
    identidade_verso: DocumentoStatus;
    comprovante_residencia: DocumentoStatus & { data_emissao?: string };
    certidao_nascimento_casamento: DocumentoStatus;
    reservista: DocumentoStatus;
    titulo_eleitor: DocumentoStatus;
    antecedentes_criminais: DocumentoStatus;
  };
  status: string;
}

export default function DocumentosUploadPage() {
  const router = useRouter();
  const { token } = router.query;
  
  const [dados, setDados] = useState<DadosDocumentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Buscar dados ao carregar
  useEffect(() => {
    if (token) {
      buscarDados();
    }
  }, [token]);

  const buscarDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      
      const response = await axios.get(`${API_URL}/documentos/${token}`);
      
      setDados(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      setErro(error.response?.data?.error || 'Erro ao carregar informações');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (tipoDocumento: string, file: File) => {
    try {
      setUploadingDoc(tipoDocumento);
      setErro(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo_documento', tipoDocumento);
      
      const response = await axios.post(
        `${API_URL}/documentos/${token}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      // Recarregar dados
      await buscarDados();
      
      alert('✅ Documento enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      
      const mensagemErro = error.response?.data?.motivo || error.response?.data?.error || 'Erro ao enviar documento';
      
      alert(`❌ ${mensagemErro}`);
    } finally {
      setUploadingDoc(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (erro || !dados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
          <p className="text-gray-600 mb-6">{erro || 'Não foi possível carregar os dados'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-700 transition"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const documentosConfig = [
    { key: 'ctps_digital', label: 'Carteira de Trabalho Digital', obrigatorio: true },
    { key: 'identidade_frente', label: 'Identidade (Frente)', obrigatorio: true },
    { key: 'identidade_verso', label: 'Identidade (Verso)', obrigatorio: true },
    { key: 'comprovante_residencia', label: 'Comprovante de Residência (até 3 meses)', obrigatorio: true },
    { key: 'certidao_nascimento_casamento', label: 'Certidão de Nascimento ou Casamento', obrigatorio: true },
    { key: 'reservista', label: 'Certificado de Reservista (apenas masculino)', obrigatorio: false },
    { key: 'titulo_eleitor', label: 'Título de Eleitor', obrigatorio: true },
    { key: 'antecedentes_criminais', label: 'Antecedentes Criminais / Nada Consta (recente)', obrigatorio: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📄 Envio de Documentos</h1>
          <p className="text-gray-600 mb-6">
            Olá, <span className="font-semibold text-primary">{dados.candidato.nome}</span>! 
            Você foi aprovado para a vaga de <span className="font-semibold">{dados.candidato.vaga}</span>.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-2">⚠️ Requisitos importantes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Fotos devem estar <strong>nítidas e legíveis</strong></li>
                  <li>Documentos não podem estar <strong>rasurados ou embaçados</strong></li>
                  <li>Comprovante de residência deve ser de <strong>até 3 meses atrás</strong></li>
                  <li>Formatos aceitos: JPG, PNG, PDF</li>
                  <li>Tamanho máximo: 10MB por arquivo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="space-y-4">
          {documentosConfig.map((doc) => {
            const status = dados.documentos[doc.key as keyof typeof dados.documentos];
            
            return (
              <DocumentoCard
                key={doc.key}
                label={doc.label}
                obrigatorio={doc.obrigatorio}
                status={status}
                isUploading={uploadingDoc === doc.key}
                onUpload={(file) => handleUpload(doc.key, file)}
              />
            );
          })}
        </div>

        {/* Informações adicionais */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📌 Documentos de Filhos</h3>
          <p className="text-gray-600 mb-4">
            Se você tiver filhos <strong>até 13 anos</strong>, será necessário enviar:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
            <li>Certidão de Nascimento</li>
            <li>CPF (se tiver)</li>
          </ul>
          <p className="text-sm text-gray-500">
            Caso tenha filhos, entre em contato com o RH após enviar os documentos principais.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>© 2025 FG Services - Todos os direitos reservados</p>
          <p className="mt-2">Dúvidas? Entre em contato com o RH</p>
        </div>
      </div>
    </div>
  );
}

interface DocumentoCardProps {
  label: string;
  obrigatorio: boolean;
  status: DocumentoStatus;
  isUploading: boolean;
  onUpload: (file: File) => void;
}

function DocumentoCard({ label, obrigatorio, status, isUploading, onUpload }: DocumentoCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar tamanho (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ Arquivo muito grande. Máximo: 10MB');
        return;
      }
      
      // Validar formato
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedFormats.includes(file.type)) {
        alert('❌ Formato não suportado. Use JPG, PNG ou PDF');
        return;
      }
      
      onUpload(file);
    }
  };

  const getStatusIcon = () => {
    if (isUploading) {
      return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
    }
    
    if (status.validado) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    
    if (status.rejeitado) {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }
    
    if (status.url) {
      return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
    
    return <FileText className="w-6 h-6 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isUploading) return 'Enviando...';
    if (status.validado) return 'Validado ✓';
    if (status.rejeitado) return 'Rejeitado ✗';
    if (status.url) return 'Aguardando validação';
    return obrigatorio ? 'Obrigatório' : 'Opcional';
  };

  const getStatusColor = () => {
    if (isUploading) return 'bg-blue-50 border-blue-200';
    if (status.validado) return 'bg-green-50 border-green-200';
    if (status.rejeitado) return 'bg-red-50 border-red-200';
    if (status.url) return 'bg-yellow-50 border-yellow-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className={`rounded-xl shadow-md border-2 p-6 transition-all ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          {getStatusIcon()}
          
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {label}
              {obrigatorio && <span className="text-red-500 ml-1">*</span>}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3">{getStatusText()}</p>
            
            {status.rejeitado && status.motivo_rejeicao && (
              <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded mb-3">
                <p className="text-sm text-red-800">
                  <strong>Motivo da rejeição:</strong> {status.motivo_rejeicao}
                </p>
              </div>
            )}
            
            {!status.validado && (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.webp"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                
                <div className={`
                  flex items-center justify-center px-4 py-2 rounded-lg border-2 border-dashed
                  transition-all ${
                    isUploading
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                      : 'bg-white border-primary hover:bg-primary/5 hover:border-primary/80'
                  }
                `}>
                  <Upload className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">
                    {status.url ? 'Enviar Novamente' : 'Selecionar Arquivo'}
                  </span>
                </div>
              </label>
            )}
            
            {status.url && (
              <a
                href={status.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                Ver documento enviado →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

