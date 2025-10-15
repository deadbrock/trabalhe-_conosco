/**
 * 🎨 COMPONENTES PRONTOS - TRABALHE CONOSCO
 * 
 * Copie e cole estes componentes no seu projeto!
 * Ajuste conforme necessário.
 */

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Upload,
  Calendar,
  Home,
  ChevronDown,
  ArrowRight
} from "lucide-react";

// ============================================
// 1. HERO COM VÍDEO
// ============================================

export function HeroWithVideo() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden h-[70vh]">
      {/* Vídeo de fundo */}
      <div className="absolute inset-0 w-full">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      {/* Vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4"
          >
            <span className="text-white font-medium">✨ Sua carreira começa aqui</span>
          </motion.div>

          {/* Título */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="block text-white drop-shadow-2xl">
              <span className="text-primary">Construa</span> seu futuro
            </span>
            <span className="block text-white drop-shadow-2xl mt-2">
              conosco
            </span>
          </h1>
          
          {/* Subtítulo */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-white/90 text-xl sm:text-2xl font-light drop-shadow-lg max-w-3xl mx-auto"
          >
            Junte-se à nossa equipe
          </motion.p>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
          >
            <a
              href="#oportunidades"
              className="group relative inline-flex items-center justify-center rounded-full px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-2xl hover:shadow-primary/50 hover:scale-105"
            >
              <span className="relative z-10">Ver Oportunidades</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
            
            <a
              href="#sobre"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 font-semibold text-lg text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              Saiba Mais
            </a>
          </motion.div>
        </motion.div>

        {/* Seta para scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 2. HEADER FIXO RESPONSIVO
// ============================================

export function StickyHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/40 ${
        scrolled ? "h-14" : "h-20"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
        <div className="text-lg font-semibold text-white">
          <span className="text-white">Seu</span>{" "}
          <span className="text-white">Logo</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#sobre" className="text-white opacity-90 hover:opacity-100 transition font-medium">
            Sobre
          </a>
          <a href="#oportunidades" className="text-white opacity-90 hover:opacity-100 transition font-medium">
            Vagas
          </a>
          <a href="#contato" className="text-white opacity-90 hover:opacity-100 transition font-medium">
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
}

// ============================================
// 3. CARD DE VAGA
// ============================================

interface JobCardProps {
  title: string;
  contractType: string;
  location: string;
  isNew?: boolean;
  href: string;
}

export function JobCard({ title, contractType, location, isNew, href }: JobCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Badge */}
      {isNew && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-xs font-bold">
          Nova
        </div>
      )}

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col h-full min-h-[200px]">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-900 mb-3 pr-12 leading-tight">
            {title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-sm font-medium">
                {contractType}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{location}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a
            href={href}
            className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
          >
            Ver Detalhes
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Efeito hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
    </article>
  );
}

// ============================================
// 4. SEÇÃO COM HEADER COMPLETO
// ============================================

interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function SectionWithHeader({ badge, title, description, children }: SectionHeaderProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4">
            <span className="text-primary font-semibold">{badge}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <p className="text-gray-600 text-lg">{description}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4" />
        </div>

        {/* Conteúdo */}
        {children}
      </div>
    </section>
  );
}

// ============================================
// 5. FORMULÁRIO COMPLETO
// ============================================

export function ApplicationForm() {
  const [formData, setFormData] = React.useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sua lógica de envio aqui
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({ nome: "", cpf: "", email: "", telefone: "" });
    } catch (err) {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Candidate-se</h2>
        <p className="text-gray-600">Preencha seus dados</p>
      </div>
      
      {success && (
        <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-green-900 mb-1">Enviado com sucesso!</h4>
            <p className="text-green-700 text-sm">Entraremos em contato em breve.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-4">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
              placeholder="Seu nome completo" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:border-primary focus:bg-white transition-all text-gray-900 placeholder:text-gray-400" 
              placeholder="seu@email.com" 
            />
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full rounded-xl px-6 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

// ============================================
// 6. LOADING STATE
// ============================================

export function LoadingState() {
  return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="text-gray-600 mt-4">Carregando...</p>
    </div>
  );
}

// ============================================
// 7. EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 text-gray-300 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-red-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}

// ============================================
// 8. BADGE COMPONENT
// ============================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "info" | "warning";
}

export function Badge({ children, variant = "primary" }: BadgeProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    success: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ============================================
// 9. BUTTON COMPONENT
// ============================================

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false,
  type = "button"
}: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white",
    outline: "border-2 border-gray-300 hover:border-primary hover:text-primary text-gray-700 bg-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

// ============================================
// 10. CARD CONTAINER
// ============================================

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({ children, hover = false, gradient = false }: CardProps) {
  return (
    <div className={`
      relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-lg
      ${hover ? "hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group" : ""}
    `}>
      {children}
      {gradient && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      )}
    </div>
  );
}

// ============================================
// EXEMPLO DE USO:
// ============================================

/*
import { HeroWithVideo, SectionWithHeader, JobCard, ApplicationForm } from './COMPONENTES_PRONTOS';

function App() {
  return (
    <>
      <HeroWithVideo />
      
      <SectionWithHeader
        badge="Junte-se a nós"
        title="Vagas Disponíveis"
        description="Encontre a oportunidade ideal para você"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <JobCard
            title="Desenvolvedor Full Stack"
            contractType="CLT"
            location="São Paulo, SP"
            isNew
            href="/vaga/1"
          />
        </div>
      </SectionWithHeader>

      <ApplicationForm />
    </>
  );
}
*/

