# 💼 FG Services - Portal Trabalhe Conosco

Sistema completo de recrutamento e seleção com site público para candidaturas e painel administrativo para o RH gerenciar vagas e candidatos.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)

---

## 🚀 INÍCIO RÁPIDO

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/seu-repo/trabalhe-conosco.git
cd trabalhe-conosco
```

### 2. Configure o Backend

```bash
cd trabalhe-_conosco/server

# Instalar dependências
npm install

# Configurar banco de dados (crie .env com suas credenciais)
# Ver: server/.env.example

# Criar tabelas
npm run migrate

# Criar usuário admin
npm run seed

# Iniciar servidor
npm run dev
```

**Backend rodando em:** `http://localhost:3333`

### 3. Configure o Frontend

```bash
cd trabalhe-_conosco

# Instalar dependências
npm install

# Configurar API (crie .env.local)
echo "NEXT_PUBLIC_API_BASE=http://localhost:3333" > .env.local

# Iniciar aplicação
npm run dev
```

**Frontend rodando em:** `http://localhost:3000`

---

## 🎯 FUNCIONALIDADES

### 🌐 Site Público
- ✅ Página institucional moderna e responsiva
- ✅ Listagem de vagas ativas
- ✅ Formulário de candidatura completo
- ✅ Upload de currículo (PDF)
- ✅ Dados de localização (Estado, Cidade, Bairro)
- ✅ Design moderno com animações

### 🔐 Painel RH (Autenticado)
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão completa de vagas (criar, editar, deletar)
- ✅ Visualização de candidatos por vaga
- ✅ Kanban de candidatos (drag & drop)
- ✅ Filtros avançados (status, localização, proximidade)
- ✅ Banco de Talentos
- ✅ Integração com WhatsApp
- ✅ Download de currículos
- ✅ Sistema de status automático

### 📊 Recursos Avançados
- ✅ Filtro por proximidade geográfica
- ✅ Banco de Talentos com gestão separada
- ✅ Kanban limitado (5 candidatos + "Ver Todos")
- ✅ Modo DEMO (funciona sem backend)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Upload de arquivos
- ✅ Autenticação JWT
- ✅ API RESTful

---

## 📁 ESTRUTURA DO PROJETO

```
trabalhe-_conosco/
├── components/          # Componentes React
│   ├── RHLayout.tsx    # Layout do painel RH
│   ├── Hero.tsx        # Seção hero com vídeo
│   └── ...
├── pages/              # Páginas Next.js
│   ├── index.tsx       # Homepage pública
│   ├── vagas/          # Páginas de vagas
│   └── rh/             # Painel administrativo
├── lib/                # Utilities e helpers
├── server/             # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── index.ts    # Servidor principal
│   │   ├── db.ts       # Conexão PostgreSQL
│   │   ├── routes/     # Rotas da API
│   │   ├── middleware/ # Autenticação JWT
│   │   ├── migrate.ts  # Migrations
│   │   └── seed.ts     # Seeds
│   └── uploads/        # Arquivos enviados
└── public/             # Assets estáticos
```

---

## 🔑 CREDENCIAIS PADRÃO

### Painel RH:
- **URL:** `http://localhost:3000/rh/login`
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha padrão em produção!

---

## 🛠️ TECNOLOGIAS

### Frontend:
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide Icons** - Ícones

### Backend:
- **Node.js** - Runtime
- **Express** - Framework web
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **bcryptjs** - Hash de senhas

---

## 📚 DOCUMENTAÇÃO

- **[GUIA_COMPLETO_DEPLOY.md](./GUIA_COMPLETO_DEPLOY.md)** - Guia completo de deploy e configuração
- **[ACESSO_RH.md](./ACESSO_RH.md)** - Credenciais e URLs de acesso
- **[SETUP_BACKEND.md](./SETUP_BACKEND.md)** - Configuração detalhada do backend

---

## 🚢 DEPLOY

### Frontend (Vercel):
```bash
vercel --prod
```

### Backend (Railway/Render):
1. Conecte seu repositório
2. Configure variáveis de ambiente
3. Execute migrations: `npm run migrate && npm run seed`

**Veja o [GUIA COMPLETO](./GUIA_COMPLETO_DEPLOY.md) para instruções detalhadas.**

---

## 🧪 TESTES

### Testar Backend:
```bash
curl http://localhost:3333/health
# Resposta: {"status":"ok"}
```

### Testar Login:
1. Acesse `http://localhost:3000/rh/login`
2. Use credenciais padrão
3. Deve redirecionar para dashboard

### Testar Candidatura:
1. Acesse `http://localhost:3000`
2. Clique em uma vaga
3. Preencha formulário
4. Anexe PDF
5. Envie candidatura
6. Verifique no painel RH

---

## 🔄 FLUXO DE TRABALHO

### Candidato:
1. Acessa site público
2. Vê vagas disponíveis
3. Clica em "Ver Detalhes"
4. Preenche formulário
5. Envia candidatura
6. Recebe confirmação

### RH:
1. Faz login no painel
2. Vê candidatos novos
3. Analisa currículos
4. Muda status:
   - Novo → Em Análise → Entrevista → Aprovado
   - Ou → Reprovado / Banco de Talentos
5. Entra em contato via:
   - Email
   - WhatsApp
6. Gerencia vagas (criar/editar/deletar)

---

## 🌟 DIFERENCIAIS

✅ **Design Moderno** - Interface limpa e profissional  
✅ **Totalmente Responsivo** - Funciona em qualquer dispositivo  
✅ **Kanban Intuitivo** - Drag & drop para mudar status  
✅ **Filtros Avançados** - Localização e proximidade  
✅ **Banco de Talentos** - Armazena candidatos para futuras vagas  
✅ **WhatsApp Integrado** - Link direto para contato  
✅ **Upload de Arquivos** - Recebe currículos em PDF  
✅ **Modo Demo** - Funciona sem backend para testes  
✅ **TypeScript** - Código tipado e seguro  
✅ **Documentação Completa** - Fácil de entender e manter  

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot connect to database"
- Verifique se PostgreSQL está rodando
- Confira credenciais no `.env`

### Erro: "Unauthorized"
- Faça logout e login novamente
- Limpe localStorage do navegador

### Erro: "Network error"
- Confirme que backend está rodando
- Verifique `NEXT_PUBLIC_API_BASE`

**Ver mais em:** [GUIA_COMPLETO_DEPLOY.md](./GUIA_COMPLETO_DEPLOY.md#troubleshooting)

---

## 📄 LICENÇA

MIT License - Sinta-se livre para usar em seus projetos!

---

## 👥 SUPORTE

- **Email:** suporte@fgservices.com
- **GitHub Issues:** [Abrir Issue](https://github.com/seu-repo/issues)

---

## 🎉 PRONTO PARA USAR!

O sistema está **100% funcional** e pronto para receber candidatos reais!

**Boa sorte com o recrutamento!** 💼✨

---

**Desenvolvido com ❤️ para FG Services**
