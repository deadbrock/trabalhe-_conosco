# 🎨 GUIA DE DESIGN SYSTEM - TRABALHE CONOSCO

## 📋 Visão Geral

Este é o design system completo usado no projeto **Trabalhe Conosco**. Você pode replicar este mesmo estilo em qualquer projeto seguindo estas especificações.

---

## 🎯 PRINCÍPIOS DE DESIGN

### **1. Moderno e Minimalista**
- Design limpo com foco no conteúdo
- Uso generoso de espaçamento (whitespace)
- Hierarquia visual clara

### **2. Gradientes e Profundidade**
- Uso extensivo de gradientes sutis
- Sombras para criar profundidade
- Efeitos de blur e backdrop para modernidade

### **3. Animações Suaves**
- Transições fluidas (300ms padrão)
- Animações com Framer Motion
- Hover states com scale e sombras

### **4. Mobile-First**
- Design responsivo desde o início
- Breakpoints do Tailwind CSS
- Touch-friendly (botões grandes, espaçamento adequado)

---

## 🎨 PALETA DE CORES

### **Cores Principais:**

```css
/* Vermelho Primário (FG Services) */
--primary: #a2122a;
/* RGB: 162, 18, 42 */
/* HSL: 351°, 80%, 35% */

/* Azul Secundário */
--secondary: #354a80;
/* RGB: 53, 74, 128 */
/* HSL: 223°, 42%, 35% */

/* Fundo Escuro */
--background: #0a0a0a;
/* RGB: 10, 10, 10 */

/* Texto Claro */
--foreground: #ffffff;
/* RGB: 255, 255, 255 */
```

### **Cores Neutras (Tailwind padrão):**

```css
/* Branco */
white: #ffffff

/* Cinzas */
gray-50: #f9fafb
gray-100: #f3f4f6
gray-200: #e5e7eb
gray-300: #d1d5db
gray-400: #9ca3af
gray-500: #6b7280
gray-600: #4b5563
gray-700: #374151
gray-800: #1f2937
gray-900: #111827

/* Preto */
black: #000000
```

### **Cores de Estado:**

```css
/* Sucesso */
green-50: #f0fdf4
green-500: #22c55e
green-600: #16a34a
green-700: #15803d
green-900: #14532d

/* Erro */
red-50: #fef2f2
red-500: #ef4444
red-600: #dc2626
red-700: #b91c1c

/* Informação */
blue-50: #eff6ff
blue-100: #dbeafe
blue-500: #3b82f6
blue-700: #1d4ed8

/* Alerta */
yellow-50: #fefce8
yellow-500: #eab308

/* Roxo (diferenciais) */
purple-600: #9333ea
purple-700: #7e22ce
```

---

## 📐 TIPOGRAFIA

### **Família de Fontes:**

```css
/* Sans-serif padrão */
font-family: Arial, Helvetica, sans-serif;

/* Alternativa moderna (se usar Geist) */
--font-geist-sans: "Geist", sans-serif;
--font-geist-mono: "Geist Mono", monospace;
```

### **Tamanhos de Texto:**

```css
/* Títulos Principais (Hero) */
text-8xl: 6rem (96px) - Desktop
text-7xl: 4.5rem (72px) - Tablet
text-5xl: 3rem (48px) - Mobile

/* Títulos de Seção */
text-5xl: 3rem (48px)
text-4xl: 2.25rem (36px)
text-3xl: 1.875rem (30px)
text-2xl: 1.5rem (24px)

/* Texto Corpo */
text-xl: 1.25rem (20px) - Grande
text-lg: 1.125rem (18px) - Médio
text-base: 1rem (16px) - Padrão
text-sm: 0.875rem (14px) - Pequeno
text-xs: 0.75rem (12px) - Muito pequeno
```

### **Pesos de Fonte:**

```css
font-light: 300 (Subtítulos)
font-normal: 400 (Texto corpo)
font-medium: 500 (Links, labels)
font-semibold: 600 (Botões)
font-bold: 700 (Títulos secundários)
font-extrabold: 800 (Títulos principais)
```

---

## 📏 ESPAÇAMENTOS

### **Sistema de Espaçamento (Tailwind):**

```css
/* Base: 0.25rem = 4px */
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
20: 5rem (80px)
24: 6rem (96px)
```

### **Espaçamentos Comuns:**

