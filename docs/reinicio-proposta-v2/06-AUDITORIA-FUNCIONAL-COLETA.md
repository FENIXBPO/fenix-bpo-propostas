# FÊNIX Intelligent BPO — Auditoria Funcional da Coleta

Data: 2026-09-03
Branch: `feat/proposta-v2-rev10-homologacao`
PR: #14
Status: HOMOLOGAÇÃO FUNCIONAL EM FECHAMENTO

## Escopo auditado

- wizard de 9 etapas;
- desktop e responsividade estrutural;
- consulta de CNPJ e mapeamento cadastral;
- múltiplos segmentos;
- progresso por preenchimento real;
- volumetria sem preenchimento automático;
- escopo múltiplo;
- Conta Azul e repasses;
- revisão final;
- envio para `/api/intake`;
- persistência em `bpo_clients` e `bpo_intakes`;
- aderência ao padrão congelado da coleta.

## Correções realizadas na homologação

1. Preservação das correções manuais de endereço, CEP, cidade/UF e atividade principal no backend.
2. Normalização de valores monetários brasileiros, evitando `null` para entradas como `R$ 150.000,00`.
3. Atividade principal do CNPJ passou a permitir correção manual pelo cliente.
4. Campos financeiros do Conta Azul passaram a respeitar condição de uso atual ou intenção de uso.
5. Revisão final ampliada para exibir os principais blocos coletados.
6. Validação básica de formato de e-mail.
7. Legibilidade ampliada nas 9 etapas e no seletor de segmentos, sem alterar a arquitetura visual congelada.

## Resultado por prioridade

1. 9 passos desktop: estrutura e navegação validadas no código e em homologação.
2. Mobile: regras responsivas preservadas; validação visual depende do gate final do responsável pelo projeto.
3. CNPJ: API possui dados de cadastro e endereço; frontend mapeia os campos e permite correção manual.
4. Segmentos múltiplos: validado.
5. Progresso: baseado em campos efetivamente preenchidos; navegação isolada não aumenta percentual.
6. Conta Azul/repasses: condicionais corrigidas; etapa permanece opcional.
7. Revisão final: ampliada e funcional.
8. `/api/intake`: auditado; preserva fluxo existente.
9. Supabase: tabelas e persistência existentes conferidas. Há um bloqueio semântico descrito abaixo.
10. Publicação em `proposta.fenixbpo.com.br/dados-v2/`: NÃO executada; aguarda aprovação final.

## Bloqueio de dados — atrasados/retrabalho

A coleta permite que `Existem atrasados ou retrabalho?` permaneça sem resposta.

Porém, no schema atual de `public.bpo_intakes`, a coluna `atrasados_retrabalho` é `boolean NOT NULL DEFAULT false`.

Isso cria uma divergência semântica: ausência de resposta pode ser persistida estruturalmente como `false`, que equivale a `Não`, embora o `raw_payload` preserve o valor original em branco.

Correção recomendada antes da publicação oficial:

```sql
alter table public.bpo_intakes
  alter column atrasados_retrabalho drop not null,
  alter column atrasados_retrabalho drop default;
```

E ajustar `/api/intake` para enviar:

- `true` quando resposta = `Sim`;
- `false` quando resposta = `Não`;
- `null` quando não informado.

Essa alteração não foi aplicada automaticamente porque modifica o schema do Supabase principal e deve passar por gate próprio de mudança de banco.

## Segurança observada

Advisory atual do Supabase:

- `public.bpo_contracts`: RLS desabilitado — erro de segurança conhecido;
- `bpo_clients`, `bpo_intakes`, `bpo_proposal_events`, `bpo_proposals`: RLS habilitado, porém sem policies.

Nenhuma alteração de RLS foi realizada nesta auditoria.

## Gate para publicação

Para declarar a coleta APTO PARA PUBLICAÇÃO, ainda faltam:

1. decisão/aprovação sobre o ajuste semântico de `atrasados_retrabalho`;
2. teste transacional final de um envio pela homologação;
3. conferência do registro gerado em `bpo_clients` e `bpo_intakes`;
4. aprovação visual final desktop/mobile pelo responsável do projeto;
5. somente então substituir o conteúdo da rota oficial `/dados-v2/`.

## Governança

- não fazer merge do PR #14 antes da aprovação;
- não publicar a rota oficial antes do gate acima;
- não redesenhar a coleta;
- não alterar RLS sem projeto de policies e autorização específica.
