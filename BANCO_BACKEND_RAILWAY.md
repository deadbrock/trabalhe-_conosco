# 🗄️ BANCO DE DADOS E BACKEND - RAILWAY

## 🎯 RESPOSTAS RÁPIDAS

### **❓ Preciso de banco de dados?**
✅ **SIM!** E já está implementado no projeto.

### **❓ Preciso de backend?**
✅ **SIM!** E já está implementado no projeto.

### **❓ Railway é uma boa escolha?**
✅ **SIM!** É perfeito para este projeto. Railway oferece:
- ✅ PostgreSQL integrado
- ✅ Deploy automático do backend
- ✅ Plano gratuito para começar
- ✅ Fácil de usar

---

## 📦 O QUE JÁ ESTÁ IMPLEMENTADO

### **1. 🗄️ BANCO DE DADOS (PostgreSQL)**
**Status:** ✅ Implementado completamente

**Tabelas criadas:**
```sql
1. vagas            - Armazena vagas publicadas
2. candidatos       - Armazena candidatos e currículos
3. usuarios         - Armazena usuários do RH (admin)
```

**Banco de Talentos:**
- ✅ Já funciona com a tabela `candidatos`
- ✅ Campo `status` inclui "banco_talentos"
- ✅ Filtros e ordenação implementados
- ✅ Interface completa (frontend + backend)

---

### **2. 🔧 BACKEND (Node.js + Express)**
**Status:** ✅ Implementado completamente

**Arquivos do backend:**
```
trabalhe-_conosco/server/
├── src/
│   ├── index.js              ✅ Servidor Express
│   ├── db.js                 ✅ Conexão PostgreSQL
│   ├── migrate.js            ✅ Criar tabelas
│   ├── seed.js               ✅ Dados iniciais
│   ├── routes/
│   │   ├── auth.js           ✅ Login do RH
│   │   ├── vagas.js          ✅ CRUD de vagas
│   │   ├── candidatos.js     ✅ CRUD de candidatos
│   │   └── metrics.js        ✅ Métricas do dashboard
│   └── middleware/
│       └── auth.js           ✅ Autenticação JWT
├── package.json              ✅ Dependências
└── .env.example              ✅ Variáveis de ambiente
```

**APIs implementadas:**
```
POST   /auth/login           - Login do RH
GET    /vagas                 - Listar vagas
POST   /vagas                 - Criar vaga (RH)
PUT    /vagas/:id             - Editar vaga (RH)
DELETE /vagas/:id             - Deletar vaga (RH)
GET    /candidatos            - Listar candidatos (RH)
GET    /candidatos/:vagaId    - Candidatos por vaga (RH)
POST   /candidatos            - Candidatar-se (público)
PUT    /candidatos/:id        - Atualizar candidato (RH)
GET    /metrics               - Métricas do dashboard (RH)
```

---

## 🚀 DEPLOY NO RAILWAY (PASSO A PASSO)

### **OPÇÃO 1: Deploy Automático (RECOMENDADO)** ⭐

#### **Passo 1: Criar conta no Railway**
1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

#### **Passo 2: Criar PostgreSQL**
1. No Railway, clique em **"+ New"**
2. Escolha **"Database"** → **"PostgreSQL"**
3. Railway cria automaticamente:
   - ✅ Banco de dados PostgreSQL
   - ✅ Variável `DATABASE_URL`
   - ✅ Senha automática

#### **Passo 3: Deploy do Backend**

**3.1 - Conectar repositório:**
1. Clique em **"+ New"** → **"GitHub Repo"**
2. Selecione seu repositório
3. Escolha a pasta: **`server`**

**3.2 - Configurar variáveis de ambiente:**

No Railway, vá em **Variables** e adicione:

```bash
# Porta
PORT=3333

# Banco de dados (Railway gera automaticamente)
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}

# JWT Secret
JWT_SECRET=um_segredo_bem_secreto_e_longo_para_jwt_aqui

# Node env
NODE_ENV=production
```

**3.3 - Configurar build:**

Railway detecta automaticamente, mas garanta que `package.json` tenha:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc -p tsconfig.json",
    "postinstall": "npm run build"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**3.4 - Deploy:**
1. Railway faz deploy automaticamente
2. Após deploy, copie a URL do backend
3. Exemplo: `https://seu-backend.railway.app`

#### **Passo 4: Rodar Migrations**

No Railway, abra o **Terminal** do backend e execute:

```bash
npm run migrate
npm run seed
```

Isso cria as tabelas e o usuário admin.

#### **Passo 5: Configurar Frontend**

No Vercel (ou onde hospedar o frontend), adicione a variável:

```bash
NEXT_PUBLIC_API_BASE=https://seu-backend.railway.app
```

---

### **OPÇÃO 2: Deploy Manual (CLI)**

#### **1. Instalar Railway CLI:**
```bash
npm i -g @railway/cli
```

#### **2. Fazer login:**
```bash
railway login
```

#### **3. Criar projeto:**
```bash
cd trabalhe-_conosco/server
railway init
```

