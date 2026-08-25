(function(){
  let cnpjData = null;
  let lookupTimer = null;

  const digits = value => String(value || '').replace(/\D/g, '');
  const el = id => document.getElementById(id);

  function ensureStatus(){
    const cnpjInput = el('cnpj');
    if(!cnpjInput) return null;
    let status = document.getElementById('fenix-cnpj-status');
    if(!status){
      status = document.createElement('div');
      status.id = 'fenix-cnpj-status';
      status.style.cssText = 'font-size:12px;margin-top:6px;min-height:18px;color:#6a6d75';
      cnpjInput.insertAdjacentElement('afterend', status);
    }
    return status;
  }

  function setStatus(message, type='neutral'){
    const status = ensureStatus();
    if(!status) return;
    const colors = {neutral:'#6a6d75',ok:'#287a4f',warn:'#8a6500',error:'#9d2d2d'};
    status.style.color = colors[type] || colors.neutral;
    status.textContent = message;
  }

  function ensureCompanySummary(){
    const cnpjInput = el('cnpj');
    const card = cnpjInput?.closest('.card');
    if(!card) return null;
    let box = document.getElementById('fenix-company-summary');
    if(!box){
      box = document.createElement('div');
      box.id = 'fenix-company-summary';
      box.style.cssText = 'display:none;margin-top:12px;padding:12px 14px;border:1px solid #ded9ce;border-radius:10px;background:#faf9f6;font-size:13px;line-height:1.55;color:#454850';
      const firstGrid = card.querySelector('.grid');
      if(firstGrid) firstGrid.insertAdjacentElement('afterend', box);
      else card.appendChild(box);
    }
    return box;
  }

  function renderCompanySummary(data){
    const box = ensureCompanySummary();
    if(!box) return;
    const parts = [];
    if(data.nome_fantasia) parts.push(`<strong>${escapeHtml(data.nome_fantasia)}</strong>`);
    if(data.situacao_cadastral) parts.push(`Situação: ${escapeHtml(data.situacao_cadastral)}`);
    if(data.atividade_principal) parts.push(`Atividade: ${escapeHtml(data.atividade_principal)}`);
    const city = [data.cidade, data.uf].filter(Boolean).join('/');
    const address = [data.endereco, data.bairro, city].filter(Boolean).join(' · ');
    if(address) parts.push(escapeHtml(address));
    box.innerHTML = parts.join('<br>');
    box.style.display = parts.length ? 'block' : 'none';
  }

  function escapeHtml(value){
    return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  async function lookupCnpj(){
    const input = el('cnpj');
    if(!input) return;
    const cnpj = digits(input.value);
    if(cnpj.length !== 14){
      cnpjData = null;
      setStatus(cnpj.length ? 'Digite os 14 números do CNPJ.' : '', 'neutral');
      return;
    }
    if(cnpjData && digits(cnpjData.cnpj) === cnpj) return;

    setStatus('Buscando dados públicos do CNPJ...', 'neutral');
    try{
      const response = await fetch(`/api/cnpj?cnpj=${encodeURIComponent(cnpj)}`);
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'CNPJ não encontrado.');
      cnpjData = data;
      if(el('razao') && !el('razao').value.trim()) el('razao').value = data.razao_social || '';
      renderCompanySummary(data);
      setStatus('Empresa encontrada. Dados públicos carregados automaticamente.', 'ok');
      window.__fenixCnpjData = data;
    }catch(err){
      cnpjData = null;
      setStatus(err.message || 'Não foi possível consultar o CNPJ.', 'error');
    }
  }

  function validateForSave(form){
    if(digits(form.cnpj).length !== 14) return 'Informe um CNPJ válido.';
    if(!String(form.razao || '').trim()) return 'Informe a razão social.';
    if(!String(form.email || '').trim()) return 'Informe o e-mail.';
    if(!String(form.dor || '').trim()) return 'Informe a principal dor financeira/administrativa.';
    if(!String(form.faturamento || '').trim()) return 'Informe o faturamento médio.';
    if(!String(form.recebimentos || '').trim()) return 'Informe os recebimentos mensais.';
    if(!String(form.pagamentos || '').trim()) return 'Informe os pagamentos mensais.';
    if(!Array.isArray(form.escopo) || !form.escopo.length) return 'Selecione pelo menos um item de escopo.';
    return '';
  }

  async function persistIntake(form){
    const response = await fetch('/api/intake', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({form, cnpjData: cnpjData || window.__fenixCnpjData || null})
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error || 'Não foi possível salvar os dados.');
    window.__fenixIntakeId = data.intake_id;
    return data;
  }

  function hookAnalyze(){
    if(typeof window.analisar !== 'function' || window.__fenixAnalyzeHooked) return;
    const original = window.analisar;
    window.analisar = async function(){
      const form = typeof window.formData === 'function' ? window.formData() : null;
      if(!form) return original.apply(this, arguments);
      const validation = validateForSave(form);
      if(validation){ alert(validation); return; }

      const button = [...document.querySelectorAll('button')].find(b => /Enviar informações para análise|Enviar para análise Fenix/i.test(b.textContent || ''));
      const oldText = button?.textContent;
      if(button){ button.disabled = true; button.textContent = 'Salvando informações...'; }
      try{
        if(digits(form.cnpj).length === 14 && (!cnpjData || digits(cnpjData.cnpj) !== digits(form.cnpj))) await lookupCnpj();
        await persistIntake(form);
        setStatus('Dados salvos com segurança na Fênix.', 'ok');
        original.apply(this, arguments);
      }catch(err){
        alert(err.message || 'Não foi possível salvar os dados. Tente novamente.');
      }finally{
        if(button){ button.disabled = false; button.textContent = oldText || 'Enviar informações para análise da Fênix'; }
      }
    };
    window.__fenixAnalyzeHooked = true;
  }

  function init(){
    const cnpjInput = el('cnpj');
    if(cnpjInput){
      ensureStatus();
      cnpjInput.addEventListener('input', ()=>{
        clearTimeout(lookupTimer);
        cnpjData = null;
        const cnpj = digits(cnpjInput.value);
        if(cnpj.length === 14) lookupTimer = setTimeout(lookupCnpj, 450);
      });
      cnpjInput.addEventListener('blur', lookupCnpj);
    }
    hookAnalyze();
    [300,900,1800].forEach(ms=>setTimeout(hookAnalyze, ms));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
