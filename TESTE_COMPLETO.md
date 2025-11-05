# 🧪 GUIA DE TESTE COMPLETO

## 📋 OBJETIVO

Testar **TODO O FLUXO** do sistema de ponta a ponta para garantir que está funcionando.

---

## ⚙️ PRÉ-REQUISITOS

Antes de começar os testes:

- [x] Backend rodando (`npm run dev` em `/server`)
- [x] Frontend rodando (`npm run dev` em `/trabalhe-_conosco`)
- [x] PostgreSQL com tabelas criadas (`npm run migrate`)
- [x] Usuário admin criado (`npm run seed`)

---

## 🧪 TESTE 1: BACKEND FUNCIONANDO

### Passo 1.1: Health Check
```bash
curl http://localhost:3333/health
```

**✅ Resultado esperado:**
```json
{"status":"ok"}
```

### Passo 1.2: Login RH
```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fgservices.com","password":"admin123"}'
```

**✅ Resultado esperado:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@fgservices.com",
    "perfil": "admin"
  }
}
```

---

## 🧪 TESTE 2: CRIAR VAGA (PAINEL RH)

### Passo 2.1: Acessar Painel RH
1. Abra: `http://localhost:3000/rh/login`
2. Credenciais:
   - **Email:** `admin@fgservices.com`
   - **Senha:** `admin123`
3. Clique "Entrar"

**✅ Resultado esperado:**
- Redireciona para `/rh` (Dashboard)
- Vê métricas (Total de Vagas, Total de Candidatos, etc.)

### Passo 2.2: Criar Nova Vaga
1. Clique no menu **"Vagas"**
2. Clique botão **"Nova Vaga"** (canto superior direito)
3. Preencha o formulário:
   ```
   Título: Auxiliar de Limpeza
   Tipo de Contrato: CLT
   Endereço: São Paulo - SP
   Descrição: Vaga para auxiliar de limpeza em condomínio residencial.
   Requisitos: Ensino médio completo, experiência mínima de 6 meses.
   Diferenciais: Disponibilidade para finais de semana.
   Status: Ativa
   ```
4. Clique **"Salvar"**

**✅ Resultado esperado:**
- Mensagem: "✅ Vaga criada com sucesso!"
- Vaga aparece na lista

### Passo 2.3: Verificar Vaga no Site
1. Abra nova aba: `http://localhost:3000`
2. Role até **"Oportunidades Abertas"**

**✅ Resultado esperado:**
- Vaga "Auxiliar de Limpeza" aparece
- Card mostra: Título, Tipo (CLT), Local (São Paulo - SP)
- Botão "Ver Detalhes"

---

## 🧪 TESTE 3: CANDIDATURA PÚBLICA (MAIS IMPORTANTE!)

### Passo 3.1: Acessar Detalhes da Vaga
1. No site (`http://localhost:3000`)
2. Clique em **"Ver Detalhes"** na vaga "Auxiliar de Limpeza"

**✅ Resultado esperado:**
- Abre página `/vagas/1` (ou outro ID)
- Mostra descrição completa
- Exibe formulário de candidatura à direita

### Passo 3.2: Preencher Formulário
Preencha TODOS os campos:

```
DADOS PESSOAIS:
Nome Completo: João da Silva
CPF: 123.456.789-00
Data de Nascimento: 01/01/1990
Email: joao.silva@email.com
Telefone: (11) 98765-4321

ENDEREÇO:
Estado: SP (selecione no dropdown)
Cidade: São Paulo
Bairro: Centro

CURRÍCULO:
[Clique em "Escolher arquivo" e anexe um PDF]
```

### Passo 3.3: Enviar Candidatura
1. Clique no botão **"Enviar Candidatura"**
2. Aguarde o loading (botão fica "Enviando...")

**✅ Resultado esperado:**
- Aparece mensagem verde:
  ```
  ✓ Candidatura enviada com sucesso!
  Recebemos sua candidatura. Entraremos em contato em breve!
  ```
- Formulário limpa automaticamente
- Arquivo "Nenhum arquivo escolhido"

### Passo 3.4: Verificar no Console (Opcional)
Abra DevTools (F12) > Network:

**✅ Resultado esperado:**
- Request POST para `http://localhost:3333/candidatos`
- Status: 201 Created
- Response com dados do candidato criado

---

## 🧪 TESTE 4: VERIFICAR CANDIDATO NO PAINEL RH

### Passo 4.1: Acessar Lista de Candidatos
1. Volte para o Painel RH (`http://localhost:3000/rh`)
2. Clique no menu **"Candidatos"**

**✅ Resultado esperado:**
- Métricas atualizadas:
  - Total de Candidatos: 1
  - Novos: 1
- Card do candidato aparece:
  ```
  Nome: João da Silva
  Email: joao.silva@email.com
  Telefone: (11) 98765-4321
  Localização: 📍 Centro, São Paulo - SP
  Status: Novo (badge azul)
  Vaga: Auxiliar de Limpeza
  Data: Hoje
  ```

