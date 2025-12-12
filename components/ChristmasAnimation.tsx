import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ChristmasAnimationProps {
  userName?: string;
  onClose: () => void;
}

export default function ChristmasAnimation({ userName, onClose }: ChristmasAnimationProps) {
  const [countdown, setCountdown] = useState(8);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    // Não executar efeitos se já está mostrando agradecimento
    if (showThanks) return;
    // Confetes natalinos (vermelho e verde)
    const christmasConfetti = () => {
      const colors = ['#c41e3a', '#165b33', '#ffd700', '#ffffff'];
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    };

    // Efeito de neve caindo
    const snowfall = () => {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0 },
          colors: ['#ffffff', '#e8f4f8'],
          shapes: ['circle'],
          scalar: 0.8,
          gravity: 0.4,
          drift: 0.3,
        });

        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0 },
          colors: ['#ffffff', '#e8f4f8'],
          shapes: ['circle'],
          scalar: 0.8,
          gravity: 0.4,
          drift: -0.3,
        });
      }, 150);

      return interval;
    };

    // Fogos de artifício natalinos
    const christmasFireworks = () => {
      const end = Date.now() + 3000;
      const colors = ['#c41e3a', '#165b33', '#ffd700'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    };

    // Iniciar efeitos
    christmasConfetti();
    const snowInterval = snowfall();
    christmasFireworks();

    // Repetir confetes a cada 2 segundos
    const confettiInterval = setInterval(christmasConfetti, 2000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        console.log('🎄 Countdown Natal:', prev);
        if (prev <= 1) {
          console.log('✅ Natal acabou! Mostrando agradecimento...');
          clearInterval(countdownInterval);
          // Mostrar mensagem de agradecimento ao invés de fechar
          setShowThanks(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(confettiInterval);
      clearInterval(countdownInterval);
      clearInterval(snowInterval);
    };
  }, [showThanks]);

  // Log quando a tela de agradecimento é ativada
  useEffect(() => {
    if (showThanks) {
      console.log('🎉 Tela de agradecimento ativada!');
    }
  }, [showThanks]);

  // Calcular dias até o Natal
  const hoje = new Date();
  const natal = new Date(hoje.getFullYear(), 11, 25); // 25 de dezembro
  if (hoje > natal) {
    natal.setFullYear(natal.getFullYear() + 1);
  }
  const diasAteNatal = Math.ceil((natal.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  // Verificar se está nos dias de Natal (24, 25, 26, 27 de dezembro)
  const diaAtual = hoje.getDate();
  const mesAtual = hoje.getMonth(); // 11 = dezembro (0-indexed)
  const isDiasDeNatal = mesAtual === 11 && (diaAtual >= 24 && diaAtual <= 27);

  // Definir título e mensagem baseado na data
  const titulo = isDiasDeNatal ? "🎄 Feliz Natal! 🎄" : "🎄 Espírito Natalino! 🎄";
  const mensagemBemVindo = isDiasDeNatal 
    ? "Que esta época festiva traga muita alegria e sucesso! 🎅✨"
    : "A magia do Natal está chegando! Prepare-se para as festividades! ✨🎁";

  // Se deve mostrar mensagem de agradecimento
  if (showThanks) {
    console.log('🎉 Renderizando tela de agradecimento');
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0f4c81 0%, #1e3a5f 100%)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Corações flutuantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-red-500 opacity-70"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 20}px`,
                }}
                initial={{ y: '100vh' }}
                animate={{ y: '-20vh' }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5,
                }}
              >
                ❤️
              </motion.div>
            ))}
          </div>

          {/* Card de agradecimento */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-3xl mx-4 text-center border-4 border-blue-600"
            style={{
              boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)',
            }}
          >
            {/* Emoji de celebração */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Mais de 400 Candidaturas! 🚀
            </motion.h1>

            {/* Mensagem principal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              <p className="text-2xl text-gray-800 font-semibold">
                Uma Mensagem Especial de Agradecimento
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Quero expressar minha <span className="font-bold text-blue-600">profunda gratidão</span> a todos que 
                  confiaram neste sistema e depositaram suas esperanças em meu trabalho.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Cada uma das <span className="font-bold text-purple-600">400+ candidaturas</span> representa um sonho, 
                  uma oportunidade e a confiança que vocês depositaram em mim.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Este marco não seria possível sem a confiança da equipe de RH que acreditou nesta plataforma.
                </p>
                
                {/* Assinatura */}
                <div className="border-t-2 border-blue-300 pt-6 mt-6">
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    Com gratidão,
                  </p>
                  <motion.p
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Douglas Marques ✨
                  </motion.p>
                  <p className="text-sm text-gray-600 mt-2 italic">
                    Desenvolvedor do Sistema Trabalhe Conosco
                  </p>
                </div>
              </div>
            </motion.div>


            {/* Botão continuar sem countdown - usuário lê com calma */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
              >
                <span>💼</span>
                Acessar o Sistema
                <span>✨</span>
              </motion.button>
              <p className="text-xs text-gray-500 italic">Leia com calma, sem pressa! 😊</p>
            </motion.div>

            {/* Frase inspiradora */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-lg text-gray-600 italic font-medium"
            >
              &quot;Juntos, construímos oportunidades e realizamos sonhos!&quot; 🌟
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1f38 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Flocos de neve decorativos CSS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 5;
            const randomDuration = Math.random() * 10 + 10;
            const randomScale = Math.random() * 0.5 + 0.5;
            const randomSize = Math.random() * 20 + 10;
            
            return (
              <motion.div
                key={i}
                className="absolute text-white opacity-70"
                style={{
                  left: `${randomX}%`,
                  fontSize: `${randomSize}px`,
                }}
                initial={{
                  y: '-5vh',
                  scale: randomScale,
                }}
                animate={{
                  y: '105vh',
                  x: [`${randomX}%`, `${(randomX + Math.random() * 20 - 10)}%`],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: randomDelay,
                }}
              >
                ❄️
              </motion.div>
            );
          })}
        </div>

        {/* Card principal */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8,
          }}
          className="relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-2xl mx-4 text-center border-4 border-red-600"
          style={{
            boxShadow: '0 0 50px rgba(196, 30, 58, 0.3), 0 0 100px rgba(22, 91, 51, 0.2)',
          }}
        >
          {/* Decorações de Natal */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl"
            >
              🎄
            </motion.div>
          </div>

          <div className="absolute -top-4 -left-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              ⭐
            </motion.div>
          </div>

          <div className="absolute -top-4 -right-4">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-4xl"
            >
              🎁
            </motion.div>
          </div>

          {/* Contador de dias */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-green-600 text-white px-8 py-4 rounded-2xl shadow-xl">
              <span className="text-5xl">🎅</span>
              <div className="text-left">
                <p className="text-sm font-medium opacity-90">Faltam apenas</p>
                <p className="text-4xl font-bold">{diasAteNatal} dias</p>
                <p className="text-sm font-medium opacity-90">para o Natal!</p>
              </div>
              <span className="text-5xl">🎄</span>
            </div>
          </motion.div>

          {/* Mensagem de boas-vindas */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent">
              {titulo}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-2xl text-gray-700 mb-2 font-semibold"
            >
              {userName ? `Bem-vindo(a), ${userName}!` : 'Bem-vindo(a)!'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg text-gray-600 mb-6"
            >
              {mensagemBemVindo}
            </motion.p>
          </motion.div>

          {/* Emojis decorativos animados */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center gap-4 mb-6 text-4xl"
          >
            {['🎁', '⛄', '🔔', '🕯️', '🎅'].map((emoji, idx) => (
              <motion.span
                key={idx}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: idx * 0.2,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>

          {/* Apenas countdown, sem botão */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm text-gray-500">Aguarde {countdown}s para a mensagem especial...</p>
          </motion.div>

          {/* Mensagem especial */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-6 text-sm text-gray-500 italic"
          >
            &quot;O espírito natalino está no ar! Ho Ho Ho!&quot; 🎅🎄
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