```css
/* Padding de Seções */
py-20: 5rem (80px) top/bottom

/* Padding de Cards */
p-6: 1.5rem (24px)
p-8: 2rem (32px)

/* Gap entre elementos */
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)

/* Margens */
mb-4: 1rem (16px)
mb-6: 1.5rem (24px)
mb-12: 3rem (48px)
```

---

## 🎭 GRADIENTES

### **Gradiente Principal (Horizontal):**

```css
/* Vermelho → Azul */
background: linear-gradient(to right, #a2122a, #354a80);
background-size: 200% 200%;

/* Classe Tailwind */
bg-gradient-to-r from-primary to-secondary
```

### **Gradiente Invertido:**

```css
/* Azul → Vermelho */
bg-gradient-to-r from-secondary to-primary
```

### **Gradiente Vertical:**

```css
/* Top → Bottom */
bg-gradient-to-b from-white to-gray-50
bg-gradient-to-b from-white via-gray-50 to-white
```

### **Gradiente para Texto:**

```css
/* Texto com gradiente */
bg-gradient-to-r from-gray-900 via-primary to-secondary 
bg-clip-text text-transparent
```

### **Gradiente com Opacidade:**

```css
/* Overlay de vídeo */
bg-gradient-to-b from-black/60 via-black/50 to-black/70
```

### **Gradiente Radial:**

```css
/* Efeito vinheta */
bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]
```

---

## 🔲 COMPONENTES

### **1. CARDS (Padrão Principal):**

```html
<!-- Card Básico -->
<div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
  <!-- Conteúdo -->
</div>

<!-- Card com Hover -->
<div class="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl 
            transition-all duration-300 hover:-translate-y-2 
            border border-gray-200">
  <!-- Conteúdo -->
</div>

<!-- Card com Gradiente de Fundo -->
<div class="relative overflow-hidden rounded-2xl border border-gray-200 
            bg-white p-6 shadow-lg hover:shadow-2xl 
            transition-all duration-300 group">
  <!-- Conteúdo -->
  <div class="absolute inset-0 rounded-2xl 
              bg-gradient-to-br from-primary/5 to-secondary/5 
              opacity-0 transition-opacity duration-300 
              group-hover:opacity-100 pointer-events-none" />
</div>
```

### **2. BOTÕES:**

#### **Botão Primário (Gradiente):**
```html
<button class="rounded-xl px-6 py-4 font-bold text-lg text-white 
               bg-gradient-to-r from-primary to-red-700 
               hover:from-red-700 hover:to-primary 
               transition-all duration-300 shadow-lg 
               hover:shadow-xl hover:scale-105">
  Texto do Botão
</button>
```

#### **Botão Secundário (Outline):**
```html
<button class="rounded-full px-8 py-4 font-semibold text-lg text-white 
               bg-white/10 backdrop-blur-sm border-2 border-white/30 
               hover:bg-white/20 transition-all duration-300">
  Texto do Botão
</button>
```

#### **Botão de Link:**
```html
<a href="#" class="inline-flex items-center gap-2 
                   px-6 py-3 bg-gradient-to-r from-primary to-red-700 
                   text-white font-semibold rounded-lg 
                   hover:shadow-lg transition-all">
  Ver Detalhes
  <svg>...</svg>
</a>
```

### **3. INPUTS E FORMULÁRIOS:**

```html
<!-- Input com Ícone -->
<div class="relative">
  <User class="absolute left-3 top-1/2 -translate-y-1/2 
              w-5 h-5 text-gray-400" />
  <input 
    type="text"
    class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 
           pl-11 pr-4 py-3 outline-none 
           focus:border-primary focus:bg-white 
           transition-all text-gray-900 
           placeholder:text-gray-400" 
    placeholder="Seu nome completo" 
  />
</div>

<!-- Select -->
<select class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 
               px-4 py-3 outline-none 
               focus:border-primary focus:bg-white 
               transition-all text-gray-900">
  <option value="">Selecione</option>
</select>

<!-- File Input -->
<input 
  type="file" 
  class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 
         px-4 py-3 outline-none focus:border-primary focus:bg-white 
         transition-all text-gray-900 
         file:mr-4 file:rounded-lg file:border-0 
         file:bg-gradient-to-r file:from-primary file:to-red-700 
         file:px-4 file:py-2 file:text-white file:font-semibold 
         hover:file:shadow-lg file:transition-all cursor-pointer" 
/>
```

