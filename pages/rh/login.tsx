import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
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
          className="h-12 w-full rounded-[14px] border border-white/20 bg-black/20 pl-11 pr-4 text-white placeholder:text-white/45 outline-none transition
                     focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                     focus:border-white/35"
        />
      </div>
    </div>
  );
}

function LoginHeader() {
  const hoje = new Date();
  const isDezembro = hoje.getMonth() === 11;

  return (
    <div className="flex flex-col items-center text-center pt-2">
      <h1 className="text-3xl sm:text-[2rem] font-bold tracking-tight text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.35)]">
        Trabalhe Conosco
      </h1>
      <p className="mt-3 text-sm sm:text-base text-white/85 max-w-sm leading-relaxed">
        Painel de gestão de talentos — acesso restrito ao RH
      </p>
      
      {/* Mensagem sutil de Natal apenas em dezembro */}
      {isDezembro && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-green-500/20 border border-white/10"
        >
          <p className="text-xs text-white/80 text-center leading-relaxed">
            Natal é tempo de renovar, agradecer e planejar o futuro.
            <br />
            <span className="font-semibold">Boas Festas!</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}

function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#1a0a12]">
      {/* Gradiente principal vermelho → azul */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#a2122a] via-[#5c1a3d] to-[#354a80]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-tl from-[#354a80]/90 via-transparent to-[#c41e3a]/40"
        aria-hidden
      />
      {/* Malha suave */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, white 0.5px, transparent 0.6px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[#a2122a]/35 blur-[100px]" />
        <div className="absolute -right-24 bottom-1/4 h-[380px] w-[380px] rounded-full bg-[#354a80]/45 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12">
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
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[28px] border border-white/25 bg-white/[0.12] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-10"
            role="region"
            aria-label="Login Trabalhe Conosco"
          >
            <div
              className="pointer-events-none absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-[#ff8a8a] via-white/85 to-[#8fb4e8]"
              aria-hidden
            />
          <LoginHeader />

          <form onSubmit={onSubmit} className="relative mt-8 space-y-5" aria-describedby={error ? errorId : undefined}>
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
              className="group relative h-[52px] w-full overflow-hidden rounded-[14px] bg-gradient-to-r from-[#a2122a] to-[#354a80] font-semibold text-white shadow-lg shadow-black/20 transition
                         hover:-translate-y-px hover:shadow-xl hover:brightness-[1.05] active:translate-y-0
                         disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
              aria-label="Entrar no painel Trabalhe Conosco"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] transition-transform duration-1000 group-hover:translate-x-[200%]" />
              
              <span className="relative z-10">
                {loading ? "Entrando..." : "Entrar"}
              </span>
            </motion.button>

            <div className="text-center">
              {/* Personalize aqui: email/URL de suporte */}
              <a
                href="mailto:suporte@fgservices.com.br?subject=Esqueci%20minha%20senha%20-%20Trabalhe%20Conosco%20RH"
                className="text-sm text-white/85 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Esqueci minha senha
              </a>
            </div>

            <div className="pt-1 text-center">
              <Link
                href="/"
                className="text-xs text-white/70 transition hover:text-white
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Voltar ao site
              </Link>
            </div>
          </form>
          </motion.div>

          {/* Rodapé */}
          <footer className="mt-6 text-center">
            <p className="text-xs text-white/75">
              © {new Date().getFullYear()} Trabalhe Conosco — painel RH
            </p>
          </footer>
        </div>
      </BackgroundWrapper>
    </>
  );
}
