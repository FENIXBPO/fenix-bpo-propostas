(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  const STAGES=[
    {key:'entrada',title:'Entrada',hint:'Novos levantamentos recebidos',color:'#eef2f7'},
    {key:'cfo',title:'Análise CFO',hint:'Rascunho e definição comercial',color:'#fff4d6'},
    {key:'proposta',title:'Proposta',hint:'Aprovada ou publicada ao cliente',color:'#e8f0ff'},
    {key:'aceite',title:'Aceite',hint:'Cliente aceitou · aguardando CFO',color:'#f1eaff'},
    {key:'contrato',title:'Contrato',hint:'Autorizado para geração/assinatura',color:'#e8f5ee'}
  ];
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
  function statusOf(item,p){
    if(item?.status==='contrato_autorizado')return 'contrato_autorizado';
    if(item?.status==='proposta_aceita_aguardando_cfo')return 'proposta_aceita_aguardando_cfo';
    if(p?.status==='publicada')return 'publicada';
    if(p?.status==='aprovada_cfo')return 'aprovada_cfo';
    if(p?.status==='em_analise_cfo'||p?.status==='rascunho_cfo')return 'em_analise_cfo';
    return 'recebido';
  }
  function stageOf(status){
    if(status==='contrato_autorizado')return 'contrato';
    if(status==='proposta_aceita_aguardando_cfo')return 'aceite';
    if(status==='publicada'||status==='aprovada_cfo')return 'proposta';
    if(status==='em_analise_cfo'||status==='rascunho_cfo')return 'cfo';
    return 'entrada';
  }
  function statusBadge(status,version){
    const s=STATUS[status]||STATUS.recebido;
    return `<span style="display:inline-block;padding:5px 9px;border-radius:999px;background:${s.bg};color:${s.fg};font-size:10px;font-weight:800">${esc(s.label)}${version?` · v${version}`:''}</span>`;
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
    const box=document.getElementById('fenix-internal-dashboard');if(!box||box.dataset.kanban==='1')return;
    try{
      const originalButtons=[...box.querySelectorAll('[data-open-intake]')];
      const openHandlers=originalButtons.map(btn=>btn.onclick);
      const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao carregar.');
      const items=d.items||[];
      const cards=items.map((item,idx)=>{
        const c=item.client||{},p=item.proposal||null,t=p?.commercial_terms||{};
        const name=c.razao_social||c.nome_fantasia||'Cliente sem nome';
        const status=statusOf(item,p),stage=stageOf(status);
        const date=item.created_at?new Date(item.created_at).toLocaleDateString('pt-BR'):'';
        const mrr=Number(t.final_monthly||0);
        return {item,idx,name,status,stage,date,mrr,p,t,open:openHandlers[idx]};
      });
      const pipelineMrr=cards.filter(x=>x.stage!=='entrada').reduce((s,x)=>s+x.mrr,0);
      const publishedMrr=cards.filter(x=>['proposta','aceite','contrato'].includes(x.stage)).reduce((s,x)=>s+x.mrr,0);
      const pendingCfo=cards.filter(x=>x.stage==='cfo'||x.stage==='aceite').length;

      const cols=STAGES.map(stage=>{
        const list=cards.filter(x=>x.stage===stage.key);
        const html=list.map(x=>{
          const action=x.stage==='cfo'?'Continuar rascunho':x.stage==='entrada'?'Abrir análise CFO':x.stage==='aceite'?'Revisar aceite':'Abrir análise CFO';
          const pub=x.p?.public_url?`<a href="${esc(x.p.public_url)}" target="_blank" rel="noopener" style="font-size:11px;font-weight:700;color:#284f9e;text-decoration:none">Abrir proposta ↗</a>`:'';
          return `<article data-card-index="${x.idx}" style="background:#fff;border:1px solid #e6dfd2;border-radius:12px;padding:12px;box-shadow:0 2px 8px rgba(30,24,12,.04)">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><strong style="font-size:12px;line-height:1.3">${esc(x.name)}</strong>${statusBadge(x.status,x.p?.version||null)}</div>
            <div style="font-size:10px;color:#777;margin-top:5px">${esc(x.item.client?.cnpj||'')} · ${esc(x.date)}</div>
            ${x.p?`<div style="margin-top:10px;padding-top:9px;border-top:1px solid #eee"><div style="font-size:10px;color:#777">Mensalidade CFO</div><strong style="font-size:15px">${money(x.mrr)}</strong></div>`:''}
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:11px;flex-wrap:wrap"><button class="btn ghost" data-kanban-open="${x.idx}" style="padding:8px 10px;font-size:11px">${esc(action)}</button>${pub}</div>
          </article>`;
        }).join('')||'<div style="font-size:11px;color:#8a857c;padding:8px 2px">Nenhum cliente nesta etapa.</div>';
        return `<section style="min-width:220px;flex:1;background:#faf9f6;border:1px solid #e6dfd2;border-radius:14px;padding:10px">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:4px"><strong style="font-size:12px">${stage.title}</strong><span style="min-width:24px;height:24px;border-radius:999px;display:grid;place-items:center;background:${stage.color};font-size:11px;font-weight:800">${list.length}</span></div>
          <div style="font-size:10px;color:#7a756c;min-height:28px;margin-bottom:8px">${stage.hint}</div>
          <div style="display:grid;gap:9px">${html}</div>
        </section>`;
      }).join('');

      box.dataset.kanban='1';
      box.innerHTML=`<div class="section">Pipeline comercial FÊNIX</div>
        <div style="font-size:12px;color:#716b61;margin:-4px 0 14px">O cliente muda de etapa automaticamente conforme rascunho, aprovação CFO, publicação, aceite e contrato. Não há arraste manual: o fluxo respeita a governança.</div>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px">
          <div class="metric"><span>Clientes no pipeline</span><strong>${cards.length}</strong></div>
          <div class="metric"><span>MRR em negociação</span><strong>${money(pipelineMrr)}</strong></div>
          <div class="metric"><span>MRR aprovado/publicado</span><strong>${money(publishedMrr)}</strong></div>
          <div class="metric"><span>Ações CFO pendentes</span><strong>${pendingCfo}</strong></div>
        </div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:6px">${cols}</div>`;

      box.querySelectorAll('[data-kanban-open]').forEach(btn=>btn.onclick=()=>{
        const idx=Number(btn.dataset.kanbanOpen);showAnalysis();
        if(typeof openHandlers[idx]==='function'){openHandlers[idx].call(originalButtons[idx]);return}
        location.reload();
      });
    }catch(e){console.error('Kanban enhance:',e)}
  }

  const obs=new MutationObserver(()=>{
    const box=document.getElementById('fenix-internal-dashboard');
    if(box&&box.dataset.kanban!=='1'&&!box.dataset.kanbanScheduled){box.dataset.kanbanScheduled='1';setTimeout(()=>{hideAnalysisUntilOpen();enhance()},150)}
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('fenix:internal-authenticated',()=>setTimeout(()=>{hideAnalysisUntilOpen();enhance()},350));
})();
