# 📱 Configuração Twilio WhatsApp

## 🎯 **GUIA COMPLETO DE SETUP**

---

## **PARTE 1: CRIAR CONTA TWILIO** ⏱️ 5 minutos

### **Passo 1: Criar conta gratuita**
1. Acesse: https://www.twilio.com/try-twilio
2. Preencha:
   - Nome
   - Email
   - Senha
3. **Clique em "Start your free trial"**

### **Passo 2: Verificar conta**
1. Verifique seu **email** (clique no link)
2. Verifique seu **telefone** (código SMS)

### **Passo 3: Escolher produto**
1. Selecione: **"Messaging"**
2. Selecione: **"WhatsApp"**
3. Clique em **"Continue"**

---

## **PARTE 2: OBTER CREDENCIAIS** ⏱️ 2 minutos

### **Passo 1: Account SID e Auth Token**
1. No dashboard Twilio (https://console.twilio.com/)
2. Procure a seção **"Account Info"**
3. Copie:
   - ✅ **Account SID** (começa com `AC...`)
   - ✅ **Auth Token** (clique em "Show" para ver)

**Exemplo:**
```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## **PARTE 3: CONFIGURAR WHATSAPP SANDBOX** ⏱️ 3 minutos

### **O que é Sandbox?**
- Ambiente de **teste gratuito**
- Você pode enviar mensagens **sem custo**
- Limitado a números que você "ativar"

### **Passo 1: Acessar Sandbox**
1. No menu lateral: **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Você verá algo assim:

```
+1 415 523 8886
Join code: join yellow-tiger
```

### **Passo 2: Ativar seu WhatsApp**
1. **Salve o número** mostrado no seu celular (ex: +1 415 523 8886)
2. **Envie uma mensagem** para esse número com o código (ex: `join yellow-tiger`)
3. Você receberá uma confirmação: ✅ **"You are all set!"**

### **Passo 3: Adicionar mais números (opcional)**
Para testar com outros números (colegas, etc):
1. Eles precisam enviar o mesmo código (`join yellow-tiger`) para o número sandbox
2. Depois disso, você pode enviar mensagens para eles

---

## **PARTE 4: CONFIGURAR NO RAILWAY** ⏱️ 2 minutos

### **Adicionar Variáveis de Ambiente:**

1. Acesse seu projeto no Railway: https://railway.app/
2. Clique no serviço **backend**
3. Vá em **Variables**
4. Adicione:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**⚠️ IMPORTANTE:**
- `TWILIO_WHATSAPP_NUMBER` deve ter o prefixo `whatsapp:`
- Para sandbox, use: `whatsapp:+14155238886` (número pode variar)
- Para produção (após aprovação), use: `whatsapp:+5511999999999`

5. Clique em **"Add"** ou **"Deploy"**

---

## **PARTE 5: TESTAR NO SISTEMA** ⏱️ 2 minutos

### **Método 1: Usando a API diretamente**

```bash
# Verificar status
curl https://seu-backend.railway.app/whatsapp/status \
  -H "Authorization: Bearer SEU_TOKEN_RH"

# Enviar mensagem de teste
curl -X POST https://seu-backend.railway.app/whatsapp/testar \
  -H "Authorization: Bearer SEU_TOKEN_RH" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "11999999999",
    "mensagem": "Olá! Esta é uma mensagem de teste do sistema de recrutamento."
  }'
```

### **Método 2: Usando o Painel Web**
1. Acesse: `https://seu-site.vercel.app/rh/comunicacao`
2. Vá em **"Configurações"** → **"Testar WhatsApp"**
3. Digite um número ativado no sandbox
4. Envie mensagem de teste
5. ✅ Verifique se recebeu no WhatsApp

---

## **CUSTOS** 💰

### **Sandbox (Teste Grátis):**
- ✅ **Gratuito**
- ✅ Ilimitado para testes
- ❌ Só funciona com números ativados
- ❌ Não pode usar em produção

