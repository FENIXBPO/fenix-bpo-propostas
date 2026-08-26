(function(){
  const HEADER_HTML = `
    <div class="fenix-header-inner">
      <img class="fenix-header-symbol" src="assets/fenix-symbol.png" alt="Fênix Intelligent BPO">
      <div class="fenix-header-copy">
        <div class="fenix-header-brand">FENIX INTELLIGENT BPO</div>
        <div class="fenix-header-product">Proposta Comercial</div>
        <div class="fenix-header-flow">Cadastro → Entendimento da operação → Análise Fênix → Proposta</div>
      </div>
    </div>`;

  function ensureStyle(){
    if(document.getElementById('fenix-header-lock-style')) return;
    const style=document.createElement('style');
    style.id='fenix-header-lock-style';
    style.textContent=`
      .top{
        background:linear-gradient(135deg,#06070d 0%,#111428 58%,#181d36 100%)!important;
        border-bottom:3px solid #c5a343!important;
        min-height:154px!important;
        padding:0!important;
        display:block!important;
      }
      .fenix-header-inner{
        max-width:1320px;
        min-height:154px;
        margin:0 auto;
        padding:14px 42px;
        display:flex;
        align-items:center;
        gap:24px;
      }
      .fenix-header-symbol{
        width:122px;
        height:122px;
        object-fit:contain;
        flex:0 0 122px;
        display:block;
      }
      .fenix-header-copy{
        display:flex;
        flex-direction:column;
        justify-content:center;
        min-width:0;
      }
      .fenix-header-brand{
        color:#e8b63f;
        font-size:30px;
        line-height:1.05;
        font-weight:900;
        letter-spacing:1.2px;
      }
      .fenix-header-product{
        color:#c8cbd1;
        font-size:24px;
        line-height:1.12;
        font-weight:850;
        margin-top:8px;
      }
      .fenix-header-flow{
        color:#b8bcc4;
        font-size:15px;
        line-height:1.35;
        margin-top:8px;
      }
      @media(max-width:800px){
        .top{min-height:auto!important}
        .fenix-header-inner{
          min-height:auto;
          padding:16px 18px 18px;
          flex-direction:column;
          justify-content:center;
          text-align:center;
          gap:8px;
        }
        .fenix-header-symbol{
          width:92px;
          height:92px;
          flex-basis:92px;
        }
        .fenix-header-brand{font-size:22px;letter-spacing:.8px}
        .fenix-header-product{font-size:19px;margin-top:5px}
        .fenix-header-flow{font-size:12px;margin-top:7px;max-width:360px}
      }
      @media(max-width:420px){
        .fenix-header-inner{padding-left:12px;padding-right:12px}
        .fenix-header-symbol{width:80px;height:80px;flex-basis:80px}
        .fenix-header-brand{font-size:19px}
        .fenix-header-product{font-size:17px}
        .fenix-header-flow{font-size:11px}
      }
      @media print{.top{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function apply(){
    const top=document.querySelector('.top');
    if(!top) return;
    ensureStyle();
    if(!top.querySelector('.fenix-header-inner') || top.querySelector('.fenix-header-brand')?.textContent!=='FENIX INTELLIGENT BPO'){
      top.innerHTML=HEADER_HTML;
    }
    document.title='Fênix Intelligent BPO | Proposta Comercial';
  }

  function init(){
    apply();
    const observer=new MutationObserver(()=>apply());
    observer.observe(document.body,{childList:true,subtree:true});
    window.__fenixHeaderLockObserver=observer;
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
