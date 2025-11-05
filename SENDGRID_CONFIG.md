# 📧 Configuração SendGrid - Twilio

## ✅ **O que você já fez:**
- [x] Criou conta no SendGrid
- [x] Configurou zona DNS no registro.br
- [x] Verificou email remetente: `trabalheconoscofg@fgservices.com.br`

---

## 🔑 **PRÓXIMO PASSO: Gerar API Key**

### **1. Acesse o SendGrid:**
https://app.sendgrid.com/settings/api_keys

### **2. Clique em "Create API Key"**

### **3. Configure:**
- **API Key Name**: `Sistema RH - Trabalhe Conosco`
- **API Key Permissions**: **Full Access** (ou "Mail Send" se quiser restringir)

### **4. Clique em "Create & View"**

### **5. COPIE A API KEY** (começa com `SG.`)
```
SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANTE**: Você só verá essa chave **UMA VEZ**! Se perder, terá que criar outra.

---

## 🚀 **CONFIGURAR NO RAILWAY:**

### **1. Acesse o Railway:**
https://railway.com/project/4e1f810b-d769-4ba0-a3ec-d9623b4d7f5d

### **2. Clique no serviço do backend**

### **3. Vá em "Variables"**

### **4. Adicione/Atualize estas variáveis:**

```env
# SendGrid (Twilio Email)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=trabalheconoscofg@fgservices.com.br
SENDGRID_FROM_NAME=RH - FG Services

# OU mantenha compatibilidade com Resend (vou adaptar o código)
EMAIL_PROVIDER=sendgrid
```

### **5. Clique em "Add" e depois em "Deploy"**

---

## 💡 **ALTERNATIVA: Continuar usando Resend**

Se preferir continuar com Resend (mais simples que SendGrid):
- Resend já está configurado
- Só precisa verificar o domínio `trabalheconoscofg.com.br`
- Não precisa mudar nada no código

**Qual você prefere?**
1. **SendGrid** (Twilio, mesma conta do WhatsApp)
2. **Resend** (já configurado, mais simples)

---

## 📋 **CHECKLIST:**

**Para SendGrid:**
- [ ] API Key gerada
- [ ] Variável `SENDGRID_API_KEY` adicionada no Railway
- [ ] Variável `SENDGRID_FROM_EMAIL` adicionada
- [ ] Deploy feito no Railway
- [ ] Testar envio de email

**Para Resend (alternativa):**
- [ ] Verificar domínio `trabalheconoscofg.com.br` no painel Resend
- [ ] Já está configurado e pronto para usar

---

**Me avise quando tiver a API Key do SendGrid para eu adaptar o código!** 🚀

