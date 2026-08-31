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
  function mount(){
    document.querySelectorAll('.page .logo').forEach(host=>{
      host.replaceChildren(img(LOGO,'logoImg','FÊNIX Intelligent BPO'));
    });
    document.querySelectorAll('.page .wing').forEach(host=>{
      host.replaceChildren(img(WING,'wingImg',''));
      host.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.footer .miniLogo').forEach(host=>{
      host.replaceChildren(img(LOGO,'miniLogoImg','FÊNIX Intelligent BPO'));
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
