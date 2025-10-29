import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award } from 'lucide-react';
import { apiPost } from '@/lib/api';

interface PontuacaoCandidatoProps {
  candidatoId: number;
  scoreAtual?: number;
}

export default function PontuacaoCandidato({
  candidatoId,
  scoreAtual = 0,
}: PontuacaoCandidatoProps) {
  const [score, setScore] = useState(scoreAtual);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScore(scoreAtual);
  }, [scoreAtual]);

  const recalcularPontuacao = async () => {
    setLoading(true);
    try {
      const result = await apiPost<{ candidatoId: string; score: number; message: string }>(`/pontuacao/calcular/${candidatoId}`, {});
      setScore(result.score);
      alert(`Pontuação atualizada: ${result.score} pontos`);
    } catch (error) {
      console.error('Erro ao recalcular pontuação:', error);
      alert('Erro ao recalcular pontuação');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-green-600 bg-green-100';
    if (score >= 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 50) return 'Excelente';
    if (score >= 30) return 'Bom';
    if (score >= 15) return 'Regular';
    return 'Baixo';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Pontuação
        </h3>

        <button
          onClick={recalcularPontuacao}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
        >
          <TrendingUp className="w-4 h-4" />
          {loading ? 'Calculando...' : 'Recalcular'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-24 h-24 rounded-full ${getScoreColor(
            score
          )}`}
        >
          <div className="text-center">
            <div className="text-3xl font-bold">{score}</div>
            <div className="text-xs font-medium">pontos</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-lg font-semibold text-gray-800">
              {getScoreLabel(score)}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                score >= 50
                  ? 'bg-green-500'
                  : score >= 30
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
              style={{ width: `${Math.min(100, (score / 60) * 100)}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Pontuação calculada automaticamente baseada em diversos critérios
          </p>
        </div>
      </div>

      {/* Legenda de critérios */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-2">
          Critérios de pontuação:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Tempo de resposta rápido: até +20 pontos</li>
          <li>• Localização próxima: +15 pontos</li>
          <li>• Currículo anexado: +10 pontos</li>
          <li>• Tags adicionadas: +5 pontos cada</li>
          <li>• Comentários importantes: +5 pontos cada</li>
          <li>• Status avançado: até +20 pontos</li>
        </ul>
      </div>
    </div>
  );
}

