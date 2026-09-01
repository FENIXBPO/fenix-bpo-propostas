(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  function injectFenixStyles(){
    if(document.getElementById('fenix-pipeline-theme'))return;
    const style=document.createElement('style');
    style.id='fenix-pipeline-theme';
    style.textContent=`
      body{background:radial-gradient(circle at 82% 5%,rgba(217,154,29,.08),transparent 24%),#070707!important;color:#f5f1e8!important}
      .top{background:linear-gradient(110deg,#020202,#11100c)!important;border-bottom:1px solid #8c6518!important;color:#f5f1e8!important}
      .wrap{max-width:1420px!important}
      #fenix-internal-dashboard{background:#0b0b0b!important;border:1px solid #4d3b1b!important;box-shadow:0 16px 50px rgba(0,0,0,.28)!important;color:#f5f1e8!important;border-radius:18px!important}
      #fenix-internal-dashboard>.section{color:#f1c04d!important;border-bottom-color:#4d3b1b!important;font-size:14px!important;letter-spacing:.12em!important}
      #fenix-internal-dashboard .metric{background:linear-gradient(180deg,#12110e,#0c0c0c)!important;border:1px solid #4a391b!important;color:#f5f1e8!important;border-radius:14px!important}
      #fenix-internal-dashboard .metric span{color:#aca28e!important;font-size:10px!important}
      #fenix-internal-dashboard .metric strong{color:#f3c550!important}
      #fenix-internal-dashboard section{background:#0f0f0e!important;border:1px solid #3d321d!important}
      #fenix-internal-dashboard section>div strong{color:#f5d36b!important}
      #fenix-internal-dashboard article[data-card-index]{background:linear-gradient(180deg,#151515,#0d0d0d)!important;border:1px solid #4b3a1c!important;box-shadow:0 4px 14px rgba(0,0,0,.25)!important;color:#f5f1e8!important}
      #fenix-internal-dashboard article[data-card-index] strong{color:#f7f1e4!important}
      #fenix-internal-dashboard article[data-card-index] div{color:#a9a196}
      #fenix-internal-dashboard article[data-card-index] a{color:#f1c04d!important}
      #fenix-internal-dashboard .btn.ghost{background:#17140e!important;border:1px solid #73551d!important;color:#f5d36b!important}
      #fenix-internal-dashboard .btn.ghost:hover{background:#241c0d!important}
      .fenix-pipeline-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:16px}
      .fenix-pipeline-brand{font-size:24px;font-weight:950;letter-spacing:.08em;color:#f1c04d;line-height:1.05}
      .fenix-pipeline-sub{font-size:13px;color:#b9b0a0;margin-top:7px;max-width:760px;line-height:1.5}
      .fenix-pipeline-actions{display:flex;gap:8px;flex-wrap:wrap}
      .fenix-pipeline-action{display:inline-flex;align-items:center;justify-content:center;padding:10px 13px;border-radius:10px;border:1px solid #5f481f;background:#12100b;color:#f5d36b;text-decoration:none;font-size:12px;font-weight:800;cursor:pointer}
      .fenix-pipeline-action.primary{background:linear-gradient(180deg,#f1c04d,#b97810);color:#111;border:0}
      @media(max-width:780px){#fenix-internal-dashboard{padding:16px!important}.fenix-pipeline-brand{font-size:20px}.fenix-pipeline-actions{width:100%}.fenix-pipeline-action{flex:1;min-width:135px}}
    `;
    document.head.appendChild(style);
  }
  injectFenixStyles();

  const STAGES=[
    {key:'entrada',title:'Entrada',hint:'Novos levantamentos recebidos',color:'#3b331f'},
    {key:'cfo',title:'Análise CFO',hint:'Rascunho e definição comercial',color:'#5a4315'},
    {key:'proposta',title:'Proposta',hint:'Aprovada ou publicada ao cliente',color:'#3b341d'},
    {key:'aceite',title:'Aceite',hint:'Cliente aceitou · aguardando CFO',color:'#4e3917'},
    {key:'contrato',title:'Contrato',hint:'Autorizado para geração/assinatura',color:'#30452f'}
  ];
  const STATUS={
    recebido:{label:'Recebido',bg:'#282828',fg:'#ddd6c9'},
    em_analise_cfo:{label:'Rascunho CFO',bg:'#3c2d0d',fg:'#f1c04d'},
    rascunho_cfo:{label:'Rascunho CFO',bg:'#3c2d0d',fg:'#f1c04d'},
    aprovada_cfo:{label:'Aprovada pelo CFO',bg:'#203629',fg:'#bfe8ca'},
    publicada:{label:'Proposta publicada',bg:'#433515',fg:'#f5d36b'},
    proposta_aceita_aguardando_cfo:{label:'Aceita · aguardando CFO',bg:'#493817',fg:'#ffe29a'},
    contrato_autorizado:{label:'Contrato autorizado',bg:'#203629',fg:'#bfe8ca'}
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
          const pub=x.p?.public_url?`<a href="${esc(x.p.public_url)}" target="_blank" rel="noopener" style="font-size:11px;font-weight:700;text-decoration:none">Abrir proposta ↗</a>`:'';
          return `<article data-card-index="${x.idx}" style="border-radius:12px;padding:13px">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><strong style="font-size:12px;line-height:1.35">${esc(x.name)}</strong>${statusBadge(x.status,x.p?.version||null)}</div>
            <div style="font-size:10px;margin-top:5px">${esc(x.item.client?.cnpj||'')} · ${esc(x.date)}</div>
            ${x.p?`<div style="margin-top:10px;padding-top:9px;border-top:1px solid #312919"><div style="font-size:10px">Mensalidade CFO</div><strong style="font-size:15px;color:#f3c550!important">${money(x.mrr)}</strong></div>`:''}
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:11px;flex-wrap:wrap"><button class="btn ghost" data-kanban-open="${x.idx}" style="padding:8px 10px;font-size:11px">${esc(action)}</button>${pub}</div>
          </article>`;
        }).join('')||'<div style="font-size:11px;color:#8f887d;padding:8px 2px">Nenhum cliente nesta etapa.</div>';
        return `<section style="min-width:225px;flex:1;border-radius:14px;padding:11px">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:4px"><strong style="font-size:12px">${stage.title}</strong><span style="min-width:24px;height:24px;border-radius:999px;display:grid;place-items:center;background:${stage.color};color:#f5d36b;font-size:11px;font-weight:800">${list.length}</span></div>
          <div style="font-size:10px;color:#9e9688;min-height:28px;margin-bottom:8px">${stage.hint}</div>
          <div style="display:grid;gap:9px">${html}</div>
        </section>`;
      }).join('');

      box.dataset.kanban='1';
      box.innerHTML=`<div class="fenix-pipeline-head">
          <div><div class="fenix-pipeline-brand">FÊNIX INTELLIGENT BPO</div><div class="fenix-pipeline-sub">Pipeline Comercial · acompanhamento do cliente desde a entrada até aceite e contrato, respeitando aprovação CFO e governança.</div></div>
          <div class="fenix-pipeline-actions"><a class="fenix-pipeline-action primary" href="/dados/" target="_blank" rel="noopener">Nova coleta</a><button class="fenix-pipeline-action" id="fenixCopyCollect">Copiar link da coleta</button><a class="fenix-pipeline-action" href="/atalhos/">Central de atalhos</a></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:14px" class="fenix-metrics-grid">
          <div class="metric"><span>Clientes no pipeline</span><strong>${cards.length}</strong></div>
          <div class="metric"><span>MRR em negociação</span><strong>${money(pipelineMrr)}</strong></div>
          <div class="metric"><span>MRR aprovado/publicado</span><strong>${money(publishedMrr)}</strong></div>
          <div class="metric"><span>Ações CFO pendentes</span><strong>${pendingCfo}</strong></div>
        </div>
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:7px">${cols}</div>
        <style>@media(max-width:760px){.fenix-metrics-grid{grid-template-columns:1fr 1fr!important}}</style>`;

      const copyBtn=document.getElementById('fenixCopyCollect');
      if(copyBtn)copyBtn.onclick=async()=>{try{await navigator.clipboard.writeText('https://proposta.fenixbpo.com.br/dados/');const old=copyBtn.textContent;copyBtn.textContent='Link copiado ✓';setTimeout(()=>copyBtn.textContent=old,1800)}catch{copyBtn.textContent='Copie: proposta.fenixbpo.com.br/dados/'}};

      box.querySelectorAll('[data-kanban-open]').forEach(btn=>btn.onclick=()=>{
        const idx=Number(btn.dataset.kanbanOpen);showAnalysis();
        if(typeof openHandlers[idx]==='function'){openHandlers[idx].call(originalButtons[idx]);return}
        location.reload();
      });
    }catch(e){console.error('Kanban enhance:',e)}
  }

  const obs=new MutationObserver(()=>{
    const box=document.getElementById('fenix-internal-dashboard');
    if(box&&box.dataset.kanban!=='1'&&!box.dataset.kanbanScheduled){box.dataset.kanbanScheduled='1';setTimeout(()=>{hideAnalysisUntilOpen();enhance()},80)}
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('fenix:internal-authenticated',()=>setTimeout(()=>{hideAnalysisUntilOpen();enhance()},120));
})();
