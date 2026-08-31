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
  function badge(status){const s=STATUS[status]||{label:String(status||'Recebido').replaceAll('_',' '),bg:'#eef2f7',fg:'#4d5968'};return `<span style="display:inline-block;padding:5px 9px;border-radius:999px;background:${s.bg};color:${s.fg};font-size:11px;font-weight:800">${esc(s.label)}</span>`}
  function proposalLabel(p){if(!p)return 'Sem condição comercial salva';const st=String(p.status||'');if(st==='em_analise_cfo'||st==='rascunho_cfo')return `Rascunho CFO · v${p.version||1}`;if(st==='aprovada_cfo')return `Aprovada CFO · v${p.version||1}`;if(st==='publicada')return `Publicada · v${p.version||1}`;return `${st.replaceAll('_',' ')} · v${p.version||1}`}

  function hideAnalysisUntilOpen(){
    const dashboard=document.getElementById('fenix-internal-dashboard');
    if(!dashboard)return;
    [...document.querySelectorAll('.wrap > .card')].forEach(card=>{if(card!==dashboard&&!card.id?.startsWith('fenix-internal-login'))card.style.display='none'});
    document.getElementById('diagnostico')?.classList.add('hidden');
  }

  async function enhance(){
    if(!window.FENIX_INTERNAL_MODE)return;
    const box=document.getElementById('fenix-internal-dashboard');if(!box)return;
    try{
      const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao carregar.');
      const items=d.items||[];
      const rows=items.map((item,idx)=>{
        const c=item.client||{};const p=item.proposal||null;const t=p?.commercial_terms||{};
        const name=c.razao_social||c.nome_fantasia||'Cliente sem nome';
        const date=item.created_at?new Date(item.created_at).toLocaleString('pt-BR'):'';
        const status=item.status||'recebido';
        const hasDraft=!!p;
        const action=(p?.status==='em_analise_cfo'||p?.status==='rascunho_cfo')?'Continuar rascunho':'Abrir análise CFO';
        return `<div style="border:1px solid #e7e0d3;border-radius:12px;padding:15px 16px;margin:10px 0;background:#fff">
          <div style="display:flex;gap:14px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap">
            <div style="flex:1;min-width:260px"><strong style="font-size:14px">${esc(name)}</strong><div style="font-size:11px;color:#706b63;margin-top:4px">${esc(c.cnpj||'')} · ${esc(date)}</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${badge(status)}${hasDraft?`<span style="display:inline-block;padding:5px 9px;border-radius:999px;background:#fff4d6;color:#7a5700;font-size:11px;font-weight:800">${esc(proposalLabel(p))}</span>`:''}</div></div>
            <div style="text-align:right;min-width:150px"><div style="font-size:11px;color:#706b63">Faturamento informado</div><strong>${money(item.faturamento)}</strong>${p?`<div style="font-size:11px;color:#706b63;margin-top:6px">Mensalidade CFO</div><strong>${money(t.final_monthly||0)}</strong>`:''}</div>
            <button class="btn ghost" data-enhanced-open="${idx}">${esc(action)}</button>
          </div>
        </div>`
      }).join('');
      box.innerHTML=`<div class="section">Clientes e propostas em andamento</div><div style="font-size:12px;color:#716b61;margin:-4px 0 12px">Rascunhos, aprovações e propostas publicadas ficam visíveis aqui para você continuar de onde parou.</div>${rows||'<div class="ok">Nenhum levantamento recebido ainda.</div>'}`;
      box.querySelectorAll('[data-enhanced-open]').forEach(btn=>btn.onclick=()=>{
        const item=items[Number(btn.dataset.enhancedOpen)];
        const original=[...document.querySelectorAll('[data-open-intake]')][Number(btn.dataset.enhancedOpen)];
        if(original){original.click();return}
        // fallback: reload the original dashboard script's data path by exposing a synthetic click after restoring cards
        [...document.querySelectorAll('.wrap > .card')].forEach(card=>{if(card!==box)card.style.display=''});
        document.getElementById('diagnostico')?.classList.remove('hidden');
        window.dispatchEvent(new CustomEvent('fenix:open-intake-request',{detail:item}));
      });
    }catch(e){console.error('Dashboard enhance:',e)}
  }

  const obs=new MutationObserver(()=>{const box=document.getElementById('fenix-internal-dashboard');if(box&&!box.dataset.enhanced){box.dataset.enhanced='1';setTimeout(()=>{hideAnalysisUntilOpen();enhance()},80)}});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('fenix:internal-authenticated',()=>setTimeout(()=>{hideAnalysisUntilOpen();enhance()},300));
})();
