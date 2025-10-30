# 🚀 Passo a Passo: Deploy WPPConnect no Railway

## 📋 PRÉ-REQUISITOS

✅ Conta no Railway  
✅ Projeto conectado ao GitHub  
✅ Código commitado e pushado  

---

## 🔧 PASSO 1: CONFIGURAR VARIÁVEIS DE AMBIENTE

### **Acesse:** Railway → Seu Projeto → Variables

### **Adicione as seguintes variáveis:**

```env
# Database
DATABASE_URL=postgresql://postgres:xxxxx@xxxxx.railway.app:5432/railway

# Cloudinary
CLOUDINARY_CLOUD_NAME=djbvjlw1m
CLOUDINARY_API_KEY=seu_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# JWT
JWT_SECRET=sua_chave_secreta_super_segura

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# WhatsApp
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_EXECUTABLE_PATH=/nix/store/.../bin/chromium

# Ambiente
NODE_ENV=production
PORT=3333
```

⚠️ **IMPORTANTE:** Substitua os valores de exemplo pelos seus valores reais!

---

## 📦 PASSO 2: VERIFICAR ARQUIVO nixpacks.toml

O arquivo `server/nixpacks.toml` já foi criado com as dependências necessárias:

```toml
[phases.setup]
nixPkgs = [
  'nodejs_18',
  'chromium',
  'nss',
  'freetype',
  'harfbuzz',
  'ca-certificates',
  'ttf-freefont',
  'fontconfig',
  'libxshmfence',
  'libgbm'
]
```

✅ Este arquivo já está no repositório!

---

## 🗂️ PASSO 3: CRIAR VOLUME PERSISTENTE (OPCIONAL)

Para salvar a sessão do WhatsApp entre deploys:

1. **Railway → Service Settings → Volumes**
2. Clique em **"New Volume"**
3. Configure:
   - **Mount Path:** `/app/tokens`
   - **Size:** 1 GB

---

## 🚀 PASSO 4: FAZER DEPLOY

### **Opção A: Deploy Automático (Recomendado)**

1. Commit e push das alterações:

```bash
cd trabalhe-_conosco
git add -A
git commit -m "Configura WPPConnect para Railway"
git push origin main
```

2. O Railway detecta automaticamente e inicia o deploy!

### **Opção B: Deploy Manual**

1. **Railway → Deployments**
2. Clique em **"Deploy Now"**

---

## 🔍 PASSO 5: VERIFICAR LOGS

### **Durante o deploy, você deve ver:**

```
✅ Installing dependencies...
✅ Building TypeScript...
✅ Starting server...
🚀 API listening on http://localhost:3333
```

### **Se houver erro de Chromium:**

```
❌ Error: Could not find Chromium
```

**Solução:** Verifique se o `nixpacks.toml` está na raiz do diretório `server/`

---

## 🧪 PASSO 6: TESTAR API

### **1. Verificar se o servidor está online:**

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

### **2. Verificar status do WhatsApp:**

```bash
curl https://trabalhe-conoscoserver-production.up.railway.app/whatsapp/status \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

**Resposta esperada:**
```json
{
  "conectado": false,
  "status": "disconnected"
}
```

---

## 📱 PASSO 7: CONECTAR WHATSAPP

### **Opção A: Via Frontend (Recomendado)**

1. Acesse: `https://www.trabalheconoscofg.com.br/rh/whatsapp-connect`
2. Faça login como RH
3. Clique em **"Gerar QR Code"**
4. Escaneie com o WhatsApp no celular
5. Status mudará para **"Conectado"** ✅

### **Opção B: Via API (Teste)**

```bash
# 1. Fazer login
curl -X POST https://trabalhe-conoscoserver-production.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu_email@exemplo.com","senha":"sua_senha"}'

# Copie o token retornado

# 2. Iniciar WhatsApp
curl -X POST https://trabalhe-conoscoserver-production.up.railway.app/whatsapp/iniciar \
  -H "Authorization: Bearer SEU_TOKEN"

# 3. Obter QR Code (aguarde 3-5 segundos)
curl https://trabalhe-conoscoserver-production.up.railway.app/whatsapp/qrcode \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🐛 TROUBLESHOOTING

### **Erro: "Chromium not found"**

**Solução:**
1. Verifique se `nixpacks.toml` está em `server/`
2. Força um novo deploy:
   ```bash
   git commit --allow-empty -m "Force rebuild"
   git push origin main
   ```

### **Erro: "Session closed" ou "Browser closed"**

**Solução:**
1. Configure volume persistente (Passo 3)
2. Aumente memória do Railway (Settings → Memory → 512MB+)

### **Erro: "Timeout waiting for browser"**

**Possíveis causas:**
- Railway está com recursos limitados
- Chromium não conseguiu inicializar

**Soluções:**
1. Upgrade do plano Railway
2. Usar alternativa: **Render.com** ou **Fly.io**
3. Usar **WhatsApp Business API oficial**

### **QR Code não aparece**

**Solução:**
1. Verifique logs do Railway:
   ```
   Railway → Deployments → View Logs
   ```
2. Procure por mensagens de erro
3. Verifique se as variáveis de ambiente estão corretas

---

## 📊 LOGS IMPORTANTES

### **✅ Sucesso:**

```
🔄 Iniciando WhatsApp...
📱 QR Code gerado! Escaneie com o WhatsApp
✅ QR Code salvo no banco
✅ WhatsApp conectado com sucesso!
```

### **❌ Erro:**

```
❌ Erro ao iniciar WhatsApp: Error: Could not find Chromium
```

---

## 🎯 PRÓXIMOS PASSOS APÓS CONECTAR

1. ✅ Teste envio de mensagem manual
2. ✅ Configure templates de mensagens
3. ✅ Configure gatilhos automáticos
4. ✅ Monitore histórico de comunicações

---

## 🆘 ALTERNATIVAS SE NÃO FUNCIONAR

### **Opção 1: Render.com (Melhor suporte Puppeteer)**

1. Criar conta: https://render.com
2. New Web Service
3. Conectar repositório
4. Selecionar `server/` como root directory
5. Build: `npm install && npm run build`
6. Start: `npm run start`

### **Opção 2: Fly.io**

1. Instalar CLI: `npm install -g flyctl`
2. Login: `fly auth login`
3. Deploy: `fly launch` (na pasta `server/`)

### **Opção 3: WhatsApp Business API Oficial**

Serviços pagos mas mais estáveis:
- **Twilio:** https://www.twilio.com/whatsapp
- **360Dialog:** https://www.360dialog.com
- **Meta WhatsApp Business API**

---

## 📚 RECURSOS ÚTEIS

- **Railway Docs:** https://docs.railway.app
- **WPPConnect Docs:** https://wppconnect.io
- **Nixpacks:** https://nixpacks.com

---

## ✅ CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas
- [ ] Arquivo `nixpacks.toml` no diretório `server/`
- [ ] Deploy realizado com sucesso
- [ ] Servidor respondendo em `/health`
- [ ] QR Code gerado via `/whatsapp/qrcode`
- [ ] WhatsApp conectado e testado
- [ ] Mensagem de teste enviada com sucesso

---

🎉 **Parabéns! Seu WhatsApp está integrado!** 🎉

