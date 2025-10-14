# 🌐 CONFIGURAR DOMÍNIO PERSONALIZADO NO VERCEL

## 📋 Domínio: trabalheconoscofg.com.br

---

## 🎯 PASSO A PASSO COMPLETO

### **PARTE 1: CONFIGURAR NO VERCEL** ⚡

#### 1️⃣ Acessar o projeto no Vercel

1. Entre em: https://vercel.com
2. Faça login
3. Selecione seu projeto: **trabalhe-conosco** (ou o nome que está no Vercel)

---

#### 2️⃣ Adicionar Domínio Customizado

1. No seu projeto, clique em **"Settings"** (Configurações)
2. No menu lateral, clique em **"Domains"**
3. Clique no campo **"Add domain"**
4. Digite: `trabalheconoscofg.com.br`
5. Clique em **"Add"**

---

#### 3️⃣ Vercel vai mostrar os registros DNS necessários

Você verá algo assim:

```
⚠️ Invalid Configuration

Para configurar trabalheconoscofg.com.br, adicione os seguintes registros DNS:

Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

**NÃO FECHE ESTA TELA!** Vamos usar esses valores no Registro.br

---

### **PARTE 2: CONFIGURAR NO REGISTRO.BR** 🇧🇷

#### 1️⃣ Acessar o Painel do Registro.br

1. Entre em: https://registro.br
2. Faça login com sua conta
3. Clique em **"Painel de Controle"**
4. Localize o domínio: **trabalheconoscofg.com.br**
5. Clique em **"Administrar"** ou **"DNS"**

---

#### 2️⃣ Configurar Servidores DNS

Existem 2 opções:

**OPÇÃO A: Usar DNS do Registro.br (RECOMENDADO)** ⭐

Se você usar os DNS do próprio Registro.br, siga assim:

1. Certifique-se que está usando os DNS padrão do Registro.br:
   ```
   a.dns.br
   b.dns.br
   c.dns.br
   ```

2. Continue para o Passo 3 abaixo

**OPÇÃO B: Usar DNS da Vercel**

Se preferir usar o DNS da Vercel (mais avançado):

1. No Vercel, na aba "Domains", clique em **"Use Vercel DNS"**
2. Vercel vai te dar nameservers tipo:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. No Registro.br, altere os nameservers para esses da Vercel
4. Aguarde propagação (24-48h)

**Vou seguir com OPÇÃO A (mais fácil):**

---

#### 3️⃣ Adicionar Registros DNS no Registro.br

No painel do Registro.br, procure por **"DNS"** ou **"Zona DNS"**:

##### **Registro A (Domínio raiz):**

```
Tipo: A
Host: @ (ou deixe vazio, ou trabalheconoscofg.com.br)
Valor/Aponta para: 76.76.21.21
TTL: 3600 (ou padrão)
```

##### **Registro CNAME (www):**

```
Tipo: CNAME
Host: www
Valor/Aponta para: cname.vercel-dns.com
TTL: 3600 (ou padrão)
```

---

#### 4️⃣ Interface do Registro.br

A interface pode variar, mas geralmente é assim:

1. Clique em **"Adicionar novo registro"** ou **"+"**
2. Selecione o **Tipo** (A ou CNAME)
3. Preencha o **Nome/Host**
4. Preencha o **Valor/Destino**
5. Salve

**Repita para AMBOS os registros (A e CNAME)**

---

### **PARTE 3: CONFIRMAR NO VERCEL** ✅

#### 1️⃣ Voltar ao Vercel

Depois de adicionar os registros DNS no Registro.br:

1. Volte para o Vercel (aba "Domains")
2. Clique em **"Refresh"** ou **"Verify"**
3. Aguarde a verificação (pode levar alguns minutos)

---

#### 2️⃣ Status da Verificação

Você verá:

**Verificando...**
```
⏳ Checking DNS configuration...
```

**Sucesso!**
```
✅ Valid Configuration
trabalheconoscofg.com.br is now connected!
```

---

### **PARTE 4: CONFIGURAÇÕES ADICIONAIS (OPCIONAL)** 🔧

#### 1️⃣ Redirecionar www para domínio principal

No Vercel, em **"Domains"**, você pode definir qual é o domínio principal:

- `trabalheconoscofg.com.br` ← Principal
- `www.trabalheconoscofg.com.br` ← Redireciona automaticamente

Ou vice-versa.

Para fazer isso:
1. Clique nos 3 pontinhos ao lado do domínio
2. Escolha **"Set as Primary Domain"**

---

#### 2️⃣ SSL/HTTPS Automático

O Vercel gera certificado SSL automaticamente! 🔒

Após a verificação:
- ✅ HTTPS ativado automaticamente
- ✅ Certificado Let's Encrypt
- ✅ Renovação automática

Não precisa fazer nada!

---

## ⏱️ TEMPO DE PROPAGAÇÃO

### DNS Propagação:

- **Mínimo:** 15-30 minutos
- **Médio:** 2-4 horas
- **Máximo:** 24-48 horas (raro)

**Dica:** Use https://dnschecker.org para verificar a propagação!

1. Acesse: https://dnschecker.org
2. Digite: `trabalheconoscofg.com.br`
3. Veja se os registros A e CNAME aparecem

---

## 🧪 TESTAR O DOMÍNIO

### 1️⃣ Teste básico:

```bash
# Verificar registro A
nslookup trabalheconoscofg.com.br

