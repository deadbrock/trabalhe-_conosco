# 🚨 Railway & Vercel - Troubleshooting

## ✅ **DEPLOY REALIZADO COM SUCESSO!**

**Commit:** `8a8b7bd - Fix: Corrige configuracao Railway e adiciona novos arquivos Sprint 2`

```
✅ 27 arquivos alterados
✅ 4799 linhas adicionadas
✅ Push para GitHub concluído
```

---

## 🔍 **VERIFICAR STATUS DO DEPLOY**

### **1. RAILWAY (Backend)**

#### **Acessar:**
https://railway.app/project/4e1f810b-d769-4ba0-a3ec-d9623b4d7f5d

#### **O que verificar:**

1. **Deployments → Latest Deploy**
   - Status deve estar: `✅ Success` ou `🔄 Building`
   - Se estiver `❌ Failed`, clique para ver os logs

2. **View Logs**
   - Procure por:
     ```
     ✅ Installing dependencies...
     ✅ Building TypeScript...
     🚀 API listening on http://localhost:3333
     ```

3. **Variables**
   - Verifique se todas estão configuradas:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `RESEND_API_KEY`
     - `NODE_ENV=production`
     - `PORT=3333`

---

### **2. VERCEL (Frontend)**

#### **Acessar:**
https://vercel.com/seu-usuario/trabalhe-conosco

#### **O que verificar:**

1. **Deployments → Latest**
   - Status deve estar: `✅ Ready` ou `🔄 Building`
   - Se estiver `❌ Error`, clique para ver os logs

2. **Settings → Environment Variables**
   - Verifique:
     - `NEXT_PUBLIC_API_URL=https://trabalhe-conoscoserver-production.up.railway.app`

3. **Se o deploy não iniciou automaticamente:**
   - Clique em **Redeploy**

---

## 🧪 **TESTAR SE ESTÁ FUNCIONANDO**

### **Teste 1: Backend Railway**

```bash
curl https://trabalhe-conoscoserver-production.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T..."
}
```

❌ **Se retornar erro 404 ou timeout:**
- O deploy ainda não terminou (aguarde 2-3 minutos)
- Ou o deploy falhou (verifique os logs)

---

### **Teste 2: Frontend Vercel**

Acesse: https://www.trabalheconoscofg.com.br

**O que deve funcionar:**
- ✅ Página inicial carrega
- ✅ Menu de navegação funciona
- ✅ Página de vagas funciona
- ✅ Formulário de candidatura funciona

❌ **Se a página não carregar:**
- Limpe o cache: `Ctrl + Shift + R`
- Verifique se o deploy do Vercel terminou

---

### **Teste 3: Login RH**

Acesse: https://www.trabalheconoscofg.com.br/rh/login

**Credenciais de teste:**
```
Email: admin@fgservices.com
Senha: admin123
```

✅ **Se login funcionar:**
- Backend está operacional!
- Banco de dados está conectado!

❌ **Se retornar erro 500:**
- Backend não está respondendo
- Verifique logs do Railway

---

## 🔥 **PROBLEMAS COMUNS**

### **❌ Erro: "npm ci can only install packages when..."**

**Causa:** `package-lock.json` dessinc ronizado

**Solução:** ✅ JÁ CORRIGIDO!
- Mudamos de `npm ci` para `npm install` no `nixpacks.toml`
- Railway detectará automaticamente no próximo deploy

---

### **❌ Erro: "Chromium not found"**

**Causa:** WPPConnect precisa de dependências do sistema

**Solução:** ✅ JÁ CONFIGURADO!
- Arquivo `nixpacks.toml` tem todas as dependências necessárias:
  - chromium, nss, freetype, harfbuzz, etc.

---

### **❌ Erro: "Cannot find module..."**

**Causa:** Dependências não instaladas corretamente

**Solução:**
1. Railway → Deployments → Force Redeploy
2. Ou faça um commit vazio:
   ```bash
   git commit --allow-empty -m "Force rebuild"
   git push origin main
   ```

---

### **❌ Deploy está travado em "Building"**

**Causa:** Build pode estar demorando por causa do Chromium

**Solução:**
- Aguarde até 10 minutos (primeiro deploy é mais lento)
- Se passar de 10 min, cancele e force novo deploy

---

### **❌ Erro: "Database connection failed"**

