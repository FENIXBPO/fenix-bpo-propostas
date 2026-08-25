(function(){
  const HEADER_LOGO='assets/fenix-logo-transparent.webp';
  const DOC_LOGO='assets/fenix-logo-transparent.webp';
  function apply(){
    const header=document.querySelector('.fenix-top-logo');
    if(header){
      if(header.getAttribute('src')!==HEADER_LOGO) header.src=HEADER_LOGO;
      header.style.filter='none';
      header.style.opacity='1';
      header.style.background='transparent';
    }
    document.querySelectorAll('.fenix-proposal-brand img').forEach(img=>{
      if(img.getAttribute('src')!==DOC_LOGO) img.src=DOC_LOGO;
      img.style.filter='none';
      img.style.opacity='1';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{apply();setTimeout(apply,300);setTimeout(apply,1200)});
  else{apply();setTimeout(apply,300);setTimeout(apply,1200)}
  const obs=new MutationObserver(apply);obs.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>obs.disconnect(),10000);
})();
