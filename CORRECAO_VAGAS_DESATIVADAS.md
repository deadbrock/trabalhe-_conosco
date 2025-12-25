# 🔧 Correção: Candidatos de Vagas Desativadas/Ocultadas

## ❌ **Problema Identificado:**

Quando uma vaga era **desativada** ou **ocultada**, os candidatos dessa vaga **não apareciam** na página de candidatos, impedindo a consulta e gestão dos mesmos.

---

## ✅ **Solução Implementada:**

### 1. **Frontend - Buscar TODAS as vagas** 

**Arquivo:** `pages/rh/candidatos/index.tsx`

**Antes:**
```typescript
const vagasData = await apiGet<Vaga[]>("/vagas?status=ativa", token);
```

**Depois:**
```typescript
const vagasData = await apiGet<Vaga[]>("/vagas?status=all", token);
```

**Resultado:** Agora busca TODAS as vagas (ativas, desativadas, ocultadas), permitindo visualizar candidatos de qualquer vaga.

---

### 2. **Visual: Badge de Status da Vaga**

**Adicionado badge visual nos cards das vagas:**

- 🟢 **Vaga Ativa** - Sem badge (padrão)
- 🚫 **Vaga Desativada** - Badge cinza: "🚫 Desativada"
- 👁️ **Vaga Oculta** - Badge laranja: "👁️ Oculta"

**Cores do ícone da vaga também mudam:**
- Ativa: Gradiente azul/vermelho
- Desativada: Cinza
- Oculta: Laranja

---

### 3. **Aviso Informativo**

**Quando uma vaga desativada/oculta é selecionada:**

```
ℹ️ Esta vaga está desativada. Os candidatos ainda podem ser consultados e gerenciados.

💡 Dica: Para excluir esta vaga sem perder os candidatos, mova todos para o "Banco de Talentos" primeiro.
```

---

### 4. **Proteção na Exclusão de Vagas**

**Arquivo:** `src/routes/vagas.ts`

**Nova lógica:**

1. Antes de excluir uma vaga, **verifica se há candidatos** não movidos para banco de talentos
2. Se houver, **bloqueia a exclusão** e retorna erro:

```json
{
  "error": "Não é possível excluir esta vaga",
  "message": "Há X candidato(s) vinculado(s) a esta vaga que não estão no Banco de Talentos.",
  "detalhes": "Para excluir a vaga sem perder os candidatos, mova todos para o 'Banco de Talentos' primeiro.",
  "candidatosRestantes": X
}
```

3. Só permite exclusão se:
   - **Todos os candidatos** estão no Banco de Talentos, OU
   - **Não há candidatos** vinculados

---

## 🔄 **Fluxo Recomendado para Excluir Vaga:**

### ✅ **Jeito Correto (sem perder candidatos):**

1. Acesse a vaga na página **Candidatos**
2. Para cada candidato que deseja manter:
   - Clique em **"Banco de Talentos"** (ícone ⭐)
3. Após mover todos, vá em **Vagas**
4. Exclua a vaga ✅

**Resultado:** Candidatos são preservados no Banco de Talentos!

---

### ❌ **Jeito Errado (perde candidatos):**

1. Tentar excluir vaga COM candidatos ainda vinculados
2. Sistema **bloqueia** e mostra erro ❌

---

## 📊 **Estados da Vaga:**

| Status | Visível no Site? | Candidatos Visíveis RH? | Pode Receber Candidaturas? | Pode Excluir? |
|--------|------------------|-------------------------|----------------------------|---------------|
| **Ativa** | ✅ Sim | ✅ Sim | ✅ Sim | ⚠️ Só sem candidatos |
| **Desativada** | ❌ Não | ✅ Sim | ❌ Não | ⚠️ Só sem candidatos |
| **Oculta** | ❌ Não | ✅ Sim | ❌ Não | ⚠️ Só sem candidatos |
| **Excluída** | ❌ Não | ❌ Não | ❌ Não | - |

---

## 🎯 **Benefícios:**

### ✅ **Para o RH:**
- Pode consultar candidatos de vagas desativadas/ocultadas
- Pode gerenciar candidatos normalmente (comentários, tags, etc.)
- Pode mover candidatos para banco de talentos
- Não perde candidatos ao desativar/ocultar vagas

### ✅ **Para os Candidatos:**
- Dados não são perdidos quando vaga é desativada
- Podem ser movidos para banco de talentos para futuras oportunidades

### ✅ **Segurança:**
- Proteção automática contra exclusão acidental de dados
- Aviso claro de como proceder

---

## 🔍 **Como Identificar Vagas Desativadas/Ocultadas:**

### Na Lista de Vagas (Grid):
- Badge colorido ao lado do número de candidatos
- Ícone da vaga com cor diferente

### Na Visualização de Candidatos:
- Badge no título da vaga
- Aviso informativo destacado
- Dica de como excluir sem perder dados

---

## 📝 **Arquivos Modificados:**

1. ✅ `pages/rh/candidatos/index.tsx` - Frontend (busca e visual)
2. ✅ `src/routes/vagas.ts` - Backend (proteção na exclusão)

---

## ⚙️ **Lógica de Banco de Talentos:**

**Já estava funcionando!** ✅

**Arquivo:** `src/routes/candidatos.ts` (linhas 266-272)

```typescript
case 'banco de talentos':
case 'banco_talentos':
  // Disparar gatilho de banco de talentos
  dispararGatilho('status_banco_talentos', candidato.id, candidato.vaga_id).catch(err => {
    console.error('❌ Erro ao disparar gatilho "Banco de Talentos":', err);
  });
  break;
```

---

## 🧪 **Como Testar:**

### 1. **Criar Vaga e Adicionar Candidatos**
```
- Criar vaga "Teste Desativação"
- Adicionar 2-3 candidatos
```

### 2. **Desativar a Vaga**
```
- Ir em Vagas > Editar
- Mudar status para "Desativada"
- Salvar
```

### 3. **Verificar na Página Candidatos**
```
- Ir em Candidatos
- Verificar se a vaga aparece com badge "🚫 Desativada"
- Clicar na vaga
- Confirmar que candidatos são exibidos
- Confirmar aviso informativo
```

### 4. **Tentar Excluir (deve dar erro)**
```
- Ir em Vagas
- Tentar excluir a vaga
- Verificar mensagem de erro ❌
```

### 5. **Mover para Banco de Talentos e Excluir**
```
- Voltar em Candidatos
- Mover todos candidatos para "Banco de Talentos" (⭐)
- Ir em Vagas
- Excluir a vaga ✅
- Verificar que candidatos ainda existem no Banco de Talentos
```

---

## 🎉 **Resultado Final:**

✅ Vagas desativadas/ocultadas agora são visíveis para RH  
✅ Candidatos sempre acessíveis independente do status da vaga  
✅ Badge visual clara mostrando status  
✅ Proteção automática contra perda de dados  
✅ Fluxo intuitivo para preservar candidatos  

---

**Correção implementada com sucesso!** 🚀

Data: 25/12/2025 (Natal) 🎄

