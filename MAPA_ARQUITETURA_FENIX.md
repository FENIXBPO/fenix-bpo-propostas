# FÊNIX — MAPA DE ARQUITETURA E RESPONSABILIDADES

Status: **OFICIAL**

## 1. Visão geral

Fluxo principal:

`/dados/` → APIs de coleta → análise CFO → proposta pública → aceite → validação CFO → contrato → assinatura → implantação

Painel interno:

`/painel/` → visão consolidada do Pipeline e ações internas permitidas.

Central:

`/atalhos/` → acesso rápido às rotas operacionais.

## 2. Componentes principais

### Coleta
- rota pública: `/dados/`
- endpoint de intake: `api/intake.js`
- finalidade: coletar dados do cliente e operação;
- não deve publicar proposta automaticamente.

### Precificação / análise CFO
- regra documental: `PRECIFICACAO_CFO.md`
- engine: `pricing-engine.js`
- interface histórica/interna: `app-v15.html`
- aprovação/publicação: `cfo-publish.js` e APIs relacionadas.

### Proposta
- rota pública: `/p/proposta-master-v1.html?ref=<public_slug>`
- wrapper público: `p/proposta-master-v1.html`
- dados públicos: `api/public-proposal.js`
- Master: `master-template/proposta-master-limpa-v1.html`
- estilos: `master-template/proposta-master-limpa-v1.css`
- preenchimento dinâmico: `master-template/proposta-master-limpa-v1.js`
- aceite: `api/proposal-acceptance.js`

Regra: esses arquivos devem reproduzir o Golden Reference, não criar outro design.

### Pipeline
- rota: `/painel/`
- camada de aprimoramento: `dashboard-enhance.js`
- fonte de dados interna: `api/internal-intakes.js`
- alteração Encerrar/Reabrir: `api/internal-intake-stage.js`

Regra: o Pipeline pode evoluir visualmente; os estados críticos devem respeitar a governança.

### Contrato
- modelo: `CONTRATO_FENIX_BPO_MODELO_PADRAO_v22.md`
- mapeamento: `CONTRATO_V22_MAPEAMENTO_AUTOMACAO.md`

Regra: contrato nasce somente após aceite do cliente e validação CFO.

## 3. Separação de responsabilidades

### Interface pública
Deve mostrar apenas informações adequadas ao cliente.

Nunca mostrar:
- piso interno;
- custo-hora;
- margem-alvo;
- desconto máximo interno;
- observações internas do CFO;
- dados de outros clientes.

### Interface interna
Pode mostrar informações de análise, desde que protegida por autenticação e sem alterar dados críticos por atalhos inseguros.

### Banco de dados
Deve manter histórico de intake, proposta, eventos e aceites. Histórico não deve aparecer como oportunidade duplicada no Pipeline.

## 4. Identificadores importantes

- cliente: CNPJ é a principal chave comercial quando disponível;
- intake: representa coleta/histórico;
- proposta: possui versão e status próprios;
- `public_slug`: referência pública preferencial para abrir a proposta oficial.

## 5. Regra para URLs antigas

Se um registro antigo possui `public_url` apontando para template legado, o painel deve preferir `public_slug` e construir a rota oficial:

`/p/proposta-master-v1.html?ref=<public_slug>`

Somente se não houver `public_slug` pode haver fallback controlado.

## 6. Estados e transições

Transições automáticas esperadas:

`Entrada → Análise CFO → Proposta → Aceite → Contrato`

Estado manual permitido:

`qualquer etapa ativa → Encerrado`

Reabertura:

`Encerrado → etapa anterior válida`

## 7. Regras de evolução

Qualquer nova funcionalidade deve responder antes de implementação:

1. É pública ou interna?
2. Qual fonte de verdade governa essa informação?
3. Qual status do fluxo ela pode alterar?
4. Precisa de aprovação CFO?
5. Pode afetar o Golden Reference?
6. Precisa de auditoria/histórico?
7. Qual teste impede regressão?

## 8. Critério de pronto

Uma entrega só está pronta quando:

- funciona tecnicamente;
- mantém governança;
- não cria template paralelo;
- não duplica oportunidade;
- não vaza dado interno;
- tem rota final correta;
- passou por homologação visual quando aplicável;
- deploy foi verificado.
