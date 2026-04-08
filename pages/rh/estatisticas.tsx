"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import RHLayout from "@/components/RHLayout";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, UserCheck, UserX, MapPin, BarChart2,
  RefreshCw, Calendar, Clock, Briefcase,
} from "lucide-react";

// ── Recharts (SSR-safe) ──────────────────────────────────────────────────────
const {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} = {
  ResponsiveContainer: dynamic(
    () => import("recharts").then((m) => m.ResponsiveContainer),
    { ssr: false }
  ),
  BarChart: dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false }),
  Bar: dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false }),
  XAxis: dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false }),
  YAxis: dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false }),
  CartesianGrid: dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false }),
  Tooltip: dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false }),
  Legend: dynamic(() => import("recharts").then((m) => m.Legend), { ssr: false }),
  LineChart: dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false }),
  Line: dynamic(() => import("recharts").then((m) => m.Line), { ssr: false }),
  Cell: dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false }),
  PieChart: dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false }),
  Pie: dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false }),
} as any;

// ── Tipos ───────────────────────────────────────────────────────────────────
type GeoItem = { nome: string; total: number };
type GeoData = { estados: GeoItem[]; cidades: GeoItem[]; bairros: GeoItem[] };
type FunilItem = { status: string; total: number };
type EvolucaoItem = { data: string; total: number; aprovados: number; reprovados: number };
type VagaItem = {
  id: number;
  titulo: string;
  total_candidatos: number;
  aprovados: number;
  reprovados: number;
  taxa_aprovacao: number;
};
type MotivoItem = { motivo: string; total: number };
type TempoItem = { status: string; media_dias: number; total: number };

// ── Paleta ──────────────────────────────────────────────────────────────────
const COR_PRIMARY = "#a2122a";
const COR_SECONDARY = "#354a80";
const COR_SUCCESS = "#16a34a";
const COR_WARNING = "#d97706";
const COR_MUTED = "#94a3b8";

const FUNIL_COLORS: Record<string, string> = {
  novo: "#354a80",
  "em análise": "#6366f1",
  "em_análise": "#6366f1",
  "pré-selecionado": "#8b5cf6",
  "pré_selecionado": "#8b5cf6",
  entrevistado: "#f59e0b",
  aprovado: "#16a34a",
  reprovado: "#a2122a",
  "banco de talentos": "#0891b2",
  "banco_de_talentos": "#0891b2",
};

