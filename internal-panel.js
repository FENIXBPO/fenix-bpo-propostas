(function(){
  function loadScript(src,attr){
    if(document.querySelector(`script[${attr}]`)) return;
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.setAttribute(attr,'1');
    s.onerror=()=>console.error(`Falha ao carregar ${src}`);
    document.head.appendChild(s);
  }
  function loadInternal(){
    loadScript('internal-dashboard.js?v=4','data-fenix-internal-dashboard');
    loadScript('cfo-separation.js?v=1','data-fenix-cfo-separation');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadInternal,{once:true});
  else loadInternal();
})();
