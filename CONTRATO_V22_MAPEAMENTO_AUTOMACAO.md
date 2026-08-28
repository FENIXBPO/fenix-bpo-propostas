# Mapeamento de Automação — Contrato FÊNIX BPO v22

## Fonte de verdade

O contrato nunca calcula preço nem redefine escopo. Ele consome exclusivamente a versão da proposta aprovada pelo CFO e aceita pelo cliente.

Fluxo: `coleta -> sugestão automática -> aprovação CFO -> publicação -> aceite cliente -> autorização CFO contrato -> geração`.

## Identificação da CONTRATANTE

Origem: `bpo_clients` + dados cadastrais aprovados.

- `cliente_razao_social`
- `cliente_nome_fantasia`
- `cliente_cnpj`
- `cliente_endereco`
- `cliente_cidade_uf`
- `cliente_cep`
- `cliente_representante`
- `cliente_representante_cpf`
- `cliente_email`
- `cliente_whatsapp`

Campos ausentes bloqueiam geração final para assinatura.

## Anexo I — Escopo e limites

Origem: `bpo_proposals.approved_scope`, `commercial_terms` e `assumptions` da versão aceita.

- `anexo_i_servicos_incluidos` <- `approved_scope.operational + approved_scope.managerial`
- `limite_cnpjs` <- `commercial_terms.cnpjs`
- `limite_lancamentos_cnpj` <- `commercial_terms.launch_limit_per_cnpj`
- `limite_lancamentos_grupo` <- `commercial_terms.launch_limit_group`
- `limite_contas_bancarias` <- `commercial_terms.bank_accounts_included`
- `limites_especificos` <- premissas específicas aprovadas pelo CFO

## Anexo II — Valores e condições comerciais

Origem: `bpo_proposals.commercial_terms`.

- `valor_pacote_base` <- `base_monthly`
- `desconto_aprovado` <- `discount`
- `motivo_desconto` <- `discount_reason`
- `mensalidade_final` <- `final_monthly`
- `valor_implantacao` <- `implementation`
- `software_nome` <- `software_name`
- `software_valor_cnpj` <- `software_per_cnpj`
- `software_valor_total` <- `software_total`
- `valor_conta_bancaria_adicional` <- `additional_bank_account`
- `vencimento` <- condição aprovada
- `forma_pagamento` <- condição aprovada
- `valor_hora_tecnica` <- tabela comercial aprovada ou campo específico
- `criterio_retrabalho` <- regra comercial aprovada

## Governança obrigatória

1. Apenas proposta `publicada` pode ser aceita pelo cliente.
2. Aceite muda a proposta para `proposta_aceita_aguardando_cfo`.
3. Botão `Aprovar e preparar contrato` só aparece nesse status.
4. A autorização CFO deve registrar usuário/ator, data/hora, proposta_id, versão e snapshot dos dados.
5. O contrato recebe identificador próprio e `proposal_id` de origem.
6. Contrato gerado é imutável; correções comerciais após aceite exigem nova versão de proposta ou aditivo.
7. O corpo jurídico v22 é fixo; automação só preenche placeholders e anexos.

## Bloqueios antes da geração

Bloquear se faltar qualquer um dos seguintes:

- razão social e CNPJ;
- representante legal e CPF;
- proposta aceita válida;
- mensalidade final;
- implantação (pode ser zero, mas deve estar explicitamente definida);
- escopo aprovado;
- limites do pacote;
- software e condição, quando aplicável;
- autorização final CFO.

## Confiar — referência de teste

Para o cliente padrão Confiar, o teste de integração deve validar:

- pacote base: R$ 3.300/mês;
- desconto aprovado: R$ 1.000/mês, sem sinal negativo na apresentação;
- mensalidade final: R$ 2.300/mês;
- 2 CNPJs;
- R$ 1.150 por CNPJ/mês;
- implantação: R$ 3.000;
- Conta Azul: R$ 140 por CNPJ/mês, total R$ 280/mês;
- 250 lançamentos por CNPJ/mês;
- 500 lançamentos/mês no grupo;
- até 2 contas bancárias incluídas;
- conta bancária adicional: R$ 150/mês.

Esses valores são dados de teste da proposta padrão e não pertencem ao corpo jurídico fixo do contrato.
