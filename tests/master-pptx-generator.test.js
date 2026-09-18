const assert=require('assert');
const {validate}=require('../lib/master-pptx-generator');

function base(){return {cfo_approved:true,client_name:'ALFA SERVIÇOS EMPRESARIAIS LTDA',segment:'Serviços',date:'17/09/2026',scenario:'Cenário validado.',challenges:'Desafios validados.',objective:'Objetivo validado.',cnpj_count:1,bank_count:2,fenix_monthly:2300,software_monthly:200,implementation_value:1500,total_monthly:2500,erp_name:'Conta Azul',proposal_code:'FENIX-HML-0001-V1',scope_operational:['Contas a pagar e receber'],scope_managerial:['Relatório operacional'],dependencies:'Acessos e documentos iniciais.',commercial_terms:'Proposta válida por 10 dias.'}}

assert.strictEqual(validate(base()),true);
const zero=base();zero.software_monthly=0;zero.total_monthly=2300;zero.erp_name='';assert.strictEqual(validate(zero),true);
const wrong=base();wrong.total_monthly=9999;assert.throws(()=>validate(wrong),/INVALID_SNAPSHOT:total_monthly/);
const noCfo=base();noCfo.cfo_approved=false;assert.throws(()=>validate(noCfo),/cfo_approved/);
const overflow=base();overflow.client_name='X'.repeat(56);assert.throws(()=>validate(overflow),/OVERFLOW_GUARD:client_name/);
console.log('master-pptx-generator tests: ok');
