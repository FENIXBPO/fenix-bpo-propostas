(function(){
  function moneyFromInput(v){
    const n=Number(String(v||'').replace(/\./g,'').replace(',','.'));
    return Number.isFinite(n)?n:0;
  }
  function money(n){return Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
  const RAMOS=['Selecione...','Serviços','Comércio','Indústria','Saúde','Tecnologia','Construção','Transporte e Logística','Alimentação','Educação','Imobiliário','Profissionais Liberais','Terceiro Setor','Outro'];
  const ESCOPO=[
    ['Conciliação bancária diária','Conciliação bancária diária'],
    ['Contas a pagar','Contas a pagar — organização e acompanhamento'],
    ['Contas a receber','Contas a receber — acompanhamento de recebimentos'],
    ['Agendamentos bancários','Agendamento de pagamentos conforme autorização do cliente'],
    ['Lançamentos e organização de despesas','Lançamento e organização de despesas'],
    ['Lançamento de notas','Lançamento de notas e documentos financeiros'],
    ['Entrada de notas de compra','Entrada e organização de notas de compra'],
    ['Emissão de NFS-e','Emissão de notas fiscais de serviço (NFS-e)'],
    ['Interface com contabilidade','Envio e organização de documentos para a contabilidade'],
    ['Fluxo de caixa e relatório mensal','Fluxo de caixa e relatório mensal de apoio à decisão']
  ];
  function enhanceRamo(){
    const old=document.getElementById('ramos');
    if(!old||old.tagName==='SELECT')return;
    const sel=document.createElement('select');sel.id='ramos';sel.name='ramos';
    RAMOS.forEach(x=>{const o=document.createElement('option');o.value=x==='Selecione...'?'':x;o.textContent=x;sel.appendChild(o)});
    old.replaceWith(sel);
  }
  function enhanceEscopo(){
    const cards=[...document.querySelectorAll('.card')];
    const card=cards.find(c=>{const s=c.querySelector('.section');return s&&s.textContent.includes('Escopo desejado')});
    const grid=card&&card.querySelector('.grid');if(!grid)return;
    grid.innerHTML='';
    ESCOPO.forEach(([value,label])=>{const l=document.createElement('label');l.className='check';const i=document.createElement('input');i.type='checkbox';i.name='escopo';i.value=value;l.appendChild(i);l.appendChild(document.createTextNode(label));grid.appendChild(l)});
  }
  function enhanceRecalculo(){
    if(typeof window.recalcular!=='function'||window.recalcular.__enhanced)return;
    const original=window.recalcular;
    const wrapped=function(){
      const r=original.apply(this,arguments);
      const metrics=document.getElementById('metrics');
      if(metrics){
        const previous=metrics.querySelector('[data-faturamento-medio]');if(previous)previous.remove();
        const box=document.createElement('div');box.className='metric';box.setAttribute('data-faturamento-medio','1');
        box.innerHTML='<span>Faturamento médio</span><strong>'+money(moneyFromInput(document.getElementById('faturamento')?.value))+'</strong>';
        metrics.appendChild(box);
      }
      return r;
    };
    wrapped.__enhanced=true;window.recalcular=wrapped;
  }
  function normalizeProposalLanguage(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      node.nodeValue=node.nodeValue
        .replace(/otimizar os processos financeiros e administrativos/gi,'estruturar e otimizar as rotinas administrativo-financeiras')
        .replace(/processos financeiros e administrativos/gi,'rotinas administrativo-financeiras')
        .replace(/saúde financeira operacional/gi,'visibilidade das informações e do fluxo financeiro')
        .replace(/saúde financeira/gi,'visibilidade financeira');
    });
  }
  function enhanceProposal(){
    if(typeof window.gerarProposta!=='function'||window.gerarProposta.__enhanced)return;
    const original=window.gerarProposta;
    const wrapped=async function(){
      const r=await original.apply(this,arguments);
      const proposal=document.getElementById('proposal');
      normalizeProposalLanguage(proposal);
      if(proposal&&proposal.children.length&&!proposal.querySelector('[data-faturamento-proposta]')){
        const box=document.createElement('div');box.setAttribute('data-faturamento-proposta','1');
        box.style.cssText='background:#f8f7f4;border:1px solid #ebe7dd;border-radius:10px;padding:12px 14px;margin:12px 0 18px';
        box.innerHTML='<strong>Faturamento médio informado:</strong> '+money(moneyFromInput(document.getElementById('faturamento')?.value));
        const first=proposal.querySelector('h1,h2');if(first&&first.nextSibling)proposal.insertBefore(box,first.nextSibling);else proposal.prepend(box);
      }
      return r;
    };
    wrapped.__enhanced=true;window.gerarProposta=wrapped;
  }
  function init(){enhanceRamo();enhanceEscopo();enhanceRecalculo();enhanceProposal()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