### Passo 4.2: Ver Detalhes
1. Clique no ícone 👁️ (Eye) no card do candidato

**✅ Resultado esperado:**
- Abre modal com TODOS os dados:
  ```
  Nome Completo: João da Silva
  Email: joao.silva@email.com
  Telefone: (11) 98765-4321
  CPF: 123.456.789-00
  Data de Cadastro: [data atual]
  Vaga: Auxiliar de Limpeza
  
  📍 Localização:
  Estado: SP
  Cidade: São Paulo
  Bairro: Centro
  
  Status Atual: Novo
  ```

### Passo 4.3: Testar WhatsApp
1. No card do candidato, clique no botão verde **💬 WhatsApp**

**✅ Resultado esperado:**
- Abre nova aba com link:
  ```
  https://wa.me/5511987654321
  ```
- WhatsApp Web/App abre (se instalado)

### Passo 4.4: Baixar Currículo (se anexou PDF)
1. Clique no botão **📥 Download**

**✅ Resultado esperado:**
- Baixa o arquivo PDF
- Nome: `[hash aleatório].pdf`

---

## 🧪 TESTE 5: FILTROS DE LOCALIZAÇÃO

### Passo 5.1: Filtrar por Estado
1. Na página **"Candidatos"**
2. No filtro **"Estado"**, selecione: **SP**
3. Clique **"Buscar"**

**✅ Resultado esperado:**
- Mostra apenas candidatos de São Paulo
- João da Silva aparece
- Métricas atualizam

### Passo 5.2: Filtrar por Cidade
1. No campo **"Filtrar por cidade..."**, digite: **São Paulo**
2. Clique **"Buscar"**

**✅ Resultado esperado:**
- Mostra apenas candidatos de São Paulo (cidade)
- João da Silva aparece

### Passo 5.3: Ordenar por Proximidade
1. Clique no botão **"Ordenar por Proximidade"**

**✅ Resultado esperado:**
- Botão muda para gradiente (azul→vermelho)
- Texto: "Ordenado por Proximidade"
- Candidatos de SP/São Paulo/Centro aparecem primeiro
- Badge verde **"Próximo"** aparece ao lado

### Passo 5.4: Limpar Filtros
1. Clique em **"Limpar Filtros de Localização"**

**✅ Resultado esperado:**
- Todos os filtros resetam
- Mostra todos os candidatos

---

## 🧪 TESTE 6: ALTERAR STATUS

### Passo 6.1: Mudar para "Em Análise"
1. No card do candidato, clique no ícone 🕐 (Clock)
2. Ou clique em **"Ver Detalhes"** > **"Em Análise"**

**✅ Resultado esperado:**
- Status muda para "Em Análise"
- Badge fica amarelo
- Métricas atualizam:
  - Novos: 0
  - Em Análise: 1

### Passo 6.2: Aprovar Candidato
1. Clique no ícone ✓ (CheckCircle) verde

**✅ Resultado esperado:**
- Status muda para "Aprovado"
- Badge fica verde
- Métricas atualizam:
  - Aprovados: 1

---

## 🧪 TESTE 7: BANCO DE TALENTOS

### Passo 7.1: Adicionar ao Banco
1. Na lista de candidatos
2. Clique no ícone ⭐ (Star) roxo

**✅ Resultado esperado:**
- Alert: "✅ Status alterado para: Banco de Talentos"
- Status muda para "Banco de Talentos"
- Badge roxo/índigo
- Métricas atualizam:
  - Banco de Talentos: 1

### Passo 7.2: Ver Banco de Talentos
1. No menu, clique **"Banco de Talentos"**

**✅ Resultado esperado:**
- Abre página `/rh/banco-talentos`
- Mostra métricas do Banco:
  - Total de Talentos: 1
  - Adicionados Este Mês: 1
- Card do João da Silva aparece

### Passo 7.3: Buscar no Banco
1. No campo de busca, digite: **joão**
2. Clique **"Buscar"**

**✅ Resultado esperado:**
- Filtra e mostra apenas João da Silva

### Passo 7.4: Mover para Nova Vaga
1. No card, clique em **"Mover para Nova Vaga"** (botão verde)

**✅ Resultado esperado:**
- Alert: "✅ Candidato movido para nova vaga (status: Novo)!"
- Candidato sai da lista do Banco
- Total de Talentos: 0

---

## 🧪 TESTE 8: KANBAN

### Passo 8.1: Acessar Kanban
1. Volte para **"Candidatos"**
2. Clique no botão **"Ver Kanban"** (canto superior direito)

**✅ Resultado esperado:**
- Abre página Kanban
- Mostra 6 colunas:
  - Novo
  - Em Análise
  - Entrevista
  - Aprovado
  - Reprovado
  - Banco de Talentos

