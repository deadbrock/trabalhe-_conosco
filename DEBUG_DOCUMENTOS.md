# 🔍 DEBUG - Sistema de Documentos

## 📊 Status Atual

✅ **Backend:**
- Servidor Railway: https://trabalhe-conoscoserver-production.up.railway.app
- Tabela `documentos_candidatos` criada com sucesso
- Rotas registradas corretamente
- Logs detalhados adicionados

✅ **Frontend:**
- Página de upload: `/documentos/[token].tsx`
- Painel RH: `/rh/documentos.tsx`
- Botão "Solicitar Documentos" adicionado

---

## 🧪 Como Testar

### **1. Gerar Link de Documentos (RH)**

1. Acesse o painel RH: https://trabalhe-conosco-fg.vercel.app/rh/candidatos
2. Selecione uma vaga
3. Clique em um candidato **APROVADO**
4. No modal, clique em **"📄 Solicitar Documentos"**
5. Observe a resposta no console do navegador (F12)

**Resposta esperada:**
```json
{
  "success": true,
  "link": "https://trabalhe-conosco-fg.vercel.app/documentos/abc123...",
  "token": "abc123...",
  "novoRegistro": true,
  "notificacao": {
    "emailEnviado": true,
    "whatsappEnviado": true
  }
}
```

---

### **2. Acessar Link de Upload (Candidato)**

1. Copie o link gerado no passo anterior
2. Abra em uma aba anônima (para simular o candidato)
3. Deve carregar a página de upload com:
   - Nome do candidato
   - Vaga
   - Lista de documentos

**Se der erro 404:**
- Verifique se o token está correto (64 caracteres hexadecimais)
- Verifique no console do navegador qual URL está sendo chamada
- Compare com o backend: `${API_URL}/documentos/${token}`

---

### **3. Verificar Logs do Railway**

```bash
cd trabalhe-_conosco_server
railway logs --tail 50
```

**Logs esperados ao gerar link:**
```
📋 Gerando link de documentos para candidato ID: 335
✅ Candidato encontrado: João Silva | Status: aprovado
🔗 Link gerado: https://trabalhe-conosco-fg.vercel.app/documentos/abc123...
📤 Enviando notificação para joao@email.com / 81999887766
✅ Link criado com sucesso! Token: abc123...
```

**Logs esperados ao acessar link:**
```
📄 Buscando documentos para token: abc123...
📊 Resultado da busca: 1 registro(s) encontrado(s)
✅ Documento encontrado para candidato: João Silva
✅ Enviando dados do candidato João Silva
```

---

## 🐛 Problemas Comuns

### **Problema 1: Link retorna 404**

**Causa possível:** Token não foi salvo no banco

**Solução:**
1. Verificar se o endpoint `/documentos/gerar-link/:id` retornou sucesso
2. Conectar no banco e executar:
```sql
SELECT * FROM documentos_candidatos ORDER BY created_at DESC LIMIT 5;
```
3. Verificar se o token está correto

---

### **Problema 2: "Link inválido ou expirado"**

**Causa possível:** Token não corresponde a nenhum registro

**Solução:**
1. Verificar se o token tem exatamente 64 caracteres
2. Verificar se não há espaços ou caracteres extras
3. Gerar um novo link pelo painel RH

---

### **Problema 3: Página não carrega (loading infinito)**

**Causa possível:** 
- CORS bloqueado
- API_URL incorreto no frontend
- Backend fora do ar

**Solução:**
1. Abrir console do navegador (F12)
2. Verificar aba "Network" para erros HTTP
3. Verificar se `NEXT_PUBLIC_API_URL` está correto:
```bash
# Deve ser:
NEXT_PUBLIC_API_URL=https://trabalhe-conoscoserver-production.up.railway.app
```

---

### **Problema 4: Email/WhatsApp não enviados**

**Causa possível:**
- Credenciais inválidas (SendGrid/Twilio)
- Email não verificado no SendGrid

**Solução:**
1. Verificar variáveis de ambiente no Railway:
```bash
railway variables
```
2. Verificar logs do Railway para erros de envio
3. Testar manualmente no SendGrid/Twilio

---

## 🔧 Comandos Úteis

### **Verificar se tabela existe:**
```bash
railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM documentos_candidatos;"
```

### **Ver tokens gerados:**
```bash
railway run psql $DATABASE_URL -c "SELECT id, candidato_id, token_acesso, created_at FROM documentos_candidatos ORDER BY created_at DESC LIMIT 5;"
```

### **Testar endpoint diretamente:**
```bash
# Substituir TOKEN_AQUI pelo token gerado
curl https://trabalhe-conoscoserver-production.up.railway.app/documentos/TOKEN_AQUI
```

---

## 📞 Próximos Passos

1. **Aprovar um candidato no painel RH**
2. **Clicar em "Solicitar Documentos"**
3. **Copiar o link gerado**
4. **Testar o acesso em aba anônima**
5. **Verificar logs do Railway** (`railway logs --tail 50`)
6. **Reportar qual mensagem de erro aparece** (se houver)

---

## 🎯 Checklist de Funcionamento

- [ ] Backend Railway está online
- [ ] Tabela `documentos_candidatos` existe
- [ ] Endpoint `POST /documentos/gerar-link/:id` retorna sucesso
- [ ] Token é salvo no banco
- [ ] Email/WhatsApp são enviados
- [ ] Endpoint `GET /documentos/:token` retorna dados
- [ ] Página frontend carrega corretamente
- [ ] Upload de documentos funciona

---

**Última atualização:** 24/11/2025 - 19:30

