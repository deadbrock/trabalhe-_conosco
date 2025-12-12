import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Mail, Lock } from "lucide-react";
import { apiPost } from "@/lib/api";

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
  return (
    <div className="flex flex-col items-center text-center">
      {/* Logo: personalize aqui (arquivo/cores). Dica: use uma versão branca/monocromática */}
      <div className="mb-5 flex items-center justify-center">
        <Image
          src="/logo-aestron.png"
          alt="Astron"
          width={490}
          height={220}
          priority
          className="h-30 sm:h-42 w-auto object-contain opacity-95 invert"
        />
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
        Astron
      </h1>
      <p className="mt-2 text-sm sm:text-base text-white/80">
        Sistema de Gestão de Talentos – Acesso RH
      </p>
    </div>
  );
}

function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-gradient-to-r from-[#354a80] to-[#1e2b50]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12">
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
  const errorId = useId();

  useEffect(() => {
    if (router.query.expired === "true") setSessionExpired(true);
  }, [router.query.expired]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost<{ token: string }>("/auth/login", { email, senha });
      localStorage.setItem("rh_token", data.token);
      router.push("/rh");
    } catch (err) {
      console.error("Erro de login:", err);
      setError("Credenciais inválidas. Verifique seu email e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <div className="w-full max-w-[460px]">
        {/* Card (glassmorphism) */}
        <div
          className="rounded-[28px] border border-white/15 bg-white/10 p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          role="region"
          aria-label="Login Astron"
        >
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

            <button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full rounded-[14px] bg-[#354A80] text-white font-semibold shadow-sm transition
                         hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              aria-label="Entrar no Astron"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

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
        </div>

        {/* Rodapé */}
        <footer className="mt-6 text-center text-xs text-white/70">
          © 2025 Aestron – Sistema Astron
        </footer>
      </div>
    </BackgroundWrapper>
  );
}
