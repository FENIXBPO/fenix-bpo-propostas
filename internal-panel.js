(function(){
  function loadDashboard(){
    if(document.querySelector('script[data-fenix-internal-dashboard]')) return;
    const s=document.createElement('script');
    s.src='internal-dashboard.js?v=2';
    s.async=false;
    s.dataset.fenixInternalDashboard='1';
    s.onerror=()=>console.error('Falha ao carregar internal-dashboard.js');
    document.head.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadDashboard,{once:true});
  else loadDashboard();
})();
