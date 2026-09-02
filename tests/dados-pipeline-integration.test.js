const assert=require('assert');
const fs=require('fs');
const path=require('path');
const pipeline=require('../pipeline-state');

const root=path.join(__dirname,'..');
const dadosEntry=fs.readFileSync(path.join(root,'dados','index.html'),'utf8');
const dadosV3=fs.readFileSync(path.join(root,'dados-v3','index.html'),'utf8');
const dadosV4=fs.readFileSync(path.join(root,'dados-v4','index.html'),'utf8');
const intakeApi=fs.readFileSync(path.join(root,'api','intake.js'),'utf8');

assert.match(dadosEntry,/url=\/dados-v4\//i,'/dados deve apontar para /dados-v4/');
assert.match(dadosV4,/\/dados-v3\//,'V4 deve preservar a V3 funcional como base');
assert.match(dadosV4,/13tZmkBjfMthdrdqEhwD2Efw8x_4UmHvh/,'V4 deve usar a logo oficial validada no Drive');
assert.match(dadosV4,/brand-logo[^}]*width:min\(470px/i,'marca FÊNIX deve ter presença maior no topo');
assert.match(dadosV3,/fetch\('\/api\/intake'/,'formulário base deve enviar para /api/intake');
assert.match(dadosV3,/id=\"endereco\"[^>]*readonly/,'endereço cadastral deve existir e ser preenchido pela consulta do CNPJ');
assert.match(dadosV3,/\$\('endereco'\)\.value=/,'consulta CNPJ deve preencher o endereço cadastral');
for(const field of [
  'cnpj','razao','nome_fantasia','responsavel','cargo','email','telefone','ramos','cidade_uf','endereco',
  'descricao','dor','expectativa','consome_tempo','faturamento','recebimentos','pagamentos','notas','outros_movimentos',
  'bancos','cartoes','contas_aplicacao','cnpjs','centros_custo','funcionarios','implantacao_situacao','dor_atrasados',
  'sistema_atual','financeiro_interno','contabilidade_definida','frequencia','aprovador_financeiro','processo_aprovacao','previsao_inicio','repasses','outros_servicos','escopo'
]) assert.ok(dadosV3.includes(field),`campo ${field} deve existir no formulário base`);
for(const removed of ['notas_recebidas','contratos_novos','comissoes_lancadas','filiais']) assert.ok(!dadosV3.includes(`id=\"${removed}\"`),`${removed} não deve aparecer como pergunta separada`);
assert.match(intakeApi,/status:\s*'recebido'/,'novo intake deve nascer como recebido');
assert.equal(pipeline.stageOf('recebido'),'dados_recebidos','recebido deve cair em Dados recebidos no Pipeline');
assert.match(intakeApi,/schema_version:\s*'2\.1\.0'/,'snapshot deve registrar schema 2.1.0');
console.log('PASS /dados oficial → logo Drive + endereço CNPJ + Intake 2.1 → Pipeline Dados recebidos');
