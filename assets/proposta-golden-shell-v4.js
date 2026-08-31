(function(){
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
      if(host.querySelector('img'))return;
      host.replaceChildren(img('/assets/fenix-logo-transparent.webp?v=golden-v4','logoImg','FÊNIX Intelligent BPO'));
    });
    document.querySelectorAll('.page .wing').forEach(host=>{
      if(host.querySelector('img'))return;
      host.replaceChildren(img('/assets/fenix-symbol.png?v=golden-v4','wingImg',''));
      host.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.footer .miniLogo').forEach(host=>{
      if(host.querySelector('img'))return;
      host.replaceChildren(img('/assets/fenix-logo-transparent.webp?v=golden-v4','miniLogoImg','FÊNIX Intelligent BPO'));
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
