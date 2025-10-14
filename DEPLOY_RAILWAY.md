# 🚀 DEPLOY NO RAILWAY.APP (RECOMENDADO)

## 🎯 POR QUE RAILWAY?

✅ **Mais fácil e rápido**  
✅ **PostgreSQL integrado** (1 clique)  
✅ **$5/mês grátis** (500 horas de execução)  
✅ **Deploy automático** do GitHub  
✅ **HTTPS automático**  
✅ **Variáveis de ambiente** fáceis de configurar  
✅ **Logs em tempo real**  
✅ **Rollback fácil**  

---

## 📋 PRÉ-REQUISITOS

- [ ] Conta no GitHub
- [ ] Repositório do projeto no GitHub
- [ ] Cartão de crédito (não cobra, só valida)

---

## 🔧 PASSO A PASSO COMPLETO

### 1️⃣ **CRIAR CONTA NO RAILWAY**

1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub
4. Autorize o Railway a acessar seus repositórios

---

### 2️⃣ **CRIAR PROJETO**

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha seu repositório: `trabalhe-conosco`
4. Railway detecta automaticamente que é Node.js

---

### 3️⃣ **ADICIONAR POSTGRESQL**

1. No projeto, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Railway cria o banco automaticamente

✅ **Variáveis criadas automaticamente:**
```
PGHOST=containers-us-west-xxx.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=xxx
PGDATABASE=railway
DATABASE_URL=postgresql://postgres:xxx@containers...
```

---

### 4️⃣ **CONFIGURAR BACKEND**

#### A. Conectar Backend ao PostgreSQL:

1. No Railway, clique no seu **backend service**
2. Vá em **"Variables"**
3. Clique em **"+ New Variable"**
4. Adicione uma por uma:

```bash
# Porta
PORT=3333

# JWT Secret (gere uma chave forte)
JWT_SECRET=sua_chave_super_secreta_aleatoria_123456

# Database (Railway já cria estas, mas confirme):
PGHOST=<valor do PostgreSQL service>
PGPORT=5432
PGUSER=postgres
PGPASSWORD=<valor do PostgreSQL service>
PGDATABASE=railway
```

💡 **Dica:** Railway permite "Reference" entre services. Faça:
1. Clique em **"+ New Variable"**
2. Clique em **"Add Reference"**
3. Selecione o PostgreSQL service
4. Escolha a variável (ex: `PGHOST`)

---

#### B. Configurar Build e Start:

Railway detecta automaticamente, mas confirme:

1. Clique no backend service
2. Vá em **"Settings"**
3. Em **"Build Command"**, confirme:
   ```bash
   cd server && npm install && npm run build
   ```

4. Em **"Start Command"**, confirme:
   ```bash
   cd server && npm start
   ```

5. Em **"Root Directory"** (opcional):
   - Deixe vazio (raiz do projeto)
   - Ou coloque: `server/`

---

### 5️⃣ **EXECUTAR MIGRATIONS**

#### Opção A: Via Railway CLI (Recomendado)

1. Instale Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Faça login:
   ```bash
   railway login
   ```

3. Link ao projeto:
   ```bash
   railway link
   ```

4. Execute migrations:
   ```bash
   railway run npm run migrate
   railway run npm run seed
   ```

#### Opção B: Via Terminal do Railway (Web)

1. No Railway, clique no backend service
2. Clique em **"Settings"** > **"Deploy Triggers"**
3. Ou use a aba **"Deployments"** > **"View Logs"**
4. Ou adicione script de migration ao `package.json`:

```json
{
  "scripts": {
    "start": "npm run migrate && npm run seed && node dist/index.js",
    "migrate": "ts-node src/migrate.ts",
    "seed": "ts-node src/seed.ts"
  }
}
```

---

### 6️⃣ **OBTER URL DO BACKEND**

1. No Railway, clique no backend service
2. Vá em **"Settings"**
3. Em **"Networking"**, clique em **"Generate Domain"**
4. Railway gera uma URL:
   ```
   https://trabalhe-conosco-production.up.railway.app
   ```

✅ **Copie essa URL!** Você vai usar no frontend.

---

### 7️⃣ **TESTAR O BACKEND**

```bash
# Teste o health check
curl https://seu-backend.up.railway.app/health

# Resultado esperado:
{"status":"ok"}
```

---

### 8️⃣ **CONFIGURAR FRONTEND (VERCEL)**

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione seu repositório
5. Em **"Root Directory"**, selecione: `trabalhe-_conosco/`
6. Em **"Environment Variables"**, adicione:

```bash
NEXT_PUBLIC_API_BASE=https://seu-backend.up.railway.app
```

7. Clique em **"Deploy"**

---

### 9️⃣ **TESTAR SISTEMA COMPLETO**

1. Acesse seu site: `https://seu-projeto.vercel.app`
2. Vá em **"Vagas Disponíveis"**
3. Se vazio: **"Nenhuma vaga disponível"** ✅
4. Acesse: `https://seu-projeto.vercel.app/rh/login`
5. Login: `admin@fgservices.com` / `admin123`
6. Crie uma vaga
7. Volte ao site: **Vaga aparece!** ✅

