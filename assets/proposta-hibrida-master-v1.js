const qs=new URLSearchParams(location.search);const ref=(qs.get('ref')||'').trim();
const $=id=>document.getElementById(id);const set=(id,v)=>{const e=$(id);if(e)e.textContent=v??''};
const money=n=>'R$ '+Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0});
const dateBR=v=>{try{return new Date(v||Date.now()).toLocaleDateString('pt-BR')}catch{return''}};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function list(id,items,max=4){const e=$(id);if(!e)return;const a=(items||[]).filter(Boolean).slice(0,max);e.innerHTML=a.map(x=>`<div class="item">${esc(x)}</div>`).join('')}
function footer(client,segment,date){for(let i=1;i<=8;i++){set(`p${i}FooterClient`,client);set(`p${i}FooterSegment`,segment);set(`p${i}FooterDate`,date)}}
function fill(p){
 const c=p.client||{},ctx=p.context||{},t=p.commercial_terms||{},s=p.scope||{},a=p.assumptions||{};
 const client=(c.name||c.razao_social||'').replace(/^HOMOLOGAÇÃO\s*[—-]\s*/i,'').replace(/\s*[—-]\s*TESTE$/i,'').trim();
 const legal=(c.razao_social||client).replace(/^HOMOLOGAÇÃO\s*[—-]\s*/i,'').trim();const segment=c.segment||'';const d=dateBR(p.published_at);
 set('p1Client',legal.toUpperCase());footer(legal.toUpperCase(),segment,d);
 set('scenario',ctx.description||'');set('challenges',ctx.pain||'');set('objective',ctx.expectation||'');
 set('qtdCnpjs',a.qtd_cnpjs??t.cnpjs??1);set('qtdBancos',a.qtd_bancos??'—');set('volumePrevisto',money(a.volume_previsto||0));
 list('operationalScope',s.operational||[],4);list('managerialScope',s.managerial||[],4);
 set('operatingRules',a.regras_operacionais_aprovadas||'Conforme escopo e condições aprovadas.');set('softwareName',t.software_name||'Conforme operação');
 const prazo=String(a.prazo_implantacao||'').split(',')[0].trim();set('implementationTime',prazo||'Conforme cronograma');set('implementationDependencies',a.dependencias_implantacao||'Conforme kickoff');
 const fenix=Number(t.final_monthly??t.monthly_fee??0),soft=Number(t.software_total||0),impl=Number(t.implementation||0),total=fenix+soft;
 set('fenixMonthly',money(fenix)+'/mês');set('softwareValue',money(soft)+'/mês');set('implementationValue',money(impl));set('totalMonthly',money(total)+'/mês');
 const mask=$('softwareMask');if(mask)mask.hidden=soft>0;set('commercialConditions','Condições, vencimentos e observações comerciais: '+(a.condicoes_comerciais_cfo||'conforme contrato.'));
 const href='/aceite/?ref='+encodeURIComponent(ref);const link=$('acceptLink');if(link){link.href=href;link.setAttribute('role','button')}set('acceptUrl',location.origin+'/aceite/?ref='+ref);
}
async function init(){if(!ref){$('error').hidden=false;$('error').textContent='Referência da proposta ausente.';return}try{const r=await fetch('/api/public-proposal?ref='+encodeURIComponent(ref),{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível carregar a proposta.');fill(d.proposal)}catch(e){$('error').hidden=false;$('error').textContent=e.message||'Falha ao carregar proposta.'}}
init();
