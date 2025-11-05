# ⚡ INÍCIO RÁPIDO - RAILWAY (15 MINUTOS)

## 🎯 OBJETIVO

Colocar o backend **ONLINE** com PostgreSQL em **15 minutos**.

---

## ✅ PRÉ-REQUISITOS

Antes de começar, você precisa:

- [ ] Código do backend commitado no GitHub
- [ ] Conta no GitHub
- [ ] Cartão de crédito (só para validação, $5 grátis/mês)

---

## 🚀 PASSO 1: PREPARAR CÓDIGO PARA DEPLOY

### 1.1. Atualizar `package.json` do servidor:

```bash
cd "trabalhe-_conosco/server"
```

Abra `package.json` e confirme que tem:

```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "migrate": "ts-node src/migrate.ts",
    "seed": "ts-node src/seed.ts",
    "postinstall": "npm run build"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Adicione se não tiver:**
- `"postinstall": "npm run build"` → Compila TypeScript após install
- `"engines"` → Garante versão correta do Node

---

### 1.2. Criar arquivo `railway.json` na raiz do projeto:

```bash
cd ..  # Volta para trabalhe-_conosco/
```

Crie arquivo `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### 1.3. Atualizar `.gitignore`:

Confirme que tem:

```
node_modules/
.env
.env.local
dist/
uploads/
*.log
.DS_Store
```

---

### 1.4. Commit e push:

```bash
git add .
git commit -m "chore: preparar para deploy no Railway"
git push origin main
```

---

## 🚀 PASSO 2: CRIAR CONTA NO RAILWAY

1. Acesse: https://railway.app
2. Clique em **"Login"**
3. Escolha **"Login with GitHub"**
4. Autorize o Railway

✅ **Conta criada!**

---

## 🚀 PASSO 3: CRIAR PROJETO

1. Clique em **"New Project"**
2. Escolha **"Deploy from GitHub repo"**
3. Se perguntarem permissões:
   - Clique **"Configure GitHub App"**
   - Selecione seu repositório `trabalhe-conosco`
   - Salve
4. Volte ao Railway e selecione **"trabalhe-conosco"**

✅ Railway começa a fazer deploy automaticamente!

---

## 🚀 PASSO 4: ADICIONAR POSTGRESQL

1. No dashboard do projeto, clique **"+ New"**
2. Selecione **"Database"**
3. Clique em **"Add PostgreSQL"**
4. Aguarde ~30 segundos

✅ **PostgreSQL criado!**

Railway cria automaticamente:
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`
- `DATABASE_URL`

---

## 🚀 PASSO 5: CONFIGURAR VARIÁVEIS DO BACKEND

### 5.1. Conectar Backend ao PostgreSQL:

1. Clique no **card do backend** (trabalhe-conosco)
2. Vá na aba **"Variables"**
3. Clique em **"+ New Variable"**

#### Adicione estas variáveis:

**PORT:**
```
Name: PORT
Value: 3333
```

**JWT_SECRET:**
```
Name: JWT_SECRET
Value: gere_uma_chave_aleatoria_super_segura_123456789
```

💡 **Gerar chave forte:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Referenciar PostgreSQL:

Para cada variável do banco, ao invés de copiar/colar:

1. Clique em **"+ New Variable"**
2. Clique em **"Add Reference"** (ícone de link)
3. Selecione o service **"Postgres"**
4. Escolha a variável correspondente:
   - `PGHOST` → `PGHOST`
   - `PGPORT` → `PGPORT`
   - `PGUSER` → `PGUSER`
   - `PGPASSWORD` → `PGPASSWORD`
   - `PGDATABASE` → `PGDATABASE`

✅ **Variáveis configuradas!**

---

## 🚀 PASSO 6: GERAR DOMÍNIO PÚBLICO

1. No card do backend, vá em **"Settings"**
2. Role até **"Networking"**
3. Clique em **"Generate Domain"**

Railway gera algo como:
```
https://trabalhe-conosco-production.up.railway.app
```

✅ **Copie essa URL!** Você vai precisar.

---

## 🚀 PASSO 7: EXECUTAR MIGRATIONS

### Opção A: Via Railway CLI (Recomendado)

```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Ir para pasta do projeto
cd "trabalhe-_conosco"

