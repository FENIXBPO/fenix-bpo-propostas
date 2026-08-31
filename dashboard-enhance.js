(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  const STATUS={
    recebido:{label:'Recebido',bg:'#eef2f7',fg:'#4d5968'},
    em_analise_cfo:{label:'Rascunho CFO',bg:'#fff4d6',fg:'#7a5700'},
    rascunho_cfo:{label:'Rascunho CFO',bg:'#fff4d6',fg:'#7a5700'},
    aprovada_cfo:{label:'Aprovada pelo CFO',bg:'#e8f5ee',fg:'#1f6a43'},
    publicada:{label:'Proposta publicada',bg:'#e8f0ff',fg:'#284f9e'},
    proposta_aceita_aguardando_cfo:{label:'Aceita · aguardando CFO',bg:'#f1eaff',fg:'#65389a'},
    contrato_autorizado:{label:'Contrato autorizado',bg:'#e8f5ee',fg:'#1f6a43'}
  };
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})}
  function sovereignStatus(item,p){
    if(p?.status==='publicada')return 'publicada';
    if(p?.status==='aprovada_cfo')return 'aprovada_cfo';
    if(p?.status==='em_analise_cfo'||p?.status==='rascunho_cfo')return 'em_analise_cfo';
    if(item?.status==='proposta_aceita_aguardando_cfo')return 'proposta_aceita_aguardando_cfo';
    if(item?.status==='contrato_autorizado')return 'contrato_autorizado';
    return item?.status||'recebido';
  }
  function makeBadge(status,version){
    const s=STATUS[status]||{label:String(status||'Recebido').replaceAll('_',' '),bg:'#eef2f7',fg:'#4d5968'};
    const span=document.createElement('span');
    span.textContent=`${s.label}${version?` · v${version}`:''}`;
    span.style.cssText=`display:inline-block;padding:5px 9px;border-radius:999px;background:${s.bg};color:${s.fg};font-size:11px;font-weight:800;margin-right:6px`;
    return span;
  }

  function hideAnalysisUntilOpen(){
    const dashboard=document.getElementById('fenix-internal-dashboard');if(!dashboard)return;
    [...document.querySelectorAll('.wrap > .card')].forEach(card=>{if(card!==dashboard&&!card.id?.startsWith('fenix-internal-login'))card.style.display='none'});
    document.getElementById('diagnostico')?.classList.add('hidden');
  }
  function showAnalysis(){
    const dashboard=document.getElementById('fenix-internal-dashboard');
    [...document.querySelectorAll('.wrap > .card')].forEach(card=>{if(card!==dashboard)card.style.display=''});
  }

  async function enhance(){
    if(!window.FENIX_INTERNAL_MODE)return;
    const box=document.getElementById('fenix-internal-dashboard');if(!box)return;
    try{
      const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao carregar.');
      const items=d.items||[];const rows=[...box.querySelectorAll('.row')];
      const section=box.querySelector('.section');if(section)section.textContent='Clientes e propostas em andamento';
      if(!box.querySelector('[data-fenix-dashboard-intro]')){const intro=document.createElement('div');intro.dataset.fenixDashboardIntro='1';intro.style.cssText='font-size:12px;color:#716b61;margin:-4px 0 12px';intro.textContent='Rascunhos, aprovações e propostas publicadas ficam visíveis aqui para você continuar de onde parou.';section?.insertAdjacentElement('afterend',intro)}
      rows.forEach((row,idx)=>{
        if(row.dataset.fenixEnhanced)return;row.dataset.fenixEnhanced='1';
        const item=items[idx]||{};const p=item.proposal||null;const t=p?.commercial_terms||{};const info=row.firstElementChild;const button=row.querySelector('[data-open-intake]');
        const status=sovereignStatus(item,p);
        row.style.cssText+=';border:1px solid #e7e0d3;border-radius:12px;padding:14px 15px;margin:10px 0;background:#fff';
        if(info){
          const badges=document.createElement('div');badges.style.marginTop='7px';
          badges.appendChild(makeBadge(status,p?.version||null));
          if(p){const commercial=document.createElement('div');commercial.style.cssText='font-size:11px;color:#706b63;margin-top:7px';commercial.innerHTML=`Mensalidade CFO: <strong>${money(t.final_monthly||0)}</strong>`;badges.appendChild(commercial)}
          info.appendChild(badges)
        }
        if(button){
          if(status==='em_analise_cfo')button.textContent='Continuar rascunho';
          else if(status==='publicada')button.textContent='Abrir análise CFO';
          else button.textContent='Abrir análise CFO';
          button.addEventListener('click',showAnalysis,{capture:true})
        }
      });
    }catch(e){console.error('Dashboard enhance:',e)}
  }

  const obs=new MutationObserver(()=>{const box=document.getElementById('fenix-internal-dashboard');if(box&&!box.dataset.fenixEnhanceScheduled){box.dataset.fenixEnhanceScheduled='1';setTimeout(()=>{hideAnalysisUntilOpen();enhance()},120)}});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('fenix:internal-authenticated',()=>setTimeout(()=>{hideAnalysisUntilOpen();enhance()},350));
})();
