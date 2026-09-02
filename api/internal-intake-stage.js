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
module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
  if(!password()||!SECRET_KEY)return res.status(503).json({error:'Área interna ainda não configurada.'});
  if(!authorized(req))return res.status(401).json({error:'Acesso não autorizado.'});
  const intakeId=String(req.body?.intake_id||'').trim();const action=String(req.body?.action||'').trim();
  if(!/^[0-9a-f-]{36}$/i.test(intakeId))return res.status(400).json({error:'Levantamento inválido.'});
  if(!['close','reopen'].includes(action))return res.status(400).json({error:'Ação inválida.'});
  try{
    const rows=await sb(`bpo_intakes?id=eq.${intakeId}&select=id,status,raw_payload&limit=1`);const current=rows?.[0];
    if(!current)return res.status(404).json({error:'Levantamento não encontrado.'});
    const raw=(current.raw_payload&&typeof current.raw_payload==='object')?current.raw_payload:{};const pipeline=(raw._pipeline&&typeof raw._pipeline==='object')?raw._pipeline:{};
    let status,updatedRaw;
    if(action==='close'){
      if(current.status==='encerrado')return res.status(200).json({ok:true,status:'encerrado'});
      status='encerrado';updatedRaw={...raw,_pipeline:{...pipeline,previous_status:current.status||'recebido',closed_at:new Date().toISOString()}};
    }else{
      if(current.status!=='encerrado')return res.status(409).json({error:'Somente oportunidades encerradas podem ser reabertas.'});
      const restorableStatuses=new Set(['recebido','em_analise_cfo','rascunho_cfo','proposta_aprovada_cfo','proposta_publicada','proposta_aceita_aguardando_cfo','contrato_autorizado']);
      status=restorableStatuses.has(pipeline.previous_status)?pipeline.previous_status:'recebido';updatedRaw={...raw,_pipeline:{...pipeline,reopened_at:new Date().toISOString()}};
    }
    const now=new Date().toISOString();
    const updated=await sb(`bpo_intakes?id=eq.${intakeId}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({status,raw_payload:updatedRaw,updated_at:now})});
    return res.status(200).json({ok:true,status,item:updated?.[0]||null});
  }catch(err){console.error('Internal intake stage error:',err);return res.status(500).json({error:'Não foi possível atualizar a oportunidade.'})}
};