# Link ao projeto Railway
railway link

# Executar migrations
railway run --service trabalhe-conosco npm --prefix server run migrate

# Executar seed (criar admin)
railway run --service trabalhe-conosco npm --prefix server run seed
```

### Opção B: Via package.json (Automático)

Edite `server/package.json`:

```json
{
  "scripts": {
    "start": "npm run migrate && npm run seed && node dist/index.js",
    "migrate": "ts-node src/migrate.ts",
    "seed": "ts-node src/seed.ts"
  }
}
```

Depois:
```bash
git add .
git commit -m "chore: auto-migrate on start"
git push
```

Railway fará redeploy e executará as migrations automaticamente.

---

## 🚀 PASSO 8: TESTAR BACKEND

```bash
# Substitua pela sua URL do Railway
curl https://sua-url.up.railway.app/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

✅ **Backend funcionando!**

---

## 🚀 PASSO 9: DEPLOY FRONTEND (VERCEL)

### 9.1. Criar conta no Vercel:

1. Acesse: https://vercel.com
2. Clique **"Sign Up"**
3. Escolha **"Continue with GitHub"**

### 9.2. Importar projeto:

1. Clique **"Add New Project"**
2. Selecione seu repositório **"trabalhe-conosco"**
3. Em **"Root Directory"**, clique **"Edit"** e selecione: `trabalhe-_conosco`
4. Em **"Framework Preset"**, confirme: **Next.js**

### 9.3. Configurar variável de ambiente:

Em **"Environment Variables"**:

```
Name: NEXT_PUBLIC_API_BASE
Value: https://sua-url-railway.up.railway.app
```

⚠️ **IMPORTANTE:** Substitua pela URL real do Railway (Passo 6)

### 9.4. Deploy:

1. Clique **"Deploy"**
2. Aguarde ~2 minutos

✅ **Frontend deployado!**

Vercel gera URL como:
```
https://trabalhe-conosco-tau.vercel.app
```

---

## 🚀 PASSO 10: TESTAR SISTEMA COMPLETO

### 10.1. Acessar site:
```
https://seu-projeto.vercel.app
```

### 10.2. Ver vagas:
- Role até **"Vagas Disponíveis"**
- Deve mostrar: **"Nenhuma vaga disponível no momento"** ✅

### 10.3. Login RH:
```
https://seu-projeto.vercel.app/rh/login
```

Credenciais:
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123`

✅ **Deve entrar no dashboard!**

### 10.4. Criar vaga:

1. Vá em **"Vagas"**
2. Clique **"Nova Vaga"**
3. Preencha:
   ```
   Título: Auxiliar de Limpeza
   Tipo: CLT
   Endereço: São Paulo - SP
   Descrição: Vaga para condomínio residencial
   Requisitos:
   Ensino médio completo
   Experiência mínima
   
   Status: Ativa
   ```
4. Clique **"Salvar"**

### 10.5. Verificar no site:

1. Volte para a homepage
2. Role até **"Vagas Disponíveis"**

✅ **Vaga aparece!** 🎉

### 10.6. Testar candidatura:

1. Clique **"Ver Detalhes"**
2. Preencha o formulário
3. Envie

✅ **Candidatura recebida!**

4. Volte ao painel RH > Candidatos

✅ **Candidato aparece!** 🎊

---

## 📊 ESTRUTURA FINAL

```
┌─────────────────────────────────────────┐
│ RAILWAY.APP                             │
│                                         │
│ ┌─────────────────┐ ┌─────────────────┐│
│ │ Backend         │ │ PostgreSQL      ││
│ │ Node.js + Express│ │ Database        ││
│ │ Port: 3333      │ │ 1GB Storage     ││
│ │ URL: xxx.railway│ │ Auto-backup     ││
│ └────────┬────────┘ └────────┬────────┘│
│          │                   │         │
│          └──────Connected─────┘         │
└─────────────────────────────────────────┘
                  ↑
                  │ API Calls
                  │
