# 🔐 Acesso ao Painel de Gestão RH

## Credenciais Padrão

Para acessar o painel de gestão do RH, use as seguintes credenciais:

**📧 Email:** `admin@fgservices.com`  
**🔑 Senha:** `admin123`

## 🌐 URLs de Acesso

- **Login RH:** https://trabalhe-conosco.vercel.app/rh/login
- **Dashboard:** https://trabalhe-conosco.vercel.app/rh
- **Gerenciar Vagas:** https://trabalhe-conosco.vercel.app/rh/vagas
- **Candidatos:** https://trabalhe-conosco.vercel.app/rh/candidatos

## ⚙️ Configuração do Banco de Dados (Primeira Vez)

Se você estiver rodando o backend localmente, precisa criar o usuário administrador:

### 1. Entre na pasta do servidor:
```bash
cd server
```

### 2. Instale as dependências (se ainda não instalou):
```bash
npm install
```

### 3. Execute as migrações do banco de dados:
```bash
npm run migrate
```

### 4. Crie o usuário administrador:
```bash
npm run seed
```

Você verá a mensagem:
```
✅ Usuário administrador criado com sucesso!
📧 Email: admin@fgservices.com
🔑 Senha: admin123
```

### 5. Inicie o servidor:
```bash
npm run dev
```

## 🔒 Segurança

⚠️ **IMPORTANTE:** Após o primeiro login, recomenda-se alterar a senha padrão para maior segurança.

## 📱 Funcionalidades Disponíveis

✅ Publicar e gerenciar vagas  
✅ Visualizar candidaturas  
✅ Ativar/Desativar vagas  
✅ Editar informações das vagas  
✅ Visualizar métricas e dashboard  
✅ Buscar e filtrar vagas  

## 🆘 Problemas de Acesso?

Se não conseguir fazer login:

1. Verifique se o backend está rodando
2. Verifique se executou o comando `npm run seed`
3. Confirme que o banco de dados PostgreSQL está ativo
4. Verifique as credenciais (copie e cole para evitar erros de digitação)

## 👥 Criar Mais Usuários

Para criar mais usuários RH, você pode:

1. Acessar o banco de dados PostgreSQL diretamente
2. Ou criar um endpoint de registro (futura implementação)

---

© 2025 FG Services - Sistema de Recrutamento e Seleção

