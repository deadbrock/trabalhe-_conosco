import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export default function DocumentosLoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const cpfLimpo = cpf.replace(/\D/g, '');
      
      const response = await axios.post(`${API_URL}/documentos/login`, {
        cpf: cpfLimpo,
        senha: senha.trim()
      });

      // Salvar token de autenticaÃ§Ã£o
      localStorage.setItem('documentos_token', response.data.token);
      
      // Redirecionar para pÃ¡gina de upload
      router.push('/documentos/upload');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      if (axios.isAxiosError(error) && error.response) {
        setErro(error.response.data.error || 'CPF ou senha invÃ¡lidos');
      } else {
        setErro('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen at-page flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="at-card overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center bg-gradient-to-br from-[#354A80] to-[#1f2937]">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FileText className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-semibold text-white mb-2">Envio de Documentos</h1>
            <p className="text-white/80">Acesse com seu CPF e a senha recebida</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* CPF */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={cpf}
                    onChange={handleCPFChange}
                    className="at-input pl-11 text-slate-900 placeholder:text-slate-400"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="at-input pl-11 text-slate-900 placeholder:text-slate-400"
                    placeholder="Senha recebida por email/WhatsApp"
                    maxLength={7}
                    required
                  />
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{erro}</span>
                </motion.div>
              )}

              {/* BotÃ£o */}
              <motion.button
                type="submit"
                disabled={loading || cpf.length < 14 || senha.length < 7}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full at-btn at-btn-primary h-[52px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Acessar Sistema
                  </>
                )}
              </motion.button>
            </form>

            {/* InformaÃ§Ãµes */}
            <div className="mt-6 rounded-[24px] border border-slate-200 bg-white/70 p-4">
              <p className="text-sm text-slate-900 font-medium mb-1">
                Verifique seu email e WhatsApp
              </p>
              <p className="text-xs text-slate-600">
                VocÃª recebeu um CPF e uma senha de 7 caracteres para acessar o sistema de envio de documentos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Â© 2025 Aestron
          </p>
        </div>
      </motion.div>
    </div>
  );
}

