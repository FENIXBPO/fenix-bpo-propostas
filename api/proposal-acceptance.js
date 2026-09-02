const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
async function supabase(path, options = {}) {const headers={apikey:SECRET_KEY,'Content-Type':'application/json',...(options.headers||{})};if(SECRET_KEY&&SECRET_KEY.startsWith('eyJ'))headers.Authorization=`Bearer ${SECRET_KEY}`;const response=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers});const text=await response.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text||null}if(!response.ok)throw new Error(data?.message||data?.hint||`Supabase ${response.status}`);return data}
function digits(v){return String(v||'').replace(/\D/g,'')}
function validCpf(v){const c=digits(v);if(!/^\d{11}$/.test(c)||/^(\d)\1{10}$/.test(c))return false;const calc=n=>{let s=0;for(let i=0;i<n;i++)s+=Number(c[i])*(n+1-i);const r=(s*10)%11;return r===10?0:r};return calc(9)===Number(c[9])&&calc(10)===Number(c[10])}
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
 if(!SECRET_KEY)return res.status(503).json({error:'Integração com banco não configurada.'});
 const body=req.body||{},cnpj=digits(body.cnpj),nome=String(body.nome||'').trim(),cpf=digits(body.cpf),email=String(body.email||'').trim().toLowerCase(),accepted=body.accepted===true,proposalRef=String(body.proposal_ref||'').trim();
 if(!/^\d{14}$/.test(cnpj))return res.status(400).json({error:'CNPJ inválido.'});if(!nome)return res.status(400).json({error:'Informe o nome do sócio/responsável.'});if(!validCpf(cpf))return res.status(400).json({error:'Informe um CPF válido do sócio/responsável.'});if(!/^\S+@\S+\.\S+$/.test(email))return res.status(400).json({error:'Informe um e-mail válido.'});if(!accepted)return res.status(400).json({error:'É necessário confirmar o aceite da proposta.'});
 try{
  const clients=await supabase(`bpo_clients?cnpj=eq.${cnpj}&select=id,cnpj,razao_social&limit=1`);const client=Array.isArray(clients)?clients[0]:null;if(!client?.id)return res.status(404).json({error:'Cliente não localizado.'});
  let proposal=null;
  if(proposalRef){const rows=await supabase(`bpo_proposals?public_slug=eq.${encodeURIComponent(proposalRef)}&status=eq.publicada&select=*&limit=1`);proposal=rows?.[0]||null}
  if(!proposal){const rows=await supabase(`bpo_intakes?client_id=eq.${client.id}&select=id,status,raw_payload,created_at&order=created_at.desc&limit=1`);const intakeFallback=rows?.[0];if(!intakeFallback?.id)return res.status(404).json({error:'Coleta do cliente não localizada.'});const props=await supabase(`bpo_proposals?intake_id=eq.${intakeFallback.id}&status=eq.publicada&select=*&order=version.desc&limit=1`);proposal=props?.[0]||null}
  if(!proposal?.id)return res.status(404).json({error:'Proposta publicada não localizada.'});
  const intakes=await supabase(`bpo_intakes?id=eq.${proposal.intake_id}&select=id,client_id,status,raw_payload&limit=1`);const intake=intakes?.[0];if(!intake?.id)return res.status(404).json({error:'Coleta vinculada não localizada.'});
  if(String(intake.client_id)!==String(client.id))return res.status(409).json({error:'A proposta informada não pertence ao CNPJ confirmado.'});
  const acceptedAt=new Date().toISOString(),raw=intake.raw_payload&&typeof intake.raw_payload==='object'?intake.raw_payload:{},proposalAcceptance={accepted:true,accepted_at:acceptedAt,accepted_by_name:nome,accepted_by_cpf:cpf,accepted_by_email:email,proposal_code:proposal.proposal_code,proposal_url:proposal.public_url,next_status:'aguardando_aprovacao_cfo_contrato'};
  await supabase(`bpo_intakes?id=eq.${intake.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'proposta_aceita_aguardando_cfo',raw_payload:{...raw,proposal_acceptance:proposalAcceptance},updated_at:acceptedAt})});
  await supabase(`bpo_proposals?id=eq.${proposal.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'proposta_aceita_aguardando_cfo',accepted_at:acceptedAt,updated_at:acceptedAt})});
  await supabase('bpo_proposal_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({proposal_id:proposal.id,event_type:'client_accepted',event_data:{accepted_by_name:nome,accepted_by_cpf:cpf,accepted_by_email:email,accepted_at:acceptedAt}})});
  return res.status(200).json({ok:true,status:'proposta_aceita_aguardando_cfo',message:'Aceite registrado. A proposta seguirá para validação final do CFO antes da geração do contrato.'});
 }catch(err){console.error('Proposal acceptance error:',err);return res.status(500).json({error:'Não foi possível registrar o aceite agora. Tente novamente em instantes.'})}
};
