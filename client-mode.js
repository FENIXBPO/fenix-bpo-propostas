(function(){
  const REQUESTED_INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  window.FENIX_INTERNAL_MODE=false;

  function setHeader(internal){
    const topCopy=document.querySelector('.fenix-top-copy');
    if(!topCopy)return;
    topCopy.innerHTML=internal
      ? '<strong>Área Interna Fênix</strong><small>Diagnóstico → Precificação → Comercial → Proposta</small>'
      : '<strong>Levantamento da Operação</strong><small>Conte-nos sobre sua rotina para prepararmos uma proposta sob medida.</small>';
  }

  function hideInternal(){
    document.getElementById('diagnostico')?.classList.add('hidden');
    document.getElementById('saida')?.classList.add('hidden');
    document.getElementById('contratoBox')?.classList.add('hidden');
  }

  function showLogin(message=''){
    hideInternal();
    document.body.classList.add('fenix-client-mode');
    document.body.classList.remove('fenix-internal-mode');
    setHeader(false);
    let box=document.getElementById('fenix-internal-login');
    if(!box){
      box=document.createElement('div');box.id='fenix-internal-login';box.className='card';
      box.style.cssText='max-width:460px;margin:28px auto;padding:24px';
      box.innerHTML='<div class="section">Acesso interno Fênix</div><div class="field"><label>Senha</label><input id="fenix-internal-password" type="password" autocomplete="current-password"></div><div id="fenix-login-error" class="err hidden" style="margin-top:10px"></div><div class="actions" style="margin-top:14px"><button id="fenix-login-btn" class="btn primary">Entrar</button></div>';
      document.querySelector('.wrap')?.prepend(box);
      box.querySelector('#fenix-login-btn').onclick=login;
      box.querySelector('#fenix-internal-password').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
    }
    const err=box.querySelector('#fenix-login-error');
    if(message){err.textContent=message;err.classList.remove('hidden')}else err.classList.add('hidden');
  }

  async function login(){
    const input=document.getElementById('fenix-internal-password');
    const btn=document.getElementById('fenix-login-btn');
    if(!input||!btn)return;
    btn.disabled=true;btn.textContent='Entrando...';
    try{
      const r=await fetch('/api/internal-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:input.value})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(d.error||'Não foi possível entrar.');
      activateInternal();
    }catch(e){showLogin(e.message||'Acesso negado.')}finally{btn.disabled=false;btn.textContent='Entrar'}
  }

  function activateInternal(){
    window.FENIX_INTERNAL_MODE=true;
    document.getElementById('fenix-internal-login')?.remove();
    document.body.classList.add('fenix-internal-mode');
    document.body.classList.remove('fenix-client-mode');
    setHeader(true);
    window.dispatchEvent(new CustomEvent('fenix:internal-authenticated'));
  }

  function applyClientMode(){
    window.FENIX_INTERNAL_MODE=false;
    hideInternal();
    document.body.classList.add('fenix-client-mode');
    document.body.classList.remove('fenix-internal-mode');
    setHeader(false);
    const scopeCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
    const btn=scopeCard?.querySelector('button');
    if(btn)btn.textContent='Enviar informações para análise da Fênix';
  }

  async function init(){
    if(!REQUESTED_INTERNAL){applyClientMode();return;}
    hideInternal();
    try{
      const r=await fetch('/api/internal-auth',{method:'GET',credentials:'same-origin'});
      const d=await r.json().catch(()=>({}));
      if(r.ok&&d.authenticated)activateInternal();else showLogin(r.status===503?'Acesso interno ainda não configurado.':'');
    }catch{showLogin('Não foi possível validar o acesso interno.')}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
