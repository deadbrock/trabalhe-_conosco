# 📧💬 FASE 3 - SPRINT 2: COMUNICAÇÃO AUTOMATIZADA

## 🎯 **OBJETIVO**

Automatizar a comunicação com candidatos via **Email** e **WhatsApp Business**, com templates personalizáveis e gatilhos automáticos.

---

## 📋 **FUNCIONALIDADES COMPLETAS**

### **1️⃣ Email Automatizado** 📧

#### **Integrações Disponíveis:**
- **Nodemailer** (SMTP - grátis, mais controle)
- **SendGrid** (100 emails/dia grátis)
- **Resend** (3.000 emails/mês grátis) ⭐ **RECOMENDADO**

#### **Templates de Email:**
```
1. ✅ Inscrição Confirmada
   - Obrigado por se candidatar
   - Próximos passos
   - Contato para dúvidas

2. ✅ Em Análise
   - Seu currículo está sendo avaliado
   - Tempo estimado de resposta
   - Agradecer interesse

3. ✅ Convite para Entrevista
   - Parabéns, você foi selecionado!
   - Data/hora/local ou link
   - Instruções e preparação

4. ✅ Aprovado
   - Parabéns! Você foi aprovado
   - Próximos passos de contratação
   - Documentos necessários

5. ✅ Reprovado (Gentil)
   - Agradecimento pela participação
   - Feedback construtivo (opcional)
   - Convite para banco de talentos
   - Portas abertas para futuras oportunidades
```

#### **Recursos:**
- ✅ Templates HTML responsivos
- ✅ Variáveis dinâmicas: `{{nome}}`, `{{vaga}}`, `{{empresa}}`, etc.
- ✅ Logo da empresa
- ✅ Cores personalizáveis
- ✅ Preview antes de enviar
- ✅ Histórico de emails enviados
- ✅ Taxa de abertura (se Resend/SendGrid)

---

### **2️⃣ WhatsApp Business Templates** 💬

#### **Integração:**
- **WhatsApp Business API** (oficial)
- **Alternativas:**
  - **Twilio** (pago, mas confiável)
  - **Evolution API** (self-hosted, grátis)
  - **Baileys** (library Node.js, grátis)
  - **WPPConnect** (library Node.js, grátis)

#### **Templates de WhatsApp:**
```
1. ✅ Inscrição Confirmada
   Olá {{nome}}! 👋
   
   Recebemos sua candidatura para *{{vaga}}*!
   
   ✅ Currículo recebido
   ⏰ Retornaremos em até 5 dias úteis
   
   Dúvidas? Responda esta mensagem!
   
   Boa sorte! 🍀

2. ✅ Em Análise
   Oi {{nome}}! 😊
   
   Seu currículo para *{{vaga}}* está em análise!
   
   📋 Nossa equipe está avaliando seu perfil
   ⏳ Em breve você terá novidades
   
   Obrigado pela paciência!

3. ✅ Convite para Entrevista
   🎉 Parabéns {{nome}}!
   
   Você foi *selecionado(a)* para entrevista!
   
   📅 Data: {{data}}
   ⏰ Horário: {{hora}}
   📍 Local: {{local}}
   {{link_videochamada}}
   
   Por favor, confirme sua presença! ✅

4. ✅ Aprovado
   🎊 PARABÉNS {{nome}}! 🎊
   
   Você foi *APROVADO(A)* para *{{vaga}}*!
   
   🎯 Próximos passos:
   1. Contato do RH
   2. Documentação
   3. Início: {{data_inicio}}
   
   Bem-vindo(a) à equipe! 🚀

5. ✅ Reprovado (Gentil)
   Olá {{nome}},
   
   Agradecemos muito seu interesse em *{{vaga}}*.
   
   Infelizmente, neste momento, optamos por outro perfil. 😔
   
   Mas não desanime! Seu currículo ficará em nosso *banco de talentos* para futuras oportunidades! 💼
   
   Desejamos muito sucesso! 🌟
```

#### **Recursos WhatsApp:**
- ✅ Envio automático ou manual
- ✅ Templates aprovados (WhatsApp Business API)
- ✅ Botões de ação (confirmar presença, etc.)
- ✅ Envio em lote (múltiplos candidatos)
- ✅ Status de entrega (enviado/entregue/lido)
- ✅ Histórico completo de mensagens
- ✅ Resposta rápida (quick replies)
- ✅ Anexar documentos (PDF, imagens)

---

### **3️⃣ Sistema de Templates Unificado** 📝

