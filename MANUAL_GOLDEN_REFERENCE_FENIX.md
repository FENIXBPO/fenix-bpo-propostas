# FÊNIX — MANUAL DO GOLDEN REFERENCE

Status: **NORMA OFICIAL E VINCULANTE DO PROJETO**

Nome oficial do padrão: **Master Limpo — Golden Reference Oficial**

Versão visual vigente: **Revisão 03 — homologada em 2 de setembro de 2026**

## 1. Autoridade visual

O PDF homologado **`homologacao/FENIX_MASTER_LIMPO_GOLDEN_REFERENCE_APROVADO.pdf`** é a autoridade visual máxima da proposta comercial FÊNIX.

Integridade oficial (SHA-256): `14b626a36031c0b04d0aabaaabaa52b5efd90672811f1dcff6060459042c1cf4`.

Ele não é inspiração ou referência aproximada. É a única fonte visual autorizada para a proposta.

Se houver qualquer conflito entre PDF, HTML, CSS, JavaScript, Gamma, apresentação, imagem, template ou interpretação posterior, **o PDF homologado vence**.

A Revisão 03 é a revisão vigente e inclui a **logo correta na página 8**.

## 2. Regra de imutabilidade visual

A proposta aprovada não pode ser redesenhada por cliente, canal ou tecnologia.

São fixos:

- 8 páginas;
- proporção e composição geral;
- fundo preto contínuo;
- logo FÊNIX oficial;
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
- valor final;
- implantação;
- software/ERP;
- Conta Azul;
- valores adicionais;
- observações comerciais aprovadas;
- condições aprovadas pelo CFO;
- extras e demais informações aprovadas internamente.

Valores exibidos no Golden Reference são exemplos de um caso homologado e **não constituem tabela fixa de preço**.

## 4. Estrutura fixa das 8 páginas

1. Capa — Proposta Comercial, cliente, FÊNIX Intelligent BPO e identificação comercial.
2. Nossa Compreensão — entendimento real do cliente; Controle, Previsibilidade e Decisão.
3. Escopo da Proposta — atividades e limites definidos pelos dados coletados e pela aprovação interna.
4. Responsabilidades Bem Definidas — execução de rotinas aprovadas pela FÊNIX e decisões/autorizações sob responsabilidade do cliente.
5. Processos, Automação, IA e Dados — tecnologia ligada a benefícios concretos, sem discurso vazio.
6. Prontos para Começar — aprovação → contrato/pagamentos → kickoff/implantação → operação.
7. Condição Comercial — mensalidade, implantação, limites, volumes, software, adicionais e fora de escopo, com forte hierarquia para o valor final mensal.
8. Próximos Passos — Aceite Comercial → Validação CFO → Contrato → Kickoff, com CTA claro e logo correta.

A ordem não pode ser alterada sem nova homologação formal.

## 5. Regra de implementação

A arquitetura correta é:

**moldura visual fixa + campos dinâmicos por cima**.

A moldura deve usar os assets reais homologados. Não reconstruir logo, asa, símbolo, diagonais ou canto por aproximação.

Consultar obrigatoriamente `ASSETS_OFICIAIS_FENIX.md` antes de qualquer mudança visual.

É expressamente proibido redesenhar logo/símbolo em SVG ou criar uma Fênix alternativa por paths, mask, clip-path ou CSS.

## 6. Experimentos rejeitados

As tentativas **V10, V11, V12 e V13** são experimentos rejeitados e não constituem referência visual.

Elas podem permanecer no histórico técnico, mas não podem ser usadas para decidir:

- logo;
- símbolo/asa;
- paleta;
- composição;
- espaçamento;
- efeitos;
- tipografia;
- posição de elementos.

Nenhuma rota pública pode importar CSS V10–V13.

## 7. Governança comercial

Fluxo oficial:

**cliente preenche `/dados` → FÊNIX analisa → CFO valida escopo/preço → proposta é gerada → proposta é enviada → cliente aceita → CFO valida → contrato é gerado → assinatura → implantação**.

Regras:

- proposta não é publicada antes de aprovação CFO;
- aceite do cliente não gera contrato automaticamente;
- CFO valida o aceite antes da autorização contratual;
- contrato é etapa posterior à proposta;
- valores da proposta devem ser exatamente os aprovados pelo CFO;
- guardrails internos de margem, piso e custo não aparecem para o cliente.

## 8. Posicionamento jurídico

A FÊNIX atua como **BPO / apoio administrativo-financeiro**.

A proposta não deve afirmar que a FÊNIX:

- executa pagamentos autonomamente;
- movimenta recursos do cliente por decisão própria;
- negocia com terceiros sem autorização;
- toma decisões gerenciais, comerciais ou contratuais pelo cliente;
- administra saldo bancário com discricionariedade.

A redação deve permanecer compatível com o contrato padrão vigente.

## 9. Pipeline e proposta são produtos diferentes

O Pipeline é uma ferramenta interna e pode evoluir visualmente.

A proposta é um ativo comercial homologado e **não pode evoluir visualmente sem nova versão e aprovação**.

Nunca usar o visual do Pipeline como base para redesenhar a proposta.

Pipeline desejado:

**Lead → Dados recebidos → Análise → Proposta → Enviada → Aceita → CFO → Contrato → Assinatura → Implantação**.

A implementação pode ser evoluída progressivamente, preservando histórico e transições governadas por eventos reais.

## 10. Regra para qualquer novo chat, desenvolvedor ou automação

Antes de alterar proposta:

1. Ler este manual.
2. Consultar o Golden Reference homologado.
3. Consultar `ASSETS_OFICIAIS_FENIX.md`.
4. Consultar `PADRAO_PROPOSTA_FENIX_MASTER_LIMPO_V1.md`.
5. Validar que a alteração afeta apenas conteúdo dinâmico.
6. Se afetar visual fixo, trabalhar apenas em branch/PR de homologação e comparar ao Golden Reference.
7. Se a alteração representar novo design, interromper: exige nova homologação formal.

## 11. Homologação obrigatória

Nenhuma proposta nova vai para produção sem teste de caso real.

A conferência deve validar página a página:

- página carregada sem erro;
- 8 páginas exatas;
- logo oficial visível;
- assets visíveis e sem imagem quebrada;
- composição visual;
- ausência de overflow;
- nome do cliente correto;
- textos e hierarquia;
- nome longo do cliente;
- escopo extenso;
- condição comercial;
- preços e desconto;
- software;
- implantação;
- página 8 com logo correta e CTA;
- fluxo de aceite;
- visualização desktop;
- impressão/PDF;
- comparação com o Golden Reference.

Se algum item crítico não puder ser validado tecnicamente, a proposta não deve ser apresentada como homologada.

## 12. Versionamento

Qualquer mudança visual futura exige:

- nova versão/revisão do Master;
- novo PDF homologado;
- registro da aprovação;
- atualização deste manual;
- atualização dos testes de regressão.

Até isso acontecer, **Master Limpo — Golden Reference Oficial — Revisão 03** permanece congelado.

## 13. Branch, PR e produção

Toda alteração do projeto deve ser feita em branch própria e submetida a PR de homologação. `main` não é ambiente de experimento.

Nenhuma mudança pode chegar à produção sem testes, preview, conferência do caso real e aprovação expressa. Alterações que afetem a proposta exigem comparação página a página com o PDF Golden Reference.
