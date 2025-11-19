# 🔗 Integração com Sistema FGS (Admissão)

## 📋 Visão Geral

Esta integração permite enviar **candidatos aprovados** do sistema "Trabalhe Conosco FG" diretamente para o **sistema FGS** (FG Services - Admissão), transferindo todos os dados pessoais, documentos e informações da vaga.

---

## ✅ O Que Foi Implementado

### 1. **Backend - Endpoint de Integração**
- **Rota:** `POST /candidatos/:id/enviar-fgs`
- **Autenticação:** Requer JWT (apenas usuários RH)
- **Validação:** Apenas candidatos com status `aprovado` podem ser enviados

### 2. **Frontend - Botão "Enviar para Admissão"**
- Aparece automaticamente quando um candidato está **aprovado**
- Localizado no modal de detalhes do candidato
- Feedback visual com loading e mensagens de sucesso/erro

### 3. **Serviço de Integração**
- Arquivo: `server/src/services/fgsService.ts`
- Busca dados completos do candidato
- Prepara payload formatado para o FGS
- Faz requisição HTTP para o sistema FGS

---

## 🔧 Configuração Necessária

### **Variáveis de Ambiente (Railway/Backend)**

Adicione estas variáveis no Railway (ou `.env` local):

```bash
# URL do endpoint do sistema FGS que receberá os dados
FGS_API_URL=https://seu-sistema-fgs.com/api/admissao/candidatos

# API Key para autenticação (opcional, mas recomendado)
FGS_API_KEY=sua-api-key-secreta-aqui
```

---

## 📦 Formato de Dados Enviados

O sistema envia os seguintes dados para o FGS:

```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15",
  
  "endereco": {
    "estado": "SP",
    "cidade": "São Paulo",
    "bairro": "Centro"
  },
  
  "documentos": {
    "curriculo_url": "https://res.cloudinary.com/.../curriculo.pdf"
  },
  
  "vaga": {
    "id": 1,
    "titulo": "Desenvolvedor Full Stack"
  },
  
  "origem": "trabalhe_conosco",
  "candidato_id_origem": 42,
  "data_cadastro": "2025-01-15T10:30:00Z"
}
```

---

## 🎯 Como Adaptar o Sistema FGS

### **1. Criar Endpoint no FGS**

No sistema FGS, crie um endpoint que receba os dados:

```typescript
// Exemplo: FGS Backend (Express/Node.js)
app.post('/api/admissao/candidatos', async (req, res) => {
  try {
    const {
      nome,
      cpf,
      email,
      telefone,
      data_nascimento,
      endereco,
      documentos,
      vaga,
      origem,
      candidato_id_origem,
      data_cadastro
    } = req.body;
    
    // Validar dados
    if (!nome || !cpf || !email) {
      return res.status(400).json({ 
        error: 'Dados obrigatórios faltando' 
      });
    }
    
    // Salvar no banco de dados do FGS
    const novoFuncionario = await db.funcionarios.create({
      nome,
      cpf,
      email,
      telefone,
      data_nascimento,
      estado: endereco?.estado,
      cidade: endereco?.cidade,
      bairro: endereco?.bairro,
      curriculo_url: documentos?.curriculo_url,
      vaga_id: vaga?.id,
      vaga_titulo: vaga?.titulo,
      origem_sistema: origem,
      candidato_id_origem: candidato_id_origem,
      data_cadastro_origem: data_cadastro,
      status: 'aguardando_admissao'
    });
    
    res.json({
      success: true,
      message: 'Candidato recebido com sucesso',
      funcionario_id: novoFuncionario.id
    });
  } catch (error) {
    console.error('Erro ao receber candidato:', error);
    res.status(500).json({ 
      error: 'Erro ao processar candidato',
      message: error.message 
    });
  }
});
```

### **2. Autenticação (Opcional mas Recomendado)**

Se você configurou `FGS_API_KEY`, valide no FGS:

```typescript
// Middleware de autenticação no FGS
const validarApiKey = (req, res, next) => {
  const apiKey = req.headers['authorization']?.replace('Bearer ', '') 
              || req.headers['x-api-key'];
  
  if (apiKey !== process.env.FGS_API_KEY) {
    return res.status(401).json({ 
      error: 'API Key inválida' 
    });
  }
  
  next();
};

app.post('/api/admissao/candidatos', validarApiKey, async (req, res) => {
  // ... código acima
});
```

