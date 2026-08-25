(function(){
  function ensureStyle(){
    if(document.getElementById('fenix-header-polish')) return;
    const style=document.createElement('style');
    style.id='fenix-header-polish';
    style.textContent=`
      .top{padding:0!important;min-height:128px!important;display:block!important}
      .top .fenix-top-inner{max-width:1100px;margin:0 auto;padding:8px 22px;min-height:128px;display:flex!important;align-items:center!important;gap:22px!important}
      .top .fenix-mark{width:148px;height:112px;overflow:hidden;position:relative;flex:0 0 148px;display:block}
      .top .fenix-mark .fenix-top-logo{position:absolute!important;width:600px!important;max-width:none!important;height:auto!important;max-height:none!important;left:-66px!important;top:-120px!important;object-fit:contain!important;display:block!important;filter:none!important;border-radius:0!important}
      .top .fenix-top-copy{margin:0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;min-width:0}
      .top .fenix-brand-name{font-size:25px!important;font-weight:900!important;line-height:1!important;letter-spacing:1.1px!important;color:#fff!important}
      .top .fenix-product-name{font-size:18px;font-weight:800;line-height:1.15;color:#e5bd4f;margin-top:7px}
      .top .fenix-top-copy small{font-size:13px!important;line-height:1.35!important;margin-top:7px!important;opacity:.88!important;color:#e7e7ea!important}
      @media(max-width:800px){
        .top{min-height:108px!important}
        .top .fenix-top-inner{min-height:108px;padding:7px 16px;gap:14px!important}
        .top .fenix-mark{width:118px;height:92px;flex-basis:118px}
        .top .fenix-mark .fenix-top-logo{width:500px!important;left:-56px!important;top:-101px!important}
        .top .fenix-brand-name{font-size:20px!important}.top .fenix-product-name{font-size:15px;margin-top:5px}
        .top .fenix-top-copy small{font-size:11px!important;margin-top:5px!important}
      }
      @media(max-width:560px){
        .top .fenix-top-inner{flex-direction:column!important;align-items:center!important;text-align:center;gap:2px!important;padding:8px 14px 10px}
        .top .fenix-mark{width:128px;height:100px;flex-basis:100px}
        .top .fenix-mark .fenix-top-logo{width:530px!important;left:-59px!important;top:-107px!important}
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
    if(!logo || !copy) return;

    copy.innerHTML='<strong class="fenix-brand-name">FÊNIX BPO</strong><span class="fenix-product-name">Propostas Comerciais</span><small>Cadastro → Entendimento da operação → Análise Fênix → Proposta</small>';

    let inner=top.querySelector('.fenix-top-inner');
    if(!inner){
      inner=document.createElement('div');
      inner.className='fenix-top-inner';
      const mark=document.createElement('div');
      mark.className='fenix-mark';
      logo.remove();
      copy.remove();
      mark.appendChild(logo);
      top.innerHTML='';
      inner.appendChild(mark);
      inner.appendChild(copy);
      top.appendChild(inner);
    } else if(!inner.querySelector('.fenix-mark')){
      const mark=document.createElement('div');
      mark.className='fenix-mark';
      logo.remove();
      mark.appendChild(logo);
      inner.insertBefore(mark,inner.firstChild);
    }
  }

  const run=()=>{applyHeaderPolish();setTimeout(applyHeaderPolish,150);setTimeout(applyHeaderPolish,700);setTimeout(applyHeaderPolish,1400)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();
})();
