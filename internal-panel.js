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
    const q=new URLSearchParams(location.search);
    const analysisOnly=q.get('analysis_only')==='1';
    loadScript('internal-shell.js?v=1','data-fenix-internal-shell');
    loadScript('internal-dashboard.js?v=6','data-fenix-internal-dashboard');
    if(analysisOnly){
      loadScript('analysis-auto-open.js?v=1','data-fenix-analysis-auto-open');
      loadScript('cfo-separation.js?v=1','data-fenix-cfo-separation');
      loadScript('cfo-publish.js?v=1','data-fenix-cfo-publish');
      loadScript('contract-approval.js?v=2','data-fenix-contract-approval');
      loadScript('cfo-software-default.js?v=1','data-fenix-cfo-software-default');
      return;
    }
    loadScript('pipeline-state.js?v=2','data-fenix-pipeline-state');
    loadScript('dashboard-enhance.js?v=3','data-fenix-dashboard-enhance');
    loadScript('dashboard-pipeline-v2.js?v=1','data-fenix-pipeline-v2');
    loadScript('dashboard-pipeline-v4-polish.js?v=1','data-fenix-pipeline-v4-polish');
    loadScript('dashboard-pipeline-v5-brand.js?v=1','data-fenix-pipeline-v5-brand');
    loadScript('dashboard-logo-official-drive.js?v=1','data-fenix-logo-official-drive');
    loadScript('dashboard-pipeline-v8-analysis-route.js?v=1','data-fenix-pipeline-v8-analysis-route');
    loadScript('dashboard-pipeline-v9-intake-link.js?v=1','data-fenix-pipeline-v9-intake-link');
    loadScript('dashboard-proposal-link-v2.js?v=1','data-fenix-dashboard-link-v2');
    loadScript('cfo-separation.js?v=1','data-fenix-cfo-separation');
    loadScript('cfo-publish.js?v=1','data-fenix-cfo-publish');
    loadScript('contract-approval.js?v=2','data-fenix-contract-approval');
    loadScript('cfo-software-default.js?v=1','data-fenix-cfo-software-default');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadInternal,{once:true});
  else loadInternal();
})();
