import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Upload, CheckCircle, XCircle, FileText, AlertCircle, Loader2, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [dados, setDados] = useState<DadosDocumentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se está autenticado
    const token = localStorage.getItem('documentos_token');
    if (!token) {
      router.push('/documentos');
      return;
    }

    buscarDados();
  }, [router]);

  const buscarDados = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('documentos_token');
      
      // TODO: Implementar endpoint para buscar dados do candidato autenticado
      // Por enquanto, vou simular dados
      setDados({
        candidato: {
          nome: 'Candidato Teste',
          email: 'teste@email.com',
          telefone: '(81) 99999-9999',
          vaga: 'Desenvolvedor',
        },
        documentos: {
          ctps_digital: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          identidade_frente: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          identidade_verso: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          comprovante_residencia: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          certidao_nascimento_casamento: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          reservista: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          titulo_eleitor: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
          antecedentes_criminais: { url: null, validado: false, rejeitado: false, motivo_rejeicao: null },
        },
        status: 'pendente',
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setErro('Erro ao carregar informações');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (tipoDocumento: string, file: File) => {
    try {
      setUploadingDoc(tipoDocumento);
      setErro(null);

      // Validações
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('❌ Arquivo muito grande! Máximo: 10MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('❌ Formato não permitido! Use: JPG, PNG, PDF ou WEBP');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo_documento', tipoDocumento);

      const token = localStorage.getItem('documentos_token');

      // TODO: Implementar endpoint de upload
      await axios.post(`${API_URL}/documentos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('✅ Documento enviado com sucesso!');
      buscarDados();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('❌ Erro ao enviar documento. Tente novamente.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('documentos_token');
    router.push('/documentos');
  };

  const documentos = [
    { key: 'ctps_digital', label: 'Carteira de Trabalho Digital', icon: '📄' },
    { key: 'identidade_frente', label: 'Identidade (Frente)', icon: '🪪' },
    { key: 'identidade_verso', label: 'Identidade (Verso)', icon: '🪪' },
    { key: 'comprovante_residencia', label: 'Comprovante de Residência', icon: '🏠' },
    { key: 'certidao_nascimento_casamento', label: 'Certidão de Nascimento/Casamento', icon: '📜' },
    { key: 'reservista', label: 'Certificado de Reservista', icon: '🎖️' },
    { key: 'titulo_eleitor', label: 'Título de Eleitor', icon: '🗳️' },
    { key: 'antecedentes_criminais', label: 'Antecedentes Criminais', icon: '📋' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {dados?.candidato.nome || 'Carregando...'}
              </h1>
              <p className="text-gray-600">{dados?.candidato.vaga}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="max-w-6xl mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Atenção - Requisitos Importantes:</h3>
              <ul className="text-yellow-800 space-y-1 text-sm">
                <li>• Todas as fotos devem estar <strong>nítidas e legíveis</strong></li>
                <li>• Documentos não podem estar <strong>rasurados ou embaçados</strong></li>
                <li>• Comprovante de residência deve ser de <strong>até 3 meses</strong></li>
                <li>• Formatos aceitos: <strong>JPG, PNG, PDF, WEBP</strong></li>
                <li>• Tamanho máximo: <strong>10MB por arquivo</strong></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid de Documentos */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentos.map((doc, index) => {
            const docStatus = dados?.documentos[doc.key as keyof typeof dados.documentos];
            const isUploaded = docStatus?.url;
            const isValidated = docStatus?.validado;
            const isRejected = docStatus?.rejeitado;
            const isUploading = uploadingDoc === doc.key;

            return (
              <motion.div
                key={doc.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                  isValidated
                    ? 'border-green-500'
                    : isRejected
                    ? 'border-red-500'
                    : isUploaded
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{doc.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{doc.label}</h3>
                      {isValidated && (
                        <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3 h-3" />
                          Validado
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                          <XCircle className="w-3 h-3" />
                          Rejeitado
                        </span>
                      )}
                      {isUploaded && !isValidated && !isRejected && (
                        <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <FileText className="w-3 h-3" />
                          Em análise
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Motivo de Rejeição */}
                {isRejected && docStatus?.motivo_rejeicao && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700">
                      <strong>Motivo:</strong> {docStatus.motivo_rejeicao}
                    </p>
                  </div>
                )}

                {/* Botão de Upload */}
                <label
                  className={`block w-full py-3 px-4 rounded-lg font-medium text-center cursor-pointer transition-all ${
                    isUploading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : isValidated
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : isRejected
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : isUploaded
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {isUploaded ? 'Reenviar' : 'Enviar'}
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf,image/webp"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUpload(doc.key, file);
                      }
                    }}
                  />
                </label>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600 text-sm">
            Após enviar todos os documentos, nossa equipe de RH irá analisá-los.<br />
            Você receberá um email com o resultado da análise.
          </p>
        </div>
      </div>
    </div>
  );
}
