import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ChristmasAnimationProps {
  userName?: string;
  onClose: () => void;
}

export default function ChristmasAnimation({ userName, onClose }: ChristmasAnimationProps) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Confete sutil apenas no início
    const colors = ['#3b82f6', '#ef4444', '#10b981'];
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: colors,
      shapes: ['circle'],
      scalar: 0.8,
    });

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(onClose, 500); // Redirecionar automaticamente
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(countdownInterval);
    };
  }, [onClose]);

  // Verificar se é dezembro
  const hoje = new Date();
  const isDezembro = hoje.getMonth() === 11;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        {/* Partículas sutis de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Card principal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-12 max-w-md mx-4 text-center"
        >
          {/* Título */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 text-gray-900"
          >
            {userName ? `Bem-vindo, ${userName}` : 'Bem-vindo'}
          </motion.h1>

          {/* Mensagem */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            {isDezembro ? 'Season\'s Greetings • Dezembro 2025' : 'Login realizado com sucesso'}
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />

          {/* Contador */}
          <p className="text-sm text-gray-500">
            Redirecionando em {countdown}s...
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

