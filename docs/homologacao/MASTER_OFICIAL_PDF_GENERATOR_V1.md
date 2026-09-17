# MASTER OFICIAL — PDF GENERATOR V1

## Regra soberana

> Use o Master Oficial congelado. Alterar somente dados dinâmicos. Não redesenhar, não reinterpretar e não alterar o visual sem aprovação explícita.

## Fonte visual oficial

Referência aprovada de homologação: `FENIX_PROPOSTA_HOMOLOGACAO_MASTER_HIBRIDO_V1`.

O gerador oficial de proposta não deve recriar a apresentação em HTML/CSS/SVG ou por IA. O fluxo deve preencher somente campos dinâmicos autorizados no Master e exportar o resultado para PDF.

## Fluxo homologado

Coleta → análise/validação CFO → snapshot aprovado → preenchimento do Master → exportação PDF → QA técnico/visual → publicação → envio → aceite → validação FÊNIX/CFO → contrato → assinatura → implantação.

## Campos dinâmicos autorizados

- nome do cliente
- razão social
- segmento
- data
- cenário atual
- desafios
- objetivo
- escopo
- quantidade de CNPJs
- bancos/contas
- volume previsto
- ERP/software
- mensalidade FÊNIX
- repasses recorrentes
- implantação
- total mensal
- validade
- condições comerciais
- dados provenientes da coleta e aprovados pelo CFO

## Regras comerciais obrigatórias

- `TOTAL_MENSAL = MENSALIDADE_FENIX + REPASSES_RECORRENTES`
- implantação é cobrança única e não entra no total mensal
- software/ERP/repasses não são receita da FÊNIX
- quando repasses recorrentes forem zero, o bloco correspondente deve ficar oculto
- IA não pode inventar preço, escopo, prazo, SLA ou condição comercial
- CFO deve validar valores antes da geração

## Regras jurídicas/operacionais

A FÊNIX atua como BPO financeiro e apoio administrativo-financeiro. Autorizações, movimentações de recursos e decisões financeiras permanecem sob responsabilidade do cliente.

## QA obrigatório antes da publicação

1. validar presença dos campos obrigatórios;
2. validar fórmula do total mensal;
3. validar implantação fora do total mensal;
4. validar ocultação de repasses quando zero;
5. validar quantidade esperada de páginas;
6. detectar overflow em campos dinâmicos;
7. comparar visualmente com o Master, aceitando diferença apenas nas regiões dinâmicas autorizadas;
8. bloquear publicação se qualquer teste falhar.

## Governança

- desenvolver somente em branch/ambiente de homologação;
- não alterar painel;
- não alterar visual do Master;
- não fazer merge ou publicar em produção sem autorização explícita.
