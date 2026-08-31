(function(){
  const DEFAULT_SOFTWARE_PER_CNPJ=200;
  let scheduled=false;
  function apply(){
    scheduled=false;
    const each=document.getElementById('cfoSoftwareEach');
    const total=document.getElementById('cfoSoftwareTotal');
    const cnpjMetric=[...document.querySelectorAll('#fenix-cfo-approval .metric')].find(m=>m.querySelector('span')?.textContent?.trim()==='CNPJs');
    const cnpjs=Number(cnpjMetric?.querySelector('strong')?.textContent||1)||1;
    if(!each)return;
    const current=Number(String(each.value||'').replace(/[^0-9.-]/g,''))||0;
    if(current<=0){
      each.value=DEFAULT_SOFTWARE_PER_CNPJ;
      if(total) total.value=DEFAULT_SOFTWARE_PER_CNPJ*cnpjs;
      each.dispatchEvent(new Event('input',{bubbles:true}));
    }
    const label=each.closest('.field')?.querySelector('label');
    if(label) label.textContent='Software por CNPJ (R$) — mínimo sugerido';
    each.title='Valor padrão atual: R$ 200 por CNPJ/mês. O CFO pode alterar conforme o cliente antes da aprovação.';
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
  const mo=new MutationObserver(schedule);mo.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
