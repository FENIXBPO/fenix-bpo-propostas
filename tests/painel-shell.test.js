const assert=require('assert');
const fs=require('fs');
const path=require('path');

const html=fs.readFileSync(path.join(__dirname,'..','painel','index.html'),'utf8');

assert.doesNotMatch(html,/http-equiv=["']refresh["']/i,'/painel não deve redirecionar diretamente para o legado');
assert.match(html,/fenix-logo-header-crop\.webp/,'loader deve usar a marca oficial');
assert.match(html,/app-v15\.html\?interno=1&painel_shell=1/,'shell deve carregar o app interno invisível');
assert.match(html,/dataset\.pipelineV2===['"]1['"]/,'shell só deve revelar o painel após Pipeline V2 estar pronto');
assert.match(html,/interface antiga não será exibida/i,'falha de carregamento não deve revelar a UI antiga');

console.log('PASS Painel shell: sem flash legado e liberação somente após Pipeline V2');
