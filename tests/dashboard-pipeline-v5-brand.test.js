const assert=require('assert');
const fs=require('fs');
const path=require('path');
const source=fs.readFileSync(path.join(__dirname,'..','dashboard-pipeline-v5-brand.js'),'utf8');
const panel=fs.readFileSync(path.join(__dirname,'..','internal-panel.js'),'utf8');

assert.match(source,/fenix-logo-header-crop\.webp/,'logo oficial deve ser renderizada como imagem');
assert.match(source,/fenix-brand-row/,'cabeçalho deve reservar linha própria para a marca');
assert.match(source,/grid-template-columns:1fr!important/,'cabeçalho deve evitar sobreposição entre texto e ações');
assert.match(source,/--fenix-blue:#14295f/,'paleta deve incluir azul FENIX');
assert.match(source,/--fenix-white:#f7f7f4/,'paleta deve incluir branco');
assert.match(source,/--fenix-yellow:#f2c340/,'paleta deve incluir amarelo/dourado');
assert.match(source,/font-size:20px!important/,'títulos das etapas devem ter leitura ampliada');
assert.match(source,/font-size:18px!important/,'nome do cliente no card deve ser ampliado');
assert.match(panel,/dashboard-pipeline-v5-brand\.js/,'painel deve carregar a camada V5');
console.log('PASS Pipeline V5: marca, paleta, hierarquia e legibilidade protegidas');
