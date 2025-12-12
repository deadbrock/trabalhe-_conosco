# 📐 Arquitetura de Estilos - Trabalhe Conosco

## 🎯 Separação de Estilos

Este projeto possui **dois sistemas visuais completamente independentes**:

### 1️⃣ Site Público (Trabalhe Conosco)
**Arquivos de estilo:** `styles/globals.css`

**Componentes:**
- `components/Header.tsx`
- `components/Hero.tsx`
- `components/Layout.tsx`
- `components/JobsSection.tsx`
- `components/OurStorySection.tsx`
- `components/HistorySection.tsx`
- `components/ConclusionSection.tsx`

**Características:**
- ✅ Cores vibrantes (vermelho `#a2122a` e azul `#354a80`)
- ✅ Gradientes animados
- ✅ Partículas e efeitos visuais
- ✅ Vídeo de fundo no Hero
- ✅ Design moderno e atrativo para candidatos

**Rotas:**
- `/` - Página inicial
- `/vagas` - Lista de vagas
- `/vagas/[id]` - Detalhes da vaga
- `/candidatura/[vagaId]` - Formulário de candidatura

---

### 2️⃣ Painel RH (Astron)
**Arquivos de estilo:** `styles/rh-panel.css` ⚠️ **EXCLUSIVO DO PAINEL RH**

**Componentes:**
- `components/RHLayout.tsx` (importa `rh-panel.css`)
- `pages/rh/*.tsx` (todas as páginas do painel)

**Características:**
- ✅ Cores corporativas (primária `#354a80`, secundária `#a2122a`, neutros premium)
- ✅ Design limpo e profissional
- ✅ Glassmorphism e sombras suaves
- ✅ Interface de gestão otimizada
- ✅ Classe base `.rh-panel` em todos os elementos

**Rotas:**
- `/rh/login` - Login do RH (Astron)
- `/rh` - Dashboard
- `/rh/vagas` - Gestão de vagas
- `/rh/candidatos` - Gestão de candidatos
- `/rh/documentos` - Validação de documentos
- `/rh/banco-talentos` - Banco de talentos
- `/rh/comunicacao` - Comunicação com candidatos
- `/rh/lgpd-solicitacoes` - Solicitações LGPD

---

## 🚨 REGRAS IMPORTANTES

### ❌ NÃO FAZER:
1. **NÃO** modificar `globals.css` para alterar o painel RH
2. **NÃO** usar classes do `rh-panel.css` no site público
3. **NÃO** importar `rh-panel.css` em componentes públicos
4. **NÃO** usar a classe `.rh-panel` fora do painel RH

### ✅ FAZER:
1. **Modificações no Site Público:** Editar apenas `globals.css` e componentes públicos
2. **Modificações no Painel RH:** Editar apenas `rh-panel.css` e componentes RH
3. **Novos componentes RH:** Sempre adicionar a classe `.rh-panel` no elemento raiz
4. **Novas páginas RH:** Sempre usar `RHLayout` que já importa os estilos corretos

---

## 🎨 Guia de Classes CSS

### Site Público (globals.css)
```css
/* Usa variáveis CSS padrão */
--primary: #a2122a;
--secondary: #354a80;

/* Classes Tailwind padrão */
bg-gradient-to-r from-red-600 to-blue-600
text-white
shadow-lg
```

### Painel RH (rh-panel.css)
```css
/* Classes com prefixo .rh- */
.rh-panel          /* Container principal */
.rh-navbar         /* Barra de navegação */
.rh-card           /* Cards */
.rh-btn-primary    /* Botões primários */
.rh-btn-secondary  /* Botões secundários */
.rh-input          /* Inputs */
.rh-table          /* Tabelas */
.rh-badge          /* Badges */
.rh-dropdown       /* Dropdowns */
```

---

## 📝 Exemplo de Uso

### Componente do Site Público
```tsx
// components/Hero.tsx
export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-red-600 to-blue-600">
      {/* Usa classes Tailwind padrão */}
    </div>
  );
}
```

### Componente do Painel RH
```tsx
// pages/rh/dashboard.tsx
import RHLayout from "@/components/RHLayout";

export default function Dashboard() {
  return (
    <RHLayout>
      <div className="rh-card">
        <button className="rh-btn-primary">Ação</button>
      </div>
    </RHLayout>
  );
}
```

---

## 🔧 Manutenção

### Para adicionar nova funcionalidade no Painel RH:
1. Editar `styles/rh-panel.css`
2. Adicionar classes com prefixo `.rh-`
3. Testar apenas no painel RH
4. Verificar que o site público não foi afetado

### Para adicionar nova funcionalidade no Site Público:
1. Editar `styles/globals.css`
2. Usar classes Tailwind padrão
3. Testar apenas no site público
4. Verificar que o painel RH não foi afetado

---

## 📦 Estrutura de Arquivos

```
trabalhe-_conosco/
├── styles/
│   ├── globals.css           ← Site Público
│   └── rh-panel.css          ← Painel RH (EXCLUSIVO)
├── components/
│   ├── Header.tsx            ← Site Público
│   ├── Hero.tsx              ← Site Público
│   ├── Layout.tsx            ← Site Público
│   └── RHLayout.tsx          ← Painel RH (importa rh-panel.css)
└── pages/
    ├── index.tsx             ← Site Público
    ├── vagas/                ← Site Público
    └── rh/                   ← Painel RH (usa RHLayout)
        ├── login.tsx
        ├── index.tsx
        └── ...
```

---

## 🎯 Benefícios desta Arquitetura

✅ **Separação total** entre site público e painel RH
✅ **Manutenção independente** de cada sistema
✅ **Zero conflitos** de estilos
✅ **Facilidade** para adicionar novos recursos
✅ **Clareza** sobre onde modificar cada parte

---

**Desenvolvido por Aestron**
© 2025 Astron - Sistema de Gestão de Talentos

