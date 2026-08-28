(function(){
  const HELPERS={
    recebimentos:'Considere cobranças, parcelas e demais entradas que precisam ser acompanhadas.',
    pagamentos:'Considere fornecedores, despesas, impostos e demais saídas que precisam ser registradas ou acompanhadas.',
    lancamentos:'Informe outros registros financeiros que não entram nos campos acima.',
    contratos_novos:'Informe quantos contratos novos geram parcelas ou valores a receber e precisam ser cadastrados.',
    comissoes_lancadas:'Informe quantas comissões de vendedores, corretores ou parceiros precisam ser registradas para pagamento.',
    dor_atrasados:'Marque “Sim” se existem lançamentos pendentes, conciliações atrasadas ou informações que precisam ser reorganizadas.'
  };
  const LABELS={
    recebimentos:'Quantos recebimentos sua empresa registra por mês?',
    pagamentos:'Quantos pagamentos sua empresa realiza por mês?',
    lancamentos:'Outros lançamentos financeiros por mês',
    contratos_novos:'Quantos novos contratos precisam ser cadastrados por mês?',
    comissoes_lancadas:'Quantas comissões precisam ser lançadas por mês?',
    dor_atrasados:'Existem lançamentos atrasados ou retrabalho para organizar?'
  };
  const SCOPE={
    'Conciliação bancária diária':['Conciliação bancária diária','Conferência das movimentações bancárias e identificação de divergências.'],
    'Contas a pagar':['Organização de contas a pagar','Controle e acompanhamento dos compromissos financeiros da empresa.'],
    'Contas a receber':['Acompanhamento de contas a receber','Controle dos valores previstos e recebimentos realizados.'],
    'Agendamentos bancários':['Agendamento de pagamentos','Preparação dos pagamentos conforme autorização do cliente.'],
    'Lançamentos e organização de despesas':['Lançamento e organização de despesas','Registro e organização das despesas e documentos financeiros.'],
    'Lançamento de notas':['Lançamento de documentos financeiros','Registro de notas e demais documentos relacionados à operação financeira.'],
    'Entrada de notas de compra':['Entrada de notas de compra','Organização e lançamento das notas de compra recebidas.'],
    'Emissão de NFS-e':['Emissão de NFS-e','Emissão de notas fiscais de serviço conforme informações fornecidas pelo cliente.'],
    'Interface com contabilidade':['Envio de documentos à contabilidade','Organização e envio das informações necessárias para a contabilidade.'],
    'Fluxo de caixa e relatório mensal':['Fluxo de caixa e relatório mensal','Organização das informações para acompanhamento e apoio à decisão.'],
    'Contratos a receber':['Cadastro de contratos e parcelas a receber','Registro dos contratos e das parcelas previstas para recebimento.'],
    'Comissões a pagar':['Lançamento de comissões a pagar','Registro de comissões de vendedores, corretores ou parceiros conforme orientação do cliente.'],
    'Acompanhamento de parcelas contratuais':['Acompanhamento de parcelas contratuais','Controle administrativo das parcelas previstas, recebidas e pendentes.']
  };

  function ensureAlignmentStyles(){
    if(document.getElementById('fenix-form-alignment'))return;
    const style=document.createElement('style');
    style.id='fenix-form-alignment';
    style.textContent=`
      .card .grid{align-items:start}
      .card .grid>.field{display:flex;flex-direction:column;min-width:0;height:100%}
      .card .grid>.field>label{display:flex;align-items:flex-end;min-height:34px;margin-bottom:6px;line-height:1.25}
      .card .grid>.field>input,
      .card .grid>.field>select{height:44px;min-height:44px}
      .card .grid>.field>[data-fenix-helper]{display:block;min-height:31px;margin-top:6px!important}
      @media(max-width:800px){
        .card .grid>.field>label{min-height:auto}
        .card .grid>.field>[data-fenix-helper]{min-height:auto}
      }
    `;
    document.head.appendChild(style);
  }

  function helperFor(field,id){
    if(!field||field.querySelector('[data-fenix-helper="'+id+'"]'))return;
    const text=HELPERS[id];if(!text)return;
    const small=document.createElement('div');small.dataset.fenixHelper=id;small.textContent=text;
    small.style.cssText='font-size:11px;line-height:1.35;color:#77736b;margin-top:6px';
    field.appendChild(small);
  }

  function improveFields(){
    Object.keys(LABELS).forEach(id=>{
      const el=document.getElementById(id);if(!el)return;
      const field=el.closest('.field');if(!field)return;
      const label=field.querySelector('label');if(label)label.textContent=LABELS[id];
      helperFor(field,id);
      if(el.tagName==='INPUT'&&!el.placeholder)el.placeholder='0';
    });
  }

  function improveScope(){
    const card=[...document.querySelectorAll('.card')].find(c=>c.querySelector('.section')?.textContent.includes('Escopo desejado'));
    if(!card)return;
    let intro=card.querySelector('[data-scope-intro]');
    if(!intro){
      intro=document.createElement('div');intro.dataset.scopeIntro='1';
      intro.textContent='Selecione as atividades em que sua empresa precisa de apoio. Você pode marcar mais de uma opção.';
      intro.style.cssText='font-size:13px;color:#66625b;margin:-3px 0 14px;line-height:1.45';
      card.querySelector('.section')?.insertAdjacentElement('afterend',intro);
    }
    const grid=card.querySelector('.grid');if(!grid)return;
    grid.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';
    grid.style.gap='10px';
    [...grid.querySelectorAll('label.check')].forEach(label=>{
      const input=label.querySelector('input[name="escopo"]');if(!input)return;
      const copy=SCOPE[input.value];if(!copy)return;
      label.style.cssText='display:flex;align-items:flex-start;gap:10px;margin:0;padding:12px 13px;border:1px solid #e5ded1;border-radius:10px;background:#fff;cursor:pointer;min-height:72px';
      input.style.cssText='width:16px!important;height:16px!important;min-width:16px!important;flex:0 0 16px!important;margin:2px 0 0!important;padding:0!important';
      let wrap=label.querySelector('[data-scope-copy]');
      if(!wrap){wrap=document.createElement('span');wrap.dataset.scopeCopy='1';while(input.nextSibling)input.nextSibling.remove();label.appendChild(wrap)}
      wrap.innerHTML='<strong style="display:block;font-size:13px;color:#272a34;margin-bottom:3px">'+copy[0]+'</strong><small style="display:block;font-size:11px;line-height:1.35;color:#77736b">'+copy[1]+'</small>';
    });
    if(!document.getElementById('fenix-scope-responsive')){
      const style=document.createElement('style');style.id='fenix-scope-responsive';style.textContent='@media(max-width:800px){.card:has(.section) .grid{grid-template-columns:1fr}.check[data-contract-scope],label.check{min-height:auto!important}}';document.head.appendChild(style);
    }
  }

  function init(){ensureAlignmentStyles();improveFields();improveScope()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  [300,900,1800].forEach(ms=>setTimeout(init,ms));
})();
