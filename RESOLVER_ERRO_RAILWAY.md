# 🔧 RESOLVER ERRO DE DEPLOY NO RAILWAY

## ❌ ERRO ENCONTRADO

```bash
sh: 1: tsc: Permission denied
ERROR: failed to build: failed to solve: process "npm run build" 
did not complete successfully: exit code: 127
```

**Também o aviso:**
```
⚠ Node_modules directory found in project root, this is likely a mistake
⚠ It is recommended to add node_modules to the .gitignore file
```

---

## 🎯 CAUSA DO PROBLEMA

O problema acontece porque:
1. ✅ `node_modules` está sendo enviado para o Git
2. ✅ Isso causa conflito no build do Railway
3. ✅ O `tsc` não consegue executar corretamente

---

## ✅ SOLUÇÃO (3 PASSOS)

### **PASSO 1: Limpar node_modules do Git** 🧹

Abra o terminal na pasta do projeto e execute:

```bash
# 1. Ir para a raiz do projeto
cd "trabalhe-_conosco"

# 2. Remover node_modules do Git (mas não deletar do disco)
git rm -r --cached server/node_modules
git rm -r --cached node_modules

# 3. Commit a remoção
git add .
git commit -m "Remove node_modules from repository"

# 4. Push para o GitHub
git push origin main
```

---

### **PASSO 2: Atualizar .gitignore** 📝

Certifique-se que seu `.gitignore` na raiz tem essas linhas:

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.*

# Backend
server/node_modules/
server/dist/
server/uploads/
server/.env

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Env files
.env
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

Salve o arquivo.

---

### **PASSO 3: Commit e Push** 🚀

```bash
# Adicionar .gitignore atualizado
git add .gitignore

# Commit
git commit -m "Update .gitignore to exclude node_modules"

# Push
git push origin main
```

---

## 🔄 FAZER REDEPLOY NO RAILWAY

Depois de fazer o push:

### **Opção A: Redeploy Automático**
1. Railway vai detectar o novo commit
2. Vai fazer redeploy automaticamente
3. Aguarde 2-3 minutos

### **Opção B: Redeploy Manual**
1. Acesse o Railway
2. Vá no seu projeto
3. Clique em **"Deployments"**
4. Clique nos **3 pontinhos** → **"Redeploy"**

---

## ✅ BUILD DEVE FUNCIONAR AGORA

O log correto será assim:

```bash
▸ install
$ npm ci
✓ found 0 vulnerabilities

▸ build
$ npm run build
✓ Successfully compiled 5 files with TypeScript

Deploy
──────────
$ npm run start
✓ Server listening on port 3333
```

---

## 🔧 SOLUÇÃO ALTERNATIVA (SE AINDA DER ERRO)

Se ainda der erro, tente essa configuração no `package.json` do servidor:

### **Opção 1: Usar npx para tsc**

Edite `server/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/index.ts",
    "build": "npx tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "migrate": "npx ts-node src/migrate.ts",
    "seed": "npx ts-node src/seed.ts",
    "postinstall": "npm run build"
  }
}
```

**O que muda:** Usa `npx tsc` em vez de só `tsc`.

---

### **Opção 2: Instalar globalmente no Railway**

