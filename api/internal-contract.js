const crypto=require('crypto');
const SUPABASE_URL=process.env.SUPABASE_URL||'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
const COOKIE='fenix_internal_session';
const TEMPLATE='Contrato_Fenix_BPO_MODELO_PADRAO_v22';
function password(){return process.env.FENIX_INTERNAL_PASSWORD||''}
function sign(v){return crypto.createHmac('sha256',password()).update(v).digest('base64url')}
function safeEqual(a,b){const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&crypto.timingSafeEqual(A,B)}
function cookies(req){const out={};String(req.headers.cookie||'').split(';').forEach(p=>{const i=p.indexOf('=');if(i>0)out[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim())});return out}
function authorized(req){const token=cookies(req)[COOKIE];if(!token)return false;const [exp,sig]=String(token).split('.');return !!(exp&&sig&&Number(exp)>=Math.floor(Date.now()/1000)&&safeEqual(sig,sign(exp)))}
async function sb(path,options={}){const headers={apikey:SECRET_KEY,'Content-Type':'application/json',...(options.headers||{})};if(SECRET_KEY?.startsWith('eyJ'))headers.Authorization=`Bearer ${SECRET_KEY}`;const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!r.ok)throw new Error(data?.message||`Supabase ${r.status}`);return data}
function clean(v){return String(v??'').trim()}
module.exports=async function handler(req,res){
 if(!password()||!SECRET_KEY)return res.status(503).json({error:'Área interna ainda não configurada.'});
 if(!authorized(req))return res.status(401).json({error:'Acesso não autorizado.'});
 const intakeId=String(req.query?.intake_id||req.body?.intake_id||'').trim();
 if(!/^[0-9a-f-]{36}$/i.test(intakeId))return res.status(400).json({error:'Levantamento inválido.'});
 try{
  const acceptedRows=await sb(`bpo_proposals?intake_id=eq.${intakeId}&status=eq.proposta_aceita_aguardando_cfo&select=*&order=version.desc&limit=1`);
  const acceptedProposal=acceptedRows?.[0]||null;
  if(req.method==='GET'){
    const latestRows=acceptedProposal?[]:await sb(`bpo_proposals?intake_id=eq.${intakeId}&select=*&order=version.desc&limit=1`);
    const proposal=acceptedProposal||latestRows?.[0]||null;
    const contractRows=proposal?.id?await sb(`bpo_contracts?proposal_id=eq.${proposal.id}&select=*&limit=1`):[];
    return res.status(200).json({proposal,contract:contractRows?.[0]||null});
  }
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  const proposal=acceptedProposal;
  if(!proposal?.id)return res.status(409).json({error:'O contrato só pode ser autorizado a partir da proposta efetivamente aceita pelo cliente e aguardando validação do CFO.'});
  const intakeRows=await sb(`bpo_intakes?id=eq.${intakeId}&select=id,client_id,ramo,raw_payload&limit=1`);const intake=intakeRows?.[0];
  const clientRows=intake?.client_id?await sb(`bpo_clients?id=eq.${intake.client_id}&select=*&limit=1`):[];const client=clientRows?.[0]||{};
  const fields=req.body?.contract_fields||{};
  const legal={
    representative:clean(fields.representative||client.responsavel),
    representative_cpf:clean(fields.representative_cpf),
    start_operation:clean(fields.start_operation),
    initial_term:clean(fields.initial_term),
    due_date:clean(fields.due_date),
    payment_method:clean(fields.payment_method)
  };
  const required={
    'Razão social':client.razao_social,'CNPJ':client.cnpj,'Endereço':client.endereco,'Cidade':client.cidade,'UF':client.uf,'CEP':client.cep,
    'Representante legal':legal.representative,'CPF do representante':legal.representative_cpf,'E-mail':client.email,
    'Início da operação':legal.start_operation,'Vigência inicial':legal.initial_term,'Vencimento':legal.due_date,'Forma de pagamento':legal.payment_method
  };
  const missing=Object.entries(required).filter(([,v])=>!clean(v)).map(([k])=>k);
  const scope=[...(proposal.approved_scope?.operational||[]),...(proposal.approved_scope?.managerial||[])];
  const terms=proposal.commercial_terms||{};
  if(!scope.length)missing.push('Escopo aprovado');
  if(terms.final_monthly===undefined||terms.final_monthly===null)missing.push('Mensalidade final');
  if(terms.implementation===undefined||terms.implementation===null)missing.push('Implantação');
  if(terms.cnpjs===undefined||terms.launch_limit_per_cnpj===undefined||terms.launch_limit_group===undefined||terms.bank_accounts_included===undefined)missing.push('Limites do pacote');
  if(missing.length)return res.status(422).json({error:'Complete os dados obrigatórios antes de autorizar o contrato.',missing});
  const now=new Date().toISOString();
  const code=`CTR-${proposal.proposal_code||String(proposal.id).slice(0,8)}`;
  const snapshot={
    client:{...client,responsavel:legal.representative,representative_cpf:legal.representative_cpf},
    legal,
    proposal:{id:proposal.id,version:proposal.version,proposal_code:proposal.proposal_code,public_url:proposal.public_url,accepted_at:proposal.accepted_at},
    commercial_terms:terms,approved_scope:proposal.approved_scope||{},assumptions:proposal.assumptions||{},source:'accepted_proposal_snapshot'
  };
  const existingRows=await sb(`bpo_contracts?proposal_id=eq.${proposal.id}&select=*&limit=1`);const existing=existingRows?.[0]||null;
  let contract;
  const payload={proposal_id:proposal.id,intake_id:intakeId,version:proposal.version||1,status:'autorizado_cfo_aguardando_geracao',template_version:TEMPLATE,contract_code:existing?.contract_code||code,contract_data:snapshot,authorized_by:'CFO',authorized_at:now,updated_at:now};
  if(existing?.id){const rows=await sb(`bpo_contracts?id=eq.${existing.id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});contract=rows?.[0]||existing}
  else{const rows=await sb('bpo_contracts',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});contract=rows?.[0]||null}
  await sb(`bpo_proposals?id=eq.${proposal.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'contrato_autorizado',updated_at:now})});
  await sb(`bpo_intakes?id=eq.${intakeId}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'contrato_autorizado',updated_at:now})});
  await sb('bpo_proposal_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({proposal_id:proposal.id,event_type:'contract_authorized',event_data:{contract_id:contract?.id,contract_code:contract?.contract_code,template_version:TEMPLATE,accepted_proposal_version:proposal.version,accepted_at:proposal.accepted_at,authorized_at:now}})});
  const preview_url=`/contrato/contrato.html?ref=${encodeURIComponent(contract?.contract_code||code)}`;
  return res.status(200).json({ok:true,contract,preview_url,message:'Contrato v22 autorizado pelo CFO a partir da proposta aceita. Dados e condições congelados para geração.'});
 }catch(err){console.error('Internal contract error:',err);return res.status(500).json({error:'Não foi possível autorizar o contrato.'})}
};
