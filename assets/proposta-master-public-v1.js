(()=>{
  const qs=new URLSearchParams(location.search);const ref=(qs.get('ref')||'').trim();
  const loader=document.getElementById('proposalLoader'),mount=document.getElementById('masterMount'),panel=document.getElementById('acceptPanel');
  const statusEl=document.getElementById('acceptStatus'),form=document.getElementById('acceptForm'),btn=document.getElementById('acceptButton');
  let proposal=null;
  const fail=msg=>{loader.classList.add('error');loader.textContent=msg};
  async function loadMaster(){
    if(!ref)throw new Error('Referência da proposta ausente.');
    const [htmlRes,dataRes]=await Promise.all([
      fetch('/master-template/proposta-master-limpa-v1.html?v=3',{cache:'no-store'}),
      fetch('/api/public-proposal?ref='+encodeURIComponent(ref),{cache:'no-store'})
    ]);
    if(!htmlRes.ok)throw new Error('Não foi possível carregar o layout da proposta.');
    const data=await dataRes.json();if(!dataRes.ok)throw new Error(data.error||'Proposta indisponível.');proposal=data.proposal;
    const source=await htmlRes.text(),doc=new DOMParser().parseFromString(source,'text/html'),deck=doc.querySelector('.deck');
    if(!deck)throw new Error('Layout mestre inválido.');
    mount.innerHTML=deck.outerHTML;
    await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/master-template/proposta-master-limpa-v1.js?v=3';s.onload=resolve;s.onerror=()=>reject(new Error('Não foi possível carregar os dados da proposta.'));document.body.appendChild(s)});
    document.title=`FÊNIX — Proposta Comercial | ${proposal?.client?.name||proposal?.client?.razao_social||'Cliente'}`;
    panel.hidden=false;
    if(proposal?.status==='proposta_aceita_aguardando_cfo'){
      btn.disabled=true;btn.textContent='Aceite já registrado';statusEl.className='accept-status ok';statusEl.textContent='Esta proposta já foi aceita e está aguardando validação do CFO.';
      [...form.elements].forEach(el=>{if(el!==btn)el.disabled=true});
    }
    loader.style.display='none';
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault();statusEl.className='accept-status';statusEl.textContent='';
    const nome=document.getElementById('acceptName').value.trim(),email=document.getElementById('acceptEmail').value.trim(),accepted=document.getElementById('acceptCheck').checked,cnpj=String(proposal?.client?.cnpj||'').replace(/\D/g,'');
    if(!nome){statusEl.className='accept-status error';statusEl.textContent='Informe o nome do responsável.';return}
    if(!/^\S+@\S+\.\S+$/.test(email)){statusEl.className='accept-status error';statusEl.textContent='Informe um e-mail válido.';return}
    if(!accepted){statusEl.className='accept-status error';statusEl.textContent='Confirme o aceite da proposta.';return}
    if(!/^\d{14}$/.test(cnpj)){statusEl.className='accept-status error';statusEl.textContent='Não foi possível validar o CNPJ vinculado à proposta.';return}
    btn.disabled=true;btn.textContent='Registrando aceite...';
    try{const r=await fetch('/api/proposal-acceptance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cnpj,nome,email,accepted:true,proposal_ref:ref})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível registrar o aceite.');statusEl.className='accept-status ok';statusEl.textContent=d.message||'Aceite registrado com sucesso.';btn.textContent='Aceite registrado ✓';[...form.elements].forEach(el=>el.disabled=true)}catch(err){btn.disabled=false;btn.textContent='Aceitar proposta';statusEl.className='accept-status error';statusEl.textContent=err.message}
  });
  loadMaster().catch(err=>fail(err.message));
})();
