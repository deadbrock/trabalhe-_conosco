import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import RHLayout from "@/components/RHLayout";
import WelcomeAnimation from "@/components/WelcomeAnimation";
import { Briefcase, Users, TrendingUp, UserCheck, Mail, Phone, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";

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
          
          // Se é usuário especial e viu menos de 5 vezes
          if (welcomeCount < 5 && specialUsers.includes(email)) {
            setShowWelcome(true);
            // Incrementar contador
            localStorage.setItem("rh_welcome_count", String(welcomeCount + 1));
          }
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
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700"
    },
    { 
      label: "Total de Candidatos", 
      value: metrics?.total_candidatos ?? "--",
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    },
    { 
      label: "Candidatos Hoje", 
      value: metrics?.candidatos_hoje ?? "--",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700"
    },
  ];

  const quickActions = [
    { label: "Nova Vaga", href: "/rh/vagas", icon: Briefcase, color: "from-primary to-red-700" },
    { label: "Ver Candidatos", href: "/rh/candidatos", icon: UserCheck, color: "from-secondary to-blue-700" },
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
      
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao painel de gerenciamento de RH</p>
        </div>

        {/* Métricas */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: i * 0.1 }} 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${card.bgColor} ${card.textColor}`}>
                  Atualizado
                </span>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">{card.label}</div>
              <div className="text-4xl font-bold text-gray-900">{card.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Últimos Candidatos */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Últimas Candidaturas</h2>
            <Link 
              href="/rh/candidatos" 
              className="text-sm text-primary hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
            >
              Ver Todos
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          
          {recentCandidatos.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma candidatura recente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentCandidatos.map((candidato, idx) => (
                <motion.div
                  key={candidato.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-5 hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{candidato.nome}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {candidato.status === "novo" ? "Novo" : candidato.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span>{candidato.vaga_titulo || "Vaga não especificada"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-4 h-4" />
                          <span>{candidato.email}</span>
                        </div>
                        {candidato.telefone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4" />
                            <span>{candidato.telefone}</span>
                          </div>
                        )}
                        {candidato.data_cadastro && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(candidato.data_cadastro).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/rh/candidatos/${candidato.vaga_id}`}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-red-700 text-white font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      Ver Kanban
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </RHLayout>
  );
}
