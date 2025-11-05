import React from "react";
import { motion } from "framer-motion";
import { Heart, Target, Sparkles } from "lucide-react";

export default function ConclusionSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent" />
      
      <div className="mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6"
          >
            <span className="text-primary font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nosso Compromisso
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
              Fazendo a Diferença
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-12" />

          {/* Card principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <p className="text-gray-700 text-lg sm:text-xl lg:text-2xl leading-relaxed mb-8">
                Hoje, a <span className="font-bold text-primary">FG Services</span> é sinônimo de <span className="font-semibold text-gray-900">confiança</span>, <span className="font-semibold text-gray-900">excelência</span> e <span className="font-semibold text-gray-900">inovação</span> em terceirização 
                de serviços especializados. Com uma equipe forte, presente em diferentes setores e 
                regiões do Brasil, seguimos firmes em nossa missão: oferecer soluções eficientes, 
                sustentáveis e que façam diferença na vida de nossos clientes, colaboradores e comunidades.
              </p>

              {/* Ícones de valores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-lg">
                    <Heart className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Cuidado</h3>
                  <p className="text-gray-600 text-sm mt-1">Com pessoas</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Excelência</h3>
                  <p className="text-gray-600 text-sm mt-1">Em serviços</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-3 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Inovação</h3>
                  <p className="text-gray-600 text-sm mt-1">Constante</p>
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <a
                  href="#oportunidades"
                  className="inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-2xl hover:shadow-primary/50 hover:scale-105"
                >
                  Faça Parte da Nossa História
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

