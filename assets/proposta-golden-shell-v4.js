(function(){
  const LOGO='/assets/fenix-logo-header-crop.webp?v=golden-v5';
  const WING='/assets/fenix-symbol.png?v=golden-v5';
  function img(src, cls, alt){
    const el=document.createElement('img');
    el.src=src;
    el.className=cls;
    el.alt=alt||'';
    el.decoding='async';
    el.loading='eager';
    return el;
  }
  function mountBrand(){
    document.querySelectorAll('.page .logo').forEach(host=>host.replaceChildren(img(LOGO,'logoImg','FÊNIX Intelligent BPO')));
    document.querySelectorAll('.page .wing').forEach(host=>{
      host.replaceChildren(img(WING,'wingImg',''));
      host.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.footer .miniLogo').forEach(host=>host.replaceChildren(img(LOGO,'miniLogoImg','FÊNIX Intelligent BPO')));
  }
  function normalizeEmptyManagerialScope(){
    const list=document.getElementById('managerialScope');
    if(!list)return;
    const apply=()=>{
      const hasItems=list.querySelector('li');
      if(hasItems){ list.classList.remove('scopeEmpty'); return; }
      if(document.getElementById('loading'))return;
      list.classList.add('scopeEmpty');
      list.innerHTML='<li class="emptyScopeNote">Nenhuma entrega gerencial adicional está incluída nesta versão da proposta.</li>';
    };
    new MutationObserver(apply).observe(list,{childList:true});
    setTimeout(apply,250);
    setTimeout(apply,900);
  }
  function mount(){mountBrand();normalizeEmptyManagerialScope()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