┌─────────────────────────────────────────┐
│ VERCEL                                  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Frontend (Next.js)                  │ │
│ │ Static + SSR                        │ │
│ │ URL: xxx.vercel.app                 │ │
│ │ Env: NEXT_PUBLIC_API_BASE           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 💰 CUSTOS MENSAIS

### Railway:
- **$5 grátis/mês** (incluído)
- **Backend:** ~500 horas grátis
- **PostgreSQL:** Incluído no free tier
- **Total:** $0 (primeiros meses)

### Vercel:
- **Frontend:** 100% grátis
- **Bandwidth:** 100GB grátis/mês
- **Total:** $0

### **CUSTO TOTAL: $0 (com $5 grátis do Railway)** 🎉

Depois do crédito:
- **~$5-10/mês** dependendo do uso

---

## 🔧 COMANDOS ÚTEIS

### Railway CLI:

```bash
# Ver logs em tempo real
railway logs

# Executar comando no servidor
railway run <comando>

# Conectar ao PostgreSQL
railway run psql $DATABASE_URL

# Ver variáveis
railway variables

# Shell no container
railway shell
```

### Vercel CLI:

```bash
# Instalar
npm install -g vercel

# Deploy manual
vercel --prod

# Ver logs
vercel logs
```

---

## 🚨 TROUBLESHOOTING

### ❌ Backend não responde:
```bash
# Ver logs
railway logs --service trabalhe-conosco

# Verificar variáveis
railway variables --service trabalhe-conosco
```

### ❌ Migration falhou:
```bash
# Executar manualmente
railway run --service trabalhe-conosco npm --prefix server run migrate
```

### ❌ Frontend não conecta:
1. Verifique `NEXT_PUBLIC_API_BASE` no Vercel
2. Teste backend: `curl https://xxx.railway.app/health`
3. Veja logs do Vercel

### ❌ CORS error:
Adicione ao backend (`server/src/index.ts`):
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://seu-projeto.vercel.app'
  ]
}));
```

---

## 📝 CHECKLIST FINAL

### Preparação:
- [ ] Código no GitHub
- [ ] `railway.json` criado
- [ ] `package.json` atualizado
- [ ] Commit feito

### Railway:
- [ ] Projeto criado
- [ ] PostgreSQL adicionado
- [ ] Variáveis configuradas
- [ ] Domínio gerado
- [ ] Migrations executadas
- [ ] Health check OK

### Vercel:
- [ ] Projeto importado
- [ ] `NEXT_PUBLIC_API_BASE` configurada
- [ ] Deploy concluído
- [ ] Site acessível

### Testes:
- [ ] Site carrega
- [ ] Login RH funciona
- [ ] Criar vaga funciona
- [ ] Vaga aparece no site
- [ ] Candidatura funciona
- [ ] Dados salvam no banco

---

## 🎉 PRONTO!

Seu sistema está **100% ONLINE**! 🚀

**URLs importantes:**
- **Site:** `https://seu-projeto.vercel.app`
- **Painel RH:** `https://seu-projeto.vercel.app/rh/login`
- **Backend:** `https://xxx.up.railway.app`
- **Health:** `https://xxx.up.railway.app/health`

**Credenciais:**
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123`

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Altere a senha do admin
2. ✅ Configure domínio customizado (opcional)
3. ✅ Adicione mais usuários RH
4. ✅ Publique vagas reais
5. ✅ Comece a receber candidatos!

---

**Parabéns! Sistema em produção! 🎊**

