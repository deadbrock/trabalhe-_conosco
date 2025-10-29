import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Componente de borboleta flutuante
function Butterfly({ delay = 0, startX = 0, startY = 0 }: { delay?: number; startX?: number; startY?: number }) {
  return (
    <div
      className="butterfly-float"
      style={{
        position: 'fixed',
        left: `${startX}%`,
        top: `${startY}%`,
        fontSize: '2rem',
        animation: `butterflyFly 15s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6,
      }}
    >
      🦋
    </div>
  );
}

// Componente de flor flutuante
function Flower({ delay = 0, startX = 0 }: { delay?: number; startX?: number }) {
  const flowers = ['🌸', '🌺', '🌼', '🌻', '🌷'];
  const flower = flowers[Math.floor(Math.random() * flowers.length)];

  return (
    <div
      style={{
        position: 'fixed',
        left: `${startX}%`,
        top: '-10%',
        fontSize: '1.5rem',
        animation: 'flowerFall 10s linear infinite',
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.5,
      }}
    >
      {flower}
    </div>
  );
}

// Componente de sparkle (brilho)
function Sparkle({ delay = 0, x = 0, y = 0 }: { delay?: number; x?: number; y?: number }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: `${y}%`,
        fontSize: '1.2rem',
        animation: 'sparkleTwinkle 2s ease-in-out infinite',
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      ✨
    </div>
  );
}

// Container principal das animações delicadas
export default function DelicateAnimations() {
  const { isFeminine } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Só renderiza no tema feminino e depois do mount
  if (!mounted || !isFeminine) return null;

  return (
    <>
      {/* Borboletas - 3 flutuando */}
      <Butterfly delay={0} startX={10} startY={20} />
      <Butterfly delay={5} startX={80} startY={50} />
      <Butterfly delay={10} startX={50} startY={70} />

      {/* Flores caindo - 4 em tempos diferentes */}
      <Flower delay={0} startX={20} />
      <Flower delay={3} startX={60} />
      <Flower delay={6} startX={40} />
      <Flower delay={9} startX={75} />

      {/* Sparkles - 6 piscando em diferentes posições */}
      <Sparkle delay={0} x={15} y={15} />
      <Sparkle delay={0.5} x={85} y={25} />
      <Sparkle delay={1} x={30} y={60} />
      <Sparkle delay={1.5} x={70} y={80} />
      <Sparkle delay={2} x={50} y={40} />
      <Sparkle delay={2.5} x={90} y={60} />

      {/* Estilos CSS inline para animações */}
      <style jsx>{`
        @keyframes butterflyFly {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translate(30vw, 20vh) rotate(180deg);
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(0, 50vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes flowerFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes sparkleTwinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
}

// Componente para adicionar sparkles em hover em elementos específicos
export function SparkleOnHover({ children }: { children: React.ReactNode }) {
  const { isFeminine } = useTheme();
  const [showSparkles, setShowSparkles] = useState(false);

  if (!isFeminine) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowSparkles(true)}
      onMouseLeave={() => setShowSparkles(false)}
    >
      {children}
      {showSparkles && (
        <>
          <span className="absolute -top-2 -right-2 text-yellow-400 animate-ping">✨</span>
          <span className="absolute -bottom-2 -left-2 text-pink-400 animate-pulse">💖</span>
        </>
      )}
    </div>
  );
}

