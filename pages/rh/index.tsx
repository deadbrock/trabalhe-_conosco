import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { motion } from "framer-motion";
import RHLayout from "@/components/RHLayout";
import { Briefcase, Users, TrendingUp, UserCheck, Calendar, FileText } from "lucide-react";
import Link from "next/link";

type Metrics = {
  vagas_abertas: number;
  total_candidatos: number;
  candidatos_hoje: number;
};

export default function RHDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("rh_token") || undefined : undefined;
    
    // Modo DEMO - Dados mockados
    if (token === "demo-token-temporario") {
      setMetrics({ vagas_abertas: 5, total_candidatos: 47, candidatos_hoje: 3 });
      return;
    }
    
    apiGet<Metrics>("/metrics", token).then(setMetrics).catch(() => setMetrics({ vagas_abertas: 0, total_candidatos: 0, candidatos_hoje: 0 }));
  }, []);

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

        {/* Atividades Recentes */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Atividades Recentes</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">Nova candidatura recebida</p>
                <p className="text-sm text-gray-600">João Silva se candidatou para Auxiliar de Limpeza</p>
                <p className="text-xs text-gray-400 mt-1">Há 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-gray-900">Vaga publicada</p>
                <p className="text-sm text-gray-600">Supervisor de Limpeza - São Paulo/SP</p>
                <p className="text-xs text-gray-400 mt-1">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RHLayout>
  );
}
