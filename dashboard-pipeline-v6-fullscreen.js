(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  function install(){
    if(document.getElementById('fenix-pipeline-v6-fullscreen'))return;
    const style=document.createElement('style');
    style.id='fenix-pipeline-v6-fullscreen';
    style.textContent=`
      .fenix-analysis-modal-backdrop{align-items:stretch!important;justify-content:stretch!important;background:#050505!important;backdrop-filter:none!important}
      .fenix-analysis-modal{width:100vw!important;max-width:none!important;height:100vh!important;border-left:0!important;box-shadow:none!important;background:#070707!important}
      .fenix-analysis-modal-head{height:78px!important;flex-basis:78px!important;padding:0 28px!important;background:#0a1428!important;border-bottom:1px solid #d9a824!important;position:sticky!important;top:0!important;z-index:4!important}
      .fenix-analysis-modal-head strong{font-size:20px!important;color:#f2c94c!important}
      .fenix-analysis-modal-head span{font-size:13px!important;color:#ffffff!important;opacity:.84}
      .fenix-analysis-modal-close{width:auto!important;min-width:170px!important;height:42px!important;padding:0 16px!important;border-radius:10px!important;border:1px solid #d9a824!important;background:#0d1b36!important;color:#fff!important;font-size:13px!important;font-weight:800!important}
      .fenix-analysis-modal-body{padding:24px!important;background:#07101f!important;overflow:auto!important}
      .fenix-analysis-modal-body>.card,.fenix-analysis-modal-body>#diagnostico,.fenix-analysis-modal-body>#saida,.fenix-analysis-modal-body>#contratoBox{max-width:1480px!important;margin:0 auto 18px!important;border-radius:16px!important}
      .fenix-analysis-modal-body .card{font-size:15px!important}
      .fenix-analysis-modal-body .field label{font-size:13px!important;color:#23324d!important}
      .fenix-analysis-modal-body .field input,.fenix-analysis-modal-body .field select,.fenix-analysis-modal-body .field textarea{font-size:15px!important;padding:12px!important}
      .fenix-analysis-modal-body .section{font-size:13px!important;letter-spacing:.08em!important}
      @media(max-width:700px){.fenix-analysis-modal-head{padding:0 14px!important}.fenix-analysis-modal-close{min-width:120px!important;font-size:12px!important}.fenix-analysis-modal-body{padding:12px!important}}
    `;
    document.head.appendChild(style);

    const observer=new MutationObserver(()=>{
      const modal=document.querySelector('.fenix-analysis-modal');
      if(!modal)return;
      const btn=modal.querySelector('.fenix-analysis-modal-close');
      const hint=modal.querySelector('.fenix-analysis-modal-head span');
      if(btn)btn.textContent='← Voltar ao Pipeline';
      if(hint)hint.textContent='Análise em tela cheia. Volte ao Pipeline sem perder sua posição.';
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
