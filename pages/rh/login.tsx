import React, { useState } from "react";
import { apiPost } from "@/lib/api";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function RHLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiPost<{ token: string }>("/auth/login", { email, senha });
      localStorage.setItem("rh_token", data.token);
      router.push("/rh");
    } catch (err) {
      setError("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[100svh] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login RH</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/60" required />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button disabled={loading} className="btn-gradient w-full rounded-lg px-4 py-2 font-medium text-white disabled:opacity-60">{loading ? "Entrando..." : "Entrar"}</button>
        </form>
      </motion.div>
    </section>
  );
}
