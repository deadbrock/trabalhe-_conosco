/**
 * ðŸ“„ POLÃTICA DE PRIVACIDADE - LGPD
 * 
 * PÃ¡gina pÃºblica com as informaÃ§Ãµes sobre coleta e tratamento de dados
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PoliticaPrivacidade() {
  return (
    <>
      <Head>
        <title>PolÃ­tica de Privacidade | FG Services</title>
        <meta name="description" content="PolÃ­tica de Privacidade e ProteÃ§Ã£o de Dados Pessoais - LGPD" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              PolÃ­tica de Privacidade
            </h1>
            <p className="text-gray-600">
              Lei Geral de ProteÃ§Ã£o de Dados - LGPD (Lei nÂº 13.709/2018)
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ãšltima atualizaÃ§Ã£o: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* ConteÃºdo */}
          <div className="prose prose-lg max-w-none">
            {/* IntroduÃ§Ã£o */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. IntroduÃ§Ã£o</h2>
              <p className="text-gray-700 leading-relaxed">
                A <strong>FG Services</strong> (&quot;nÃ³s&quot;, &quot;nosso&quot; ou &quot;Empresa&quot;) estÃ¡ comprometida em proteger a privacidade e os dados pessoais de todos os candidatos que se inscrevem em nossos processos seletivos. Esta PolÃ­tica de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informaÃ§Ãµes pessoais, em conformidade com a Lei Geral de ProteÃ§Ã£o de Dados (LGPD - Lei nÂº 13.709/2018).
              </p>
            </section>

            {/* Dados Coletados */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dados Pessoais Coletados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Coletamos os seguintes tipos de dados pessoais quando vocÃª se candidata a uma vaga:
              </p>
              <div className="bg-indigo-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">ðŸ“‹ Dados de IdentificaÃ§Ã£o:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Nome completo</li>
                  <li>Email</li>
                  <li>Telefone</li>
                  <li>CPF</li>
                  <li>RG</li>
                  <li>Data de nascimento</li>
                  <li>EndereÃ§o completo (rua, cidade, estado, CEP)</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">ðŸ’¼ Dados Profissionais:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>CurrÃ­culo (PDF)</li>
                  <li>Cargo desejado</li>
                  <li>ExperiÃªncia profissional</li>
                  <li>FormaÃ§Ã£o acadÃªmica</li>
                  <li>Habilidades e competÃªncias</li>
                  <li>PretensÃ£o salarial</li>
                  <li>LinkedIn (opcional)</li>
                </ul>
              </div>
            </section>

            {/* Finalidade */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalidade do Tratamento de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos seus dados pessoais exclusivamente para as seguintes finalidades:
              </p>
              <div className="space-y-3">
                <div className="flex items-start bg-gray-50 rounded-lg p-4">
                  <span className="text-2xl mr-3">âœ…</span>
                  <div>
                    <strong className="text-gray-900">Processo Seletivo:</strong>
                    <p className="text-gray-700">Avaliar sua candidatura, realizar triagem, agendar entrevistas e comunicar resultados.</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 rounded-lg p-4">
                  <span className="text-2xl mr-3">âœ…</span>
                  <div>
                    <strong className="text-gray-900">ComunicaÃ§Ã£o:</strong>
                    <p className="text-gray-700">Enviar atualizaÃ§Ãµes sobre o status da sua candidatura, convites para entrevistas e feedback.</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 rounded-lg p-4">
                  <span className="text-2xl mr-3">âœ…</span>
                  <div>
                    <strong className="text-gray-900">Banco de Talentos:</strong>
                    <p className="text-gray-700">Manter seu perfil para futuras oportunidades compatÃ­veis (mediante seu consentimento).</p>
                  </div>
                </div>
                <div className="flex items-start bg-gray-50 rounded-lg p-4">
                  <span className="text-2xl mr-3">âœ…</span>
                  <div>
                    <strong className="text-gray-900">Cumprimento Legal:</strong>
                    <p className="text-gray-700">Atender obrigaÃ§Ãµes trabalhistas, fiscais e regulatÃ³rias.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Base Legal */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Legal para o Tratamento</h2>
              <p className="text-gray-700 leading-relaxed">
                O tratamento dos seus dados pessoais Ã© realizado com base nas seguintes hipÃ³teses legais previstas na LGPD:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                <li><strong>Consentimento:</strong> VocÃª autoriza expressamente o tratamento dos seus dados ao se candidatar.</li>
                <li><strong>ExecuÃ§Ã£o de Contrato:</strong> NecessÃ¡rio para avaliar sua aptidÃ£o para o cargo.</li>
                <li><strong>Cumprimento de ObrigaÃ§Ã£o Legal:</strong> Atendimento a requisitos trabalhistas e fiscais.</li>
                <li><strong>LegÃ­timo Interesse:</strong> ManutenÃ§Ã£o do banco de talentos para futuras oportunidades.</li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compartilhamento de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>NÃ³s NÃƒO vendemos, alugamos ou comercializamos seus dados pessoais.</strong> Seus dados podem ser compartilhados apenas nas seguintes situaÃ§Ãµes:
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>âš ï¸ Importante:</strong> Somente compartilhamos dados com terceiros quando estritamente necessÃ¡rio e sempre com garantias de proteÃ§Ã£o adequadas.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Empresas Contratantes:</strong> Clientes que publicaram a vaga para a qual vocÃª se candidatou.</li>
                <li><strong>Fornecedores de ServiÃ§os:</strong> Plataformas de email, armazenamento de arquivos (Cloudinary) e infraestrutura (Railway).</li>
                <li><strong>Autoridades Legais:</strong> Quando exigido por lei ou ordem judicial.</li>
              </ul>
            </section>

            {/* Armazenamento */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Armazenamento e SeguranÃ§a</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">ðŸ”’ Medidas de SeguranÃ§a:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Implementamos medidas tÃ©cnicas e organizacionais apropriadas para proteger seus dados contra acesso nÃ£o autorizado, perda, destruiÃ§Ã£o ou alteraÃ§Ã£o, incluindo:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2 ml-4">
                    <li>Criptografia de dados em trÃ¢nsito (SSL/TLS)</li>
                    <li>Controle de acesso restrito (autenticaÃ§Ã£o)</li>
                    <li>Armazenamento em servidores seguros</li>
                    <li>Backups regulares</li>
                    <li>Monitoramento de atividades suspeitas</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">â° PerÃ­odo de RetenÃ§Ã£o:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Seus dados serÃ£o mantidos pelo perÃ­odo necessÃ¡rio para:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2 ml-4">
                    <li><strong>Candidatura ativa:</strong> Durante todo o processo seletivo</li>
                    <li><strong>Banco de Talentos:</strong> AtÃ© 12 meses apÃ³s a candidatura (com seu consentimento)</li>
                    <li><strong>ObrigaÃ§Ãµes legais:</strong> Conforme exigido pela legislaÃ§Ã£o trabalhista (geralmente 5 anos)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Direitos do Titular */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Seus Direitos como Titular de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conforme a LGPD, vocÃª possui os seguintes direitos sobre seus dados pessoais:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">ðŸ“‹ ConfirmaÃ§Ã£o e Acesso</h4>
                  <p className="text-sm text-gray-700">Confirmar se tratamos seus dados e acessÃ¡-los.</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">âœï¸ CorreÃ§Ã£o</h4>
                  <p className="text-sm text-gray-700">Corrigir dados incompletos, inexatos ou desatualizados.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">ðŸ“¦ Portabilidade</h4>
                  <p className="text-sm text-gray-700">Exportar seus dados em formato estruturado.</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">ðŸ—‘ï¸ ExclusÃ£o</h4>
                  <p className="text-sm text-gray-700">Solicitar a eliminaÃ§Ã£o de dados desnecessÃ¡rios.</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">ðŸš« RevogaÃ§Ã£o</h4>
                  <p className="text-sm text-gray-700">Revogar seu consentimento a qualquer momento.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">â„¹ï¸ InformaÃ§Ã£o</h4>
                  <p className="text-sm text-gray-700">Saber sobre compartilhamento com terceiros.</p>
                </div>
              </div>
            </section>

            {/* Como Exercer Direitos */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Como Exercer Seus Direitos</h2>
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
                <h3 className="font-semibold text-indigo-900 mb-4 text-lg">ðŸ“ž Canais de Atendimento LGPD:</h3>
                <div className="space-y-3">
                  <div className="flex items-center bg-white rounded-lg p-3">
                    <span className="text-2xl mr-3">ðŸŒ</span>
                    <div>
                      <p className="font-medium text-gray-900">Portal de Dados:</p>
                      <Link href="/meus-dados" className="text-indigo-600 hover:text-indigo-700 underline">
                        www.fgservices.com.br/meus-dados
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-3">
                    <span className="text-2xl mr-3">ðŸ“§</span>
                    <div>
                      <p className="font-medium text-gray-900">Email do Encarregado (DPO):</p>
                      <a href="mailto:lgpd@fgservices.com.br" className="text-indigo-600 hover:text-indigo-700 underline">
                        lgpd@fgservices.com.br
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-3">
                    <span className="text-2xl mr-3">â±ï¸</span>
                    <div>
                      <p className="font-medium text-gray-900">Prazo de Resposta:</p>
                      <p className="text-gray-700">AtÃ© 48 horas Ãºteis</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies e Tecnologias de Rastreamento</h2>
              <p className="text-gray-700 leading-relaxed">
                Nosso site utiliza cookies essenciais para autenticaÃ§Ã£o e funcionamento bÃ¡sico. <strong>NÃƒO utilizamos cookies de rastreamento ou publicidade</strong>. Os cookies que usamos sÃ£o:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
                <li><strong>rh_token:</strong> Token de autenticaÃ§Ã£o (sessÃ£o do painel RH)</li>
                <li><strong>Cookies tÃ©cnicos:</strong> NecessÃ¡rios para o funcionamento do site</li>
              </ul>
            </section>

            {/* AlteraÃ§Ãµes */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. AlteraÃ§Ãµes nesta PolÃ­tica</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta PolÃ­tica de Privacidade periodicamente para refletir mudanÃ§as em nossas prÃ¡ticas ou na legislaÃ§Ã£o. Recomendamos que vocÃª revise esta pÃ¡gina regularmente. A data da Ãºltima atualizaÃ§Ã£o estÃ¡ indicada no topo desta polÃ­tica.
              </p>
            </section>

            {/* Contato */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Encarregado de Dados (DPO)</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Para questÃµes relacionadas Ã  proteÃ§Ã£o de dados pessoais, entre em contato com nosso Encarregado de ProteÃ§Ã£o de Dados:
                </p>
                <div className="space-y-2">
                  <p className="text-gray-900"><strong>Email:</strong> <a href="mailto:lgpd@fgservices.com.br" className="text-indigo-600 hover:text-indigo-700 underline">lgpd@fgservices.com.br</a></p>
                  <p className="text-gray-900"><strong>EndereÃ§o:</strong> Rua minas gerais, 137, Igarassu, PE</p>
                </div>
              </div>
            </section>

            {/* Consentimento */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Consentimento</h2>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  Ao se candidatar a uma vaga em nosso site e marcar a opÃ§Ã£o de consentimento no formulÃ¡rio de candidatura, vocÃª declara ter lido, compreendido e concordado com os termos desta PolÃ­tica de Privacidade, autorizando o tratamento dos seus dados pessoais conforme descrito.
                </p>
              </div>
            </section>
          </div>

          {/* Footer da PÃ¡gina */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              <strong>FG Services</strong> - Comprometidos com a proteÃ§Ã£o dos seus dados pessoais
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/meus-dados" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Portal de Dados Pessoais
              </Link>
              <span className="text-gray-300">â€¢</span>
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Voltar ao Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

