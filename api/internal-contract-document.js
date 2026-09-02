const crypto=require('crypto');
const fs=require('fs');
const path=require('path');
const SUPABASE_URL=process.env.SUPABASE_URL||'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
const COOKIE='fenix_internal_session';
function password(){return process.env.FENIX_INTERNAL_PASSWORD||''}
function sign(v){return crypto.createHmac('sha256',password()).update(v).digest('base64url')}
function safeEqual(a,b){const A=Buffer.from(String(a||'')),B=Buffer.from(String(b||''));return A.length===B.length&&crypto.timingSafeEqual(A,B)}
function cookies(req){const out={};String(req.headers.cookie||'').split(';').forEach(p=>{const i=p.indexOf('=');if(i>0)out[p.slice(0,i).trim()]=decodeURIComponent(p.slice(i+1).trim())});return out}
function authorized(req){const token=cookies(req)[COOKIE];if(!token)return false;const [exp,sig]=String(token).split('.');return !!(exp&&sig&&Number(exp)>=Math.floor(Date.now()/1000)&&safeEqual(sig,sign(exp)))}
async function sb(pathname,options={}){const headers={apikey:SECRET_KEY,'Content-Type':'application/json',...(options.headers||{})};if(SECRET_KEY?.startsWith('eyJ'))headers.Authorization=`Bearer ${SECRET_KEY}`;const r=await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`,{...options,headers});const text=await r.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!r.ok)throw new Error(data?.message||`Supabase ${r.status}`);return data}
function money(v){const n=Number(v);return Number.isFinite(n)?`R$ ${n.toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}`:'—'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]))}
function inline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`(.+?)`/g,'<code>$1</code>')}
function markdownToHtml(md){
 const lines=String(md||'').split(/\r?\n/);let html='',inList=false;
 const close=()=>{if(inList){html+='</ul>';inList=false}};
 for(const raw of lines){const line=raw.trimEnd();if(!line.trim()){close();continue}
  if(/^### /.test(line)){close();html+=`<h3>${inline(line.slice(4))}</h3>`;continue}
  if(/^## /.test(line)){close();html+=`<h2>${inline(line.slice(3))}</h2>`;continue}
  if(/^# /.test(line)){close();html+=`<h1>${inline(line.slice(2))}</h1>`;continue}
  if(/^[-*] /.test(line)){if(!inList){html+='<ul>';inList=true}html+=`<li>${inline(line.slice(2))}</li>`;continue}
  if(/^> /.test(line)){close();html+=`<blockquote>${inline(line.slice(2))}</blockquote>`;continue}
  close();html+=`<p>${inline(line)}</p>`;
 }
 close();return html;
}
module.exports=async function handler(req,res){
 if(!password()||!SECRET_KEY)return res.status(503).json({error:'Área interna ainda não configurada.'});
 if(!authorized(req))return res.status(401).json({error:'Acesso não autorizado.'});
 if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Método não permitido.'});
 const ref=String(req.query?.ref||req.body?.ref||'').trim();if(!ref)return res.status(400).json({error:'Contrato não informado.'});
 try{
  const rows=await sb(`bpo_contracts?contract_code=eq.${encodeURIComponent(ref)}&select=*&limit=1`);const contract=rows?.[0];
  if(!contract?.id)return res.status(404).json({error:'Contrato não localizado.'});
  if(!['autorizado_cfo_aguardando_geracao','gerado'].includes(contract.status))return res.status(409).json({error:'Contrato ainda não autorizado para geração.'});
  const d=contract.contract_data||{},client=d.client||{},legal=d.legal||{},t=d.commercial_terms||{},s=d.approved_scope||{},a=d.assumptions||{};
  let md=fs.readFileSync(path.join(process.cwd(),'CONTRATO_FENIX_BPO_MODELO_PADRAO_v22.md'),'utf8');
  const services=[...(s.operational||[]),...(s.managerial||[])];
  const specific=[];if(t.additional_bank_account!==undefined)specific.push(`Conta bancária adicional: ${money(t.additional_bank_account)}/mês por conta.`);if(a.commercial_review_on_scope_or_volume_change)specific.push('Mudanças relevantes de volume, CNPJs, bancos ou escopo podem exigir revisão comercial e aditivo.');if(a.extra_work_requires_prior_authorization)specific.push('Serviços extraordinários e retrabalho passíveis de cobrança exigem alinhamento e autorização prévia do cliente quando aplicável.');
  const replacements={
   cliente_razao_social:client.razao_social,cliente_nome_fantasia:client.nome_fantasia||client.razao_social,cliente_cnpj:client.cnpj,cliente_endereco:client.endereco,cliente_cidade_uf:[client.cidade,client.uf].filter(Boolean).join('/'),cliente_cep:client.cep,cliente_representante:legal.representative||client.responsavel,cliente_representante_cpf:legal.representative_cpf,cliente_email:client.email,cliente_whatsapp:client.telefone,
   data_inicio_operacao:legal.start_operation,vigencia_inicial:legal.initial_term,
   anexo_i_servicos_incluidos:services.map(x=>`- ${x}`).join('\n'),limite_cnpjs:t.cnpjs,limite_lancamentos_cnpj:t.launch_limit_per_cnpj,limite_lancamentos_grupo:t.launch_limit_group,limite_contas_bancarias:t.bank_accounts_included,limites_especificos:specific.map(x=>`- ${x}`).join('\n')||'- Conforme escopo e proposta aprovada.',
   valor_pacote_base:money(t.base_monthly),desconto_aprovado:money(t.discount),motivo_desconto:t.discount_reason||'Não se aplica',mensalidade_final:money(t.final_monthly),valor_implantacao:money(t.implementation),software_nome:t.software_name||'Não se aplica',software_valor_cnpj:money(t.software_per_cnpj),software_valor_total:money(t.software_total),valor_conta_bancaria_adicional:money(t.additional_bank_account),vencimento:legal.due_date,forma_pagamento:legal.payment_method,valor_hora_tecnica:t.hourly_rate!==undefined?money(t.hourly_rate):'Conforme orçamento prévio',criterio_retrabalho:t.rework_rule||'Conforme regras contratuais e autorização prévia quando aplicável.'
  };
  md=md.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g,(m,k)=>replacements[k]!==undefined&&replacements[k]!==null&&String(replacements[k]).trim()!==''?String(replacements[k]):`[PENDENTE: ${k}]`);
  const missing=[...md.matchAll(/\[PENDENTE: ([^\]]+)\]/g)].map(m=>m[1]);
  let generatedAt=contract.generated_at||null,status=contract.status;
  if(req.method==='POST'){
    if(missing.length)return res.status(422).json({error:'Contrato possui campos pendentes e não pode ser marcado como gerado.',missing});
    if(contract.status!=='gerado'){
      generatedAt=new Date().toISOString();status='gerado';
      await sb(`bpo_contracts?id=eq.${contract.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'gerado',generated_at:generatedAt,updated_at:generatedAt})});
      await sb('bpo_proposal_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({proposal_id:contract.proposal_id,event_type:'contract_generated',event_data:{contract_id:contract.id,contract_code:contract.contract_code,template_version:contract.template_version,generated_at:generatedAt}})});
    }
  }
  return res.status(200).json({ok:true,contract_code:contract.contract_code,template_version:contract.template_version,status,missing,can_generate:!missing.length&&status!=='gerado',html:markdownToHtml(md),generated_at:generatedAt});
 }catch(err){console.error('Contract document error:',err);return res.status(500).json({error:'Não foi possível preparar o contrato v22.'})}
};
