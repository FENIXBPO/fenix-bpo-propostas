(function(){
  const RAW='https://raw.githubusercontent.com/FENIXBPO/fenix-bpo-propostas/main/assets/';
  const SOURCES={
    logo:[RAW+'fenix-logo-header-crop.webp',RAW+'fenix-logo-transparent.webp','/assets/fenix-logo-header-crop.webp','/assets/fenix-logo-transparent.webp'],
    wing:[RAW+'fenix-symbol.png','/assets/fenix-symbol.png']
  };
  function img(sources, cls, alt){
    const el=document.createElement('img');
    let idx=0;
    el.src=sources[idx];
    el.className=cls;
    el.alt=alt||'';
    el.decoding='async';
    el.loading='eager';
    el.referrerPolicy='no-referrer';
    el.onerror=()=>{idx+=1;if(idx<sources.length)el.src=sources[idx];else el.style.display='none'};
    return el;
  }
  function mountBrand(){
    document.querySelectorAll('.page .logo').forEach(host=>host.replaceChildren(img(SOURCES.logo,'logoImg','FÊNIX Intelligent BPO')));
    document.querySelectorAll('.page .wing').forEach(host=>{
      host.replaceChildren(img(SOURCES.wing,'wingImg',''));
      host.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.footer .miniLogo').forEach(host=>host.replaceChildren(img(SOURCES.logo,'miniLogoImg','FÊNIX Intelligent BPO')));
  }
  function normalizeEmptyManagerialScope(){
    const list=document.getElementById('managerialScope');
    if(!list)return;
    const apply=()=>{
      if(list.querySelector('li')){list.classList.remove('scopeEmpty');return}
      if(document.getElementById('loading'))return;
      list.classList.add('scopeEmpty');
      list.innerHTML='<li class="emptyScopeNote">Nenhuma entrega gerencial adicional está incluída nesta versão da proposta.</li>';
    };
    new MutationObserver(apply).observe(list,{childList:true});
    setTimeout(apply,250);setTimeout(apply,900);
  }
  function mount(){mountBrand();normalizeEmptyManagerialScope()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