#### **4. Adicionar PostgreSQL:**
```bash
railway add postgresql
```

#### **5. Deploy:**
```bash
railway up
```

#### **6. Configurar variáveis:**
```bash
railway variables set JWT_SECRET="seu_secret_aqui"
railway variables set PORT=3333
```

#### **7. Rodar migrations:**
```bash
railway run npm run migrate
railway run npm run seed
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### **Tabela: vagas**
```sql
CREATE TABLE vagas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo_contrato TEXT NOT NULL,
  endereco TEXT NOT NULL,
  descricao TEXT,
  requisitos TEXT,
  diferenciais TEXT,
  status TEXT DEFAULT 'ativa',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Exemplo de dados:**
```
id | titulo                | tipo_contrato | endereco      | status
---|----------------------|---------------|---------------|--------
1  | Desenvolvedor Full   | CLT           | São Paulo, SP | ativa
2  | Designer UX/UI       | PJ            | Remoto        | ativa
```

---

### **Tabela: candidatos (BANCO DE TALENTOS)**
```sql
CREATE TABLE candidatos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  data_nascimento DATE,
  email TEXT NOT NULL,
  telefone TEXT,
  estado TEXT,
  cidade TEXT,
  bairro TEXT,
  curriculo TEXT,
  vaga_id INTEGER REFERENCES vagas(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'novo',
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Status possíveis:**
- `novo` - Candidato recém-inscrito
- `em_analise` - Em análise pelo RH
- `entrevista` - Agendada entrevista
- `aprovado` - Aprovado
- `reprovado` - Não aprovado
- **`banco_talentos`** ⭐ - No banco de talentos

**Exemplo de dados:**
```
id | nome           | email              | vaga_id | status         | cidade
---|----------------|-------------------|---------|----------------|--------
1  | João Silva     | joao@email.com    | 1       | novo           | SP
2  | Maria Santos   | maria@email.com   | 1       | banco_talentos | RJ
3  | Pedro Costa    | pedro@email.com   | 2       | em_analise     | MG
```

**Banco de Talentos:**
- ✅ Candidatos com `status = 'banco_talentos'`
- ✅ Filtros por localização (estado, cidade, bairro)
- ✅ Ordenação por proximidade
- ✅ Interface completa em `/rh/banco-talentos`

---

### **Tabela: usuarios**
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  perfil TEXT NOT NULL
);
```

**Usuário admin padrão:**
```
Email: admin@fgservices.com
Senha: admin123
```

---

## 🔌 COMO O SISTEMA FUNCIONA

### **1. Candidato se inscreve:**
```
Frontend (Next.js)
    ↓ POST /candidatos
Backend (Express)
    ↓ INSERT INTO candidatos
Banco (PostgreSQL)
    ↓ Salva com status="novo"
✅ Candidato no sistema
```

### **2. RH move para Banco de Talentos:**
```
RH acessa /rh/candidatos
    ↓ Clica em "Mover para Banco de Talentos"
Frontend envia PUT /candidatos/:id
    ↓ { status: "banco_talentos" }
Backend atualiza status
    ↓ UPDATE candidatos SET status='banco_talentos'
✅ Candidato no Banco de Talentos
```

### **3. RH acessa Banco de Talentos:**
```
RH acessa /rh/banco-talentos
    ↓ GET /candidatos?status=banco_talentos
Backend busca
    ↓ SELECT * FROM candidatos WHERE status='banco_talentos'
PostgreSQL retorna
    ↓ Lista de candidatos
✅ Exibe no frontend
```

---

## 💰 CUSTOS DO RAILWAY

### **Plano Gratuito (Trial):**
- ✅ $5 de crédito grátis por mês
- ✅ PostgreSQL incluído
- ✅ Suficiente para projetos pequenos
- ✅ Perfeito para começar

### **Plano Hobby ($5/mês):**
- ✅ $5 de crédito + $5/mês
- ✅ Melhor uptime
- ✅ Recomendado para produção

### **Estimativa de uso:**
```
PostgreSQL:  ~$2/mês (uso leve)
Backend:     ~$2/mês (uso leve)
Total:       ~$4/mês
```

**Conclusão:** O plano gratuito é suficiente para começar! 🎉

---

## ✅ CHECKLIST DE DEPLOY

### **No Railway:**
- [ ] Criar conta
- [ ] Criar PostgreSQL
- [ ] Deploy do backend (conectar GitHub)
- [ ] Configurar variáveis de ambiente
- [ ] Rodar migrations (`npm run migrate`)
- [ ] Rodar seed (`npm run seed`)
- [ ] Copiar URL do backend

### **No Vercel (Frontend):**
- [ ] Deploy do frontend
- [ ] Adicionar variável `NEXT_PUBLIC_API_BASE`
- [ ] Configurar domínio (trabalheconoscofg.com.br)