# Verificar CNAME do www
nslookup www.trabalheconoscofg.com.br
```

### 2️⃣ Teste no navegador:

Depois da propagação, acesse:

- ✅ http://trabalheconoscofg.com.br (deve redirecionar para HTTPS)
- ✅ https://trabalheconoscofg.com.br (deve funcionar)
- ✅ https://www.trabalheconoscofg.com.br (deve funcionar)

---

## 🚨 TROUBLESHOOTING

### ❌ Erro: "Invalid Configuration"

**Solução:**
- Verifique se os registros DNS estão corretos no Registro.br
- Aguarde mais tempo (propagação pode demorar)
- Use dnschecker.org para confirmar

### ❌ Erro: "Domain is already in use"

**Solução:**
- O domínio já está conectado a outro projeto Vercel
- Remova do projeto antigo primeiro

### ❌ Domínio não carrega (ERR_NAME_NOT_RESOLVED)

**Solução:**
- DNS ainda não propagou
- Verifique registros no Registro.br
- Limpe cache DNS: `ipconfig /flushdns` (Windows)

### ❌ Certificado SSL não ativa

**Solução:**
- Aguarde 10-15 minutos após verificação DNS
- No Vercel, vá em Settings > Domains e force renovação
- Vercel gera SSL automaticamente após DNS validar

---

## 📝 CHECKLIST FINAL

### No Registro.br:
- [ ] Registro A criado apontando para 76.76.21.21
- [ ] Registro CNAME (www) criado apontando para cname.vercel-dns.com
- [ ] Configurações salvas

### No Vercel:
- [ ] Domínio adicionado em Settings > Domains
- [ ] Verificação DNS concluída (✅ Valid Configuration)
- [ ] SSL/HTTPS ativo
- [ ] Domínio principal definido

### Testes:
- [ ] https://trabalheconoscofg.com.br carrega
- [ ] https://www.trabalheconoscofg.com.br carrega
- [ ] HTTP redireciona para HTTPS
- [ ] Certificado SSL válido (cadeado verde)

---

## 🎯 VALORES EXATOS PARA COPIAR

### Registro A:
```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600
```

### Registro CNAME:
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

---

## 🔗 LINKS ÚTEIS

- **Registro.br:** https://registro.br
- **Painel Vercel:** https://vercel.com/dashboard
- **Verificar DNS:** https://dnschecker.org
- **Verificar SSL:** https://www.ssllabs.com/ssltest/

---

## 📸 PRINT DAS TELAS (Referência)

### Vercel - Adicionar Domínio:
```
Settings → Domains → Add
┌─────────────────────────────────┐
│ trabalheconoscofg.com.br        │ [Add]
└─────────────────────────────────┘
```

### Registro.br - DNS:
```
Zona DNS
┌────────────────────────────────────────────┐
│ Tipo │ Host │ Valor            │ TTL      │
├──────┼──────┼──────────────────┼──────────┤
│  A   │  @   │ 76.76.21.21      │ 3600     │
│ CNAME│ www  │cname.vercel-dns  │ 3600     │
└────────────────────────────────────────────┘
```

---

## ⏭️ PRÓXIMOS PASSOS

Depois que o domínio estiver funcionando:

1. ✅ **Atualizar Google Analytics** (se tiver)
2. ✅ **Atualizar Google Search Console**
3. ✅ **Atualizar links de redes sociais**
4. ✅ **Testar todos os links internos**
5. ✅ **Compartilhar novo domínio no LinkedIn!** 🎉

---

## 🎉 PRONTO!

Quando tudo estiver funcionando, você terá:

✅ **Domínio profissional:** trabalheconoscofg.com.br  
✅ **HTTPS automático** (cadeado verde)  
✅ **WWW funcional**  
✅ **Redirecionamento automático**  
✅ **Certificado SSL válido**  

---

**Seu site ficou ainda mais profissional! 🚀**

---

## 📞 SUPORTE

**Dúvidas sobre Registro.br:**
- Telefone: 11 5509-3500
- Email: info@registro.br
- FAQ: https://registro.br/faq

**Dúvidas sobre Vercel:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Support: https://vercel.com/support

---

**Boa sorte com a configuração! 🎊**

