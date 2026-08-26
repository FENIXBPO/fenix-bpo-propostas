# Matriz CFO de Precificação v1.0

## Objetivo

Padronizar a análise interna da Fenix BPO antes da emissão de propostas. A matriz não substitui o parecer do CFO nem do Comercial: ela cria um piso técnico e uma faixa recomendada baseada em volumetria, complexidade e margem.

## Princípios

1. Volumetria mensal é o principal driver de preço.
2. Faturamento é um agravante de responsabilidade/complexidade, não o único critério.
3. Bancos, cartões, múltiplos CNPJs, filiais, centros de custo e equipe aumentam esforço operacional.
4. Implantação e mensalidade são calculadas separadamente.
5. O piso comercial nunca deve ficar abaixo do piso exigido pela margem mínima quando o custo-hora estiver informado.
6. Desconto é decisão comercial posterior, respeitando piso e limite autorizado pelo CFO.
7. Acima de 800 movimentos/mês ou em complexidade alta, a revisão manual é obrigatória.

## Faixa-base por volumetria

| Movimentos mensais estimados | Base interna |
|---|---:|
| até 80 | R$ 900 |
| 81 a 150 | R$ 1.200 |
| 151 a 300 | R$ 1.600 |
| 301 a 500 | R$ 2.200 |
| 501 a 800 | R$ 3.000 |
| acima de 800 | R$ 3.800 + revisão manual |

Movimentos são a soma informada de recebimentos, pagamentos, notas emitidas, notas recebidas e outros lançamentos.

## Adicionais mensais

| Driver | Regra |
|---|---:|
| Banco acima de 2 | + R$ 150 por banco |
| Cartão acima de 3 | + R$ 75 por cartão |
| CNPJ adicional | + R$ 350 por CNPJ |
| Filial | + R$ 200 por filial |
| Centro de custo acima de 3 | + R$ 100 por centro |
| Mais de 5 CLTs | + R$ 200 |
| Faturamento acima de R$ 300 mil | + R$ 250 |
| Faturamento acima de R$ 1 milhão | + R$ 500 em substituição ao adicional anterior |

## Fator de complexidade

- Baixa: 1,00x
- Média: 1,10x
- Alta: 1,20x e revisão manual

## Implantação

- Organizado: R$ 1.500
- Parcialmente organizado: R$ 2.500
- Desorganizado / saneamento necessário: R$ 3.500
- + R$ 500 por CNPJ adicional
- + R$ 750 se houver atrasados/retrabalho inicial
- + R$ 250 por filial

## Horas e margem

Padrão provisório da engine:

- margem-alvo: 50%
- desconto comercial máximo padrão: 10%

Fórmulas:

`custo mensal = horas estimadas × custo-hora`

`piso por margem = custo mensal / (1 - margem-alvo)`

`piso comercial = maior entre (preço estrutural - desconto máximo) e piso por margem`

`preço sugerido = maior entre preço estrutural e piso por margem + 10%`

## Benchmark externo — agosto/2026

A pesquisa de mercado foi usada apenas como referência. Foram encontradas ofertas de entrada em torno de R$ 800–900/mês para escopos básicos, operações completas com frequência entre R$ 1.500 e R$ 3.500/mês e referências entre R$ 2.000 e R$ 4.500 para empresas de menor porte dependendo do escopo e complexidade.

Conclusão interna: a tabela histórica da Fenix deve ser tratada como piso de referência, e não como regra principal para novas propostas completas.

Fontes públicas consultadas em 25/08/2026: OMNA Empresarial, Planeja BPO, Apollo Gestão Financeira, CaixaFlow, Index Consult, NS BPO e Sunsoft Consulting.

## Status

Versão CFO 1.0. Revisar após comparar horas estimadas versus timesheet real dos primeiros clientes analisados.
