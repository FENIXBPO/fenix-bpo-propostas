(function(){
  function apply(){
    const top=document.querySelector('.top');
    if(!top)return;

    let product=document.querySelector('.fenix-product-name');
    if(!product){
      const candidates=[...top.querySelectorAll('strong,span,div,h1,h2,h3,p')];
      product=candidates.find(el=>/Propostas\s+Comerciais/i.test((el.textContent||'').trim()));
    }

    if(product){
      if(product.childElementCount===0){
        product.textContent=(product.textContent||'').replace(/Propostas\s+Comerciais/gi,'Proposta Comercial');
      }else{
        const walker=document.createTreeWalker(product,NodeFilter.SHOW_TEXT);
        while(walker.nextNode()){
          const node=walker.currentNode;
          if(/Propostas\s+Comerciais/i.test(node.nodeValue||'')){
            node.nodeValue=(node.nodeValue||'').replace(/Propostas\s+Comerciais/gi,'Proposta Comercial');
          }
        }
      }
      product.style.color='#c8cbd1';
    }

    const flow=document.querySelector('.fenix-top-copy small') || top.querySelector('small');
    if(flow){
      flow.style.color='#bfc3ca';
      flow.style.opacity='0.96';
    }

    document.title='FENIX Intelligent BPO | Proposta Comercial';
  }

  function run(){
    apply();
    [100,300,700,1200,2000,3500].forEach(ms=>setTimeout(apply,ms));
    const obs=new MutationObserver(apply);
    obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
    setTimeout(()=>obs.disconnect(),8000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run); else run();
})();
