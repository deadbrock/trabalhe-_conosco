import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden">
      {/* Vídeo de fundo */}
      <div className="absolute inset-0">
        <div className="w-full aspect-video max-h-[100svh] mx-auto">
          <video
            className="h-full w-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
          />
        </div>
      </div>

      {/* Overlay escuro leve para legibilidade */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Partículas */}
      <div className="absolute inset-0">
        <div className="particles" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        >
          <span className="text-primary">Construa</span> seu futuro conosco
        </motion.h1>
        <p className="mt-4 text-white text-lg sm:text-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          <span className="typing" data-text="Tecnologia, impacto e crescimento acelerado." />
        </p>

        <motion.a
          href="#oportunidades"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-[#0a0a0a] bg-white hover:text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          Ver Oportunidades
        </motion.a>
      </div>
    </section>
  );
}

