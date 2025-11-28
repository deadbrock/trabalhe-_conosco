# ⚙️ Configuração de Variáveis de Ambiente - Vercel

## 📋 Variáveis Necessárias

### **NEXT_PUBLIC_API_URL**
- **Valor:** `https://trabalhe-conoscoserver-production.up.railway.app`
- **Descrição:** URL do backend Railway
- **Importante:** Deve começar com `NEXT_PUBLIC_` para ser acessível no frontend

---

## 🔧 Como Configurar no Vercel

### **Opção 1: Via Dashboard Vercel**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: **trabalhe-conosco**
3. Vá em **Settings → Environment Variables**
4. Adicione:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://trabalhe-conoscoserver-production.up.railway.app`
   - **Environment:** Production + Preview + Development (marcar todos)
5. Clique em **Save**
6. Faça **Redeploy** do projeto:
   - Vá em **Deployments**
   - Clique nos `...` do último deploy
   - Clique em **Redeploy**

---

### **Opção 2: Via CLI (mais rápido)**

```bash
cd trabalhe-_conosco

# Instalar Vercel CLI (se não tiver)
npm install -g vercel

# Login
vercel login

# Adicionar variável
vercel env add NEXT_PUBLIC_API_URL production

# Quando perguntar o valor, cole:
# https://trabalhe-conoscoserver-production.up.railway.app

# Fazer redeploy
vercel --prod
```

---

## ✅ Como Verificar se Está Configurado

1. Após o deploy, abra o console do navegador (F12)
2. Digite: `console.log(process.env.NEXT_PUBLIC_API_URL)`
3. Deve retornar: `https://trabalhe-conoscoserver-production.up.railway.app`

---

## 🐛 Problema Atual

**Erro:** `GET https://trabalhe-conosco-fg.vercel.app/documentos/[token] 404`

**Causa:** A página `/pages/documentos/[token].tsx` existe no código, mas:
1. Pode não ter sido deployada ainda
2. Ou a variável `NEXT_PUBLIC_API_URL` não está configurada

**Solução:**
1. Verificar se o deploy do Vercel terminou
2. Configurar `NEXT_PUBLIC_API_URL` conforme acima
3. Fazer redeploy manual se necessário

---

## 📊 Status Atual do Sistema

### ✅ **Backend (Railway)**
- URL: https://trabalhe-conoscoserver-production.up.railway.app
- Status: ✅ Online
- Variável `FRONTEND_URL`: ✅ Configurada
- Rotas de documentos: ✅ Funcionando
- Logs: ✅ Detalhados

### ⚠️ **Frontend (Vercel)**
- URL: https://trabalhe-conosco-fg.vercel.app
- Status: ✅ Online
- Página `/documentos/[token]`: ✅ Existe no código
- Variável `NEXT_PUBLIC_API_URL`: ❓ Verificar
- Deploy: ⏳ Aguardando

---

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Railway Dashboard:** https://railway.app/dashboard
- **GitHub Backend:** https://github.com/deadbrock/trabalhe-_conosco_server
- **GitHub Frontend:** https://github.com/deadbrock/trabalhe-_conosco

---

**Última atualização:** 24/11/2025 - 20:00

