(function(){
  function apply(){
    const product=document.querySelector('.fenix-product-name');
    if(product){
      product.textContent='Proposta Comercial';
      product.style.color='#d7d3cb';
    }
    const flow=document.querySelector('.fenix-top-copy small');
    if(flow){
      flow.style.color='#bfc2c9';
      flow.style.opacity='0.95';
    }
  }
  const run=()=>{apply();setTimeout(apply,250);setTimeout(apply,900);};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
