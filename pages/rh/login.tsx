import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Mail, Lock } from "lucide-react";
import { apiPost } from "@/lib/api";
import { motion } from "framer-motion";
import ChristmasAnimation from "@/components/ChristmasAnimation";

type InputWithIconProps = {
  id: string;
  label: string;
  type: "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  Icon: React.ComponentType<{ className?: string }>;
};

function InputWithIcon({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  Icon,
}: InputWithIconProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-white/90">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
          <Icon className="h-5 w-5" />
        </span>
        <input
          id={id}
          aria-label={label}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="h-12 w-full rounded-[14px] border border-white/15 bg-white/10 pl-11 pr-4 text-white placeholder:text-white/50 outline-none transition
                     focus-visible:ring-2 focus-visible:ring-[#354A80]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f2937]
                     focus:border-white/30"
        />
      </div>
    </div>
  );
}

function LogoHeader() {
  // Verificar se estamos em dezembro
  const hoje = new Date();
  const isDezembro = hoje.getMonth() === 11; // 11 = dezembro (0-indexed)
  
  return (
    <div className="flex flex-col items-center text-center">
      {/* Logo */}
      <div className="mb-5 mt-8 flex items-center justify-center">
        <Image
          src="/logo-aestron.png"
          alt="Astron"
          width={560}
          height={250}
          priority
          className="h-36 sm:h-44 w-auto object-contain opacity-95 invert"
        />
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
        Astron
      </h1>
      <p className="mt-2 text-sm sm:text-base text-white/80">
        Sistema de Gestão de Talentos – Acesso RH
      </p>
      
      {/* Mensagem sutil de Natal apenas em dezembro */}
      {isDezembro && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 to-green-500/20 border border-white/10"
        >
          <p className="text-xs text-white/70">
            Feliz Natal • Season&apos;s Greetings
          </p>
        </motion.div>
      )}
    </div>
  );
}

function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden">
      {/* Neve sutil de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(25)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomDelay = Math.random() * 8;
          const randomDuration = Math.random() * 15 + 15;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${randomX}%`,
              }}
              initial={{
                y: '-5vh',
                opacity: 0.3,
              }}
              animate={{
                y: '105vh',
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: randomDuration,
                repeat: Infinity,
                ease: 'linear',
                delay: randomDelay,
              }}
            />
          );
        })}
      </div>

      {/* Gradiente suave decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 relative z-10">
        {children}
      </div>
    </section>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showChristmas, setShowChristmas] = useState(false);
  const [userName, setUserName] = useState("");
  const errorId = useId();

  useEffect(() => {
    if (router.query.expired === "true") setSessionExpired(true);
  }, [router.query.expired]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost<{ token: string; usuario?: { nome: string } }>("/auth/login", { email, senha });
      localStorage.setItem("rh_token", data.token);
      
      // Extrair nome do usuário do email ou da resposta
      const nome = data.usuario?.nome || email.split('@')[0];
      setUserName(nome);
      
      // Mostrar animação natalina antes de redirecionar
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
    <>
      {/* Animação de Natal após login */}
      {showChristmas && (
        <ChristmasAnimation 
          userName={userName} 
          onClose={handleCloseChristmas}
        />
      )}

      <BackgroundWrapper>
        <div className="w-full max-w-[460px]">
          {/* Card (glassmorphism) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-[28px] border border-white/20 bg-white/10 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden"
            role="region"
            aria-label="Login Astron"
          >
            {/* Brilho sutil no topo (efeito de neve refletida) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Accent decorativo minimalista */}
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-8 h-8 border-2 border-red-400/30 rounded-lg"
                style={{
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.1)',
                }}
              />
            </div>
          <LogoHeader />

          <form onSubmit={onSubmit} className="mt-8 space-y-5" aria-describedby={error ? errorId : undefined}>
            <InputWithIcon
              id="rh-email"
              label="E-mail"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              Icon={Mail}
            />

            <InputWithIcon
              id="rh-senha"
              label="Senha"
              type="password"
              value={senha}
              onChange={setSenha}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              Icon={Lock}
            />

            {sessionExpired && (
              <div className="rounded-[14px] border border-amber-200/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Sua sessão expirou. Por favor, faça login novamente.
              </div>
            )}

            {error && (
              <div
                id={errorId}
                className="rounded-[14px] border border-red-200/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                role="alert"
              >
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="h-[52px] w-full rounded-[14px] bg-[#354A80] text-white font-semibold shadow-sm transition
                         hover:-translate-y-[1px] hover:shadow-lg hover:bg-[#2d3d6b] active:translate-y-0
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         relative overflow-hidden group"
              aria-label="Entrar no Astron"
            >
              {/* Brilho sutil no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <span className="relative z-10">
                {loading ? "Entrando..." : "Entrar"}
              </span>
            </motion.button>

            <div className="text-center">
              {/* Personalize aqui: email/URL de suporte */}
              <a
                href="mailto:suporte@fgservices.com.br?subject=Esqueci%20minha%20senha%20-%20Astron"
                className="text-sm text-white/80 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f2937]"
              >
                Esqueci minha senha
              </a>
            </div>

            <div className="pt-1 text-center">
              <Link
                href="/"
                className="text-xs text-white/60 hover:text-white/80 transition
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f2937]"
              >
                Voltar ao site
              </Link>
            </div>
          </form>
          </motion.div>

          {/* Rodapé */}
          <footer className="mt-6 text-center">
            <p className="text-xs text-white/70">
              © 2025 Aestron – Sistema Astron
            </p>
          </footer>
        </div>
      </BackgroundWrapper>
    </>
  );
}