#### **Interface de Gerenciamento:**
```
╔══════════════════════════════════════════════════════════╗
║              📬 GERENCIADOR DE TEMPLATES                  ║
╚══════════════════════════════════════════════════════════╝

[+ Novo Template]  [Importar]  [Exportar]

┌─────────────────────────────────────────────────────────┐
│ 📧 EMAIL | 💬 WHATSAPP                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ ✅ Inscrição Confirmada                    [Editar] [❌]│
│    Enviado 127 vezes | Taxa abertura: 94%               │
│                                                           │
│ ✅ Em Análise                              [Editar] [❌]│
│    Enviado 89 vezes | Taxa abertura: 87%                │
│                                                           │
│ ✅ Convite Entrevista                      [Editar] [❌]│
│    Enviado 45 vezes | Taxa abertura: 98%                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

#### **Editor de Templates:**
- ✅ Editor WYSIWYG (What You See Is What You Get)
- ✅ Preview em tempo real
- ✅ Teste de envio
- ✅ Variáveis disponíveis:
  ```
  {{nome}}               → Nome do candidato
  {{email}}              → Email do candidato
  {{telefone}}           → Telefone do candidato
  {{vaga}}               → Título da vaga
  {{empresa}}            → Nome da empresa
  {{data}}               → Data atual ou agendada
  {{hora}}               → Hora do agendamento
  {{local}}              → Local da entrevista
  {{link}}               → Link da videochamada
  {{rh_nome}}            → Nome do RH responsável
  {{rh_email}}           → Email do RH
  {{rh_telefone}}        → Telefone do RH
  ```
- ✅ Formatação (negrito, itálico, links, emojis)
- ✅ Imagens (logo, assinatura)
- ✅ Duplicar templates
- ✅ Ativar/desativar templates

---

### **4️⃣ Gatilhos Automáticos** ⚡

#### **Quando enviar automaticamente:**

```javascript
// Configuração por tipo de evento
const gatilhos = {
  inscricao_recebida: {
    email: true,      // ✅ Enviar email
    whatsapp: true,   // ✅ Enviar WhatsApp
    delay: 0          // Imediato
  },
  
  status_em_analise: {
    email: true,
    whatsapp: false,  // ❌ Não enviar (opcional)
    delay: 0
  },
  
  convite_entrevista: {
    email: true,
    whatsapp: true,   // ✅ WhatsApp tem mais visibilidade
    delay: 0
  },
  
  candidato_aprovado: {
    email: true,
    whatsapp: true,
    delay: 0
  },
  
  candidato_reprovado: {
    email: true,
    whatsapp: true,
    delay: 3600000    // Aguardar 1h antes de enviar
  }
};
```

#### **Configurações:**
- ✅ Ativar/desativar por tipo de evento
- ✅ Escolher canal (Email, WhatsApp, Ambos)
- ✅ Delay configurável (enviar imediatamente ou após X tempo)
- ✅ Horário comercial (não enviar fora do horário)
- ✅ Dias úteis apenas (opcional)
- ✅ Limite de envios por dia
- ✅ Blacklist (não enviar para certos números/emails)

---

## 🛠️ **STACK TÉCNICA**

### **Backend:**

#### **Email:**
```typescript
// Opção 1: Resend (Recomendado) ⭐
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'RH <rh@trabalheconoscofg.com.br>',
  to: candidato.email,
  subject: 'Bem-vindo!',
  html: templateHTML
});

// Opção 2: Nodemailer (SMTP)
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

#### **WhatsApp:**
```typescript
// Opção 1: Evolution API (Self-hosted, grátis)
// Opção 2: Baileys (Library Node.js)
// Opção 3: Twilio (Pago, mas oficial)

import axios from 'axios';

// Evolution API
const enviarWhatsApp = async (numero: string, mensagem: string) => {
  await axios.post('http://evolution-api:8080/message/sendText', {
    number: numero,
    text: mensagem
  }, {
    headers: {
      'apikey': process.env.EVOLUTION_API_KEY
    }
  });
};
```

### **Frontend:**
```typescript
// Componentes
- TemplateManager.tsx       → Gerenciar templates
- TemplateEditor.tsx        → Editor WYSIWYG
- TemplatePreview.tsx       → Preview de templates
- EnvioManual.tsx           → Enviar manualmente
- HistoricoComunicacao.tsx  → Histórico de envios
- ConfiguracaoGatilhos.tsx  → Configurar gatilhos
```

### **Database:**
```sql
-- Novas tabelas

CREATE TABLE templates (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,  -- 'email' ou 'whatsapp'
  nome VARCHAR(255) NOT NULL,
  assunto VARCHAR(255),  -- Só para email
  conteudo TEXT NOT NULL,
  variaveis JSONB,  -- Lista de variáveis usadas
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE historico_comunicacao (
  id SERIAL PRIMARY KEY,
  candidato_id INTEGER REFERENCES candidatos(id),
  tipo VARCHAR(50) NOT NULL,  -- 'email' ou 'whatsapp'
  template_id INTEGER REFERENCES templates(id),
  destinatario VARCHAR(255) NOT NULL,
  assunto VARCHAR(255),
  conteudo TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,  -- 'enviado', 'entregue', 'lido', 'falhou'
  erro TEXT,
  metadata JSONB,  -- Dados extras (taxa abertura, etc)
  enviado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE configuracao_gatilhos (
  id SERIAL PRIMARY KEY,
  evento VARCHAR(100) NOT NULL,  -- 'inscricao_recebida', etc
  email_ativo BOOLEAN DEFAULT TRUE,
  whatsapp_ativo BOOLEAN DEFAULT TRUE,
  template_email_id INTEGER REFERENCES templates(id),
  template_whatsapp_id INTEGER REFERENCES templates(id),
  delay_minutos INTEGER DEFAULT 0,
  horario_comercial BOOLEAN DEFAULT FALSE,
  dias_uteis BOOLEAN DEFAULT FALSE
);
```

