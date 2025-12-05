import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  CameraIcon,
  IdentificationIcon,
  HomeIcon,
  DocumentIcon,
  ShieldCheckIcon,
  TicketIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolidIcon,
} from '@heroicons/react/24/solid';

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
    foto_3x4: DocumentoStatus;
    ctps_digital: DocumentoStatus;
    identidade_frente: DocumentoStatus;
    identidade_verso: DocumentoStatus;
    comprovante_residencia: DocumentoStatus & { data_emissao?: string };
    certidao_nascimento_casamento: DocumentoStatus;
    reservista: DocumentoStatus;
    titulo_eleitor: DocumentoStatus;
    antecedentes_criminais: DocumentoStatus;
    certidao_nascimento_dependente: DocumentoStatus;
    cpf_dependente: DocumentoStatus;
  };
  status: string;
}

export default function DocumentosUploadPage() {
  const router = useRouter();
  const [dados, setDados] = useState<DadosDocumentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  
  // Autodeclaração Racial
  const [racaSelecionada, setRacaSelecionada] = useState<string>('');
  const [confirmacaoRaca, setConfirmacaoRaca] = useState(false);
  const [salvandoRaca, setSalvandoRaca] = useState(false);
  const [racaSalva, setRacaSalva] = useState(false);
  
  // Progresso e completude
  const [documentosCompletos, setDocumentosCompletos] = useState(false);

  // Documentos obrigatórios
  const DOCUMENTOS_OBRIGATORIOS = [
    'foto_3x4', 'ctps_digital', 'identidade_frente', 'identidade_verso',
    'comprovante_residencia', 'certidao_nascimento_casamento', 'titulo_eleitor', 'antecedentes_criminais'
  ];

  // Calcular progresso
  const calcularProgresso = () => {
    if (!dados) return { enviados: 0, total: DOCUMENTOS_OBRIGATORIOS.length, percentual: 0 };
    
    let enviados = 0;
    DOCUMENTOS_OBRIGATORIOS.forEach(key => {
      const doc = dados.documentos[key as keyof typeof dados.documentos];
      if (doc?.url) enviados++;
    });
    
    return {
      enviados,
      total: DOCUMENTOS_OBRIGATORIOS.length,
      percentual: Math.round((enviados / DOCUMENTOS_OBRIGATORIOS.length) * 100)
    };
  };

  const progresso = calcularProgresso();

  const opcoesRaca = [
    { value: 'branca', label: 'Branca' },
    { value: 'preta', label: 'Preta' },
    { value: 'parda', label: 'Parda' },
    { value: 'amarela', label: 'Amarela' },
    { value: 'indigena', label: 'Indígena' },
    { value: 'nao_declarar', label: 'Prefiro não declarar' },
  ];

  const handleSalvarAutodeclaracao = async () => {
    if (!racaSelecionada) {
      alert('Por favor, selecione uma opção de raça/cor.');
      return;
    }
    if (!confirmacaoRaca) {
      alert('Por favor, confirme a autodeclaração marcando a caixa de confirmação.');
      return;
    }

    try {
      setSalvandoRaca(true);
      const token = localStorage.getItem('documentos_token');
      
      const response = await axios.post(`${API_URL}/documentos/autodeclaracao`, {
        raca: racaSelecionada,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setRacaSalva(true);
      
      // Verificar se completou todos os documentos
      if (response.data.completude?.completo) {
        setDocumentosCompletos(true);
        alert('🎉 Parabéns! Todos os documentos foram enviados com sucesso! O RH foi notificado e entrará em contato em breve.');
      } else {
        alert('✅ Autodeclaração racial salva com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar autodeclaração:', error);
      alert('❌ Erro ao salvar autodeclaração. Tente novamente.');
    } finally {
      setSalvandoRaca(false);
    }
  };

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
      
      const response = await axios.get(`${API_URL}/documentos/dados`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setDados(response.data);
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

      const response = await axios.post(`${API_URL}/documentos/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Verificar se completou todos os documentos
      if (response.data.completude?.completo) {
        setDocumentosCompletos(true);
        alert('🎉 Parabéns! Todos os documentos foram enviados com sucesso! O RH foi notificado e entrará em contato em breve.');
      } else {
        alert('✅ Documento enviado com sucesso!');
      }
      
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
    { key: 'foto_3x4', label: 'Foto 3x4', icon: CameraIcon, color: 'text-purple-600', info: null },
    { key: 'ctps_digital', label: 'Carteira de Trabalho Digital', icon: DocumentTextIcon, color: 'text-blue-600', info: null },
    { key: 'identidade_frente', label: 'Identidade (Frente)', icon: IdentificationIcon, color: 'text-indigo-600', info: null },
    { key: 'identidade_verso', label: 'Identidade (Verso)', icon: IdentificationIcon, color: 'text-indigo-600', info: null },
    { key: 'comprovante_residencia', label: 'Comprovante de Residência', icon: HomeIcon, color: 'text-green-600', info: 'Conta de água, luz ou internet de até 3 meses' },
    { key: 'certidao_nascimento_casamento', label: 'Certidão de Nascimento/Casamento', icon: DocumentIcon, color: 'text-amber-600', info: null },
    { key: 'reservista', label: 'Certificado de Reservista', icon: ShieldCheckIcon, color: 'text-emerald-600', info: 'Obrigatório apenas para candidatos do sexo masculino' },
    { key: 'titulo_eleitor', label: 'Título de Eleitor', icon: TicketIcon, color: 'text-cyan-600', info: null },
    { key: 'antecedentes_criminais', label: 'Antecedentes Criminais', icon: DocumentCheckIcon, color: 'text-red-600', info: '⚠️ Aceito APENAS se emitido pelo Tribunal de Justiça ou Fórum da sua região' },
  ];

  const documentosDependentes = [
    { key: 'certidao_nascimento_dependente', label: 'Certidão de Nascimento (Dependente)', icon: UserGroupIcon, color: 'text-pink-600', info: 'Obrigatório para filhos de até 13 anos' },
    { key: 'cpf_dependente', label: 'CPF do Dependente', icon: DocumentTextIcon, color: 'text-pink-600', info: 'Obrigatório para filhos de até 13 anos' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <ArrowPathIcon className="w-12 h-12 animate-spin text-blue-600" />
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
              <UserIcon className="w-8 h-8 text-white" />
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
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sair
          </button>
        </div>
      </div>

      {/* Card de Conclusão (se completo) */}
      {documentosCompletos && (
        <div className="max-w-6xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white text-center"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleSolidIcon className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Documentação Completa!</h2>
            <p className="text-lg opacity-90 mb-4">
              Todos os seus documentos foram recebidos com sucesso.
            </p>
            <p className="text-sm opacity-80">
              Nossa equipe de RH foi notificada e entrará em contato em breve com os próximos passos do processo de admissão.
            </p>
          </motion.div>
        </div>
      )}

      {/* Barra de Progresso */}
      <div className="max-w-6xl mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">📊 Progresso do Envio</h3>
            <span className="text-sm font-medium text-gray-600">
              {progresso.enviados}/{progresso.total} documentos obrigatórios
              {racaSalva && ' + Autodeclaração ✓'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progresso.percentual}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                progresso.percentual === 100 && racaSalva
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>0%</span>
            <span className="font-medium text-lg">
              {progresso.percentual === 100 && racaSalva ? (
                <span className="text-green-600">✅ Completo!</span>
              ) : (
                <span className="text-blue-600">{progresso.percentual}%</span>
              )}
            </span>
            <span>100%</span>
          </div>
        </motion.div>
      </div>

      {/* Instruções */}
      <div className="max-w-6xl mx-auto mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Atenção - Requisitos Importantes:</h3>
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
                    <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center ${doc.color}`}>
                      <doc.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{doc.label}</h3>
                      {isValidated && (
                        <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircleIcon className="w-3 h-3" />
                          Validado
                        </span>
                      )}
                      {isRejected && (
                        <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                          <XCircleIcon className="w-3 h-3" />
                          Rejeitado
                        </span>
                      )}
                      {isUploaded && !isValidated && !isRejected && (
                        <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                          <DocumentTextIcon className="w-3 h-3" />
                          Em análise
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informação adicional */}
                {doc.info && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      {doc.info}
                    </p>
                  </div>
                )}

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
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ArrowUpTrayIcon className="w-4 h-4" />
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

      {/* Seção de Dependentes */}
      <div className="max-w-6xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <UserGroupIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Documentos de Dependentes</h2>
              <p className="text-sm text-gray-600">Obrigatório para filhos de até 13 anos</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentosDependentes.map((doc, index) => {
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
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center ${doc.color}`}>
                        <doc.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{doc.label}</h3>
                        {isValidated && (
                          <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <CheckCircleIcon className="w-3 h-3" />
                            Validado
                          </span>
                        )}
                        {isRejected && (
                          <span className="text-xs text-red-600 flex items-center gap-1 mt-1">
                            <XCircleIcon className="w-3 h-3" />
                            Rejeitado
                          </span>
                        )}
                        {isUploaded && !isValidated && !isRejected && (
                          <span className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                            <DocumentTextIcon className="w-3 h-3" />
                            Em análise
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {doc.info && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-xs text-purple-800">{doc.info}</p>
                    </div>
                  )}

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
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    }`}
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ArrowUpTrayIcon className="w-4 h-4" />
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

          <p className="mt-4 text-xs text-gray-500 text-center italic">
            * Se você não possui filhos de até 13 anos, não é necessário enviar estes documentos.
          </p>
        </motion.div>
      </div>

      {/* Autodeclaração Racial */}
      <div className="max-w-6xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
            racaSalva ? 'border-green-500' : 'border-orange-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <GlobeAltIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Autodeclaração Racial</h2>
              <p className="text-sm text-gray-600">Conforme Lei nº 12.288/2010</p>
            </div>
            {racaSalva && (
              <span className="ml-auto flex items-center gap-1 text-green-600 font-medium">
                <CheckCircleIcon className="w-5 h-5" />
                Salvo
              </span>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 text-justify leading-relaxed">
              <strong>Informação importante:</strong> Esta autodeclaração atende a exigência do art. 39, § 8º, da Lei nº 
              12.288/2010, alterado pela Lei nº 14.553/2023 e da Portaria MTE nº 3.784/2023, que obriga a prestação 
              da informação nas inclusões, alterações ou retificações cadastrais dos trabalhadores ocorridas a partir 
              de 1º de janeiro de 2024, respeitando o critério de autodeclaração do trabalhador, em conformidade com 
              a classificação utilizada pelo Instituto Brasileiro de Geografia e Estatística - IBGE.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecione sua raça/cor:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {opcoesRaca.map((opcao) => (
                <label
                  key={opcao.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    racaSelecionada === opcao.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  } ${racaSalva ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="raca"
                    value={opcao.value}
                    checked={racaSelecionada === opcao.value}
                    onChange={(e) => setRacaSelecionada(e.target.value)}
                    disabled={racaSalva}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-medium text-gray-900">{opcao.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <label className={`flex items-start gap-3 cursor-pointer ${racaSalva ? 'opacity-60 cursor-not-allowed' : ''}`}>
              <input
                type="checkbox"
                checked={confirmacaoRaca}
                onChange={(e) => setConfirmacaoRaca(e.target.checked)}
                disabled={racaSalva}
                className="w-5 h-5 mt-0.5 text-orange-600 focus:ring-orange-500 rounded"
              />
              <span className="text-sm text-amber-900">
                <strong>Declaro</strong>, sob as penas da lei, que as informações prestadas nesta autodeclaração 
                são verdadeiras e que estou ciente de que a falsidade de declaração configura crime previsto 
                no art. 299 do Código Penal Brasileiro, sujeitando-me às sanções legais cabíveis. 
                Confirmo que a raça/cor selecionada corresponde à minha autoidentificação étnico-racial.
              </span>
            </label>
          </div>

          {!racaSalva && (
            <button
              onClick={handleSalvarAutodeclaracao}
              disabled={!racaSelecionada || !confirmacaoRaca || salvandoRaca}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                racaSelecionada && confirmacaoRaca && !salvandoRaca
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {salvandoRaca ? (
                <span className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Salvando...
                </span>
              ) : (
                'Confirmar Autodeclaração'
              )}
            </button>
          )}

          {racaSalva && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircleSolidIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Autodeclaração registrada com sucesso!</p>
              <p className="text-green-600 text-sm mt-1">
                Raça/cor declarada: <strong>{opcoesRaca.find(o => o.value === racaSelecionada)?.label}</strong>
              </p>
            </div>
          )}
        </motion.div>
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
