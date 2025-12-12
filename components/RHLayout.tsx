import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Star, 
  MessageCircle, 
  Shield, 
  FileText, 
  ChevronDown,
  Bell
} from "lucide-react";
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
  }, []);

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
    <div className="rh-panel">
      
      {/* Navbar Premium */}
      <header className="rh-navbar">
        <div className="rh-navbar-content">
          
          {/* Brand */}
          <div className="hidden md:flex items-center gap-3">
            <div className="rh-nav-icon">
              A
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold text-slate-900">AstronTalent</div>
              <div className="text-xs text-slate-500">Sistema de Gestão de Talentos</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rh-btn-ghost rh-btn-icon"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {menuItems.map((item, index) => {
              // Se tem submenu, renderiza dropdown
              if ('submenu' in item && item.submenu) {
                const isOpen = openDropdown === item.label;
                return (
                  <div key={index} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                      className="rh-nav-item"
                    >
                      <item.icon size={18} />
                      {item.label}
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {isOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenDropdown(null)}
                        />
                        <div className="rh-dropdown" style={{ top: '100%', marginTop: '0.5rem' }}>
                          {item.submenu.map((subItem, subIndex) => (
                            <Link 
                              key={subIndex} 
                              href={subItem.href}
                              className="rh-dropdown-item"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <subItem.icon size={18} />
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              }
              
              // Item simples
              return (
                <Link 
                  key={index} 
                  href={item.href}
                  className={`rh-nav-item ${router.pathname === item.href ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggleCompact />
            <NotificationCenter />
            <button 
              onClick={handleLogout}
              className="rh-btn-ghost rh-btn-icon"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="rh-nav-icon">A</div>
                <div>
                  <div className="font-bold text-slate-900">AstronTalent</div>
                  <div className="text-xs text-slate-500">Gestão de Talentos</div>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="rh-btn-ghost rh-btn-icon">
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item, index) => {
                if ('submenu' in item && item.submenu) {
                  const isOpen = openDropdown === item.label;
                  return (
                    <div key={index}>
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                        className="w-full rh-nav-item justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={20} />
                          {item.label}
                        </div>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <subItem.icon size={16} />
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`w-full rh-nav-item ${router.pathname === item.href ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <button 
                  onClick={handleLogout}
                  className="w-full rh-btn-danger"
                >
                  <LogOut size={20} />
                  Sair
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="rh-container">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="rh-container">
          <div className="py-6 text-center text-sm text-slate-500">
            AstronTalent © {new Date().getFullYear()} Aestron
          </div>
        </div>
      </footer>
    </div>
  );
}
