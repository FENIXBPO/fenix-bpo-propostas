(function(){
  function apply(){
    const top=document.querySelector('.top');
    if(!top)return;

    const nodes=[...top.querySelectorAll('*')];
    nodes.forEach(el=>{
      if(el.childElementCount===0 && /Propostas\s+Comerciais/i.test((el.textContent||'').trim())){
        el.textContent=(el.textContent||'').replace(/Propostas\s+Comerciais/gi,'Proposta Comercial');
        el.classList.add('fenix-product-name');
      }
    });

    const product=top.querySelector('.fenix-product-name');
    if(product){
      product.textContent='Proposta Comercial';
      product.style.color='#c8cbd1';
    }

    const flow=top.querySelector('.fenix-top-copy small') || top.querySelector('small');
    if(flow){
      flow.style.color='#bfc3ca';
      flow.style.opacity='0.96';
    }

    document.title='FENIX Intelligent BPO | Proposta Comercial';
  }

  function run(){
    apply();
    const interval=setInterval(apply,120);
    setTimeout(()=>clearInterval(interval),5000);

    const obs=new MutationObserver(()=>apply());
    obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
    setTimeout(()=>obs.disconnect(),7000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
