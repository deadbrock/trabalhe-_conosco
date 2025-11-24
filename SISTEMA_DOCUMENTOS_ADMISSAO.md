# 📄 Sistema de Coleta de Documentos para Admissão

## 🎯 Visão Geral

Sistema completo para coleta segura de documentos de candidatos aprovados, com **validações automáticas de qualidade e OCR** para garantir que apenas documentos legíveis e válidos sejam aceitos.

---

## ✨ Funcionalidades Implementadas

### 1. **Link Único e Seguro**
- Cada candidato recebe um link exclusivo (token de 64 caracteres)
- Link válido por 30 dias
- Acesso sem necessidade de login
- Notificação automática por **Email + WhatsApp**

### 2. **Validações Automáticas**

#### **A) Validação de Qualidade de Imagem**
- ✅ Resolução mínima: 800x600px
- ✅ Tamanho do arquivo: 50KB - 10MB
- ✅ Formatos aceitos: JPG, PNG, WebP
- ✅ Nitidez (detecta fotos embaçadas/desfocadas)
- ✅ Brilho (detecta fotos muito escuras ou claras)
- ✅ Detecção de imagens completamente pretas/brancas

#### **B) Validação OCR para Comprovante de Residência**
- 📅 **Extração automática da data de emissão**
- ⏰ **Verifica se está dentro de 3 meses**
- 🔍 Detecta tipo de comprovante (luz, água, internet, gás, etc.)
- 👤 Validação opcional do nome do candidato no documento

#### **C) Detecção de Rasuras (Opcional)**
- Análise de bordas para detectar traços/rabiscos anormais
- Pode ser ativado ou desativado conforme necessidade

### 3. **Documentos Solicitados**

#### **Obrigatórios:**
1. 📋 Carteira de Trabalho Digital
2. 🆔 Identidade (frente e verso)
3. 🏠 Comprovante de Residência (até 3 meses)
4. 📜 Certidão de Nascimento ou Casamento
5. 🗳️ Título de Eleitor
6. 🔒 Antecedentes Criminais / Nada Consta (recente)

#### **Condicionais:**
7. 🪖 Certificado de Reservista (apenas masculino)
8. 👶 Certidão e CPF de filhos até 13 anos (se aplicável)

### 4. **Painel RH**
- 📊 Visualização de todos os documentos enviados
- ✅ Aprovação/rejeição individual de cada documento
- 🔍 Visualização inline dos arquivos
- 📥 Filtros por status (Pendente, Em Análise, Aprovado, Rejeitado)
- 📝 Registro de motivo de rejeição

---

## 🏗️ Arquitetura do Sistema

### **Backend (Node.js + TypeScript)**

#### **Tabela `documentos_candidatos`**
```sql
- candidato_id (FK)
- token_acesso (unique, 64 chars)
- token_expira_em (timestamp)
- [documento]_url (text)
- [documento]_validado (boolean)
- [documento]_rejeitado (boolean)
- [documento]_motivo_rejeicao (text)
- comprovante_residencia_data_emissao (date) -- Extraída via OCR
- filhos_documentos (jsonb) -- Array de documentos de filhos
- status (pendente | em_analise | aprovado | rejeitado)
- data_envio_link, data_primeiro_upload, data_ultimo_upload
```

#### **Serviços Criados**
1. **`imageValidationService.ts`**
   - Validação de qualidade (nitidez, brilho, resolução)
   - Detecção de rasuras
   - Usa biblioteca `sharp` para processamento

2. **`ocrValidationService.ts`**
   - OCR com `tesseract.js` (idioma português)
   - Extração de datas do comprovante
   - Validação de prazo (3 meses)
   - Detecção de tipo de comprovante

3. **`notificacaoDocumentosService.ts`**
   - Envio de email com template HTML profissional
   - Envio de WhatsApp via Twilio
   - Notificação combinada (email + WhatsApp)

#### **Rotas (`/documentos`)**
- `POST /gerar-link/:candidatoId` (RH) - Gera link e envia notificação
- `GET /:token` (Público) - Busca dados do candidato via token
- `POST /:token/upload` (Público) - Upload de documento com validação
- `POST /:token/filhos` (Público) - Adiciona documentos de filhos
- `GET /rh/listar` (RH) - Lista todos os documentos
- `PUT /rh/:id/validar` (RH) - Aprova/rejeita documento

### **Frontend (Next.js + React + Tailwind)**

#### **Páginas Criadas**
1. **`/documentos/[token].tsx`** (Público)
   - Interface amigável para candidato
   - Upload drag-and-drop
   - Validação client-side de tamanho/formato
   - Feedback visual em tempo real
   - Avisos sobre requisitos

2. **`/rh/documentos.tsx`** (RH)
   - Lista completa de candidatos
   - Cards expansíveis com todos os documentos
   - Botões de aprovar/rejeitar
   - Filtros por status
   - Link direto para página do candidato

3. **Integração em `/rh/candidatos/index.tsx`**
   - Botão "Solicitar Documentos" para candidatos aprovados
   - Aparece ao lado do botão "Enviar para FGS"
   - Feedback de envio de notificação (email/WhatsApp)

#### **Componentes**
- `DocumentoCard` - Card de documento com status visual
- Ícones Lucide: `FileText`, `CheckCircle`, `XCircle`, `AlertCircle`, `Upload`

---

## 🚀 Como Usar

### **1. RH: Aprovar Candidato e Solicitar Documentos**

1. Acesse **RH → Candidatos**
2. Clique no candidato aprovado
3. No modal, clique em **"Solicitar Documentos"**
4. Sistema irá:
   - Gerar link único
   - Enviar email automático
   - Enviar WhatsApp automático
   - Exibir feedback de envio

