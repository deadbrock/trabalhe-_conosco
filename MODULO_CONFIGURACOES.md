# ⚙️ Módulo de Configurações - Sistema Astron

## 🎯 Funcionalidades Implementadas

Módulo completo de **Configurações** com edição de perfil, upload de foto e alteração de senha!

---

## ✨ Recursos do Módulo:

### 1. **📸 Foto de Perfil**
- ✅ Upload de foto (até 5MB)
- ✅ Redimensionamento automático (400x400px)
- ✅ Crop inteligente focado no rosto
- ✅ Otimização de qualidade
- ✅ Armazenamento no Cloudinary
- ✅ Remoção de foto
- ✅ Substituição automática (deleta foto antiga)

### 2. **👤 Dados do Perfil**
- ✅ Editar nome completo
- ✅ Editar telefone
- ✅ Editar cargo
- ✅ Email (apenas visualização - não editável)
- ✅ Validações de campos
- ✅ Atualização em tempo real

### 3. **🔐 Alterar Senha**
- ✅ Verificação de senha atual
- ✅ Validação de senha nova (mínimo 6 caracteres)
- ✅ Confirmação de senha
- ✅ Feedback visual de erros
- ✅ Hash seguro com bcrypt

---

## 📁 Arquivos Criados/Modificados:

### **Backend:**

#### 1. `src/routes/perfil.ts` ✨ NOVO
Rotas de perfil:
- `GET /perfil` - Obter dados do usuário
- `PUT /perfil` - Atualizar dados
- `POST /perfil/foto` - Upload de foto
- `DELETE /perfil/foto` - Remover foto
- `PUT /perfil/senha` - Alterar senha

#### 2. `src/migrations/add_usuario_perfil_fields.sql` ✨ NOVO
Adiciona campos:
- `foto_perfil` (TEXT) - URL da foto no Cloudinary
- `telefone` (VARCHAR(20)) - Telefone do usuário
- `cargo` (VARCHAR(100)) - Cargo/função
- `data_atualizacao` (TIMESTAMP) - Última atualização

#### 3. `src/index.ts` ✅ MODIFICADO
- Importa e registra rota `/perfil`

---

### **Frontend:**

#### 1. `pages/rh/configuracoes.tsx` ✨ NOVO
Página completa de configurações com:
- Card de foto de perfil
- Abas: Dados do Perfil | Alterar Senha
- Formulários validados
- Upload de imagem com preview
- Estados de loading

#### 2. `components/RHLayout.tsx` ✅ MODIFICADO
- Adiciona link "Configurações" no menu
- Ícone: ⚙️ Settings

---

## 🗄️ Estrutura do Banco de Dados:

### Tabela `usuarios` (campos adicionados):

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `foto_perfil` | TEXT | URL da foto no Cloudinary |
| `telefone` | VARCHAR(20) | Telefone de contato |
| `cargo` | VARCHAR(100) | Cargo/função do usuário |
| `data_atualizacao` | TIMESTAMP | Data da última atualização |

---

## 🚀 Como Usar:

### **1. Executar Migração (Backend):**

```bash
cd trabalhe-_conosco_server

# Criar o arquivo SQL de migração manualmente ou executar:
psql $DATABASE_URL -f src/migrations/add_usuario_perfil_fields.sql

# OU criar um script de migração:
npm run migrate:perfil
```

**Conteúdo do script (se criar):**
```typescript
// src/migrate-perfil.ts
import { pool } from "./db";
import fs from "fs";
import path from "path";

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, "migrations/add_usuario_perfil_fields.sql"),
    "utf-8"
  );
  await pool.query(sql);
  console.log("✅ Migração de perfil concluída!");
}

migrate().catch(console.error).finally(() => process.exit());
```

---

### **2. Reiniciar Servidores:**

**Backend:**
```bash
cd trabalhe-_conosco_server
npm run dev
```

**Frontend:**
```bash
cd trabalhe-_conosco
npm run dev
```

---

### **3. Acessar Configurações:**

1. Faça login no sistema RH
2. Clique em **"⚙️ Configurações"** no menu
3. Edite seu perfil!

---

## 🎨 Interface:

### **Card de Foto de Perfil:**
```
┌─────────────────────────────────────────┐
│  [Avatar]   Nome do Usuário             │
│   (foto)    email@exemplo.com           │
│             👤 Usuário RH                │
│                                          │
│             [📷 Alterar Foto]            │
│             [🗑️ Remover]                │
└─────────────────────────────────────────┘
```

### **Abas:**
```
┌──────────────────┬──────────────────┐
│ 👤 Dados Perfil  │ 🔐 Alterar Senha │
└──────────────────┴──────────────────┘
```

### **Formulário de Perfil:**
```
Nome Completo *
[👤 ___________________________]

Email
[📧 email@exemplo.com] (desabilitado)

Telefone              Cargo
[📞 _____________]   [💼 _____________]

              [❌ Cancelar] [💾 Salvar]
```

### **Formulário de Senha:**
```
Senha Atual *
[🔒 ___________________________]

Nova Senha *
[🔒 ___________________________]

Confirmar Nova Senha *
[🔒 ___________________________]

              [❌ Cancelar] [🔐 Alterar Senha]
```

