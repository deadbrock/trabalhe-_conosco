# 🎨 DESIGN QUICK REFERENCE - CHEAT SHEET

## 🎯 Referência Rápida de Design

---

## 🎨 CORES

```css
/* Cores Principais */
primary: #a2122a (Vermelho FG Services)
secondary: #354a80 (Azul)

/* Gradientes Comuns */
bg-gradient-to-r from-primary to-secondary
bg-gradient-to-r from-primary to-red-700
bg-gradient-to-b from-white to-gray-50
```

---

## 📏 ESPAÇAMENTOS PADRÃO

```css
/* Seção */
py-20 (80px top/bottom)

/* Cards */
p-6 (24px)
p-8 (32px)

/* Gaps */
gap-4 (16px)
gap-6 (24px)
```

---

## 🔲 COMPONENTES RÁPIDOS

### **Card:**
```html
<div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
```

### **Botão Primário:**
```html
<button class="rounded-xl px-6 py-4 font-bold text-white 
               bg-gradient-to-r from-primary to-red-700 
               hover:from-red-700 hover:to-primary 
               transition-all duration-300 shadow-lg hover:scale-105">
```

### **Input:**
```html
<input class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 
              px-4 py-3 focus:border-primary focus:bg-white transition-all">
```

### **Badge:**
```html
<div class="px-3 py-1 bg-gradient-to-r from-primary to-secondary 
            rounded-full text-white text-xs font-bold">
  Nova
</div>
```

---

## ✨ EFEITOS HOVER

```css
/* Cards */
hover:shadow-2xl hover:-translate-y-2

/* Botões */
hover:scale-105 hover:shadow-xl

/* Links */
opacity-90 hover:opacity-100
```

---

## 📱 BREAKPOINTS

```css
sm:  640px   /* Tablet pequeno */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Desktop grande */
```

---

## 🎭 ANIMAÇÕES FRAMER MOTION

```tsx
// Fade In
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>

// Scale In
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.6 }}
>
```

---

## 📦 LAYOUT CONTAINERS

```css
/* Container principal */
max-w-6xl mx-auto px-4

/* Grid 3 colunas */
grid gap-6 sm:grid-cols-2 lg:grid-cols-3

/* Flex centralizado */
flex items-center justify-center
```

---

## 🔧 CLASSES ESPECIAIS

```css
/* Backdrop blur */
bg-white/10 backdrop-blur-sm

/* Drop shadow (texto) */
text-white drop-shadow-2xl

/* Texto gradiente */
bg-gradient-to-r from-gray-900 via-primary to-secondary 
bg-clip-text text-transparent
```

---

## 📋 TEMPLATE DE SEÇÃO

```html
<section class="relative py-20 bg-gradient-to-b from-white to-gray-50">
  <div class="mx-auto max-w-6xl px-4">
    <!-- Header -->
    <div class="mb-12 text-center">
      <div class="inline-block px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-4">
        <span class="text-primary font-semibold">Badge</span>
      </div>
      <h2 class="text-4xl sm:text-5xl font-bold mb-4">
        <span class="bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
          Título
        </span>
      </h2>
      <p class="text-gray-600 text-lg">Descrição</p>
      <div class="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4" />
    </div>
    
    <!-- Conteúdo -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Cards aqui -->
    </div>
  </div>
</section>
```

---

## 🎨 COPIAR & COLAR

### **Hero com vídeo:**
```html
<section class="relative flex items-center justify-center overflow-hidden h-[70vh]">
  <div class="absolute inset-0 w-full">
    <video class="absolute inset-0 w-full h-full object-cover" src="/video.mp4" autoPlay muted loop playsInline />
  </div>
  <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
  <div class="relative z-10 mx-auto max-w-6xl px-6 text-center">
    <h1 class="text-7xl font-extrabold text-white drop-shadow-2xl">
      Seu Título
    </h1>
  </div>
</section>
```

### **Form completo:**
```html
<form class="space-y-5">
  <div>
    <label class="block text-sm font-semibold text-gray-700 mb-2">Nome *</label>
    <input 
      type="text"
      required
      class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 focus:border-primary focus:bg-white transition-all" 
    />
  </div>
  
  <button 
    type="submit"
    class="w-full rounded-xl px-6 py-4 font-bold text-white bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary transition-all duration-300 shadow-lg hover:scale-105"
  >
    Enviar
  </button>
</form>
```

### **Loading state:**
```html
<div class="text-center py-20">
  <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  <p class="text-gray-600 mt-4">Carregando...</p>
</div>
```

### **Empty state:**
```html
<div class="text-center py-20">
  <Icon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
  <h3 class="text-2xl font-bold text-gray-900 mb-2">Nenhum item encontrado</h3>
  <p class="text-gray-600">Descrição do estado vazio.</p>
</div>
```

---

## 🚀 INÍCIO RÁPIDO

1. **Instalar:**
```bash
npm install tailwindcss framer-motion lucide-react
```

2. **Copiar cores para `globals.css`:**
```css
:root {
  --primary: #a2122a;
  --secondary: #354a80;
}
```

3. **Usar componentes:**
Copie os templates acima e adapte!

---

**Para referência completa, veja:** `GUIA_DESIGN_SYSTEM.md`

