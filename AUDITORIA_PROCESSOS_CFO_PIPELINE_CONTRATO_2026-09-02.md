# FÊNIX — AUDITORIA DE PROCESSOS / CFO / PIPELINE / CONTRATO

Data: 2 de setembro de 2026

Status: **AUDITORIA — SEM ALTERAÇÃO DE PRODUÇÃO**

Base auditada: PR #5 / `fix/master-proposta-e-pipeline-v2`

## 1. Resumo executivo

A arquitetura principal está correta: coleta → análise CFO → proposta → aceite → validação CFO → contrato → assinatura → implantação.

Os principais gaps atuais não são visuais. São de estruturação de dados, governança de preço, granularidade do Pipeline e rastreabilidade contratual.

## 2. `/dados` e persistência

### O que está pronto

- rota `/dados/` existe e direciona para a coleta atual;
- formulário coleta CNPJ, empresa, responsável, contato, segmento, faturamento, volumetria, bancos, CNPJs, filiais, centros de custo, equipe, organização atual, ERP, escopo e contexto;
- `api/intake.js` grava cliente e intake no Supabase;
- nenhuma proposta é liberada automaticamente após o envio.

### Gap crítico

O formulário coleta mais informações do que `api/intake.js` transforma em colunas estruturadas.

Exemplos que podem ficar apenas dentro de `raw_payload` ou não são normalizados de forma suficiente:

- nome fantasia informado no formulário;
- cargo do responsável;
- cidade/UF digitada pelo usuário quando não vem do lookup;
- sistema/ERP atual;
- existência de financeiro interno;
- contabilidade definida;
- frequência desejada;
- alguns campos de contexto e objetivos;
- dados adicionais que serão necessários para contrato/implantação.

### Risco

Campos importantes ficam dependentes de leitura posterior do JSON bruto, dificultando:

- CFO;
- filtros e indicadores;
- automação da proposta;
- contrato;
- auditoria;
- futuras integrações.

### Recomendação

Criar um schema canônico de intake com três grupos:

1. `client_identity` — dados cadastrais e representante;
2. `operation_profile` — volumetria, estrutura, ERP e organização;
3. `commercial_context` — dor, expectativa, objetivos e escopo desejado.

O `raw_payload` deve permanecer apenas como histórico integral, não como fonte primária para campos de negócio.

## 3. CFO / precificação

### O que está pronto

- existe `pricing-engine.js`;
- existe cálculo de volumetria, complexidade, horas estimadas, implantação e preço sugerido;
- existem piso/margem quando custo-hora é informado;
- operações complexas podem exigir revisão manual;
- aprovação CFO permanece gate obrigatório.

### Gap crítico

A matriz atual contém valores hardcoded, por exemplo:

- faixas de volume;
- adicionais por banco;
- adicional por CNPJ;
- filiais;
- centros de custo;
- equipe;
- faturamento;
- implantação.

Esses valores são lógica de produto/comercial e não deveriam ficar definidos apenas dentro do JavaScript.

### Outros pontos

- `contratos_novos_mes` e `comissoes_lancadas_mes` são coletados no intake, mas não entram diretamente na soma principal de movimentos usada pelo `pricing-engine.js`;
- o número de movimentos usado no tier é composto por recebimentos + pagamentos + notas emitidas + notas recebidas + outros lançamentos;
- a precificação precisa diferenciar volume operacional de complexidade operacional;
- margem-alvo e limite comercial precisam ser parametrizáveis e auditáveis;
- benchmark de mercado deve ser informativo, nunca substituir aprovação CFO.

### Recomendação

Separar:

- `pricing-engine.js` = fórmula/engine;
- `pricing-policy` = parâmetros comerciais versionados;
- `cfo_approval` = snapshot final imutável usado pela proposta.

Nenhum valor sugerido pelo motor deve ir ao cliente sem aprovação CFO.

## 4. Pipeline

### Estado atual

O `dashboard-enhance.js` usa seis estágios:

1. Entrada
2. Análise CFO
3. Proposta
4. Aceite
5. Contrato
6. Encerrado

A deduplicação por CNPJ/negociação e a preferência por `public_slug` estão alinhadas à governança.

### Gap em relação ao fluxo oficial desejado

O fluxo final definido pelo produto possui maior granularidade:

**Lead → Dados recebidos → Análise → Proposta → Enviada → Aceita → CFO → Contrato → Assinatura → Implantação**

O Pipeline atual agrupa vários desses eventos em uma mesma coluna.

### Recomendação

Não criar movimentação manual livre.

Cada avanço deve vir de evento real:

- Lead: registro comercial criado;
- Dados recebidos: intake válido recebido;
- Análise: CFO abriu/está analisando;
- Proposta: CFO aprovou versão;
- Enviada: proposta publicada/enviada;
- Aceita: cliente registrou aceite;
- CFO: validação pós-aceite pendente/concluída;
- Contrato: contrato autorizado/gerado;
- Assinatura: evento do provedor de assinatura;
- Implantação: contrato assinado e kickoff aberto.

Encerrar/Reabrir pode continuar como exceção manual governada.

## 5. Contrato

### O que está correto

`api/internal-contract-document.js`:

- exige autenticação interna;
- só gera contrato em status autorizado;
- consome snapshot de cliente, termos comerciais, escopo e premissas;
- usa `CONTRATO_FENIX_BPO_MODELO_PADRAO_v22.md`;
- marca campos ausentes como `[PENDENTE: campo]`;
- impede geração final quando faltam placeholders;
- usa Anexo I para escopo/limites e Anexo II para condições comerciais no modelo mapeado.

### Ponto de atenção técnico

O endpoint é `GET`, mas pode produzir efeito colateral: quando não há campos pendentes, ele atualiza o status do contrato para `gerado`.

Isso mistura leitura de documento com transição de estado.

### Risco

- refresh/reabertura de tela pode disparar mutação;
- logs/auditoria ficam menos claros;
- automação externa pode interpretar uma leitura como evento de negócio.

### Recomendação

Separar:

- `GET /document` = renderização/preview sem mutação;
- `POST /generate` = geração formal, snapshot, hash, ator, timestamp e mudança para `gerado`.

Contrato gerado deve ser imutável e ter vínculo explícito com `proposal_id` + versão aceita.

## 6. Segurança e rastreabilidade

Prioridades:

- toda decisão CFO deve registrar ator, timestamp e snapshot;
- proposta publicada deve ter versão imutável;
- aceite deve apontar para versão específica;
- autorização contratual deve apontar para versão aceita;
- contrato gerado deve ter hash/snapshot e não recalcular preço;
- eventos do Pipeline devem derivar desses estados, não de arrastar cards.

## 7. Ordem técnica recomendada

1. fechar Golden Reference e assets oficiais;
2. normalizar schema do `/dados`;
3. externalizar e versionar política de precificação;
4. consolidar snapshot de aprovação CFO;
5. expandir Pipeline para os 10 estados oficiais por eventos;
6. separar preview e geração formal do contrato;
7. integrar assinatura;
8. criar kickoff/implantação;
9. indicadores e automações;
10. testes E2E do fluxo completo.

## 8. Critério de pronto

O fluxo só pode ser considerado pronto quando um caso real consegue percorrer, com histórico e sem edição manual indevida:

`/dados` → CFO → proposta Golden Reference → publicação/envio → aceite → validação CFO → contrato → assinatura → implantação.
