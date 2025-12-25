import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import RHLayout from "@/components/RHLayout";
import WelcomeAnimation from "@/components/WelcomeAnimation";
import { Briefcase, Users, TrendingUp, UserCheck, Mail, Phone, Calendar, ExternalLink, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableContainer, TD, TH, THead, TR } from "@/components/ui/Table";

type Metrics = {
  vagas_abertas: number;
  total_candidatos: number;
  candidatos_hoje: number;
};

type Candidato = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  vaga_titulo?: string;
  vaga_id: number;
  data_cadastro?: string;
  status: string;
};

export default function RHDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentCandidatos, setRecentCandidatos] = useState<Candidato[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;
    
    // Verificar se é o primeiro acesso dos usuários especiais
    if (typeof window !== "undefined") {
      const welcomeCount = parseInt(localStorage.getItem("rh_welcome_count") || "0");
      const storedEmail = localStorage.getItem("rh_user_email");
      
      // Emails dos usuários que devem ver a animação
      const specialUsers = [
        "rh@fgservices.com.br",
        "rh-2@fgservices.com.br",
        "rh-3@fgservices.com.br",
        "gestaorh@fgservices.com.br"
      ];
      
      // Pegar nome do usuário do token JWT
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const email = payload.email || storedEmail || "";
          const nome = payload.nome || "Usuário";
          
          setUserEmail(email);
          setUserName(nome);
          localStorage.setItem("rh_user_email", email);
          
          // Animação de boas-vindas desabilitada
          // Se é usuário especial e viu menos de 5 vezes
          // if (welcomeCount < 5 && specialUsers.includes(email)) {
          //   setShowWelcome(true);
          //   // Incrementar contador
          //   localStorage.setItem("rh_welcome_count", String(welcomeCount + 1));
          // }
        } catch (err) {
          console.error("Erro ao decodificar token:", err);
        }
      }
    }
    
    apiGet<Metrics>("/metrics", token).then(setMetrics).catch(() => setMetrics({ vagas_abertas: 0, total_candidatos: 0, candidatos_hoje: 0 }));
    
    // Carregar últimos 5 candidatos
    apiGet<Candidato[]>("/candidatos", token).then((data) => {
      setRecentCandidatos(data.slice(0, 5));
    }).catch(() => setRecentCandidatos([]));
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  const cards = [
    { 
      label: "Vagas Abertas", 
      value: metrics?.vagas_abertas ?? "--",
      icon: Briefcase,
      color: "from-[#354A80] to-[#1f2937]",
      bgColor: "bg-white/70",
      textColor: "text-slate-900",
      borderColor: "border-slate-200"
    },
    { 
      label: "Total de Candidatos", 
      value: metrics?.total_candidatos ?? "--",
      icon: Users,
      color: "from-[#354A80] to-[#1f2937]",
      bgColor: "bg-white/70",
      textColor: "text-slate-900",
      borderColor: "border-slate-200"
    },
    { 
      label: "Candidatos Hoje", 
      value: metrics?.candidatos_hoje ?? "--",
      icon: TrendingUp,
      color: "from-[#354A80] to-[#1f2937]",
      bgColor: "bg-white/70",
      textColor: "text-slate-900",
      borderColor: "border-slate-200"
    },
  ];

  const quickActions = [
    { label: "Nova Vaga", href: "/rh/vagas", icon: Briefcase },
    { label: "Ver Candidatos", href: "/rh/candidatos", icon: UserCheck },
  ];

  return (
    <RHLayout>
      {/* Animação de Boas-Vindas */}
      {showWelcome && (
        <WelcomeAnimation 
          userName={userName}
          userEmail={userEmail}
          onClose={handleCloseWelcome}
        />
      )}

      {/* Banner de Boas-vindas (Dezembro) */}
      {(() => {
        const hoje = new Date();
        const isDezembro = hoje.getMonth() === 11; // 11 = dezembro
        
        if (!isDezembro) return null;
        
        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-6 text-white shadow-xl relative overflow-hidden border border-white/10"
          >
            {/* Efeito de brilho sutil */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
            
            {/* Partículas sutis de fundo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">
                    Bem-vindo, {userName || 'Equipe RH'}
                  </h2>
                  <p className="text-sm text-white/90 leading-relaxed">
                    Natal é tempo de renovar, agradecer e planejar o futuro.
                    <br />
                    <span className="font-semibold text-white">Boas Festas!</span>
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-green-500/20 flex items-center justify-center border border-white/10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}
      
      <div className="space-y-12">
        <SectionTitle
          title="Dashboard"
          subtitle="Visão geral do recrutamento e atividade recente"
          icon={<LayoutDashboard className="h-5 w-5" />}
          right={
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/rh/vagas" className="w-full sm:w-auto">
                <Button gradient className="w-full sm:w-auto">
                  <Briefcase className="h-4 w-4" />
                  Nova Vaga
                </Button>
              </Link>
              <Link href="/rh/candidatos" className="w-full sm:w-auto">
                <Button variant="outline" tone="primary" className="w-full sm:w-auto">
                  <UserCheck className="h-4 w-4" />
                  Ver Candidatos
                </Button>
              </Link>
            </div>
          }
        />

        {/* Métricas */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: i * 0.15 }} 
              className="animate-[fadeInUp_0.6s_ease_forwards]"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <card.icon className="h-6 w-6" />
                    </div>
                    <Badge tone="neutral">Atualizado</Badge>
                  </div>
                  <CardDescription>{card.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-neutral-900">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Últimas candidaturas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Últimas candidaturas</CardTitle>
                <CardDescription>Os 5 registros mais recentes</CardDescription>
              </div>
              <Link href="/rh/candidatos">
                <Button variant="ghost" tone="primary">
                  Ver todos <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentCandidatos.length === 0 ? (
              <div className="py-10 text-center text-sm text-neutral-500">
                Nenhuma candidatura recente
              </div>
            ) : (
              <div className="overflow-x-auto">
                <TableContainer className="shadow-none border border-neutral-200/70">
                  <Table>
                    <THead>
                      <TR className="hover:bg-transparent">
                        <TH>Candidato</TH>
                        <TH>Vaga</TH>
                        <TH>Status</TH>
                        <TH className="text-right">Ações</TH>
                      </TR>
                    </THead>
                    <tbody>
                      {recentCandidatos.map((c) => (
                        <TR key={c.id}>
                          <TD>
                            <div className="font-semibold text-neutral-900">{c.nome}</div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                              <Mail className="h-3.5 w-3.5" /> {c.email}
                              {c.telefone ? (
                                <>
                                  <span className="mx-1 text-neutral-300">•</span>
                                  <Phone className="h-3.5 w-3.5" /> {c.telefone}
                                </>
                              ) : null}
                              {c.data_cadastro ? (
                                <>
                                  <span className="mx-1 text-neutral-300">•</span>
                                  <Calendar className="h-3.5 w-3.5" />{" "}
                                  {new Date(c.data_cadastro).toLocaleDateString("pt-BR")}
                                </>
                              ) : null}
                            </div>
                          </TD>
                          <TD>{c.vaga_titulo || "—"}</TD>
                          <TD>
                            {c.status === "novo" ? <Badge tone="primary">Novo</Badge> : <Badge>{c.status}</Badge>}
                          </TD>
                          <TD className="text-right">
                            <Link href={`/rh/candidatos/${c.vaga_id}`}>
                              <Button variant="outline" tone="primary">
                                Ver Kanban
                              </Button>
                            </Link>
                          </TD>
                        </TR>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </RHLayout>
  );
}
