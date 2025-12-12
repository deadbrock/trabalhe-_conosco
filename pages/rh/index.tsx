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
      color: "from-primary to-secondary",
      bgColor: "bg-gray-50",
      textColor: "text-primary",
      borderColor: "border-primary"
    },
    { 
      label: "Total de Candidatos", 
      value: metrics?.total_candidatos ?? "--",
      icon: Users,
      color: "from-secondary to-primary",
      bgColor: "bg-gray-50",
      textColor: "text-secondary",
      borderColor: "border-secondary"
    },
    { 
      label: "Candidatos Hoje", 
      value: metrics?.candidatos_hoje ?? "--",
      icon: TrendingUp,
      color: "from-primary to-secondary",
      bgColor: "bg-gray-50",
      textColor: "text-primary",
      borderColor: "border-primary"
    },
  ];

  const quickActions = [
    { label: "Nova Vaga", href: "/rh/vagas", icon: Briefcase, color: "from-primary to-secondary" },
    { label: "Ver Candidatos", href: "/rh/candidatos", icon: UserCheck, color: "from-secondary to-primary" },
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

        {/* Métricas - Cards com bordas coloridas */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: i * 0.15 }} 
              className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 ${card.borderColor} animate-[fadeInUp_0.6s_ease_forwards]`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${card.bgColor} ${card.textColor}`}>
                  Atualizado
                </span>
              </div>
              <div className="text-sm font-medium text-gray-500 mb-2 tracking-wide">{card.label}</div>
              <div className="text-4xl font-bold text-dark">{card.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold text-dark mb-6 tracking-wide">Ações Rápidas</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className={`flex items-center gap-4 p-6 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-md`}
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <action.icon className="w-7 h-7" />
                </div>
                <span className="font-semibold text-lg tracking-wide">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Últimos Candidatos */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-semibold text-dark tracking-wide">Últimas Candidaturas</h2>
            <Link 
              href="/rh/candidatos" 
              className="text-sm text-primary hover:text-secondary font-bold flex items-center gap-1 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Ver Todos
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          
          {recentCandidatos.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Nenhuma candidatura recente</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentCandidatos.map((candidato, idx) => (
                <motion.div
                  key={candidato.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-dark text-lg">{candidato.nome}</h3>
                        {candidato.status === "novo" && (
                          <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-md uppercase shadow-sm">
                            Novo
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-secondary" />
                          <span className="font-medium">{candidato.vaga_titulo || "Vaga não especificada"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>{candidato.email}</span>
                        </div>
                        {candidato.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span>{candidato.telefone}</span>
                          </div>
                        )}
                        {candidato.data_cadastro && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>{new Date(candidato.data_cadastro).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/rh/candidatos/${candidato.vaga_id}`}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
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
