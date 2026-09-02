(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  function wait(){
    const box=document.getElementById('fenix-internal-dashboard');
    if(!box||box.dataset.pipelineV4!=='1')return setTimeout(wait,120);
    if(box.dataset.pipelineV5==='1')return;
    apply(box);
  }

  function apply(box){
    injectStyles();
    reinforceBrand(box);
    box.dataset.pipelineV5='1';
  }

  function injectStyles(){
    if(document.getElementById('fenix-pipeline-v5-theme'))return;
    const s=document.createElement('style');
    s.id='fenix-pipeline-v5-theme';
    s.textContent=`
      :root{--fenix-blue:#14295f;--fenix-blue-2:#1f4b99;--fenix-white:#f7f7f4;--fenix-yellow:#f2c340;--fenix-gold:#c99522}
      #fenix-internal-dashboard[data-pipeline-v5="1"]{font-size:15px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-head{display:grid!important;grid-template-columns:1fr!important;gap:18px!important;align-items:start!important;padding-bottom:22px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-head>div:first-child{min-width:0!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-actions{justify-content:flex-start!important;gap:12px!important;margin-top:2px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-action{font-size:14px!important;min-height:46px!important;padding:11px 16px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-action.primary{background:var(--fenix-blue)!important;color:var(--fenix-white)!important;border:1px solid #254d99!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-brand-row{display:flex;align-items:center;min-height:86px;margin-bottom:10px}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-brand-row img{display:block;width:min(360px,70vw);height:auto;max-height:86px;object-fit:contain;object-position:left center}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-logo{display:none!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-title{font-size:34px!important;line-height:1.12!important;color:var(--fenix-yellow)!important;letter-spacing:.045em!important;margin-top:0!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-sub{font-size:17px!important;line-height:1.6!important;color:#e8e8e3!important;max-width:1050px!important;margin-top:8px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-metrics-grid{gap:14px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-metric{padding:18px 19px!important;border-color:#314369!important;background:linear-gradient(180deg,#10182b,#0b0d13)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-metric span{font-size:13px!important;color:#e4e7ef!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-metric strong{font-size:30px!important;color:var(--fenix-yellow)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-toolbar input,#fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-toolbar select{font-size:15px!important;min-height:49px!important;border-color:#304779!important;background:#0b1020!important;color:var(--fenix-white)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage{padding:18px!important;border-color:#29354f!important;background:#090b10!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage:before{width:6px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="lead"]{--stage-accent:#f1f1ed!important;background:#0b0d11!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="dados_recebidos"]{--stage-accent:#2f66c3!important;background:#0b1020!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="analise"]{--stage-accent:#f2c340!important;background:#121006!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="proposta"]{--stage-accent:#d5a62b!important;background:#120f07!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="enviada"]{--stage-accent:#3c7be0!important;background:#0a1020!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="cfo"]{--stage-accent:#ffffff!important;background:#0d111a!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="contrato"]{--stage-accent:#e8b935!important;background:#111008!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="assinatura"]{--stage-accent:#2558b1!important;background:#0a0e19!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage[data-stage="implantacao"]{--stage-accent:#72a3ff!important;background:#0a1020!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage-title{font-size:20px!important;line-height:1.25!important;color:var(--fenix-white)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-stage-hint{font-size:14px!important;line-height:1.55!important;color:#c5c9d2!important;margin-top:7px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-count{font-size:13px!important;background:#18213a!important;color:var(--fenix-yellow)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-v3-empty{font-size:14px!important;color:#9ca3b2!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-card-v3{padding:20px!important;border-color:#34415f!important;background:linear-gradient(180deg,#111624,#0b0e15)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-card-v3 .fenix-card-name{font-size:18px!important;line-height:1.35!important;color:var(--fenix-white)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-card-v3 .fenix-card-meta{font-size:13px!important;line-height:1.45!important;color:#adb3c0!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-card-status{font-size:12px!important;padding:6px 9px!important;border-color:#405b91!important;background:#10182a!important;color:#f3d570!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-value span{font-size:12px!important;color:#b8bdc8!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-value strong{font-size:25px!important;color:var(--fenix-yellow)!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-action-panel{background:#0c1324!important;border-color:#2a467d!important;padding:13px!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-action-panel span{font-size:11px!important;color:#e3bd4c!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-action-panel strong{font-size:15px!important;line-height:1.5!important;color:#fff!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-ownership{font-size:13px!important;color:#b5bac5!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-ownership b{color:#fff!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-primary-action{font-size:14px!important;padding:12px 16px!important;background:var(--fenix-yellow)!important;color:#111!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-secondary-link{font-size:13px!important;color:#dce5ff!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-accept-milestone{font-size:15px!important;border-color:#385c9e!important;background:#0b1325!important;color:#e8ebf2!important}
      #fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-accept-milestone strong{color:var(--fenix-yellow)!important}
      .fenix-analysis-modal{background:#080d18!important;border-left-color:#315497!important}
      .fenix-analysis-modal-head{height:82px!important;flex-basis:82px!important;background:#0b1324!important;border-bottom-color:#2c4678!important}
      .fenix-analysis-modal-head strong{font-size:21px!important;color:var(--fenix-yellow)!important}.fenix-analysis-modal-head span{font-size:14px!important;color:#d0d4dd!important}
      .fenix-analysis-modal-body{background:#08101e!important;padding:22px!important}
      .fenix-analysis-modal-body>.card,.fenix-analysis-modal-body>#diagnostico,.fenix-analysis-modal-body>#saida,.fenix-analysis-modal-body>#contratoBox{background:#f7f8fb!important;border:1px solid #d7ddea!important;box-shadow:none!important}
      .fenix-analysis-modal-body .section{font-size:13px!important;color:#132b60!important;border-color:#d9c273!important}
      .fenix-analysis-modal-body .field label{font-size:13px!important;color:#2d3650!important}
      .fenix-analysis-modal-body input,.fenix-analysis-modal-body select,.fenix-analysis-modal-body textarea{font-size:15px!important;min-height:44px!important}
      @media(max-width:900px){#fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-title{font-size:28px!important}#fenix-internal-dashboard[data-pipeline-v5="1"] .fenix-pipeline-sub{font-size:15px!important}}
    `;
    document.head.appendChild(s);
  }

  function reinforceBrand(box){
    const head=box.querySelector('.fenix-pipeline-head>div:first-child');
    if(!head||head.querySelector('.fenix-brand-row'))return;
    const row=document.createElement('div');
    row.className='fenix-brand-row';
    const img=document.createElement('img');
    img.src='/assets/fenix-logo-header-crop.webp';
    img.alt='FÊNIX Intelligent BPO';
    img.decoding='async';
    img.addEventListener('error',()=>{if(!img.dataset.fallback){img.dataset.fallback='1';img.src='/assets/fenix-logo-transparent.webp'}});
    row.appendChild(img);
    const title=head.querySelector('.fenix-pipeline-title');
    head.insertBefore(row,title||head.firstChild);
  }

  wait();
})();
