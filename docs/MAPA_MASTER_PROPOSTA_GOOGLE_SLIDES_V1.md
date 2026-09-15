# MAPA MASTER PROPOSTA GOOGLE SLIDES V1

## Status

Documento de homologação. Não substitui o master visual aprovado e não autoriza publicação em produção.

Objetivo: transformar a coleta FÊNIX + validação CFO/Comercial em um template oficial de proposta no Google Slides, com preenchimento automático e regras determinísticas.

## Princípio de arquitetura

Fluxo oficial:

**Coleta FÊNIX → análise/validação CFO → proposta → aceite → validação FÊNIX/CFO → contrato → assinatura → implantação**

O Google Slides será apenas a camada de apresentação. Ele não decide preço, escopo ou condições. Esses dados precisam estar previamente validados.

## Regras de governança

1. O visual do master aprovado é soberano.
2. A automação apenas substitui campos e exibe/oculta módulos previstos.
3. IA pode sintetizar texto de diagnóstico, mas não pode inventar escopo, preço, software, prazo ou obrigação.
4. Valores internos de custo, margem, piso e desconto máximo nunca aparecem ao cliente.
5. Mensalidade FÊNIX, software/ERP, repasses e implantação devem aparecer separados quando aplicáveis.
6. A FÊNIX permanece caracterizada como apoio administrativo-financeiro/BPO; decisões, autorizações e movimentação de recursos permanecem com o cliente.
7. Nenhuma alteração do template oficial vai para produção sem homologação visual expressa.

---

# 1. PÁGINAS DO MASTER

O template será modular. A numeração abaixo representa a composição recomendada, não uma obrigação rígida de quantidade.

## Página 1 — Capa

### Objetivo comercial
Gerar percepção premium, personalização e clareza imediata sobre a proposta de valor.

### Conteúdo fixo
- PROPOSTA COMERCIAL
- BPO FINANCEIRO
- FÊNIX INTELLIGENT BPO
- promessa principal: **Controle financeiro, previsibilidade e informação confiável para decisões melhores.**

### Campos variáveis
- `{{cliente_nome}}` ← razão social/nome fantasia validado
- `{{segmento}}` ← ramo/atividade principal
- `{{data_proposta}}` ← data de emissão

### Regra
Sempre exibir.

---

## Página 2 — Entendimento do cliente

### Objetivo comercial
Provar que a proposta foi construída para aquele cliente e não é um material genérico.

### Campos variáveis
- `{{cenario_atual}}`
- `{{principais_desafios}}`
- `{{objetivo_operacao}}`

### Origem
Coleta:
- `descricao`
- `dor`
- `expectativa`
- `faturamento`
- `recebimentos`
- `pagamentos`
- `notas`
- `notas_recebidas`
- `lancamentos`
- `bancos`
- `cartoes`
- `cnpjs`
- `filiais`
- `centros_custo`
- `funcionarios`
- `implantacao_situacao`
- `dor_atrasados`

### Regra de geração
A IA pode condensar os dados em até 3 blocos curtos. Deve preservar fatos da coleta e nunca inferir problema não declarado.

### Validação
Comercial/CFO revisa antes de liberar a proposta.

---

## Página 3 — O que precisa mudar

### Objetivo comercial
Traduzir dor em transformação operacional antes de apresentar tarefas.

### Estrutura
**Hoje → Com a estrutura proposta**

### Campos variáveis
- `{{hoje_rotina}}` / `{{futuro_rotina}}`
- `{{hoje_informacao}}` / `{{futuro_informacao}}`
- `{{hoje_visibilidade}}` / `{{futuro_visibilidade}}`
- `{{hoje_controle}}` / `{{futuro_controle}}`

### Regra
Gerar apenas com base em `dor`, `expectativa`, situação atual e escopo aprovado. Se a coleta não sustentar determinada transformação, não exibir aquele item.

---

## Página 4 — Escopo da atuação

### Objetivo comercial
Apresentar benefício primeiro e tarefas depois.

### Grupos padrão
1. Rotina operacional
2. Documentos e interfaces
3. Visão gerencial

### Campo-base
- `{{escopo_aprovado}}`

### Origem
Coleta `escopo[]`, após validação FÊNIX/CFO.

### Itens hoje disponíveis na coleta
- Conciliação bancária diária
- Contas a pagar
- Contas a receber
- Agendamentos bancários
- Lançamentos e organização de despesas
- Emissão de NFS-e
- Interface com contabilidade
- Fluxo de caixa e relatório mensal

### Regra
Somente itens aprovados podem aparecer. A proposta não pode ampliar automaticamente o escopo solicitado.

### Benefícios fixos por grupo
- Rotina operacional: **Manter o financeiro organizado e atualizado.**
- Documentos e interfaces: **Criar fluxo confiável entre documentos, sistema e operação.**
- Visão gerencial: **Transformar rotina financeira em informação para decisão.**

---

## Página 5 — Como a FÊNIX atua

### Objetivo comercial e jurídico
Deixar responsabilidades claras sem transmitir postura defensiva.