---

## 📊 ESTRUTURA NO RAILWAY

```
Projeto: trabalhe-conosco
├── Backend Service
│   ├── Source: GitHub (trabalhe-conosco/server)
│   ├── Build: npm install && npm run build
│   ├── Start: npm start
│   ├── Port: 3333
│   ├── Domain: https://xxx.up.railway.app
│   └── Variables:
│       ├── PORT=3333
│       ├── JWT_SECRET=xxx
│       ├── PGHOST (reference)
│       ├── PGPORT (reference)
│       ├── PGUSER (reference)
│       ├── PGPASSWORD (reference)
│       └── PGDATABASE (reference)
│
└── PostgreSQL Database
    ├── Type: PostgreSQL 14
    ├── Storage: 1GB (grátis)
    ├── Auto-generated credentials
    └── Auto-backups
```

---

## 💰 CUSTOS

### Free Tier:
- **$5 grátis/mês** (aproximadamente 500 horas)
- **PostgreSQL:** Incluído
- **1GB de storage**
- **100GB de bandwidth**

### Depois do Free Tier:
- **~$5-10/mês** (dependendo do uso)
- **Pay-as-you-go**

---

## 🔍 MONITORAMENTO

### Ver Logs:
1. Railway > Seu projeto > Backend service
2. Clique em **"Deployments"**
3. Clique no deployment ativo
4. Veja logs em tempo real

### Ver Métricas:
1. Railway > Seu projeto > Backend service
2. Clique em **"Metrics"**
3. Veja:
   - CPU usage
   - Memory usage
   - Network

---

## 🚨 TROUBLESHOOTING

### ❌ Erro: "Application failed to respond"
**Solução:**
- Verifique se `PORT` está configurado
- Confirme que o servidor escuta em `process.env.PORT`
- Veja os logs: **"Deployments"** > **"View Logs"**

### ❌ Erro: "Database connection failed"
**Solução:**
- Verifique variáveis `PGHOST`, `PGPORT`, etc.
- Use "Reference" para pegar do PostgreSQL service
- Teste conexão manualmente

### ❌ Erro: "Migration failed"
**Solução:**
- Execute via Railway CLI: `railway run npm run migrate`
- Ou adicione ao script `start`
- Verifique logs de erro

### ❌ Frontend não conecta ao backend
**Solução:**
- Confirme `NEXT_PUBLIC_API_BASE` no Vercel
- Teste URL do backend: `curl https://xxx.up.railway.app/health`
- Verifique CORS no backend (deve aceitar seu domínio Vercel)

---

## 🔐 SEGURANÇA

### ✅ Alterar senha do admin:

```bash
# Conecte ao banco via Railway CLI
railway run psql $DATABASE_URL

# Execute:
UPDATE usuarios 
SET senha_hash = '$2a$10$NovoHashAqui' 
WHERE email = 'admin@fgservices.com';
```

Ou crie um endpoint no backend para isso.

---

## 🔄 CI/CD AUTOMÁTICO

Railway já configura CI/CD:

1. **Faça commit** no GitHub
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

2. **Railway detecta** automaticamente
3. **Build** é executado
4. **Deploy** automático
5. **Nova versão** no ar em ~2 minutos

✅ **Deploy automático configurado!**

---

## 📚 COMANDOS ÚTEIS

### Railway CLI:

```bash
# Login
railway login

# Link projeto
railway link

# Ver variáveis
railway variables

# Executar comando
railway run <comando>

# Logs em tempo real
railway logs

# Shell no container
railway shell

# Conectar ao PostgreSQL
railway run psql $DATABASE_URL
```

---

## 🎉 CHECKLIST FINAL

Antes de considerar pronto:

### Backend:
- [ ] Backend deployado no Railway
- [ ] PostgreSQL criado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas (`npm run migrate`)
- [ ] Seed executado (`npm run seed`)
- [ ] Health check funcionando (`/health`)
- [ ] URL pública gerada

### Frontend:
- [ ] Frontend deployado no Vercel
- [ ] `NEXT_PUBLIC_API_BASE` configurado
- [ ] Build passou sem erros
- [ ] Site acessível

### Testes:
- [ ] Site carrega
- [ ] Login RH funciona
- [ ] Criar vaga funciona
- [ ] Vaga aparece no site
- [ ] Candidatura funciona
- [ ] Dados salvam no banco

---

## 🚀 PRONTO!

Seu backend está **ONLINE e FUNCIONAL** no Railway!

**URLs:**
- **Backend:** `https://seu-backend.up.railway.app`
- **Frontend:** `https://seu-projeto.vercel.app`
- **Painel RH:** `https://seu-projeto.vercel.app/rh/login`

---

## 📞 SUPORTE

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app

---

**Deploy feito com sucesso! 🎊**

