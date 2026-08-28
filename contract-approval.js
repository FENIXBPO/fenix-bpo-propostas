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
      const p=d.proposal||{},c=d.contract||null,t=p.commercial_terms||{};
      if(c?.status==='autorizado_cfo_aguardando_geracao'||c?.status==='gerado'||p.status==='contrato_autorizado'){
        const url=`/contrato/contrato.html?ref=${encodeURIComponent(c?.contract_code||'')}`;
        box.innerHTML=`<div class="ok"><strong>Contrato autorizado pelo CFO</strong><br><small>Código: ${esc(c?.contract_code||'—')} · Modelo: ${esc(c?.template_version||'Contrato_Fenix_BPO_MODELO_PADRAO_v22')}</small><br><small>Os dados comerciais e o escopo desta versão estão congelados.</small><div class="actions" style="margin-top:10px"><a class="btn green" target="_blank" rel="noopener" href="${url}">Abrir contrato v22</a></div></div>`;return;
      }
      if(p.status!=='proposta_aceita_aguardando_cfo'){
        box.innerHTML='<div class="internal"><strong>Contrato:</strong> aguardando aceite do cliente. O botão de autorização só será liberado após o aceite da proposta publicada.</div>';return;
      }
      const initialTerm=esc(t.initial_term||'12 (doze) meses');
      box.innerHTML=`<div class="card" style="margin:0;background:#fffaf0;border:1px solid #d8b768"><div class="section">Governança do contrato — validação final CFO</div><div class="warn"><strong>Proposta aceita pelo cliente.</strong><br>Revise os valores e o escopo aprovados acima e complete os dados jurídicos abaixo. Ao autorizar, a versão ficará congelada como fonte do contrato v22.</div>
      <div class="grid" style="margin-top:14px">
        <div class="field"><label>Representante legal</label><input id="ctrRepresentative" placeholder="Nome completo"></div>
        <div class="field"><label>CPF do representante</label><input id="ctrCpf" placeholder="000.000.000-00"></div>
        <div class="field"><label>Início da operação</label><input id="ctrStart" value="após assinatura do contrato e confirmação dos pagamentos iniciais"></div>
        <div class="field"><label>Vigência inicial</label><input id="ctrTerm" value="${initialTerm}"></div>
        <div class="field"><label>Vencimento</label><input id="ctrDue" value="${esc(t.due_date||'') }" placeholder="Ex.: dia 10 de cada mês"></div>
        <div class="field"><label>Forma de pagamento</label><input id="ctrPayment" value="${esc(t.payment_method||'') }" placeholder="Ex.: cobrança mensal + software separado"></div>
      </div>
      <div class="actions"><button class="btn green" id="authorizeContractBtn">Aprovar e gerar contrato v22</button></div><div id="contractStatus"></div></div>`;
      document.getElementById('authorizeContractBtn').onclick=async()=>{
        const btn=document.getElementById('authorizeContractBtn'),st=document.getElementById('contractStatus');btn.disabled=true;st.className='warn';st.textContent='Validando e autorizando contrato v22...';
        const contract_fields={representative:document.getElementById('ctrRepresentative').value,representative_cpf:document.getElementById('ctrCpf').value,start_operation:document.getElementById('ctrStart').value,initial_term:document.getElementById('ctrTerm').value,due_date:document.getElementById('ctrDue').value,payment_method:document.getElementById('ctrPayment').value};
        try{const rr=await fetch('/api/internal-contract',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({intake_id,contract_fields})});const dd=await rr.json();if(!rr.ok){const suffix=Array.isArray(dd.missing)&&dd.missing.length?' Faltando: '+dd.missing.join(', ')+'.':'';throw new Error((dd.error||'Falha ao autorizar.')+suffix)}st.className='ok';st.innerHTML=`${esc(dd.message||'Contrato autorizado.')} <a class="btn green" style="margin-left:8px" target="_blank" rel="noopener" href="${esc(dd.preview_url||'#')}">Abrir contrato v22</a>`;btn.textContent='Contrato autorizado ✓';}
        catch(e){st.className='err';st.textContent=e.message;btn.disabled=false}
      };
    }catch(e){box.innerHTML=`<div class="err">${esc(e.message)}</div>`}
  }
  const mo=new MutationObserver(()=>setTimeout(render,60));mo.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target?.matches?.('[data-open-intake]'))setTimeout(()=>{lastIntake=null;render()},250)});
  setInterval(()=>{if(window.__fenixLoadedIntakeId!==lastIntake){lastIntake=null;render()}},1200);
})();
