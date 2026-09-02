const assert=require('assert');
const fs=require('fs');
const path=require('path');

const model=require('../pipeline-state');
const source=fs.readFileSync(path.join(__dirname,'..','dashboard-pipeline-v2.js'),'utf8');
const stageApi=fs.readFileSync(path.join(__dirname,'..','api','internal-intake-stage.js'),'utf8');
const intakesApi=fs.readFileSync(path.join(__dirname,'..','api','internal-intakes.js'),'utf8');

assert.deepEqual(model.STAGES.map(x=>x.title),[
  'Lead','Dados recebidos','Análise','Proposta','Enviada','Aceita','CFO','Contrato','Assinatura','Implantação'
]);
assert.equal(model.stage('aceita').kind,'milestone');
assert.equal(model.stageOf('proposta_aceita_aguardando_cfo'),'cfo');
assert.equal(model.stageOf('publicada'),'proposta','publicada não pode significar enviada');
assert.equal(model.stageOf('enviada_cliente'),'enviada','somente envio registrado deve cair em Enviada');
assert.match(source,/fenix-v3-grid\.top/,'primeira linha executiva deve existir');
assert.match(source,/fenix-v3-grid\.bottom/,'segunda linha executiva deve existir');
assert.match(source,/grid-template-columns:repeat\(5/,'primeira linha deve ter cinco etapas');
assert.match(source,/grid-template-columns:repeat\(4/,'segunda linha deve ter quatro etapas operacionais');
assert.match(source,/fenix-accept-milestone/,'Aceita deve ser marco compacto, não coluna operacional');
assert.match(source,/Receita mensal potencial/,'MRR deve ser traduzido para linguagem gerencial');
assert.match(source,/Receita mensal em propostas/,'indicador de propostas deve ser claro');
assert.match(source,/Pendências para aprovação/,'pendência CFO deve usar linguagem simples');
assert.match(source,/Responsável:/,'card deve mostrar responsável');
assert.match(source,/Na etapa:/,'card deve mostrar tempo na etapa');
assert.match(intakesApi,/created_at,updated_at,status/,'API deve expor updated_at para calcular tempo na etapa');
assert.match(source,/Valor mensal/,'card não deve usar Mensalidade CFO');
assert.match(source,/Validar e liberar contrato/,'CTA do CFO deve explicar o resultado da ação');
assert.match(source,/Buscar cliente/,'painel deve ter busca');
assert.match(source,/Todos os responsáveis/,'painel deve ter filtro por responsável');
assert.match(source,/Enviar proposta/,'proposta publicada deve ter um CTA principal de envio');
assert.match(source,/WhatsApp.*E-mail/s,'homologação deve prever os dois canais');
assert.match(source,/Nenhuma mensagem foi enviada/,'homologação não pode disparar mensagem real');
assert.match(source,/Encerrados \/ Arquivo/,'encerrados devem ficar fora do funil ativo');
assert.match(stageApi,/CLOSE_REASONS/,'API deve validar motivos de encerramento');
assert.match(stageApi,/close_reason:reason/,'motivo deve ser persistido no histórico');
assert.doesNotMatch(source,/data-stage=["']encerrado["']/i);

console.log('PASS Pipeline V3 executivo: cards claros, aceite compacto, filtros e arquivo auditável');