### **4. BADGES:**

```html
<!-- Badge Novo -->
<div class="px-3 py-1 bg-gradient-to-r from-primary to-secondary 
            rounded-full text-white text-xs font-bold">
  Nova
</div>

<!-- Badge Status -->
<span class="inline-flex items-center rounded-lg 
             bg-blue-100 text-blue-700 
             px-3 py-1.5 text-sm font-medium">
  CLT
</span>

<!-- Badge de Topo -->
<div class="inline-block px-4 py-2 
            bg-gradient-to-r from-primary/10 to-secondary/10 
            rounded-full mb-4">
  <span class="text-primary font-semibold">Junte-se a nós</span>
</div>
```

### **5. HEADERS DE SEÇÃO:**

```html
<!-- Header Completo -->
<div class="mb-12 text-center">
  <div class="inline-block px-4 py-2 
              bg-gradient-to-r from-primary/10 to-secondary/10 
              rounded-full mb-4">
    <span class="text-primary font-semibold">Texto pequeno</span>
  </div>
  <h2 class="text-4xl sm:text-5xl font-bold mb-4">
    <span class="bg-gradient-to-r from-gray-900 via-primary to-secondary 
                 bg-clip-text text-transparent">
      Título da Seção
    </span>
  </h2>
  <p class="text-gray-600 text-lg">Descrição da seção.</p>
  <div class="w-24 h-1 bg-gradient-to-r from-primary to-secondary 
              mx-auto rounded-full mt-4" />
</div>
```

### **6. ALERTAS:**

```html
<!-- Sucesso -->
<div class="bg-green-50 border-2 border-green-500 rounded-xl p-4 
            flex items-start gap-3">
  <CheckCircle2 class="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
  <div>
    <h4 class="font-bold text-green-900 mb-1">Sucesso!</h4>
    <p class="text-green-700 text-sm">Mensagem de sucesso aqui.</p>
  </div>
</div>

<!-- Erro -->
<div class="bg-red-50 border-2 border-red-500 rounded-xl p-4">
  <p class="text-red-700 font-semibold">Mensagem de erro</p>
</div>
```

### **7. LOADING SPINNER:**

```html
<div class="inline-block animate-spin rounded-full 
            h-12 w-12 border-4 border-primary 
            border-t-transparent"></div>
```

---

## ✨ ANIMAÇÕES

### **1. Transições Básicas:**

```css
/* Transição padrão */
transition-all duration-300

/* Transição longa */
transition-all duration-500

/* Transição com easing */
transition-all duration-300 ease-in-out
```

### **2. Hover Effects:**

```css
/* Scale up */
hover:scale-105

/* Translate up */
hover:-translate-y-2

/* Sombra maior */
hover:shadow-xl
hover:shadow-2xl

/* Opacidade */
opacity-90 hover:opacity-100
```

### **3. Framer Motion (Fade In):**

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Conteúdo
</motion.div>
```

### **4. Framer Motion (Scale In):**

```tsx
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
  Conteúdo
