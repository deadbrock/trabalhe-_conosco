import React from 'react';
import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react';

type TimelineStep = {
  label: string;
  status: 'completed' | 'current' | 'pending' | 'failed';
  date?: string;
  description?: string;
};

interface CandidateTimelineProps {
  currentStatus: string;
}

export default function CandidateTimeline({ currentStatus }: CandidateTimelineProps) {
  // Mapeamento de status para Ã­ndice na timeline
  const statusOrder: Record<string, number> = {
    'novo': 0,
    'em_analise': 1,
    'entrevista': 2,
    'aprovado': 3,
    'reprovado': -1,
  };

  const currentStep = statusOrder[currentStatus] ?? 0;
  const isFailed = currentStatus === 'reprovado';

  const steps: TimelineStep[] = [
    {
      label: 'InscriÃ§Ã£o',
      status: currentStep >= 0 ? 'completed' : 'pending',
      description: 'Candidatura recebida',
    },
    {
      label: 'Em AnÃ¡lise',
      status: isFailed ? 'failed' : currentStep >= 1 ? 'completed' : currentStep === 0 ? 'current' : 'pending',
      description: 'Triagem de currÃ­culo',
    },
    {
      label: 'Entrevista',
      status: isFailed ? 'failed' : currentStep >= 2 ? 'completed' : currentStep === 1 ? 'current' : 'pending',
      description: 'Processo seletivo',
    },
    {
      label: isFailed ? 'Reprovado' : 'Aprovado',
      status: isFailed ? 'failed' : currentStep >= 3 ? 'completed' : currentStep === 2 ? 'current' : 'pending',
      description: isFailed ? 'Processo finalizado' : 'Candidato selecionado',
    },
  ];

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Linha de progresso horizontal */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isFailed ? 'bg-red-400' : 'bg-gradient-to-r from-primary to-secondary'
            }`}
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
              {/* Ãcone do step */}
              <div className="relative z-10 mb-3">
                {step.status === 'completed' && (
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-once">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
                {step.status === 'current' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                )}
                {step.status === 'pending' && (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <Circle className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                {step.status === 'failed' && (
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Label e descriÃ§Ã£o */}
              <div className="text-center">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    step.status === 'completed'
                      ? 'text-green-600'
                      : step.status === 'current'
                      ? 'text-primary'
                      : step.status === 'failed'
                      ? 'text-red-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adicionar animaÃ§Ã£o de bounce-once */}
      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Componente de progresso circular
export function CircularProgress({ 
  percentage, 
  size = 120, 
  strokeWidth = 10,
  label 
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number; 
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let color = '#ef4444'; // red
  if (percentage >= 75) color = '#22c55e'; // green
  else if (percentage >= 50) color = '#eab308'; // yellow
  else if (percentage >= 25) color = '#f97316'; // orange

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        {label && <span className="text-xs text-gray-500 mt-1">{label}</span>}
      </div>
    </div>
  );
}

// Componente de barra de progresso estilizada
export function ProgressBar({ 
  current, 
  total, 
  label,
  showPercentage = true 
}: { 
  current: number; 
  total: number; 
  label?: string;
  showPercentage?: boolean;
}) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-primary">
              {current}/{total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

