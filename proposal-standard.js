(function(){
  function money(n){return Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}

  function replaceText(root,replacements){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      let value=node.nodeValue||'';
      replacements.forEach(([from,to])=>{ value=value.replace(from,to); });
      node.nodeValue=value;
    });
  }

  function scopeLabel(value){
    const map={
      'Agendamentos bancários':'Agendamento de pagamentos conforme autorização do cliente',
      'Interface com contabilidade':'Organização e envio de documentos e informações para a contabilidade',
      'Contas a pagar':'Organização e acompanhamento de contas a pagar',
      'Contas a receber':'Acompanhamento de contas a receber',
      'Lançamento de notas':'Lançamento de notas e documentos financeiros',
      'Entrada de notas de compra':'Entrada e organização de notas de compra'
    };
    return map[value]||value;
  }

  function addPremises(root){
    if(!root||root.querySelector('[data-fenix-premissas]'))return;
    const f=typeof window.formData==='function'?window.formData():null;
    if(!f)return;
    const d=window.diag||null;
    const h=document.createElement('h2');
    h.textContent='PREMISSAS DA PROPOSTA';
    h.setAttribute('data-fenix-premissas','1');
    const ul=document.createElement('ul');
    const items=[
      ['Faturamento médio informado', money(String(f.faturamento||'0').replace(/\./g,'').replace(',','.'))],
      ['Volume estimado', d?`${d.movements} movimentos/mês`:'conforme dados informados'],
      ['Complexidade operacional', d?d.complexity:'conforme diagnóstico'],
      ['Escopo considerado','conforme atividades descritas nesta proposta']
    ];
    items.forEach(([label,value])=>{const li=document.createElement('li');li.innerHTML=`<strong>${label}:</strong> ${value}`;ul.appendChild(li)});

    const understanding=[...root.querySelectorAll('h2')].find(x=>/ENTENDIMENTO DO CENÁRIO/i.test(x.textContent||''));
    if(understanding){root.insertBefore(h,understanding);root.insertBefore(ul,understanding)}
    else {root.prepend(ul);root.prepend(h)}
  }

  function removeLooseFaturamentoBox(root){
    root?.querySelectorAll('[data-faturamento-proposta]').forEach(el=>el.remove());
  }

  function strengthenLimits(root){
    if(!root)return;
    const h=[...root.querySelectorAll('h2')].find(x=>/FORMA DE TRABALHO E LIMITES/i.test(x.textContent||''));
    if(!h)return;
    let node=h.nextElementSibling;
    while(node && !/^H2$/.test(node.tagName)){
      const next=node.nextElementSibling;
      if(node.tagName==='P' && /Importante:/i.test(node.textContent||'')) node.remove();
      node=next;
    }
    const p=document.createElement('p');
    p.innerHTML='<strong>Limites de atuação:</strong> A FENIX INTELLIGENT BPO atua como prestadora de serviços de apoio administrativo-financeiro. A autorização de pagamentos, aprovação de despesas, movimentação de recursos, definição de prioridades financeiras e demais decisões gerenciais permanecem sob responsabilidade exclusiva do cliente.';
    h.insertAdjacentElement('afterend',p);
  }

  function addCommercialProtection(root){
    if(!root)return;
    const h=[...root.querySelectorAll('h2')].find(x=>/INVESTIMENTO/i.test(x.textContent||''));
    if(!h)return;
    let last=h;
    let node=h.nextElementSibling;
    while(node && node.tagName!=='H2'){last=node;node=node.nextElementSibling}
    const p=document.createElement('p');
    p.setAttribute('data-fenix-volume-note','1');
    p.innerHTML='<strong>Premissa comercial:</strong> Os valores apresentados consideram as premissas de volume e escopo desta proposta. Alterações relevantes de volumetria, quantidade de empresas, bancos, cartões, centros de custo ou atividades poderão resultar em revisão comercial, mediante alinhamento prévio com o cliente.';
    last.insertAdjacentElement('afterend',p);
  }

  function normalizeScope(root){
    const scopeHeading=[...root.querySelectorAll('h2')].find(x=>/ESCOPO APROVADO/i.test(x.textContent||''));
    if(!scopeHeading)return;
    let node=scopeHeading.nextElementSibling;
    while(node && node.tagName!=='H2'){
      if(node.tagName==='UL'){
        node.querySelectorAll('li').forEach(li=>{li.textContent=scopeLabel((li.textContent||'').trim())});
      }
      node=node.nextElementSibling;
    }
  }

  function standardizeProposal(){
    const root=document.getElementById('proposal');
    if(!root||!root.children.length)return;
    replaceText(root,[
      [/Fenix BPO Financeiro/gi,'FENIX INTELLIGENT BPO'],
      [/Fênix BPO Financeiro/gi,'FENIX INTELLIGENT BPO'],
      [/Fenix BPO/gi,'FENIX INTELLIGENT BPO'],
      [/Informações confiáveis e atualizado/gi,'Informações confiáveis e atualizadas'],
      [/Conformidade nas movimentações e registros/gi,'Padronização e rastreabilidade dos registros'],
      [/Interface com contabilidade/gi,'Organização e envio de documentos e informações para a contabilidade'],
      [/Agendamentos bancários/gi,'Agendamento de pagamentos conforme autorização do cliente']
    ]);
    removeLooseFaturamentoBox(root);
    normalizeScope(root);
    addPremises(root);
    strengthenLimits(root);
    addCommercialProtection(root);

    const status=document.getElementById('status');
    if(status && /aprovação interna/i.test(status.textContent||'')) status.innerHTML='';
  }

  function hook(){
    if(typeof window.gerarProposta!=='function' || window.gerarProposta.__fenixStandard)return false;
    const original=window.gerarProposta;
    const wrapped=async function(){
      const result=await original.apply(this,arguments);
      standardizeProposal();
      setTimeout(standardizeProposal,120);
      setTimeout(standardizeProposal,500);
      return result;
    };
    wrapped.__fenixStandard=true;
    window.gerarProposta=wrapped;
    return true;
  }

  function init(){
    if(!hook()) [100,300,700,1200,2000].forEach(ms=>setTimeout(hook,ms));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
