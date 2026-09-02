(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  const LEGACY_LABEL_TO_STATUS={
    'Recebido':'recebido',
    'Rascunho CFO':'em_analise_cfo',
    'Aprovada CFO':'aprovada_cfo',
    'Publicada':'publicada',
    'Enviada':'enviada_cliente',
    'Aceita · aguardando CFO':'proposta_aceita_aguardando_cfo',
    'Contrato autorizado':'contrato_autorizado',
    'Encerrado':'encerrado'
  };

  const NEXT_ACTION={
    lead:'Enviar link da coleta',
    dados_recebidos:'Iniciar análise',
    analise:'Concluir análise e precificação',
    proposta:'Enviar proposta ao cliente',
    enviada:'Acompanhar retorno do cliente',
    aceita:'Aceite registrado',
    cfo:'Validar aceite e liberar contrato',
    contrato:'Gerar / revisar contrato',
    assinatura:'Acompanhar assinatura',
    implantacao:'Conduzir kickoff e implantação'
  };

  function ensureStyles(){
    if(document.getElementById('fenix-pipeline-v2-theme'))return;
    const style=document.createElement('style');
    style.id='fenix-pipeline-v2-theme';
    style.textContent=`
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-row{grid-template-columns:repeat(5,minmax(0,1fr))!important;overflow:visible!important;align-items:start}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage{min-height:285px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage[data-stage="aceita"]{border-style:dashed;background:#100e09;min-height:190px;align-self:start}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage[data-kind="future"]{opacity:.9}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-hint{min-height:44px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-milestone-note{font-size:10px;line-height:1.45;color:#a79d8d;padding:10px 3px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-card{cursor:default}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-card.accepted:before{content:'✓ aceite registrado';display:inline-block;margin-bottom:8px;padding:4px 7px;border:1px solid #6c5729;border-radius:999px;color:#f0c95f;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.05em}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-next-action{margin-top:10px;padding:8px 9px;border-radius:9px;background:#12100b;border:1px solid #342a18;color:#d8c89f;font-size:10px;line-height:1.35}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-next-action b{display:block;color:#f1c04d;font-size:9px;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-send-client{border:0;background:linear-gradient(180deg,#f1c04d,#b97810);color:#111;border-radius:9px;padding:9px 11px;font-size:11px;font-weight:900;cursor:pointer}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-secondary{position:relative;margin-left:auto}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-secondary summary{list-style:none;border:1px solid #4a4134;background:#111;color:#cfc6b7;border-radius:9px;padding:8px 11px;font-size:15px;font-weight:900;cursor:pointer;line-height:1}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-secondary summary::-webkit-details-marker{display:none}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-secondary-menu{position:absolute;right:0;top:36px;z-index:20;min-width:120px;padding:7px;background:#0d0d0c;border:1px solid #4a4134;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.45)}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-secondary-menu .fenix-card-btn{width:100%;text-align:left}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-channel-preview{margin-top:8px;font-size:9px;color:#998f7f;line-height:1.4}
      #fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-channel-preview span{display:inline-block;margin-right:8px;color:#d9c17c}
      @media(max-width:1180px){#fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-row{grid-template-columns:repeat(2,minmax(260px,1fr))!important}}
      @media(max-width:700px){#fenix-internal-dashboard[data-pipeline-v2="1"] .fenix-stage-row{grid-template-columns:1fr!important}}
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

  function enhanceCard(card,stage,status){
    card.draggable=false;
    card.removeAttribute('draggable');
    if(status==='proposta_aceita_aguardando_cfo')card.classList.add('accepted');

    if(!card.querySelector('.fenix-next-action')){
      const action=document.createElement('div');
      action.className='fenix-next-action';
      action.innerHTML=`<b>Próxima ação</b>${NEXT_ACTION[stage]||'Acompanhar oportunidade'}`;
      const actions=card.querySelector('.fenix-card-actions');
      if(actions)card.insertBefore(action,actions);else card.appendChild(action);
    }

    const actions=card.querySelector('.fenix-card-actions');
    if(!actions)return;

    const mainButton=actions.querySelector('[data-kanban-open]');
    if(mainButton&&stage==='dados_recebidos')mainButton.textContent='Iniciar análise';
    if(mainButton&&stage==='analise')mainButton.textContent='Continuar análise';
    if(mainButton&&stage==='cfo')mainButton.textContent='Validar aceite';

    const closeButton=actions.querySelector('.fenix-card-btn.close');
    if(closeButton&&!actions.querySelector('.fenix-secondary')){
      const details=document.createElement('details');
      details.className='fenix-secondary';
      details.innerHTML='<summary aria-label="Mais ações">⋯</summary><div class="fenix-secondary-menu"></div>';
      details.querySelector('.fenix-secondary-menu').appendChild(closeButton);
      actions.appendChild(details);
    }

    if(stage==='proposta'&&status==='publicada'&&!actions.querySelector('.fenix-send-client')){
      const send=document.createElement('button');
      send.type='button';
      send.className='fenix-send-client';
      send.textContent='Enviar ao cliente';
      send.addEventListener('click',()=>alert('Homologação: este botão enviará a proposta por WhatsApp e e-mail após sua aprovação e integração dos canais. Nenhuma mensagem foi enviada agora.'));
      actions.insertBefore(send,actions.firstChild);
      const channels=document.createElement('div');
      channels.className='fenix-channel-preview';
      channels.innerHTML='<span>WhatsApp ○</span><span>E-mail ○</span>Envio ainda não executado';
      card.appendChild(channels);
    }
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
      const status=cardStatus(card);
      if(status==='encerrado'){closed.push(card);return}
      const stage=model.stageOf(status);
      enhanceCard(card,stage,status);
      (buckets.get(stage)||buckets.get('dados_recebidos')).push(card);
    });

    const hints={
      lead:'Contato identificado antes do envio do formulário',
      dados_recebidos:'Cliente enviou a coleta de dados',
      analise:'Diagnóstico, escopo e precificação em construção',
      proposta:'Proposta pronta/publicada internamente, ainda não enviada',
      enviada:'WhatsApp e e-mail enviados e registrados',
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
      const future=['lead','enviada','assinatura','implantacao'].includes(stage.key)?'future':'';
      const section=document.createElement('section');
      section.className='fenix-stage';
      section.dataset.stage=stage.key;
      section.dataset.kind=stage.kind==='milestone'?'milestone':future;
      section.innerHTML=`<div class="fenix-stage-head"><div><div class="fenix-stage-title">${stage.title}</div><div class="fenix-stage-hint">${hints[stage.key]||''}</div></div><span class="fenix-count">${list.length}</span></div><div class="fenix-cardlist"></div>`;
      const listBox=section.querySelector('.fenix-cardlist');
      if(list.length){
        list.forEach(card=>listBox.appendChild(card));
      }else if(stage.key==='aceita'){
        listBox.innerHTML='<div class="fenix-milestone-note">✓ Marco automático. O aceite fica registrado com data/hora e a oportunidade segue para CFO.</div>';
      }else{
        listBox.innerHTML='<div class="fenix-empty">Nenhum cliente nesta etapa.</div>';
      }
      row.appendChild(section);
    });

    oldRow.replaceWith(row);
    box.dataset.pipelineV2='1';
    const sub=box.querySelector('.fenix-pipeline-sub');
    if(sub)sub.textContent='Pipeline canônico FÊNIX em duas linhas: proposta publicada não significa enviada. Envio ao cliente será registrado por WhatsApp + e-mail antes da mudança para Enviada.';
    const note=box.querySelector('.fenix-rule-note');
    if(note)note.innerHTML='<b>Governança:</b> Publicada permanece em Proposta. Somente um envio efetivo e registrado muda para Enviada. “Aceita” é um marco automático; depois segue para CFO. O disparo WhatsApp/e-mail está apenas simulado nesta homologação.'+(closed.length?` ${closed.length} oportunidade(s) encerrada(s) permanecem fora do funil ativo.`:'');
  }

  waitForDashboard();
})();
