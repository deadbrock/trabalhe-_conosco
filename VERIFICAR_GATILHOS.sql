-- Script para verificar configuração dos gatilhos

-- 1. Ver todos os gatilhos configurados
SELECT 
    id,
    evento,
    descricao,
    email_ativo,
    whatsapp_ativo,
    template_email_id,
    template_whatsapp_id,
    delay_minutos
FROM configuracao_gatilhos
ORDER BY id;

-- 2. Ver todos os templates disponíveis
SELECT 
    id,
    tipo,
    nome,
    assunto,
    ativo
FROM templates
WHERE ativo = true
ORDER BY tipo, nome;

-- 3. Verificar se gatilhos estão vinculados aos templates
SELECT 
    g.evento,
    g.email_ativo,
    g.template_email_id,
    te.nome as template_email_nome,
    g.whatsapp_ativo,
    g.template_whatsapp_id,
    tw.nome as template_whatsapp_nome
FROM configuracao_gatilhos g
LEFT JOIN templates te ON g.template_email_id = te.id
LEFT JOIN templates tw ON g.template_whatsapp_id = tw.id
ORDER BY g.evento;

