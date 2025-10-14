# 🔧 Configuração do Backend - Passo a Passo

## ❌ Erro Atual
Se você está vendo o erro `500 (Internal Server Error)` no login, é porque o backend ainda não está configurado ou não está rodando.

## ✅ Solução Completa

### **Opção 1: Testar sem Backend (Modo Demo)**

Vou criar um modo demo que permite testar o painel sem backend.

### **Opção 2: Configurar Backend Completo**

#### Passo 1: Instalar PostgreSQL

1. Baixe o PostgreSQL: https://www.postgresql.org/download/
2. Instale e configure com:
   - **Usuário:** postgres
   - **Senha:** (escolha uma senha)
   - **Porta:** 5432

#### Passo 2: Criar Banco de Dados

Abra o pgAdmin ou terminal e execute:

```sql
CREATE DATABASE trabalhe_conosco;
```

#### Passo 3: Configurar Variáveis de Ambiente

Na pasta `server`, crie um arquivo `.env`:

```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/trabalhe_conosco
JWT_SECRET=sua-chave-secreta-super-segura
PORT=3333
```

**Substitua:**
- `SUA_SENHA` pela senha do PostgreSQL
- `sua-chave-secreta-super-segura` por qualquer string aleatória

#### Passo 4: Executar Configuração

```bash
# Entre na pasta do servidor
cd server

# Instale as dependências
npm install

# Execute as migrações (cria as tabelas)
npm run migrate

# Crie o usuário admin
npm run seed

# Inicie o servidor
npm run dev
```

Você verá:
```
✅ Usuário administrador criado com sucesso!
📧 Email: admin@fgservices.com
🔑 Senha: admin123
API listening on http://localhost:3333
```

#### Passo 5: Testar Login

Agora acesse: http://localhost:3000/rh/login

---

## 🚀 Próximo Deploy

Após configurar localmente, você pode fazer deploy do backend no:
- Heroku
- Railway
- Render
- Vercel (precisa de adaptações para serverless)

---

## 🆘 Ainda com Problemas?

Se o erro persistir, me envie:
1. A mensagem de erro completa do console
2. Se o PostgreSQL está instalado
3. Se o servidor está rodando (você vê "API listening" no terminal?)