### Conteúdo fixo recomendado
**FÊNIX**
- organizar e executar a rotina aprovada;
- conciliar, controlar e estruturar informações;
- preparar relatórios previstos no escopo;
- apoiar a leitura operacional e gerencial.

**Cliente**
- definir diretrizes e prioridades;
- autorizar pagamentos e decisões de caixa;
- disponibilizar documentos, acessos e informações;
- aprovar mudanças extraordinárias de escopo e custos.

### Regra
Sempre exibir. Ajustes específicos somente se aprovados pelo jurídico/CFO.

---

## Página 6 — Tecnologia e inteligência operacional

### Objetivo comercial
Posicionar tecnologia como meio para eficiência, não como promessa abstrata.

### Blocos fixos
- Processos — rotinas padronizadas e previsibilidade operacional.
- Automação — redução de retrabalho em atividades recorrentes.
- IA como apoio — organização e leitura de informações operacionais.
- ERP e softwares — ferramentas utilizadas na operação.
- Relatórios — informação estruturada para apoio à decisão.

### Campos variáveis
- `{{sistema_atual}}`
- `{{software_nome}}`
- `{{observacao_sistema}}`

### Regra
Se o cliente não utilizar software/ERP, o bloco continua institucional, sem inventar integração inexistente.

---

## Página 7 — Resultados esperados

### Objetivo comercial
Tornar o valor do BPO tangível sem prometer resultado financeiro garantido.

### Resultados elegíveis
- rotina financeira estruturada;
- conciliação atualizada, quando contratada;
- calendário financeiro organizado;
- fluxo de caixa acompanhado, quando contratado;
- relatórios periódicos, quando contratados;
- menor dependência de pessoas específicas por padronização de processo.

### Regra
Resultado só aparece se houver suporte no escopo aprovado. Evitar promessas de redução percentual de custo, aumento de lucro ou ganho financeiro não comprovado.

---

## Página 8 — Implantação

### Objetivo comercial
Reduzir ansiedade e mostrar processo de entrada estruturado.

### Etapas fixas
1. Alinhamento
2. Acessos
3. Parametrização
4. Entrada assistida em operação

### Campos variáveis
- `{{implantacao_situacao}}`
- `{{implantacao_prazo_estimado}}`
- `{{implantacao_observacoes}}`

### Origem
- coleta `implantacao_situacao`
- coleta `dor_atrasados`
- validação interna

### Regra
Prazo só pode ser exibido se aprovado internamente. Sem prazo aprovado, usar texto institucional: **Cronograma definido conforme complexidade, volumetria e disponibilidade das informações do cliente.**

---

## Página 9 — Condição comercial

### Objetivo comercial
Máxima transparência de preço e composição da operação.

### Campos obrigatórios
- `{{mensalidade_fenix}}`
- `{{implantacao_valor}}`

### Campos condicionais
- `{{software_nome}}`
- `{{software_valor_mensal}}`
- `{{outros_repasses}}`
- `{{mensalidade_pacote_referencia}}`
- `{{desconto_comercial_valor}}`
- `{{total_mensal_operacao}}`
- `{{implantacao_condicao_pagamento}}`
- `{{condicoes_comerciais_observacoes}}`

### Dados de dimensionamento visíveis
- `{{qtd_cnpjs}}`
- `{{qtd_bancos}}`
- `{{volume_mensal_estimado}}`
- `{{escopo_resumo}}`

### Regras comerciais
1. Proposta só pode ser gerada com `mensalidade_aprovada` e `implantacao_aprovada` preenchidas.
2. Se `software_cobrado_a_parte = Sim`, exibir nome, valor, forma e início da cobrança.
3. Se não houver software cobrado à parte, não criar linha artificial de R$ 0,00; ocultar a linha.
4. Se houver desconto, pode mostrar pacote de referência, benefício comercial e valor final. Nunca mostrar custo interno, margem, piso ou fórmula.
5. Implantação é cobrança única e não entra no total mensal recorrente.
6. `total_mensal_operacao = mensalidade_fenix + software_cobrado_a_parte + outros_repasses_recorrentes`.
7. Software/repasses devem estar visualmente separados da receita FÊNIX.

---

## Página 10 — Próximos passos e aceite

### Objetivo comercial
Encerrar com segurança, clareza e chamada à ação.

### Fluxo fixo
**Aceite comercial → validação FÊNIX/CFO → contrato → assinatura → implantação**

### Campo variável
- `{{mensagem_fechamento}}`

### Texto jurídico/comercial fixo
**O aceite comercial autoriza o avanço para a etapa contratual e não substitui o contrato definitivo.**

### Regra
Sempre exibir.

---

# 2. MAPA DE CAMPOS — COLETA → PROPOSTA

