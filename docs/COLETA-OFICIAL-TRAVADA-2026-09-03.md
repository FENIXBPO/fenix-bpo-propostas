# Coleta Oficial FÊNIX BPO — Baseline Travada

Data de congelamento: 2026-09-03

## Status

Esta versão da coleta comercial está APROVADA e TRAVADA como baseline oficial.

URL oficial: https://proposta.fenixbpo.com.br/dados-v2/

Commit de produção aprovado: `9f364a3dad960f5c58d4cfb1a9ee4e5c37f088a3`

PR de identidade aprovado: #26 — `Aplicar identidade visual oficial FÊNIX do Drive`

## Estrutura oficial da coleta

A coleta possui 8 etapas visíveis:

1. Empresa
2. Operação
3. Sistemas
4. Volumetria
5. Escopo
6. Objetivos
7. Contato
8. Revisão

Não existe etapa visível separada de Repasses.

## Identidade visual oficial

A referência soberana de marca para a coleta é a pasta oficial do Google Drive informada pelo cliente, especialmente a arte `FENIXIBPO_Logo_Horizontal_Master_Black_v01.png.png`.

Padrão visual aprovado:

- fundo preto profundo;
- prata institucional;
- dourado/champagne FÊNIX;
- logo horizontal oficial no cabeçalho;
- marca d'água FÊNIX discreta no card da coleta, persistente nas 8 etapas;
- desktop e mobile preservados.

A paleta implementada na coleta usa, como referência de interface, dourado aproximado `#DEB577` e destaque `#F1D38C`, com preto e prata/cinzas de apoio.

## Regras funcionais congeladas

- Campo Filiais / unidades removido do fluxo visível.
- Sistemas concentra ERP, Conta Azul e informações relacionadas.
- Repasses não aparecem como etapa independente para o cliente.
- Escopo consolidado e genérico para BPO Financeiro.
- Objetivo `Ter relatórios gerenciais` incluído.
- Navegação pública possui 8 etapas.
- Progresso deve refletir informações realmente preenchidas.
- Validação de e-mail permanece ativa.
- Coleta deve continuar alimentando `/api/intake` sem inventar dados.

## Regra de mudança

A partir deste congelamento, nenhuma alteração visual, textual, funcional ou estrutural desta coleta deve ser feita diretamente em produção.

Qualquer mudança futura exige:

1. branch separada;
2. PR de homologação;
3. validação visual/funcional;
4. aprovação explícita do cliente;
5. somente então merge em `main` e produção.

A prioridade do projeto após este congelamento passa a ser o fluxo ponta a ponta:

Coleta → persistência dos dados → análise/validação CFO → proposta de 8 páginas → aceite → contrato → implantação.
