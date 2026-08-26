(function(){
  const num=v=>{const n=Number(String(v??'').replace(/\./g,'').replace(',','.'));return Number.isFinite(n)?n:0};

  function addVolumeFields(){
    if(document.getElementById('contratos_novos')||document.getElementById('comissoes_lancadas'))return;
    const faturamento=document.getElementById('faturamento');
    const card=faturamento?.closest('.card');
    const grid=card?.querySelector('.grid');
    if(!grid)return;

    const makeField=(id,label,placeholder)=>{
      const wrap=document.createElement('div');wrap.className='field';wrap.dataset.contractOps='1';
      const lab=document.createElement('label');lab.htmlFor=id;lab.textContent=label;
      const input=document.createElement('input');input.id=id;input.type='number';input.min='0';input.step='1';input.placeholder=placeholder||'0';
      wrap.appendChild(lab);wrap.appendChild(input);return wrap;
    };

    grid.appendChild(makeField('contratos_novos','Contratos novos/mês','0'));
    grid.appendChild(makeField('comissoes_lancadas','Comissões lançadas/mês','0'));
  }

  function addScopeOptions(){
    const scopeGrid=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'))?.querySelector('.grid');
    if(!scopeGrid||scopeGrid.querySelector('[data-contract-scope="1"]'))return;
    const options=[
      ['Contratos a receber','Cadastro de contratos e parcelas a receber'],
      ['Comissões a pagar','Lançamento de comissões e valores a pagar vinculados às vendas'],
      ['Acompanhamento de parcelas contratuais','Acompanhamento administrativo de parcelas contratuais']
    ];
    options.forEach(([value,label])=>{
      const l=document.createElement('label');l.className='check';l.dataset.contractScope='1';
      const i=document.createElement('input');i.type='checkbox';i.name='escopo';i.value=value;
      l.appendChild(i);l.appendChild(document.createTextNode(label));scopeGrid.appendChild(l);
    });
  }

  function patchFormData(){
    if(typeof window.formData!=='function'||window.formData.__contractOps)return;
    const original=window.formData;
    const wrapped=function(){
      const f=original.apply(this,arguments);
      f.contratos_novos=document.getElementById('contratos_novos')?.value||'0';
      f.comissoes_lancadas=document.getElementById('comissoes_lancadas')?.value||'0';
      return f;
    };
    wrapped.__contractOps=true;window.formData=wrapped;
  }

  function patchPricing(){
    if(!window.FenixPricing||window.FenixPricing.__contractOps)return;
    const original=window.FenixPricing.diagnose;
    window.FenixPricing.diagnose=function(f,settings){
      const contratos=num(f?.contratos_novos),comissoes=num(f?.comissoes_lancadas);
      const clone={...f,lancamentos:num(f?.lancamentos)+contratos+comissoes};
      const d=original(clone,settings);
      d.contratosNovos=contratos;d.comissoesLancadas=comissoes;
      if(contratos>30)d.risks.push('Volume relevante de contratos novos para lançamento mensal');
      if(comissoes>50)d.risks.push('Volume relevante de comissões para lançamento mensal');
      return d;
    };
    window.FenixPricing.__contractOps=true;
  }

  function bindRecalc(){
    ['contratos_novos','comissoes_lancadas'].forEach(id=>{
      const el=document.getElementById(id);if(!el||el.dataset.recalcBound==='1')return;
      el.dataset.recalcBound='1';
      el.addEventListener('input',()=>{if(typeof window.recalcular==='function'&&!document.getElementById('diagnostico')?.classList.contains('hidden'))window.recalcular()});
    });
  }

  function init(){addVolumeFields();addScopeOptions();patchFormData();patchPricing();bindRecalc();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  [300,900,1800].forEach(ms=>setTimeout(init,ms));
})();
