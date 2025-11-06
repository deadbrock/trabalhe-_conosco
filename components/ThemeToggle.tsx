import React from 'react';
import { Sparkles, Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { toggleTheme, isFeminine } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-300 smooth-hover
        ${isFeminine 
          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
      title={isFeminine ? 'Tema Feminino Ativo' : 'Ativar Tema Feminino'}
    >
      {isFeminine ? (
        <>
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Tema Feminino</span>
        </>
      ) : (
        <>
          <Palette className="w-4 h-4" />
          <span className="text-sm font-medium">Tema Padrão</span>
        </>
      )}
      
      {/* Indicator dot */}
      <div className={`
        w-2 h-2 rounded-full transition-all
        ${isFeminine ? 'bg-white' : 'bg-gray-500'}
      `} />
    </button>
  );
}

// Versão compacta (só ícone)
export function ThemeToggleCompact() {
  const { toggleTheme, isFeminine } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg transition-all duration-300
        hover-lift smooth-hover h-10 flex items-center justify-center
        ${isFeminine 
          ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-lg' 
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-pink-300'
        }
      `}
      title={isFeminine ? 'Desativar Tema Feminino' : 'Ativar Tema Feminino'}
    >
      {isFeminine ? (
        <Sparkles className="w-5 h-5 animate-pulse" />
      ) : (
        <Palette className="w-5 h-5" />
      )}
      
      {/* Badge indicator */}
      {isFeminine && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full border-2 border-white animate-pulse" />
      )}
    </button>
  );
}

