const assert=require('assert');
const fs=require('fs');
const path=require('path');
const pipeline=require('../pipeline-state');

const root=path.join(__dirname,'..');
const dadosEntry=fs.readFileSync(path.join(root,'dados','index.html'),'utf8');
const dadosV2=fs.readFileSync(path.join(root,'dados-v2','index.html'),'utf8');
const intakeApi=fs.readFileSync(path.join(root,'api','intake.js'),'utf8');

assert.match(dadosEntry,/url=\/dados-v2\//i,'/dados deve apontar para /dados-v2/');
assert.match(dadosV2,/fetch\('\/api\/intake'/,'formulário V2 deve enviar para /api/intake');

for(const field of [
  'cnpj','razao','nome_fantasia','responsavel','cargo','email','telefone','ramos','cidade_uf',
  'descricao','dor','expectativa','consome_tempo','faturamento','recebimentos','pagamentos',
  'notas','notas_recebidas','lancamentos','contratos_novos','comissoes_lancadas','bancos',
  'cartoes','contas_aplicacao','cnpjs','filiais','centros_custo','funcionarios',
  'implantacao_situacao','dor_atrasados','sistema_atual','financeiro_interno',
  'contabilidade_definida','frequencia','repasses','outros_servicos','escopo','objetivos'
]){
  assert.ok(dadosV2.includes(field),`campo ${field} deve existir no payload do formulário`);
}

assert.match(intakeApi,/status:\s*'recebido'/,'novo intake deve nascer como recebido');
assert.equal(pipeline.stageOf('recebido'),'dados_recebidos','recebido deve cair em Dados recebidos no Pipeline');
assert.match(intakeApi,/raw_payload:\s*\{\s*form,\s*cnpjData:\s*lookup,\s*normalized/,'Intake V2 deve preservar payload bruto e snapshot normalizado');

console.log('PASS /dados → Intake V2 → Pipeline Dados recebidos');