### Passo 8.2: Arrastar Candidato
1. Clique e segure o card do João da Silva
2. Arraste para a coluna **"Entrevista"**
3. Solte

**✅ Resultado esperado:**
- Card se move animadamente
- Status muda automaticamente
- Contador da coluna "Novo" diminui
- Contador da coluna "Entrevista" aumenta

### Passo 8.3: Testar Banco de Talentos no Kanban
1. Crie 6+ candidatos (repita Teste 3)
2. Mova todos para "Banco de Talentos"

**✅ Resultado esperado:**
- Coluna mostra apenas 5 candidatos
- Aparece card especial:
  ```
  🔗
  + X talentos
  Ver Todos
  ```
- Clicar nele abre `/rh/banco-talentos`

---

## 🧪 TESTE 9: CRIAR MÚLTIPLOS CANDIDATOS

Para testar filtros e Kanban com mais dados:

### Passo 9.1: Candidato 2
```
Nome: Maria Santos
CPF: 987.654.321-00
Email: maria@email.com
Telefone: (21) 91234-5678
Estado: RJ
Cidade: Rio de Janeiro
Bairro: Copacabana
```

### Passo 9.2: Candidato 3
```
Nome: Pedro Oliveira
CPF: 456.789.123-00
Email: pedro@email.com
Telefone: (81) 99876-5432
Estado: PE
Cidade: Recife
Bairro: Boa Viagem
```

### Passo 9.3: Verificar Filtros
1. Filtrar por Estado "RJ" → Mostra só Maria
2. Filtrar por Estado "PE" → Mostra só Pedro
3. Filtrar por Estado "SP" → Mostra só João
4. Limpar filtros → Mostra os 3

---

## 🧪 TESTE 10: MODO DEMO (SEM BACKEND)

### Passo 10.1: Parar Backend
```bash
# Ctrl+C no terminal do backend
```

### Passo 10.2: Fazer Login
1. Acesse: `http://localhost:3000/rh/login`
2. Use: `admin@fgservices.com` / `admin123`

**✅ Resultado esperado:**
- Login funciona (modo demo)
- Token: `demo-token-temporario`
- Redireciona para dashboard

### Passo 10.3: Ver Dados Mockados
1. Vá em **"Candidatos"**

**✅ Resultado esperado:**
- Mostra 10+ candidatos de exemplo
- Todos os filtros funcionam
- WhatsApp funciona
- Detalhes funcionam
- **NÃO salva alterações** (modo demo)

---

## ✅ CHECKLIST FINAL

Marque cada teste conforme completa:

### Backend:
- [ ] Health check responde
- [ ] Login retorna token
- [ ] Criar vaga funciona
- [ ] POST /candidatos aceita dados

### Frontend - Público:
- [ ] Homepage carrega
- [ ] Vagas aparecem
- [ ] Página de detalhes funciona
- [ ] **Formulário envia dados**
- [ ] **Mensagem de sucesso aparece**

### Frontend - Painel RH:
- [ ] Login funciona
- [ ] Dashboard mostra métricas
- [ ] Criar vaga funciona
- [ ] **Lista mostra candidatos**
- [ ] **Dados de localização aparecem**
- [ ] **Filtros funcionam**
- [ ] **Ordenação por proximidade funciona**
- [ ] **Adicionar ao Banco funciona**
- [ ] **Página Banco de Talentos funciona**
- [ ] **Kanban mostra "Ver Todos"**
- [ ] **WhatsApp link funciona**
- [ ] Alterar status funciona
- [ ] Drag & drop funciona

### Modo Demo:
- [ ] Login funciona sem backend
- [ ] Dados mockados aparecem
- [ ] Todas as telas funcionam

---

## 🎯 RESULTADO ESPERADO

Ao completar todos os testes acima, você terá validado:

✅ **100%** do fluxo de candidatura  
✅ **100%** do painel RH  
✅ **100%** dos filtros  
✅ **100%** do Banco de Talentos  
✅ **100%** do Kanban  
✅ **100%** das integrações  

---

## 🚨 TROUBLESHOOTING

### Candidatura não envia:
1. Verifique console do navegador (F12)
2. Confirme que backend está rodando
3. Teste: `curl http://localhost:3333/health`

### Candidato não aparece no painel:
1. Verifique se enviou com sucesso
2. Faça logout e login novamente
3. Confira no banco:
   ```sql
   SELECT * FROM candidatos;
   ```

### WhatsApp não abre:
- Link correto: `https://wa.me/5511987654321`
- Precisa de WhatsApp instalado ou WhatsApp Web

### Arquivo não faz upload:
1. Verifique pasta `/server/uploads` existe
2. Permissões: `chmod 755 uploads`
3. Tamanho do arquivo < 5MB

---

## 🎉 SUCESSO!

Se todos os testes passaram, **PARABÉNS**! 🎊

Seu sistema está **100% funcional** e pronto para produção!

**Próximo passo:** Deploy! 🚀

---

**Boa sorte com os testes!** ✨

