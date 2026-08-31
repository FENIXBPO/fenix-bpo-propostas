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
    loadScript('internal-shell.js?v=1','data-fenix-internal-shell');
    loadScript('internal-dashboard.js?v=5','data-fenix-internal-dashboard');
    loadScript('dashboard-enhance.js?v=3','data-fenix-dashboard-enhance');
    loadScript('cfo-separation.js?v=1','data-fenix-cfo-separation');
    loadScript('cfo-publish.js?v=1','data-fenix-cfo-publish');
    loadScript('contract-approval.js?v=2','data-fenix-contract-approval');
    loadScript('cfo-software-default.js?v=1','data-fenix-cfo-software-default');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadInternal,{once:true});
  else loadInternal();
})();
