# FÊNIX BPO — Propostas, Pipeline e Contratos

Sistema comercial da FÊNIX BPO para coleta de dados, análise CFO, geração de proposta, aceite, contrato e acompanhamento do Pipeline.

## Regra principal do projeto

A proposta comercial possui um padrão visual congelado chamado **Master Limpo — Golden Reference Oficial**.

Antes de qualquer alteração na proposta, leia:

1. `MANUAL_GOLDEN_REFERENCE_FENIX.md`
2. `GOVERNANCA_PROJETO_FENIX.md`
3. `MAPA_ARQUITETURA_FENIX.md`
4. `CHECKLIST_HOMOLOGACAO_FENIX.md`

O PDF homologado `FENIX_Caso_Real_Master_Limpo_Homologacao.pdf` é a autoridade visual máxima. Se código e PDF divergirem, o PDF vence.

## Fluxo oficial

`coleta → CFO → proposta → aceite do cliente → validação CFO → contrato → assinatura → implantação`

Regras fundamentais:

- nenhuma proposta é publicada antes da aprovação CFO;
- valores ao cliente são somente os aprovados pelo CFO;
- aceite do cliente não gera contrato automaticamente;
- contrato só é autorizado após validação CFO do aceite;
- proposta e Pipeline são produtos diferentes;
- o Pipeline pode evoluir visualmente; o Golden Reference não.

## Rotas oficiais

- Coleta do cliente: `/dados/`
- Painel / Pipeline: `/painel/`
- Central de atalhos: `/atalhos/`
- Proposta pública: `/p/proposta-master-v1.html?ref=<public_slug>`

## Documentação oficial

### Governança
- `MANUAL_GOLDEN_REFERENCE_FENIX.md` — regras imutáveis da proposta aprovada.
- `GOVERNANCA_PROJETO_FENIX.md` — fontes de verdade, responsabilidades e fluxo ponta a ponta.
- `MAPA_ARQUITETURA_FENIX.md` — componentes, arquivos, APIs e responsabilidades técnicas.
- `CHECKLIST_HOMOLOGACAO_FENIX.md` — checklist obrigatório antes de produção.

### Proposta
- `PADRAO_PROPOSTA_FENIX.md`
- `PADRAO_PROPOSTA_FENIX_MASTER_LIMPO_V1.md`
- `master-template/proposta-master-limpa-v1.html`
- `master-template/proposta-master-limpa-v1.css`
- `master-template/proposta-master-limpa-v1.js`
- `p/proposta-master-v1.html`

### CFO e preços
- `PRECIFICACAO_CFO.md`
- `pricing-engine.js`
- `SISTEMA_CAMPOS_SOFTWARE_E_CONDICOES.md`

### Contrato
- `CONTRATO_FENIX_BPO_MODELO_PADRAO_v22.md`
- `CONTRATO_V22_MAPEAMENTO_AUTOMACAO.md`

## Pipeline

Etapas comerciais:

`Entrada → Análise CFO → Proposta → Aceite → Contrato`

Estado manual adicional:

`Encerrado`

As etapas críticas avançam por eventos reais do fluxo. O usuário pode encerrar ou reabrir oportunidades, mas não deve forçar manualmente aprovação CFO, aceite ou contrato.

O Pipeline deve exibir **uma oportunidade ativa por CNPJ/negociação corrente**. Intakes anteriores permanecem no histórico e não devem inflar contagens ou MRR.

## Posicionamento jurídico

A FÊNIX atua como **BPO / apoio administrativo-financeiro**.

O sistema e seus documentos não devem atribuir à FÊNIX execução autônoma de pagamentos, movimentação discricionária de recursos, negociação independente ou tomada de decisões gerenciais do cliente.

## Desenvolvimento e produção

Mudanças relevantes devem seguir:

`branch de teste → implementação → preview → homologação → aprovação → merge → verificação de produção`

Nunca usar `main` como ambiente de experimentação.

Qualquer alteração visual no Golden Reference exige nova versão e nova homologação formal.
