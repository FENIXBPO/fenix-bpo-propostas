(function(){
  const LOGO='assets/fenix-logo-header.webp';
  function apply(){
    const header=document.querySelector('.fenix-top-logo');
    if(header){
      if(header.getAttribute('src')!==LOGO) header.src=LOGO;
      header.style.filter='none';
      header.style.opacity='1';
      header.style.background='transparent';
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