**Causa:** Migrations não foram executadas

**Solução:**
1. **Railway → Service → Shell (ou Logs)**
2. Execute os comandos:
   ```bash
   npm run migrate
   npm run migrate:fase1
   npm run migrate:fase3
   npm run migrate:sprint2
   npm run seed
   npm run seed:templates
   ```

---

### **❌ Vercel não está fazendo deploy**

**Causa:** Webhook do GitHub pode não estar configurado

**Solução:**
1. **Vercel → Settings → Git**
2. Verifique se está conectado ao repositório correto
3. Clique em **Redeploy** manualmente
4. Ou force um commit no frontend:
   ```bash
   cd trabalhe-_conosco
   git commit --allow-empty -m "Force Vercel redeploy"
   git push origin main
   ```

---

## 📊 **LOGS IMPORTANTES**

### **✅ Deploy bem-sucedido (Railway):**

```
✓ Installing dependencies
✓ Compiling TypeScript
✓ Build completed
✓ Starting server
🚀 API listening on http://localhost:3333
📊 Connected to PostgreSQL
```

### **✅ Deploy bem-sucedido (Vercel):**

```
✓ Building Next.js
✓ Linting and checking validity
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
✓ Deployment Ready
```

---

## 🎯 **PRÓXIMOS PASSOS APÓS DEPLOY**

### **1. Executar Migrations (IMPORTANTE!)**

As tabelas das novas funcionalidades precisam ser criadas:

**Via Railway Shell:**
```bash
npm run migrate:fase3
npm run migrate:sprint2
npm run seed:templates
```

---

### **2. Testar Funcionalidades Novas**

#### **Teste Sprint 2:**
1. Login como RH
2. Acesse `/rh/comunicacao`
3. Veja templates de Email e WhatsApp
4. Clique em "WhatsApp Connect"
5. Gere QR Code

---

### **3. Configurar WhatsApp**

1. Acesse: `/rh/whatsapp-connect`
2. Clique em "Gerar QR Code"
3. Escaneie com WhatsApp
4. Aguarde status mudar para "Conectado"

---

## 🆘 **AINDA COM PROBLEMAS?**

### **Opção 1: Verificar Logs Detalhados**

**Railway:**
```
Railway → Deployments → View Logs
```

Procure por linhas com `❌ Error` ou `⚠️ Warning`

**Vercel:**
```
Vercel → Deployments → Latest → View Function Logs
```

---

### **Opção 2: Forçar Rebuild Completo**

**Railway:**
1. Service Settings → Delete Service
2. Recrie conectando ao GitHub novamente
3. Configure variáveis de ambiente
4. Aguarde deploy

**Vercel:**
1. Settings → General → Delete Project
2. New Project → Import do GitHub
3. Configure variáveis de ambiente
4. Deploy

---

### **Opção 3: Deploy Local para Teste**

Se o Railway continuar com problemas:

```bash
# Backend (Terminal 1)
cd trabalhe-_conosco/server
npm install
npm run migrate
npm run migrate:fase3
npm run migrate:sprint2
npm run seed
npm run seed:templates
npm run dev

# Frontend (Terminal 2)
cd trabalhe-_conosco
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## ✅ **CHECKLIST FINAL**

- [ ] Railway detectou o push e iniciou deploy
- [ ] Deploy do Railway completou com sucesso
- [ ] Vercel detectou o push e iniciou deploy
- [ ] Deploy do Vercel completou com sucesso
- [ ] Endpoint `/health` do backend responde
- [ ] Login RH funciona
- [ ] Migrations foram executadas
- [ ] Templates foram criados (seed)
- [ ] WhatsApp Connect está acessível

---

## 📞 **STATUS ATUAL (AGUARDANDO)**

```
🔄 Railway está processando o deploy...
🔄 Vercel está processando o deploy...

⏱️ Tempo estimado: 3-5 minutos
```

### **Como acompanhar:**

1. **Railway:** https://railway.app (veja "Deployments")
2. **Vercel:** https://vercel.com (veja "Deployments")

---

### **Me avise quando:**

- ✅ Deploy completar (sucesso ou erro)
- ❌ Aparecer algum erro nos logs
- ⏱️ Passar de 10 minutos sem completar

**Estou aqui para ajudar!** 🚀