### **2. Candidato: Enviar Documentos**

1. Recebe email/WhatsApp com link
2. Acessa o link (sem necessidade de login)
3. Vê lista de documentos necessários
4. Faz upload de cada documento
5. Sistema valida automaticamente:
   - ❌ Rejeita se imagem embaçada
   - ❌ Rejeita se comprovante > 3 meses
   - ✅ Aceita se tudo OK
6. Pode reenviar documentos rejeitados

### **3. RH: Validar Documentos**

1. Acesse **RH → Documentos**
2. Veja lista de candidatos com documentos
3. Clique para expandir e ver todos os documentos
4. Para cada documento:
   - Clique em "Ver" para visualizar
   - Clique em "✓ Aprovar" ou "✗ Rejeitar"
   - Se rejeitar, informe o motivo
5. Candidato será notificado sobre rejeição

---

## 📦 Dependências Adicionadas

### **Backend**
```json
{
  "sharp": "^0.33.5",          // Processamento de imagens
  "tesseract.js": "^5.1.1"      // OCR (reconhecimento de texto)
}
```

### **Instalação**
```bash
# Backend
cd trabalhe-_conosco_server
npm install

# Frontend (não precisa de novas deps)
cd trabalhe-_conosco
npm install
```

---

## 🔧 Configuração

### **Variáveis de Ambiente**

#### **Backend (`trabalhe-_conosco_server/.env`)**
```bash
# Obrigatórias
FRONTEND_URL=https://seu-frontend.vercel.app

# Para notificações por email (Resend)
RESEND_API_KEY=re_xxxxx

# Para notificações por WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

#### **Frontend (`trabalhe-_conosco/.env.local`)**
```bash
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://seu-frontend.vercel.app
```

---

## 🗄️ Migração do Banco de Dados

Execute o script SQL no PostgreSQL:

```bash
# Opção 1: Via Railway CLI
railway run psql < trabalhe-_conosco_server/src/migrations/create_documentos_candidatos.sql

# Opção 2: Copie e cole no Railway → PostgreSQL → Connect
```

Ou conecte no banco e execute:
```sql
-- Conteúdo de create_documentos_candidatos.sql
```

---

## 🎨 Design e UX

### **Para Candidatos**
- ✨ Interface moderna com gradiente institucional
- 📱 Totalmente responsivo (mobile-first)
- 🚦 Indicadores visuais de status (pendente/validado/rejeitado)
- ⚠️ Avisos claros sobre requisitos
- 🔄 Possibilidade de reenvio em caso de rejeição

### **Para RH**
- 📊 Dashboard organizado com filtros
- 🔍 Visualização rápida de todos os documentos
- ✅ Aprovação/rejeição com 1 clique
- 📝 Registro de motivo de rejeição
- 🔗 Link direto para página do candidato

---

## 🧪 Testando o Sistema

### **1. Teste de Validação de Qualidade**
- Envie uma foto embaçada → Deve ser rejeitada
- Envie uma foto muito pequena (< 800x600) → Deve ser rejeitada
- Envie uma foto escura → Deve ser rejeitada

### **2. Teste de OCR (Comprovante)**
- Envie um comprovante antigo (> 3 meses) → Deve ser rejeitado
- Envie um comprovante recente → Deve ser aceito
- Verifique se a data foi extraída corretamente

### **3. Teste de Fluxo Completo**
1. Aprove um candidato
2. Clique em "Solicitar Documentos"
3. Verifique se email/WhatsApp foram enviados
4. Acesse o link recebido
5. Faça upload de todos os documentos
6. No painel RH, aprove/rejeite documentos
7. Candidato pode reenviar documentos rejeitados

---

## 🔒 Segurança

- ✅ Token único de 64 caracteres (SHA-256)
- ✅ Token expira em 30 dias
- ✅ Rotas públicas apenas para upload (via token)
- ✅ Rotas RH protegidas por JWT
- ✅ Validação server-side de todos os uploads
- ✅ Arquivos armazenados no Cloudinary (CDN seguro)
- ✅ Logs de IP e User-Agent para auditoria

---

## 📈 Melhorias Futuras (Opcional)

1. **Assinatura Digital**
   - Integração com DocuSign/ClickSign
   - Assinatura eletrônica de contratos

2. **Análise de Documentos com IA**
   - Google Cloud Vision API
   - Detecção de fraude/falsificação

3. **Notificações Push**
   - Via PWA (Progressive Web App)
   - Notificações no navegador

4. **Integração com eSocial**
   - Envio automático para eSocial
   - Validação de CPF na Receita Federal

5. **Histórico de Versões**
   - Manter histórico de reenvios
   - Comparação de versões antigas

---

## 🆘 Troubleshooting

### **OCR não está funcionando**
- Verifique se `tesseract.js` foi instalado corretamente
- Primeiro uso pode ser lento (baixa modelo de idioma)
- Logs: Procure por "🔍 Iniciando OCR" no console

### **Validação de imagem muito restritiva**
- Ajuste os thresholds em `imageValidationService.ts`:
  ```typescript
  const MIN_WIDTH = 600; // Reduza se necessário
  if (sharpnessScore < 20) // Reduza limite de nitidez
  ```

### **Notificações não estão sendo enviadas**
- Verifique se `RESEND_API_KEY` e `TWILIO_*` estão configurados
- Veja logs: "📤 Enviando notificação de documentos"
- Teste individual: `POST /documentos/gerar-link/:id` com `enviarNotificacao: false`

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do Railway/Vercel
2. Consulte esta documentação
3. Entre em contato com o desenvolvedor

---

**Sistema desenvolvido com ❤️ para FG Services**

