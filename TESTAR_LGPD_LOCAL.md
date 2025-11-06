# 🧪 Como Testar a Implementação LGPD Localmente

## 📋 Pré-requisitos

- Node.js instalado
- PostgreSQL rodando
- Backend e Frontend configurados

---

## 🚀 Passo a Passo

### 1️⃣ **Executar Migration LGPD**

```bash
cd server
npm run migrate:lgpd
```

**Resultado Esperado:**
```
🔐 [LGPD] Iniciando migration...
📋 Criando tabela solicitacoes_lgpd...
✅ Tabela solicitacoes_lgpd criada
📋 Adicionando campos LGPD na tabela candidatos...
✅ Campos LGPD adicionados à tabela candidatos
✅ MIGRATION LGPD CONCLUÍDA COM SUCESSO!
```

---

### 2️⃣ **Iniciar Backend**

```bash
cd server
npm run dev
```

**Verificar logs:**
```
🚀 API v1.0.1 listening on http://localhost:3333
✅ SendGrid configurado
```

---

### 3️⃣ **Iniciar Frontend**

```bash
cd ..
npm run dev
```

**Acessar:** `http://localhost:3000`

---

### 4️⃣ **Testar Candidatura com LGPD**

1. Acesse uma vaga: `http://localhost:3000/vagas/1`
2. Preencha o formulário
3. **Verifique:**
   - ☑️ Checkbox LGPD aparece antes do botão "Enviar"
   - 📜 Botão "termos de uso" abre modal
   - ✅ Não é possível enviar sem marcar o checkbox

4. Clique em "termos de uso"
5. **Verifique:**
   - 📋 Modal LGPD abre com termo completo
   - ✅ Botão "Li e Aceito" marca o checkbox
   - 🔗 Links para Política de Privacidade e Portal de Dados

6. Marque o checkbox e envie a candidatura
7. **Verifique no banco:**
```sql
SELECT 
  nome, 
  email, 
  consentimento_lgpd, 
  data_consentimento, 
  ip_consentimento 
FROM candidatos 
ORDER BY id DESC 
LIMIT 1;
```

**Resultado Esperado:**
```
nome: "João Silva"
email: "joao@teste.com"
consentimento_lgpd: true
data_consentimento: "2025-11-03 14:30:00"
ip_consentimento: "::1" (localhost)
```

---

### 5️⃣ **Testar Portal "Meus Dados"**

1. Acesse: `http://localhost:3000/meus-dados`
2. **Verifique:**
   - 📋 Formulário de solicitação aparece
   - 🔘 Duas opções: Exportar ou Excluir
   - ⚠️ Alerta de atenção ao selecionar "Excluir"

3. Preencha com o email de um candidato existente
4. Selecione "Exportar Meus Dados"
5. Clique em "Enviar Solicitação"
6. **Verifique:**
   - 📧 Email com código de 6 dígitos é enviado
   - 📋 Tela muda para "Verifique seu Email"
   - 🔢 Campo para digitar código aparece

7. Copie o código do email e cole
8. Clique em "Confirmar Código"
9. **Verifique:**
   - ✅ Tela de sucesso aparece
   - 📋 Protocolo é exibido (ex: LGPD-000001)
   - 📧 Email de confirmação é enviado

---

### 6️⃣ **Testar Painel RH - LGPD**

1. Faça login no painel RH: `http://localhost:3000/rh/login`
2. Acesse: `http://localhost:3000/rh/lgpd-solicitacoes`
3. **Verifique:**
   - 📊 Lista de solicitações aparece
   - 🔍 Filtros funcionam (Status e Tipo)
   - 👁️ Botão "Ver" abre detalhes

4. Clique em "Ver" na solicitação criada
5. **Verifique:**
   - 📋 Modal com detalhes completos abre
   - 👤 Dados do candidato aparecem
   - 📅 Data da solicitação aparece

6. Feche o modal e clique em "📦 Exportar"
7. Clique em "✅ Confirmar Exportação"
8. **Verifique:**
   - ✅ Alerta de sucesso aparece
   - 📧 Email com dados exportados é enviado
   - 🔄 Status muda para "Concluída"

---

### 7️⃣ **Testar Exclusão de Dados**

1. No portal `meus-dados`, crie nova solicitação
2. Selecione "🗑️ Excluir Meus Dados"
3. ⚠️ **Verifique alerta amarelo** aparece
4. Envie e valide com código
5. No painel RH, clique em "🗑️ Excluir"
6. **Verifique:**
   - ⚠️ Modal de confirmação (ação irreversível)
   - 📝 Campo de motivo opcional
