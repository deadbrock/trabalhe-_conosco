# ✅ CHECKLIST - DEPLOY RAILWAY

Use este checklist para garantir que tudo está configurado corretamente.

---

## 📋 ANTES DE COMEÇAR

- [ ] Código commitado no GitHub
- [ ] Conta no GitHub criada
- [ ] Repositório público ou privado com acesso

---

## 🔧 PREPARAÇÃO DO CÓDIGO

### Arquivos necessários:

- [ ] `server/package.json` com scripts:
  - `"build": "tsc -p tsconfig.json"`
  - `"start": "node dist/index.js"`
  - `"migrate": "ts-node src/migrate.ts"`
  - `"seed": "ts-node src/seed.ts"`
  - `"postinstall": "npm run build"`
  - `"engines": { "node": ">=18.0.0" }`

- [ ] `railway.json` na raiz:
  ```json
  {
    "build": {
      "builder": "NIXPACKS",
      "buildCommand": "cd server && npm install && npm run build"
    },
    "deploy": {
      "startCommand": "cd server && npm start"
    }
  }
  ```

- [ ] `.gitignore` atualizado:
  ```
  node_modules/
  .env
  dist/
  uploads/
  ```

- [ ] Commit e push feito

---

## 🚀 RAILWAY - CONFIGURAÇÃO

### 1. Conta e Projeto:

- [ ] Conta criada em https://railway.app
- [ ] Login com GitHub feito
- [ ] Novo projeto criado
- [ ] Repositório conectado
- [ ] Deploy inicial rodando

### 2. PostgreSQL:

- [ ] PostgreSQL adicionado (+ New > Database > PostgreSQL)
- [ ] Aguardou criação (~30s)
- [ ] Variáveis auto-geradas:
  - `PGHOST`
  - `PGPORT`
  - `PGUSER`
  - `PGPASSWORD`
  - `PGDATABASE`
  - `DATABASE_URL`

### 3. Variáveis do Backend:

No service do backend (Variables):

- [ ] `PORT` = `3333`
- [ ] `JWT_SECRET` = `[chave forte gerada]`
- [ ] `PGHOST` = (Reference do Postgres)
- [ ] `PGPORT` = (Reference do Postgres)
- [ ] `PGUSER` = (Reference do Postgres)
- [ ] `PGPASSWORD` = (Reference do Postgres)
- [ ] `PGDATABASE` = (Reference do Postgres)

### 4. Domínio:

- [ ] Settings > Networking > Generate Domain
- [ ] URL copiada: `https://_____.up.railway.app`

### 5. Migrations:

Escolha UMA opção:

**Opção A: Railway CLI**
- [ ] `npm install -g @railway/cli`
- [ ] `railway login`
- [ ] `railway link`
- [ ] `railway run npm --prefix server run migrate`
- [ ] `railway run npm --prefix server run seed`

**Opção B: Auto-migrate**
- [ ] Editou `server/package.json`:
  ```json
  "start": "npm run migrate && npm run seed && node dist/index.js"
  ```
- [ ] Commit e push
- [ ] Aguardou redeploy

---

## 🌐 VERCEL - FRONTEND

### 1. Conta e Projeto:

- [ ] Conta criada em https://vercel.com
- [ ] Login com GitHub feito
- [ ] Add New Project
- [ ] Repositório selecionado
- [ ] Root Directory: `trabalhe-_conosco`
- [ ] Framework: Next.js detectado

### 2. Variável de Ambiente:

- [ ] `NEXT_PUBLIC_API_BASE` = `https://[sua-url-railway].up.railway.app`
- [ ] Deploy iniciado
- [ ] Build concluído
- [ ] URL copiada: `https://_____.vercel.app`

---

## 🧪 TESTES

### Backend:

- [ ] Health check: `curl https://xxx.railway.app/health`
  - Retorna: `{"status":"ok"}`

- [ ] Login funciona:
  ```bash
  curl -X POST https://xxx.railway.app/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@fgservices.com","password":"admin123"}'
  ```
  - Retorna: `{"token":"...","user":{...}}`

- [ ] Listar vagas:
  ```bash
  curl https://xxx.railway.app/vagas?status=ativa
  ```
  - Retorna: `[]` ou lista de vagas

### Frontend:

- [ ] Site carrega: `https://xxx.vercel.app`
- [ ] Homepage exibe: "Nenhuma vaga disponível" ou lista de vagas
- [ ] Login RH: `https://xxx.vercel.app/rh/login`
- [ ] Credenciais: `admin@fgservices.com` / `admin123`
- [ ] Dashboard carrega

### Fluxo Completo:

- [ ] RH cria vaga no painel
- [ ] Vaga aparece no site público
- [ ] Candidato preenche formulário
- [ ] Candidatura é enviada
- [ ] Candidato aparece no painel RH
- [ ] Dados estão no banco PostgreSQL

---

## 🔐 SEGURANÇA

- [ ] Alterar senha do admin:
  ```bash
  railway run psql $DATABASE_URL
  # UPDATE usuarios SET senha_hash = ... WHERE email = 'admin@fgservices.com';
  ```

- [ ] Verificar variáveis sensíveis não estão expostas
- [ ] JWT_SECRET é forte (32+ caracteres aleatórios)
- [ ] CORS configurado corretamente

---

## 📊 MONITORAMENTO

### Railway:

- [ ] Logs acessíveis: Deployments > View Logs
- [ ] Métricas visíveis: Metrics tab
- [ ] Alertas configurados (opcional)

### Vercel:

- [ ] Analytics habilitado
- [ ] Logs acessíveis: Deployments > Logs
- [ ] Error tracking configurado (opcional)

---

## 🔄 CI/CD

- [ ] Push no GitHub trigga deploy automático no Railway
- [ ] Push no GitHub trigga deploy automático no Vercel
- [ ] Build falha são notificados
- [ ] Rollback fácil de fazer

---

## 💰 BILLING

- [ ] Cartão de crédito adicionado (validação)
- [ ] Free tier ativo: $5/mês grátis
- [ ] Alertas de billing configurados
- [ ] Limite de gastos definido (opcional)

---

## 📝 DOCUMENTAÇÃO

- [ ] URLs documentadas:
  - Backend Railway
  - Frontend Vercel
  - PostgreSQL credentials
  
- [ ] Credenciais salvas (seguro):
  - Admin RH
  - Railway account
  - Vercel account
  
- [ ] Processo de deploy documentado
- [ ] Troubleshooting conhecido documentado

---

## 🎉 FINALIZAÇÃO

Se TODOS os itens acima estão ✅, então:

### ✅ **SISTEMA 100% ONLINE E FUNCIONAL!**

**URLs Finais:**
- **Site:** `https://_____.vercel.app`
- **Painel RH:** `https://_____.vercel.app/rh/login`
- **Backend:** `https://_____.up.railway.app`
- **Health:** `https://_____.up.railway.app/health`

**Credenciais:**
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123` (ALTERE ISSO!)

---

## 🚨 SE ALGO DEU ERRADO

Use o arquivo: `INICIO_RAPIDO_RAILWAY.md` seção "TROUBLESHOOTING"

Ou:
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Discord Railway:** https://discord.gg/railway

---

**Boa sorte com o deploy! 🚀**

