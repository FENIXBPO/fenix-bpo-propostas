# FÊNIX — MANUAL DO GOLDEN REFERENCE

Status: **NORMA OFICIAL E VINCULANTE DO PROJETO**

Nome oficial do padrão: **Master Limpo — Golden Reference Oficial**

Versão visual vigente: **v2 — homologada em 2 de setembro de 2026**

## 1. Autoridade visual

O PDF homologado **`homologacao/FENIX_MASTER_LIMPO_GOLDEN_REFERENCE_APROVADO.pdf`** é a autoridade visual máxima da proposta comercial FÊNIX.

Integridade oficial (SHA-256): `14b626a36031c0b04d0aabaaabaa52b5efd90672811f1dcff6060459042c1cf4`.

Ele não é inspiração ou referência aproximada. É a única fonte visual autorizada para a proposta.

Se houver qualquer conflito entre PDF, HTML, CSS, JavaScript, Gamma, apresentação, imagem, template ou interpretação posterior, **o PDF homologado vence**.

## 2. Regra de imutabilidade visual

A proposta aprovada não pode ser redesenhada por cliente, canal ou tecnologia.

São fixos:

- 8 páginas;
- proporção e composição geral;
- fundo preto contínuo;
- logo FÊNIX metálica;
- asa/faixa visual do lado direito;
- diagonais douradas;
- canto metálico inferior direito;
- cores;
- hierarquia tipográfica;
- posição relativa dos blocos;
- estilo de cards, painéis e métricas;
- rodapés institucionais definidos no Golden Reference;
- narrativa comercial das 8 páginas.

Nenhuma implementação pode "reinterpretar" esses elementos com outro layout.

Gamma, HTML, CSS, componentes, apresentações e geradores de PDF somente podem reproduzir o Master. Nenhuma dessas tecnologias pode criar uma versão visual alternativa.

## 3. Campos que podem variar

Somente conteúdo dinâmico aprovado pode mudar:

- cliente;
- razão social;
- segmento;
- data;
- contexto e diagnóstico;
- dor e expectativa;
- escopo operacional;
- escopo gerencial;
- volumes e limites;
- número de CNPJs;
- contas bancárias incluídas;
- mensalidade;
- desconto;
- implantação;
- software/ERP;
- observações comerciais aprovadas;
- condições aprovadas pelo CFO.

## 4. Estrutura fixa das 8 páginas

1. Capa — marca, cliente, segmento e data.
2. Nossa compreensão — contexto, dor, expectativa e pilares Controle / Previsibilidade / Decisão.
3. Escopo — operacional e gerencial.
4. Modelo de atuação — responsabilidades FÊNIX e cliente.
5. Tecnologia — processos, automação, IA, dados e decisão.
6. Continuidade — aprovação, contrato, implantação e início da operação.
7. Investimento — limites, mensalidade, pacote base, desconto, implantação e software.
8. Encerramento — próximos passos e aceite.

A ordem não pode ser alterada sem nova homologação formal.

## 5. Regra de implementação

A arquitetura correta é:

**moldura visual fixa + campos dinâmicos por cima**.

A moldura deve usar os assets reais homologados. Não reconstruir logo, asa, diagonais ou canto por aproximação quando houver asset aprovado disponível.

## 6. Governança comercial

Fluxo oficial:

**coleta → análise CFO → proposta aprovada → publicação → aceite do cliente → validação CFO → contrato → assinatura → implantação**

Regras:

- proposta não é publicada antes de aprovação CFO;
- aceite do cliente não gera contrato automaticamente;
- CFO valida o aceite antes da autorização contratual;
- contrato é etapa posterior à proposta;
- valores da proposta devem ser exatamente os aprovados pelo CFO;
- guardrails internos de margem, piso e custo não aparecem para o cliente.

## 7. Posicionamento jurídico

A FÊNIX atua como **BPO / apoio administrativo-financeiro**.

A proposta não deve afirmar que a FÊNIX:

- executa pagamentos autonomamente;
- movimenta recursos do cliente por decisão própria;
- negocia com terceiros sem autorização;
- toma decisões gerenciais, comerciais ou contratuais pelo cliente;
- administra saldo bancário com discricionariedade.

A redação deve permanecer compatível com o contrato padrão vigente.

## 8. Pipeline e proposta são produtos diferentes

O Pipeline é uma ferramenta interna e pode evoluir visualmente.

A proposta é um ativo comercial homologado e **não pode evoluir visualmente sem nova versão e aprovação**.

Nunca usar o visual do Pipeline como base para redesenhar a proposta.

## 9. Regra para qualquer novo chat, desenvolvedor ou automação

Antes de alterar proposta:

1. Ler este manual.
2. Consultar o Golden Reference homologado.
3. Consultar `PADRAO_PROPOSTA_FENIX_MASTER_LIMPO_V1.md`.
4. Validar que a alteração afeta apenas conteúdo dinâmico.
5. Se afetar visual fixo, interromper e solicitar nova homologação.

## 10. Homologação obrigatória

Nenhuma proposta nova vai para produção sem teste de caso real.

A conferência deve validar página a página:

- composição visual;
- 8 páginas exatas;
- ausência de overflow;
- nome longo do cliente;
- escopo extenso;
- condição comercial;
- software;
- implantação;
- fluxo de aceite;
- responsividade da visualização web sem alterar a composição do Master.

## 11. Versionamento

Qualquer mudança visual futura exige:

- nova versão do Master;
- novo PDF homologado;
- registro da aprovação;
- atualização deste manual;
- atualização dos testes de regressão.

Até isso acontecer, **Master Limpo — Golden Reference Oficial** permanece congelado.

## 12. Branch, PR e produção

Toda alteração do projeto deve ser feita em branch própria e submetida a PR de homologação. `main` não é ambiente de experimento.

Nenhuma mudança pode chegar à produção sem testes, preview, conferência do caso real e aprovação expressa. Alterações que afetem a proposta exigem comparação página a página com o PDF Golden Reference.
