# 🚀 Guia de Configuração WPPConnect no Railway

## ⚠️ IMPORTANTE: LIMITAÇÕES DO RAILWAY

O WPPConnect usa **Puppeteer/Chromium** que precisa de:
- Dependências do sistema (libgbm, libasound, etc.)
- Armazenamento persistente para sessões
- Memória suficiente (mínimo 512MB)

---

## 📋 PASSO A PASSO

### **1. ADICIONAR VARIÁVEIS DE AMBIENTE NO RAILWAY**

Vá para: **Railway → Seu Projeto → Variables**

Adicione as seguintes variáveis:

```env
# WhatsApp/WPPConnect
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
NODE_ENV=production

# Suas variáveis existentes
DATABASE_URL=postgresql://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
JWT_SECRET=...
RESEND_API_KEY=...
```

---

### **2. ADICIONAR DEPENDÊNCIAS DO SISTEMA**

Crie um arquivo `nixpacks.toml` na raiz do projeto **server/**:

```toml
[phases.setup]
nixPkgs = ['nodejs_18', 'chromium', 'nss', 'freetype', 'harfbuzz', 'ca-certificates', 'ttf-freefont']

[phases.install]
cmds = ['npm ci']

[phases.build]
cmds = ['npm run build']

[start]
cmd = 'npm run start'
```

---

### **3. CRIAR VOLUME PERSISTENTE (OPCIONAL)**

Para salvar a sessão do WhatsApp entre deploys:

**No Railway:**
1. Vá para **Service Settings**
2. Clique em **Volumes**
3. Adicione um volume:
   - **Mount Path:** `/app/tokens`
   - **Size:** 1GB

---

### **4. ALTERNATIVA: USAR VENOM-BOT (MAIS LEVE)**

Se o WPPConnect não funcionar no Railway, use Venom-Bot que é mais leve:

```bash
npm uninstall @wppconnect-team/wppconnect
npm install venom-bot
```

---

## 🔍 VERIFICAR SE ESTÁ FUNCIONANDO

### **Logs do Railway:**

Você deve ver no console:
```
WPPConnect iniciando...
QR CODE (ASCII): ████████
WPPConnect conectado com sucesso!
```

### **Endpoint de teste:**

```bash
curl https://trabalhe-conoscoserver-production.up.railway.app/health
```

---

## ⚡ SOLUÇÃO RÁPIDA: USAR RENDER.COM

Se o Railway continuar com problemas, o **Render.com** tem melhor suporte para Puppeteer/Chromium:

1. Criar conta em https://render.com
2. New → Web Service
3. Conectar repositório
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start`
6. Adicionar variáveis de ambiente

---

## 🆘 TROUBLESHOOTING

### **Erro: "Chromium not found"**
→ Adicione o `nixpacks.toml` conforme o passo 2

### **Erro: "Session closed"**
→ Configure o volume persistente (passo 3)

### **Erro: "Out of memory"**
→ Aumente o plano do Railway (mínimo 512MB)

### **Erro: "Timeout waiting for browser"**
→ O Railway pode estar bloqueando. Use Render.com

---

## 📱 ALTERNATIVA RECOMENDADA: WHATSAPP BUSINESS API

Para produção, considere usar a API oficial:
- **WhatsApp Business API** (Meta)
- **Twilio WhatsApp API**
- **360Dialog**

Essas soluções são mais estáveis e não precisam de QR Code.

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Adicionar variáveis de ambiente
2. ✅ Criar arquivo `nixpacks.toml`
3. ✅ Fazer deploy
4. ✅ Verificar logs
5. ✅ Testar endpoint `/whatsapp/qrcode`

