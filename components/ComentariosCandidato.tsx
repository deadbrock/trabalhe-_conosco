import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, Trash2, Star, StarOff } from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import { ComentariosSkeleton } from './Skeleton';

interface Comentario {
  id: number;
  candidato_id: number;
  usuario_id: number;
  usuario_nome: string;
  comentario: string;
  importante: boolean;
  criado_em: string;
}

interface ComentariosCandidatoProps {
  candidatoId: number;
  usuarioId: number;
  usuarioNome: string;
}

export default function ComentariosCandidato({
  candidatoId,
  usuarioId,
  usuarioNome,
}: ComentariosCandidatoProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [importante, setImportante] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingComentarios, setLoadingComentarios] = useState(true);

  const carregarComentarios = useCallback(async () => {
    setLoadingComentarios(true);
    try {
      const data = await apiGet<Comentario[]>(`/comentarios/${candidatoId}`);
      setComentarios(data);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComentarios(false);
    }
  }, [candidatoId]);

  // Carregar comentários
  useEffect(() => {
    carregarComentarios();
  }, [carregarComentarios]);

  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;

    setLoading(true);
    try {
      const comentarioCriado = await apiPost<Comentario>('/comentarios', {
        candidato_id: candidatoId,
        usuario_id: usuarioId,
        usuario_nome: usuarioNome,
        comentario: novoComentario,
        importante,
      });

      setComentarios([comentarioCriado, ...comentarios]);
      setNovoComentario('');
      setImportante(false);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      alert('Erro ao adicionar comentário');
    } finally {
      setLoading(false);
    }
  };

  const removerComentario = async (id: number) => {
    if (!confirm('Remover este comentário?')) return;

    try {
      await apiDelete(`/comentarios/${id}`);
      setComentarios(comentarios.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Erro ao remover comentário:', error);
      alert('Erro ao remover comentário');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Comentários ({comentarios.length})
      </h3>

      {/* Adicionar novo comentário */}
      <div className="mb-6">
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Adicione um comentário sobre este candidato..."
          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
        />
        
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={importante}
              onChange={(e) => setImportante(e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-600 flex items-center gap-1">
              {importante ? (
                <>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  Importante
                </>
              ) : (
                <>
                  <StarOff className="w-4 h-4 text-gray-400" />
                  Marcar como importante
                </>
              )}
            </span>
          </label>

          <button
            onClick={adicionarComentario}
            disabled={loading || !novoComentario.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>

      {/* Lista de comentários */}
      <div className="space-y-3">
        {loadingComentarios ? (
          <ComentariosSkeleton />
        ) : comentarios.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        ) : (
          comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className={`p-4 rounded-lg border ${
                comentario.importante
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {comentario.usuario_nome}
                    </span>
                    {comentario.importante && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                    <span className="text-xs text-gray-500">
                      {formatarData(comentario.criado_em)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comentario.comentario}
                  </p>
                </div>

                <button
                  onClick={() => removerComentario(comentario.id)}
                  className="ml-3 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover comentário"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

