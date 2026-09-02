(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;
  let previousY=0;

  function closeExisting(){
    const old=document.querySelector('.fenix-analysis-modal-backdrop');
    if(old)old.remove();
  }

  function openFullscreen(){
    if(document.querySelector('.fenix-analysis-modal-backdrop'))return;
    const dashboard=document.getElementById('fenix-internal-dashboard');
    const candidates=[...document.querySelectorAll('.wrap > .card, .wrap > #diagnostico, .wrap > #saida, .wrap > #contratoBox')]
      .filter(el=>el!==dashboard&&getComputedStyle(el).display!=='none');
    if(!candidates.length)return;

    previousY=window.scrollY;
    const backdrop=document.createElement('div');
    backdrop.className='fenix-analysis-modal-backdrop fenix-analysis-fullscreen';
    backdrop.innerHTML='<section class="fenix-analysis-modal" role="dialog" aria-modal="true" aria-label="Análise da oportunidade"><header class="fenix-analysis-modal-head"><div><strong>Análise da oportunidade</strong><br><span>Análise em tela cheia. Volte ao Pipeline sem perder sua posição.</span></div><button type="button" class="fenix-analysis-modal-close" aria-label="Voltar ao Pipeline">← Voltar ao Pipeline</button></header><div class="fenix-analysis-modal-body"></div></section>';
    const body=backdrop.querySelector('.fenix-analysis-modal-body');
    const moved=[];
    candidates.forEach(el=>{const marker=document.createComment('fenix-v7-origin');el.parentNode.insertBefore(marker,el);moved.push({el,marker});body.appendChild(el)});

    const close=()=>{
      moved.forEach(({el,marker})=>{if(marker.parentNode){marker.parentNode.insertBefore(el,marker);marker.remove()}el.style.display='none'});
      backdrop.remove();
      document.body.classList.remove('fenix-modal-open');
      window.scrollTo({top:previousY,left:0,behavior:'auto'});
    };

    backdrop.querySelector('.fenix-analysis-modal-close').addEventListener('click',close);
    document.addEventListener('keydown',function onKey(ev){if(ev.key==='Escape'){document.removeEventListener('keydown',onKey);close()}},{once:true});
    document.body.appendChild(backdrop);
    document.body.classList.add('fenix-modal-open');
    window.scrollTo({top:previousY,left:0,behavior:'auto'});
  }

  window.addEventListener('fenix:intake-opened',()=>{
    closeExisting();
    requestAnimationFrame(openFullscreen);
  });
})();
