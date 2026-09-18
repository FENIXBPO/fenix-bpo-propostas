# MASTER OFICIAL — PDF GENERATOR V1

## Regra soberana

> Use o Master Oficial congelado. Alterar somente dados dinâmicos. Não redesenhar, não reinterpretar e não alterar o visual sem aprovação explícita.

## Fonte visual oficial

Referência aprovada de homologação: `FENIX_PROPOSTA_HOMOLOGACAO_MASTER_HIBRIDO_V1`.

O gerador oficial de proposta não deve recriar a apresentação em HTML/CSS/SVG ou por IA. O fluxo deve preencher somente campos dinâmicos autorizados no Master e exportar o resultado para PDF.

## Estratégia de execução homologada

A execução será dividida em duas camadas para preservar o visual:

1. **Master visual imutável**: PDF-base produzido exclusivamente a partir do PPTX Master aprovado, com todos os elementos fixos preservados e regiões dinâmicas limpas.
2. **Runtime de dados**: `lib/master-pdf-runtime.js` escreve apenas os campos dinâmicos nas coordenadas previamente homologadas do Master.

O runtime não desenha fundos, logos, boxes, cores, imagens ou composição. Esses elementos permanecem no PDF-base congelado. O runtime também valida o `SHA-256` do PDF-base antes de gerar qualquer proposta; se o hash divergir, a geração deve ser bloqueada.

Essa arquitetura evita depender de conversão PPTX → PDF dentro da função serverless e reduz o risco de variação visual entre ambientes.

## Fluxo homologado

Coleta → análise/validação CFO → snapshot aprovado → validação do Master por hash → preenchimento dos campos dinâmicos → PDF → QA técnico/visual → publicação → envio → aceite → validação FÊNIX/CFO → contrato → assinatura → implantação.

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
- quando repasses recorrentes forem zero, o bloco correspondente deve ficar oculto no Master-base específico homologado para `repasse = 0`; o runtime não deve cobrir o design com máscaras artificiais
- IA não pode inventar preço, escopo, prazo, SLA ou condição comercial
- CFO deve validar valores antes da geração

## Regras jurídicas/operacionais

A FÊNIX atua como BPO financeiro e apoio administrativo-financeiro. Autorizações, movimentações de recursos e decisões financeiras permanecem sob responsabilidade do cliente.

## QA obrigatório antes da publicação

1. validar presença dos campos obrigatórios;
2. validar fórmula do total mensal;
3. validar implantação fora do total mensal;
4. validar ocultação de repasses quando zero;
5. validar `master_id` e SHA-256 do PDF-base;
6. validar quantidade esperada de 8 páginas;
7. detectar overflow em campos dinâmicos;
8. comparar visualmente com o Master, aceitando diferença apenas nas regiões dinâmicas autorizadas;
9. bloquear publicação se qualquer teste falhar.

## Estado técnico da homologação

- snapshot CFO integrado ao endpoint interno existente para não ultrapassar o limite de funções serverless;
- Vercel Preview voltou ao estado `READY` após essa consolidação;
- gerador PPTX por tokens permanece como ferramenta de regressão/homologação;
- runtime PDF foi implementado separadamente e possui teste de 8 páginas, hash, CFO gate, fórmula comercial e cenário de repasse zero;
- regressão ALFA já comprovou que o PPTX técnico preenchido pode reproduzir o PDF aprovado sem diferença visual nas 8 páginas;
- a ativação operacional do runtime depende de armazenar o **PDF-base limpo derivado do Master atual** em local controlado e registrar seu SHA-256 definitivo.

## Governança

- desenvolver somente em branch/ambiente de homologação;
- não alterar painel;
- não alterar visual do Master;
- não fazer merge ou publicar em produção sem autorização explícita.
