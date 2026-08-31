(function(){
  const REQUESTED_INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  window.FENIX_INTERNAL_MODE=false;

  function ensureInternalStyles(){
    if(document.getElementById('fenix-internal-access-style'))return;
    const style=document.createElement('style');
    style.id='fenix-internal-access-style';
    style.textContent=`
      body.fenix-internal-pending .wrap > .card:not(#fenix-internal-login),
      body.fenix-internal-login .wrap > .card:not(#fenix-internal-login),
      body.fenix-internal-pending #diagnostico,
      body.fenix-internal-pending #saida,
      body.fenix-internal-pending #contratoBox,
      body.fenix-internal-login #diagnostico,
      body.fenix-internal-login #saida,
      body.fenix-internal-login #contratoBox{display:none!important}
      body.fenix-internal-login .wrap{min-height:calc(100vh - 130px);display:flex;align-items:flex-start;justify-content:center;padding-top:42px}
      body.fenix-internal-login #fenix-internal-login{width:min(460px,100%);margin:0}
    `;
    document.head.appendChild(style);
  }

  function setHeader(internal){
    const topCopy=document.querySelector('.fenix-top-copy');
    if(!topCopy)return;
    topCopy.innerHTML=internal
      ? '<strong>Área Interna Fênix</strong><small>Diagnóstico → Precificação → Comercial → Proposta → Contrato</small>'
      : REQUESTED_INTERNAL
        ? '<strong>Área Interna Fênix</strong><small>Acesso restrito à equipe Fênix.</small>'
        : '<strong>Levantamento da Operação</strong><small>Conte-nos sobre sua rotina para prepararmos uma proposta sob medida.</small>';
  }

  function hideInternal(){
    document.getElementById('diagnostico')?.classList.add('hidden');
    document.getElementById('saida')?.classList.add('hidden');
    document.getElementById('contratoBox')?.classList.add('hidden');
  }

  function showLogin(message=''){
    ensureInternalStyles();
    hideInternal();
    document.body.classList.remove('fenix-client-mode','fenix-internal-mode','fenix-internal-pending');
    document.body.classList.add('fenix-internal-login');
    setHeader(false);
    let box=document.getElementById('fenix-internal-login');
    if(!box){
      box=document.createElement('div');box.id='fenix-internal-login';box.className='card';
      box.style.cssText='max-width:460px;padding:24px';
      box.innerHTML='<div class="section">Acesso interno Fênix</div><div class="field"><label>Senha</label><input id="fenix-internal-password" type="password" autocomplete="current-password"></div><div id="fenix-login-error" class="err hidden" style="margin-top:10px"></div><div class="actions" style="margin-top:14px"><button id="fenix-login-btn" class="btn primary">Entrar</button></div>';
      document.querySelector('.wrap')?.prepend(box);
      box.querySelector('#fenix-login-btn').onclick=login;
      box.querySelector('#fenix-internal-password').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
    }
    const err=box.querySelector('#fenix-login-error');
    if(message){err.textContent=message;err.classList.remove('hidden')}else err.classList.add('hidden');
  }

  async function requestWithTimeout(url,options={},ms=12000){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),ms);
    try{return await fetch(url,{...options,signal:controller.signal,credentials:'same-origin'})}
    finally{clearTimeout(timer)}
  }

  async function login(){
    const input=document.getElementById('fenix-internal-password');
    const btn=document.getElementById('fenix-login-btn');
    if(!input||!btn)return;
    const err=document.getElementById('fenix-login-error');
    if(err)err.classList.add('hidden');
    btn.disabled=true;btn.textContent='Entrando...';
    try{
      const r=await requestWithTimeout('/api/internal-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:input.value})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(d.error||'Não foi possível entrar.');
      // Recarrega após gravar o cookie. Isso evita corrida entre autenticação e carregamento do dashboard.
      location.replace('/app-v15.html?interno=1&login=ok');
    }catch(e){
      const msg=e?.name==='AbortError'?'O acesso demorou mais que o esperado. Tente novamente.':(e.message||'Acesso negado.');
      showLogin(msg);
      const b=document.getElementById('fenix-login-btn');if(b){b.disabled=false;b.textContent='Entrar'}
    }
  }

  function activateInternal(){
    window.FENIX_INTERNAL_MODE=true;
    document.getElementById('fenix-internal-login')?.remove();
    document.body.classList.remove('fenix-client-mode','fenix-internal-login','fenix-internal-pending');
    document.body.classList.add('fenix-internal-mode');
    setHeader(true);
    window.dispatchEvent(new CustomEvent('fenix:internal-authenticated'));
  }

  function applyClientMode(){
    window.FENIX_INTERNAL_MODE=false;
    hideInternal();
    document.body.classList.remove('fenix-internal-login','fenix-internal-mode','fenix-internal-pending');
    document.body.classList.add('fenix-client-mode');
    setHeader(false);
    const scopeCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
    const btn=scopeCard?.querySelector('button');
    if(btn)btn.textContent='Enviar informações para análise da Fênix';
  }

  async function init(){
    ensureInternalStyles();
    if(!REQUESTED_INTERNAL){applyClientMode();return;}
    document.body.classList.add('fenix-internal-pending');
    hideInternal();setHeader(false);
    try{
      const r=await requestWithTimeout('/api/internal-auth',{method:'GET'},10000);
      const d=await r.json().catch(()=>({}));
      if(r.ok&&d.authenticated)activateInternal();
      else showLogin(r.status===503?'Acesso interno ainda não configurado.':'');
    }catch(e){
      showLogin(e?.name==='AbortError'?'Não foi possível validar sua sessão no tempo esperado. Tente entrar novamente.':'Não foi possível validar o acesso interno.');
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