### **3. Estrutura de Banco de Dados no FGS**

Crie uma tabela para receber os candidatos:

```sql
CREATE TABLE funcionarios_admissao (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT,
  data_nascimento DATE,
  estado TEXT,
  cidade TEXT,
  bairro TEXT,
  curriculo_url TEXT,
  vaga_id INTEGER,
  vaga_titulo TEXT,
  origem_sistema TEXT DEFAULT 'trabalhe_conosco',
  candidato_id_origem INTEGER,
  data_cadastro_origem TIMESTAMP,
  status TEXT DEFAULT 'aguardando_admissao',
  criado_em TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Como Usar

### **No Painel RH:**

1. Acesse **Candidatos** → Selecione uma vaga
2. Clique no candidato para ver detalhes
3. Se o candidato estiver **aprovado**, aparecerá o botão:
   - **📤 Enviar para Admissão (FGS)**
4. Clique no botão e confirme
5. O sistema enviará todos os dados para o FGS

---

## 🔍 Testando a Integração

### **1. Teste Local (Desenvolvimento)**

```bash
# No backend do "Trabalhe Conosco"
cd server
npm run dev

# Configure no .env:
FGS_API_URL=http://localhost:4000/api/admissao/candidatos
FGS_API_KEY=test-key-123
```

### **2. Teste com Postman/Insomnia**

```http
POST http://localhost:3333/candidatos/1/enviar-fgs
Authorization: Bearer SEU_JWT_TOKEN
```

### **3. Verificar Logs**

O backend loga todas as tentativas:

```
📤 Enviando candidato para FGS: { candidato_id: 1, nome: "João Silva" }
✅ Candidato enviado com sucesso para FGS: { funcionario_id: 42 }
```

---

## ⚠️ Tratamento de Erros

O sistema trata os seguintes erros:

1. **Candidato não encontrado** → 404
2. **Candidato não está aprovado** → 400
3. **FGS_API_URL não configurada** → 500
4. **Erro de conexão com FGS** → 500 (com mensagem específica)
5. **Erro na API do FGS** → 500 (com resposta do FGS)

---

## 🔄 Fluxo Completo

```
1. RH aprova candidato
   ↓
2. Status muda para "aprovado"
   ↓
3. Botão "Enviar para Admissão" aparece
   ↓
4. RH clica no botão
   ↓
5. Sistema busca dados completos do candidato
   ↓
6. Sistema prepara payload formatado
   ↓
7. Sistema faz POST para FGS_API_URL
   ↓
8. FGS recebe e processa os dados
   ↓
9. FGS retorna sucesso/erro
   ↓
10. Sistema mostra feedback ao RH
```

---

## 📝 Personalização

### **Alterar Formato do Payload**

Edite `server/src/services/fgsService.ts` na função `enviarParaFGS()`:

```typescript
// Personalize o payload conforme necessário
const payload = {
  // Seus campos customizados aqui
  nome_completo: dadosCandidato.nome,
  documento: dadosCandidato.cpf,
  // ...
};
```

### **Adicionar Mais Dados**

Se você quiser enviar dados adicionais (comentários, notas, etc.), edite:

1. `fgsService.ts` → função `buscarDadosCandidato()` para buscar dados extras
2. `fgsService.ts` → função `enviarParaFGS()` para incluir no payload

---

## 🆘 Troubleshooting

### **Erro: "FGS_API_URL não configurada"**
- ✅ Verifique se a variável `FGS_API_URL` está configurada no Railway
- ✅ Faça redeploy do backend após adicionar a variável

### **Erro: "Erro de conexão com o sistema FGS"**
- ✅ Verifique se o FGS está online e acessível
- ✅ Verifique se a URL está correta (sem barra no final)
- ✅ Teste a URL manualmente no navegador/Postman

### **Erro: "API Key inválida"**
- ✅ Verifique se `FGS_API_KEY` está configurada corretamente
- ✅ Verifique se o FGS está validando a API key corretamente

### **Candidato não aparece como aprovado**
- ✅ Verifique se o status está exatamente como `"aprovado"` (minúsculas)
- ✅ Recarregue a página após aprovar

---

## 📞 Suporte

Se precisar de ajuda para adaptar o sistema FGS, entre em contato ou consulte a documentação do FGS.

---

## 🎉 Pronto!

A integração está completa e pronta para uso. Basta configurar as variáveis de ambiente e adaptar o endpoint no sistema FGS!

