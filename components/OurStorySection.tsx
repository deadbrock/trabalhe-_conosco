import React from "react";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Award, Users } from "lucide-react";

const highlights = [
  { icon: Building2, number: "15", label: "Estados", color: "from-blue-500 to-blue-600" },
  { icon: Users, number: "3.500+", label: "Colaboradores", color: "from-green-500 to-green-600" },
  { icon: Award, number: "GPTW", label: "Certificação", color: "from-yellow-500 to-yellow-600" },
  { icon: TrendingUp, number: "30%+", label: "Crescimento", color: "from-red-500 to-red-600" },
];

export default function OurStorySection() {
  return (
    <section id="nossa-historia" className="py-20 px-6 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Cabeçalho */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4"
            >
              <span className="text-primary font-semibold">Desde 2010</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
                Nossa História
              </span>
            </h2>
            
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>

          {/* Cards de destaque */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {highlights.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{item.number}</div>
                <div className="text-sm text-gray-600 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Conteúdo da história */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">O Início</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      A FG Services nasceu em <span className="font-bold text-primary">2010</span> como uma pequena loja de materiais de limpeza em <span className="font-semibold">Igarassu/PE</span>. 
                      Dois anos depois, tornou-se distribuidora e, em <span className="font-bold text-primary">2015</span>, deu o grande passo rumo à terceirização 
                      de serviços, conquistando seus primeiros contratos no setor de atacado. Desde então, a empresa 
                      viveu um crescimento constante e sustentável, expandindo suas operações para diferentes estados 
                      e segmentos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Crescimento e Conquistas</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Durante a pandemia de <span className="font-bold text-secondary">2020</span>, a FG manteve sua essência de cuidado e compromisso, garantindo 
                      todos os empregos e crescendo mais de <span className="font-bold text-green-600">30%</span>. Em <span className="font-bold text-secondary">2023</span>, conquistou o selo <span className="font-bold text-yellow-600">GPTW (Great Place to Work)</span>, 
                      certificação internacional que reconhece a empresa como um excelente lugar para trabalhar — marca 
                      que mantém até hoje. Em <span className="font-bold text-secondary">2024</span>, alcançamos mais de <span className="font-bold text-blue-600">3.500 colaboradores</span> espalhados em <span className="font-bold text-blue-600">15 estados 
                      brasileiros</span>, e em <span className="font-bold text-secondary">2025</span> inauguramos nossa nova sede administrativa, consolidando nossa presença 
                      como referência nacional em terceirização.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

