(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  function wait(){
    const box=document.getElementById('fenix-internal-dashboard');
    if(!box||box.dataset.pipelineV3!=='1')return setTimeout(wait,120);
    if(box.dataset.pipelineV4==='1')return;
    apply(box);
  }

  function apply(box){
    injectStyles();
    installOfficialLogo(box);
    installModalBehavior(box);
    box.dataset.pipelineV4='1';
  }

  function injectStyles(){
    if(document.getElementById('fenix-pipeline-v4-theme'))return;
    const s=document.createElement('style');
    s.id='fenix-pipeline-v4-theme';
    s.textContent=`
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-pipeline-logo{width:290px!important;height:auto!important;background:none!important;display:flex;align-items:center;margin-bottom:8px}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-pipeline-logo img{display:block;max-width:100%;height:auto;max-height:82px;object-fit:contain;object-position:left center}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-pipeline-title{font-size:29px!important;line-height:1.15!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-pipeline-sub{font-size:15px!important;line-height:1.55!important;max-width:900px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-metric span{font-size:12px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-metric strong{font-size:27px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-toolbar input,
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-toolbar select{font-size:14px!important;min-height:46px!important;padding:11px 13px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage{position:relative;overflow:hidden;border-color:#3a3329!important;padding:15px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--stage-accent,#b68a35);opacity:.95}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="lead"]{--stage-accent:#8f8678;background:#0c0c0b}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="dados_recebidos"]{--stage-accent:#c6a15a;background:#0d0c09}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="analise"]{--stage-accent:#d7892d;background:#100d08}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="proposta"]{--stage-accent:#e0b84e;background:#100e08}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="enviada"]{--stage-accent:#a58b4d;background:#0e0d09}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="cfo"]{--stage-accent:#d26d2b;background:#100b08}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="contrato"]{--stage-accent:#c38f49;background:#0f0c09}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="assinatura"]{--stage-accent:#a77a52;background:#0e0c0a}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage[data-stage="implantacao"]{--stage-accent:#6f9a67;background:#0a0e0a}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage-title{font-size:17px!important;line-height:1.25!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-stage-hint{font-size:12px!important;line-height:1.5!important;margin-top:5px!important;color:#aaa399!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-count{font-size:12px!important;min-width:29px!important;height:29px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-v3-empty{font-size:12px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-card-v3{padding:17px!important;border-radius:14px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-card-v3 .fenix-card-name{font-size:16px!important;line-height:1.32!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-card-v3 .fenix-card-meta{font-size:11px!important;margin-top:7px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-card-status{font-size:10px!important;padding:5px 8px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-value span{font-size:10px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-value strong{font-size:22px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-action-panel span{font-size:9px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-action-panel strong{font-size:13px!important;line-height:1.45!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-ownership{font-size:11px!important;gap:14px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-primary-action{font-size:12px!important;padding:11px 14px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-secondary-link{font-size:11px!important}
      #fenix-internal-dashboard[data-pipeline-v4="1"] .fenix-accept-milestone{font-size:13px!important;padding:13px 16px!important}
      .fenix-analysis-modal-backdrop{position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,.76);backdrop-filter:blur(4px);display:flex;justify-content:flex-end}
      .fenix-analysis-modal{width:min(920px,94vw);height:100vh;background:#080808;border-left:1px solid #705321;box-shadow:-20px 0 60px rgba(0,0,0,.55);display:flex;flex-direction:column;color:#f5f1e8}
      .fenix-analysis-modal-head{height:72px;flex:0 0 72px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 22px;border-bottom:1px solid #3e3017;background:#0b0a08}
      .fenix-analysis-modal-head strong{font-size:18px;color:#f1c04d}.fenix-analysis-modal-head span{font-size:12px;color:#9e9689}
      .fenix-analysis-modal-close{width:38px;height:38px;border-radius:10px;border:1px solid #55452c;background:#111;color:#eee;font-size:22px;cursor:pointer}
      .fenix-analysis-modal-body{flex:1;overflow:auto;padding:20px;background:#070707}
      .fenix-analysis-modal-body>.card,.fenix-analysis-modal-body>#diagnostico,.fenix-analysis-modal-body>#saida,.fenix-analysis-modal-body>#contratoBox{display:block!important;max-width:none!important;margin:0 0 14px!important}
      body.fenix-modal-open{overflow:hidden!important}
      @media(max-width:700px){.fenix-analysis-modal{width:100vw}.fenix-analysis-modal-head{padding:0 14px}.fenix-analysis-modal-body{padding:12px}}
    `;
    document.head.appendChild(s);
  }

  function installOfficialLogo(box){
    const slot=box.querySelector('.fenix-pipeline-logo');
    if(!slot)return;
    slot.innerHTML='';
    const img=document.createElement('img');
    img.src='/assets/fenix-logo-header-crop.webp';
    img.alt='FÊNIX Intelligent BPO';
    img.decoding='async';
    img.addEventListener('error',()=>{if(!img.dataset.fallback){img.dataset.fallback='1';img.src='/assets/fenix-logo-transparent.webp'}});
    slot.appendChild(img);
  }

  function installModalBehavior(box){
    box.addEventListener('click',e=>{
      const btn=e.target.closest('[data-kanban-open]');
      if(!btn)return;
      const y=window.scrollY;
      setTimeout(()=>openModal(y),90);
    });
  }

  function openModal(previousY){
    if(document.querySelector('.fenix-analysis-modal-backdrop'))return;
    const dashboard=document.getElementById('fenix-internal-dashboard');
    const candidates=[...document.querySelectorAll('.wrap > .card, .wrap > #diagnostico, .wrap > #saida, .wrap > #contratoBox')]
      .filter(el=>el!==dashboard&&getComputedStyle(el).display!=='none');
    if(!candidates.length){window.scrollTo({top:previousY,behavior:'instant'});return}

    const backdrop=document.createElement('div');
    backdrop.className='fenix-analysis-modal-backdrop';
    backdrop.innerHTML='<section class="fenix-analysis-modal" role="dialog" aria-modal="true" aria-label="Análise da oportunidade"><header class="fenix-analysis-modal-head"><div><strong>Análise da oportunidade</strong><br><span>Feche para voltar ao Pipeline sem perder sua posição.</span></div><button type="button" class="fenix-analysis-modal-close" aria-label="Fechar">×</button></header><div class="fenix-analysis-modal-body"></div></section>';
    const body=backdrop.querySelector('.fenix-analysis-modal-body');
    const moved=[];
    candidates.forEach(el=>{const marker=document.createComment('fenix-modal-origin');el.parentNode.insertBefore(marker,el);moved.push({el,marker});body.appendChild(el)});
    const close=()=>{
      moved.forEach(({el,marker})=>{marker.parentNode.insertBefore(el,marker);marker.remove();el.style.display='none'});
      backdrop.remove();document.body.classList.remove('fenix-modal-open');window.scrollTo({top:previousY,behavior:'instant'});
    };
    backdrop.querySelector('.fenix-analysis-modal-close').addEventListener('click',close);
    backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
    document.addEventListener('keydown',function esc(ev){if(ev.key==='Escape'){document.removeEventListener('keydown',esc);close()}},{once:true});
    document.body.appendChild(backdrop);document.body.classList.add('fenix-modal-open');window.scrollTo({top:previousY,behavior:'instant'});
  }

  wait();
})();