| Campo da coleta | Uso na proposta | Regra |
|---|---|---|
| `cnpj` | identificação/dimensionamento | interno; exibir somente se desejado no rodapé/ficha |
| `razao` | nome do cliente | obrigatório |
| `responsavel` | aceite/contato | quando aplicável |
| `email` | envio/aceite | não precisa aparecer no corpo |
| `telefone` | contato | não precisa aparecer no corpo |
| `ramos` | segmento | exibir na capa |
| `descricao` | cenário atual | sintetizar |
| `dor` | desafios / o que precisa mudar | sintetizar sem inventar |
| `expectativa` | objetivo da operação | sintetizar |
| `faturamento` | dimensionamento interno | não exibir por padrão |
| `recebimentos` | volumetria | somar no volume mensal |
| `pagamentos` | volumetria | somar no volume mensal |
| `notas` | volumetria | somar no volume mensal |
| `notas_recebidas` | volumetria | somar no volume mensal |
| `lancamentos` | volumetria | somar no volume mensal |
| `bancos` | dimensionamento | exibir quantidade validada |
| `cartoes` | complexidade | interno, salvo necessidade comercial |
| `contas_aplicacao` | complexidade | interno, salvo necessidade comercial |
| `cnpjs` | dimensionamento | exibir quantidade |
| `filiais` | complexidade | interno/condicional |
| `centros_custo` | complexidade | interno/condicional |
| `funcionarios` | complexidade | interno |
| `implantacao_situacao` | implantação | usar no planejamento, não necessariamente texto literal |
| `dor_atrasados` | implantação/risco | não exibir como acusação; usar para dimensionar implantação |
| `escopo[]` | escopo contratado | só após validação CFO/Comercial |

---

# 3. CAMPOS INTERNOS CFO/COMERCIAL

## Nunca expor ao cliente
- custo-hora interno;
- margem-alvo;
- piso interno;
- desconto máximo autorizado;
- fórmula de precificação;
- pareceres internos completos;
- indicadores de rentabilidade internos.

## Expor somente após aprovação
- `mensalidade_aprovada` → `{{mensalidade_fenix}}`
- `implantacao_aprovada` → `{{implantacao_valor}}`
- `software_nome`
- `software_valor_mensal`
- `software_forma_cobranca`
- `software_inicio_cobranca`
- `mensalidade_pacote_referencia`
- `desconto_comercial_valor`
- `condicoes_comerciais_observacoes`

---

# 4. REGRAS CONDICIONAIS DO GOOGLE SLIDES

A automação deve operar por módulos previsíveis:

- `software_cobrado_a_parte = Não` → ocultar linha de software na página comercial.
- `software_cobrado_a_parte = Sim` → exibir software + valor + forma + início.
- sem outros repasses recorrentes → ocultar bloco de repasses.
- sem escopo gerencial aprovado → ocultar itens gerenciais e resultados dependentes deles.
- sem fluxo de caixa contratado → não prometer fluxo de caixa acompanhado.
- sem conciliação contratada → não prometer conciliação atualizada.
- sem implantação especial → usar módulo padrão de implantação.
- múltiplos CNPJs → exibir quantidade e, se necessário, nota comercial específica.
- volume/complexidade alta → proposta só é liberada após revisão manual CFO.

---

# 5. OBJETO DE DADOS RECOMENDADO PARA GERAÇÃO

```json
{
  "proposal_id": "...",
  "client": {
    "name": "...",
    "segment": "..."
  },
  "diagnosis": {
    "current_state": "...",
    "challenges": "...",
    "objective": "..."
  },
  "scope": {
    "approved_items": [],
    "operational": [],
    "interfaces": [],
    "managerial": []
  },
  "operation": {
    "cnpjs": 1,
    "banks": 1,
    "monthly_volume": 0,
    "software_name": ""
  },
  "implementation": {
    "situation": "",
    "estimated_timeline": "",
    "notes": ""
  },
  "commercial": {
    "fenix_monthly": 0,
    "software_monthly": 0,
    "other_recurring_repasses": 0,
    "monthly_total": 0,
    "implementation_fee": 0,
    "implementation_payment_terms": ""
  },
  "governance": {
    "cfo_approved": false,
    "commercial_approved": false,
    "approved_at": null
  }
}
```

---

# 6. CRITÉRIOS DE LIBERAÇÃO DA PROPOSTA

A geração final só deve ocorrer quando:

1. coleta estiver completa;
2. escopo estiver aprovado;
3. mensalidade estiver aprovada;
4. implantação estiver aprovada;
5. software/repasses estiverem resolvidos;
6. CFO tiver aprovado ou autorizado exceção formalmente;
7. Comercial tiver aprovado a abordagem;
8. textos sintetizados tiverem passado por validação mínima de coerência;
9. o template utilizado for a versão oficial homologada.

---

# 7. PRÓXIMO PASSO APÓS APROVAÇÃO DESTE MAPA

1. Construir o master visual no Google Slides usando o visual aprovado como referência soberana.
2. Inserir placeholders oficiais.
3. Criar automação de duplicação e preenchimento.
4. Exportar automaticamente para PDF.
5. Testar três cenários: cliente simples, cliente médio e cliente complexo.
6. Só depois integrar aceite e geração de contrato.
