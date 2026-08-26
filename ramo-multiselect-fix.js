(function(){
  const style=document.createElement('style');
  style.id='fenix-ramo-multiselect-fix';
  style.textContent=`
    #ramos + details > div label{
      display:flex!important;
      align-items:center!important;
      justify-content:flex-start!important;
      gap:9px!important;
      width:100%!important;
      padding:7px 4px!important;
      margin:0!important;
      text-align:left!important;
      font-weight:500!important;
    }
    #ramos + details > div label input[type="checkbox"]{
      width:16px!important;
      height:16px!important;
      min-width:16px!important;
      flex:0 0 16px!important;
      margin:0!important;
      padding:0!important;
      box-shadow:none!important;
    }
    #ramos + details > summary{
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:ellipsis!important;
    }
  `;
  if(!document.getElementById(style.id))document.head.appendChild(style);

  function bindSummaryCount(){
    const hidden=document.getElementById('ramos');
    const details=hidden?.nextElementSibling;
    if(!hidden||!details||details.dataset.countBound==='1')return;
    const summary=details.querySelector('summary');
    const checks=[...details.querySelectorAll('input[type="checkbox"]')];
    if(!summary||!checks.length)return;

    const update=()=>{
      const selected=checks.filter(c=>c.checked).map(c=>c.value);
      if(selected.length===0)summary.textContent='Selecione...';
      else if(selected.length===1)summary.textContent=selected[0];
      else summary.textContent=`${selected.length} ramos selecionados`;
    };

    checks.forEach(c=>c.addEventListener('change',()=>setTimeout(update,0)));
    details.dataset.countBound='1';
    update();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindSummaryCount);else bindSummaryCount();
  setTimeout(bindSummaryCount,300);
})();