</motion.div>
```

### **5. Animação de Bounce:**

```tsx
<motion.div
  animate={{ y: [0, 10, 0] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  <ChevronDown />
</motion.div>
```

### **6. Gradiente Animado (CSS):**

```css
/* No globals.css */
@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Aplicar */
.animate-gradient {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  background-size: 200% 200%;
  animation: gradientFlow 24s ease-in-out infinite;
}
```

---

## 🎯 PADRÕES DE LAYOUT

### **1. Container Principal:**

```css
/* Container responsivo */
max-w-6xl mx-auto px-4

/* Container largo */
max-w-7xl mx-auto px-4

/* Container estreito */
max-w-4xl mx-auto px-4
```

### **2. Seção Completa:**

```html
<section class="relative py-20 bg-gradient-to-b from-white to-gray-50">
  <div class="mx-auto max-w-6xl px-4">
    <!-- Conteúdo -->
  </div>
</section>
```

### **3. Grid Responsivo:**

```css
/* 2 colunas em mobile, 3 em desktop */
grid gap-6 sm:grid-cols-2 lg:grid-cols-3

/* 1 coluna mobile, 2 desktop */
grid gap-4 md:grid-cols-2

/* Grid de 2 colunas fixas */
grid grid-cols-2 gap-4
```

### **4. Flexbox Centralizado:**

```css
/* Centro vertical e horizontal */
flex items-center justify-center

/* Espaçamento entre elementos */
flex items-center justify-between

/* Coluna no mobile, linha no desktop */
flex flex-col sm:flex-row gap-4
```

### **5. Sticky Sidebar:**

```css
/* Sidebar que gruda no scroll */
lg:sticky lg:top-6 h-fit
```

---

## 🖼️ EFEITOS ESPECIAIS

### **1. Backdrop Blur:**

```css
/* Fundo desfocado */
backdrop-blur-sm
backdrop-blur-md
backdrop-blur-lg

/* Com background semi-transparente */
bg-white/10 backdrop-blur-sm
bg-black/40 backdrop-blur
```

### **2. Drop Shadow:**

```css
/* Sombra de texto */
drop-shadow-lg
drop-shadow-2xl

/* Para títulos sobre vídeo */
text-white drop-shadow-2xl
```

### **3. Vinheta (Efeito de Borda Escura):**

```html
<div class="absolute inset-0 
            bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
```

### **4. Overlay de Gradiente:**

```html
<!-- Sobre vídeo/imagem -->
<div class="absolute inset-0 
            bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
```

### **5. Partículas CSS:**

```css
/* No globals.css */
.particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14) 1px, transparent 1px),
    radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 1px, transparent 1px),
    radial-gradient(circle at 70% 80%, rgba(255,255,255,0.12) 1px, transparent 1px);
  background-size: 200px 200px, 260px 260px, 220px 220px, 240px 240px;
  animation: float 14s linear infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}
```

---

## 📱 BREAKPOINTS

### **Tailwind Breakpoints Padrão:**

```css
/* Mobile First */
/* xs: < 640px (padrão, sem prefixo) */

sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### **Uso Comum:**

```css
/* Mobile: stack, Desktop: lado a lado */
flex flex-col lg:flex-row

/* Mobile: 1 coluna, Tablet: 2, Desktop: 3 */
grid sm:grid-cols-2 lg:grid-cols-3

/* Mobile: texto pequeno, Desktop: grande */
text-3xl lg:text-5xl

/* Mobile: padding menor, Desktop: maior */
p-4 lg:p-8
```

---

## 🎨 CLASSES UTILITÁRIAS CUSTOMIZADAS

### **No seu `globals.css`:**

```css
/* Botão com gradiente animado */
.btn-gradient {
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  background-size: 200% 200%;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Efeito neon pulsante */
.animate-neon {
  box-shadow: 0 0 10px color-mix(in oklab, var(--primary), white 30%), 
              0 0 20px var(--primary);
  animation: neonPulse 1.8s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% { 
    box-shadow: 0 0 8px var(--primary), 
                0 0 18px color-mix(in oklab, var(--primary), white 20%); 
  }
  50% { 
    box-shadow: 0 0 16px var(--primary), 
                0 0 30px color-mix(in oklab, var(--primary), white 35%); 
  }
}

/* Fundo com gradiente animado */
.animated-gradient {
  background: radial-gradient(ellipse at top left, 
                              color-mix(in oklab, var(--primary), transparent 70%), 
                              transparent 40%),
              radial-gradient(ellipse at bottom right, 
                              color-mix(in oklab, var(--secondary), transparent 70%), 
                              transparent 40%);
  filter: blur(40px) saturate(120%);
  opacity: 0.6;
}
```

---

## 🔧 CONFIGURAÇÃO DO TAILWIND

### **Criar `tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a2122a",
        secondary: "#354a80",
        background: "#0a0a0a",
        foreground: "#ffffff",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
```

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "tailwindcss": "^4.0.0"
  }
}
```

---

## 🎬 EXEMPLOS COMPLETOS

### **HERO SECTION:**

```tsx
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
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
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight">
            <span className="block text-white drop-shadow-2xl">
              <span className="text-primary">Construa</span> seu futuro
            </span>
          </h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4 justify-center mt-12"
          >
            <a
              href="#"
              className="rounded-full px-8 py-4 font-bold text-lg text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-2xl hover:scale-105"
            >
              Ver Oportunidades
            </a>
          </motion.div>
        </motion.div>

        {/* Seta animada */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </div>
    </section>
  );
}
```

### **CARD DE VAGA:**

