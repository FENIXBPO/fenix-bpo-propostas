(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;
  const HOMOLOG_INTAKE='https://fenix-bpo-propostas-git-feat-intake-58b54e-fenix-bpo-s-projects.vercel.app/dados/';
  function apply(){
    const box=document.getElementById('fenix-internal-dashboard');
    if(!box)return setTimeout(apply,120);
    const link=[...box.querySelectorAll('a.fenix-pipeline-action')].find(a=>/nova coleta/i.test(a.textContent||''));
    if(!link)return setTimeout(apply,120);
    link.href=HOMOLOG_INTAKE;
    link.target='_blank';
    link.rel='noopener';
    link.dataset.intakeOfficial='homologacao-pr10';
  }
  apply();
})();
