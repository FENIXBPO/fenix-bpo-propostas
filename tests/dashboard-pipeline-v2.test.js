const assert=require('assert');
const fs=require('fs');
const path=require('path');

const model=require('../pipeline-state');
const source=fs.readFileSync(path.join(__dirname,'..','dashboard-pipeline-v2.js'),'utf8');

assert.deepEqual(model.STAGES.map(x=>x.title),[
  'Lead','Dados recebidos','Análise','Proposta','Enviada','Aceita','CFO','Contrato','Assinatura','Implantação'
]);
assert.equal(model.stage('aceita').kind,'milestone');
assert.equal(model.stageOf('proposta_aceita_aguardando_cfo'),'cfo');
assert.match(source,/card\.draggable=false/);
assert.match(source,/removeAttribute\('draggable'\)/);
assert.match(source,/Aceita.*marco|aceite é um marco/is);
assert.doesNotMatch(source,/data-stage=["']encerrado["']/i);

console.log('PASS Pipeline V2: 10 etapas, aceite como marco e sem arraste manual');
