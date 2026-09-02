# FÊNIX — AUDITORIA DE MARKETING E VISUAL V10

Data: 2 de setembro de 2026  
Branch: `fix/golden-rev03-shell`  
PR: #6  
Status: **APTO PARA HOMOLOGAÇÃO VISUAL — NÃO APTO PARA MERGE SEM APROVAÇÃO HUMANA**

## 1. Objetivo

Refinar a apresentação comercial sem alterar escopo, preços, governança, sequência das oito páginas ou lógica de aceite.

## 2. Decisões de direção de arte aplicadas

- Fundo escuro neutro, sem azul.
- Preto principal refinado para `#050505`, evitando aspecto excessivamente chapado do preto absoluto.
- Profundidade mínima com vinheta dourada de baixa intensidade, sem transformar a página em degradê colorido.
- Logo FÊNIX em asset transparente, sem glow azul.
- Símbolo FÊNIX aplicado diretamente como marca d'água monocromática, sem `mask` obrigatória.
- Marca d'água posicionada no lado direito, sempre atrás do conteúdo.
- Intensidade variável por página para criar ritmo visual sem perder consistência.
- Títulos com menor efeito e linguagem mais editorial/executiva.
- Cards escuros com borda dourada controlada, sem excesso de brilho.
- Página 7 com hierarquia reforçada para a mensalidade final.
- Página 8 com CTA visualmente mais evidente.

## 3. Auditoria de marca

### Logo

- Asset: `/assets/fenix-logo-transparent.webp`.
- Sem filtro azul.
- Sem `mix-blend-mode` na logo.
- Presença ampliada no topo esquerdo.
- Mantida fora da área dinâmica do cliente.

### Marca d'água

- Asset: `/assets/fenix-symbol.png`.
- Uso direto como `background-image`.
- Monocromatização por `grayscale`.
- Brilho controlado por `brightness` apenas para vencer o fundo escuro.
- Opacidade padrão: 10,5%.
- Capa, compreensão e fechamento: 12%.
- Escopo e investimento: 7,5% para reduzir disputa com conteúdo denso.
- Demais páginas: 9,5%.

## 4. Auditoria de leitura e conversão

- Nome do cliente continua sendo o principal elemento da capa.
- Página 2 continua centrada na realidade do cliente, não em autopromoção da FÊNIX.
- Página 3 mantém escopo operacional e gerencial separados.
- Página 4 mantém responsabilidades bem definidas.
- Página 5 mantém tecnologia conectada a processos, automação, IA, dados e decisão.
- Página 6 mantém fluxo de implantação em quatro passos.
- Página 7 reforça mensalidade final como métrica principal.
- Página 8 mantém aceite → CFO → contrato → assinatura → implantação.

## 5. Auditoria técnica

- As oito páginas do Master permanecem intactas em estrutura e ordem.
- Nenhum conteúdo comercial foi reescrito nesta revisão.
- Nenhuma regra de CFO, aceite ou contrato foi alterada.
- Nenhuma mudança foi feita em `main`.
- Refinamento visual foi isolado em `/assets/proposta-refino-mkt-v10.css` para facilitar rollback e comparação.
- Preview específico criado em `/homologacao/proposta-visual-v10.html?demo=1`.
- Rota pública recebeu o CSS de refinamento em homologação.
- Cache de CSS/JS da rota pública foi elevado para v10.
- Deploy de preview Vercel concluído com status Ready após as alterações.

## 6. Pontos que exigem validação visual humana

Antes de qualquer merge, confirmar no preview:

1. Logo FÊNIX aparece integral, sem caixa ou glow azul.
2. Marca d'água aparece em todas as páginas e não some em telas comuns.
3. Marca d'água não compete com títulos ou cards.
4. Não há recorte ou esticamento do símbolo.
5. Página 3 continua sem overflow.
6. Página 7 mantém todos os preços e limites dentro da área segura.
7. Página 8 permanece inteira e com CTA legível.
8. As oito páginas mantêm aparência premium e consistente.
9. Impressão/PDF mantém fundo, logo e marca d'água.

## 7. Decisão

A revisão v10 está tecnicamente organizada e alinhada à direção comercial aprovada. Ela deve ser apresentada para homologação visual do responsável antes de ser incorporada ao PR #5 ou chegar à produção.
