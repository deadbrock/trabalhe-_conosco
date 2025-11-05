# 📱 WPPCONNECT - SETUP COMPLETO

## ✅ **O QUE FOI IMPLEMENTADO**

WPPConnect rodando **direto no seu backend** Railway, sem necessidade de servidor externo!

---

## 🚀 **DEPLOY NO RAILWAY**

### **1. Commit e Push**

```bash
cd trabalhe-_conosco
git add .
git commit -m "feat: adicionar WPPConnect para WhatsApp"
git push origin main
```

### **2. Railway vai fazer deploy automaticamente**

O Railway detecta o push e faz deploy (5-10 minutos).

### **3. Aguardar build**

No Railway, acompanhe os logs:
- `npm install` - Instalando dependências (WPPConnect)
- `npm run build` - Compilando TypeScript
- `npm start` - Iniciando servidor

---

## 📱 **CONECTAR WHATSAPP**

### **Passo 1: Obter QR Code**

```bash
# Via cURL
curl https://seu-backend.railway.app/whatsapp/qrcode \
  -H "Authorization: Bearer seu_token_jwt"

# Resposta:
{
  "qrcode": "data:image/png;base64,iVBORw0KGgo..."
}
```

### **Passo 2: Visualizar QR Code**

1. **Copie o base64** da resposta
2. **Cole aqui:** https://codebeautify.org/base64-to-image-converter
3. **Baixe a imagem**

### **Passo 3: Escanear com WhatsApp**

1. Abra **WhatsApp** no celular
2. **Configurações** → **Aparelhos conectados**
3. **"Conectar um aparelho"**
4. Escaneie o QR Code
5. Aguarde conectar (~10 segundos)

---

## ✅ **VERIFICAR CONEXÃO**

```bash
curl https://seu-backend.railway.app/whatsapp/status \
  -H "Authorization: Bearer seu_token_jwt"

# Resposta se conectado:
{
  "conectado": true,
  "status": "connected"
}
```

---

## 🧪 **TESTAR ENVIO**

```bash
curl -X POST https://seu-backend.railway.app/whatsapp/testar \
  -H "Authorization: Bearer seu_token_jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "5511999999999",
    "mensagem": "🎉 Teste do WPPConnect!"
  }'

# Resposta:
{
  "message": "Mensagem enviada com sucesso",
  "messageId": "true_5511999999999@c.us_..."
}
```

---

## 📋 **ENDPOINTS DISPONÍVEIS**

### **GET /whatsapp/status**
Verifica se o WhatsApp está conectado

**Response:**
```json
{
  "conectado": true,
  "status": "connected"
}
```

### **GET /whatsapp/qrcode**
Obtém o QR Code para conectar

**Response:**
```json
{
  "qrcode": "data:image/png;base64,...",
  "message": "Escaneie o QR Code com o WhatsApp"
}
```

### **POST /whatsapp/iniciar**
Força inicialização/reconexão

**Response:**
```json
{
  "message": "WhatsApp iniciado com sucesso",
  "status": "starting"
}
```

### **POST /whatsapp/desconectar**
Desconecta o WhatsApp

**Response:**
```json
{
  "message": "WhatsApp desconectado com sucesso"
}
```

### **POST /whatsapp/testar**
Envia mensagem de teste

**Body:**
```json
{
  "numero": "5511999999999",
  "mensagem": "Teste"
}
```

**Response:**
```json
{
  "message": "Mensagem enviada com sucesso",
  "messageId": "..."
}
```

---

## ⚙️ **CONFIGURAÇÃO (OPCIONAL)**

Se quiser que o WhatsApp inicie automaticamente ao startar o servidor:

**Railway → Variables:**
```env
WHATSAPP_AUTO_START=true
```

Com isso, o WhatsApp vai tentar conectar automaticamente sempre que o servidor iniciar.

---

## 🔍 **LOGS DO RAILWAY**

Acompanhe os logs para ver o QR Code e status:

```
Railway → Seu projeto → Deployments → View Logs

Você verá:
📱 QR Code gerado! Escaneie com o WhatsApp
┌─────────────────────────────────────────────┐
│ █▀▀▀▀▀█ ▀▀█▄  █▀ ▄█▀ █▀▀▀▀▀█                │
│ █ ███ █ █▀ ▀▀▀▀█ ▀█▀ █ ███ █                │
│ ...                                          │
└─────────────────────────────────────────────┘
✅ QR Code escaneado com sucesso!
✅ WhatsApp conectado!
```

---

## 📱 **COMO FUNCIONA**

