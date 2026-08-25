(function(){
  function ensureStyle(){
    if(document.getElementById('fenix-header-polish')) return;
    const style=document.createElement('style');
    style.id='fenix-header-polish';
    style.textContent=`
      .top{padding:0!important;min-height:120px!important;display:block!important}
      .top .fenix-top-inner{max-width:1100px;margin:0 auto;padding:10px 22px;min-height:120px;display:flex!important;align-items:center!important;gap:24px!important}
      .top .fenix-top-logo{width:390px!important;height:102px!important;object-fit:cover!important;object-position:50% 46%!important;display:block!important;flex:0 0 auto!important;border-radius:8px}
      .top .fenix-top-copy{margin:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;min-width:0}
      .top .fenix-top-copy strong{font-size:21px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:.1px!important;color:#fff!important}
      .top .fenix-top-copy small{font-size:13px!important;line-height:1.35!important;margin-top:6px!important;opacity:.88!important;color:#e7e7ea!important}
      @media(max-width:800px){
        .top{min-height:102px!important}
        .top .fenix-top-inner{min-height:102px;padding:8px 16px;gap:14px!important}
        .top .fenix-top-logo{width:270px!important;height:78px!important}
        .top .fenix-top-copy strong{font-size:16px!important}
        .top .fenix-top-copy small{font-size:11px!important;margin-top:4px!important}
      }
      @media(max-width:560px){
        .top .fenix-top-inner{flex-direction:column!important;align-items:center!important;text-align:center;gap:4px!important;padding:8px 14px 10px}
        .top .fenix-top-logo{width:300px!important;max-width:100%!important;height:84px!important}
        .top .fenix-top-copy{align-items:center!important}
      }
    `;
    document.head.appendChild(style);
  }

  function applyHeaderPolish(){
    ensureStyle();
    const top=document.querySelector('.top');
    if(!top) return;
    const logo=top.querySelector('.fenix-top-logo');
    const copy=top.querySelector('.fenix-top-copy');
    if(!logo || !copy) return;

    copy.innerHTML='<strong>Propostas Comerciais</strong><small>Cadastro → Entendimento da operação → Análise Fênix → Proposta</small>';

    let inner=top.querySelector('.fenix-top-inner');
    if(!inner){
      inner=document.createElement('div');
      inner.className='fenix-top-inner';
      logo.remove();
      copy.remove();
      top.innerHTML='';
      inner.appendChild(logo);
      inner.appendChild(copy);
      top.appendChild(inner);
    }
  }

  const run=()=>{applyHeaderPolish();setTimeout(applyHeaderPolish,150);setTimeout(applyHeaderPolish,700);setTimeout(applyHeaderPolish,1400)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();
})();