### **Testar:**
- [ ] Acessar site
- [ ] Ver vagas (devem vir do backend)
- [ ] Candidatar-se
- [ ] Login no RH (admin@fgservices.com / admin123)
- [ ] Ver candidatos no painel
- [ ] Mover candidato para Banco de Talentos
- [ ] Acessar /rh/banco-talentos

---

## 🔧 VARIÁVEIS DE AMBIENTE

### **Backend (.env no Railway):**
```bash
# Porta do servidor
PORT=3333

# Conexão PostgreSQL (Railway gera automaticamente)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secret (gere um aleatório)
JWT_SECRET=um_segredo_bem_secreto_e_longo_para_jwt_aqui

# Ambiente
NODE_ENV=production
```

### **Frontend (.env.local no Vercel):**
```bash
# URL do backend no Railway
NEXT_PUBLIC_API_BASE=https://seu-backend.railway.app
```

---

## 🐛 TROUBLESHOOTING

### **Erro: "Cannot connect to database"**
**Solução:**
- Verifique se PostgreSQL está rodando no Railway
- Verifique se `DATABASE_URL` está configurada
- Execute migrations: `railway run npm run migrate`

### **Erro: "Unauthorized" no login**
**Solução:**
- Execute seed: `railway run npm run seed`
- Cria usuário admin automaticamente

### **Erro: "No vagas found"**
**Solução:**
- Publique vagas pelo painel RH
- Ou crie manualmente no banco

### **Erro: "CORS blocked"**
**Solução:**
- Backend já tem CORS habilitado
- Verifique se `NEXT_PUBLIC_API_BASE` está correto

---

## 📊 ARQUITETURA COMPLETA

```
┌─────────────────────────────────────────┐
│         FRONTEND (Vercel)               │
│      trabalheconoscofg.com.br           │
│  Next.js + React + Tailwind CSS         │
└─────────────────────────────────────────┘
              ↕ HTTP/JSON
┌─────────────────────────────────────────┐
│       BACKEND (Railway)                 │
│  https://seu-backend.railway.app        │
│  Node.js + Express + JWT                │
└─────────────────────────────────────────┘
              ↕ SQL
┌─────────────────────────────────────────┐
│   BANCO DE DADOS (Railway)              │
│         PostgreSQL 14+                  │
│  ├── vagas                              │
│  ├── candidatos (BANCO DE TALENTOS)     │
│  └── usuarios                           │
└─────────────────────────────────────────┘
```

---

## 🎯 RESUMO EXECUTIVO

### **Sim, você PRECISA de:**

✅ **Banco de dados** (PostgreSQL)
- Para armazenar vagas
- Para armazenar candidatos
- **Para o Banco de Talentos**

✅ **Backend** (Node.js + Express)
- Para criar/editar vagas
- Para receber candidaturas
- Para autenticar RH
- Para gerenciar Banco de Talentos

### **O que já está pronto:**

✅ Banco de dados (schema completo)
✅ Backend (API completa)
✅ Migrations (criar tabelas)
✅ Seed (usuário admin)
✅ Frontend (interface completa)
✅ Banco de Talentos (totalmente funcional)

### **O que você precisa fazer:**

1. ✅ Criar conta no Railway
2. ✅ Criar PostgreSQL
3. ✅ Deploy do backend
4. ✅ Rodar migrations
5. ✅ Configurar frontend com URL do backend

**Tempo estimado:** 20-30 minutos

---

## 📚 DOCUMENTAÇÃO ÚTIL

### **Railway:**
- Docs: https://docs.railway.app
- Exemplos: https://railway.app/templates
- Suporte: https://help.railway.app

### **PostgreSQL:**
- Docs: https://www.postgresql.org/docs/

### **Guias do projeto:**
- `DEPLOY_RAILWAY.md` - Deploy completo
- `SETUP_BACKEND.md` - Setup do backend
- `BANCO_TALENTOS.md` - Sobre o Banco de Talentos

---

## 🎉 CONCLUSÃO

### **Respondendo suas perguntas:**

❓ **"Preciso de banco de dados?"**
✅ SIM! PostgreSQL já está implementado, só precisa hospedar no Railway.

❓ **"Preciso de backend?"**
✅ SIM! Node.js + Express já está implementado, só precisa fazer deploy no Railway.

❓ **"Railway é boa escolha?"**
✅ SIM! É perfeita! Oferece PostgreSQL + Backend em um só lugar, com plano gratuito.

### **Banco de Talentos:**
✅ **Totalmente funcional**
✅ Usa a tabela `candidatos` (campo `status`)
✅ Interface completa em `/rh/banco-talentos`
✅ Filtros por localização
✅ Ordenação por proximidade

### **Próximos passos:**
1. 🚀 Deploy no Railway (20 min)
2. 🌐 Configurar domínio no Vercel
3. ✅ Testar sistema completo
4. 🎊 Seu sistema está no ar!

**Tudo está pronto! Só falta fazer o deploy! 🚀**

---

**Arquivo:** `BANCO_BACKEND_RAILWAY.md`  
**Versão:** 1.0  
**Projeto:** Trabalhe Conosco - FG Services  
**Data:** 2025

