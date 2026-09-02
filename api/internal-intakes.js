const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const COOKIE='fenix_internal_session';

function password(){return process.env.FENIX_INTERNAL_PASSWORD||''}
function sign(value){return crypto.createHmac('sha256',password()).update(value).digest('base64url')}
function safeEqual(a,b){const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&crypto.timingSafeEqual(A,B)}
function cookies(req){const out={};String(req.headers.cookie||'').split(';').forEach(p=>{const i=p.indexOf('=');if(i>0)out[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim())});return out}
function authorized(req){const token=cookies(req)[COOKIE];if(!token)return false;const [exp,sig]=String(token).split('.');return !!(exp&&sig&&Number(exp)>=Math.floor(Date.now()/1000)&&safeEqual(sig,sign(exp)))}
async function sb(path){
  const headers={apikey:SECRET_KEY};if(SECRET_KEY?.startsWith('eyJ'))headers.Authorization=`Bearer ${SECRET_KEY}`;
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{headers});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}
  if(!r.ok)throw new Error(data?.message||`Supabase ${r.status}`);return data;
}

module.exports=async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Método não permitido.'});
  if(!password()||!SECRET_KEY)return res.status(503).json({error:'Área interna ainda não configurada.'});
  if(!authorized(req))return res.status(401).json({error:'Acesso não autorizado.'});
  try{
    const intakes=await sb('bpo_intakes?select=id,client_id,created_at,updated_at,status,ramo,faturamento,recebimentos_mes,pagamentos_mes,notas_emitidas_mes,notas_recebidas_mes,outros_lancamentos_mes,contratos_novos_mes,comissoes_lancadas_mes,bancos_ativos,cartoes,contas_aplicacao,cnpjs_operacao,filiais,centros_custo,funcionarios_clt,situacao_atual,atrasados_retrabalho,escopo,descricao_negocio,dor,expectativa,raw_payload&order=created_at.desc&limit=100');
    const clientIds=[...new Set((intakes||[]).map(x=>x.client_id).filter(Boolean))];
    let clients=[];
    if(clientIds.length){
      const filter=encodeURIComponent(`(${clientIds.join(',')})`);
      clients=await sb(`bpo_clients?select=id,cnpj,razao_social,nome_fantasia,responsavel,email,telefone&id=in.${filter}`);
    }
    const intakeIds=(intakes||[]).map(x=>x.id).filter(Boolean);
    let proposals=[];
    if(intakeIds.length){
      const filter=encodeURIComponent(`(${intakeIds.join(',')})`);
      proposals=await sb(`bpo_proposals?select=id,intake_id,version,status,commercial_terms,public_url,public_slug,updated_at,approved_at,published_at&intake_id=in.${filter}&order=version.desc`);
    }
    const latestProposal={};
    for(const p of proposals||[]){if(!latestProposal[p.intake_id])latestProposal[p.intake_id]=p}
    const byId=Object.fromEntries((clients||[]).map(c=>[c.id,c]));
    return res.status(200).json({items:(intakes||[]).map(i=>({...i,client:byId[i.client_id]||null,proposal:latestProposal[i.id]||null}))});
  }catch(err){
    console.error('Internal intakes error:',err);
    return res.status(500).json({error:'Não foi possível carregar os levantamentos.'});
  }
};
