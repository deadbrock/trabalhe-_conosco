import React, { useState } from 'react';
import { StickyNote, Star, Trash2, Edit2, Save, X } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type Nota = {
  id: number;
  candidato_id: number;
  usuario_id: number;
  usuario_nome: string;
  nota: string;
  privada: boolean;
  criado_em: string;
  atualizado_em: string;
};

type Avaliacao = {
  id: number;
  candidato_id: number;
  usuario_id: number;
  usuario_nome: string;
  comunicacao?: number;
  experiencia_tecnica?: number;
  fit_cultural?: number;
  apresentacao?: number;
  disponibilidade?: number;
  nota_geral: number;
  comentario?: string;
  criado_em: string;
};

type AvaliacaoResponse = {
  avaliacoes: Avaliacao[];
  media: {
    media_comunicacao: number;
    media_experiencia: number;
    media_fit_cultural: number;
    media_apresentacao: number;
    media_disponibilidade: number;
    media_geral: number;
    total_avaliacoes: number;
  };
};

// Componente de Notas Rápidas
export function NotasRapidas({ candidatoId, usuarioId }: { 
  candidatoId: number; 
  usuarioId: number;
}) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaNota, setNovaNota] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEditando, setTextoEditando] = useState('');

  const carregarNotas = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet<Nota[]>(`/notas/candidato/${candidatoId}`);
      setNotas(data);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  }, [candidatoId]);

  React.useEffect(() => {
    carregarNotas();
  }, [carregarNotas]);

  const adicionarNota = async () => {
    if (!novaNota.trim()) return;

    try {
      await apiPost('/notas', {
        candidato_id: candidatoId,
        nota: novaNota,
        privada: true
      });
      setNovaNota('');
      await carregarNotas();
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
      alert('Erro ao adicionar nota');
    }
  };

  const iniciarEdicao = (nota: Nota) => {
    setEditandoId(nota.id);
    setTextoEditando(nota.nota);
  };

  const salvarEdicao = async (id: number) => {
    try {
      await apiPut(`/notas/${id}`, { nota: textoEditando });
      setEditandoId(null);
      setTextoEditando('');
      await carregarNotas();
    } catch (error) {
      console.error('Erro ao editar nota:', error);
      alert('Erro ao editar nota');
    }
  };

  const excluirNota = async (id: number) => {
    if (!confirm('Excluir esta nota?')) return;

    try {
      await apiDelete(`/notas/${id}`);
      await carregarNotas();
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
      alert('Erro ao excluir nota');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Adicionar Nova Nota */}
      <div className="bg-yellow-50 rounded-lg border-2 border-yellow-200 p-4">
        <div className="flex items-start gap-2">
          <StickyNote className="w-5 h-5 text-yellow-600 mt-1" />
          <div className="flex-1">
            <textarea
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              placeholder="Adicionar nota rápida..."
              className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={3}
            />
            <button
              onClick={adicionarNota}
              disabled={!novaNota.trim()}
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Adicionar Nota
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Notas */}
      <AnimatePresence>
        {notas.map((nota) => (
          <motion.div
            key={nota.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            {editandoId === nota.id ? (
              // Modo de edição
              <div className="space-y-2">
                <textarea
                  value={textoEditando}
                  onChange={(e) => setTextoEditando(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => salvarEdicao(nota.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setEditandoId(null);
                      setTextoEditando('');
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo de visualização
              <>
                <p className="text-sm text-gray-900 mb-2 whitespace-pre-wrap">{nota.nota}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Por <strong>{nota.usuario_nome}</strong> em {formatarData(nota.criado_em)}
                  </span>
                  {nota.usuario_id === usuarioId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => iniciarEdicao(nota)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => excluirNota(nota.id)}
                        className="p-1 rounded hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {notas.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-4">
          Nenhuma nota adicionada ainda
        </p>
      )}
    </div>
  );
}

// Componente de Avaliação com Estrelas
export function AvaliacaoCandidato({ candidatoId }: { 
  candidatoId: number;
}) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [media, setMedia] = useState<AvaliacaoResponse['media'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    comunicacao: 0,
    experiencia_tecnica: 0,
    fit_cultural: 0,
    apresentacao: 0,
    disponibilidade: 0,
    comentario: ''
  });

  const carregarAvaliacoes = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet<AvaliacaoResponse>(`/avaliacoes/candidato/${candidatoId}`);
      setAvaliacoes(data.avaliacoes);
      setMedia(data.media);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  }, [candidatoId]);

  React.useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  const submeterAvaliacao = async () => {
    // Validar que pelo menos um critério foi preenchido
    if (!form.comunicacao && !form.experiencia_tecnica && !form.fit_cultural && !form.apresentacao && !form.disponibilidade) {
      alert('Preencha pelo menos um critério de avaliação');
      return;
    }

    try {
      await apiPost('/avaliacoes', {
        candidato_id: candidatoId,
        ...form
      });
      
      // Resetar form
      setForm({
        comunicacao: 0,
        experiencia_tecnica: 0,
        fit_cultural: 0,
        apresentacao: 0,
        disponibilidade: 0,
        comentario: ''
      });
      setMostrarForm(false);
      await carregarAvaliacoes();
    } catch (error) {
      console.error('Erro ao submeter avaliação:', error);
      alert('Erro ao submeter avaliação');
    }
  };

  const RatingStars = ({ 
    value, 
    onChange, 
    readonly = false 
  }: { 
    value: number; 
    onChange?: (value: number) => void; 
    readonly?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            disabled={readonly}
            className={`transition-all ${!readonly && 'hover:scale-110 cursor-pointer'}`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </div>
    );
  }

  const criterios = [
    { key: 'comunicacao', label: 'Comunicação' },
    { key: 'experiencia_tecnica', label: 'Experiência Técnica' },
    { key: 'fit_cultural', label: 'Fit Cultural' },
    { key: 'apresentacao', label: 'Apresentação' },
    { key: 'disponibilidade', label: 'Disponibilidade' }
  ];

  return (
    <div className="space-y-6">
      {/* Média Geral */}
      {media && media.total_avaliacoes > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Avaliação Média
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold text-yellow-600">
              {media.media_geral?.toFixed(1) || '0.0'}
            </div>
            <div>
              <RatingStars value={Math.round(media.media_geral || 0)} readonly />
              <p className="text-sm text-gray-600 mt-1">
                Baseado em {media.total_avaliacoes} avaliação{media.total_avaliacoes !== 1 ? 'ões' : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {criterios.map((criterio) => {
              const mediaKey = `media_${criterio.key}` as keyof typeof media;
              const valor = media[mediaKey] as number || 0;
              return (
                <div key={criterio.key} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                  <span className="text-gray-700">{criterio.label}</span>
                  <span className="font-bold text-yellow-600">{valor.toFixed(1)} ⭐</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botão Adicionar Avaliação */}
      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all"
      >
        {mostrarForm ? 'Cancelar' : '+ Adicionar Avaliação'}
      </button>

      {/* Form de Nova Avaliação */}
      <AnimatePresence>
        {mostrarForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border-2 border-primary p-6 space-y-4"
          >
            <h4 className="font-bold text-gray-900">Nova Avaliação</h4>
            
            {criterios.map((criterio) => (
              <div key={criterio.key}>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {criterio.label}
                </label>
                <RatingStars
                  value={form[criterio.key as keyof typeof form] as number}
                  onChange={(value) => setForm({ ...form, [criterio.key]: value })}
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Comentário (opcional)
              </label>
              <textarea
                value={form.comentario}
                onChange={(e) => setForm({ ...form, comentario: e.target.value })}
                placeholder="Adicione observações sobre a avaliação..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <button
              onClick={submeterAvaliacao}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Enviar Avaliação
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Avaliações */}
      <div className="space-y-3">
        <h4 className="font-bold text-gray-900">Histórico de Avaliações</h4>
        {avaliacoes.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">
            Nenhuma avaliação ainda
          </p>
        ) : (
          avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-600">
                    {avaliacao.nota_geral.toFixed(1)}
                  </span>
                  <RatingStars value={Math.round(avaliacao.nota_geral)} readonly />
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(avaliacao.criado_em).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                {criterios.map((criterio) => {
                  const valor = avaliacao[criterio.key as keyof Avaliacao] as number;
                  if (!valor) return null;
                  return (
                    <div key={criterio.key} className="flex items-center justify-between">
                      <span className="text-gray-600">{criterio.label}</span>
                      <span className="font-medium">{valor} ⭐</span>
                    </div>
                  );
                })}
              </div>

              {avaliacao.comentario && (
                <p className="text-sm text-gray-700 bg-white rounded p-2 mt-2">
                  {avaliacao.comentario}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Por <strong>{avaliacao.usuario_nome}</strong>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

