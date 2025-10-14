# 🚀 FG Services - Portal de Vagas e Gestão de Candidatos

> Sistema completo de recrutamento e seleção com filtros geográficos inteligentes, integração WhatsApp e Kanban drag & drop.

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://trabalhe-conosco.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

---

## 📋 **Índice**

- [Sobre o Projeto](#-sobre-o-projeto)
- [Demonstração](#-demonstração)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Começando](#-começando)
- [Documentação](#-documentação)
- [Deploy](#-deploy)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuindo](#-contribuindo)

---

## 🎯 **Sobre o Projeto**

Portal de vagas moderno e sistema de gestão de candidatos desenvolvido para a **FG Services**, empresa especializada em terceirização de serviços. O sistema permite que candidatos se inscrevam em vagas e que o RH gerencie todo o processo de recrutamento com eficiência.

### **Diferenciais:**

- 🗺️ **Filtros Geográficos Avançados** - Encontre candidatos mais próximos
- 🧭 **Ordenação por Proximidade** - Algoritmo inteligente de localização
- 💬 **Integração WhatsApp** - Contato direto com candidatos
- 📊 **Kanban Drag & Drop** - Gestão visual do pipeline
- 🎨 **Design Moderno** - Interface responsiva e intuitiva
- ⚡ **Modo Demo** - Teste sem necessidade de backend

---

## 🌐 **Demonstração**

### **Site Principal:**
👉 [https://trabalhe-conosco.vercel.app](https://trabalhe-conosco.vercel.app)

### **Painel RH:**
👉 [https://trabalhe-conosco.vercel.app/rh/login](https://trabalhe-conosco.vercel.app/rh/login)

**Credenciais Demo:**
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123`

---

## ✨ **Funcionalidades**

### **Para Candidatos:**

- ✅ Visualizar vagas disponíveis
- ✅ Ver detalhes completos da vaga
- ✅ Candidatura online com formulário completo
- ✅ Upload de currículo (PDF)
- ✅ Informar localização (Estado, Cidade, Bairro)
- ✅ Interface responsiva (mobile/tablet/desktop)

### **Para RH:**

#### **Dashboard:**
- 📊 Métricas em tempo real (vagas abertas, candidatos, novos hoje)
- 📈 Atividades recentes
- 🔗 Ações rápidas

#### **Gestão de Vagas:**
- ➕ Criar novas vagas
- ✏️ Editar vagas existentes
- 🔄 Publicar/Despublicar
- 🗑️ Excluir vagas
- 🔍 Busca e filtros

#### **Gestão de Candidatos:**

**Filtros Avançados:**
- 🗺️ Por Estado (dropdown)
- 🌆 Por Cidade (busca parcial)
- 🏘️ Por Bairro (busca parcial)
- 📋 Por Status (Novo, Em Análise, Entrevista, Aprovado, Reprovado)
- 🔍 Por Nome/Email/Vaga
- 🧭 **Ordenação por Proximidade** ⭐

**Ações:**
- 👁️ Ver detalhes completos
- 💬 Contato via WhatsApp (link direto)
- ✉️ Enviar email
- 📄 Download de currículo
- ✅ Aprovar candidato
- ❌ Reprovar candidato
- ⏱️ Colocar em análise
- 📅 Agendar entrevista

**Visualizações:**
- 📋 Lista completa com filtros
- 📊 Kanban drag & drop (5 colunas de status)
- 🗺️ Localização visível em todos os cards
- ✅ Badge "Próximo" para candidatos da mesma região

---

## 🛠️ **Tecnologias**

### **Frontend:**
- [Next.js 13](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [Lucide React](https://lucide.dev/) - Ícones

### **Backend (Opcional):**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [JWT](https://jwt.io/) - Autenticação
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Hash de senhas

### **Deploy:**
- [Vercel](https://vercel.com/) - Hospedagem frontend
- [Multer](https://github.com/expressjs/multer) - Upload de arquivos

---

## 🚀 **Começando**

### **Pré-requisitos:**
- Node.js 18+ 
- npm ou yarn

### **Instalação:**

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/trabalhe-conosco.git

# Entre na pasta do frontend
cd trabalhe-_conosco

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### **Modo Demo:**

O projeto está configurado para funcionar em **modo demo** sem necessidade de backend. Todas as funcionalidades estão disponíveis com dados mockados.

### **Com Backend (Opcional):**

```bash
# Entre na pasta do backend
cd server

# Instale as dependências
npm install

# Configure o .env
cp .env.example .env
# Edite o .env com suas configurações

# Execute as migrações
npm run migrate

# Popule o banco (usuário admin)
npm run seed

# Inicie o servidor
npm run dev
```

Servidor rodará em [http://localhost:3333](http://localhost:3333).

Para mais detalhes, consulte: [`SETUP_BACKEND.md`](./SETUP_BACKEND.md)

---

## 📚 **Documentação**

### **Guias Disponíveis:**

| Documento | Descrição |
|-----------|-----------|
| [`GUIA_RAPIDO.md`](./GUIA_RAPIDO.md) | ⚡ Início rápido em 5 minutos |
| [`FUNCIONALIDADES_CANDIDATOS.md`](./FUNCIONALIDADES_CANDIDATOS.md) | 📋 Guia completo de funcionalidades |
| [`FILTROS_LOCALIZACAO.md`](./FILTROS_LOCALIZACAO.md) | 🗺️ Filtros geográficos e proximidade |
| [`ACESSO_RH.md`](./ACESSO_RH.md) | 🔐 Credenciais e acesso ao painel |
| [`SETUP_BACKEND.md`](./SETUP_BACKEND.md) | 🔧 Configuração do backend |
| [`DEPLOY_INSTRUCOES.md`](./DEPLOY_INSTRUCOES.md) | 🚀 Como fazer deploy |
| [`RESUMO_FINAL.md`](./RESUMO_FINAL.md) | 📊 Visão geral completa |

### **Guia Rápido de Uso:**

1. Acesse: `https://trabalhe-conosco.vercel.app/rh/login`
2. Login: `admin@fgservices.com` / `admin123`
3. Vá em **"Candidatos"**
4. Use filtros de localização:
   - Estado: SP
   - Cidade: São Paulo
   - Clique em **"Ordenar por Proximidade"**
5. Veja candidatos próximos primeiro com badge "Próximo" ✅

---

## 📦 **Deploy**

### **Frontend (Vercel):**

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login (use o token fornecido)
vercel login

# Deploy em produção
cd trabalhe-_conosco
vercel --prod
```

Ou conecte o repositório GitHub com a Vercel para deploy automático.

### **Backend (Railway/Heroku):**

Consulte [`SETUP_BACKEND.md`](./SETUP_BACKEND.md) para instruções detalhadas.

---

## 📁 **Estrutura do Projeto**

```
trabalhe-_conosco/
├── components/          # Componentes React
│   ├── RHLayout.tsx    # Layout do painel RH
│   ├── Hero.tsx        # Hero com vídeo
│   ├── OurStorySection.tsx
│   ├── HistorySection.tsx
│   ├── JobsSection.tsx
│   └── ConclusionSection.tsx
├── pages/              # Páginas Next.js
│   ├── index.tsx       # Página inicial
│   ├── vagas/
│   │   └── [id].tsx    # Detalhes da vaga
│   └── rh/             # Painel RH
│       ├── login.tsx
│       ├── index.tsx   # Dashboard
│       ├── vagas.tsx   # Gestão de vagas
│       └── candidatos/
│           ├── index.tsx      # Lista de candidatos
│           └── [vagaId].tsx   # Kanban
├── lib/                # Utilitários
│   ├── api.ts         # Funções de API
│   └── jobs.ts        # Dados de vagas
├── public/            # Arquivos estáticos
│   └── hero.mp4       # Vídeo institucional
├── styles/            # Estilos globais
└── server/            # Backend (opcional)
    ├── src/
    │   ├── index.ts
    │   ├── db.ts
    │   ├── migrate.ts
    │   ├── seed.ts
    │   └── routes/
    └── uploads/       # Currículos
```

---

## 🎨 **Screenshots**

### **Página Inicial:**
- Hero com vídeo institucional
- Nossa História
- Cronologia - Nossos Marcos (timeline)
- Vagas Disponíveis
- Conclusão

### **Painel RH - Dashboard:**
- Cards de métricas
- Ações rápidas
- Atividades recentes

### **Painel RH - Candidatos:**
- Filtros de localização
- Ordenação por proximidade
- Lista com badges
- Modal de detalhes completo

### **Painel RH - Kanban:**
- 5 colunas de status
- Drag & drop funcional
- WhatsApp e Email em cada card

---

## 🤝 **Contribuindo**

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 **Licença**

Este projeto foi desenvolvido para a **FG Services**.

---

## 👥 **Autores**

Desenvolvido com ❤️ para a **FG Services**

---

## 🙏 **Agradecimentos**

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 **Contato**

**FG Services**
- Website: [https://trabalhe-conosco.vercel.app](https://trabalhe-conosco.vercel.app)
- Email: contato@fgservices.com

---

## 🔗 **Links Úteis**

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Guia Framer Motion](https://www.framer.com/motion/introduction/)

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

**Made with ❤️ for FG Services**

</div>
