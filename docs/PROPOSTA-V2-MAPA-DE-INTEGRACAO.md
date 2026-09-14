# FÊNIX Intelligent BPO — Proposta V2

## Mapa de integração ponta a ponta

Documento complementar a `docs/PROPOSTA-V2-GOVERNANCA-E-HOMOLOGACAO.md`.

Objetivo: manter coleta, CFO, proposta, aceite, contrato e implantação como um único processo rastreável.

---

## 1. Fluxo funcional

```text
CLIENTE
  ↓
COLETA OFICIAL
  ↓
BPO INTAKE / DADOS
  ↓
ANÁLISE E VALIDAÇÃO FÊNIX/CFO
  ↓
TERMOS COMERCIAIS + ESCOPO APROVADO
  ↓
PROPOSAL COMPOSER
  ↓
PROPOSTA V2 — 8 PÁGINAS
  ↓
VALIDADOR VISUAL + COMERCIAL
  ↓
PUBLICAÇÃO
  ↓
ACEITE COMERCIAL DO CLIENTE
  ↓
VALIDAÇÃO FINAL FÊNIX/CFO
  ↓
CONTRATO
  ↓
ASSINATURA
  ↓
IMPLANTAÇÃO / KICK-OFF
```

---

## 2. Coleta oficial

Rota oficial de coleta:

`https://proposta.fenixbpo.com.br/dados-v2/`

Interface pública não deve exibir “V2” ao cliente.

Passos visíveis aprovados:

1. Empresa
2. Operação
3. Sistemas
4. Volumetria
5. Escopo
6. Objetivos
7. Contato
8. Revisão

A coleta é a primeira fonte de verdade da proposta.

---

## 3. Dados que alimentam a proposta

### Cliente

- nome / razão social;
- CNPJ;
- segmento;
- responsável.

### Operação

- cenário atual;
- dores;
- objetivos;
- sistema atual;
- uso / intenção de uso do Conta Azul.

### Volumetria

- quantidade de CNPJs;
- contas bancárias;
- volume previsto de lançamentos;
- demais parâmetros aprovados.

### Escopo

Somente itens coletados e validados.

Não criar atividade por padrão quando o dado estiver ausente.

### Comercial

- mensalidade FÊNIX;
- software/ERP recorrente;
- implantação única;
- demais condições aprovadas.

---

## 4. Banco de dados

Tabelas conhecidas do fluxo:

- `bpo_clients`
- `bpo_intakes`
- `bpo_proposals`
- `bpo_proposal_events`
- `bpo_contracts`

Responsabilidade por camada:

### `bpo_clients`
Cadastro do cliente.

### `bpo_intakes`
Dados da coleta oficial.

### `bpo_proposals`
Versões e estado da proposta.

### `bpo_proposal_events`
Rastreabilidade dos eventos do fluxo comercial.

### `bpo_contracts`
Estado / dados contratuais depois da aprovação final.

Nota de segurança conhecida: qualquer política de RLS deve ser tratada separadamente e não deve ser alterada sem autorização específica.

---

## 5. Camada CFO / validação interna

Antes da publicação, a FÊNIX/CFO valida:

- escopo;
- volumetria;
- preço;
- desconto;
- software;
- implantação;
- limites e observações comerciais.

A proposta não deve publicar termos comerciais inconsistentes.

`api/internal-proposal.js` é parte da proteção de aprovação/publicação.

---

## 6. Proposal Composer

Arquivo:

`assets/proposal-composer-v2.js`

Entrada:

- cliente;
- contexto;
- operação;
- escopo;
- termos comerciais.

Saída:

- modelo editorial das páginas 02–08;
- listas priorizadas;
- textos executivos;
- responsabilidades;
- tecnologia;
- implantação;
- pricing;
- fechamento.

Princípio:

> O Composer interpreta e sintetiza a verdade coletada. Não inventa a verdade.

---

## 7. Template e renderização

Estrutura HTML:

`master-template/proposta-v2.html`

Renderização e demos:

`master-template/proposta-v2.js`

Rota pública:

`p/proposta-v2.html`

