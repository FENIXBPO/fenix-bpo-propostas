# Master Oficial congelado - manifesto técnico

Regra soberana: **Use o Master Oficial congelado. Alterar somente dados dinâmicos. Não redesenhar, não reinterpretar e não alterar o visual sem aprovação explícita.**

## Referências homologadas

- PPTX aprovado recebido: `FENIX_PROPOSTA_ALFA_HOMOLOGACAO_APROVADA_V1`
- SHA-256 PPTX aprovado: `67d7610ccc9b4b91e05eea98bffea227de7d8facb616dbc3ed42a53121a41b47`
- PDF aprovado: `FENIX_PROPOSTA_ALFA_HOMOLOGACAO_APROVADA_V1`
- SHA-256 PDF aprovado: `98147c9bcc21c5ff64b0f8ec18058ee8852147261cc110f55a1d0bd26dbd9108`
- Master técnico com tokens dinâmicos: `FENIX_PROPOSTA_HOMOLOGACAO_MASTER_HIBRIDO_V1_TECH.pptx`
- SHA-256 Master técnico: `252a46615b311cc579e3f144c06ea40b4f088f3b1cfc19f5f1a118919ae6b81b`

O Master técnico é derivado do PPTX aprovado por substituição de texto em XML; não recria slides, fundos, imagens, caixas, tipografia ou coordenadas.

## Teste de regressão ALFA

Foi preenchido o Master técnico novamente com os dados ALFA e exportado para PDF via LibreOffice. Comparação pixel a pixel, 160 dpi, contra o PDF aprovado:

- páginas: 8 x 8;
- páginas alteradas: 0;
- diferença visual: 0,0% em todas as páginas.

Portanto, o mecanismo de tokenização + preenchimento preservou integralmente a renderização do caso homologado.

## Teste de variação

Também foi gerado um segundo cliente fictício, com nome, segmento, cenário, indicadores, escopo, ERP, implantação e valores diferentes. O teste incluiu `software_monthly = 0`; nesse caso o bloco de software e a instrução interna correspondente são removidos sem redistribuir os demais boxes, preservando as posições do Master.

## Campos dinâmicos autorizados

Cliente, segmento, data, cenário, desafios, objetivo, quantidade de CNPJs, bancos/contas, volume, notas de indicadores, introdução do escopo, até quatro itens de escopo operacional, até dois itens gerenciais, ERP, prazo de implantação, dependências, badge comercial, mensalidade FÊNIX, software/repasse, implantação, total mensal, observação de software, condições comerciais e código da proposta.

## Gatilhos de bloqueio

A geração deve falhar quando: CFO não aprovou; total mensal não corresponde a mensalidade FÊNIX + repasses recorrentes; valores são negativos; ERP está vazio quando há repasse recorrente; campos obrigatórios estão vazios; limites de texto indicam risco de overflow; permanecem tokens não resolvidos.

## Asset binário

O arquivo PPTX Master técnico é binário e grande. Ele deve ser armazenado como asset controlado do projeto no caminho lógico `master-template/FENIX_PROPOSTA_HOMOLOGACAO_MASTER_HIBRIDO_V1_TECH.pptx` ou em storage privado equivalente, sempre validado pelo SHA-256 acima. O código nunca deve aceitar outro Master silenciosamente.
