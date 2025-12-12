import React from 'react';

type CandidatoStatus = 'novo' | 'em_analise' | 'aprovado' | 'reprovado' | 'em_processo';
type AgendamentoStatus = 'agendado' | 'confirmado' | 'realizado' | 'cancelado';

interface StatusEmojiProps {
  status: CandidatoStatus | AgendamentoStatus | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const statusConfig: Record<string, { emoji: string; animation: string; label: string }> = {
  // Candidatos
  novo: {
    emoji: 'ðŸ†•',
    animation: 'animate-bounce',
    label: 'Novo',
  },
  em_analise: {
    emoji: 'ðŸ”',
    animation: 'animate-pulse',
    label: 'Em AnÃ¡lise',
  },
  aprovado: {
    emoji: 'âœ…',
    animation: 'animate-bounce',
    label: 'Aprovado',
  },
  reprovado: {
    emoji: 'âŒ',
    animation: 'animate-pulse',
    label: 'Reprovado',
  },
  em_processo: {
    emoji: 'âš™ï¸',
    animation: 'animate-spin-slow',
    label: 'Em Processo',
  },
  
  // Agendamentos
  agendado: {
    emoji: 'ðŸ“…',
    animation: 'animate-pulse',
    label: 'Agendado',
  },
  confirmado: {
    emoji: 'âœ…',
    animation: 'animate-bounce',
    label: 'Confirmado',
  },
  realizado: {
    emoji: 'ðŸŽ‰',
    animation: 'animate-bounce',
    label: 'Realizado',
  },
  cancelado: {
    emoji: 'ðŸš«',
    animation: 'animate-pulse',
    label: 'Cancelado',
  },
  
  // Outros
  pendente: {
    emoji: 'â³',
    animation: 'animate-pulse',
    label: 'Pendente',
  },
  concluido: {
    emoji: 'ðŸ†',
    animation: 'animate-bounce',
    label: 'ConcluÃ­do',
  },
  atencao: {
    emoji: 'âš ï¸',
    animation: 'animate-pulse',
    label: 'AtenÃ§Ã£o',
  },
  urgente: {
    emoji: 'ðŸ”¥',
    animation: 'animate-bounce',
    label: 'Urgente',
  },
  sucesso: {
    emoji: 'ðŸŽ¯',
    animation: 'animate-bounce',
    label: 'Sucesso',
  },
  estrela: {
    emoji: 'â­',
    animation: 'animate-spin-slow',
    label: 'Destaque',
  },
};

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-4xl',
};

export function StatusEmoji({ status, size = 'md', animated = true }: StatusEmojiProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pendente;
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-block ${sizeClass} ${animated ? config.animation : ''}`}
      title={config.label}
      role="img"
      aria-label={config.label}
    >
      {config.emoji}
    </span>
  );
}

// Componente para badge completo com emoji e texto
export function StatusBadge({ 
  status, 
  showEmoji = true, 
  showText = true 
}: { 
  status: CandidatoStatus | AgendamentoStatus | string; 
  showEmoji?: boolean; 
  showText?: boolean; 
}) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pendente;

  const colorClasses: Record<string, string> = {
    novo: 'bg-blue-100 text-blue-800 border-blue-200',
    em_analise: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    aprovado: 'bg-green-100 text-green-800 border-green-200',
    reprovado: 'bg-red-100 text-red-800 border-red-200',
    em_processo: 'bg-purple-100 text-purple-800 border-purple-200',
    agendado: 'bg-blue-100 text-blue-800 border-blue-200',
    confirmado: 'bg-green-100 text-green-800 border-green-200',
    realizado: 'bg-green-100 text-green-800 border-green-200',
    cancelado: 'bg-gray-100 text-gray-800 border-gray-200',
    pendente: 'bg-orange-100 text-orange-800 border-orange-200',
    concluido: 'bg-green-100 text-green-800 border-green-200',
    atencao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    urgente: 'bg-red-100 text-red-800 border-red-200',
    sucesso: 'bg-green-100 text-green-800 border-green-200',
    estrela: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const colorClass = colorClasses[status.toLowerCase()] || colorClasses.pendente;

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
        text-sm font-medium border-2 ${colorClass}
        transition-all duration-300 hover:scale-105 smooth-hover
      `}
    >
      {showEmoji && <StatusEmoji status={status} size="sm" animated={true} />}
      {showText && <span>{config.label}</span>}
    </span>
  );
}

// Componente para progresso visual com emojis
export function ProgressEmojis({ 
  current, 
  total 
}: { 
  current: number; 
  total: number; 
}) {
  const percentage = Math.round((current / total) * 100);
  
  let emoji = 'ðŸ”´';
  let animation = '';
  
  if (percentage >= 100) {
    emoji = 'ðŸŽ‰';
    animation = 'animate-bounce';
  } else if (percentage >= 75) {
    emoji = 'ðŸŸ¢';
    animation = 'animate-pulse';
  } else if (percentage >= 50) {
    emoji = 'ðŸŸ¡';
    animation = 'animate-pulse';
  } else if (percentage >= 25) {
    emoji = 'ðŸŸ ';
    animation = 'animate-pulse';
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-2xl ${animation}`}>{emoji}</span>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-700">
          {current} de {total} ({percentage}%)
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Adicionar animaÃ§Ã£o de spin lento ao CSS global
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
  `;
  document.head.appendChild(style);
}

