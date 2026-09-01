# FÊNIX — MASTER LIMPO DA PROPOSTA v1

Status: **BASE OFICIAL EM HOMOLOGAÇÃO — NÃO PUBLICAR EM PRODUÇÃO SEM APROVAÇÃO VISUAL FINAL**

## Regra principal

Este master é a fonte visual e técnica da proposta comercial FÊNIX. Uma vez aprovado, **não deve ser redesenhado, reinterpretado ou reconstruído por cliente**. O sistema deve apenas preencher campos variáveis originados da coleta de dados e da aprovação do CFO.

## Arquitetura obrigatória

1. **Moldura visual fixa**: fundo preto contínuo, logo FÊNIX, asa lateral, diagonais douradas, brilhos, canto metálico e identidade tipográfica.
2. **Conteúdo dinâmico separado**: nenhum nome, valor, escopo ou texto de cliente deve estar rasterizado/gravado no fundo.
3. **Sem máscaras de correção**: não usar retângulos, overlays ou faixas para esconder texto antigo.
4. **Sem logo pequena no rodapé**.
5. **Fundo deve permanecer preto contínuo em toda a página**, inclusive sob logo, asa, diagonais e região de conteúdo.
6. **Página 1 é o Golden Master de composição** e define alinhamentos, margens, proporções e linguagem visual das páginas 2–8.

## Estrutura das 8 páginas

1. Capa — Proposta Comercial
2. Nossa compreensão
3. Escopo da proposta
4. Modelo de atuação / Responsabilidades
5. Tecnologia — Processos, Automação, IA e Dados
6. Continuidade / Implantação
7. Condição comercial
8. Próximos passos e aceite

## Campos dinâmicos

### Página 1
- `client_name`
- `client_legal_name`
- `segment`
- `proposal_date`

Regras:
- nome do cliente: máximo 2 linhas;
- ajuste automático de tamanho;
- não invadir a asa direita;
- barra inferior em 3 colunas fixas: Cliente / Segmento / Data;
- nenhuma coluna pode sobrepor a seguinte.

### Página 2
- `business_description`
- `pain`
- `expectation`
- mensagens-chave derivadas da coleta, sem inventar fatos.

### Página 3
- `approved_scope.operational`
- `approved_scope.managerial`
- observações de escopo/CFO quando existirem.

### Página 4
Conteúdo jurídico majoritariamente fixo. Posicionamento obrigatório:
- FÊNIX atua como BPO / apoio administrativo-financeiro;
- cliente mantém autorizações, liberações e decisões financeiras;
- FÊNIX não realiza movimentação autônoma de recursos;
- serviços fora de escopo e retrabalhos dependem de autorização prévia.

### Página 5
- sistema/software quando aplicável;
- automações/integracões pertinentes;
- texto institucional fixo sobre processos, IA e dados.

### Página 6
- condições de implantação;
- cronograma/etapas quando aprovados.

### Página 7
Somente valores aprovados pelo CFO:
- `cnpjs`
- `launch_limit_per_cnpj`
- `launch_limit_group`
- `bank_accounts_included`
- `base_monthly`
- `discount`
- `final_monthly`
- `per_cnpj`
- `implementation`
- `software_name`
- `software_total`
- `software_per_cnpj`
- `additional_bank_account`
- observações comerciais.

### Página 8
Fluxo obrigatório:
**Aceite do cliente → Validação CFO → Contrato → Assinatura → Implantação / Kickoff**.

O aceite do cliente **não gera contrato automaticamente**.

## Governança do fluxo

Coleta → análise interna → aprovação CFO → publicação → aceite do cliente → validação CFO → contrato → assinatura → implantação/operação.

## Critérios de aprovação visual

Antes de congelar este master, validar:
- zero sobreposição de textos;
- zero caixas/retângulos perceptíveis no fundo;
- fundo preto contínuo;
- nome curto, médio e longo na capa;
- textos de página 2 em diferentes comprimentos;
- escopo curto e escopo extenso;
- condição comercial com e sem desconto/software;
- página 8 sem colisão entre rodapé, aceite e linha de fluxo;
- responsividade preservando proporção 16:9.

## Regra de mudança futura

Toda mudança visual, comercial ou jurídica deve ser versionada. Não alterar esta versão silenciosamente após aprovação.
