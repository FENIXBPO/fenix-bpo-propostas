(function(){
  function applyHeaderPolish(){
    if(document.getElementById('fenix-header-polish')) return;
    const style=document.createElement('style');
    style.id='fenix-header-polish';
    style.textContent=`
      .top{padding:0!important;min-height:116px!important;display:block!important}
      .top .fenix-top-inner{max-width:1100px;margin:0 auto;padding:10px 22px;min-height:116px;display:flex;align-items:center;gap:20px}
      .top .fenix-top-logo{width:340px!important;max-height:94px!important;object-fit:contain!important;object-position:left center!important;flex:0 0 auto!important}
      .top .fenix-top-copy{margin:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
      .top .fenix-top-copy strong{font-size:20px!important;font-weight:800!important;line-height:1.15!important;letter-spacing:.1px!important}
      .top .fenix-top-copy small{font-size:13px!important;line-height:1.35!important;margin-top:6px!important;opacity:.88!important}
      @media(max-width:800px){
        .top{min-height:96px!important}
        .top .fenix-top-inner{min-height:96px;padding:8px 14px;gap:12px}
        .top .fenix-top-logo{width:240px!important;max-height:76px!important}
        .top .fenix-top-copy strong{font-size:16px!important}
        .top .fenix-top-copy small{font-size:11px!important;margin-top:4px!important}
      }
      @media(max-width:560px){
        .top .fenix-top-inner{flex-direction:column;align-items:flex-start;gap:4px;padding:8px 14px 10px}
        .top .fenix-top-logo{width:260px!important;max-width:100%!important;max-height:78px!important}
      }
    `;
    document.head.appendChild(style);

    const top=document.querySelector('.top');
    if(!top) return;
    let logo=top.querySelector('.fenix-top-logo');
    let copy=top.querySelector('.fenix-top-copy');
    if(!logo || !copy) return;
    copy.innerHTML='<strong>Propostas Comerciais</strong><small>Cadastro → Entendimento da operação → Análise Fênix → Proposta</small>';
    let inner=top.querySelector('.fenix-top-inner');
    if(!inner){
      inner=document.createElement('div');
      inner.className='fenix-top-inner';
      top.innerHTML='';
      inner.appendChild(logo);
      inner.appendChild(copy);
      top.appendChild(inner);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{setTimeout(applyHeaderPolish,50);setTimeout(applyHeaderPolish,500)});
  else {setTimeout(applyHeaderPolish,50);setTimeout(applyHeaderPolish,500)}
})();
