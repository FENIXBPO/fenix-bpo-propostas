(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  const STATUS={
    recebido:{label:'Recebido',bg:'#eef2f7',fg:'#4d5968'},
    em_analise_cfo:{label:'Rascunho CFO',bg:'#fff4d6',fg:'#7a5700'},
    proposta_aprovada_cfo:{label:'Aprovada pelo CFO',bg:'#e8f5ee',fg:'#1f6a43'},
    proposta_publicada:{label:'Proposta publicada',bg:'#e8f0ff',fg:'#284f9e'},
    proposta_aceita_aguardando_cfo:{label:'Aceita · aguardando CFO',bg:'#f1eaff',fg:'#65389a'},
    contrato_autorizado:{label:'Contrato autorizado',bg:'#e8f5ee',fg:'#1f6a43'}
  };
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})}
  function makeBadge(status){const s=STATUS[status]||{label:String(status||'Recebido').replaceAll('_',' '),bg:'#eef2f7',fg:'#4d5968'};const span=document.createElement('span');span.textContent=s.label;span.style.cssText=`display:inline-block;padding:5px 9px;border-radius:999px;background:${s.bg};color:${s.fg};font-size:11px;font-weight:800;margin-right:6px`;return span}
  function proposalLabel(p){if(!p)return '';const st=String(p.status||'');if(st==='em_analise_cfo'||st==='rascunho_cfo')return `Rascunho CFO · v${p.version||1}`;if(st==='aprovada_cfo')return `Aprovada CFO · v${p.version||1}`;if(st==='publicada')return `Publicada · v${p.version||1}`;return `${st.replaceAll('_',' ')} · v${p.version||1}`}

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
        row.style.cssText+=';border:1px solid #e7e0d3;border-radius:12px;padding:14px 15px;margin:10px 0;background:#fff';
        if(info){const badges=document.createElement('div');badges.style.marginTop='7px';badges.appendChild(makeBadge(item.status||'recebido'));if(p){const b=document.createElement('span');b.textContent=proposalLabel(p);b.style.cssText='display:inline-block;padding:5px 9px;border-radius:999px;background:#fff4d6;color:#7a5700;font-size:11px;font-weight:800';badges.appendChild(b);const commercial=document.createElement('div');commercial.style.cssText='font-size:11px;color:#706b63;margin-top:7px';commercial.innerHTML=`Mensalidade CFO: <strong>${money(t.final_monthly||0)}</strong>`;badges.appendChild(commercial)}info.appendChild(badges)}
        if(button){if(p&&(p.status==='em_analise_cfo'||p.status==='rascunho_cfo'))button.textContent='Continuar rascunho';button.addEventListener('click',showAnalysis,{capture:true})}
      });
    }catch(e){console.error('Dashboard enhance:',e)}
  }

  const obs=new MutationObserver(()=>{const box=document.getElementById('fenix-internal-dashboard');if(box&&!box.dataset.fenixEnhanceScheduled){box.dataset.fenixEnhanceScheduled='1';setTimeout(()=>{hideAnalysisUntilOpen();enhance()},120)}});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('fenix:internal-authenticated',()=>setTimeout(()=>{hideAnalysisUntilOpen();enhance()},350));
})();
