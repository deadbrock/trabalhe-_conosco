import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Job, getJobById } from "@/lib/jobs";
import { ArrowLeft, MapPin, Briefcase, FileText, CheckCircle2, User, Mail, Phone, Upload, Calendar, Home } from "lucide-react";

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [job, setJob] = useState<Job | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  useEffect(() => {
    async function loadJob() {
      if (!id) return;
      setLoadingJob(true);
      const jobData = await getJobById(id);
      setJob(jobData);
      setLoadingJob(false);
    }
    loadJob();
  }, [id]);

  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    email: "",
    telefone: "",
    estado: "",
    cidade: "",
    bairro: "",
  });
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [consentimentoLGPD, setConsentimentoLGPD] = useState(false);
  const [showModalLGPD, setShowModalLGPD] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Máscara para CPF (apenas números e formatação)
    if (name === "cpf") {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, "");
      // Limita a 11 dígitos
      const limitedNumbers = numbers.slice(0, 11);
      // Aplica máscara: 000.000.000-00
      formattedValue = limitedNumbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // Máscara para Telefone (apenas números e formatação)
    if (name === "telefone") {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, "");
      // Limita a 11 dígitos
      const limitedNumbers = numbers.slice(0, 11);
      // Aplica máscara: (00) 00000-0000 ou (00) 0000-0000
      if (limitedNumbers.length <= 10) {
        formattedValue = limitedNumbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        formattedValue = limitedNumbers
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2");
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurriculo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação obrigatória do currículo
    if (!curriculo) {
      setError("Por favor, envie seu currículo em PDF.");
      setLoading(false);
      return;
    }

    // Validação do tamanho do arquivo (máx 5MB)
    if (curriculo.size > 5 * 1024 * 1024) {
      setError("O currículo deve ter no máximo 5MB.");
      setLoading(false);
      return;
    }

    // Validação do CPF (deve ter 11 dígitos)
    const cpfNumbers = formData.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      setError("Por favor, preencha um CPF válido com 11 dígitos.");
      setLoading(false);
      return;
    }

    // Validação do telefone (deve ter 10 ou 11 dígitos)
    const phoneNumbers = formData.telefone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setError("Por favor, preencha um telefone válido.");
      setLoading(false);
      return;
    }

    // Validação do consentimento LGPD
    if (!consentimentoLGPD) {
      setError("Por favor, aceite os termos de consentimento de dados para prosseguir.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("cpf", formData.cpf);
      formDataToSend.append("data_nascimento", formData.data_nascimento);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telefone", formData.telefone);
      formDataToSend.append("estado", formData.estado);
      formDataToSend.append("cidade", formData.cidade);
      formDataToSend.append("bairro", formData.bairro);
      formDataToSend.append("vaga_id", id || "");
      formDataToSend.append("curriculo", curriculo);
      formDataToSend.append("consentimento_lgpd", "true");
      formDataToSend.append("data_consentimento", new Date().toISOString());
      formDataToSend.append("ip_consentimento", "web");

      const API_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3333";
      const response = await fetch(`${API_URL}/candidatos`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        // Tentar ler a mensagem de erro do backend
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "Erro ao enviar candidatura. Tente novamente.";
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setFormData({
        nome: "",
        cpf: "",
        data_nascimento: "",
        email: "",
        telefone: "",
        estado: "",
        cidade: "",
        bairro: "",
      });
      setCurriculo(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Erro:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingJob) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando vaga...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!job) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vaga não encontrada</h2>
            <p className="text-gray-600 mb-6">A vaga que você está procurando não existe ou foi removida.</p>
            <Link
              href="/#oportunidades"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-red-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver Outras Vagas
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Processar requisitos (pode vir como string com quebras de linha ou array)
  const requisitos = job.requisitos 
    ? job.requisitos.split('\n').filter(r => r.trim())
    : [];

  const diferenciais = job.diferenciais
    ? job.diferenciais.split('\n').filter(d => d.trim())
    : [];

  return (
    <section className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 py-12 px-4">
        {/* Breadcrumb / Voltar */}
        <div className="mx-auto max-w-6xl mb-8">
          <Link
            href="/#oportunidades"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para vagas
          </Link>
        </div>

        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Coluna esquerda: detalhes da vaga */}
          <article className="space-y-6">
            {/* Card do cabeçalho */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-grow">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    {job.titulo}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      <Briefcase className="w-4 h-4" />
                      {job.tipo_contrato}
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                      <MapPin className="w-4 h-4" />
                      {job.endereco}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-sm font-bold">
                  Nova
                </div>
              </div>
            </div>

            {/* Card da descrição */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-red-600 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Descrição</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {job.descricao}
              </p>
            </div>

            {/* Card dos requisitos */}
            {requisitos.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-blue-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Requisitos</h2>
                </div>
                <ul className="space-y-3">
                  {requisitos.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Card dos diferenciais */}
            {diferenciais.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Diferenciais</h2>
                </div>
                <ul className="space-y-3">
                  {diferenciais.map((dif, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-lg">
                      <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{dif}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Coluna direita: formulário de candidatura */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate-se</h2>
                <p className="text-gray-600">Preencha seus dados e envie seu currículo</p>
              </div>
              
              {success && (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Candidatura enviada com sucesso!</h4>
                    <p className="text-green-700 text-sm">Recebemos sua candidatura. Entraremos em contato em breve!</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4">
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                      placeholder="Seu nome completo" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">CPF *</label>
                    <input 
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                      placeholder="000.000.000-00" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Nascimento *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="date"
                        name="data_nascimento"
                        value={formData.data_nascimento}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                      placeholder="seu@email.com" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                      placeholder="(00) 00000-0000" 
                    />
                  </div>
                </div>

                {/* Seção de Endereço */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold text-gray-900">Endereço</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
                        <select 
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900"
                        >
                          <option value="">Selecione</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cidade *</label>
                        <input 
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                          placeholder="Sua cidade" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro *</label>
                      <input 
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                        placeholder="Seu bairro" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currículo (PDF) *
                    <span className="text-xs font-normal text-gray-500 ml-2">(máx. 5MB)</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-primary file:to-red-700 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:shadow-lg file:transition-all cursor-pointer" 
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    {curriculo ? `✓ ${curriculo.name}` : "Nenhum arquivo escolhido - obrigatório"}
                  </p>
                </div>

                {/* Consentimento LGPD */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={consentimentoLGPD}
                      onChange={(e) => setConsentimentoLGPD(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      Autorizo a coleta e tratamento dos meus dados pessoais conforme a{" "}
                      <Link 
                        href="/politica-privacidade" 
                        target="_blank"
                        className="text-primary font-semibold hover:underline"
                      >
                        Política de Privacidade
                      </Link>
                      {" "}e a{" "}
                      <button
                        type="button"
                        onClick={() => setShowModalLGPD(true)}
                        className="text-primary font-semibold hover:underline"
                      >
                        LGPD
                      </button>
                      . *
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 ml-8">
                    Você pode solicitar a exclusão dos seus dados a qualquer momento através do{" "}
                    <Link href="/meus-dados" target="_blank" className="text-primary hover:underline">
                      Portal de Dados Pessoais
                    </Link>.
                  </p>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl px-6 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar Candidatura"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal LGPD */}
      {showModalLGPD && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModalLGPD(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Termo de Consentimento LGPD</h3>
              <button
                onClick={() => setShowModalLGPD(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
              <p className="font-semibold">
                Ao se candidatar a uma vaga na FG Services, você autoriza expressamente:
              </p>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">📋 Dados Coletados:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Nome completo, CPF, RG, data de nascimento</li>
                  <li>Email, telefone e endereço completo</li>
                  <li>Currículo e informações profissionais</li>
                  <li>Dados da candidatura e processos seletivos</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✅ Finalidade do Tratamento:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Avaliação da sua candidatura</li>
                  <li>Comunicação sobre o processo seletivo</li>
                  <li>Manutenção no banco de talentos (com seu consentimento)</li>
                  <li>Cumprimento de obrigações legais trabalhistas</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">🔒 Seus Direitos (LGPD):</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Acessar e corrigir seus dados</li>
                  <li>Solicitar exportação em formato estruturado</li>
                  <li>Solicitar exclusão dos dados</li>
                  <li>Revogar consentimento a qualquer momento</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm">
                  <strong>⚠️ Importante:</strong> Seus dados serão mantidos por até 12 meses após a candidatura, podendo ser excluídos mediante solicitação através do{" "}
                  <Link href="/meus-dados" target="_blank" className="text-primary font-semibold hover:underline">
                    Portal de Dados Pessoais
                  </Link>
                  .
                </p>
              </div>

              <p className="text-sm italic">
                Para mais informações, consulte nossa{" "}
                <Link href="/politica-privacidade" target="_blank" className="text-primary font-semibold hover:underline">
                  Política de Privacidade completa
                </Link>
                .
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setConsentimentoLGPD(true);
                  setShowModalLGPD(false);
                }}
                className="flex-1 bg-gradient-to-r from-primary to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Aceitar e Fechar
              </button>
              <button
                onClick={() => setShowModalLGPD(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