---

## 🔒 Segurança:

### **Backend:**
- ✅ Rotas protegidas com `requireAuth`
- ✅ Validação de token JWT
- ✅ Senha hasheada com bcrypt (10 rounds)
- ✅ Verificação de senha atual antes de alterar
- ✅ Validação de tipos de arquivo (apenas imagens)
- ✅ Limite de tamanho (5MB)

### **Frontend:**
- ✅ Token armazenado no localStorage
- ✅ Validações de formulário
- ✅ Confirmação de senha
- ✅ Feedback visual de erros
- ✅ Estados de loading

---

## 📸 Upload de Foto:

### **Processo:**
1. Usuário seleciona imagem
2. Validação (tipo + tamanho)
3. Upload para Cloudinary
4. Transformações aplicadas:
   - Redimensionar: 400x400px
   - Crop: focado no rosto
   - Qualidade: auto (otimizada)
   - Formato: auto (WebP se suportado)
5. URL salva no banco
6. Foto antiga deletada do Cloudinary

### **Transformações Cloudinary:**
```typescript
transformation: [
  { width: 400, height: 400, crop: "fill", gravity: "face" },
  { quality: "auto:good" },
  { fetch_format: "auto" }
]
```

---

## 🧪 Testes:

### **Teste 1: Upload de Foto**
1. Acesse Configurações
2. Clique em "📷 Adicionar Foto"
3. Selecione uma imagem
4. Aguarde upload
5. Verifique foto atualizada ✅

### **Teste 2: Editar Perfil**
1. Altere nome, telefone, cargo
2. Clique em "💾 Salvar"
3. Verifique dados atualizados ✅
4. Verifique nome no menu ✅

### **Teste 3: Alterar Senha**
1. Vá na aba "🔐 Alterar Senha"
2. Digite senha atual
3. Digite nova senha (2x)
4. Clique em "🔐 Alterar Senha"
5. Faça logout e login com nova senha ✅

### **Teste 4: Remover Foto**
1. Clique em "🗑️ Remover"
2. Confirme
3. Verifique avatar padrão ✅

---

## 🐛 Troubleshooting:

### **Erro: "Nenhuma foto foi enviada"**
**Causa:** Arquivo não foi selecionado  
**Solução:** Selecione uma imagem válida

### **Erro: "Apenas imagens são permitidas"**
**Causa:** Arquivo não é imagem  
**Solução:** Selecione JPG, PNG, GIF ou WebP

### **Erro: "A imagem deve ter no máximo 5MB"**
**Causa:** Arquivo muito grande  
**Solução:** Comprima a imagem ou escolha outra

### **Erro: "Senha atual incorreta"**
**Causa:** Senha digitada está errada  
**Solução:** Digite a senha correta

### **Erro: "As senhas não coincidem"**
**Causa:** Nova senha e confirmação diferentes  
**Solução:** Digite a mesma senha nos dois campos

---

## 📊 API Endpoints:

### **GET /perfil**
Retorna dados do usuário logado

**Response:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "perfil": "admin",
  "foto_perfil": "https://res.cloudinary.com/...",
  "telefone": "(11) 99999-9999",
  "cargo": "Analista de RH",
  "criado_em": "2025-01-01T00:00:00Z",
  "data_atualizacao": "2025-12-25T12:00:00Z"
}
```

---

### **PUT /perfil**
Atualiza dados do perfil

**Request:**
```json
{
  "nome": "João Silva Santos",
  "telefone": "(11) 98888-8888",
  "cargo": "Coordenador de RH"
}
```

**Response:** Mesmo formato do GET

---

### **POST /perfil/foto**
Upload de foto de perfil

**Request:** `multipart/form-data`
- `foto`: arquivo de imagem

**Response:** Mesmo formato do GET

---

### **DELETE /perfil/foto**
Remove foto de perfil

**Response:** Mesmo formato do GET (foto_perfil = null)

---

### **PUT /perfil/senha**
Altera senha do usuário

**Request:**
```json
{
  "senhaAtual": "senha123",
  "novaSenha": "novaSenha456"
}
```

**Response:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## ✅ Checklist de Implementação:

- [x] Migração do banco de dados
- [x] Rotas backend (GET, PUT, POST, DELETE)
- [x] Upload de foto com Cloudinary
- [x] Validações de segurança
- [x] Página de configurações frontend
- [x] Formulário de perfil
- [x] Formulário de senha
- [x] Upload de foto com preview
- [x] Link no menu RH
- [x] Responsividade mobile
- [x] Estados de loading
- [x] Tratamento de erros
- [x] Documentação completa

---

## 🎉 Resultado Final:

✅ Módulo de Configurações completo e funcional!  
✅ Upload de foto de perfil com Cloudinary  
✅ Edição de dados pessoais  
✅ Alteração de senha segura  
✅ Interface moderna e responsiva  
✅ Validações e segurança implementadas  

---

**Implementado com sucesso em 25/12/2025! 🎄**

**Feliz Natal! 🎅**

