# 🚀 DEPLOY FASE 1 - Railway + Vercel

## ✅ **TUDO PRONTO PARA DEPLOY!**

A FASE 1 está 100% completa e commitada. Vamos fazer deploy em produção!

---

## 📋 **CHECKLIST PRÉ-DEPLOY**

- [x] ✅ Backend completo (comentários, tags, agendamentos, pontuação)
- [x] ✅ Frontend completo (4 componentes React)
- [x] ✅ Migrações prontas
- [x] ✅ Código commitado e enviado para GitHub
- [x] ✅ Imports corrigidos
- [ ] ⏳ Executar migração no banco de produção (Railway)
- [ ] ⏳ Deploy automático do backend (Railway)
- [ ] ⏳ Deploy automático do frontend (Vercel)
- [ ] ⏳ Validar funcionalidades

---

## 🎯 **PASSOS PARA DEPLOY**

### **1️⃣ RAILWAY - EXECUTAR MIGRAÇÃO NO BANCO**

O Railway vai fazer deploy automático do backend quando detectar o push no GitHub, MAS você precisa executar a migração FASE 1 manualmente.

#### **Opção A: Via Railway CLI (Recomendado)**

```bash
# 1. Instalar Railway CLI (se ainda não tem)
npm install -g @railway/cli

# 2. Fazer login
railway login

# 3. Navegar para o projeto
cd server

# 4. Executar comando remoto para rodar a migração
railway run npm run migrate:fase1
```

#### **Opção B: Conectar ao Banco Diretamente**

Se a Opção A não funcionar, você pode executar a migração localmente conectando no banco de produção:

```bash
# 1. No Railway, copie a DATABASE_URL do banco Postgres
# 2. Cole no arquivo server/.env
# 3. Execute:
cd server
npm run migrate:fase1
```

⚠️ **IMPORTANTE:** Após rodar a migração, remova a DATABASE_URL de produção do `.env` local por segurança!

---

### **2️⃣ RAILWAY - VERIFICAR DEPLOY DO BACKEND**

O Railway detecta automaticamente o push no GitHub e faz deploy:

1. Acesse: https://railway.app/
2. Entre no projeto **trabalhe-conoscoserver**
3. Vá na aba **Deployments**
4. Aguarde o deploy finalizar (leva ~2-3 minutos)
5. Verifique se aparece: ✅ **Deployment Successful**

#### **Verificar se está funcionando:**

```bash
# Teste o health check
curl https://trabalhe-conoscoserver-production.up.railway.app/health
```

Deve retornar: `{"status":"ok"}`

---

### **3️⃣ VERCEL - VERIFICAR DEPLOY DO FRONTEND**

O Vercel também detecta automaticamente o push e faz deploy:

1. Acesse: https://vercel.com/
2. Entre no projeto **trabalheconoscofg**
3. Vá na aba **Deployments**
4. Aguarde o deploy finalizar (leva ~2-4 minutos)
5. Verifique se aparece: ✅ **Ready**

#### **Verificar variáveis de ambiente no Vercel:**

No painel do Vercel, vá em **Settings > Environment Variables** e confirme que existe:

```
NEXT_PUBLIC_API_URL = https://trabalhe-conoscoserver-production.up.railway.app
```

Se não existir, adicione e faça **Redeploy**.

---

### **4️⃣ VALIDAR NO PAINEL WEB**

Depois que ambos os deploys finalizarem:

1. Acesse: https://trabalheconoscofg.com.br/rh/login
2. Faça login com suas credenciais
3. Vá em: **Candidatos**
4. Clique em uma **vaga** com candidatos
5. Clique no ícone **👁️** (olho) de um candidato
6. Verifique se as **novas abas** aparecem:
   - 💬 Comentários
   - 🏷️ Tags
   - 📅 Agendamentos
   - ⭐ Pontuação

---

## 🧪 **TESTES DE VALIDAÇÃO**

### **Teste 1: Comentários** 💬
1. Abra a aba "Comentários"
2. Digite um comentário de teste
3. Marque como "Importante"
4. Clique em "Enviar"
5. ✅ Deve aparecer o comentário com estrela dourada

### **Teste 2: Tags** 🏷️
1. Abra a aba "Tags"
2. Clique em "Adicionar Tag"
3. Selecione uma tag (ex: "Destaque")
4. ✅ Deve aparecer a tag colorida
5. Clique no X para remover
6. ✅ Tag deve desaparecer

### **Teste 3: Agendamentos** 📅
1. Abra a aba "Agendamentos"
2. Clique em "Novo Agendamento"
3. Preencha:
   - Título: "Entrevista Teste"
   - Data: Qualquer data futura
   - Status: "Agendado"
