const assert=require('assert');
const fs=require('fs');
const path=require('path');

const source=fs.readFileSync(path.join(__dirname,'..','dashboard-pipeline-v4-polish.js'),'utf8');
const panel=fs.readFileSync(path.join(__dirname,'..','internal-panel.js'),'utf8');

assert.match(panel,/dashboard-pipeline-v4-polish\.js/,'painel deve carregar a camada V4');
assert.match(source,/fenix-logo-header-crop\.webp/,'V4 deve usar o asset oficial de cabeçalho');
assert.match(source,/fenix-logo-transparent\.webp/,'logo deve ter fallback apenas para outro asset oficial');
assert.match(source,/fenix-analysis-modal-backdrop/,'análise deve abrir em modal lateral');
assert.match(source,/window\.scrollTo\(\{top:previousY/,'modal deve preservar a posição do Pipeline');
assert.match(source,/data-stage=\"dados_recebidos\"/,'etapas devem ter tratamento visual próprio');
assert.match(source,/data-stage=\"implantacao\"/,'implantação deve ter tratamento visual próprio');
assert.match(source,/font-size:16px!important/,'card deve aumentar legibilidade do nome do cliente');

console.log('PASS Pipeline V4: logo oficial, modal sem rolagem, tipografia e cores por etapa');
