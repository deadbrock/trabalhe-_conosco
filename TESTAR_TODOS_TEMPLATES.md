# 📧 Teste de Todos os Templates - Sistema RH

## 🎯 **Templates Disponíveis:**

1. ✅ **Inscrição Confirmada**
2. 📋 **Em Análise**  
3. 🎉 **Convite para Entrevista**
4. 🎊 **Candidato Aprovado**
5. 💼 **Feedback do Processo Seletivo**

---

## 📬 **Emails de Teste:**
- douglas.mds24@gmail.com
- rh-2@fgservices.com.br
- rh-3@fgservices.com.br

---

## 🚀 **COMANDOS PARA EXECUTAR:**

### **📧 Email 1: douglas.mds24@gmail.com**

#### **Template 1 - ✅ Inscrição Confirmada:**
```powershell
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"douglas.mds24@gmail.com","assunto":"✅ Inscrição Confirmada - Desenvolvedor Full Stack","mensagem":"<h2>✅ Inscrição Confirmada!</h2><p>Olá <strong>Douglas</strong>,</p><p>Recebemos sua candidatura para a vaga de <strong>Desenvolvedor Full Stack</strong>!</p><h3>📋 Próximos Passos:</h3><ul><li>✅ Seu currículo foi recebido com sucesso</li><li>⏰ Nossa equipe analisará seu perfil em até 5 dias úteis</li><li>📞 Você receberá retorno por email e/ou WhatsApp</li></ul><p>Dúvidas? Entre em contato: rh@fgservices.com.br</p>"}' -TimeoutSec 30
```

#### **Template 2 - 📋 Em Análise:**
```powershell
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"douglas.mds24@gmail.com","assunto":"📋 Sua candidatura está em análise","mensagem":"<h2>📋 Candidatura em Análise</h2><p>Olá <strong>Douglas</strong>,</p><p>Sua candidatura para <strong>Desenvolvedor Full Stack</strong> está sendo analisada por nossa equipe de RH.</p><p><strong>Status atual:</strong> Em Análise 🔍</p><p>Você receberá retorno em breve! 😊</p>"}' -TimeoutSec 30
```

#### **Template 3 - 🎉 Convite para Entrevista:**
```powershell
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"douglas.mds24@gmail.com","assunto":"🎉 PARABÉNS! Convite para Entrevista","mensagem":"<h1>🎉 PARABÉNS!</h1><h2>Você foi selecionado para entrevista!</h2><p>Olá <strong>Douglas</strong>,</p><p>Você foi <strong>selecionado(a)</strong> para a próxima etapa do processo seletivo para <strong>Desenvolvedor Full Stack</strong>!</p><h3>📅 Detalhes:</h3><p><strong>Data:</strong> 05/11/2025<br><strong>Horário:</strong> 14:00<br><strong>Local:</strong> Online (Google Meet)</p><p><strong>Por favor, confirme sua presença!</strong> ✅</p>"}' -TimeoutSec 30
```

#### **Template 4 - 🎊 Candidato Aprovado:**
```powershell
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"douglas.mds24@gmail.com","assunto":"🎊 PARABÉNS! Você foi APROVADO!","mensagem":"<h1>🎊🎉🎈 PARABÉNS Douglas!</h1><h2>VOCÊ FOI APROVADO(A)!</h2><p>É com imenso prazer que informamos que você foi <strong>APROVADO(A)</strong> para a vaga de <strong>Desenvolvedor Full Stack</strong>!</p><h3>🎯 Próximos Passos:</h3><ol><li>Documentação será solicitada em breve</li><li>Contrato será enviado para assinatura</li><li>Cronograma de integração será enviado</li></ol><p>Bem-vindo(a) à equipe FG Services! 🚀</p>"}' -TimeoutSec 30
```

#### **Template 5 - 💼 Feedback do Processo:**
```powershell
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"douglas.mds24@gmail.com","assunto":"💼 Feedback do Processo Seletivo","mensagem":"<h2>💼 Feedback do Processo Seletivo</h2><p>Olá <strong>Douglas</strong>,</p><p>Agradecemos seu interesse pela vaga de <strong>Desenvolvedor Full Stack</strong>.</p><p><strong>Pontos Positivos:</strong></p><ul><li>✅ Excelente experiência técnica</li><li>✅ Boa comunicação</li><li>✅ Perfil alinhado com a vaga</li></ul><p>Continue acompanhando nossas oportunidades!</p><p>Sucesso em sua jornada profissional! 🌟</p>"}' -TimeoutSec 30
```

---

### **📧 Email 2: rh-2@fgservices.com.br**

#### **Todos os 5 templates:**
```powershell
# Template 1
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-2@fgservices.com.br","assunto":"✅ Inscrição Confirmada - Analista de RH","mensagem":"<h2>✅ Inscrição Confirmada!</h2><p>Recebemos sua candidatura para <strong>Analista de RH</strong>!</p>"}' -TimeoutSec 30

# Template 2
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-2@fgservices.com.br","assunto":"📋 Em Análise","mensagem":"<h2>📋 Candidatura em Análise</h2><p>Sua candidatura está sendo analisada! 🔍</p>"}' -TimeoutSec 30

# Template 3
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-2@fgservices.com.br","assunto":"🎉 Convite para Entrevista","mensagem":"<h1>🎉 Você foi selecionado para entrevista!</h1>"}' -TimeoutSec 30

# Template 4
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-2@fgservices.com.br","assunto":"🎊 APROVADO!","mensagem":"<h1>🎊 VOCÊ FOI APROVADO!</h1>"}' -TimeoutSec 30

# Template 5
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-2@fgservices.com.br","assunto":"💼 Feedback","mensagem":"<h2>💼 Feedback do Processo</h2>"}' -TimeoutSec 30
```

---

### **📧 Email 3: rh-3@fgservices.com.br**

```powershell
# Template 1
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-3@fgservices.com.br","assunto":"✅ Inscrição Confirmada","mensagem":"<h2>✅ Inscrição Confirmada!</h2>"}' -TimeoutSec 30

# Template 2
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-3@fgservices.com.br","assunto":"📋 Em Análise","mensagem":"<h2>📋 Em Análise</h2>"}' -TimeoutSec 30

# Template 3
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-3@fgservices.com.br","assunto":"🎉 Entrevista","mensagem":"<h1>🎉 Entrevista marcada!</h1>"}' -TimeoutSec 30

# Template 4
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-3@fgservices.com.br","assunto":"🎊 APROVADO","mensagem":"<h1>🎊 APROVADO!</h1>"}' -TimeoutSec 30

# Template 5
Invoke-RestMethod -Uri "https://trabalhe-conoscoserver-production.up.railway.app/comunicacao/testar-email" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"destinatario":"rh-3@fgservices.com.br","assunto":"💼 Feedback","mensagem":"<h2>💼 Feedback</h2>"}' -TimeoutSec 30
```

---

## 📋 **INSTRUÇÕES:**

1. **Copie e execute** cada comando **um por vez**
2. **Aguarde 3-5 segundos** entre cada envio
3. **Verifique** as caixas de entrada (e SPAM)
4. **Total**: 15 emails (5 templates × 3 destinatários)

---

## ✅ **Checklist:**

- [ ] 5 emails para douglas.mds24@gmail.com
- [ ] 5 emails para rh-2@fgservices.com.br
- [ ] 5 emails para rh-3@fgservices.com.br

---

**Tempo estimado: 5-10 minutos** ⏱️

