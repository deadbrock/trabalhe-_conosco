"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Users,
  Building2,
  TrendingUp,
  FileText,
  BarChart3,
  Download,
  AlertCircle,
} from "lucide-react";

interface MetricasGerais {
  vagas_abertas: number;
  total_candidatos: number;
  candidatos_hoje: number;
}

interface MetricasFilial {
  id: number;
  filial: string;
  vagas_abertas: number;
  total_candidatos: number;
  candidatos_hoje: number;
  candidatos_novos: number;
  em_analise: number;
  pre_selecionados: number;
  aprovados: number;
}

interface MetricasConsolidadas {
  geral: MetricasGerais;
  por_filial: MetricasFilial[];
}

export default function GestaoDashboard() {
  const router = useRouter();
  const [metricas, setMetricas] = useState<MetricasConsolidadas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    carregarMetricas();
  }, [router]);

  const carregarMetricas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gestao/metricas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Acesso negado. Apenas gestores podem acessar esta área.");
        }
        throw new Error("Erro ao carregar métricas");
      }

      const data = await response.json();
      setMetricas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel de gestão...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Painel de Gestão</h1>
          <p className="text-gray-600 mt-2">
            Visão consolidada de todas as filiais e operações de RH
          </p>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagas Abertas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas?.geral.vagas_abertas || 0}</div>
              <p className="text-xs text-muted-foreground">Todas as filiais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Candidatos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas?.geral.total_candidatos || 0}</div>
              <p className="text-xs text-muted-foreground">Base completa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidatos Hoje</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metricas?.geral.candidatos_hoje || 0}</div>
              <p className="text-xs text-muted-foreground">Novos cadastros</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Navegação */}
        <Tabs defaultValue="filiais" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="filiais">
              <Building2 className="h-4 w-4 mr-2" />
              Filiais
            </TabsTrigger>
            <TabsTrigger value="usuarios" onClick={() => router.push("/rh/gestao/usuarios")}>
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="relatorios" onClick={() => router.push("/rh/gestao/relatorios")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="exportar">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </TabsTrigger>
          </TabsList>

          {/* Visão por Filial */}
          <TabsContent value="filiais" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Filial</CardTitle>
                <CardDescription>
                  Métricas detalhadas de cada unidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricas?.por_filial.map((filial) => (
                    <div
                      key={filial.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{filial.filial}</h3>
                        <span className="text-sm text-gray-500">ID: {filial.id}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Vagas Abertas</p>
                          <p className="text-2xl font-bold text-blue-600">{filial.vagas_abertas}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Candidatos</p>
                          <p className="text-2xl font-bold text-gray-900">{filial.total_candidatos}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Novos</p>
                          <p className="text-2xl font-bold text-green-600">{filial.candidatos_novos}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Aprovados</p>
                          <p className="text-2xl font-bold text-purple-600">{filial.aprovados}</p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Em Análise: </span>
                          <span className="font-semibold">{filial.em_analise}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pré-selecionados: </span>
                          <span className="font-semibold">{filial.pre_selecionados}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hoje: </span>
                          <span className="font-semibold">{filial.candidatos_hoje}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exportação de Dados */}
          <TabsContent value="exportar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Dados</CardTitle>
                <CardDescription>
                  Baixe relatórios completos em CSV ou JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Candidatos</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Exportar base completa de candidatos de todas as filiais
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          window.open(
                            `${process.env.NEXT_PUBLIC_API_URL}/gestao/exportar/candidatos?formato=json&token=${token}`,
                            "_blank"
                          );
                        }}
                      >
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          window.open(
                            `${process.env.NEXT_PUBLIC_API_URL}/gestao/exportar/candidatos?formato=csv&token=${token}`,
                            "_blank"
                          );
                        }}
                      >
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Vagas</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Exportar todas as vagas com estatísticas
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          window.open(
                            `${process.env.NEXT_PUBLIC_API_URL}/gestao/exportar/vagas?formato=json&token=${token}`,
                            "_blank"
                          );
                        }}
                      >
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          window.open(
                            `${process.env.NEXT_PUBLIC_API_URL}/gestao/exportar/vagas?formato=csv&token=${token}`,
                            "_blank"
                          );
                        }}
                      >
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
