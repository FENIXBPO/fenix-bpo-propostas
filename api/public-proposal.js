const SUPABASE_URL=process.env.SUPABASE_URL||'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
async function sb(path){const headers={apikey:SECRET_KEY};if(SECRET_KEY?.startsWith('eyJ'))headers.Authorization=`Bearer ${SECRET_KEY}`;const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{headers});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!r.ok)throw new Error(data?.message||`Supabase ${r.status}`);return data}
module.exports=async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Método não permitido.'});
 if(!SECRET_KEY)return res.status(503).json({error:'Integração indisponível.'});
 const ref=String(req.query?.ref||'').trim();if(!ref||ref.length>90)return res.status(400).json({error:'Referência inválida.'});
 try{
  const rows=await sb(`bpo_proposals?public_slug=eq.${encodeURIComponent(ref)}&status=in.(publicada,proposta_aceita_aguardando_cfo)&select=id,intake_id,version,status,proposal_code,public_slug,public_url,commercial_terms,approved_scope,assumptions,approved_at,published_at&limit=1`);
  const p=rows?.[0];if(!p)return res.status(404).json({error:'Proposta não localizada ou ainda não publicada.'});
  const intakeRows=await sb(`bpo_intakes?id=eq.${p.intake_id}&select=id,client_id,ramo,descricao_negocio,dor,expectativa&limit=1`);const intake=intakeRows?.[0]||{};
  const clientRows=intake.client_id?await sb(`bpo_clients?id=eq.${intake.client_id}&select=cnpj,razao_social,nome_fantasia,responsavel,email&limit=1`):[];const c=clientRows?.[0]||{};
  res.setHeader('Cache-Control','no-store');
  return res.status(200).json({proposal:{version:p.version,status:p.status,proposal_code:p.proposal_code,published_at:p.published_at,client:{cnpj:c.cnpj,name:c.nome_fantasia||c.razao_social,razao_social:c.razao_social,segment:intake.ramo},context:{description:intake.descricao_negocio,pain:intake.dor,expectation:intake.expectativa},commercial_terms:p.commercial_terms||{},scope:p.approved_scope||{operational:[],managerial:[]},assumptions:p.assumptions||{}}});
 }catch(err){console.error('Public proposal error:',err);return res.status(500).json({error:'Não foi possível carregar a proposta.'})}
};