```tsx
<article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
  {/* Badge */}
  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-xs font-bold">
    Nova
  </div>

  {/* Conteúdo */}
  <div className="relative z-10">
    <h3 className="text-xl font-bold text-gray-900 mb-3 pr-12">
      Desenvolvedor Full Stack
    </h3>
    
    <div className="flex items-center gap-2 mb-4">
      <span className="inline-flex items-center rounded-lg bg-blue-100 text-blue-700 px-3 py-1.5 text-sm font-medium">
        CLT
      </span>
    </div>

    {/* CTA */}
    <a
      href="#"
      className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
    >
      Ver Detalhes
      <svg>...</svg>
    </a>
  </div>

  {/* Efeito hover */}
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
</article>
```

### **HEADER RESPONSIVO:**

```tsx
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-white/10 bg-black/40 backdrop-blur ${
        scrolled ? "h-14" : "h-20"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
        <div className="text-lg font-semibold text-white">
          Seu Logo
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#" className="text-white opacity-90 hover:opacity-100 transition">
            Link
          </a>
        </nav>
      </div>
    </header>
  );
}
```

---

## 🚀 COMEÇAR UM NOVO PROJETO COM ESTE DESIGN

### **1. Instalar dependências:**

```bash
npm install tailwindcss framer-motion lucide-react
```

### **2. Criar `globals.css`:**

Copie todo o conteúdo do arquivo `styles/globals.css` deste projeto.

### **3. Configurar Tailwind:**

Crie `tailwind.config.js` com as cores customizadas (veja seção acima).

### **4. Usar componentes:**

Copie e cole os exemplos de componentes acima, ajustando conforme necessário.

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

Para implementar este design em um novo projeto:

- [ ] Instalar Tailwind CSS v4
- [ ] Instalar Framer Motion
- [ ] Instalar Lucide React (ícones)
- [ ] Copiar `globals.css` completo
- [ ] Configurar cores no Tailwind config
- [ ] Criar componentes de UI (Button, Card, Badge, Input)
- [ ] Implementar animações com Framer Motion
- [ ] Testar responsividade em todos os breakpoints
- [ ] Adicionar estados de hover/focus em todos os elementos interativos
- [ ] Garantir acessibilidade (contraste, foco visível)

---

## 💡 DICAS E BOAS PRÁTICAS

### **1. Consistência:**
- Use sempre os mesmos espaçamentos (múltiplos de 4)
- Mantenha os border-radius consistentes (rounded-xl, rounded-2xl, rounded-3xl)
- Use as mesmas durações de transição (300ms padrão)

### **2. Hierarquia Visual:**
- Título principal: `text-4xl` ou maior + `font-bold`
- Subtítulos: `text-2xl` + `font-semibold`
- Texto corpo: `text-base` + `font-normal`
- Texto pequeno: `text-sm` + `text-gray-600`

### **3. Cores:**
- Fundo principal: `bg-white` ou `bg-gradient-to-b from-white to-gray-50`
- Texto principal: `text-gray-900`
- Texto secundário: `text-gray-600`
- Acentos: `text-primary` ou `bg-gradient-to-r from-primary to-secondary`

### **4. Sombras:**
- Cards: `shadow-lg` → `hover:shadow-2xl`
- Botões: `shadow-md` → `hover:shadow-lg`
- Modais: `shadow-2xl`

### **5. Estados Interativos:**
- Sempre adicione `hover:`, `focus:`, e `active:` states
- Use `transition-all duration-300` para suavidade
- Adicione `hover:scale-105` em botões
- Use `hover:-translate-y-2` em cards

---

## 📚 RECURSOS ADICIONAIS

### **Documentação:**
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion/
- Lucide Icons: https://lucide.dev

### **Ferramentas:**
- Gradient Generator: https://cssgradient.io
- Color Palette: https://coolors.co
- Shadow Generator: https://shadows.brumm.af

---

## 🎉 CONCLUSÃO

Este design system foi criado com foco em:
- ✅ Modernidade e elegância
- ✅ Experiência do usuário fluida
- ✅ Responsividade total
- ✅ Fácil manutenção e escalabilidade
- ✅ Performance e acessibilidade

**Use e adapte conforme necessário para seus projetos! 🚀**

---

**Arquivo de referência:** Este guia documenta o design system usado no projeto "Trabalhe Conosco"  
**Autor:** Design System FG Services  
**Versão:** 1.0  
**Última atualização:** 2025

