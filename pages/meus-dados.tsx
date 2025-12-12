/**
 * ðŸ” PORTAL LGPD - SolicitaÃ§Ã£o de Dados Pessoais
 * 
 * PÃ¡gina pÃºblica onde candidatos podem:
 * - Exportar seus dados
 * - Solicitar exclusÃ£o de dados
 */

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiPost } from '../lib/api';

type TipoSolicitacao = 'exportacao' | 'exclusao' | null;

interface FormData {
  email: string;
  telefone: string;
  tipo: TipoSolicitacao;
}

interface SolicitacaoResponse {
  solicitacao_id: number;
  protocolo: string;
  tipo: string;
  email: string;
}

export default function MeusDados() {
  const [etapa, setEtapa] = useState<'formulario' | 'codigo' | 'sucesso'>('formulario');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    telefone: '',
    tipo: null
  });
  const [codigo, setCodigo] = useState('');
  const [solicitacao, setSolicitacao] = useState<SolicitacaoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // ==========================================
  // ETAPA 1: FormulÃ¡rio Inicial
  // ==========================================
  const handleSubmitFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.email || !formData.tipo) {
      setErro('Por favor, preencha todos os campos obrigatÃ³rios');
      return;
    }

    setLoading(true);

    try {
      const response = await apiPost<SolicitacaoResponse>('/lgpd/solicitar', formData);
      setSolicitacao(response);
      setEtapa('codigo');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setErro(err.response?.data?.error || 'Erro ao processar solicitaÃ§Ã£o');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ETAPA 2: Validar CÃ³digo
  // ==========================================
  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!codigo || codigo.length !== 6) {
      setErro('Por favor, insira o cÃ³digo de 6 dÃ­gitos');
      return;
    }

    setLoading(true);

    try {
      await apiPost('/lgpd/validar-codigo', {
        solicitacao_id: solicitacao?.solicitacao_id,
        codigo
      });
      setEtapa('sucesso');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setErro(err.response?.data?.error || 'CÃ³digo invÃ¡lido');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RENDERIZAÃ‡ÃƒO
  // ==========================================
  return (
    <>
      <Head>
        <title>Meus Dados Pessoais - LGPD | FG Services</title>
        <meta name="description" content="Solicite acesso, exportaÃ§Ã£o ou exclusÃ£o dos seus dados pessoais" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meus Dados Pessoais
            </h1>
            <p className="text-gray-600">
              Gerencie seus dados conforme a Lei Geral de ProteÃ§Ã£o de Dados (LGPD)
            </p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* ETAPA 1: FormulÃ¡rio */}
            {etapa === 'formulario' && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Solicitar Acesso aos Meus Dados
                </h2>

                <form onSubmit={handleSubmitFormulario} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Use o mesmo email cadastrado em sua candidatura
                    </p>
                  </div>

                  {/* Telefone */}
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone (Opcional)
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  {/* Tipo de SolicitaÃ§Ã£o */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      O que vocÃª deseja fazer? *
                    </label>
                    <div className="space-y-3">
                      {/* Exportar */}
                      <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.tipo === 'exportacao' 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}>
                        <input
                          type="radio"
                          name="tipo"
                          value="exportacao"
                          checked={formData.tipo === 'exportacao'}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoSolicitacao })}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">ðŸ“¦ Exportar Meus Dados</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Receba uma cÃ³pia de todos os seus dados pessoais que temos armazenados
                          </div>
                        </div>
                      </label>

                      {/* Excluir */}
                      <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.tipo === 'exclusao' 
                          ? 'border-red-600 bg-red-50' 
                          : 'border-gray-200 hover:border-red-300'
                      }`}>
                        <input
                          type="radio"
                          name="tipo"
                          value="exclusao"
                          checked={formData.tipo === 'exclusao'}
                          onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoSolicitacao })}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">ðŸ—‘ï¸ Excluir Meus Dados</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Solicite a exclusÃ£o permanente de todos os seus dados pessoais
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Alerta ExclusÃ£o */}
                  {formData.tipo === 'exclusao' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-yellow-900">âš ï¸ AtenÃ§Ã£o</h4>
                          <p className="text-sm text-yellow-800 mt-1">
                            A exclusÃ£o de dados Ã© <strong>irreversÃ­vel</strong>. VocÃª nÃ£o poderÃ¡ se candidatar novamente com os mesmos dados. Certifique-se de que realmente deseja prosseguir.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Erro */}
                  {erro && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                      {erro}
                    </div>
                  )}

                  {/* BotÃ£o */}
                  <button
                    type="submit"
                    disabled={loading || !formData.tipo}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Processando...' : 'Enviar SolicitaÃ§Ã£o'}
                  </button>
                </form>

                {/* InformaÃ§Ãµes LGPD */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">ðŸ“‹ Seus Direitos LGPD</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2">âœ“</span>
                      <span>Acessar seus dados pessoais</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">âœ“</span>
                      <span>Solicitar correÃ§Ã£o de dados incorretos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">âœ“</span>
                      <span>Exportar seus dados em formato estruturado</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">âœ“</span>
                      <span>Solicitar exclusÃ£o de dados pessoais</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">âœ“</span>
                      <span>Revogar consentimento a qualquer momento</span>
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* ETAPA 2: Validar CÃ³digo */}
            {etapa === 'codigo' && solicitacao && (
              <>
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Verifique seu Email
                  </h2>
                  <p className="text-gray-600">
                    Enviamos um cÃ³digo de 6 dÃ­gitos para<br />
                    <strong>{solicitacao.email}</strong>
                  </p>
                </div>

                <form onSubmit={handleValidarCodigo} className="space-y-6">
                  {/* Campo CÃ³digo */}
                  <div>
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                      Digite o CÃ³digo de VerificaÃ§Ã£o
                    </label>
                    <input
                      type="text"
                      id="codigo"
                      required
                      maxLength={6}
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-4 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="000000"
                      autoComplete="off"
                    />
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      VÃ¡lido por 15 minutos
                    </p>
                  </div>

                  {/* Protocolo */}
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">Protocolo da SolicitaÃ§Ã£o</p>
                    <p className="font-mono font-bold text-gray-900">{solicitacao.protocolo}</p>
                  </div>

                  {/* Erro */}
                  {erro && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                      {erro}
                    </div>
                  )}

                  {/* BotÃµes */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading || codigo.length !== 6}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Validando...' : 'Confirmar CÃ³digo'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEtapa('formulario');
                        setCodigo('');
                        setErro('');
                      }}
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                  </div>
                </form>

                {/* NÃ£o recebeu? */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  NÃ£o recebeu o cÃ³digo?{' '}
                  <button
                    onClick={() => setEtapa('formulario')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Solicitar novamente
                  </button>
                </div>
              </>
            )}

            {/* ETAPA 3: Sucesso */}
            {etapa === 'sucesso' && solicitacao && (
              <>
                <div className="text-center">
                  <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    âœ… SolicitaÃ§Ã£o Confirmada!
                  </h2>

                  <p className="text-gray-600 mb-8">
                    Sua solicitaÃ§Ã£o de <strong>{solicitacao.tipo === 'exportacao' ? 'ExportaÃ§Ã£o' : 'ExclusÃ£o'}</strong> foi recebida e estÃ¡ sendo processada.
                  </p>

                  <div className="bg-indigo-50 rounded-lg p-6 mb-8">
                    <div className="text-sm text-gray-600 mb-2">Protocolo</div>
                    <div className="font-mono text-xl font-bold text-indigo-600 mb-4">
                      {solicitacao.protocolo}
                    </div>
                    <div className="text-sm text-gray-600">
                      Guarde este nÃºmero para acompanhamento
                    </div>
                  </div>

                  <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
                    <h3 className="font-medium text-gray-900 mb-3">ðŸ“§ PrÃ³ximos Passos</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        <span>Nossa equipe irÃ¡ analisar sua solicitaÃ§Ã£o</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        <span>VocÃª receberÃ¡ uma confirmaÃ§Ã£o por email em atÃ© <strong>48 horas Ãºteis</strong></span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        <span>
                          {solicitacao.tipo === 'exportacao' 
                            ? 'Seus dados serÃ£o enviados por email em formato estruturado'
                            : 'VocÃª receberÃ¡ um comprovante de exclusÃ£o quando o processo for concluÃ­do'
                          }
                        </span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Voltar ao InÃ­cio
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Para dÃºvidas sobre o tratamento de dados pessoais:
            </p>
            <a href="mailto:lgpd@fgservices.com.br" className="text-indigo-600 hover:text-indigo-700 font-medium">
              lgpd@fgservices.com.br
            </a>
            <p className="mt-4">
              <Link href="/politica-privacidade" className="text-indigo-600 hover:text-indigo-700">
                PolÃ­tica de Privacidade
              </Link>
              {' â€¢ '}
              <Link href="/" className="text-indigo-600 hover:text-indigo-700">
                Voltar ao Site
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

