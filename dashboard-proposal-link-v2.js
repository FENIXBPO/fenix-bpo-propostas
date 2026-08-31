(function(){
  function rewrite(){
    document.querySelectorAll('a[href*="/p/proposta.html?ref="]').forEach(a=>{
      a.href=a.href.replace('/p/proposta.html?ref=','/p/proposta-v2.html?ref=');
    });
  }
  const mo=new MutationObserver(rewrite);mo.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rewrite,{once:true});else rewrite();
})();
