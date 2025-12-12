import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';
  
  const animationClass = animation === 'pulse' 
    ? 'animate-pulse' 
    : 'animate-[wave_1.5s_ease-in-out_infinite]';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
      style={style}
    />
  );
}

// Skeleton para Card de Vaga
export function VagaSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="space-y-2">
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
        <Skeleton variant="rectangular" width={60} height={28} className="rounded-full" />
      </div>
      
      <Skeleton width="100%" height={20} className="mb-2" />
      <Skeleton width="80%" height={20} className="mb-4" />
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Skeleton width={80} height={12} className="mb-1" />
          <Skeleton width={100} height={16} />
        </div>
        <div>
          <Skeleton width={80} height={12} className="mb-1" />
          <Skeleton width={100} height={16} />
        </div>
      </div>

      <Skeleton width="100%" height={40} className="rounded-xl" />
    </div>
  );
}

// Skeleton para Card de Candidato
export function CandidatoSkeleton() {
  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton width={200} height={24} />
            <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Skeleton width={180} height={16} />
            <Skeleton width={150} height={16} />
            <Skeleton width={160} height={16} />
          </div>
          
          <div className="flex gap-3">
            <Skeleton width={200} height={16} />
            <Skeleton width={150} height={16} />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </div>
    </div>
  );
}

// Skeleton para Lista de ComentÃ¡rios
export function ComentariosSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton width={120} height={16} />
            <Skeleton width={80} height={12} />
          </div>
          <Skeleton width="100%" height={16} className="mb-1" />
          <Skeleton width="80%" height={16} />
        </div>
      ))}
    </div>
  );
}

// Skeleton para Tags
export function TagsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton 
          key={i} 
          variant="rectangular" 
          width={80 + i * 10} 
          height={32} 
          className="rounded-full" 
        />
      ))}
    </div>
  );
}

// Skeleton para Agendamentos
export function AgendamentosSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton width={150} height={18} />
            <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
          </div>
          <Skeleton width={200} height={14} className="mb-1" />
          <Skeleton width={180} height={14} />
        </div>
      ))}
    </div>
  );
}

