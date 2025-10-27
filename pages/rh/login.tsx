import React, { useState } from "react";
import { apiPost } from "@/lib/api";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Mail, Lock, Shield } from "lucide-react";
import Link from "next/link";
import ChristmasAnimation from "@/components/ChristmasAnimation";

export default function RHLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showChristmas, setShowChristmas] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  // Verificar se sessão expirou
  React.useEffect(() => {
    if (router.query.expired === "true") {
      setSessionExpired(true);
    }
  }, [router.query]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Login real com backend
      const data = await apiPost<{ token: string }>("/auth/login", { email, senha });
      localStorage.setItem("rh_token", data.token);
      
      // Decodificar token para pegar o nome do usuário
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        setUserName(payload.nome || "");
      } catch {
        setUserName("");
      }
      
      // Mostrar animação de Natal
      setShowChristmas(true);
    } catch (err) {
      console.error("Erro de login:", err);
      setError("Credenciais inválidas. Verifique seu email e senha.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseChristmas = () => {
    setShowChristmas(false);
    router.push("/rh");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      {/* Link para voltar */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-600 hover:text-primary transition-colors font-medium flex items-center gap-2"
      >
        ← Voltar ao site
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card de Login */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Shield className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Painel RH</h1>
            <p className="text-white/90">Acesso exclusivo para RH</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                    placeholder="seu@email.com"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>

              {sessionExpired && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm"
                >
                  ⏰ Sua sessão expirou. Por favor, faça login novamente.
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button 
                disabled={loading} 
                className="w-full rounded-xl px-6 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Entrando..." : "Entrar no Painel"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Acesso restrito aos colaboradores do RH
            </p>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 FG Services - Todos os direitos reservados
          </p>
        </div>
      </motion.div>

      {/* Animação de Natal */}
      {showChristmas && (
        <ChristmasAnimation 
          userName={userName}
          onClose={handleCloseChristmas}
        />
      )}
    </section>
  );
}
