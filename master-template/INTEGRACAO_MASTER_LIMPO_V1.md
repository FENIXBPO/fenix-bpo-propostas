# Integração - Master Limpo v1

Status: HOMOLOGAÇÃO. Não publicar em `main` antes da aprovação final.

## Fonte de dados

O template `proposta-master-limpa-v1.html` usa `proposta-master-limpa-v1.js` para carregar `/api/public-proposal?ref=<slug>`.

A API fornece somente dados já publicados/aprovados no fluxo comercial: cliente, segmento, contexto da coleta, termos comerciais, escopo aprovado e premissas.

## Separação obrigatória

### Camada fixa
- fundo preto contínuo;
- logo FÊNIX;
- asa/marca d'água;
- diagonais e brilhos dourados;
- canto metálico;
- estrutura das páginas;
- textos institucionais e guardrails jurídicos.

### Camada dinâmica
- nome/razão social;
- segmento e data;
- descrição, dor e expectativa;
- escopo operacional e gerencial aprovado;
- CNPJs, limites e contas incluídas;
- mensalidade base, desconto, mensalidade final, implantação e software.

## Guardrails

1. Nunca gravar texto de cliente dentro da arte de fundo.
2. Nunca usar máscara ou retângulo para esconder conteúdo anterior.
3. Nome do cliente limitado a duas linhas com ajuste automático de tamanho.
4. Fundo permanece preto uniforme até a asa e o canto dourado.
5. Sem mini-logo repetida no rodapé.
6. Escopo gerencial vazio deve exibir estado neutro, nunca inventar atividade.
7. Valores comerciais vêm somente de `commercial_terms` aprovados pelo CFO.
8. Aceite do cliente não gera contrato automaticamente: aceite -> validação CFO -> contrato.
9. Trabalhos extras/retrabalho fora do escopo exigem autorização prévia.
10. Posicionamento jurídico: apoio administrativo-financeiro / BPO.

## Homologação

Caso de teste oficial atual: proposta FENIX-000113-V1.

Antes de merge em `main`, validar em PDF as 8 páginas e testar nomes curtos, médios e longos.
