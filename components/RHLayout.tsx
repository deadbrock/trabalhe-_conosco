import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Briefcase, Users, LogOut, Menu, X, Star, MessageCircle, Shield, FileText, ChevronDown } from "lucide-react";
import { ThemeToggleCompact } from "./ThemeToggle";
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
    <div className="min-h-screen at-page">
      
      {/* Navbar corporativa (glassmorphism) */}
      <header className="sticky top-0 z-50 at-navbar">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="hidden md:flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#354A80] text-white flex items-center justify-center font-semibold shadow-sm">
                A
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">AstronTalent</div>
                <div className="text-xs text-slate-500">Sistema de Gestão de Talentos</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
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
                        className={`flex items-center gap-3 px-3 py-2 rounded-[14px] font-medium transition-all duration-200 h-11 ${
                          isAnySubmenuActive
                            ? "bg-[#354A80] text-white shadow-sm"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className={`h-9 w-9 rounded-full flex items-center justify-center ${
                          isAnySubmenuActive ? "bg-white/15" : "bg-slate-100"
                        }`}>
                          <item.icon className={`w-5 h-5 ${isAnySubmenuActive ? "text-white" : "text-slate-700"}`} />
                        </span>
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-64 at-dropdown at-dropdown-anim py-2 z-50"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {item.submenu.map((subItem) => {
                            const isActive = router.pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setOpenDropdown(null)}
                                className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 ${
                                  isActive
                                    ? "bg-[#354A80] text-white"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <span className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                  isActive ? "bg-white/15" : "bg-slate-100"
                                }`}>
                                  <subItem.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-700"}`} />
                                </span>
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-[14px] font-medium transition-all duration-200 h-11 ${
                      isActive
                        ? "bg-[#354A80] text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      isActive ? "bg-white/15" : "bg-slate-100"
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-700"}`} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Separador visual */}
              <div className="w-px h-7 bg-slate-200 mx-1"></div>
              
              <NotificationCenter />
              <ThemeToggleCompact />
              
              {/* Separador visual */}
              <div className="w-px h-7 bg-slate-200 mx-1"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-[14px] font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200 h-11"
              >
                <span className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-slate-700" />
                </span>
                <span>Sair</span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-[14px] hover:bg-slate-100 text-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/70 backdrop-blur-xl">
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
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[18px] font-medium transition-all duration-200 ${
                          isAnySubmenuActive
                            ? "bg-[#354A80] text-white shadow-sm"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-9 w-9 rounded-full flex items-center justify-center ${
                            isAnySubmenuActive ? "bg-white/15" : "bg-slate-100"
                          }`}>
                            <item.icon className={`w-5 h-5 ${isAnySubmenuActive ? "text-white" : "text-slate-700"}`} />
                          </span>
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
                                className={`flex items-center gap-3 px-4 py-3 rounded-[18px] font-medium transition-all duration-200 ${
                                  isActive
                                    ? "bg-[#354A80] text-white shadow-sm"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                              >
                                <span className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                  isActive ? "bg-white/15" : "bg-slate-100"
                                }`}>
                                  <subItem.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-700"}`} />
                                </span>
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-[18px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#354A80] text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      isActive ? "bg-white/15" : "bg-slate-100"
                    }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-700"}`} />
                    </span>
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[18px] font-medium text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                <span className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-slate-700" />
                </span>
                <span>Sair</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content - Container com sombra e bordas arredondadas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="at-card">
          <div className="at-card-body p-6 sm:p-8">
          {children}
          </div>
        </div>
      </main>

      {/* Footer com créditos */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="text-gray-600">
              <span className="font-semibold text-primary">AstronTalent</span> © {new Date().getFullYear()} Aestron
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

