# Hotfix estrutural da logo da coleta

A rota `/dados-v2/` mantém temporariamente o wizard dentro de iframe, porém a marca FÊNIX deixa de depender do DOM interno.

A logo oficial agora é renderizada no HTML externo da rota, com `z-index` próprio e fallback oficial local. A logo interna do iframe é ocultada.

Motivo: eliminar a dependência de `iframe.contentDocument`, troca dinâmica de `src` e CSS interno para a identidade visual.

Próximo passo estrutural recomendado: consolidar o wizard final em página única, removendo o iframe e os patches em runtime.