const STATUS_LABELS: Record<string, string> = {
  novo: "Novo",
  "em análise": "Em Análise",
  "em_análise": "Em Análise",
  "pré-selecionado": "Pré-selecionado",
  "pré_selecionado": "Pré-selecionado",
  entrevistado: "Entrevistado",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  "banco de talentos": "Banco de Talentos",
  "banco_de_talentos": "Banco de Talentos",
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmt(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}`;
}

function capitalize(s: string) {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function truncate(s: string, n = 22) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ h = "h-48" }: { h?: string }) {
  return (
    <div className={`${h} rounded-2xl bg-gray-100 animate-pulse`} />
  );
}

// ── Tooltip customizado ───────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ── Card de resumo ────────────────────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EstatisticasPage() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [funil, setFunil] = useState<FunilItem[] | null>(null);
  const [evolucao, setEvolucao] = useState<EvolucaoItem[] | null>(null);
  const [vagas, setVagas] = useState<VagaItem[] | null>(null);
  const [motivos, setMotivos] = useState<MotivoItem[] | null>(null);
  const [tempo, setTempo] = useState<TempoItem[] | null>(null);

  const [geoAba, setGeoAba] = useState<"estados" | "cidades" | "bairros">("estados");
  const [diasEvolucao, setDiasEvolucao] = useState(30);
  const [funilInicio, setFunilInicio] = useState("");
  const [funilFim, setFunilFim] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (funilInicio) params.set("data_inicio", funilInicio);
      if (funilFim) params.set("data_fim", funilFim);
      const funilQuery = params.toString() ? `?${params}` : "";

      const [geoData, funilData, evolData, vagasData, motivosData, tempoData] =
        await Promise.all([
          apiGet<GeoData>("/estatisticas/geograficos"),
          apiGet<FunilItem[]>(`/estatisticas/funil${funilQuery}`),
          apiGet<EvolucaoItem[]>(`/estatisticas/evolucao?dias=${diasEvolucao}`),
          apiGet<VagaItem[]>("/estatisticas/vagas-performance"),
          apiGet<MotivoItem[]>("/estatisticas/motivos-reprovacao"),
          apiGet<TempoItem[]>("/estatisticas/tempo-medio"),
        ]);

      setGeo(geoData);
      setFunil(funilData);
      setEvolucao(evolData);
      setVagas(vagasData);
      setMotivos(motivosData);
      setTempo(tempoData);
    } catch (e: any) {
      setError("Erro ao carregar estatísticas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [funilInicio, funilFim, diasEvolucao]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── resumo calculado ───────────────────────────────────────────────────────
  const totalCandidatos = funil?.reduce((s, i) => s + i.total, 0) ?? 0;
  const totalAprovados =
    funil?.find((i) => i.status === "aprovado")?.total ?? 0;
  const totalReprovados =
    funil?.find((i) => i.status === "reprovado")?.total ?? 0;
  const taxaAprovacao =
    totalCandidatos > 0
      ? ((totalAprovados / totalCandidatos) * 100).toFixed(1)
      : "0";

  const geoItems = geo ? geo[geoAba] : [];

  return (
    <RHLayout>
      <div className="p-6 space-y-8 max-w-screen-xl mx-auto">
        {/* ── Cabeçalho ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-7 h-7" style={{ color: COR_PRIMARY }} />
              Estatísticas
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Visão analítica do processo seletivo
            </p>
          </div>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* ── Cards de resumo ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="h-24" />)
          ) : (
            <>
              <SummaryCard
                label="Total de Candidatos"
                value={totalCandidatos}
                icon={Users}
                color={COR_SECONDARY}
              />
              <SummaryCard
                label="Aprovados"
                value={totalAprovados}
                icon={UserCheck}
                color={COR_SUCCESS}
              />
              <SummaryCard
                label="Reprovados"
                value={totalReprovados}
                icon={UserX}
                color={COR_PRIMARY}
              />
              <SummaryCard
                label="Taxa de Aprovação"
                value={`${taxaAprovacao}%`}
                icon={TrendingUp}
                color={COR_WARNING}
                sub={`de ${totalCandidatos} candidatos`}
              />
            </>
          )}
        </div>

        {/* ── Linha: Geo + Funil ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição geográfica */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: COR_PRIMARY }} />
                Distribuição Geográfica
              </h2>
              <div className="flex gap-1 text-xs">
                {(["estados", "cidades", "bairros"] as const).map((aba) => (
                  <button
                    key={aba}
                    onClick={() => setGeoAba(aba)}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      geoAba === aba
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-700 bg-gray-100"
                    }`}
                    style={geoAba === aba ? { background: COR_PRIMARY } : {}}
                  >
                    {capitalize(aba)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <Skeleton h="h-64" />
            ) : geoItems.length === 0 ? (
              <Empty msg="Nenhum dado geográfico encontrado." />
            ) : (
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={geoItems.map((g) => ({
                      ...g,
                      nome: truncate(g.nome, 20),
                    }))}
                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="nome"
                      type="category"
                      width={110}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" name="Candidatos" radius={[0, 6, 6, 0]}>
                      {geoItems.map((_: GeoItem, index: number) => (
                        <Cell
                          key={index}
                          fill={
                            index % 2 === 0 ? COR_PRIMARY : COR_SECONDARY
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Funil de Status */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: COR_SECONDARY }} />
                Funil de Status
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <input
                  type="date"
                  value={funilInicio}
                  onChange={(e) => setFunilInicio(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                />
                <span>até</span>
                <input
                  type="date"
                  value={funilFim}
                  onChange={(e) => setFunilFim(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs"
                />
              </div>
            </div>

            {loading ? (
              <Skeleton h="h-64" />
            ) : !funil || funil.length === 0 ? (
              <Empty msg="Nenhum candidato encontrado." />
            ) : (
              <div className="space-y-2">
                {funil.map((item) => {
                  const pct =
                    totalCandidatos > 0
                      ? Math.round((item.total / totalCandidatos) * 100)
                      : 0;
                  const cor =
                    FUNIL_COLORS[item.status] || COR_MUTED;
                  const label =
                    STATUS_LABELS[item.status] || capitalize(item.status);
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="font-medium">{label}</span>
                        <span>
                          {item.total} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: cor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Evolução temporal ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: COR_SECONDARY }} />
              Evolução de Inscrições
            </h2>
            <div className="flex gap-1 text-xs">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDiasEvolucao(d)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    diasEvolucao === d
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700 bg-gray-100"
                  }`}
                  style={diasEvolucao === d ? { background: COR_SECONDARY } : {}}
                >
                  {d} dias
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <Skeleton h="h-56" />
          ) : !evolucao || evolucao.length === 0 ? (
            <Empty msg="Sem dados de evolução para o período." />
          ) : (
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={evolucao.map((e) => ({ ...e, data: fmt(e.data) }))}
                  margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="data"
                    tick={{ fontSize: 10 }}
                    interval={Math.floor(evolucao.length / 8)}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12 }}
                    formatter={(v: string) =>
                      v === "total"
                        ? "Total"
                        : v === "aprovados"
                        ? "Aprovados"
                        : "Reprovados"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={COR_SECONDARY}
                    strokeWidth={2}
                    dot={false}
                    name="total"
                  />
                  <Line
                    type="monotone"
                    dataKey="aprovados"
                    stroke={COR_SUCCESS}
                    strokeWidth={2}
                    dot={false}
                    name="aprovados"
                  />
                  <Line
                    type="monotone"
                    dataKey="reprovados"
                    stroke={COR_PRIMARY}
                    strokeWidth={2}
                    dot={false}
                    name="reprovados"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* ── Linha: Vagas + Motivos ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance por vaga */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5" style={{ color: COR_SECONDARY }} />
              Performance por Vaga
            </h2>

            {loading ? (
              <Skeleton h="h-64" />
            ) : !vagas || vagas.length === 0 ? (
              <Empty msg="Nenhuma vaga com candidatos encontrada." />
            ) : (
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={vagas.map((v) => ({
                      ...v,
                      titulo: truncate(v.titulo, 20),
                    }))}
                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="titulo"
                      type="category"
                      width={110}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar
                      dataKey="total_candidatos"
                      name="Total"
                      fill={COR_SECONDARY}
                      radius={[0, 4, 4, 0]}
                      stackId="a"
                    />
                    <Bar
                      dataKey="aprovados"
                      name="Aprovados"
                      fill={COR_SUCCESS}
                      radius={[0, 4, 4, 0]}
                      stackId="b"
                    />
                    <Bar
                      dataKey="reprovados"
                      name="Reprovados"
                      fill={COR_PRIMARY}
                      radius={[0, 4, 4, 0]}
                      stackId="b"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Motivos de reprovação */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
              <UserX className="w-5 h-5" style={{ color: COR_PRIMARY }} />
              Motivos de Reprovação
            </h2>

            {loading ? (
              <Skeleton h="h-64" />
            ) : !motivos || motivos.length === 0 ? (
              <Empty msg="Nenhum motivo de reprovação registrado ainda." />
            ) : (
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={motivos.map((m) => ({
                      ...m,
                      motivo: truncate(m.motivo, 22),
                    }))}
                    margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis
                      dataKey="motivo"
                      type="category"
                      width={130}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="total"
                      name="Ocorrências"
                      fill={COR_PRIMARY}
                      radius={[0, 6, 6, 0]}
                    >
                      {motivos.map((_: MotivoItem, i: number) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? COR_PRIMARY : `${COR_PRIMARY}${Math.round(255 * (1 - i * 0.08)).toString(16).padStart(2, "0")}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Tempo médio por fase ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5" style={{ color: COR_WARNING }} />
            Tempo Médio por Fase (dias)
          </h2>

          {loading ? (
            <Skeleton h="h-40" />
          ) : !tempo || tempo.length === 0 ? (
            <Empty msg="Sem dados suficientes para calcular tempo médio." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tempo.map((t) => {
                const label =
                  STATUS_LABELS[t.status] || capitalize(t.status);
                const cor = FUNIL_COLORS[t.status] || COR_MUTED;
                return (
                  <div
                    key={t.status}
                    className="rounded-xl border p-4 text-center"
                    style={{ borderColor: `${cor}30`, background: `${cor}08` }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: cor }}
                    >
                      {t.media_dias}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t.total} cand.
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </RHLayout>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function Empty({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm gap-2">
      <BarChart2 className="w-8 h-8 opacity-30" />
      <p>{msg}</p>
    </div>
  );
}
