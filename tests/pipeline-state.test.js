const assert=require('assert');
const pipeline=require('../pipeline-state');

assert.equal(pipeline.version,'2.0.0');
assert.equal(pipeline.STAGES.length,10);
assert.deepEqual(pipeline.STAGES.map(x=>x.key),['lead','dados_recebidos','analise','proposta','enviada','aceita','cfo','contrato','assinatura','implantacao']);
assert.equal(pipeline.stageOf('recebido'),'dados_recebidos');
assert.equal(pipeline.stageOf('rascunho_cfo'),'analise');
assert.equal(pipeline.stageOf('aprovada_cfo'),'proposta');
assert.equal(pipeline.stageOf('publicada'),'enviada');
assert.equal(pipeline.stageOf('proposta_aceita_aguardando_cfo'),'cfo');
assert.equal(pipeline.stageOf('contrato_autorizado'),'contrato');
assert.equal(pipeline.stageOf('assinado'),'assinatura');
assert.equal(pipeline.stageOf('em_implantacao'),'implantacao');
assert.equal(pipeline.acceptedMilestone({status:'proposta_aceita_aguardando_cfo'}),true);
assert.equal(pipeline.acceptedMilestone({status:'publicada'}),false);

console.log('PASS Pipeline V2: 10 etapas e compatibilidade com status atuais');
