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
8. Campo `atrasados_retrabalho` corrigido para preservar semanticamente Sim / Não / não informado.

## Resultado por prioridade

1. 9 passos desktop: estrutura e navegação validadas no código e em homologação.
2. Mobile: regras responsivas preservadas; validação visual depende do gate final do responsável pelo projeto.
3. CNPJ: API possui dados de cadastro e endereço; frontend mapeia os campos e permite correção manual.
4. Segmentos múltiplos: validado.
5. Progresso: baseado em campos efetivamente preenchidos; navegação isolada não aumenta percentual.
6. Conta Azul/repasses: condicionais corrigidas; etapa permanece opcional.
7. Revisão final: ampliada e funcional.
8. `/api/intake`: auditado e ajustado para preservar valores nulos quando a resposta não foi informada.
9. Supabase: migration aplicada e schema conferido.
10. Publicação em `proposta.fenixbpo.com.br/dados-v2/`: NÃO executada; aguarda aprovação final.

## Correção de dados — atrasados/retrabalho

Problema identificado: a coleta permite que `Existem atrasados ou retrabalho?` permaneça sem resposta, mas a coluna `public.bpo_intakes.atrasados_retrabalho` era `boolean NOT NULL DEFAULT false`, convertendo ausência de resposta em `Não`.

Com autorização expressa do responsável pelo projeto, foi aplicada no Supabase principal a migration:

`allow_null_atrasados_retrabalho`

Resultado final do schema:

- `atrasados_retrabalho` aceita `NULL`;
- não possui mais default `false`.

O `/api/intake` da branch de homologação também foi ajustado para gravar:

- `true` quando resposta = `Sim`;
- `false` quando resposta = `Não`;
- `null` quando não informado.

O schema foi consultado após a migration e confirmou `is_nullable = YES` e `column_default = null`.

## Segurança observada

Advisory atual do Supabase:

- `public.bpo_contracts`: RLS desabilitado — erro de segurança conhecido;
- `bpo_clients`, `bpo_intakes`, `bpo_proposal_events`, `bpo_proposals`: RLS habilitado, porém sem policies.

Nenhuma alteração de RLS foi realizada nesta auditoria.

## Gate para publicação

O bloqueio semântico de banco foi resolvido.

Para declarar a coleta APTO PARA PUBLICAÇÃO, ainda faltam:

1. teste final de um envio completo pela interface da homologação;
2. conferência do registro gerado em `bpo_clients` e `bpo_intakes`;
3. aprovação visual final desktop/mobile pelo responsável do projeto;
4. somente então substituir o conteúdo da rota oficial `/dados-v2/`.

Observação: a Preview Protection da Vercel continua podendo interceptar chamadas automatizadas externas aos endpoints da preview. Isso não altera o código aprovado, mas pode exigir que o teste final de envio seja disparado pela própria interface de homologação autenticada/compartilhada.

## Governança

- não fazer merge do PR #14 antes da aprovação;
- não publicar a rota oficial antes do gate acima;
- não redesenhar a coleta;
- não alterar RLS sem projeto de policies e autorização específica.
