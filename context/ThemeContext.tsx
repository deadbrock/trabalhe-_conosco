import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'default' | 'feminine';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isFeminine: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('default');

  // Carregar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme === 'feminine' || savedTheme === 'default') {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'feminine') {
      root.classList.add('theme-feminine');
    } else {
      root.classList.remove('theme-feminine');
    }
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'default' ? 'feminine' : 'default';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isFeminine: theme === 'feminine' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}