---

## 📊 **ESTATÍSTICAS E MÉTRICAS**

### **Dashboard de Comunicação:**
```
╔══════════════════════════════════════════════════════════╗
║           📊 MÉTRICAS DE COMUNICAÇÃO - ÚLTIMOS 30 DIAS   ║
╚══════════════════════════════════════════════════════════╝

📧 EMAILS                          💬 WHATSAPP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📤 Enviados:     245                📤 Enviados:     198
✅ Entregues:    242 (98.8%)        ✅ Entregues:    195 (98.5%)
👁️ Abertos:      218 (89.0%)        👁️ Lidos:        187 (94.4%)
❌ Falhas:       3 (1.2%)           ❌ Falhas:       3 (1.5%)

📈 Taxa de Abertura: 89%            📈 Taxa de Leitura: 94%

TEMPLATES MAIS ENVIADOS:
1. Inscrição Confirmada    87 envios
2. Em Análise             56 envios
3. Convite Entrevista     42 envios
```

---

## ⏱️ **TEMPO ESTIMADO**

| Funcionalidade | Tempo |
|---------------|-------|
| API de Email (Resend) | 1h |
| API de WhatsApp (Evolution) | 1.5h |
| Templates de Email | 1h |
| Templates de WhatsApp | 0.5h |
| Sistema de Gatilhos | 1h |
| Interface de Gerenciamento | 2h |
| Histórico de Comunicação | 1h |
| Dashboard de Métricas | 1h |
| **TOTAL** | **9-10 horas** |

---

## 🚀 **ROADMAP DE IMPLEMENTAÇÃO**

### **Fase 1: Backend (4h)**
1. ✅ Criar migrations (templates, historico, gatilhos)
2. ✅ API de templates (CRUD)
3. ✅ API de envio de email (Resend)
4. ✅ API de envio de WhatsApp (Evolution)
5. ✅ Sistema de gatilhos automáticos
6. ✅ Histórico de comunicação

### **Fase 2: Templates Padrão (1h)**
1. ✅ 5 templates de email em HTML
2. ✅ 5 templates de WhatsApp
3. ✅ Seed do banco com templates

### **Fase 3: Frontend (4h)**
1. ✅ Componente TemplateManager
2. ✅ Componente TemplateEditor
3. ✅ Componente EnvioManual
4. ✅ Componente HistoricoComunicacao
5. ✅ Dashboard de métricas
6. ✅ Configuração de gatilhos

### **Fase 4: Integração (1h)**
1. ✅ Integrar gatilhos nas rotas existentes
2. ✅ Testar envios automáticos
3. ✅ Deploy

---

## 💡 **DIFERENCIAIS**

### **WhatsApp Business vs Email:**

| Característica | Email | WhatsApp |
|---------------|-------|----------|
| Taxa de abertura | 20-30% | **90-95%** ✅ |
| Tempo de leitura | 6-24h | **5 min** ✅ |
| Custo | Grátis | Grátis (Evolution) |
| Formalidade | Alta | Média |
| Engajamento | Baixo | **Alto** ✅ |
| Spam | Alto risco | Baixo risco |

**Recomendação:** Use **AMBOS**!
- Email: Comunicação formal, documentada
- WhatsApp: Comunicação rápida, urgente, alta visibilidade

---

## 🎯 **RESULTADO ESPERADO**

Após implementar o Sprint 2:

✅ **100% dos candidatos** recebem confirmação automática  
✅ **Taxa de abertura** 3x maior com WhatsApp  
✅ **Tempo de resposta** reduzido em 80%  
✅ **Experiência do candidato** muito melhor  
✅ **RH economiza** 10+ horas/semana  
✅ **Comunicação padronizada** e profissional  
✅ **Rastreabilidade** total das comunicações  

---

## 🤔 **CONFIGURAÇÃO NECESSÁRIA**

### **Email (Resend):**
1. Criar conta: https://resend.com (grátis)
2. Pegar API Key
3. Verificar domínio (opcional, mas recomendado)

### **WhatsApp (Evolution API):**
1. Deploy da Evolution API (Railway/Docker)
2. Conectar número do WhatsApp Business
3. Pegar API Key
4. Configurar webhook (opcional)

---

## ✅ **POSSO COMEÇAR?**

Vou implementar:
1. ✅ Email Automatizado (Resend)
2. ✅ WhatsApp Business (Evolution API)
3. ✅ Templates para ambos
4. ✅ Sistema de gatilhos
5. ✅ Interface de gerenciamento
6. ✅ Dashboard de métricas

**Pronto para começar o Sprint 2?** 🚀📧💬

