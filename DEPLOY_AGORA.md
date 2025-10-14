# 🚀 DEPLOY AGORA - GUIA VISUAL

## ✅ **TUDO PRONTO PARA DEPLOY!**

---

## 📦 O QUE JÁ FOI PREPARADO

```
trabalhe-_conosco/
│
├── ✅ railway.json               ← Configuração Railway criada
├── ✅ .gitignore                 ← Atualizado
│
├── server/
│   ├── ✅ package.json           ← Atualizado com:
│   │                              - postinstall: build
│   │                              - engines: Node 18+
│   │                              - ts-node em dependencies
│   ├── src/
│   │   ├── index.ts             ← Backend funcionando
│   │   ├── migrate.ts           ← Migrations prontas
│   │   └── seed.ts              ← Seed do admin
│   └── tsconfig.json
│
├── pages/                        ← Frontend Next.js
├── components/                   ← Componentes React
└── lib/                          ← Utils e API
```

---

## 🎯 PRÓXIMOS 3 PASSOS

### 📍 **PASSO 1: COMMIT E PUSH**

```bash
# Navegue até a pasta do projeto
cd "C:\Users\user\Documents\trabalhe conosco\trabalhe-_conosco"

# Adicione todos os arquivos
git add .

# Faça commit
git commit -m "chore: preparar para deploy no Railway"

# Envie para GitHub
git push origin main
```

⏱️ **Tempo:** 2 minutos

---

### 📍 **PASSO 2: DEPLOY BACKEND (RAILWAY)**

#### A. Criar conta e projeto:

1. Acesse: **https://railway.app**
2. Clique **"Login with GitHub"**
3. Autorize o Railway
4. Clique **"New Project"**
5. Escolha **"Deploy from GitHub repo"**
6. Selecione: **trabalhe-conosco**

✅ Railway começa o build automaticamente!

#### B. Adicionar PostgreSQL:

1. No projeto, clique **"+ New"**
2. **"Database"** → **"Add PostgreSQL"**
3. Aguarde 30 segundos

✅ PostgreSQL criado!

#### C. Configurar variáveis:

1. Clique no **card do backend**
2. Aba **"Variables"**
3. Adicione:

```
PORT = 3333
JWT_SECRET = [gere uma chave forte de 32+ caracteres]
```

4. Para cada variável do banco, clique **"+ New Variable"** → **"Add Reference"**:
   - `PGHOST` → Reference: Postgres → `PGHOST`
   - `PGPORT` → Reference: Postgres → `PGPORT`
   - `PGUSER` → Reference: Postgres → `PGUSER`
   - `PGPASSWORD` → Reference: Postgres → `PGPASSWORD`
   - `PGDATABASE` → Reference: Postgres → `PGDATABASE`

#### D. Gerar domínio:

1. **"Settings"** → **"Networking"**
2. **"Generate Domain"**
3. **COPIE A URL:** `https://xxx.up.railway.app`

#### E. Executar migrations:

**Opção A - Railway CLI:**
```bash
npm install -g @railway/cli
railway login
railway link
railway run npm --prefix server run migrate
railway run npm --prefix server run seed
```

**Opção B - Auto:**
Edite `server/package.json`:
```json
"start": "npm run migrate && npm run seed && node dist/index.js"
```
Depois: `git push`

#### F. Testar:

```bash
curl https://sua-url.up.railway.app/health
# Deve retornar: {"status":"ok"}
```

✅ **Backend online!**

⏱️ **Tempo:** 10 minutos

---

### 📍 **PASSO 3: DEPLOY FRONTEND (VERCEL)**

#### A. Criar conta e importar:

1. Acesse: **https://vercel.com**
2. **"Login with GitHub"**
3. **"Add New Project"**
4. Selecione: **trabalhe-conosco**
5. **"Root Directory"** → Edit → **trabalhe-_conosco**
6. **"Framework"** → Next.js ✅

#### B. Configurar variável:

Em **"Environment Variables"**:

```
NEXT_PUBLIC_API_BASE = https://sua-url-railway.up.railway.app
```

⚠️ **Cole a URL do Railway (Passo 2D)**

#### C. Deploy:

1. Clique **"Deploy"**
2. Aguarde ~2 minutos

✅ **Frontend online!**

⏱️ **Tempo:** 3 minutos

---

## 🎉 RESULTADO FINAL

