const assert=require('assert');
const fs=require('fs');
const path=require('path');

const model=require('../pipeline-state');
const source=fs.readFileSync(path.join(__dirname,'..','dashboard-pipeline-v2.js'),'utf8');
const stageApi=fs.readFileSync(path.join(__dirname,'..','api','internal-intake-stage.js'),'utf8');

assert.deepEqual(model.STAGES.map(x=>x.title),[
  'Lead','Dados recebidos','Análise','Proposta','Enviada','Aceita','CFO','Contrato','Assinatura','Implantação'
]);
assert.equal(model.stage('aceita').kind,'milestone');
assert.equal(model.stageOf('proposta_aceita_aguardando_cfo'),'cfo');
assert.equal(model.stageOf('publicada'),'proposta','publicada não pode significar enviada');
assert.equal(model.stageOf('proposta_publicada'),'proposta','proposta publicada deve permanecer em Proposta');
assert.equal(model.stageOf('enviada_cliente'),'enviada','somente envio registrado deve cair em Enviada');
assert.match(source,/grid-template-columns:repeat\(5/,'desktop deve mostrar duas linhas de cinco etapas');
assert.match(source,/Enviar ao cliente/,'proposta publicada deve expor ação explícita de envio');
assert.match(source,/WhatsApp.*E-mail/s,'homologação deve prever os dois canais');
assert.match(source,/Nenhuma mensagem foi enviada agora/,'homologação não pode disparar mensagem real');
assert.match(source,/Encerrados \/ Arquivo/,'encerrados devem ficar fora do funil ativo e consultáveis');
assert.match(source,/Encerrar \/ arquivar/,'card deve expor encerramento como ação secundária');
assert.match(source,/sem_resposta.*recusada.*perdida.*adiada.*arquivada/s,'encerramento deve oferecer motivos comerciais');
assert.match(stageApi,/CLOSE_REASONS/,'API deve validar motivos de encerramento');
assert.match(stageApi,/close_reason:reason/,'motivo deve ser persistido no histórico do Pipeline');
assert.match(stageApi,/close_note:note/,'observação deve ser persistida no histórico do Pipeline');
assert.match(source,/card\.draggable=false/);
assert.match(source,/removeAttribute\('draggable'\)/);
assert.match(source,/Marco automático|marco automático/is);
assert.doesNotMatch(source,/data-stage=["']encerrado["']/i);

console.log('PASS Pipeline V2.2: 5x2, publicada ≠ enviada, multicanal e Encerrados/Arquivo auditável');
