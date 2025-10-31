# 📧 Teste de Email - Sistema RH

## 🚀 **PASSO 1: Fazer Deploy**

```powershell
cd "C:\Users\user\Documents\trabalhe conosco\trabalhe-_conosco"
railway up
```

**Aguarde ~2 minutos** para o deploy completar.

---

## 📨 **PASSO 2: Enviar Email de Teste**

### **Via PowerShell:**

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    destinatario = "douglas.mds24@gmail.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://trabalhe-conosco-production.up.railway.app/api/comunicacao/testar-email" -Method POST -Headers $headers -Body $body
```

### **Via cURL (se tiver instalado):**

```bash
curl -X POST https://trabalhe-conosco-production.up.railway.app/api/comunicacao/testar-email \
  -H "Content-Type: application/json" \
  -d '{"destinatario":"douglas.mds24@gmail.com"}'
```

---

## ✅ **Resposta Esperada:**

```json
{
  "message": "✅ Email de teste enviado com sucesso!",
  "destinatario": "douglas.mds24@gmail.com",
  "assunto": "✅ Teste de Email - Sistema RH",
  "messageId": "abc123...",
  "timestamp": "2025-10-31T20:30:00.000Z"
}
```

---

## 📧 **Você vai receber um email assim:**

**Assunto**: ✅ Teste de Email - Sistema RH

**Conteúdo**:
```
🎉 Email de Teste - Sistema RH

Olá!

Este é um email de teste enviado pelo sistema de Recrutamento e Seleção.

✅ Configuração do Email:
• 📧 Provedor: Resend
• 🌐 Domínio: trabalheconoscofg.com.br
• ⚡ Status: Funcionando

Se você recebeu este email, significa que o sistema de comunicação está 100% operacional!

---
Enviado automaticamente pelo Sistema de RH
Data: 31/10/2025 17:30:00
```

---

## 🎨 **Personalizando o Email de Teste:**

```powershell
$body = @{
    destinatario = "douglas.mds24@gmail.com"
    assunto = "Meu Email Personalizado"
    mensagem = "<h1>Olá!</h1><p>Este é um email personalizado.</p>"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://trabalhe-conosco-production.up.railway.app/api/comunicacao/testar-email" -Method POST -Headers $headers -Body $body
```

---

## ⚠️ **Se der ERRO:**

### **Erro: "The domain is not verified"**
**Solução**: Precisa verificar o domínio `trabalheconoscofg.com.br` no Resend
1. Acesse: https://resend.com/domains
2. Adicione registros DNS fornecidos pelo Resend

### **Erro: "RESEND_API_KEY não configurada"**
**Solução**: Adicione a API Key no Railway
1. Settings → Variables
2. `RESEND_API_KEY = re_xxxxx...`

### **Erro: 404 Not Found**
**Solução**: Deploy ainda não completou, aguarde mais 1 minuto

---

## 🔍 **Verificar Logs (Opcional):**

```powershell
railway logs
```

Você deve ver:
```
📧 Enviando email de teste para: douglas.mds24@gmail.com
✅ Email de teste enviado com sucesso! ID: abc123...
```

---

## 📋 **CHECKLIST:**

- [ ] Deploy feito com `railway up`
- [ ] Comando executado no PowerShell
- [ ] Resposta JSON recebida com sucesso
- [ ] Email recebido em `douglas.mds24@gmail.com`
- [ ] ⏱️ Tempo total: ~3-5 minutos

---

**Pronto para testar!** 🚀