7. Clique em "🗑️ Confirmar Exclusão"
8. **Verifique no banco:**
```sql
SELECT 
  nome, 
  email, 
  telefone, 
  dados_excluidos, 
  data_exclusao 
FROM candidatos 
WHERE dados_excluidos = true 
ORDER BY data_exclusao DESC 
LIMIT 1;
```

**Resultado Esperado:**
```
nome: "Usuário Excluído #123"
email: "excluido_123@anonimo.com"
telefone: "(00) 00000-0000"
dados_excluidos: true
data_exclusao: "2025-11-03 15:00:00"
```

---

### 8️⃣ **Testar Política de Privacidade**

1. Acesse: `http://localhost:3000/politica-privacidade`
2. **Verifique:**
   - 📖 12 seções aparecem
   - 🔗 Links funcionam
   - 📱 Responsivo em mobile
   - 🎨 Design profissional

---

### 9️⃣ **Testar Emails com Rodapé LGPD**

1. Crie uma nova candidatura
2. No painel RH, mude o status para "Em Análise"
3. **Verifique no email do candidato:**
   - 📧 Email automático é enviado
   - 📋 Rodapé LGPD aparece no final
   - 🔗 Links para Portal e Política
   - 📅 Data/hora do envio

**Rodapé Esperado:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Seus Direitos LGPD

Você tem direito a:
• Acessar seus dados pessoais
• Corrigir dados incompletos
• Solicitar exclusão
• Exportar seus dados
• Revogar consentimento

🔐 Como exercer:
• Portal: www.fgservices.com.br/meus-dados
• Email: lgpd@fgservices.com.br
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ Checklist de Testes

- [ ] Migration executada sem erros
- [ ] Checkbox LGPD aparece no formulário
- [ ] Modal LGPD abre e fecha corretamente
- [ ] Candidatura só envia com checkbox marcado
- [ ] Consentimento é salvo no banco com IP e data
- [ ] Portal "Meus Dados" abre e funciona
- [ ] Email com código é enviado
- [ ] Código de verificação funciona
- [ ] Protocolo é gerado e exibido
- [ ] Painel RH/LGPD lista solicitações
- [ ] Filtros do painel funcionam
- [ ] Modal de detalhes abre
- [ ] Exportação funciona e envia email
- [ ] Exclusão anonimiza dados corretamente
- [ ] Política de Privacidade carrega
- [ ] Links da Política funcionam
- [ ] Emails automáticos têm rodapé LGPD
- [ ] Rodapé LGPD tem links funcionais

---

## 🐛 Problemas Comuns

### **Erro: Tabela não existe**
```
ERROR: relation "solicitacoes_lgpd" does not exist
```
**Solução:** Execute `npm run migrate:lgpd`

### **Email não enviado**
**Solução:** Verifique se `SENDGRID_API_KEY` está configurado

### **Checkbox não aparece**
**Solução:** Limpe o cache do navegador (Ctrl+Shift+R)

### **Modal não abre**
**Solução:** Verifique o console do navegador por erros

### **IP sempre "::1"**
**Solução:** Normal em localhost. Em produção será o IP real.

---

## 📊 Queries Úteis para Debug

### Ver todos os consentimentos:
```sql
SELECT 
  id, 
  nome, 
  email, 
  consentimento_lgpd, 
  data_consentimento, 
  ip_consentimento 
FROM candidatos 
WHERE consentimento_lgpd = true 
ORDER BY data_consentimento DESC;
```

### Ver solicitações LGPD:
```sql
SELECT 
  id, 
  tipo, 
  status, 
  email_solicitante, 
  codigo_validado, 
  created_at 
FROM solicitacoes_lgpd 
ORDER BY created_at DESC;
```

### Ver dados anonimizados:
```sql
SELECT 
  id, 
  nome, 
  email, 
  dados_excluidos, 
  data_exclusao 
FROM candidatos 
WHERE dados_excluidos = true;
```

---

## 🎯 Teste Completo End-to-End

1. Criar candidatura com consentimento ✅
2. Solicitar exportação de dados ✅
3. RH processar exportação ✅
4. Candidato receber email com dados ✅
5. Solicitar exclusão de dados ✅
6. RH processar exclusão ✅
7. Dados anonimizados no banco ✅
8. Comprovante enviado por email ✅

**Tempo total estimado:** 15-20 minutos

---

## 📝 Relatório de Testes

Após completar todos os testes, preencha:

```
Data: ___/___/2025
Testado por: _________________

✅ Todos os testes passaram
❌ Problemas encontrados:
_______________________________
_______________________________
_______________________________

Observações:
_______________________________
_______________________________
_______________________________
```

---

**Boa sorte com os testes! 🚀**

