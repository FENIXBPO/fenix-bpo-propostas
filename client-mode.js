(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  window.FENIX_INTERNAL_MODE=INTERNAL;
  function applyMode(){
    document.body.classList.toggle('fenix-internal-mode',INTERNAL);
    document.body.classList.toggle('fenix-client-mode',!INTERNAL);
    const topCopy=document.querySelector('.fenix-top-copy');
    if(topCopy){
      topCopy.innerHTML=INTERNAL
        ? '<strong>Diagnóstico CFO e Propostas</strong><small>Coleta → Diagnóstico CFO → Comercial → Proposta</small>'
        : '<strong>Levantamento da Operação</strong><small>Conte-nos sobre sua rotina para prepararmos uma proposta sob medida.</small>';
    }
    const diag=document.getElementById('diagnostico');
    if(diag && !INTERNAL) diag.classList.add('hidden');
    const saida=document.getElementById('saida');
    const contrato=document.getElementById('contratoBox');
    if(!INTERNAL){ if(saida)saida.classList.add('hidden'); if(contrato)contrato.classList.add('hidden'); }
    const scopeCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
    if(scopeCard && !INTERNAL){
      const btn=scopeCard.querySelector('button');
      if(btn){btn.textContent='Concluir levantamento';btn.onclick=function(){
        const f=window.formData?window.formData():null;
        if(!f||!f.razao||!f.email||!f.dor||!f.faturamento||!f.recebimentos||!f.pagamentos||!f.notas||!f.escopo.length){alert('Preencha os dados obrigatórios e selecione o escopo.');return;}
        let box=document.getElementById('fenix-client-preview-note');
        if(!box){box=document.createElement('div');box.id='fenix-client-preview-note';box.className='ok';box.style.marginTop='14px';scopeCard.appendChild(box);}
        box.innerHTML='<strong>Levantamento concluído.</strong><br>Esta é a versão de validação do formulário. O envio e o histórico serão ativados na etapa de persistência antes da publicação para clientes.';
        box.scrollIntoView({behavior:'smooth',block:'center'});
      };}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyMode);else applyMode();
})();