### **Fluxo de Conexão:**

```
1. Backend inicia
2. WPPConnect gera QR Code
3. Você escaneia com WhatsApp
4. WhatsApp conecta
5. Token salvo em ./tokens/
6. Conexão permanece ativa
```

### **Arquivos Criados:**

```
server/tokens/
  └── trabalhe-conosco/
      ├── session.data.json    (sessão do WhatsApp)
      └── ...                  (outros arquivos)
```

**Importante:** Esses arquivos são salvos automaticamente e mantêm a conexão mesmo após restart!

---

## 🎯 **GATILHOS AUTOMÁTICOS**

Os gatilhos automáticos já estão configurados e vão usar o WPPConnect:

### **Eventos que disparam WhatsApp:**

1. ✅ **Inscrição recebida** - Candidato se inscreve
2. ✅ **Pré-selecionado** - Candidato avança
3. ✅ **Convite para entrevista** - Entrevista agendada
4. ✅ **Aprovado** - Candidato aprovado
5. ✅ **Reprovado** - Feedback gentil

**Não precisa fazer nada!** Os gatilhos já estão integrados e funcionando automaticamente.

---

## 🔧 **TROUBLESHOOTING**

### **"QR Code ainda não gerado"**

**Solução:** Aguarde 5-10 segundos e tente novamente:
```bash
curl https://seu-backend.railway.app/whatsapp/qrcode
```

### **"WhatsApp desconectado"**

**Solução:** Gere novo QR Code e escaneie novamente:
```bash
curl -X POST https://seu-backend.railway.app/whatsapp/iniciar
# Aguarde 5 segundos
curl https://seu-backend.railway.app/whatsapp/qrcode
```

### **"Erro ao enviar mensagem"**

**Causas comuns:**
1. WhatsApp desconectado → Reconectar
2. Número inválido → Verificar formato (5511999999999)
3. Conta WhatsApp temporariamente banida → Usar outro número

### **Logs não aparecem no Railway**

**Solução:** Configure log level:
```env
LOG_LEVEL=INFO
```

---

## 🎉 **VANTAGENS DO WPPCONNECT**

✅ **Sem servidor externo** - Roda no próprio backend
✅ **Grátis** - Sem custos de API
✅ **Simples** - Apenas escanear QR Code
✅ **Estável** - Mantém conexão mesmo após restart
✅ **Rápido** - Envios instantâneos
✅ **Logs** - Vê tudo no terminal
✅ **Persistente** - Sessão salva em tokens/

---

## 📚 **PRÓXIMOS PASSOS**

### **1. Deploy (Agora):**
```bash
git push origin main
# Railway faz deploy automaticamente
```

### **2. Aguardar Deploy (5-10 min)**

### **3. Conectar WhatsApp:**
```bash
# Obter QR Code
curl https://seu-backend.railway.app/whatsapp/qrcode \
  -H "Authorization: Bearer seu_token"

# Escanear no WhatsApp
```

### **4. Testar:**
```bash
# Enviar teste
curl -X POST https://seu-backend.railway.app/whatsapp/testar \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{"numero":"5511999999999","mensagem":"Teste"}'
```

### **5. Configurar Gatilhos (Opcional):**
Acesse: `https://seu-frontend.vercel.app/rh/comunicacao`
- Vá em "Gatilhos"
- Ative os gatilhos de WhatsApp
- Selecione templates

### **6. Pronto! 🎉**

Agora toda vez que:
- Um candidato se inscrever
- Status mudar
- Entrevista for agendada
- Candidato for aprovado/reprovado

**O WhatsApp é enviado automaticamente!** 🚀

---

## 💡 **DICAS**

1. **Mantenha o número conectado** - Não desconecte o WhatsApp do celular
2. **Use número dedicado** - De preferência um chip só para isso
3. **Monitore os logs** - Railway → Deployments → View Logs
4. **Backup dos tokens** - Os arquivos em `./tokens/` são importantes
5. **Evite spam** - Respeite limites do WhatsApp (~1000 msgs/dia)

---

**Documentação WPPConnect:** https://wppconnect.io/
**Repositório:** https://github.com/wppconnect-team/wppconnect

---

## ✅ **CHECKLIST FINAL**

```
□ Código commitado e pushed
□ Railway fez deploy
□ QR Code gerado
□ QR Code escaneado
□ WhatsApp conectado
□ Teste de envio bem-sucedido
□ Gatilhos configurados
□ Sistema funcionando! 🎉
```

**Pronto para usar em produção!** 🚀📱

