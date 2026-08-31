(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  function text(el){return String(el?.textContent||'').trim()}
  let scheduled=false;

  function hideFieldById(id){
    const el=document.getElementById(id);if(!el)return;
    const field=el.closest('.field')||el.closest('label');
    if(field)field.style.display='none';
  }

  function simplifyLegacyValidation(){
    const costHour=document.getElementById('costHour');
    const financialCard=costHour?.closest('.card');
    if(financialCard&&!financialCard.dataset.fenixMatrixSimplified){
      financialCard.dataset.fenixMatrixSimplified='1';
      const sec=financialCard.querySelector('.section');
      if(sec)sec.innerHTML='PARÂMETROS INTERNOS DA MATRIZ <span style="font-size:10px;color:#9a6b00;letter-spacing:.05em">• REFERÊNCIA • NÃO PUBLICA</span>';
      hideFieldById('cfoStatus');
      hideFieldById('cfoObs');
      const exception=document.getElementById('excecao')?.closest('label');
      if(exception)exception.style.display='none';
      if(!financialCard.querySelector('[data-fenix-matrix-note]')){
        const note=document.createElement('div');
        note.dataset.fenixMatrixNote='1';
        note.className='internal';
        note.style.marginTop='12px';
        note.innerHTML='<strong>Uso interno:</strong> estes parâmetros ajustam somente a sugestão automática. A condição comercial que vale para proposta e contrato é definida exclusivamente no Painel CFO abaixo.';
        financialCard.appendChild(note);
      }
    }

    const commercial=document.getElementById('comercialStatus');
    const commercialCard=commercial?.closest('.card');
    if(commercialCard&&!commercialCard.dataset.fenixCommercialHidden){
      commercialCard.dataset.fenixCommercialHidden='1';
      commercialCard.style.display='none';
    }
  }

  function patchSuggestion(){
    document.querySelectorAll('.section').forEach(el=>{
      const t=text(el).toUpperCase();
      if(t.includes('4. ANÁLISE INTERNA FÊNIX')&&t.includes('PRECIFICAÇÃO')&&!el.dataset.fenixSuggestionPatched){
        el.dataset.fenixSuggestionPatched='1';
        el.innerHTML='4. SUGESTÃO AUTOMÁTICA DE PRECIFICAÇÃO <span style="font-size:10px;color:#9a6b00;letter-spacing:.06em">• REFERÊNCIA INTERNA • NÃO PUBLICA</span>';
      }
    });

    document.querySelectorAll('label').forEach(el=>{
      const t=text(el);
      if(t==='Mensalidade aprovada'&&!el.dataset.fenixSuggestionLabel){el.dataset.fenixSuggestionLabel='1';el.textContent='Mensalidade sugerida pela matriz'}
      if(t==='Implantação aprovada'&&!el.dataset.fenixSuggestionLabel){el.dataset.fenixSuggestionLabel='1';el.textContent='Implantação sugerida pela matriz'}
    });

    simplifyLegacyValidation();

    const oldBtn=document.getElementById('gerarPropostaBtn');
    if(oldBtn&&!oldBtn.dataset.fenixSuggestionDisabled){
      oldBtn.dataset.fenixSuggestionDisabled='1';
      oldBtn.disabled=true;
      oldBtn.textContent='Use a Aprovação CFO abaixo';
      oldBtn.title='A sugestão automática não pode gerar ou publicar proposta. A condição comercial oficial deve ser aprovada no Painel CFO.';
      oldBtn.style.opacity='.62';
      oldBtn.style.cursor='not-allowed';
    }

    const diag=document.getElementById('diagnostico');
    if(diag&&!document.getElementById('fenix-separation-note')){
      const note=document.createElement('div');
      note.id='fenix-separation-note';
      note.className='card';
      note.style.cssText='border:2px solid #d6a526;background:#fffaf0;margin:16px 0;padding:18px 20px';
      note.innerHTML='<div class="section" style="color:#6b4b00">Governança de preço</div><div style="font-size:14px;line-height:1.55"><strong>Etapa 1 — Matriz:</strong> calcula uma sugestão automática de preço, piso e implantação. <strong>Etapa 2 — CFO:</strong> define a condição comercial oficial. <strong>Somente a aprovação CFO alimenta proposta, publicação e contrato.</strong></div>';
      const cfo=document.getElementById('fenix-cfo-approval');
      if(cfo) diag.insertBefore(note,cfo); else diag.appendChild(note);
    }

    const cfo=document.getElementById('fenix-cfo-approval');
    if(cfo&&!cfo.dataset.fenixOfficialStyled){
      cfo.dataset.fenixOfficialStyled='1';
      cfo.style.border='2px solid #c99319';
      cfo.style.boxShadow='0 8px 28px rgba(120,80,0,.10)';
      const sec=cfo.querySelector('.section');
      if(sec&&!sec.dataset.official){
        sec.dataset.official='1';
        sec.innerHTML='APROVAÇÃO CFO — CONDIÇÃO COMERCIAL OFICIAL <span style="font-size:10px;color:#2d6b45;letter-spacing:.05em">• FONTE OFICIAL</span>';
      }
    }
  }

  function schedulePatch(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;patchSuggestion()});
  }

  const observer=new MutationObserver(schedulePatch);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedulePatch,{once:true});else schedulePatch();
})();
