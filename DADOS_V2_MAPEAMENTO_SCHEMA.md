# FÊNIX — Mapeamento de Dados V2

Status: **PROPOSTA TÉCNICA PARA HOMOLOGAÇÃO — NÃO APLICADA EM PRODUÇÃO**

Data: 02/09/2026

## Objetivo

Estruturar os dados coletados em `/dados/` para que CFO, proposta, contrato, Pipeline e implantação usem as mesmas fontes, reduzindo dependência de leitura manual de `raw_payload`.

## 1. Cadastro do cliente — `bpo_clients`

Já estruturados:
- CNPJ
- razão social
- nome fantasia
- situação cadastral
- CNAE / atividade
- endereço
- cidade
- UF
- CEP
- responsável
- e-mail
- telefone

Gap proposto:
- `responsavel_cargo` (text)

Regra: dados do lookup de CNPJ têm preferência quando disponíveis; campos preenchidos manualmente devem ser usados como fallback e nunca descartados silenciosamente.

## 2. Intake — volumetria

Já estruturados em `bpo_intakes`:
- faturamento
- recebimentos/mês
- pagamentos/mês
- notas emitidas/mês
- notas recebidas/mês
- outros lançamentos/mês
- contratos novos/mês
- comissões lançadas/mês

Esses campos alimentam diagnóstico e dimensionamento. Contratos e comissões permanecem separados da volumetria-base até validação de esforço real/timesheet; não devem ser somados automaticamente sem evidência operacional.

## 3. Intake — estrutura financeira

Já estruturados:
- bancos ativos
- cartões
- contas de aplicação
- CNPJs na operação
- filiais
- centros de custo
- funcionários CLT
- situação atual
- atrasados/retrabalho

## 4. Contexto operacional

Hoje presentes somente em `raw_payload.form`:
- sistema financeiro / ERP (`sistema_atual`)
- financeiro interno (`financeiro_interno`)
- contabilidade definida (`contabilidade_definida`)
- frequência desejada (`frequencia`)
- repasses recorrentes (`repasses`)
- atividade que mais consome tempo (`consome_tempo`)
- outros serviços necessários (`outros_servicos`)

Proposta: adicionar `operational_context jsonb` em `bpo_intakes` com estrutura explícita:

```json
{
  "erp": "Conta Azul",
  "internal_finance": "Parcialmente",
  "accounting_defined": "Sim",
  "desired_frequency": "Diária",
  "recurring_transfers": "Não",
  "time_consuming_activity": "...",
  "other_services": "..."
}
```

Motivo para JSONB: estes atributos são contexto operacional relacionado e podem evoluir sem criar uma coluna para cada nova pergunta do formulário.

## 5. Objetivos do cliente

Hoje enviados pelo formulário em `objetivos[]` e preservados apenas em `raw_payload`.

Proposta: adicionar `objectives jsonb not null default '[]'` em `bpo_intakes`.

Objetivos atuais:
- Organizar a operação
- Reduzir retrabalho
- Ganhar previsibilidade
- Apoiar decisões
- Estruturar o financeiro do zero

Uso:
- Página 2 — Nossa Compreensão;
- diagnóstico comercial;
- implantação;
- comparação posterior entre expectativa e resultado.

## 6. Escopo

`bpo_intakes.escopo` já é JSONB e continua como **escopo solicitado pelo cliente**.

O escopo contratado não deve vir diretamente desse campo.

Fluxo correto:

`escopo solicitado -> análise CFO -> bpo_proposals.approved_scope -> proposta aceita -> contrato Anexo I`

## 7. Raw payload

`raw_payload` deve permanecer.

Funções:
- auditoria do formulário original;
- compatibilidade retroativa;
- recuperação de campos durante transição de schema;
- investigação de erros.

Não deve ser a fonte primária permanente para campos usados em regras de negócio.

## 8. Campos dinâmicos da proposta

A proposta deve consumir:

### Cliente
- nome / razão social
- segmento
- data

### Nossa compreensão
- descrição
- dor
- expectativa
- objetivos
- contexto operacional

### Escopo
- somente `bpo_proposals.approved_scope`

### Comercial
- somente `bpo_proposals.commercial_terms`

### Contrato
- snapshot da proposta aceita e validada pelo CFO

## 9. Migração sugerida

Mudança mínima:

- `bpo_clients.responsavel_cargo text`
- `bpo_intakes.operational_context jsonb not null default '{}'::jsonb`
- `bpo_intakes.objectives jsonb not null default '[]'::jsonb`

A migração só deve ser executada após:
1. revisão do SQL;
2. backup / capacidade de rollback;
3. validação dos consumidores atuais;
4. deploy de código compatível;
5. teste de intake real em homologação.
