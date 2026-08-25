(function(){
  function ensureStyle(){
    let style=document.getElementById('fenix-header-final-style');
    if(style)return style;
    style=document.createElement('style');
    style.id='fenix-header-final-style';
    style.textContent=`
      .top .fenix-product-name{
        font-size:0!important;
        color:transparent!important;
        margin-top:6px!important;
      }
      .top .fenix-product-name::after{
        content:'Proposta Comercial';
        display:block;
        font-size:19px!important;
        font-weight:800!important;
        line-height:1.15!important;
        color:#c8cbd1!important;
      }
      .top .fenix-top-copy small{color:#bfc3ca!important;opacity:.96!important}
      @media(max-width:800px){.top .fenix-product-name::after{font-size:16px!important}}
      @media(max-width:560px){.top .fenix-product-name::after{font-size:15px!important}}
    `;
    document.head.appendChild(style);
    return style;
  }

  function apply(){
    ensureStyle();
    const product=document.querySelector('.fenix-product-name');
    if(product) product.setAttribute('aria-label','Proposta Comercial');
    document.title='FENIX Intelligent BPO | Proposta Comercial';
  }

  function run(){
    apply();
    [100,300,700,1200,1800,3000].forEach(ms=>setTimeout(apply,ms));
    const obs=new MutationObserver(apply);
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>obs.disconnect(),8000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
