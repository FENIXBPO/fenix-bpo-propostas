(function(){
  function ensureStyle(){
    if(document.getElementById('fenix-header-polish')) return;
    const style=document.createElement('style');
    style.id='fenix-header-polish';
    style.textContent=`
      .top{padding:0!important;min-height:128px!important;display:block!important}
      .top .fenix-top-inner{max-width:1100px;margin:0 auto;padding:10px 22px;min-height:128px;display:flex!important;align-items:center!important;gap:22px!important}
      .top .fenix-mark{width:156px;height:112px;flex:0 0 156px;display:block;background-image:url('assets/fenix-logo-transparent.webp');background-repeat:no-repeat;background-size:488px auto;background-position:-51px -95px;border-radius:0}
      .top .fenix-mark .fenix-top-logo{display:none!important}
      .top .fenix-top-copy{margin:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;min-width:0}
      .top .fenix-brand-name{font-size:24px!important;font-weight:900!important;line-height:1.05!important;letter-spacing:1px!important;color:#e5bd4f!important}
      .top .fenix-product-name{font-size:19px;font-weight:800;line-height:1.15;color:#fff;margin-top:7px}
      .top .fenix-top-copy small{font-size:13px!important;line-height:1.35!important;margin-top:7px!important;opacity:.88!important;color:#e7e7ea!important}
      @media(max-width:800px){
        .top{min-height:108px!important}
        .top .fenix-top-inner{min-height:108px;padding:8px 16px;gap:14px!important}
        .top .fenix-mark{width:126px;height:92px;flex-basis:126px;background-size:402px auto;background-position:-42px -78px}
        .top .fenix-brand-name{font-size:20px!important}.top .fenix-product-name{font-size:15px;margin-top:5px}
        .top .fenix-top-copy small{font-size:11px!important;margin-top:5px!important}
      }
      @media(max-width:560px){
        .top .fenix-top-inner{flex-direction:column!important;align-items:center!important;text-align:center;gap:3px!important;padding:8px 14px 10px}
        .top .fenix-mark{width:138px;height:98px;flex-basis:98px;background-size:430px auto;background-position:-45px -84px}
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
    let copy=top.querySelector('.fenix-top-copy');
    if(!copy) return;

    copy.innerHTML='<strong class="fenix-brand-name">FENIX INTELLIGENT BPO</strong><span class="fenix-product-name">Propostas Comerciais</span><small>Cadastro → Entendimento da operação → Análise Fênix → Proposta</small>';

    let inner=top.querySelector('.fenix-top-inner');
    if(!inner){
      inner=document.createElement('div');
      inner.className='fenix-top-inner';
      const mark=document.createElement('div');
      mark.className='fenix-mark';
      if(logo){logo.remove();mark.appendChild(logo)}
      copy.remove();
      top.innerHTML='';
      inner.appendChild(mark);
      inner.appendChild(copy);
      top.appendChild(inner);
    } else if(!inner.querySelector('.fenix-mark')){
      const mark=document.createElement('div');
      mark.className='fenix-mark';
      if(logo){logo.remove();mark.appendChild(logo)}
      inner.insertBefore(mark,inner.firstChild);
    }
  }

  const run=()=>{applyHeaderPolish();setTimeout(applyHeaderPolish,150);setTimeout(applyHeaderPolish,700);setTimeout(applyHeaderPolish,1400)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();
})();
