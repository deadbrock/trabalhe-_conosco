-- ⚠️ Script SQL para deletar APENAS os 3 candidatos de teste
-- Execute este SQL diretamente no painel do Railway

-- 1. VERIFICAR quais candidatos serão deletados
SELECT id, nome, email, created_at 
FROM candidatos 
WHERE nome IN (
  'Douglas marques de souza',
  'Josiellen Santos Da Conceição',
  'CLAUDIA AMARAL'
)
ORDER BY id;

-- 2. DELETAR (execute apenas após confirmar acima)
-- Descomente as linhas abaixo para executar:

/*
BEGIN;

-- Deletar histórico de comunicação
DELETE FROM historico_comunicacao 
WHERE candidato_id IN (
  SELECT id FROM candidatos 
  WHERE nome IN (
    'Douglas marques de souza',
    'Josiellen Santos Da Conceição',
    'CLAUDIA AMARAL'
  )
);

-- Deletar agendamentos
DELETE FROM agendamentos 
WHERE candidato_id IN (
  SELECT id FROM candidatos 
  WHERE nome IN (
    'Douglas marques de souza',
    'Josiellen Santos Da Conceição',
    'CLAUDIA AMARAL'
  )
);

-- Deletar notas
DELETE FROM notas 
WHERE candidato_id IN (
  SELECT id FROM candidatos 
  WHERE nome IN (
    'Douglas marques de souza',
    'Josiellen Santos Da Conceição',
    'CLAUDIA AMARAL'
  )
);

-- Deletar avaliações
DELETE FROM avaliacoes 
WHERE candidato_id IN (
  SELECT id FROM candidatos 
  WHERE nome IN (
    'Douglas marques de souza',
    'Josiellen Santos Da Conceição',
    'CLAUDIA AMARAL'
  )
);

-- Deletar candidatos
DELETE FROM candidatos 
WHERE nome IN (
  'Douglas marques de souza',
  'Josiellen Santos Da Conceição',
  'CLAUDIA AMARAL'
);

COMMIT;
*/

-- 3. VERIFICAR que foram deletados
SELECT COUNT(*) as total_restante
FROM candidatos 
WHERE nome IN (
  'Douglas marques de souza',
  'Josiellen Santos Da Conceição',
  'CLAUDIA AMARAL'
);
-- Deve retornar 0

