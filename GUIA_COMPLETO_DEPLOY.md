# 🚀 GUIA COMPLETO - DEPLOY E CONFIGURAÇÃO

## 📋 ÍNDICE
1. [Requisitos](#requisitos)
2. [Configuração do Backend](#configuração-do-backend)
3. [Configuração do Frontend](#configuração-do-frontend)
4. [Deploy](#deploy)
5. [Testando o Sistema](#testando-o-sistema)
6. [Fluxo Completo](#fluxo-completo)

---

## 1. REQUISITOS

### Backend:
- **Node.js** (v18 ou superior)
- **PostgreSQL** (v14 ou superior)
- **npm** ou **yarn**

### Frontend:
- **Node.js** (v18 ou superior)
- **npm** ou **yarn**

---

## 2. CONFIGURAÇÃO DO BACKEND

### Passo 1: Criar Banco de Dados PostgreSQL

```sql
-- Conecte no PostgreSQL e execute:
CREATE DATABASE trabalhe_conosco;
```

### Passo 2: Configurar Variáveis de Ambiente

Crie o arquivo **`.env`** na pasta `server/`:

```env
# Configuração do Banco de Dados PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha_aqui
PGDATABASE=trabalhe_conosco

# Porta da API
PORT=3333

# JWT Secret (use uma string aleatória e segura)
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456
```

### Passo 3: Instalar Dependências

```bash
cd server
npm install
```

### Passo 4: Executar Migração (Criar Tabelas)

```bash
npm run migrate
```

**Saída esperada:**
```
Migração concluída com sucesso
```

### Passo 5: Criar Usuário Administrador

```bash
npm run seed
```

**Saída esperada:**
```
✅ Usuário admin criado com sucesso!
```

**Credenciais padrão:**
- **Email:** `admin@fgservices.com`
- **Senha:** `admin123`

### Passo 6: Iniciar o Backend

```bash
npm run dev
```

**Saída esperada:**
```
API listening on http://localhost:3333
```

---

## 3. CONFIGURAÇÃO DO FRONTEND

### Passo 1: Configurar Variáveis de Ambiente

Crie o arquivo **`.env.local`** na raiz do projeto frontend:

```env
# URL da API Backend
NEXT_PUBLIC_API_BASE=http://localhost:3333
```

**Para produção:**
```env
NEXT_PUBLIC_API_BASE=https://sua-api-backend.com
```

### Passo 2: Instalar Dependências

```bash
npm install
```

### Passo 3: Iniciar o Frontend

```bash
npm run dev
```

**Saída esperada:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 4. DEPLOY

### 🔵 OPÇÃO 1: Deploy no Vercel (Frontend)

#### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

#### Passo 2: Login no Vercel
```bash
vercel login
```

#### Passo 3: Deploy
```bash
vercel --prod
```

#### Passo 4: Configurar Variável de Ambiente
No painel da Vercel:
1. Vá em **Settings** > **Environment Variables**
2. Adicione:
   - **Key:** `NEXT_PUBLIC_API_BASE`
   - **Value:** URL do seu backend (ex: `https://sua-api.railway.app`)

---

### 🟣 OPÇÃO 2: Deploy no Railway (Backend)

#### Passo 1: Criar conta no Railway.app

#### Passo 2: Criar novo projeto
- Clique em **"New Project"**
- Escolha **"Deploy from GitHub repo"**

#### Passo 3: Configurar Banco de Dados
- No projeto, clique em **"New"** > **"Database"** > **"Add PostgreSQL"**
- O Railway criará automaticamente as variáveis `PGHOST`, `PGPORT`, etc.

#### Passo 4: Configurar Variáveis Adicionais
Adicione no Railway:
```
JWT_SECRET=sua_chave_secreta_aqui
PORT=3333
```

#### Passo 5: Deploy
- Railway fará deploy automático
- Copie a URL pública gerada (ex: `https://trabalhe-conosco.up.railway.app`)

#### Passo 6: Executar Migração e Seed
No Railway Terminal:
```bash
npm run migrate
npm run seed
```

---

### 🟢 OPÇÃO 3: Deploy no Render (Backend)

#### Passo 1: Criar conta no Render.com

#### Passo 2: Criar Web Service
- Clique em **"New"** > **"Web Service"**
- Conecte seu repositório GitHub

#### Passo 3: Configurar Build Command
```bash
cd server && npm install && npm run build
```

#### Passo 4: Configurar Start Command
```bash
cd server && npm start
```

#### Passo 5: Adicionar PostgreSQL
- Clique em **"New"** > **"PostgreSQL"**
- Conecte ao Web Service

#### Passo 6: Configurar Variáveis
```
JWT_SECRET=sua_chave_secreta_aqui
PORT=3333
```

---

## 5. TESTANDO O SISTEMA

### ✅ TESTE 1: Backend funcionando

```bash
curl http://localhost:3333/health
```

**Resposta esperada:**
```json
{"status":"ok"}
```

### ✅ TESTE 2: Login RH

1. Acesse: `http://localhost:3000/rh/login`
2. Use:
   - **Email:** `admin@fgservices.com`
   - **Senha:** `admin123`
3. Deve redirecionar para o dashboard

### ✅ TESTE 3: Criar Vaga

1. No painel RH, vá em **"Vagas"**
2. Clique em **"Nova Vaga"**
3. Preencha:
   - **Título:** Auxiliar de Limpeza
   - **Tipo de Contrato:** CLT
   - **Endereço:** São Paulo - SP
   - **Descrição:** Vaga para auxiliar de limpeza
   - **Requisitos:** Ensino médio completo
4. Clique em **"Salvar"**

### ✅ TESTE 4: Candidatura Pública

1. Acesse: `http://localhost:3000`
2. Clique em **"Ver Detalhes"** de uma vaga
3. Preencha o formulário com seus dados
4. Anexe um PDF (currículo)
5. Clique em **"Enviar Candidatura"**
6. Deve exibir mensagem de sucesso

### ✅ TESTE 5: Verificar Candidato no Painel RH

1. Volte ao painel RH
2. Vá em **"Candidatos"**
3. Deve aparecer o candidato que você cadastrou
4. Clique em **"Ver Detalhes"**
5. Teste mudar o status

---

## 6. FLUXO COMPLETO

### 📊 FLUXO DE CANDIDATURA:

```
┌─────────────────────────────────────────────────────────┐
│ 1. CANDIDATO (Site Público)                            │
│    ↓                                                    │
│    • Acessa site: trabalhe-conosco.vercel.app          │
│    • Vê vagas disponíveis                              │
│    • Clica em "Ver Detalhes"                           │
│    • Preenche formulário:                              │
│      - Nome, CPF, Data Nascimento                      │
│      - Email, Telefone                                 │
│      - Estado, Cidade, Bairro                          │
│      - Anexa Currículo (PDF)                           │
│    • Clica em "Enviar Candidatura"                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 2. BACKEND (API)                                        │
│    ↓                                                    │
│    • POST /candidatos (público, sem auth)              │
│    • Salva arquivo no /uploads                         │
│    • Insere candidato no PostgreSQL                    │
│    • Status inicial: "novo"                            │
│    • Retorna status 201 Created                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ 3. PAINEL RH (Autenticado)                             │
│    ↓                                                    │
│    • RH faz login em /rh/login                         │
│    • Vê dashboard com métricas                         │
│    • Acessa "Candidatos"                               │
│    • Vê lista com:                                     │
│      - Nome, Email, Telefone                           │
│      - Estado, Cidade, Bairro                          │
│      - Status atual                                    │
│      - Link para WhatsApp                              │
│      - Botão para baixar currículo                     │
│    • Pode filtrar por:                                 │
│      - Status                                          │
│      - Localização (Estado, Cidade, Bairro)            │
│      - Proximidade                                     │
│    • Pode alterar status:                              │
│      - Novo → Em Análise → Entrevista → Aprovado      │
│      - Ou → Reprovado / Banco de Talentos             │
│    • Pode usar Kanban (drag & drop)                    │
│    • Pode enviar Email ou WhatsApp                     │
└─────────────────────────────────────────────────────────┘
```

### 🔄 FLUXO DE STATUS:

```
novo
  ↓
em_analise (RH analisa currículo)
  ↓
entrevista (RH agenda entrevista)
  ↓
┌─────────┬──────────────┬──────────────────┐
│         │              │                  │
▼         ▼              ▼                  ▼
aprovado  reprovado      banco_talentos     novo (nova vaga)
```

### 🎯 ENDPOINTS DA API:

#### **Públicos (sem autenticação):**
- `GET /health` - Health check
- `POST /auth/login` - Login do RH
- `GET /vagas?status=ativa` - Listar vagas ativas
- `POST /candidatos` - Enviar candidatura

#### **Privados (requer token JWT):**
- `POST /vagas` - Criar vaga
- `PUT /vagas/:id` - Editar vaga
- `DELETE /vagas/:id` - Deletar vaga
- `GET /candidatos` - Listar todos candidatos
- `GET /candidatos/:vagaId` - Listar candidatos de uma vaga
- `PUT /candidatos/:id` - Atualizar status do candidato
- `GET /metrics` - Métricas do dashboard

---

## 7. ESTRUTURA DO BANCO DE DADOS

### Tabela: `vagas`
```sql
CREATE TABLE vagas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  tipo_contrato TEXT NOT NULL,
  endereco TEXT NOT NULL,
  descricao TEXT,
  requisitos TEXT,
  diferenciais TEXT,
  status TEXT DEFAULT 'ativa', -- 'ativa' ou 'inativa'
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `candidatos`
```sql
CREATE TABLE candidatos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  data_nascimento DATE,
  email TEXT NOT NULL,
  telefone TEXT,
  estado TEXT,
  cidade TEXT,
  bairro TEXT,
  curriculo TEXT, -- nome do arquivo
  vaga_id INTEGER REFERENCES vagas(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'novo', -- 'novo', 'em_analise', 'entrevista', 'aprovado', 'reprovado', 'banco_talentos'
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `usuarios`
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  perfil TEXT NOT NULL -- 'admin' ou 'rh'
);
```

---

## 8. MODO DEMO (Sem Backend)

O sistema possui um **MODO DEMO** que funciona sem backend:

### Como usar:
1. No login RH, use:
   - **Email:** `admin@fgservices.com`
   - **Senha:** `admin123`
2. O sistema usará dados mockados
3. Perfeito para demonstrações e testes de UI

### Limitações do modo demo:
- ❌ Não salva dados permanentemente
- ❌ Não envia emails reais
- ❌ Não faz upload de arquivos
- ✅ Simula todas as funcionalidades visuais
- ✅ Perfeito para apresentações

---

## 9. TROUBLESHOOTING

### ❌ Erro: "Cannot connect to database"
**Solução:**
- Verifique se o PostgreSQL está rodando
- Confira as credenciais no `.env`
- Teste a conexão:
```bash
psql -h localhost -U postgres -d trabalhe_conosco
```

### ❌ Erro: "JWT secret not configured"
**Solução:**
- Adicione `JWT_SECRET` no `.env`
```env
JWT_SECRET=minha_chave_super_secreta_123
```

### ❌ Erro: "Unauthorized" no painel RH
**Solução:**
- Faça logout e login novamente
- Limpe o localStorage do navegador
- Verifique se o token JWT está válido

### ❌ Erro: "Network error" ao enviar candidatura
**Solução:**
- Verifique se o backend está rodando
- Confirme a variável `NEXT_PUBLIC_API_BASE`
- Teste o endpoint:
```bash
curl http://localhost:3333/health
```

### ❌ Upload de currículo não funciona
**Solução:**
- Crie a pasta `uploads/` no servidor:
```bash
cd server
mkdir uploads
chmod 755 uploads
```

---

## 10. SEGURANÇA

### 🔒 Checklist de Segurança para Produção:

- [ ] Alterar senha padrão do admin
- [ ] Usar JWT_SECRET forte (32+ caracteres aleatórios)
- [ ] Configurar CORS adequadamente
- [ ] Usar HTTPS (SSL/TLS)
- [ ] Validar todos os inputs
- [ ] Limitar tamanho de upload (max 5MB para PDFs)
- [ ] Implementar rate limiting
- [ ] Fazer backup do banco de dados regularmente
- [ ] Monitorar logs de erro
- [ ] Configurar variáveis de ambiente corretamente

---

## 11. SUPORTE

### 📧 Contato:
- **Email:** suporte@fgservices.com
- **GitHub:** [Abrir Issue](https://github.com/seu-repo/issues)

### 📚 Documentação Adicional:
- Ver: `ACESSO_RH.md` - Credenciais e URLs
- Ver: `SETUP_BACKEND.md` - Configuração detalhada do backend

---

## ✅ CHECKLIST FINAL - DEPLOY PRONTO

Antes de colocar em produção, confirme:

### Backend:
- [ ] PostgreSQL configurado
- [ ] Migrações executadas
- [ ] Usuário admin criado
- [ ] API respondendo em `/health`
- [ ] Variáveis de ambiente configuradas
- [ ] Pasta `uploads/` criada e com permissões

### Frontend:
- [ ] Variável `NEXT_PUBLIC_API_BASE` configurada
- [ ] Build funcionando (`npm run build`)
- [ ] Deploy realizado (Vercel/Netlify)
- [ ] Site acessível

### Testes:
- [ ] Login RH funciona
- [ ] Criar vaga funciona
- [ ] Candidatura pública funciona
- [ ] Candidato aparece no painel RH
- [ ] Alterar status funciona
- [ ] Upload de currículo funciona
- [ ] WhatsApp link funciona
- [ ] Filtros de localização funcionam
- [ ] Kanban drag & drop funciona
- [ ] Banco de Talentos funciona

---

## 🎉 PRONTO PARA PRODUÇÃO!

Se todos os itens acima estão checados, seu sistema está **PRONTO PARA RECEBER CANDIDATOS REAIS**! 🚀

**Boa sorte com o recrutamento!** 💼✨

