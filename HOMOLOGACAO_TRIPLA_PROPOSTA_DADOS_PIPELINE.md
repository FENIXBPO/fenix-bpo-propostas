# FÊNIX — HOMOLOGAÇÃO TRIPLA OBRIGATÓRIA

Status: **BLOQUEIO DE PRODUÇÃO ATIVO**

Data de instituição: 02/09/2026

## Regra executiva

Nenhuma evolução do fluxo comercial será considerada pronta para produção enquanto as três frentes abaixo não estiverem simultaneamente homologadas:

1. proposta comercial recebida pelo cliente;
2. coleta de dados preenchida pelo cliente (`/dados/`);
3. painel interno / Pipeline.

A aprovação isolada de uma frente não autoriza merge ou produção das demais.

---

## 1. Proposta comercial do cliente

Rota oficial:

`/p/proposta-master-v1.html?ref=<public_slug>`

Autoridade visual:

`homologacao/FENIX_MASTER_LIMPO_GOLDEN_REFERENCE_APROVADO.pdf`

### Gate visual obrigatório

- [ ] 8 páginas exatas;
- [ ] logo oficial correta;
- [ ] composição visual fiel ao Golden Reference;
- [ ] faixa/asa lateral direita fiel ao Golden;
- [ ] diagonais e canto metálico sem reconstrução aproximada;
- [ ] tipografia, proporções, espaços e hierarquia compatíveis;
- [ ] página 8 conferida explicitamente;
- [ ] nome do cliente, segmento, data e código corretos;
- [ ] diagnóstico/contexto corretos;
- [ ] somente escopo aprovado pelo CFO;
- [ ] somente valores e condições aprovados pelo CFO;
- [ ] impressão/PDF preserva 8 páginas e identidade;
- [ ] aceite funciona e segue para CFO, sem gerar contrato automaticamente.

### Estado atual

**NÃO HOMOLOGADA VISUALMENTE.**

A rota pública e o carregamento de dados funcionam, porém o preview observado em 02/09/2026 diverge do Golden Reference. O template atual ainda não pode ser tratado como padrão final do cliente.

---

## 2. Coleta de dados do cliente

Rota oficial:

`/dados/`

Implementação de referência em homologação:

`dados-v2/index.html`

### Dados mínimos a validar

#### Empresa e contato
- [ ] CNPJ;
- [ ] razão social;
- [ ] nome fantasia;
- [ ] responsável;
- [ ] cargo;
- [ ] e-mail;
- [ ] telefone/WhatsApp;
- [ ] ramo/segmento;
- [ ] cidade/UF.

#### Volumetria
- [ ] faturamento médio;
- [ ] recebimentos/mês;
- [ ] pagamentos/mês;
- [ ] notas emitidas/mês;
- [ ] notas recebidas/mês;
- [ ] outros lançamentos/mês;
- [ ] contratos novos/mês;
- [ ] comissões lançadas/mês.

#### Estrutura financeira
- [ ] bancos ativos;
- [ ] cartões;
- [ ] contas de aplicação;
- [ ] CNPJs na operação;
- [ ] filiais/unidades;
- [ ] centros de custo;
- [ ] funcionários CLT.

#### Organização e contexto
- [ ] situação atual;
- [ ] atrasados/retrabalho;
- [ ] ERP/sistema atual;
- [ ] financeiro interno;
- [ ] contabilidade definida;
- [ ] frequência desejada;
- [ ] repasses recorrentes;
- [ ] descrição do negócio;
- [ ] principal dor;
- [ ] expectativa;
- [ ] atividade que mais consome tempo;
- [ ] objetivos;
- [ ] outros serviços.

#### Escopo solicitado
- [ ] opções de escopo são claras para o cliente;
- [ ] escopo solicitado não vira automaticamente escopo contratado;
- [ ] CFO revisa e transforma solicitação em `approved_scope`.

### Regra de dados

O Intake V2 deve manter compatibilidade com registros legados. Enquanto a migração de schema não for homologada, os novos dados estruturados permanecem preservados também em `raw_payload.normalized`, com fallback para os campos anteriores.

### Estado atual

**ESTRUTURA TÉCNICA EM HOMOLOGAÇÃO.**

A cobertura de campos está adequada para o diagnóstico atual e o Intake V2 já organiza os dados sem migração de produção. Falta validar experiência visual, clareza das perguntas e um envio real de ponta a ponta antes da aprovação final.

---

## 3. Painel / Pipeline interno

Rota oficial:

`/painel/`

Fluxo canônico:

**Lead → Dados recebidos → Análise → Proposta → Enviada → Aceita → CFO → Contrato → Assinatura → Implantação**

### Gate funcional obrigatório

- [ ] 10 etapas exibidas na ordem oficial;
- [ ] uma oportunidade ativa por CNPJ;
- [ ] históricos não duplicam o funil;
- [ ] entrada de `/dados` cai em Dados recebidos;
- [ ] análise CFO move estados por API, não por arraste;
- [ ] proposta aprovada e proposta publicada são diferenciadas;
- [ ] Aceita é preservada como marco de negócio;
- [ ] após aceite, estado corrente segue para CFO;
- [ ] contrato só aparece após autorização CFO;
- [ ] assinatura possui estado próprio;
- [ ] implantação possui estado próprio;
- [ ] Encerrar/Reabrir exige confirmação;
- [ ] nenhuma etapa crítica pode ser avançada manualmente por drag-and-drop;
- [ ] métricas/MRR não contam duplicidades.

### Estado atual

**IMPLEMENTADO EM DRAFT, AINDA NÃO HOMOLOGADO VISUALMENTE/FUNCIONALMENTE.**

O Pipeline V2 está isolado no PR de homologação e não altera os estados persistidos nesta fase. Antes de produção é obrigatório abrir o preview, testar clientes reais/de teste em etapas distintas e conferir as ações dos cards.

---

## 4. Gate de ponta a ponta

A homologação final deve executar pelo menos um caso completo:

1. abrir `/dados/`;
2. preencher um cliente de teste;
3. confirmar criação do Intake;
4. abrir o cliente no Pipeline;
5. revisar dados no CFO;
6. aprovar escopo e valores;
7. publicar proposta;
8. abrir a proposta pública com `ref`;
9. conferir as 8 páginas contra o Golden;
10. realizar aceite controlado;
11. confirmar passagem para CFO;
12. autorizar contrato;
13. gerar contrato por ação explícita;
14. conferir transição para assinatura;
15. conferir entrada em implantação.

Qualquer falha bloqueia produção.

---

## 5. Situação executiva em 02/09/2026

| Frente | Situação | Produção |
|---|---|---|
| Proposta comercial | funcional, visual ainda divergente do Golden | BLOQUEADA |
| `/dados` / Intake V2 | cobertura e estrutura em homologação | BLOQUEADA |
| Pipeline V2 | 10 etapas em Draft, aguardando homologação | BLOQUEADA |

**Decisão:** não fazer merge para produção até as três linhas estarem aprovadas.