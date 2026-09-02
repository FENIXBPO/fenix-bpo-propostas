# Auditoria Visual — Golden Reference × PR #5

**Data:** 2 de setembro de 2026  
**Status:** **BLOQUEADO PARA MERGE VISUAL**  
**PR:** #5 — `fix/master-proposta-e-pipeline-v2`

## 1. Autoridade auditada

- Arquivo: `FENIX_MASTER_LIMPO_GOLDEN_REFERENCE_APROVADO.pdf`
- SHA-256: `f62c3b2d1e0900161e2c17eb9c6b92c4a204d40a0b3d1e580e8cf51559d02361`
- Páginas: 8
- Formato: 16:9
- Dimensão PDF: 1200 × 675 pontos
- Produtor: WeasyPrint 68.0

O PDF acima é a autoridade visual máxima. Em qualquer divergência, ele vence.

## 2. Resultado da comparação

O Master do PR #5 ainda não pode ser homologado visualmente.

### Divergência crítica de implementação

O Golden Reference usa uma composição gráfica homologada para toda a faixa lateral direita, incluindo asa, textura, diagonais luminosas e canto metálico.

O PR #5 reconstrói esses elementos separadamente em CSS:

- `.wing` usa gradientes e `fenix-symbol.png` com opacidade;
- `.diag-top` e `.diag-bottom` redesenham as diagonais;
- `.gold-corner` redesenha o canto metálico;
- `.brand-logo` usa um asset externo diferente da composição incorporada no Master aprovado.

Essa reconstrução é uma aproximação técnica e viola a regra do manual: HTML e CSS devem reproduzir o Golden Reference, não reinterpretá-lo.

### Dimensão e composição

O Golden Reference foi gerado em páginas fixas de 1600 × 900 pixels. O PR utiliza largura responsiva, `aspect-ratio` e unidades `cqw`. A estratégia pode ser usada somente como escala proporcional externa; ela não pode alterar posições, tamanhos ou quebras internas do Master.

Antes do merge, a implementação deve usar uma moldura fixa fiel ao Golden e aplicar escala uniforme apenas no contêiner externo.

## 3. Observações presentes no próprio PDF aprovado

A inspeção página a página identificou características já presentes na autoridade visual:

- página 3: a nota de aprovação do CFO se sobrepõe à parte final do escopo operacional;
- página 8: o logo aparece parcialmente recortado e há proximidade/sobreposição no bloco de aceite.

Esses pontos não podem ser corrigidos silenciosamente no código. Como estão no PDF aprovado, qualquer melhoria exige um **Golden Reference v2**, nova homologação e atualização do hash oficial.

Até essa decisão, a implementação deve reproduzir o PDF vigente.

## 4. Elementos aprovados estruturalmente

- oito páginas e ordem narrativa corretas;
- fluxo comercial correto;
- separação entre responsabilidades FÊNIX e cliente;
- aceite seguido de validação CFO;
- contrato posterior ao aceite e à validação CFO;
- condição comercial e campos variáveis alinhados à governança.

## 5. Critérios para desbloqueio

O bloqueio visual só pode ser removido quando:

1. o PDF oficial estiver versionado e protegido por hash;
2. os assets exatos do Golden forem utilizados, sem reconstrução aproximada;
3. as oito páginas forem renderizadas com o mesmo enquadramento e proporções;
4. um caso real for comparado página a página;
5. nenhuma informação ultrapassar a área fixa;
6. o CFO registrar aprovação expressa no PR;
7. os testes de integridade e governança passarem.

## 6. Decisão

O PR #5 pode continuar como ambiente de homologação para Pipeline, CFO, contrato e automações. Ele **não deve ser mesclado em produção** enquanto a proposta pública não reproduzir o Golden Reference oficial.
