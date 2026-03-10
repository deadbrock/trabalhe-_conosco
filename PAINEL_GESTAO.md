# 📊 Painel de Gestão - Coordenadora de RH

## 🎯 Visão Geral

O Painel de Gestão foi criado exclusivamente para a coordenadora de RH, oferecendo uma visão consolidada de **todas as filiais** (Sede e Fortaleza) com funcionalidades avançadas de gerenciamento.

## 🔐 Credenciais de Acesso

**Email:** `coordenadora@fgservices.com.br`  
**Senha:** `coordenadora@2024`  

⚠️ **IMPORTANTE:** Troque a senha após o primeiro acesso!

## 📍 Como Acessar

1. Acesse o sistema: [URL do sistema]
2. Faça login com as credenciais acima
3. Você será direcionado automaticamente para o painel de gestão
4. Ou acesse diretamente: `/rh/gestao`

## 🎨 Funcionalidades do Painel

### 1. Dashboard Principal (`/rh/gestao`)

**Métricas Gerais:**
- Total de vagas abertas (todas as filiais)
- Total de candidatos na base
- Candidatos cadastrados hoje

**Visão por Filial:**
- Vagas abertas por filial
- Total de candidatos por filial
- Candidatos novos, em análise, pré-selecionados e aprovados
- Candidatos cadastrados hoje em cada filial

### 2. Gestão de Usuários (`/rh/gestao/usuarios`)

**Funcionalidades:**
- ✅ Listar todos os usuários do sistema
- ✅ Criar novos usuários (admin ou gestor)
- ✅ Editar usuários existentes
- ✅ Excluir usuários
- ✅ Filtrar por filial e perfil
- ✅ Atribuir usuários a filiais específicas

**Perfis Disponíveis:**
- **Admin:** Acesso aos dados da sua filial apenas
- **Gestor:** Acesso a todas as filiais (como você!)

### 3. Relatórios Consolidados (`/rh/gestao/relatorios`)

**Funil de Conversão:**
- Distribuição de candidatos por status
- Percentual de cada etapa do funil
- Visão por filial ou consolidada

**Performance de Vagas:**
- Estatísticas de cada vaga
- Total de candidatos, aprovados e reprovados
- Taxa de aprovação por vaga
- Status das vagas (ativa/inativa)

**Tempo Médio:**
- Tempo médio (em dias) que candidatos ficam em cada status
- Análise por filial
- Identificação de gargalos no processo

**Evolução Temporal:**
- Candidatos cadastrados nos últimos 30 dias
- Aprovados e reprovados por dia
- Tendências de crescimento

### 4. Exportação de Dados

**Formatos Disponíveis:**
- 📄 **JSON:** Para integração com outros sistemas
- 📊 **CSV:** Para análise em Excel/Google Sheets

**Dados Exportáveis:**
- Base completa de candidatos (todas as filiais)
- Todas as vagas com estatísticas
- Filtros por filial disponíveis

## 🔍 Filtros e Buscas

Todos os relatórios podem ser filtrados por:
- **Filial:** Sede, Fortaleza ou Todas
- **Período:** Últimos 30 dias (padrão)
- **Status:** Novo, Em análise, Pré-selecionado, etc.

## 🛡️ Segurança e Privacidade

- ✅ Apenas usuários com perfil **"gestor"** têm acesso ao painel
- ✅ Outros perfis (admin) não conseguem acessar estas páginas
- ✅ Todas as requisições são autenticadas via JWT
- ✅ Logs de auditoria registram todas as ações

## 📱 Navegação Rápida

```
/rh/gestao              → Dashboard principal
/rh/gestao/usuarios     → Gestão de usuários
/rh/gestao/relatorios   → Relatórios consolidados
```

## 🚀 Próximos Passos

1. **Primeiro Acesso:**
   - Faça login com as credenciais fornecidas
   - Troque sua senha imediatamente
   - Explore o dashboard e familiarize-se com as métricas

2. **Configuração Inicial:**
   - Revise os usuários existentes
   - Crie novos usuários se necessário
   - Configure permissões adequadas

3. **Uso Diário:**
   - Monitore métricas diárias no dashboard
   - Analise relatórios semanalmente
   - Exporte dados mensalmente para análises externas

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Entre em contato com o suporte técnico
- Consulte a documentação completa do sistema
- Verifique os logs de auditoria para rastrear ações

## 📝 Notas Técnicas

**Versão do Sistema:** 1.5.0  
**Data de Implementação:** 10/03/2026  
**Tecnologias:** Next.js (Frontend) + Node.js/Express (Backend)  
**Banco de Dados:** PostgreSQL  

---

**Desenvolvido com ❤️ para FG Services**
