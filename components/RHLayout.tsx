import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Briefcase, Users, LogOut, Menu, X, Star, MessageCircle, Shield, FileText, ChevronDown } from "lucide-react";
import { ThemeToggleCompact } from "./ThemeToggle";
import DelicateAnimations from "./DelicateAnimations";
import NotificationCenter from "./NotificationCenter";

export default function RHLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("rh_token");
    if (!token) {
      router.push("/rh/login");
    } else {
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removido 'router' das dependências para evitar loop

  const handleLogout = () => {
    localStorage.removeItem("rh_token");
    router.push("/rh/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { href: "/rh", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/rh/vagas", icon: Briefcase, label: "Vagas" },
    { 
      label: "Candidatos", 
      icon: Users, 
      submenu: [
        { href: "/rh/candidatos", icon: Users, label: "Candidatos" },
        { href: "/rh/banco-talentos", icon: Star, label: "Banco de Talentos" },
        { href: "/rh/documentos", icon: FileText, label: "Documentos" },
      ]
    },
    { 
      label: "Comunicação", 
      icon: MessageCircle, 
      submenu: [
        { href: "/rh/comunicacao", icon: MessageCircle, label: "Comunicação" },
        { href: "/rh/lgpd-solicitacoes", icon: Shield, label: "LGPD" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-gray-100">
      {/* Animações Delicadas */}
      <DelicateAnimations />
      
      {/* Header - Design Moderno com Backdrop Blur */}
      <header className="backdrop-blur-md bg-primary/90 border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-center h-16">
            {/* Desktop Navigation - Centralizado */}
            <nav className="hidden md:flex items-center gap-3">
              {menuItems.map((item, index) => {
                // Se tem submenu, renderiza dropdown
                if ('submenu' in item && item.submenu) {
                  const isOpen = openDropdown === item.label;
                  const isAnySubmenuActive = item.submenu.some(sub => router.pathname === sub.href);
                  
                  return (
                    <div key={index} className="relative">
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium tracking-wide transition-all duration-300 h-10 ${
                          isAnySubmenuActive
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {item.submenu.map((subItem) => {
                            const isActive = router.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setOpenDropdown(null)}
                                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                                  isActive
                                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                <subItem.icon className="w-5 h-5" />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Se não tem submenu, renderiza link normal
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium tracking-wide transition-all duration-300 h-10 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Separador visual */}
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              
              <NotificationCenter />
              <ThemeToggleCompact />
              
              {/* Separador visual */}
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white/90 hover:bg-white/10 hover:text-white transition-all duration-300 h-10"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 absolute right-4 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-primary/95 backdrop-blur-md">
            <nav className="px-4 py-3 space-y-1">
              {menuItems.map((item, index) => {
                // Se tem submenu
                if ('submenu' in item && item.submenu) {
                  const isOpen = openDropdown === item.label;
                  const isAnySubmenuActive = item.submenu.some(sub => router.pathname === sub.href);
                  
                  return (
                    <div key={index}>
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                          isAnySubmenuActive
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                            : "text-white/90 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Submenu Mobile */}
                      {isOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => {
                            const isActive = router.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setOpenDropdown(null);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                                  isActive
                                    ? "bg-white/20 text-white shadow-md"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                <subItem.icon className="w-4 h-4" />
                                {subItem.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Se não tem submenu
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium tracking-wide transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex items-center justify-center gap-3 py-2">
                <NotificationCenter />
                <ThemeToggleCompact />
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-white/90 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content - Container com sombra e bordas arredondadas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {children}
        </div>
      </main>

      {/* Footer com créditos */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="text-gray-600">
              © {new Date().getFullYear()} <span className="font-semibold text-primary">AstronTalent</span> - FG Services
            </div>
            <div className="text-gray-500 text-xs">
              💻 Desenvolvido por <span className="font-semibold text-gray-700">Aestron</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

