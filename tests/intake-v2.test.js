const assert=require('assert');

process.env.SUPABASE_SECRET_KEY='test-secret';

function responseCapture(){return{statusCode:200,body:null,status(code){this.statusCode=code;return this},json(body){this.body=body;return this}}}
function jsonResponse(data,status=200){return{ok:status>=200&&status<300,status,text:async()=>JSON.stringify(data)}}

(async()=>{
  const writes=[];
  global.fetch=async(url,options={})=>{
    const body=options.body?JSON.parse(options.body):null;
    writes.push({url,method:options.method,body});
    if(url.includes('/rest/v1/bpo_clients'))return jsonResponse([{id:'11111111-1111-1111-1111-111111111111'}],201);
    if(url.includes('/rest/v1/bpo_intakes'))return jsonResponse([{id:'22222222-2222-2222-2222-222222222222'}],201);
    throw new Error('Chamada inesperada: '+url);
  };

  delete require.cache[require.resolve('../api/intake')];
  const handler=require('../api/intake');
  const req={method:'POST',body:{form:{
    cnpj:'12.345.678/0001-99',razao:'CLIENTE TESTE LTDA',nome_fantasia:'Cliente Teste',responsavel:'Maria Silva',cargo:'Diretora',email:'maria@cliente.com.br',telefone:'47999999999',cidade_uf:'Joinville / SC',
    ramos:'Serviços',descricao:'Operação de serviços',dor:'Retrabalho',expectativa:'Previsibilidade',objetivos:['Organizar a operação','Reduzir retrabalho'],consome_tempo:'Conciliação',
    faturamento:'150.000,00',recebimentos:'20',pagamentos:'30',notas:'10',notas_recebidas:'12',lancamentos:'8',contratos_novos:'3',comissoes_lancadas:'4',
    bancos:'Itaú, Sicoob',cartoes:'2',contas_aplicacao:'1',cnpjs:'1',filiais:'0',centros_custo:'2',funcionarios:'4',implantacao_situacao:'Parcialmente organizado',dor_atrasados:'Sim',
    sistema_atual:'Conta Azul',financeiro_interno:'Parcialmente',contabilidade_definida:'Sim',frequencia:'Diária',repasses:'Sim',outros_servicos:'Apoio em contratos',escopo:['Conciliação bancária diária','Contas a pagar']
  },cnpjData:{}}};
  const res=responseCapture();
  await handler(req,res);

  assert.equal(res.statusCode,201);
  assert.equal(res.body.schema_version,'2.0.0');
  const intakeWrite=writes.find(x=>x.url.includes('/rest/v1/bpo_intakes'));
  assert(intakeWrite,'deve gravar bpo_intakes');
  const normalized=intakeWrite.body.raw_payload.normalized;
  assert.equal(normalized.client.responsavel_cargo,'Diretora');
  assert.equal(normalized.client.cidade,'Joinville');
  assert.equal(normalized.client.uf,'SC');
  assert.equal(normalized.operation.sistema_atual,'Conta Azul');
  assert.equal(normalized.operation.frequencia_desejada,'Diária');
  assert.equal(normalized.operation.financeiro_interno,'Parcialmente');
  assert.deepEqual(normalized.business.objetivos,['Organizar a operação','Reduzir retrabalho']);
  assert.equal(normalized.volume.contratos_novos_mes,3);
  assert.equal(normalized.volume.comissoes_lancadas_mes,4);
  assert.deepEqual(normalized.scope_requested,['Conciliação bancária diária','Contas a pagar']);
  assert.equal(intakeWrite.body.status,'recebido');
  assert.equal(intakeWrite.body.descricao_negocio,'Operação de serviços');
  assert.deepEqual(intakeWrite.body.escopo,['Conciliação bancária diária','Contas a pagar']);

  console.log('PASS Intake V2: snapshot normalizado e compatibilidade legada');
})().catch(error=>{console.error(error);process.exitCode=1});
