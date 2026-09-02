(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  const LEGACY_LABEL_TO_STATUS={
    'Recebido':'recebido',
    'Rascunho CFO':'em_analise_cfo',
    'Aprovada CFO':'aprovada_cfo',
    'Publicada':'publicada',
    'Aceita · aguardando CFO':'proposta_aceita_aguardando_cfo',
    'Contrato autorizado':'contrato_autorizado',
    'Encerrado':'encerrado'
  };

  function ensureStyles(){
    if(document.getElementById('fenix-pipeline-v2-theme'))return;
    const style=document.createElement('style');
    style.id='fenix-pipeline-v2-theme';
    style.textContent=`
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-row{grid-template-columns:repeat(10,minmax(230px,1fr))!important}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage{min-height:300px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage[data-kind="milestone"]{border-style:dashed;background:#100e09}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage[data-kind="future"]{opacity:.88}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-hint{min-height:44px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-milestone-note{font-size:10px;line-height:1.45;color:#a79d8d;padding:10px 3px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-card{cursor:default}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-card.accepted:before{content:'✓ aceite registrado';display:inline-block;margin-bottom:8px;padding:4px 7px;border:1px solid #6c5729;border-radius:999px;color:#f0c95f;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.05em}
      @media(max-width:900px){#fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-row{grid-template-columns:repeat(10,minmax(230px,260px))!important}}
    `;
    document.head.appendChild(style);
  }

  function cardStatus(card){
    const badge=[...card.querySelectorAll('span')].find(x=>Object.keys(LEGACY_LABEL_TO_STATUS).some(label=>x.textContent.trim().startsWith(label)));
    if(!badge)return'recebido';
    const text=badge.textContent.trim();
    const key=Object.keys(LEGACY_LABEL_TO_STATUS).find(label=>text.startsWith(label));
    return LEGACY_LABEL_TO_STATUS[key]||'recebido';
  }

  function waitForDashboard(){
    const box=document.getElementById('fenix-internal-dashboard');
    if(!box)return setTimeout(waitForDashboard,120);
    if(box.dataset.pipelineV2==='1')return;
    if(box.dataset.kanban!=='1'||!window.FenixPipelineState)return setTimeout(waitForDashboard,120);
    apply(box);
  }

  function apply(box){
    ensureStyles();
    const model=window.FenixPipelineState;
    const oldRow=box.querySelector('.fenix-stage-row');
    if(!oldRow)return;
    const cards=[...oldRow.querySelectorAll('.fenix-card')];
    const buckets=new Map(model.STAGES.map(s=>[s.key,[]]));
    const closed=[];

    cards.forEach(card=>{
      card.draggable=false;
      card.removeAttribute('draggable');
      const status=cardStatus(card);
      if(status==='encerrado'){closed.push(card);return}
      const stage=model.stageOf(status);
      if(status==='proposta_aceita_aguardando_cfo')card.classList.add('accepted');
      (buckets.get(stage)||buckets.get('dados_recebidos')).push(card);
    });

    const hints={
      lead:'Contato identificado antes do envio do formulário',
      dados_recebidos:'Cliente enviou a coleta de dados',
      analise:'Diagnóstico, escopo e precificação em construção',
      proposta:'Proposta aprovada internamente, ainda não enviada',
      enviada:'Proposta publicada e disponível ao cliente',
      aceita:'Marco automático de aceite do cliente',
      cfo:'Aceite recebido e aguardando validação final do CFO',
      contrato:'Contrato autorizado ou gerado',
      assinatura:'Contrato enviado para assinatura',
      implantacao:'Cliente em kickoff, implantação ou início da operação'
    };

    const row=document.createElement('div');
    row.className='fenix-stage-row';
    model.STAGES.forEach(stage=>{
      const list=buckets.get(stage.key)||[];
      const future=['lead','assinatura','implantacao'].includes(stage.key)?'future':'';
      const section=document.createElement('section');
      section.className='fenix-stage';
      section.dataset.stage=stage.key;
      section.dataset.kind=stage.kind==='milestone'?'milestone':future;
      section.innerHTML=`<div class="fenix-stage-head"><div><div class="fenix-stage-title">${stage.title}</div><div class="fenix-stage-hint">${hints[stage.key]||''}</div></div><span class="fenix-count">${list.length}</span></div><div class="fenix-cardlist"></div>`;
      const listBox=section.querySelector('.fenix-cardlist');
      if(list.length){
        list.forEach(card=>listBox.appendChild(card));
      }else if(stage.key==='aceita'){
        listBox.innerHTML='<div class="fenix-milestone-note">O aceite é um marco automático. Após o aceite, a oportunidade corrente segue para CFO; o card recebe a indicação “aceite registrado”.</div>';
      }else{
        listBox.innerHTML='<div class="fenix-empty">Nenhum cliente nesta etapa.</div>';
      }
      row.appendChild(section);
    });

    oldRow.replaceWith(row);
    box.dataset.pipelineV2='1';
    const sub=box.querySelector('.fenix-pipeline-sub');
    if(sub)sub.textContent='Pipeline canônico FÊNIX: Lead → Dados recebidos → Análise → Proposta → Enviada → Aceita → CFO → Contrato → Assinatura → Implantação. Etapas críticas permanecem automáticas.';
    const note=box.querySelector('.fenix-rule-note');
    if(note)note.innerHTML='<b>Governança:</b> a visualização usa 10 etapas canônicas. “Aceita” é um marco; após o aceite, o estado corrente segue para CFO. Avanços críticos continuam controlados pelas APIs; Encerrar/Reabrir permanece por botão com confirmação.'+(closed.length?` ${closed.length} oportunidade(s) encerrada(s) permanecem fora do funil ativo.`:'');
  }

  waitForDashboard();
})();