### **Produção (Conta Aprovada):**
- **$0.005 por mensagem** (~R$0.025)
- **100 mensagens = $0.50** (~R$2.50)
- **1000 mensagens = $5.00** (~R$25.00)
- ✅ Pode enviar para qualquer número
- ✅ Sem limite de ativação

**Crédito Grátis:**
- Twilio dá **$15 de crédito** inicial
- Dá para enviar **3.000 mensagens de teste**! 🎉

---

## **PRODUÇÃO: NÚMERO OFICIAL** 🚀

### **Quando usar?**
- Quando sair do teste
- Quando quiser enviar para qualquer número (sem precisar ativar)

### **Como obter?**
1. No Twilio, vá em: **Messaging** → **WhatsApp senders**
2. Clique em **"Request access"**
3. Preencha o formulário:
   - Nome da empresa
   - Tipo de mensagens (recrutamento/comunicação com candidatos)
   - Volume estimado
4. Aguarde aprovação (1-2 dias úteis)
5. Após aprovado:
   - Você receberá um número oficial: `whatsapp:+5511999999999`
   - Atualize a variável `TWILIO_WHATSAPP_NUMBER` no Railway

---

## **TEMPLATES APROVADOS** 📝

### **O que são?**
Para produção, você precisa **aprovar templates** com o WhatsApp.

### **Como criar?**
1. No Twilio: **Messaging** → **Content templates**
2. Clique em **"Create template"**
3. Exemplo:

```
Nome: candidato_inscricao_recebida
Categoria: UTILITY
Idioma: Portuguese (Brazil)

Conteúdo:
---
Olá {{1}}! 👋

Recebemos sua inscrição para a vaga de {{2}}.

Entraremos em contato em breve!

Atenciosamente,
Equipe de RH
---
```

4. Envie para aprovação (24-48h)
5. Após aprovado, use no sistema

---

## **TROUBLESHOOTING** 🔧

### **Erro: "The number is not a WhatsApp number"**
**Solução:** O número precisa ter WhatsApp e estar ativado no sandbox (enviou o código `join yellow-tiger`)

### **Erro: "Authentication failed"**
**Solução:** Verifique se `TWILIO_ACCOUNT_SID` e `TWILIO_AUTH_TOKEN` estão corretos

### **Erro: "Permission denied"**
**Solução:** Você precisa ativar o WhatsApp no seu Twilio (vá em Messaging → WhatsApp)

### **Mensagem não chega**
**Possíveis causas:**
1. Número não ativou o sandbox (`join yellow-tiger`)
2. Número não tem WhatsApp
3. Formato do número incorreto (use: 11999999999 sem espaços)

---

## **DIFERENÇAS: SANDBOX vs PRODUÇÃO**

| Característica | Sandbox (Teste) | Produção |
|----------------|-----------------|----------|
| **Custo** | Gratuito | $0.005/msg |
| **Números** | Só ativados | Qualquer um |
| **Ativação** | Código `join` | Não precisa |
| **Templates** | Livre | Precisa aprovação |
| **Limite** | Ilimitado | Conforme crédito |
| **Uso** | Desenvolvimento | Clientes reais |

---

## **PRÓXIMOS PASSOS** ✅

1. ✅ **Criar conta Twilio** (5 min)
2. ✅ **Copiar credenciais** (2 min)
3. ✅ **Ativar sandbox** (3 min)
4. ✅ **Configurar Railway** (2 min)
5. ✅ **Testar mensagem** (2 min)
6. 🔄 **Instalar dependências e deployar** (5 min)

**Total: ~20 minutos** ⏱️

---

## **SUPORTE** 💬

- **Documentação Twilio:** https://www.twilio.com/docs/whatsapp
- **Sandbox Tutorial:** https://www.twilio.com/docs/whatsapp/sandbox
- **Preços:** https://www.twilio.com/whatsapp/pricing

---

**Pronto para começar?** 🚀

Me avise quando tiver as credenciais que eu configuro o resto! 😊

