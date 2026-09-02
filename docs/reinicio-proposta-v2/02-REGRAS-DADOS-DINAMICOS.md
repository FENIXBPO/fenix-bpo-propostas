# Regras de Dados Dinâmicos — Proposta V2

Status: OFICIAL PARA HOMOLOGAÇÃO

## 1. Fonte única de dados

A coleta de dados do cliente é a base oficial de preenchimento da proposta.

A proposta pode interpretar e reescrever os dados com linguagem comercial profissional, mas não pode inventar fatos, valores, dores ou promessas.

Valores comerciais devem passar pela validação CFO antes do envio.

## 2. Blocos mínimos da coleta

### Empresa
- CNPJ;
- razão social;
- nome fantasia;
- endereço;
- cidade/UF;
- segmento.

### Responsável
- nome;
- cargo;
- e-mail;
- telefone/WhatsApp.

### Diagnóstico
- descrição do negócio;
- principal dor;
- expectativa;
- objetivos;
- atividade que mais toma tempo.

### Estrutura e volume
- faturamento/faixa;
- recebimentos;
- pagamentos;
- notas fiscais;
- bancos;
- contas;
- cartões;
- CNPJs/unidades;
- centros de custo;
- ERP/sistema atual;
- financeiro interno;
- contabilidade;
- aprovador financeiro;
- processo de aprovação.

### Escopo
- serviços selecionados e limites aplicáveis.

### Comercial
- mensalidade FÊNIX;
- implantação;
- desconto;
- CNPJs incluídos;
- limite de movimentações;
- contas bancárias incluídas;
- ERP/software;
- Conta Azul: sim/não;
- valor mensal do Conta Azul;
- Conta Azul já contratado pelo cliente: sim/não;
- forma de cobrança: direto pelo fornecedor ou repasse FÊNIX;
- outros sistemas/repasses;
- extras autorizados;
- observações comerciais.

## 3. Regra do Conta Azul

Se `usa_conta_azul = não`:
- não exibir cobrança do Conta Azul.

Se `usa_conta_azul = sim`:
- exibir valor do Conta Azul vindo da coleta/validação;
- indicar quem cobra/paga;
- nunca inferir valor automaticamente sem fonte aprovada.

### Se repassado pela FÊNIX
Exibir:
- Mensalidade FÊNIX;
- Conta Azul;
- Total mensal cobrado/operacional;
- Implantação separada.

### Se pago diretamente ao fornecedor
Exibir:
- Mensalidade FÊNIX;
- Conta Azul — pagamento direto ao fornecedor;
- Custo mensal total estimado da estrutura;
- Implantação FÊNIX separada.

## 4. Receita versus repasse

O sistema deve distinguir:

### Receita FÊNIX
Valor dos serviços prestados pela FÊNIX.

### Repasses
Valores de software ou terceiros apresentados/cobrados junto à operação.

### Custo mensal total do cliente
Mensalidade FÊNIX + sistemas/repasses aplicáveis.

Repasses não são receita FÊNIX e não devem contaminar MRR de serviços, margem ou indicadores internos sem regra contábil/comercial específica.

## 5. Fórmulas de apresentação

Quando o repasse é faturado pela FÊNIX:
`total_mensal_cliente = mensalidade_fenix + repasses_mensais`

Quando o software é pago diretamente pelo cliente:
`custo_total_estrutura = mensalidade_fenix + custos_diretos_terceiros`

Mas:
`receita_fenix = mensalidade_fenix`

## 6. Escopo variável

- pequeno: até 6 itens;
- médio: 7 a 12 itens;
- amplo: acima de 12 itens.

Escopo amplo deve ser agrupado por categoria, sem forçar fonte pequena.

## 7. Conteúdo interpretativo

A IA pode:
- sintetizar;
- organizar;
- profissionalizar linguagem;
- agrupar informações;
- transformar respostas em diagnóstico comercial.

A IA não pode:
- criar fatos;
- ampliar problemas não informados;
- prometer economia, lucro ou previsibilidade garantida;
- alterar escopo ou valores aprovados.

## 8. Regra de rastreabilidade

Cada campo exibido na proposta deve ser rastreável a:
- coleta;
- regra do sistema;
- ou aprovação/ajuste registrado pelo CFO.

Nenhum valor comercial deve existir apenas no template visual.