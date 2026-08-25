(function(){
  function apply(){
    const product=document.querySelector('.fenix-product-name');
    if(product){
      product.textContent='Proposta Comercial';
      product.style.color='#c7c9ce';
    }
    const flow=document.querySelector('.fenix-top-copy small');
    if(flow){
      flow.style.color='#b8bcc4';
      flow.style.opacity='0.95';
    }
  }
  function run(){
    apply();
    [250,900,1600,2400].forEach(ms=>setTimeout(apply,ms));
    const obs=new MutationObserver(apply);
    obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
    setTimeout(()=>obs.disconnect(),5000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
