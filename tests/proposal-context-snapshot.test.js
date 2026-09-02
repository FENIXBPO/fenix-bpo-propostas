const assert=require('assert');
const crypto=require('crypto');
const fs=require('fs');
const path=require('path');

process.env.SUPABASE_SECRET_KEY='test-secret';
process.env.FENIX_INTERNAL_PASSWORD='test-password';

function responseCapture(){return{statusCode:200,body:null,status(code){this.statusCode=code;return this},json(body){this.body=body;return this}}}
function jsonResponse(data,status=200){return{ok:status>=200&&status<300,status,text:async()=>JSON.stringify(data)}}
function cookie(){const exp=String(Math.floor(Date.now()/1000)+300);const sig=crypto.createHmac('sha256',process.env.FENIX_INTERNAL_PASSWORD).update(exp).digest('base64url');return`fenix_internal_session=${exp}.${sig}`}

(async()=>{
 const writes=[];
 global.fetch=async(url,options={})=>{
  const method=options.method||'GET';const body=options.body?JSON.parse(options.body):null;writes.push({url,method,body});
  if(method==='GET'&&url.includes('bpo_proposals?intake_id='))return jsonResponse([{id:'proposal-v1',intake_id:'11111111-1111-1111-1111-111111111111',version:1,status:'aprovada_cfo',approved_by:'CFO'}]);
  if(method==='GET'&&url.includes('bpo_intakes?id=eq.11111111-1111-1111-1111-111111111111'))return jsonResponse([{id:'11111111-1111-1111-1111-111111111111',client_id:'client-1',ramo:'Serviços',descricao_negocio:'Operação atual',dor:'Retrabalho',expectativa:'Previsibilidade',raw_payload:{normalized:{schema_version:'2.0.0',client:{responsavel_cargo:'Diretora'},business:{objetivos:['Organizar a operação'],atividade_que_mais_consome_tempo:'Conciliação'},operation:{sistema_atual:'Conta Azul',frequencia_desejada:'Diária'}}}}]);
  if(method==='GET'&&url.includes('bpo_clients?id=eq.client-1'))return jsonResponse([{cnpj:'12345678000199',razao_social:'CLIENTE TESTE LTDA',nome_fantasia:'Cliente Teste',responsavel:'Maria',email:'maria@cliente.com.br',telefone:'47999999999',cidade:'Joinville',uf:'SC'}]);
  if(method==='POST'&&url.endsWith('/rest/v1/bpo_proposals'))return jsonResponse([{id:'proposal-v2',version:2,status:'em_analise_cfo'}],201);
  if(method==='POST'&&url.includes('/rest/v1/bpo_proposal_events'))return jsonResponse(null,201);
  if(method==='PATCH'&&url.includes('/rest/v1/bpo_intakes?'))return jsonResponse(null,204);
  throw new Error(`Chamada inesperada: ${method} ${url}`);
 };

 delete require.cache[require.resolve('../api/internal-proposal')];
 const handler=require('../api/internal-proposal');
 const req={method:'POST',headers:{cookie:cookie()},body:{intake_id:'11111111-1111-1111-1111-111111111111',action:'save',commercial_terms:{},approved_scope:{operational:[],managerial:[]},assumptions:{legal_positioning:'apoio administrativo-financeiro/BPO'}}};
 const res=responseCapture();await handler(req,res);
 assert.equal(res.statusCode,200);
 const proposalWrite=writes.find(x=>x.method==='POST'&&x.url.endsWith('/rest/v1/bpo_proposals'));
 assert(proposalWrite,'proposta aprovada anterior deve gerar nova linha/versão, não ser sobrescrita');
 assert.equal(proposalWrite.body.version,2);
 assert.equal(proposalWrite.body.assumptions.client_context_snapshot.source_schema,'2.0.0');
 assert.equal(proposalWrite.body.assumptions.client_context_snapshot.client.responsavel_cargo,'Diretora');
 assert.equal(proposalWrite.body.assumptions.client_context_snapshot.operation.erp,'Conta Azul');
 assert.deepEqual(proposalWrite.body.assumptions.client_context_snapshot.objectives,['Organizar a operação']);
 assert(!writes.some(x=>x.method==='PATCH'&&x.url.includes('bpo_proposals?id=eq.proposal-v1')),'versão aprovada não pode ser sobrescrita');

 const publicSource=fs.readFileSync(path.join(__dirname,'..','api','public-proposal.js'),'utf8');
 assert.match(publicSource,/client_context_snapshot/);
 assert.match(publicSource,/if\(snapshot\)/);
 console.log('PASS proposta: contexto congelado e nova versão após aprovação CFO');
})().catch(error=>{console.error(error);process.exitCode=1});
