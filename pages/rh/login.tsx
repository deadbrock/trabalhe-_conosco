import React, { useState, useRef, useEffect } from "react";
import { apiPost } from "@/lib/api";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Mail, Lock, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ChristmasAnimation from "@/components/ChristmasAnimation";

export default function RHLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showChristmas, setShowChristmas] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Verificar se sessão expirou
  React.useEffect(() => {
    if (router.query.expired === "true") {
      setSessionExpired(true);
    }
  }, [router.query]);

  // Inicializar áudio de Natal
  useEffect(() => {
    audioRef.current = new Audio('https://res.cloudinary.com/djbvjlw1m/video/upload/v1763408399/Bobby_Helms_-_Jingle_Bell_Rock_nIhs1T7OcZg_tpr0tv.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Volume baixo e agradável
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Toggle música
  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.log("Erro ao tocar música:", err);
      });
      setIsMusicPlaying(true);
    }
  };

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
      
      // Animação de Natal desabilitada
      // setShowChristmas(true);
      
      // Redirecionar diretamente para o painel
      router.push("/rh");
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
    <section className="min-h-screen bg-gradient-to-br from-red-900 via-green-900 to-red-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Neve caindo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomDelay = Math.random() * 5;
          const randomDuration = Math.random() * 5 + 5;
          const randomScale = Math.random() * 0.5 + 0.5;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-80"
              style={{ left: `${randomX}%` }}
              initial={{ 
                y: -20,
                scale: randomScale
              }}
              animate={{ 
                y: ['0vh', '100vh'],
                x: [`${randomX}%`, `${(randomX + Math.random() * 20 - 10)}%`],
              }}
              transition={{ 
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      {/* Luzes de Natal piscantes */}
      <div className="absolute top-0 left-0 right-0 h-8 flex justify-around items-center pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-4 h-4 rounded-full ${
              i % 3 === 0 ? 'bg-red-500' : i % 3 === 1 ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>

      {/* Estrelas brilhantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      
      {/* Link para voltar com tema natalino */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-white hover:text-yellow-300 transition-colors font-medium flex items-center gap-2 z-20 bg-red-600/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
      >
        🎄 ← Voltar ao site
      </Link>

      {/* Botão de Música Natalina */}
      <motion.button
        onClick={toggleMusic}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 right-6 group"
      >
        <div className="relative">
          {/* Anel pulsante */}
          {isMusicPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {/* Botão principal */}
          <div className="relative bg-gradient-to-r from-red-600 to-green-600 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
            {isMusicPlaying ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white" />
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              {isMusicPlaying ? "🎵 Pausar música" : "🎄 Música natalina"}
            </div>
          </div>
        </div>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card de Login com tema natalino */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-500/30 overflow-hidden relative">
          {/* Decoração de azevinho */}
          <div className="absolute top-4 right-4 text-3xl z-10 animate-bounce">🎅</div>
          <div className="absolute top-4 left-4 text-3xl z-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
          
          {/* Header com tema natalino */}
          <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-8 text-center relative overflow-hidden">
            {/* Flocos de neve no header */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white text-xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  ❄️
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10 overflow-hidden"
              style={{ backgroundColor: '#373f49' }}
            >
              <Image 
                src="/logo-aestron.png" 
                alt="AstronTalent Logo" 
                width={80} 
                height={80}
                className="object-contain"
                priority
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2 relative z-10 flex items-center justify-center gap-2">
              🎄 AstronTalent 🎄
            </h1>
            <p className="text-white/90 relative z-10">🎅 Feliz Natal! Acesso exclusivo para RH 🎁</p>
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

              <motion.button 
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-xl px-6 py-4 font-bold text-lg text-white bg-gradient-to-r from-red-600 via-green-600 to-red-600 hover:from-green-600 hover:via-red-600 hover:to-green-600 transition-all duration-500 shadow-lg hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "🎅 Entrando..." : "🎄 Entrar no AstronTalent 🎁"}
                </span>
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Acesso restrito aos colaboradores do RH
            </p>
          </div>
        </div>

        {/* Informações adicionais com tema natalino */}
        <motion.div 
          className="mt-6 text-center space-y-3"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 inline-block">
            <p className="text-sm text-white font-medium flex items-center gap-2 justify-center">
              ⭐ © 2025 Aestron - Feliz Natal e Próspero Ano Novo! 🎊
            </p>
          </div>
        </motion.div>
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
