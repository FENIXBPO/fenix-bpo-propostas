(function(){
 function enhance(){
   const box=document.getElementById('fenix-cfo-approval'); if(!box)return;
   const actions=box.querySelector('.actions'); if(!actions||document.getElementById('cfoPublishBtn'))return;
   const btn=document.createElement('button');btn.id='cfoPublishBtn';btn.className='btn primary';btn.textContent='Gerar e publicar proposta';
   const link=document.createElement('a');link.id='cfoPublicLink';link.className='btn ghost';link.target='_blank';link.rel='noopener';link.style.display='none';link.textContent='Abrir proposta publicada';
   actions.append(btn,link);
   btn.onclick=async()=>{const intake_id=window.__fenixLoadedIntakeId;const st=document.getElementById('cfoSaveStatus');if(!intake_id)return;st.className='warn';st.textContent='Publicando proposta aprovada...';btn.disabled=true;try{const r=await fetch('/api/internal-proposal',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({intake_id,action:'publish'})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao publicar.');st.className='ok';st.textContent='Proposta publicada. Este é o link que pode ser enviado ao cliente.';link.href=d.public_url;link.style.display='inline-block';btn.textContent='Publicada ✓';}catch(e){st.className='err';st.textContent=e.message;btn.disabled=false}}
 }
 const mo=new MutationObserver(enhance);mo.observe(document.documentElement,{childList:true,subtree:true});enhance();
})();
