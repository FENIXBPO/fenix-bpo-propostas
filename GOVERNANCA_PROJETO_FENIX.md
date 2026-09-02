# FÊNIX — GOVERNANÇA DO PROJETO COMERCIAL

Status: **OFICIAL**

Este documento organiza as fontes de verdade do projeto FÊNIX BPO e define qual arquivo manda em cada assunto.

## 1. Fontes de verdade

### Proposta comercial
Autoridade visual: `FENIX_Caso_Real_Master_Limpo_Homologacao.pdf`

Manual: `MANUAL_GOLDEN_REFERENCE_FENIX.md`

Padrões complementares:
- `PADRAO_PROPOSTA_FENIX.md`
- `PADRAO_PROPOSTA_FENIX_MASTER_LIMPO_V1.md`
- `SISTEMA_CAMPOS_SOFTWARE_E_CONDICOES.md`

### Precificação e CFO
Autoridade: `PRECIFICACAO_CFO.md`

Valores exibidos ao cliente só podem vir de aprovação CFO registrada.

### Contrato
Autoridade jurídica atual: `CONTRATO_FENIX_BPO_MODELO_PADRAO_v22.md`

Mapeamento de automação: `CONTRATO_V22_MAPEAMENTO_AUTOMACAO.md`

O contrato não deve reabrir negociação comercial nem modificar o escopo aprovado sem nova validação.

### Pipeline / Painel
Rota oficial: `/painel/`

O Pipeline é interno, operacional e pode evoluir visualmente desde que preserve as regras de estado e governança.

### Coleta de dados
Rota oficial ao cliente: `/dados/`

A coleta recebe dados para entendimento e não libera proposta automaticamente.

### Central de atalhos
Rota oficial: `/atalhos/`

## 2. Fluxo oficial ponta a ponta

1. Cliente preenche a coleta.
2. Dados entram no sistema.
3. CFO analisa escopo, risco, preço e condições.
4. CFO aprova ou pede ajustes.
5. Sistema gera proposta no Golden Reference.
6. Proposta é publicada ao cliente.
7. Cliente registra aceite.
8. Aceite fica aguardando validação CFO.
9. CFO autoriza contrato.
10. Contrato é gerado a partir do modelo padrão.
11. Contrato é assinado.
12. Implantação começa.
13. Cliente entra em operação.

## 3. Estados do Pipeline

Estados visuais principais:

- Entrada
- Análise CFO
- Proposta
- Aceite
- Contrato
- Encerrado

As etapas críticas não são movidas manualmente para frente. Elas avançam por eventos reais do fluxo.

Movimentação manual permitida:

- Encerrar oportunidade;
- Reabrir oportunidade encerrada.

Históricos permanecem registrados, mas o Pipeline deve mostrar uma oportunidade ativa por CNPJ/negociação corrente.

## 4. Regras de responsabilidade

### CFO
Responsável por:
- escopo comercial aprovado;
- valores;
- implantação;
- software;
- limites;
- exceções;
- validação final do aceite;
- autorização para contrato.

### Comercial / Operação
Responsável por:
- coleta adequada;
- comunicação com cliente;
- uso do link correto;
- não alterar preço ou escopo após aprovação sem retornar ao CFO.

### Sistema
Responsável por:
- preencher dados sem reinventar o padrão;
- preservar histórico;
- impedir saltos indevidos de etapa;
- garantir que proposta publicada use o Golden Reference.

## 5. Princípios de segurança

- Nenhuma proposta antes do CFO.
- Nenhum contrato automático no aceite.
- Nenhuma alteração comercial silenciosa.
- Nenhum dado interno de margem/piso exposto ao cliente.
- Nenhum template paralelo de proposta em produção.
- Nenhuma alteração visual do Golden Reference sem homologação.

## 6. Regra de conflito

Se dois arquivos divergirem:

1. Para visual da proposta: Golden Reference vence.
2. Para cláusulas jurídicas: contrato padrão vigente vence.
3. Para preços e limites: aprovação CFO e `PRECIFICACAO_CFO.md` vencem.
4. Para fluxo operacional: este documento e APIs vigentes devem estar alinhados; divergência deve ser tratada antes de produção.

## 7. Mudanças de produção

Toda mudança relevante deve passar por:

- branch de teste;
- revisão do impacto;
- homologação;
- validação visual quando houver UI;
- merge controlado;
- verificação pós-deploy.

Nunca usar `main` como ambiente de experimentação.
