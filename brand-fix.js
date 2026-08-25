(function(){
  const LOGO='assets/fenix-logo-transparent.webp';
  function apply(){
    const header=document.querySelector('.fenix-top-logo');
    if(header){
      if(header.getAttribute('src')!==LOGO) header.src=LOGO;
      header.style.filter='brightness(0) invert(1)';
      header.style.opacity='1';
    }
    document.querySelectorAll('.fenix-proposal-brand img').forEach(img=>{
      if(img.getAttribute('src')!==LOGO) img.src=LOGO;
      img.style.filter='none';
      img.style.opacity='1';
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{apply();setTimeout(apply,300);setTimeout(apply,1200)});
  else{apply();setTimeout(apply,300);setTimeout(apply,1200)}
  const obs=new MutationObserver(apply);obs.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(()=>obs.disconnect(),10000);
})();