Adicione um arquivo `nixpacks.toml` na pasta `server/`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install -g typescript ts-node", "npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm run start"
```

---

### **Opção 3: Simplificar build (RECOMENDADO)**

Se quiser uma solução mais simples, configure o Railway para **não compilar TypeScript**:

#### **3.1 - Mudar package.json:**

```json
{
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/index.ts",
    "build": "echo 'Skip build'",
    "start": "ts-node src/index.js",
    "migrate": "ts-node src/migrate.ts",
    "seed": "ts-node src/seed.ts"
  }
}
```

#### **3.2 - Mudar index.ts → index.js:**

Renomeie `server/src/index.ts` para `server/src/index.js` e remova as tipagens TypeScript.

**Mas isso não é recomendado!** Melhor usar a Solução 1.

---

## 📋 CHECKLIST COMPLETO

### **Antes do deploy:**
- [ ] `node_modules/` está no `.gitignore`
- [ ] `server/node_modules/` está no `.gitignore`
- [ ] `server/dist/` está no `.gitignore`
- [ ] Não há `node_modules/` no repositório Git
- [ ] `typescript` e `ts-node` estão em `dependencies` (não devDependencies)

### **No Railway:**
- [ ] Projeto conectado ao GitHub
- [ ] Variáveis de ambiente configuradas:
  - `PORT=3333`
  - `DATABASE_URL=${{PostgreSQL.DATABASE_URL}}`
  - `JWT_SECRET=seu_secret_aqui`
  - `NODE_ENV=production`

### **Depois do deploy:**
- [ ] Build passou sem erros
- [ ] Servidor está rodando (status: "Running")
- [ ] Migrations executadas (`railway run npm run migrate`)
- [ ] Seed executado (`railway run npm run seed`)
- [ ] URL do backend funcionando

---

## 🧪 TESTAR SE FUNCIONOU

### **1. Verificar logs do Railway:**
```
✓ Build succeeded
✓ Deploy succeeded
✓ Server is running on port 3333
```

### **2. Testar endpoint:**
```bash
# Substituir pela sua URL do Railway
curl https://seu-backend.railway.app/health

# Deve retornar:
{"status":"ok"}
```

### **3. Testar vagas:**
```bash
curl https://seu-backend.railway.app/vagas

# Deve retornar array (pode estar vazio):
[]
```

---

## 🚨 OUTROS ERROS COMUNS

### **Erro: "Cannot find module"**
**Solução:**
```bash
# No terminal do Railway
railway run npm install
railway run npm run build
```

### **Erro: "Port already in use"**
**Solução:** Verifique se `PORT` está definida como `3333` nas variáveis do Railway.

### **Erro: "Database connection failed"**
**Solução:**
1. Verifique se PostgreSQL está rodando no Railway
2. Verifique se `DATABASE_URL` está configurada
3. Execute migrations: `railway run npm run migrate`

---

## 📊 COMANDOS ÚTEIS DO RAILWAY

```bash
# Ver logs em tempo real
railway logs

# Executar comando no servidor
railway run <comando>

# Executar migrations
railway run npm run migrate

# Executar seed
railway run npm run seed

# Ver variáveis de ambiente
railway variables

# Adicionar variável
railway variables set KEY=value

# SSH no servidor (para debug)
railway shell
```

---

## 💡 DICAS PARA EVITAR PROBLEMAS

### **1. Sempre adicione ao .gitignore:**
```
node_modules/
dist/
.env
*.log
```

### **2. Use .env.example:**
Crie `server/.env.example`:
```bash
PORT=3333
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=seu_secret_aqui
NODE_ENV=development
```

Não commite o `.env` real!

### **3. Teste local antes do deploy:**
```bash
cd server
npm install
npm run build
npm run start

# Deve funcionar sem erros
```

### **4. Mantenha dependências organizadas:**
```json
{
  "dependencies": {
    // Dependências de PRODUÇÃO
    "express": "...",
    "typescript": "...", // Precisa em produção
    "ts-node": "..."     // Precisa em produção
  },
  "devDependencies": {
    // Dependências de DESENVOLVIMENTO
    "@types/...": "...",
    "nodemon": "..."
  }
}
```

---

## 🎉 SUCESSO!

Quando tudo estiver funcionando, você verá:

```bash
Railway Deployment
──────────────────
✅ Build completed successfully
✅ Deployment successful
✅ Service is running

Endpoints:
- https://seu-backend.railway.app
```

---

## 📞 AINDA COM PROBLEMAS?

### **1. Verifique os logs:**
```bash
railway logs --follow
```

### **2. Tente rebuild completo:**
1. No Railway, vá em Settings
2. Clique em "Clear Build Cache"
3. Faça redeploy

### **3. Verifique o tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## ✅ RESUMO DA SOLUÇÃO

**Problema:** `node_modules` no repositório causava conflito.

**Solução:**
1. ✅ Remover `node_modules` do Git
2. ✅ Atualizar `.gitignore`
3. ✅ Push para GitHub
4. ✅ Railway faz redeploy automático
5. ✅ Tudo funciona! 🎉

---

**Arquivo:** `RESOLVER_ERRO_RAILWAY.md`  
**Erro:** Permission denied no `tsc`  
**Solução:** Limpar node_modules do Git  
**Tempo:** ~5 minutos

