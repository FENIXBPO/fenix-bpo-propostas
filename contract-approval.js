(function(){
  let lastIntake=null;
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  async function render(){
    const intake_id=window.__fenixLoadedIntakeId;if(!intake_id||intake_id===lastIntake&&document.getElementById('fenix-contract-governance'))return;lastIntake=intake_id;
    const host=document.getElementById('fenix-cfo-approval');if(!host)return;
    let box=document.getElementById('fenix-contract-governance');if(!box){box=document.createElement('div');box.id='fenix-contract-governance';box.style.marginTop='18px';host.appendChild(box)}
    box.innerHTML='<div class="internal">Carregando governança do contrato...</div>';
    try{
      const r=await fetch(`/api/internal-contract?intake_id=${encodeURIComponent(intake_id)}`,{credentials:'same-origin'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao carregar contrato.');
      const p=d.proposal||{},c=d.contract||null;
      if(c?.status==='autorizado_cfo_aguardando_geracao'||p.status==='contrato_autorizado'){
        box.innerHTML=`<div class="ok"><strong>Contrato autorizado pelo CFO</strong><br><small>Código: ${esc(c?.contract_code||'—')} · Modelo: ${esc(c?.template_version||'Contrato_Fenix_BPO_MODELO_PADRAO_v20')}</small><br><small>Os dados comerciais e o escopo desta versão estão congelados para geração do documento.</small></div>`;return;
      }
      if(p.status!=='proposta_aceita_aguardando_cfo'){
        box.innerHTML='<div class="internal"><strong>Contrato:</strong> aguardando aceite do cliente. O botão de autorização só será liberado após o aceite da proposta publicada.</div>';return;
      }
      box.innerHTML=`<div class="card" style="margin:0;background:#fffaf0;border:1px solid #d8b768"><div class="section">Governança do contrato — validação final CFO</div><div class="warn"><strong>Proposta aceita pelo cliente.</strong><br>Revise os valores e o escopo aprovados acima. Ao autorizar, esta versão ficará congelada como fonte do contrato.</div><div class="actions"><button class="btn green" id="authorizeContractBtn">Aprovar e preparar contrato</button></div><div id="contractStatus"></div></div>`;
      document.getElementById('authorizeContractBtn').onclick=async()=>{
        const btn=document.getElementById('authorizeContractBtn'),st=document.getElementById('contractStatus');btn.disabled=true;st.className='warn';st.textContent='Autorizando contrato...';
        try{const rr=await fetch('/api/internal-contract',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({intake_id})});const dd=await rr.json();if(!rr.ok)throw new Error(dd.error||'Falha ao autorizar.');st.className='ok';st.textContent=dd.message||'Contrato autorizado.';btn.textContent='Contrato autorizado ✓';}
        catch(e){st.className='err';st.textContent=e.message;btn.disabled=false}
      };
    }catch(e){box.innerHTML=`<div class="err">${esc(e.message)}</div>`}
  }
  const mo=new MutationObserver(()=>setTimeout(render,60));mo.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target?.matches?.('[data-open-intake]'))setTimeout(()=>{lastIntake=null;render()},250)});
  setInterval(()=>{if(window.__fenixLoadedIntakeId!==lastIntake){lastIntake=null;render()}},1200);
})();
