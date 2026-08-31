(function(){
  const REQUESTED_INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  window.FENIX_INTERNAL_MODE=false;

  function ensureInternalShellStyles(){
    if(document.getElementById('fenix-internal-shell-styles'))return;
    const style=document.createElement('style');
    style.id='fenix-internal-shell-styles';
    style.textContent=`
      body.fenix-internal-gate [data-fenix-client-form="1"],
      body.fenix-internal-mode [data-fenix-client-form="1"]{display:none!important}
      body.fenix-internal-gate #diagnostico,
      body.fenix-internal-gate #saida,
      body.fenix-internal-gate #contratoBox{display:none!important}
      body.fenix-internal-gate .wrap{max-width:980px;min-height:calc(100vh - 210px);display:flex;align-items:flex-start;justify-content:center;padding-top:46px}
      body.fenix-internal-gate #fenix-internal-login{width:min(460px,100%);margin:0!important;box-shadow:0 8px 30px rgba(20,22,35,.10)}
      body.fenix-internal-mode .wrap{max-width:1100px}
    `;
    document.head.appendChild(style);
  }

  function markPublicFormCards(){
    document.querySelectorAll('.wrap > .card').forEach(card=>{
      if(card.id==='fenix-internal-login'||card.id==='fenix-internal-dashboard')return;
      card.dataset.fenixClientForm='1';
    });
  }

  function setHeader(internal){
    const topCopy=document.querySelector('.fenix-top-copy');
    if(!topCopy)return;
    topCopy.innerHTML=internal
      ? '<strong>Área Interna Fênix</strong><small>Diagnóstico → Precificação → Comercial → Proposta → Contrato</small>'
      : '<strong>Levantamento da Operação</strong><small>Conte-nos sobre sua rotina para prepararmos uma proposta sob medida.</small>';
  }

  function hideInternal(){
    document.getElementById('diagnostico')?.classList.add('hidden');
    document.getElementById('saida')?.classList.add('hidden');
    document.getElementById('contratoBox')?.classList.add('hidden');
  }

  function showLogin(message=''){
    ensureInternalShellStyles();
    markPublicFormCards();
    hideInternal();
    document.body.classList.add('fenix-internal-gate');
    document.body.classList.remove('fenix-client-mode','fenix-internal-mode');
    setHeader(true);
    let box=document.getElementById('fenix-internal-login');
    if(!box){
      box=document.createElement('div');box.id='fenix-internal-login';box.className='card';
      box.style.cssText='max-width:460px;padding:28px';
      box.innerHTML='<div class="section">Acesso interno Fênix</div><div style="font-size:13px;color:#66625b;line-height:1.5;margin:-2px 0 16px">Ambiente restrito para análise CFO, aprovação comercial, propostas e contratos.</div><div class="field"><label>Senha</label><input id="fenix-internal-password" type="password" autocomplete="current-password" autofocus></div><div id="fenix-login-error" class="err hidden" style="margin-top:10px"></div><div class="actions" style="margin-top:16px"><button id="fenix-login-btn" class="btn primary" style="min-width:120px">Entrar</button></div>';
      document.querySelector('.wrap')?.prepend(box);
      box.querySelector('#fenix-login-btn').onclick=login;
      box.querySelector('#fenix-internal-password').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
    }
    const err=box.querySelector('#fenix-login-error');
    if(message){err.textContent=message;err.classList.remove('hidden')}else err.classList.add('hidden');
    setTimeout(()=>box.querySelector('#fenix-internal-password')?.focus(),50);
  }

  async function login(){
    const input=document.getElementById('fenix-internal-password');
    const btn=document.getElementById('fenix-login-btn');
    if(!input||!btn)return;
    btn.disabled=true;btn.textContent='Entrando...';
    try{
      const r=await fetch('/api/internal-auth',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:input.value})});
      const d=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(d.error||'Não foi possível entrar.');
      activateInternal();
    }catch(e){showLogin(e.message||'Acesso negado.')}finally{btn.disabled=false;btn.textContent='Entrar'}
  }

  function activateInternal(){
    ensureInternalShellStyles();
    markPublicFormCards();
    window.FENIX_INTERNAL_MODE=true;
    document.getElementById('fenix-internal-login')?.remove();
    document.body.classList.remove('fenix-internal-gate','fenix-client-mode');
    document.body.classList.add('fenix-internal-mode');
    setHeader(true);
    window.dispatchEvent(new CustomEvent('fenix:internal-authenticated'));
  }

  function applyClientMode(){
    window.FENIX_INTERNAL_MODE=false;
    hideInternal();
    document.body.classList.remove('fenix-internal-gate','fenix-internal-mode');
    document.body.classList.add('fenix-client-mode');
    setHeader(false);
    const scopeCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
    const btn=scopeCard?.querySelector('button');
    if(btn)btn.textContent='Enviar informações para análise da Fênix';
  }

  async function init(){
    ensureInternalShellStyles();
    if(!REQUESTED_INTERNAL){applyClientMode();return;}
    markPublicFormCards();
    document.body.classList.add('fenix-internal-gate');
    setHeader(true);
    hideInternal();
    try{
      const r=await fetch('/api/internal-auth',{method:'GET',credentials:'same-origin'});
      const d=await r.json().catch(()=>({}));
      if(r.ok&&d.authenticated)activateInternal();else showLogin(r.status===503?'Acesso interno ainda não configurado.':'');
    }catch{showLogin('Não foi possível validar o acesso interno.')}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