4. Clique em "Criar"
5. ✅ Deve aparecer o agendamento criado
6. Teste editar e excluir

### **Teste 4: Pontuação** ⭐
1. Abra a aba "Pontuação"
2. Clique em "Recalcular"
3. ✅ Deve aparecer um alerta com a pontuação
4. ✅ A barra de progresso deve atualizar

---

## 🐛 **TROUBLESHOOTING**

### **❌ Erro: "Failed to fetch" ou "Network Error"**
**Problema:** Frontend não está se comunicando com o backend

**Solução:**
1. Verifique se a variável `NEXT_PUBLIC_API_URL` está correta no Vercel
2. Faça **Redeploy** no Vercel após alterar variável
3. Limpe o cache do navegador (Ctrl+Shift+R)

---

### **❌ Erro: "404 Not Found" nas rotas da FASE 1**
**Problema:** Migração não foi executada ou backend não fez deploy

**Solução:**
1. Verifique se a migração foi executada (Passo 1)
2. Verifique se o deploy do Railway foi bem-sucedido
3. Acesse os logs do Railway para ver erros

---

### **❌ Abas não aparecem no modal do candidato**
**Problema:** Deploy do frontend pode não ter atualizado

**Solução:**
1. Limpe o cache do navegador
2. Verifique se o deploy do Vercel foi bem-sucedido
3. Force um hard refresh: Ctrl+Shift+R

---

### **❌ Erro 401 (Unauthorized) nas novas rotas**
**Problema:** Token expirado ou inválido

**Solução:**
1. Faça logout e login novamente
2. Verifique se o JWT_SECRET está configurado no Railway
3. Limpe o localStorage: `localStorage.clear()`

---

## 📊 **MONITORAMENTO PÓS-DEPLOY**

### **Logs do Backend (Railway):**
1. Acesse o projeto no Railway
2. Clique em **View Logs**
3. Filtre por: `POST /comentarios`, `POST /tags`, `POST /agendamentos`, `POST /pontuacao`
4. Verifique se aparecem requisições bem-sucedidas (200 OK)

### **Console do Navegador:**
1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Verifique se não há erros vermelhos
4. Vá na aba **Network**
5. Filtre por: `comentarios`, `tags`, `agendamentos`, `pontuacao`
6. Verifique se as requisições retornam 200 OK

---

## 🎯 **TIMELINE ESTIMADO**

```
⏱️ Passo 1 (Migração Railway)      → 2-5 minutos
⏱️ Passo 2 (Deploy Backend)        → 2-3 minutos (automático)
⏱️ Passo 3 (Deploy Frontend)       → 2-4 minutos (automático)
⏱️ Passo 4 (Validação)             → 5-10 minutos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: ~15-25 minutos
```

---

## 📝 **NOTAS IMPORTANTES**

1. ⚠️ **Backup:** O banco do Railway deve ter backup automático, mas é bom confirmar
2. 🔐 **Segurança:** Nunca commite o arquivo `.env` com credenciais reais
3. 📊 **Performance:** As queries têm índices otimizados
4. 🔄 **Reversão:** Se algo der errado, o código antigo ainda funciona (novas tabelas não afetam código existente)

---

## ✅ **CHECKLIST PÓS-DEPLOY**

Após fazer todos os passos, confirme:

- [ ] ✅ Migração executada sem erros
- [ ] ✅ Backend deployado e respondendo
- [ ] ✅ Frontend deployado e carregando
- [ ] ✅ Modal do candidato abre normalmente
- [ ] ✅ As 5 abas aparecem (Detalhes, Comentários, Tags, Agendamentos, Pontuação)
- [ ] ✅ Consegue adicionar comentário
- [ ] ✅ Consegue adicionar tag
- [ ] ✅ Consegue criar agendamento
- [ ] ✅ Consegue ver pontuação
- [ ] ✅ Nenhum erro no console do navegador
- [ ] ✅ Nenhum erro nos logs do Railway

---

## 🎉 **SUCESSO!**

Se todos os testes passaram, **PARABÉNS! 🚀**

A **FASE 1** está oficialmente em produção e funcionando!

---

## 📞 **SUPORTE**

Se encontrar algum problema:
1. Verifique os logs do Railway
2. Verifique o console do navegador (F12)
3. Confirme que a migração foi executada
4. Teste as rotas diretamente:
   - `https://trabalhe-conoscoserver-production.up.railway.app/health`

---

**Desenvolvido com ❤️ para FG Services**

