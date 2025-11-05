import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Video, Plus, Trash2, Edit2 } from 'lucide-react';
import { apiGet, apiPost, apiDelete, apiPut } from '@/lib/api';
import { AgendamentosSkeleton } from './Skeleton';

interface Agendamento {
  id: number;
  candidato_id: number;
  vaga_id: number;
  usuario_id: number;
  titulo: string;
  descricao?: string;
  data_hora: string;
  local?: string;
  link_video?: string;
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  criado_em: string;
}

interface AgendamentosCandidatoProps {
  candidatoId: number;
  vagaId: number;
  usuarioId: number;
}

export default function AgendamentosCandidato({
  candidatoId,
  vagaId,
  usuarioId,
}: AgendamentosCandidatoProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);

  const [form, setForm] = useState<{
    titulo: string;
    descricao: string;
    data_hora: string;
    local: string;
    link_video: string;
    status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  }>({
    titulo: '',
    descricao: '',
    data_hora: '',
    local: '',
    link_video: '',
    status: 'agendado',
  });

  const carregarAgendamentos = useCallback(async () => {
    setLoadingAgendamentos(true);
    try {
      const data = await apiGet<Agendamento[]>(`/agendamentos?candidato_id=${candidatoId}`);
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoadingAgendamentos(false);
    }
  }, [candidatoId]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const salvarAgendamento = async () => {
    if (!form.titulo || !form.data_hora) {
      alert('Título e data são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      if (editando) {
        await apiPut(`/agendamentos/${editando}`, form);
      } else {
        await apiPost('/agendamentos', {
          ...form,
          candidato_id: candidatoId,
          vaga_id: vagaId,
          usuario_id: usuarioId,
        });
      }

      await carregarAgendamentos();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      alert('Erro ao salvar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const removerAgendamento = async (id: number) => {
    if (!confirm('Remover este agendamento?')) return;

    try {
      await apiDelete(`/agendamentos/${id}`);
      setAgendamentos(agendamentos.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      alert('Erro ao remover agendamento');
    }
  };

  const editarAgendamento = (agendamento: Agendamento) => {
    setForm({
      titulo: agendamento.titulo,
      descricao: agendamento.descricao || '',
      data_hora: agendamento.data_hora.substring(0, 16),
      local: agendamento.local || '',
      link_video: agendamento.link_video || '',
      status: agendamento.status,
    });
    setEditando(agendamento.id);
    setMostrarForm(true);
  };

  const resetForm = () => {
    setForm({
      titulo: '',
      descricao: '',
      data_hora: '',
      local: '',
      link_video: '',
      status: 'agendado',
    });
    setEditando(null);
    setMostrarForm(false);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      agendado: 'bg-blue-100 text-blue-700',
      confirmado: 'bg-green-100 text-green-700',
      realizado: 'bg-gray-100 text-gray-700',
      cancelado: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Agendamentos ({agendamentos.length})
        </h3>

        {!mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">
            {editando ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Entrevista Técnica"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora *
              </label>
              <input
                type="datetime-local"
                value={form.data_hora}
                onChange={(e) => setForm({ ...form, data_hora: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as 'agendado' | 'confirmado' | 'realizado' | 'cancelado' })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="realizado">Realizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local
              </label>
              <input
                type="text"
                value={form.local}
                onChange={(e) => setForm({ ...form, local: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Escritório, Sala X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link Vídeo
              </label>
              <input
                type="url"
                value={form.link_video}
                onChange={(e) => setForm({ ...form, link_video: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={2}
                placeholder="Observações sobre o agendamento..."
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={salvarAgendamento}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : editando ? 'Atualizar' : 'Criar'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de agendamentos */}
      <div className="space-y-3">
        {loadingAgendamentos ? (
          <AgendamentosSkeleton />
        ) : agendamentos.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            Nenhum agendamento criado ainda
          </p>
        ) : (
          agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {agendamento.titulo}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        agendamento.status
                      )}`}
                    >
                      {agendamento.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatarData(agendamento.data_hora)}
                    </div>

                    {agendamento.local && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {agendamento.local}
                      </div>
                    )}

                    {agendamento.link_video && (
                      <a
                        href={agendamento.link_video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Video className="w-4 h-4" />
                        Link da Videochamada
                      </a>
                    )}

                    {agendamento.descricao && (
                      <p className="mt-2 text-gray-700">
                        {agendamento.descricao}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 ml-3">
                  <button
                    onClick={() => editarAgendamento(agendamento)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removerAgendamento(agendamento.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

