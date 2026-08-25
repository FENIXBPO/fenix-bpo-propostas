(function(){
  function apply(){
    const product=document.querySelector('.fenix-product-name');
    if(product){
      product.textContent='Proposta Comercial';
      product.style.color='#c8cbd1';
    }
    const flow=document.querySelector('.fenix-top-copy small');
    if(flow){
      flow.style.color='#bfc3ca';
      flow.style.opacity='0.96';
    }
    document.title='FENIX Intelligent BPO | Proposta Comercial';
  }

  function run(){
    apply();
    [250,800,1550,2200].forEach(ms=>setTimeout(apply,ms));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
