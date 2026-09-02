(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  const STATUS_LABELS={
    recebido:'Dados recebidos',
    em_analise_cfo:'Em análise',
    rascunho_cfo:'Em análise',
    aprovada_cfo:'Proposta pronta',
    proposta_aprovada_cfo:'Proposta pronta',
    publicada:'Proposta pronta',
    proposta_publicada:'Proposta pronta',
    enviada_cliente:'Enviada ao cliente',
    proposta_enviada:'Enviada ao cliente',
    proposta_aceita_aguardando_cfo:'Aguardando CFO',
    aceite_validado_cfo:'Aguardando CFO',
    contrato_autorizado:'Contrato liberado',
    autorizado_cfo_aguardando_geracao:'Contrato liberado',
    contrato_gerado:'Contrato gerado',
    gerado:'Contrato gerado',
    aguardando_assinatura:'Aguardando assinatura',
    assinado:'Assinado',
    implantacao:'Implantação',
    em_implantacao:'Implantação',
    operacao_iniciada:'Operação iniciada',
    encerrado:'Encerrado'
  };
  const RESPONSIBLE={
    lead:'Comercial',dados_recebidos:'Comercial',analise:'CFO',proposta:'Comercial',enviada:'Cliente',aceita:'Sistema',cfo:'CFO',contrato:'CFO',assinatura:'Cliente',implantacao:'Operações'
  };
  const NEXT_ACTION={
    lead:'Enviar link da coleta',dados_recebidos:'Iniciar análise',analise:'Concluir análise e precificação',proposta:'Enviar proposta ao cliente',enviada:'Acompanhar retorno do cliente',aceita:'Aceite registrado',cfo:'Validar aceite e liberar contrato',contrato:'Gerar ou revisar contrato',assinatura:'Acompanhar assinatura',implantacao:'Conduzir kickoff e implantação'
  };
  const LEGACY_LABEL_TO_STATUS={
    'Recebido':'recebido','Rascunho CFO':'em_analise_cfo','Aprovada CFO':'aprovada_cfo','Publicada':'publicada','Enviada':'enviada_cliente','Aceita · aguardando CFO':'proposta_aceita_aguardando_cfo','Contrato autorizado':'contrato_autorizado','Encerrado':'encerrado'
  };

  function ensureStyles(){
    if(document.getElementById('fenix-pipeline-v3-theme'))return;
    const style=document.createElement('style');
    style.id='fenix-pipeline-v3-theme';
    style.textContent=`
      #fenix-internal-dashboard[data-pipeline-v3="1"]{overflow:visible!important}
      #fenix-internal-dashboard[data-pipeline-v3="1"] .fenix-stage-row{display:none!important}
      .fenix-v3-toolbar{display:grid;grid-template-columns:minmax(220px,1.4fr) minmax(160px,.7fr) minmax(160px,.7fr);gap:10px;margin:0 0 16px;position:relative;z-index:3}
      .fenix-v3-toolbar input,.fenix-v3-toolbar select{width:100%;min-height:40px;border:1px solid #40331e;border-radius:10px;background:#0a0a09;color:#eee8dd;padding:9px 11px;font:inherit;font-size:12px;outline:none}.fenix-v3-toolbar input:focus,.fenix-v3-toolbar select:focus{border-color:#a87920}
      .fenix-v3-grid{position:relative;z-index:2;display:grid;gap:12px;align-items:start}.fenix-v3-grid.top{grid-template-columns:repeat(5,minmax(0,1fr))}.fenix-v3-grid.bottom{grid-template-columns:repeat(4,minmax(0,1fr))}
      .fenix-v3-stage{background:#0b0b0a;border:1px solid #332b1e;border-radius:15px;padding:12px;min-height:210px}.fenix-v3-stage:has(.fenix-card-v3){min-height:270px}.fenix-v3-stage-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;border-bottom:1px solid #242118;padding-bottom:10px;margin-bottom:10px}.fenix-v3-stage-title{font-size:14px;font-weight:900;color:#e4bd50}.fenix-v3-stage-hint{font-size:10px;color:#7e786e;line-height:1.4;margin-top:3px}.fenix-v3-count{min-width:25px;height:25px;border-radius:999px;display:grid;place-items:center;background:#2a2418;color:#d9bb67;font-size:10px;font-weight:900}
      .fenix-v3-cards{display:grid;gap:10px}.fenix-v3-empty{color:#706b63;font-size:10px;padding:9px 2px}
      .fenix-accept-milestone{position:relative;z-index:2;margin:12px 0;display:flex;align-items:center;gap:12px;border:1px dashed #5e4a22;border-radius:13px;background:#0e0c08;padding:11px 14px;color:#c5bca9;font-size:11px}.fenix-accept-milestone strong{color:#e7bd4d}.fenix-accept-icon{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#2b2414;color:#efc34e;font-weight:950}.fenix-accept-count{margin-left:auto;color:#d6b452;font-weight:900}
      .fenix-card-v3{background:#10100f;border:1px solid #383025;border-radius:13px;padding:14px;box-shadow:0 7px 20px rgba(0,0,0,.2)}.fenix-card-v3 .fenix-card-head{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:start}.fenix-card-v3 .fenix-card-name{font-size:13px;line-height:1.27;color:#f4efe6;font-weight:900;min-height:0}.fenix-card-status{font-size:9px;border:1px solid #4b402c;background:#16140f;color:#c8b882;border-radius:999px;padding:4px 7px;white-space:nowrap}.fenix-card-v3 .fenix-card-meta{font-size:9px;color:#777168;margin-top:5px}.fenix-value{margin-top:13px;padding-top:11px;border-top:1px solid #262218}.fenix-value span{display:block;font-size:9px;color:#7d776d;text-transform:uppercase;letter-spacing:.05em}.fenix-value strong{display:block;margin-top:2px;font-size:18px;color:#e8be4c}.fenix-action-panel{margin-top:12px;padding:10px 11px;border-radius:10px;background:#0b0b0a;border:1px solid #30291d}.fenix-action-panel span{display:block;font-size:8px;color:#9b8756;text-transform:uppercase;font-weight:900;letter-spacing:.07em}.fenix-action-panel strong{display:block;color:#e6dfd2;font-size:11px;line-height:1.35;margin-top:3px}.fenix-ownership{display:flex;gap:10px;flex-wrap:wrap;margin-top:9px;color:#837c70;font-size:9px}.fenix-ownership b{color:#c8b98e;font-weight:700}.fenix-v3-actions{display:flex;align-items:center;gap:8px;margin-top:12px}.fenix-primary-action{border:0;border-radius:9px;background:linear-gradient(180deg,#e9bd45,#a96f0d);color:#111;padding:9px 11px;font-size:10px;font-weight:950;cursor:pointer}.fenix-secondary-link{color:#bfb3a0!important;background:transparent!important;border:0!important;padding:5px 2px!important;font-size:9px!important;text-decoration:underline!important;text-underline-offset:3px}.fenix-more{position:relative;margin-left:auto}.fenix-more summary{list-style:none;width:31px;height:31px;border-radius:9px;border:1px solid #39332b;background:#0d0d0c;color:#aaa096;display:grid;place-items:center;cursor:pointer}.fenix-more summary::-webkit-details-marker{display:none}.fenix-more-menu{position:absolute;right:0;top:35px;z-index:30;background:#0b0b0a;border:1px solid #40382f;border-radius:10px;padding:7px;min-width:150px;box-shadow:0 12px 30px rgba(0,0,0,.5)}.fenix-more-menu button{width:100%;text-align:left;background:transparent!important;border:0!important;color:#c6bdb0!important;font-size:10px!important;padding:8px!important}.fenix-channel-preview{font-size:8px;color:#7f796f;margin-top:8px}.fenix-channel-preview span{color:#bfae7b;margin-right:8px}
      .fenix-archive-panel{display:none;position:relative;z-index:3;margin:0 0 14px;border:1px solid #39332a;border-radius:14px;background:#090909;padding:13px}.fenix-archive-panel.open{display:block}.fenix-archive-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}.fenix-archive-head strong{color:#d8b65b}.fenix-archive-list{display:grid;gap:8px}.fenix-archive-item{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #24211c;padding-top:9px;font-size:10px;color:#aaa398}.fenix-archive-item b{color:#eee8dd}.fenix-archive-item button{border:1px solid #4b4337;border-radius:8px;background:#111;color:#cfc6b7;padding:7px 9px;font-size:9px;cursor:pointer}
      @media(max-width:1180px){.fenix-v3-grid.top,.fenix-v3-grid.bottom{grid-template-columns:repeat(2,minmax(260px,1fr))}.fenix-v3-toolbar{grid-template-columns:1fr 1fr}.fenix-v3-toolbar input{grid-column:1/-1}}
      @media(max-width:700px){.fenix-v3-grid.top,.fenix-v3-grid.bottom,.fenix-v3-toolbar{grid-template-columns:1fr}.fenix-v3-toolbar input{grid-column:auto}}
    `;
    document.head.appendChild(style);
  }
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  function cardStatus(card){const badge=[...card.querySelectorAll('span')].find(x=>Object.keys(LEGACY_LABEL_TO_STATUS).some(label=>x.textContent.trim().startsWith(label)));if(!badge)return'recebido';const text=badge.textContent.trim();const key=Object.keys(LEGACY_LABEL_TO_STATUS).find(label=>text.startsWith(label));return LEGACY_LABEL_TO_STATUS[key]||'recebido'}
  function daysSince(value){const t=new Date(value||0).getTime();if(!t)return null;return Math.max(0,Math.floor((Date.now()-t)/86400000))}
  function timeLabel(days){if(days===null)return'Tempo não disponível';if(days===0)return'Hoje';if(days===1)return'Há 1 dia';return`Há ${days} dias`}
  async function loadMeta(){try{const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});const d=await r.json();if(!r.ok)return new Map();return new Map((d.items||[]).map(x=>[x.id,x]))}catch{return new Map()}}
  function statusFor(stage,status){if(stage==='cfo')return'Aguardando CFO';if(stage==='proposta'&&status==='publicada')return'Proposta pronta';return STATUS_LABELS[status]||'Em andamento'}
  function buildCard(card,stage,status,meta){
    card.draggable=false;card.removeAttribute('draggable');card.className='fenix-card fenix-card-v3';
    const name=card.querySelector('.fenix-card-name')?.textContent.trim()||'Cliente';
    const rawMeta=card.querySelector('.fenix-card-meta')?.textContent.trim()||'';
    const moneyStrong=card.querySelector('.fenix-card-money strong')?.textContent.trim()||'';
    const legacyActions=card.querySelector('.fenix-card-actions');
    const open=legacyActions?.querySelector('[data-kanban-open]')||null;
    const proposal=legacyActions?.querySelector('.fenix-card-link')||null;
    const close=legacyActions?.querySelector('.fenix-card-btn.close')||null;
    const updated=meta?.proposal?.updated_at||meta?.updated_at||meta?.created_at;
    const days=daysSince(updated);
    const intakeId=card.dataset.intakeId||meta?.id||'';
    card.innerHTML=`<div class="fenix-card-head"><div><div class="fenix-card-name">${esc(name)}</div><div class="fenix-card-meta">${esc(rawMeta)}</div></div><span class="fenix-card-status">${esc(statusFor(stage,status))}</span></div>${moneyStrong?`<div class="fenix-value"><span>Valor mensal</span><strong>${esc(moneyStrong)}</strong></div>`:''}<div class="fenix-action-panel"><span>Próxima ação</span><strong>${esc(NEXT_ACTION[stage]||'Acompanhar oportunidade')}</strong></div><div class="fenix-ownership"><span>Responsável: <b>${esc(RESPONSIBLE[stage]||'Equipe')}</b></span><span>Na etapa: <b>${esc(timeLabel(days))}</b></span></div><div class="fenix-v3-actions"></div>`;
    const actions=card.querySelector('.fenix-v3-actions');
    if(stage==='proposta'&&status==='publicada'){
      const send=document.createElement('button');send.type='button';send.className='fenix-primary-action';send.textContent='Enviar proposta';send.addEventListener('click',()=>alert('Homologação: o envio por WhatsApp e e-mail ainda está simulado. Nenhuma mensagem foi enviada.'));actions.appendChild(send);
      const channels=document.createElement('div');channels.className='fenix-channel-preview';channels.innerHTML='<span>WhatsApp ○</span><span>E-mail ○</span>';card.appendChild(channels);
    }else if(open){
      open.className='fenix-primary-action';open.textContent=stage==='dados_recebidos'?'Iniciar análise':stage==='analise'?'Continuar análise':stage==='cfo'?'Validar e liberar contrato':stage==='contrato'?'Abrir contrato':'Abrir';actions.appendChild(open);
    }
    if(proposal){proposal.className='fenix-secondary-link';proposal.textContent='Ver proposta';actions.appendChild(proposal)}
    if(close){const details=document.createElement('details');details.className='fenix-more';details.innerHTML='<summary aria-label="Mais ações">⋯</summary><div class="fenix-more-menu"></div>';close.textContent='Encerrar / arquivar';details.querySelector('.fenix-more-menu').appendChild(close);actions.appendChild(details)}
    if(!actions.children.length&&intakeId)actions.innerHTML='<span style="font-size:9px;color:#706b63">Sem ação manual nesta etapa</span>';
    return card;
  }
  function metricRename(box){const spans=[...box.querySelectorAll('.fenix-metric span')];const names=['Oportunidades ativas','Receita mensal potencial','Receita mensal em propostas','Pendências para aprovação'];spans.slice(0,4).forEach((x,i)=>x.textContent=names[i])}
  function makeStage(stage,list,hint){const section=document.createElement('section');section.className='fenix-v3-stage';section.dataset.stage=stage.key;section.innerHTML=`<div class="fenix-v3-stage-head"><div><div class="fenix-v3-stage-title">${stage.title}</div><div class="fenix-v3-stage-hint">${hint}</div></div><span class="fenix-v3-count">${list.length}</span></div><div class="fenix-v3-cards"></div>`;const box=section.querySelector('.fenix-v3-cards');if(list.length)list.forEach(c=>box.appendChild(c));else box.innerHTML='<div class="fenix-v3-empty">Nenhum cliente nesta etapa.</div>';return section}
  function installFilters(box,stageSections){const toolbar=document.createElement('div');toolbar.className='fenix-v3-toolbar';toolbar.innerHTML='<input id="fenixSearch" placeholder="Buscar cliente"><select id="fenixStageFilter"><option value="">Todas as etapas</option><option value="lead">Lead</option><option value="dados_recebidos">Dados recebidos</option><option value="analise">Análise</option><option value="proposta">Proposta</option><option value="enviada">Enviada</option><option value="cfo">CFO</option><option value="contrato">Contrato</option><option value="assinatura">Assinatura</option><option value="implantacao">Implantação</option></select><select id="fenixOwnerFilter"><option value="">Todos os responsáveis</option><option>Comercial</option><option>CFO</option><option>Cliente</option><option>Operações</option></select>';const metrics=box.querySelector('.fenix-metrics-grid');metrics?.after(toolbar);const apply=()=>{const q=toolbar.querySelector('#fenixSearch').value.trim().toLowerCase(),s=toolbar.querySelector('#fenixStageFilter').value,o=toolbar.querySelector('#fenixOwnerFilter').value;stageSections.forEach(section=>{const stage=section.dataset.stage;section.style.display=s&&s!==stage?'none':'';section.querySelectorAll('.fenix-card-v3').forEach(card=>{const txt=card.textContent.toLowerCase(),owner=RESPONSIBLE[stage]||'';card.style.display=((!q||txt.includes(q))&&(!o||owner===o))?'':'none'})})};toolbar.addEventListener('input',apply);toolbar.addEventListener('change',apply)}
  function archivePanel(box,closed){const actions=box.querySelector('.fenix-pipeline-actions');if(!actions)return;let btn=[...actions.querySelectorAll('button')].find(x=>x.textContent.includes('Encerrados / Arquivo'));if(!btn){btn=document.createElement('button');btn.className='fenix-pipeline-action';btn.textContent=`Encerrados / Arquivo (${closed.length})`;actions.appendChild(btn)}else btn.textContent=`Encerrados / Arquivo (${closed.length})`;const panel=document.createElement('div');panel.className='fenix-archive-panel';panel.innerHTML='<div class="fenix-archive-head"><strong>Encerrados / Arquivo</strong><span>Fora do funil ativo</span></div><div class="fenix-archive-list"></div>';const list=panel.querySelector('.fenix-archive-list');if(!closed.length)list.innerHTML='<div class="fenix-v3-empty">Nenhuma oportunidade arquivada.</div>';else closed.forEach(card=>{const name=card.querySelector('.fenix-card-name')?.textContent.trim()||'Cliente';const id=card.dataset.intakeId;const item=document.createElement('div');item.className='fenix-archive-item';item.innerHTML=`<div><b>${esc(name)}</b><div>Oportunidade encerrada</div></div><button data-reopen-v3="${esc(id)}">Reabrir</button>`;list.appendChild(item)});const toolbar=box.querySelector('.fenix-v3-toolbar');toolbar?.before(panel);btn.addEventListener('click',()=>panel.classList.toggle('open'));panel.addEventListener('click',async e=>{const id=e.target?.dataset?.reopenV3;if(!id)return;if(!confirm('Reabrir esta oportunidade no Pipeline?'))return;try{const r=await fetch('/api/internal-intake-stage',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({intake_id:id,action:'reopen'})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível reabrir.');location.reload()}catch(err){alert(err.message)}})}
  async function apply(box){
    ensureStyles();metricRename(box);const model=window.FenixPipelineState;const oldRow=box.querySelector('.fenix-stage-row');if(!oldRow)return;const metaMap=await loadMeta();const cards=[...oldRow.querySelectorAll('.fenix-card')];const buckets=new Map(model.STAGES.map(s=>[s.key,[]]));const closed=[];let acceptedCount=0;
    cards.forEach(card=>{const status=cardStatus(card);if(status==='encerrado'){closed.push(card);return}const stage=model.stageOf(status);if(stage==='aceita'){acceptedCount++;return}const meta=metaMap.get(card.dataset.intakeId);buildCard(card,stage,status,meta);(buckets.get(stage)||buckets.get('dados_recebidos')).push(card)});
    oldRow.remove();box.dataset.pipelineV2='1';box.dataset.pipelineV3='1';
    const hints={lead:'Contato identificado antes da coleta',dados_recebidos:'Cliente enviou os dados',analise:'Escopo e precificação em construção',proposta:'Proposta pronta, ainda não enviada',enviada:'Proposta enviada e registrada',cfo:'Aceite recebido, validação final',contrato:'Contrato autorizado ou gerado',assinatura:'Contrato enviado para assinatura',implantacao:'Kickoff e início da operação'};
    const top=document.createElement('div');top.className='fenix-v3-grid top';const bottom=document.createElement('div');bottom.className='fenix-v3-grid bottom';const sections=[];
    ['lead','dados_recebidos','analise','proposta','enviada'].forEach(k=>{const s=model.stage(k),el=makeStage(s,buckets.get(k)||[],hints[k]);sections.push(el);top.appendChild(el)});
    const milestone=document.createElement('div');milestone.className='fenix-accept-milestone';milestone.innerHTML=`<div class="fenix-accept-icon">✓</div><div><strong>Aceite</strong><div>Marco automático: fica registrado e a oportunidade segue para CFO.</div></div><span class="fenix-accept-count">${acceptedCount}</span>`;
    ['cfo','contrato','assinatura','implantacao'].forEach(k=>{const s=model.stage(k),el=makeStage(s,buckets.get(k)||[],hints[k]);sections.push(el);bottom.appendChild(el)});
    const note=box.querySelector('.fenix-rule-note');if(note){note.before(top,milestone,bottom)}else box.append(top,milestone,bottom);
    installFilters(box,sections);archivePanel(box,closed);
    const sub=box.querySelector('.fenix-pipeline-sub');if(sub)sub.textContent='Visão executiva: cada card mostra valor, próxima ação, responsável e tempo na etapa. Proposta publicada só passa para Enviada após o envio registrado.';
    if(note)note.innerHTML='<b>Governança:</b> Aceite é um marco, não uma coluna operacional. Encerrados ficam fora do funil ativo com histórico preservado. WhatsApp/e-mail seguem simulados nesta homologação.';
  }
  function wait(){const box=document.getElementById('fenix-internal-dashboard');if(!box||box.dataset.kanban!=='1'||!window.FenixPipelineState)return setTimeout(wait,120);if(box.dataset.pipelineV3==='1')return;apply(box)}
  wait();
})();
