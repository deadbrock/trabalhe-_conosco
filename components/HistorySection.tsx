import React from "react";
import { motion } from "framer-motion";

type Milestone = {
  year: string;
  description: string;
};

const milestones: Milestone[] = [
  { year: "2010", description: "Fundação como loja de materiais de limpeza." },
  { year: "2012", description: "Início da distribuição de materiais de limpeza." },
  { year: "2015", description: "Virada de chave: primeiros contratos de terceirização." },
  { year: "2020", description: "Pandemia: manutenção de todos os empregos e crescimento de 30%." },
  { year: "2022", description: "Alcançamos 1.500 colaboradores." },
  { year: "2023", description: "Conquista do selo GPTW (Great Place to Work)." },
  { year: "2024", description: "Expansão para 15 estados e marca de 3.500 colaboradores." },
  { year: "2025", description: "Inauguração da nova sede administrativa e consolidação nacional." },
];

export default function HistorySection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4"
            >
              <span className="text-primary font-semibold">Nossa Jornada</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                Cronologia – Nossos Marcos
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>
          <div className="relative">
            {/* Linha vertical da timeline */}
            <div className="absolute left-[19px] sm:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-primary shadow-lg" />
            
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex items-center ${
                    idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  } flex-row`}
                >
                  {/* Ponto na linha do tempo */}
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl z-10 ring-4 ring-white">
                    <div className="w-5 h-5 rounded-full bg-white shadow-inner" />
                  </div>
                  
                  {/* Conteúdo */}
                  <div className={`ml-16 sm:ml-0 sm:w-[calc(50%-40px)] ${
                    idx % 2 === 0 ? "sm:text-right sm:pr-12" : "sm:pl-12"
                  }`}>
                    <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                        {milestone.year}
                      </div>
                      <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

