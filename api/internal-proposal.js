const crypto=require('crypto');
const SUPABASE_URL=process.env.SUPABASE_URL||'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
const COOKIE='fenix_internal_session';
function password(){return process.env.FENIX_INTERNAL_PASSWORD||''}
function sign(v){return crypto.createHmac('sha256',password()).update(v).digest('base64url')}
function safeEqual(a,b){const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&crypto.timingSafeEqual(A,B)}
function cookies(req){const out={};String(req.headers.cookie||'').split(';').forEach(p=>{const i=p.indexOf('=');if(i>0)out[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim())});return out}
function authorized(req){const token=cookies(req)[COOKIE];if(!token)return false;const [exp,sig]=String(token).split('.');return !!(exp&&sig&&Number(exp)>=Math.floor(Date.now()/1000)&&safeEqual(sig,sign(exp)))}
async function sb(path,options={}){const headers={apikey:SECRET_KEY,'Content-Type':'application/json',...(options.headers||{})};if(SECRET_KEY?.startsWith('eyJ'))headers.Authorization=`Bearer ${SECRET_KEY}`;const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...options,headers});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!r.ok)throw new Error(data?.message||`Supabase ${r.status}`);return data}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function slugify(v){return String(v||'proposta').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'proposta'}
module.exports=async function handler(req,res){
 if(!password()||!SECRET_KEY)return res.status(503).json({error:'Área interna ainda não configurada.'});
 if(!authorized(req))return res.status(401).json({error:'Acesso não autorizado.'});
 const intakeId=String(req.query?.intake_id||req.body?.intake_id||'').trim();
 if(!/^[0-9a-f-]{36}$/i.test(intakeId))return res.status(400).json({error:'Levantamento inválido.'});
 try{
  if(req.method==='GET'){
   const rows=await sb(`bpo_proposals?intake_id=eq.${intakeId}&select=*&order=version.desc&limit=1`);
   return res.status(200).json({proposal:Array.isArray(rows)?rows[0]||null:null});
  }
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  const action=String(req.body?.action||'save');
  if(!['save','approve','publish'].includes(action))return res.status(400).json({error:'Ação inválida.'});
  const currentRows=await sb(`bpo_proposals?intake_id=eq.${intakeId}&select=*&order=version.desc&limit=1`);
  const current=Array.isArray(currentRows)?currentRows[0]:null;
  if(action==='publish'){
    if(!current||!['aprovada_cfo','publicada'].includes(current.status))return res.status(409).json({error:'A proposta precisa estar aprovada pelo CFO antes da publicação.'});
    const intakeRows=await sb(`bpo_intakes?id=eq.${intakeId}&select=id,client_id,ramo&limit=1`);const intake=intakeRows?.[0];
    const clientRows=intake?.client_id?await sb(`bpo_clients?id=eq.${intake.client_id}&select=cnpj,razao_social,nome_fantasia&limit=1`):[];const client=clientRows?.[0]||{};
    const slug=current.public_slug||`${slugify(client.nome_fantasia||client.razao_social)}-${String(current.version||1)}`;
    const code=current.proposal_code||`FENIX-${String(client.cnpj||'').slice(-6)||'CLIENTE'}-V${current.version||1}`;
    const publicUrl=`https://proposta.fenixbpo.com.br/p/proposta.html?ref=${encodeURIComponent(slug)}`;
    const now=new Date().toISOString();
    const rows=await sb(`bpo_proposals?id=eq.${current.id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status:'publicada',proposal_code:code,public_slug:slug,public_url:publicUrl,published_at:current.published_at||now,updated_at:now})});
    const proposal=rows?.[0]||current;
    await sb('bpo_proposal_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({proposal_id:proposal.id,event_type:'published',event_data:{version:proposal.version,public_url:publicUrl}})});
    await sb(`bpo_intakes?id=eq.${intakeId}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'proposta_publicada',updated_at:now})});
    return res.status(200).json({ok:true,proposal,public_url:publicUrl});
  }
  const terms=req.body?.commercial_terms||{};
  const required=['base_monthly','discount','final_monthly','implementation','cnpjs','software_total'];
  if(action==='approve'&&required.some(k=>num(terms[k])<0||terms[k]===undefined||terms[k]===null))return res.status(400).json({error:'Preencha os campos comerciais obrigatórios antes de aprovar.'});
  const editable=current&&['rascunho_cfo','em_analise_cfo','aprovada_cfo'].includes(current.status);
  const version=editable?current.version:(current?.version||0)+1;
  const status=action==='approve'?'aprovada_cfo':'em_analise_cfo';
  const payload={intake_id:intakeId,version,status,cfo_analysis:req.body?.cfo_analysis||{},commercial_terms:terms,approved_scope:req.body?.approved_scope||{operational:[],managerial:[]},assumptions:req.body?.assumptions||{},approved_by:action==='approve'?'CFO':current?.approved_by||null,approved_at:action==='approve'?new Date().toISOString():current?.approved_at||null,updated_at:new Date().toISOString()};
  let proposal;
  if(editable){const rows=await sb(`bpo_proposals?id=eq.${current.id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});proposal=rows?.[0]||current}
  else{const rows=await sb('bpo_proposals',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(payload)});proposal=rows?.[0]||null}
  if(proposal?.id)await sb('bpo_proposal_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({proposal_id:proposal.id,event_type:action==='approve'?'cfo_approved':'cfo_saved',event_data:{version,status}})});
  await sb(`bpo_intakes?id=eq.${intakeId}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:status==='aprovada_cfo'?'proposta_aprovada_cfo':'em_analise_cfo',updated_at:new Date().toISOString()})});
  return res.status(200).json({ok:true,proposal});
 }catch(err){console.error('Internal proposal error:',err);return res.status(500).json({error:'Não foi possível processar a proposta.'})}
};
