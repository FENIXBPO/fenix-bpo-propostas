(function(){
  const INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!INTERNAL)return;

  function text(el){return String(el?.textContent||'').trim()}
  function patchSuggestion(){
    document.querySelectorAll('.section').forEach(el=>{
      const t=text(el).toUpperCase();
      if(t.includes('4. ANÁLISE INTERNA FÊNIX')&&t.includes('PRECIFICAÇÃO')){
        el.innerHTML='4. SUGESTÃO AUTOMÁTICA DE PRECIFICAÇÃO <span style="font-size:10px;color:#9a6b00;letter-spacing:.06em">• REFERÊNCIA INTERNA • NÃO PUBLICA</span>';
      }
    });

    document.querySelectorAll('label').forEach(el=>{
      const t=text(el);
      if(t==='Mensalidade aprovada') el.textContent='Mensalidade sugerida pela matriz';
      if(t==='Implantação aprovada') el.textContent='Implantação sugerida pela matriz';
      if(t==='Parecer CFO') el.textContent='Parecer sobre a sugestão automática';
    });

    const oldBtn=document.getElementById('gerarPropostaBtn');
    if(oldBtn){
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
    if(cfo){
      cfo.style.border='2px solid #c99319';
      cfo.style.boxShadow='0 8px 28px rgba(120,80,0,.10)';
      const sec=cfo.querySelector('.section');
      if(sec&&!sec.dataset.official){
        sec.dataset.official='1';
        sec.innerHTML='APROVAÇÃO CFO — CONDIÇÃO COMERCIAL OFICIAL <span style="font-size:10px;color:#2d6b45;letter-spacing:.05em">• FONTE OFICIAL</span>';
      }
    }
  }

  const observer=new MutationObserver(()=>patchSuggestion());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchSuggestion,{once:true});else patchSuggestion();
})();
