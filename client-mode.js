(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  window.FENIX_INTERNAL_MODE=INTERNAL;

  function ensureClientConfirmation(){
    const scopeCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
    if(!scopeCard)return null;
    let box=document.getElementById('fenix-client-confirmation');
    if(!box){
      box=document.createElement('div');
      box.id='fenix-client-confirmation';
      box.className='ok';
      box.style.cssText='display:none;margin-top:14px;padding:14px 16px;line-height:1.55';
      scopeCard.appendChild(box);
    }
    return box;
  }

  function installClientAnalyze(){
    if(INTERNAL||typeof window.analisar!=='function'||window.analisar.__clientSafe)return;
    const safe=function(){
      const diag=document.getElementById('diagnostico');
      const saida=document.getElementById('saida');
      const contrato=document.getElementById('contratoBox');
      if(diag)diag.classList.add('hidden');
      if(saida)saida.classList.add('hidden');
      if(contrato)contrato.classList.add('hidden');
      const box=ensureClientConfirmation();
      if(box){
        box.style.display='block';
        box.innerHTML='<strong>Informações recebidas com sucesso.</strong><br>Obrigado por compartilhar os dados da operação. A equipe da Fênix fará a análise interna e entrará em contato para apresentar a proposta comercial.';
        box.scrollIntoView({behavior:'smooth',block:'center'});
      }
    };
    safe.__clientSafe=true;
    window.analisar=safe;
  }

  function applyMode(){
    document.body.classList.toggle('fenix-internal-mode',INTERNAL);
    document.body.classList.toggle('fenix-client-mode',!INTERNAL);

    const topCopy=document.querySelector('.fenix-top-copy');
    if(topCopy){
      topCopy.innerHTML=INTERNAL
        ? '<strong>Área Interna Fênix</strong><small>Diagnóstico → Precificação → Aprovação → Proposta</small>'
        : '<strong>Levantamento da Operação</strong><small>Conte-nos sobre sua rotina para prepararmos uma proposta sob medida.</small>';
    }

    if(!INTERNAL){
      ['diagnostico','saida','contratoBox'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
      const scopeCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
      const btn=scopeCard?.querySelector('button');
      if(btn)btn.textContent='Enviar informações para análise da Fênix';
      installClientAnalyze();
      [200,600,1200].forEach(ms=>setTimeout(installClientAnalyze,ms));
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyMode);else applyMode();
})();
