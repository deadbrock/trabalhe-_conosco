import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Star } from "lucide-react";

type WelcomeAnimationProps = {
  userName: string;
  userEmail: string;
  onClose: () => void;
};

export default function WelcomeAnimation({ userName, userEmail, onClose }: WelcomeAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Efeito de confetes
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetes dos dois lados
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Fogos de artifício depois de 1 segundo
    setTimeout(() => {
      const count = 200;
      const defaults2 = {
        origin: { y: 0.7 },
        zIndex: 9999
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults2,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }, 1000);

    // Auto-fechar após 15 segundos
    const closeTimer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              duration: 0.8
            }}
            className="bg-white rounded-3xl p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
          >
            {/* Background gradient animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
            
            {/* Conteúdo */}
            <div className="relative z-10 text-center">
              {/* Ícones flutuantes */}
              <div className="flex justify-center gap-6 mb-6">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Star className="w-12 h-12 text-yellow-400" fill="currentColor" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-red-700 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Heart className="w-12 h-12 text-pink-500" fill="currentColor" />
                </motion.div>
              </div>

              {/* Mensagem principal */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Bem-vinda ao Time! 🎉
                </h1>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <p className="text-2xl font-bold text-gray-800">
                  Olá, {userName}! ✨
                </p>
                <p className="text-lg text-gray-600">
                  Estamos muito felizes em ter você no nosso sistema de RH!
                </p>
                <p className="text-md text-gray-500 italic">
                  {userEmail}
                </p>
              </motion.div>

              {/* Mensagem especial */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-2xl border-2 border-primary/20"
              >
                <p className="text-gray-700 font-semibold text-lg mb-2">
                  🚀 Seu acesso está liberado!
                </p>
                <p className="text-gray-600">
                  Explore o painel e comece a gerenciar vagas e candidatos agora mesmo.
                </p>
              </motion.div>

              {/* Botão */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShow(false);
                  setTimeout(onClose, 500);
                }}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-primary to-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Começar Agora! 🎯
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

