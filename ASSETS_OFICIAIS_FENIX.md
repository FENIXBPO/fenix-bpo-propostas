# FÊNIX — INVENTÁRIO E GOVERNANÇA DE ASSETS OFICIAIS

Status: **NORMA DE IMPLEMENTAÇÃO — GOLDEN REFERENCE REVISÃO 03**

## 1. Princípio

A identidade visual da proposta comercial não pode ser redesenhada, aproximada ou reconstruída por código.

A única autoridade visual é:

`homologacao/FENIX_MASTER_LIMPO_GOLDEN_REFERENCE_APROVADO.pdf`

Qualquer divergência entre código, CSS, HTML, imagem ou experimento e esse PDF deve ser resolvida a favor do PDF.

## 2. Assets existentes autorizados para validação/uso

Estes arquivos já existiam na branch-base oficial do PR #5 e são os únicos candidatos atuais a assets de marca na implementação web:

- `assets/fenix-logo-header-crop.webp`
- `assets/fenix-logo-header.webp`
- `assets/fenix-logo-transparent.webp`
- `assets/fenix-logo-white-transparent.webp`
- `assets/fenix-symbol.png`

Regra: a existência no repositório não autoriza alteração visual. Cada uso deve reproduzir o Golden Reference e deve ser verificado em preview no navegador antes de homologação.

## 3. Assets proibidos como fonte visual

Os arquivos abaixo pertencem às tentativas experimentais V10–V13 e não constituem identidade oficial:

- `assets/fenix-logo-v13.svg`
- `assets/fenix-mark-v13.svg`
- `assets/golden-shell-rev03.svg`, quando utilizado como reconstrução aproximada do Golden
- `assets/proposta-refino-mkt-v10.css`
- `assets/proposta-refino-mkt-v11.css`
- `assets/proposta-refino-mkt-v12.css`
- `assets/proposta-refino-mkt-v13.css`
- `homologacao/proposta-visual-v10.html`
- `homologacao/proposta-visual-v11.html`
- `homologacao/proposta-visual-v12.html`
- `homologacao/proposta-visual-v13.html`

Esses arquivos podem permanecer apenas como histórico técnico em branches/PRs experimentais. Não podem ser carregados pela rota pública nem usados para definir logo, asa, símbolo, paleta, proporções ou composição.

## 4. Proibição de reconstrução

É proibido:

- redesenhar a logo em SVG;
- redesenhar o símbolo/asa em SVG;
- transformar a marca em paths vetoriais produzidos manualmente;
- criar uma nova Fênix por CSS, `clip-path`, máscara ou desenho aproximado;
- substituir a paleta do Golden Reference por uma paleta interpretada;
- usar V10–V13 para decidir posicionamento ou acabamento;
- adicionar glow, azul, gradientes ou efeitos não presentes no Golden Reference.

## 5. Arquitetura obrigatória

A proposta deve seguir:

**moldura visual fixa fiel ao Golden Reference + campos dinâmicos do cliente**.

Os campos dinâmicos não podem mudar:

- posição estrutural das páginas;
- identidade visual;
- número de páginas;
- logo e símbolo;
- narrativa das 8 páginas.

## 6. Critério de aceite de um asset

Antes de um asset ser considerado homologado para produção:

1. arquivo deve carregar no navegador sem erro;
2. resposta HTTP deve ser válida;
3. transparência/fundo devem estar corretos;
4. proporção não pode deformar a marca;
5. aparência deve ser comparada ao Golden Reference;
6. deve ser testado nas 8 páginas quando aplicável;
7. página 8 deve ser conferida explicitamente;
8. impressão/PDF deve preservar o asset;
9. não pode haver fallback para asset experimental/recriado.

## 7. Regra para CSS e HTML

A rota pública oficial não pode importar CSS identificado como V10, V11, V12 ou V13.

A implementação canônica deve permanecer concentrada em:

- `master-template/proposta-master-limpa-v1.html`
- `master-template/proposta-master-limpa-v1.css`
- `master-template/proposta-master-limpa-v1.js`
- `p/proposta-master-v1.html`

Qualquer ajuste nesses arquivos deve ser feito em branch/PR de homologação e comparado ao PDF antes de merge.

## 8. Status dos experimentos V10–V13

**REJEITADOS COMO PADRÃO VISUAL.**

Podem ser consultados apenas para histórico de bugs e tentativas técnicas. Nunca como referência de design.
