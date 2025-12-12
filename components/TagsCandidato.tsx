import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import { TagsSkeleton } from './Skeleton';

interface TagType {
  id: number;
  nome: string;
  cor: string;
  criado_em?: string;
}

interface TagsCandidatoProps {
  candidatoId: number;
  readOnly?: boolean;
}

export default function TagsCandidato({ candidatoId, readOnly = false }: TagsCandidatoProps) {
  const [todasTags, setTodasTags] = useState<TagType[]>([]);
  const [tagsCandidato, setTagsCandidato] = useState<TagType[]>([]);
  const [mostrarSeletor, setMostrarSeletor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);

  const carregarTags = useCallback(async () => {
    try {
      const data = await apiGet<TagType[]>('/tags');
      setTodasTags(data);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
    }
  }, []);

  const carregarTagsCandidato = useCallback(async () => {
    setLoadingTags(true);
    try {
      const data = await apiGet<TagType[]>(`/tags/candidato/${candidatoId}`);
      setTagsCandidato(data);
    } catch (error) {
      console.error('Erro ao carregar tags do candidato:', error);
    } finally {
      setLoadingTags(false);
    }
  }, [candidatoId]);

  useEffect(() => {
    carregarTags();
    carregarTagsCandidato();
  }, [carregarTags, carregarTagsCandidato]);

  const adicionarTag = async (tagId: number) => {
    setLoading(true);
    try {
      const tagAdicionada = await apiPost<TagType>('/tags/candidato', {
        candidato_id: candidatoId,
        tag_id: tagId,
      });

      setTagsCandidato([...tagsCandidato, tagAdicionada]);
      setMostrarSeletor(false);
    } catch (error) {
      console.error('Erro ao adicionar tag:', error);
      alert('Erro ao adicionar tag');
    } finally {
      setLoading(false);
    }
  };

  const removerTag = async (tagId: number) => {
    try {
      await apiDelete(`/tags/candidato/${candidatoId}/${tagId}`);
      setTagsCandidato(tagsCandidato.filter((t) => t.id !== tagId));
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      alert('Erro ao remover tag');
    }
  };

  const tagsDisponiveis = todasTags.filter(
    (tag) => !tagsCandidato.some((t) => t.id === tag.id)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-primary" />
        Tags
      </h3>

      {/* Tags atuais */}
      <div className="flex flex-wrap gap-2 mb-4">
        {loadingTags ? (
          <TagsSkeleton />
        ) : tagsCandidato.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma tag adicionada</p>
        ) : (
          tagsCandidato.map((tag) => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: tag.cor }}
            >
              <span>{tag.nome}</span>
              {!readOnly && (
                <button
                  onClick={() => removerTag(tag.id)}
                  className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* BotÃ£o adicionar tag */}
      {!readOnly && (
        <>
          {!mostrarSeletor ? (
            <button
              onClick={() => setMostrarSeletor(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Tag
            </button>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Selecione uma tag:
                </span>
                <button
                  onClick={() => setMostrarSeletor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tagsDisponiveis.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    Todas as tags jÃ¡ foram adicionadas
                  </p>
                ) : (
                  tagsDisponiveis.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => adicionarTag(tag.id)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-full text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: tag.cor }}
                    >
                      {tag.nome}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

