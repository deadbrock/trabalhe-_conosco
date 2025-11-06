import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Briefcase, Users, LogOut, Menu, X, Star, MessageCircle, Shield } from "lucide-react";
import { ThemeToggleCompact } from "./ThemeToggle";
import DelicateAnimations from "./DelicateAnimations";
import NotificationCenter from "./NotificationCenter";

export default function RHLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { href: "/rh/candidatos", icon: Users, label: "Candidatos" },
    { href: "/rh/banco-talentos", icon: Star, label: "Banco de Talentos" },
    { href: "/rh/comunicacao", icon: MessageCircle, label: "Comunicação" },
    { href: "/rh/lgpd-solicitacoes", icon: Shield, label: "LGPD" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Animações Delicadas (apenas tema feminino) */}
      <DelicateAnimations />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel RH</h1>
                <p className="text-xs text-gray-500">FG Services</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all h-10 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex items-center h-10">
                <NotificationCenter />
              </div>
              <div className="flex items-center h-10">
                <ThemeToggleCompact />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all ml-2 h-10"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "text-gray-600 hover:bg-gray-100"
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

