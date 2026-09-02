# FÊNIX — CHECKLIST DE HOMOLOGAÇÃO

Status: **OBRIGATÓRIO ANTES DE PRODUÇÃO**

## A. Proposta comercial

### Identidade visual
- [ ] 8 páginas exatas.
- [ ] Logo FÊNIX correta.
- [ ] Asa/faixa lateral direita correta.
- [ ] Diagonais douradas corretas.
- [ ] Canto metálico correto.
- [ ] Fundo preto contínuo.
- [ ] Tipografia e hierarquia compatíveis com o Golden Reference.
- [ ] Sem logo repetida indevidamente no rodapé.

### Conteúdo dinâmico
- [ ] Nome do cliente correto.
- [ ] Razão social correta.
- [ ] Segmento correto.
- [ ] Data correta.
- [ ] Contexto/dor/expectativa corretos.
- [ ] Escopo operacional completo.
- [ ] Escopo gerencial correto; vazio deve permanecer conforme Golden Reference.
- [ ] Nenhum item inventado.

### Comercial
- [ ] Mensalidade exatamente igual à aprovação CFO.
- [ ] Pacote base correto.
- [ ] Desconto correto.
- [ ] Implantação correta.
- [ ] Software e valor corretos.
- [ ] Limites por CNPJ/grupo corretos.
- [ ] Contas bancárias incluídas corretas.
- [ ] Adicionais corretos.
- [ ] Nenhum guardrail interno aparece ao cliente.

### Robustez visual
- [ ] Nome longo não invade asa/faixa.
- [ ] Escopo longo não é cortado.
- [ ] Página 7 não transborda.
- [ ] Página 8 permanece inteira.
- [ ] Sem sobreposição de texto.
- [ ] Visualização web mantém a composição.
- [ ] Impressão/PDF mantém 8 páginas.

### Aceite e governança
- [ ] Proposta só está publicada se aprovada pelo CFO.
- [ ] Aceite exige ação ativa do cliente.
- [ ] Aceite não gera contrato automaticamente.
- [ ] Após aceite, status correto é aguardando validação CFO.
- [ ] Fluxo exibido: aceite → CFO → contrato → assinatura → implantação.

## B. Pipeline

- [ ] Uma oportunidade ativa por CNPJ/negociação corrente.
- [ ] Históricos não aparecem como duplicatas.
- [ ] Entrada correta.
- [ ] Análise CFO correta.
- [ ] Proposta correta.
- [ ] Aceite correto.
- [ ] Contrato correto.
- [ ] Encerrado correto.
- [ ] Encerrar exige confirmação.
- [ ] Reabrir restaura etapa válida.
- [ ] Não é possível arrastar manualmente para frente nas etapas críticas.
- [ ] MRR em pipeline não soma duplicatas.
- [ ] MRR aprovado/publicado usa apenas etapas elegíveis.
- [ ] Ações CFO pendentes refletem estados reais.
- [ ] Botão de proposta abre a rota oficial por `public_slug`.

## C. Contrato

- [ ] Existe aceite do cliente.
- [ ] CFO validou o aceite.
- [ ] Contrato utiliza o modelo padrão vigente.
- [ ] Dados da contratante conferidos.
- [ ] Anexo I reflete escopo aprovado.
- [ ] Anexo II reflete valores e condições aprovadas.
- [ ] Não há cláusula que transforme a FÊNIX em gestora autônoma de recursos.
- [ ] Não há execução autônoma de pagamentos.
- [ ] Alterações posteriores de escopo/valor exigem formalização.

## D. Deploy

- [ ] Mudança foi feita em branch de teste.
- [ ] PR revisado.
- [ ] Deploy de preview concluído com sucesso.
- [ ] Homologação visual feita no preview.
- [ ] Caso real testado.
- [ ] Sem erro de console/API relevante.
- [ ] Merge somente após aprovação.
- [ ] Produção verificada após merge.

## E. Regra de bloqueio

Se qualquer item crítico acima falhar, **não publicar**.

Itens críticos incluem: Golden Reference, valores CFO, aceite, contrato, duplicidade de oportunidade, vazamento de dados internos e integridade das 8 páginas.
