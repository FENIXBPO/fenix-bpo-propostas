(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  function hideAnalysis(){
    const wrap=document.querySelector('.wrap');
    if(!wrap)return;
    [...wrap.children].forEach(el=>{
      if(el.id==='fenix-internal-dashboard'||el.id==='fenix-internal-login') return;
      if(el.classList?.contains('card')) el.style.display='none';
    });
    document.getElementById('diagnostico')?.classList.add('hidden');
  }

  function showAnalysis(){
    const wrap=document.querySelector('.wrap');
    if(!wrap)return;
    [...wrap.children].forEach(el=>{
      if(el.id==='fenix-internal-dashboard'||el.id==='fenix-internal-login') return;
      if(el.classList?.contains('card')) el.style.display='';
    });
    document.getElementById('diagnostico')?.classList.remove('hidden');
  }

  function boot(){
    hideAnalysis();
    const observer=new MutationObserver(()=>{
      if(!window.__fenixAnalysisOpen) hideAnalysis();
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  window.addEventListener('fenix:analysis-open',()=>{
    window.__fenixAnalysisOpen=true;
    showAnalysis();
  });
  window.addEventListener('fenix:analysis-close',()=>{
    window.__fenixAnalysisOpen=false;
    hideAnalysis();
  });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
