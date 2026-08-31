(function(){
  function mountBrand(){
    document.querySelectorAll('.page .logo').forEach(host=>{
      host.innerHTML='<div class="brandMark"><span class="brandWord">FÊNIX</span><span class="brandSub">INTELLIGENT <b>BPO</b></span></div>';
      host.setAttribute('aria-label','FÊNIX Intelligent BPO');
    });
    document.querySelectorAll('.footer .miniLogo').forEach(host=>{
      host.innerHTML='<div class="miniBrand"><span>FÊNIX</span><small>INTELLIGENT BPO</small></div>';
      host.setAttribute('aria-label','FÊNIX Intelligent BPO');
    });
    document.querySelectorAll('.footer b').forEach(el=>{el.textContent='INTELIGÊNCIA QUE TRANSFORMA. RESULTADOS QUE PERMANECEM.'});
    document.querySelectorAll('.page .wing').forEach(host=>host.setAttribute('aria-hidden','true'));
    const gov=document.querySelector('.governance');
    if(gov)gov.textContent='Seu aceite será registrado e encaminhado para validação interna da FÊNIX antes da geração do contrato.';
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