```
┌─────────────────────────────────────────┐
│         SISTEMA 100% ONLINE!            │
└─────────────────────────────────────────┘

📱 FRONTEND (Vercel)
   URL: https://trabalhe-conosco.vercel.app
   └── Next.js + React
       └── Conecta via API →

🖥️  BACKEND (Railway)
   URL: https://xxx.up.railway.app
   ├── Node.js + Express
   └── Conectado →

🗄️  POSTGRESQL (Railway)
   Database: railway
   ├── Tabela: vagas
   ├── Tabela: candidatos
   └── Tabela: usuarios
```

---

## 🧪 TESTAR O SISTEMA

### 1. Site público:
```
https://seu-projeto.vercel.app
```

Deve mostrar:
- ✅ Homepage carrega
- ✅ Seção "Vagas Disponíveis"
- ✅ Mensagem: "Nenhuma vaga disponível" (normal, ainda não tem vagas)

### 2. Login RH:
```
https://seu-projeto.vercel.app/rh/login
```

Credenciais:
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123`

Deve:
- ✅ Entrar no dashboard
- ✅ Ver métricas

### 3. Criar vaga:
1. Vá em **"Vagas"**
2. **"Nova Vaga"**
3. Preencha tudo
4. **"Salvar"**

Deve:
- ✅ Vaga criada
- ✅ Aparece na lista

### 4. Ver no site:
1. Volte ao site público
2. Role até "Vagas Disponíveis"

Deve:
- ✅ **Vaga aparece!** 🎉

### 5. Candidatura:
1. Clique **"Ver Detalhes"**
2. Preencha formulário
3. **"Enviar Candidatura"**

Deve:
- ✅ Mensagem de sucesso
- ✅ Candidato aparece no painel RH

---

## 📊 CUSTOS

```
Railway (Backend + PostgreSQL):
├── $5 grátis/mês
├── ~500 horas de execução
└── Depois: ~$5-10/mês

Vercel (Frontend):
├── 100% GRÁTIS
├── Bandwidth: 100GB/mês
└── Deploy ilimitado

TOTAL: $0 (primeiros meses) 💰
```

---

## 🚨 SE ALGO DER ERRADO

### ❌ Backend não responde:
```bash
# Ver logs no Railway
Projeto > Backend > Deployments > View Logs
```

### ❌ Erro "Module not found":
```bash
# Verificar se build rodou
Railway > Backend > Deployments > Build Logs
```

### ❌ Database connection failed:
```bash
# Verificar variáveis
Railway > Backend > Variables
# Confirmar references do PostgreSQL
```

### ❌ Frontend não conecta:
```bash
# Verificar variável no Vercel
Vercel > Settings > Environment Variables
# Confirmar: NEXT_PUBLIC_API_BASE
```

---

## 📚 GUIAS DISPONÍVEIS

Se precisar de mais detalhes:

| Arquivo | Conteúdo |
|---------|----------|
| **[INICIO_RAPIDO_RAILWAY.md](./INICIO_RAPIDO_RAILWAY.md)** | ⭐ Guia rápido 15min |
| **[RAILWAY_CHECKLIST.md](./RAILWAY_CHECKLIST.md)** | ✅ Checklist completo |
| **[DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md)** | 📖 Guia detalhado |

---

## ✅ CHECKLIST VISUAL

```
PREPARAÇÃO:
✅ Código pronto
✅ railway.json criado
✅ package.json atualizado
✅ .gitignore atualizado

PASSO 1 - GIT:
☐ git add .
☐ git commit
☐ git push

PASSO 2 - RAILWAY:
☐ Conta criada
☐ Projeto criado
☐ PostgreSQL adicionado
☐ Variáveis configuradas
☐ Domínio gerado
☐ Migrations executadas
☐ Health check OK

PASSO 3 - VERCEL:
☐ Conta criada
☐ Projeto importado
☐ Variável configurada
☐ Deploy concluído

TESTES:
☐ Site carrega
☐ Login RH funciona
☐ Criar vaga funciona
☐ Vaga aparece no site
☐ Candidatura funciona

RESULTADO:
☐ SISTEMA 100% ONLINE! 🎉
```

---

## 🎯 COMECE AGORA!

### **COMANDO ÚNICO:**

```bash
cd "C:\Users\user\Documents\trabalhe conosco\trabalhe-_conosco" && git add . && git commit -m "chore: preparar para deploy no Railway" && git push origin main
```

Depois:

1. 👉 Acesse: **https://railway.app**
2. 👉 Siga: **PASSO 2** acima
3. 👉 Siga: **PASSO 3** acima
4. 🎉 **SISTEMA ONLINE EM 15 MINUTOS!**

---

**Boa sorte! Você consegue! 🚀**

---

## 📞 SUPORTE

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Railway Discord:** https://discord.gg/railway

---

**Em 15 minutos você terá um sistema completo de recrutamento ONLINE!** 🎊

