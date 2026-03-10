"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";

interface Filial {
  id: number;
  nome: string;
}

interface FunilItem {
  status: string;
  total: number;
  filial_nome: string;
}

interface VagaPerformance {
  id: number;
  titulo: string;
  status: string;
  criado_em: string;
  filial_nome: string;
  total_candidatos: number;
  aprovados: number;
  reprovados: number;
  taxa_aprovacao: number;
}

interface TempoMedio {
  filial_nome: string;
  status: string;
  total: number;
  dias_medio: number;
}

interface EvolucaoItem {
  data: string;
  filial_nome: string;
  total_candidatos: number;
  aprovados: number;
  reprovados: number;
}

export default function GestaoRelatorios() {
  const router = useRouter();
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filialFiltro, setFilialFiltro] = useState<string>("todas");

  const [funil, setFunil] = useState<FunilItem[]>([]);
  const [vagasPerformance, setVagasPerformance] = useState<VagaPerformance[]>([]);
  const [tempoMedio, setTempoMedio] = useState<TempoMedio[]>([]);
  const [evolucao, setEvolucao] = useState<EvolucaoItem[]>([]);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(usuario);
    if (user.perfil !== "gestor") {
      setError("Acesso negado. Apenas gestores podem acessar esta área.");
      return;
    }

    carregarDados();
  }, [router]);

  const carregarDados = async () => {
    try {
      const token = localStorage.getItem("token");

      const filiaisRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/filiais`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!filiaisRes.ok) throw new Error("Erro ao carregar filiais");

      const filiaisData = await filiaisRes.json();
      setFiliais(filiaisData);

      await carregarRelatorios(token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarRelatorios = async (token: string, filial?: string) => {
    try {
      const params = filial && filial !== "todas" ? `?filial_id=${filial}` : "";

      const [funilRes, vagasRes, tempoRes, evolucaoRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/relatorios/funil${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/relatorios/vagas-performance${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/relatorios/tempo-medio${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/estatisticas/evolucao${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!funilRes.ok || !vagasRes.ok || !tempoRes.ok || !evolucaoRes.ok) {
        throw new Error("Erro ao carregar relatórios");
      }

      const [funilData, vagasData, tempoData, evolucaoData] = await Promise.all([
        funilRes.json(),
        vagasRes.json(),
        tempoRes.json(),
        evolucaoRes.json(),
      ]);

      setFunil(funilData);
      setVagasPerformance(vagasData);
      setTempoMedio(tempoData);
      setEvolucao(evolucaoData);
    } catch (err: any) {
      console.error("Erro ao carregar relatórios:", err);
    }
  };

  const aplicarFiltro = () => {
    const token = localStorage.getItem("token");
    if (token) {
      carregarRelatorios(token, filialFiltro);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Erro de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => router.push("/rh")} variant="outline">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Consolidados</h1>
          <p className="text-gray-600 mt-2">Análises e estatísticas de todas as filiais</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label>Filial</Label>
                <Select value={filialFiltro} onValueChange={setFilialFiltro}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as filiais</SelectItem>
                    {filiais.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={aplicarFiltro}>Aplicar Filtro</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Relatórios */}
        <Tabs defaultValue="funil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="funil">
              <BarChart3 className="h-4 w-4 mr-2" />
              Funil
            </TabsTrigger>
            <TabsTrigger value="vagas">
              <TrendingUp className="h-4 w-4 mr-2" />
              Vagas
            </TabsTrigger>
            <TabsTrigger value="tempo">
              <Clock className="h-4 w-4 mr-2" />
              Tempo Médio
            </TabsTrigger>
            <TabsTrigger value="evolucao">
              <TrendingUp className="h-4 w-4 mr-2" />
              Evolução
            </TabsTrigger>
          </TabsList>

          {/* Funil de Conversão */}
          <TabsContent value="funil">
            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
                <CardDescription>
                  Distribuição de candidatos por status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funil.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
                  ) : (
                    funil.map((item, idx) => {
                      const totalGeral = funil.reduce((sum, i) => sum + parseInt(i.total.toString()), 0);
                      const percentual = totalGeral > 0 ? (parseInt(item.total.toString()) / totalGeral) * 100 : 0;

                      return (
                        <div key={idx} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-semibold text-gray-900">{item.status}</span>
                              {item.filial_nome && (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({item.filial_nome})
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-blue-600">{item.total}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                ({percentual.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentual}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance de Vagas */}
          <TabsContent value="vagas">
            <Card>
              <CardHeader>
                <CardTitle>Performance de Vagas</CardTitle>
                <CardDescription>
                  Estatísticas de candidatos por vaga
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vagasPerformance.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma vaga encontrada</p>
                  ) : (
                    vagasPerformance.map((vaga) => (
                      <div key={vaga.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{vaga.titulo}</h3>
                            <p className="text-sm text-gray-500">{vaga.filial_nome}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              vaga.status === "ativa"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {vaga.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold text-gray-900">{vaga.total_candidatos}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Aprovados</p>
                            <p className="text-xl font-bold text-green-600">{vaga.aprovados}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reprovados</p>
                            <p className="text-xl font-bold text-red-600">{vaga.reprovados}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Taxa Aprovação</p>
                            <p className="text-xl font-bold text-blue-600">
                              {vaga.taxa_aprovacao || 0}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tempo Médio */}
          <TabsContent value="tempo">
            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio por Status</CardTitle>
                <CardDescription>
                  Média de dias desde o cadastro até a última atividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tempoMedio.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
                  ) : (
                    tempoMedio.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-gray-900">{item.status}</span>
                            {item.filial_nome && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({item.filial_nome})
                              </span>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              {item.total} candidatos
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-blue-600">
                              {item.dias_medio || 0}
                            </p>
                            <p className="text-sm text-gray-500">dias</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evolução Temporal */}
          <TabsContent value="evolucao">
            <Card>
              <CardHeader>
                <CardTitle>Evolução nos Últimos 30 Dias</CardTitle>
                <CardDescription>
                  Candidatos cadastrados, aprovados e reprovados por dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evolucao.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
                  ) : (
                    evolucao.slice(0, 15).map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-gray-900">
                              {new Date(item.data).toLocaleDateString("pt-BR")}
                            </span>
                            {item.filial_nome && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({item.filial_nome})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold text-gray-900">{item.total_candidatos}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Aprovados</p>
                            <p className="text-xl font-bold text-green-600">{item.aprovados}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Reprovados</p>
                            <p className="text-xl font-bold text-red-600">{item.reprovados}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
