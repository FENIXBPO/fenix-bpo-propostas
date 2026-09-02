-- FÊNIX BPO — DRAFT DE MIGRAÇÃO INTAKE V2
-- Status: NÃO EXECUTAR EM PRODUÇÃO SEM HOMOLOGAÇÃO.
-- Data: 2026-09-02

begin;

alter table public.bpo_clients
  add column if not exists responsavel_cargo text;

alter table public.bpo_intakes
  add column if not exists operational_context jsonb not null default '{}'::jsonb,
  add column if not exists objectives jsonb not null default '[]'::jsonb;

comment on column public.bpo_clients.responsavel_cargo is
  'Cargo do responsável informado na coleta comercial.';

comment on column public.bpo_intakes.operational_context is
  'Contexto operacional estruturado da coleta: ERP, financeiro interno, contabilidade, frequência, repasses e demais atributos correlatos.';

comment on column public.bpo_intakes.objectives is
  'Objetivos declarados pelo cliente no levantamento comercial. Não representa escopo aprovado.';

-- Verificações previstas antes do COMMIT real:
-- 1. consumidores atuais continuam funcionando com as novas colunas;
-- 2. API /api/intake passa a preenchê-las mantendo raw_payload;
-- 3. leitura CFO mostra os novos campos;
-- 4. proposta usa apenas dados aprovados e não publica automaticamente;
-- 5. advisors de segurança/performance revisados.

rollback;