Loader / aceite:

`assets/proposta-public-v2.js`

Fluxo esperado:

```text
ref pública
  ↓
/api/public-proposal
  ↓
proposta armazenada
  ↓
Composer
  ↓
Template
  ↓
renderização das 8 páginas
```

---

## 8. Camada visual

Arquivos atuais:

- `master-template/proposta-v2.css`
- `assets/proposta-cover-golden-fix.css`
- `assets/proposta-typography-final-v2.css`
- `assets/proposta-responsive-v2.css`
- `assets/proposta-layout-audit-v2.css`
- `assets/proposta-page-units-v2.js`

A direção de arte premium deve ser implementada com HTML/CSS e os ativos oficiais.

Imagens geradas durante homologação servem como **referência de direção de arte**, não como substitutas da logo/símbolo oficial nem como renderização final do produto.

---

## 9. Validação da proposta

Arquivo:

`assets/proposal-validator-v2.js`

Deve verificar, no mínimo:

- overflow;
- colisões relevantes;
- integridade da estrutura;
- inconsistências comerciais;
- condições que inviabilizam publicação.

A homologação humana continua obrigatória antes do merge da direção visual final.

---

## 10. Comercial

Regras imutáveis sem nova aprovação:

```text
MENSALIDADE FÊNIX
+
SOFTWARE / ERP RECORRENTE
=
TOTAL MENSAL DA OPERAÇÃO
```

`IMPLANTAÇÃO` é sempre apresentada à parte como cobrança única.

Nunca somar implantação ao total mensal.

---

## 11. Aceite

A proposta pública registra o aceite comercial.

O aceite comercial deve levar ao estado de validação final FÊNIX/CFO.

Aceite não é contrato.

Frase obrigatória ao cliente:

`O aceite comercial não substitui o contrato.`

---

## 12. Contrato

O contrato somente deve ser preparado após a validação final FÊNIX/CFO.

O contrato deve consumir as informações comerciais e o escopo efetivamente aprovados na proposta.

Fluxo desejado:

```text
proposta aceita
  ↓
validação final CFO
  ↓
status aprovado para contrato
  ↓
preenchimento dos dados da contratante
  ↓
transposição de escopo e valores aprovados
  ↓
contrato
  ↓
assinatura
```

A proposta comercial não deve se tornar contrato automaticamente apenas pelo aceite do cliente.

---

## 13. Testes obrigatórios antes do merge

### Cenários demo

- `?demo=small`
- `?demo=medium`
- `?demo=complex`

### Teste real

Executar pelo menos 1 fluxo completo:

1. preencher coleta oficial;
2. localizar intake gerado;
3. realizar validação CFO;
4. gerar proposta;
5. conferir páginas 01–08;
6. validar cálculo comercial;
7. publicar em homologação;
8. registrar aceite de teste;
9. conferir evento/status pós-aceite;
10. confirmar que o contrato não é disparado antes da validação final CFO.

---

## 14. Portões de qualidade

### Gate A — dados

Nenhum dado crítico inventado.

### Gate B — comercial

Preço e total consistentes.

### Gate C — visual

Golden / governança obedecidos.

### Gate D — responsivo

Sem quebra em desktop e mobile.

### Gate E — PDF

Impressão / salvar PDF sem corte ou sobreposição.

### Gate F — aceite

Fluxo correto e rastreável.

### Gate G — contrato

Somente após validação final CFO.

---

## 15. Regra de continuidade do projeto

Ao abrir um novo chat, branch ou ciclo de desenvolvimento, ler primeiro:

1. `docs/PROPOSTA-V2-GOVERNANCA-E-HOMOLOGACAO.md`
2. `docs/PROPOSTA-V2-MAPA-DE-INTEGRACAO.md`
3. `docs/COLETA-OFICIAL-TRAVADA-2026-09-03.md`
4. estado atual do PR #28

Depois verificar os arquivos efetivos antes de alterar código.

Não voltar a versões antigas da proposta.

---

**FÊNIX Intelligent BPO — Proposta / Site / Contrato**  
**Mapa oficial de integração em homologação.**
