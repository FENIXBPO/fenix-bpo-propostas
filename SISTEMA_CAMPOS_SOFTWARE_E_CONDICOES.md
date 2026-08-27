# Campos novos — Sistema, software e condições comerciais

Objetivo: permitir que a coleta, análise interna e proposta final tratem corretamente clientes que possuem ou não sistema, cobranças de software, implantação e condições comerciais especiais.

## Coleta do cliente

Adicionar bloco **Sistema atual e operação**:

- `possui_sistema` — Sim/Não
- `sistema_atual` — Conta Azul / Omie / Nibo / ERP próprio / Outro / Nenhum
- `sistema_outro` — texto livre quando necessário
- `sistema_sera_implantado_pela_fenix` — Sim/Não
- `observacao_sistema` — texto livre

A coleta pública não deve pedir valores comerciais internos.

## Análise interna / Comercial

Adicionar bloco **Software e condições aprovadas**:

- `software_nome`
- `software_valor_mensal`
- `software_cobrado_a_parte` — Sim/Não
- `software_forma_cobranca` — Pré-pago / Pós-pago / Incluso na mensalidade
- `software_inicio_cobranca` — Assinatura do contrato / Início da implantação / Início da operação
- `implantacao_aprovada`
- `implantacao_condicao_pagamento`
- `mensalidade_pacote_referencia`
- `desconto_comercial_valor`
- `desconto_comercial_motivo`
- `mensalidade_aprovada`
- `condicoes_comerciais_observacoes`

## Regras de validação

1. A proposta só pode ser gerada quando `mensalidade_aprovada` e `implantacao_aprovada` estiverem preenchidas.
2. Se `software_cobrado_a_parte = Sim`, exigir nome, valor, forma e início da cobrança.
3. Se houver desconto, exibir pacote de referência, benefício concedido e valor final, sem expor custo interno, margem, piso ou fórmula de precificação.
4. Alterações de volume, CNPJs, bancos, cartões, filiais, centros de custo, contratos, comissões ou escopo podem gerar revisão comercial mediante alinhamento prévio.
5. A Fênix permanece caracterizada como apoio administrativo-financeiro. Autorizações de pagamentos, movimentação de recursos e decisões permanecem com o cliente.

## Exemplo — Confiar Imóveis

- Pacote de referência: R$ 3.250,00/mês
- Condição especial pela parceria com a contabilidade: R$ 1.000,00/mês
- Mensalidade contratual: R$ 2.250,00/mês
- Implantação: R$ 3.000,00
- Software: Conta Azul
- Software: R$ 239,90/mês
- Cobrança: à parte
- Forma: pré-paga
- Início: na assinatura do contrato
