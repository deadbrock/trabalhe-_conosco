import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Target, ShieldCheck, Lightbulb } from "lucide-react";

type ValueItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  text: string;
};

const values: ValueItem[] = [
  { id: "v1", icon: <HeartHandshake size={22} />, title: "Colaboração", text: "Trabalhamos em equipe com empatia e respeito." },
  { id: "v2", icon: <Target size={22} />, title: "Foco em Resultado", text: "Buscamos impacto real para nossos clientes e times." },
  { id: "v3", icon: <ShieldCheck size={22} />, title: "Integridade", text: "Transparência e ética guiam nossas decisões." },
  { id: "v4", icon: <Lightbulb size={22} />, title: "Inovação", text: "Curiosidade e melhoria contínua no dia a dia." },
];

export default function ValuesSection() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Valores Institucionais</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, idx) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="group relative rounded-xl border border-white/10 bg-white/5 p-5 will-change-transform [transform-style:preserve-3d]"
              style={{ perspective: 1000 }}
              onMouseMove={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                const rect = target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                target.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLDivElement;
                target.style.transform = "rotateX(0deg) rotateY(0deg)";
              }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(ellipse_at_center,theme(colors.secondary/18),transparent_60%)]" />
              <div className="relative z-10">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20 text-secondary shadow-inner">
                  {v.icon}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
                <p className="mt-1 text-white/70 text-sm">{v.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

