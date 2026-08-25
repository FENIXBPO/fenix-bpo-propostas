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
  const LOGO='assets/fenix-logo-transparent.webp';
  function applyBranding(){
    if(document.getElementById('fenix-branding'))return;
    const style=document.createElement('style');style.id='fenix-branding';style.textContent=`
      :root{--fenix-navy:#111428;--fenix-navy-2:#171b32;--fenix-gold:#c5a343;--fenix-gold-bright:#e5bd4f;--fenix-gold-soft:#f7efd9;--fenix-silver:#d7d3cb;--fenix-bg:#f5f3ee;--fenix-white:#ffffff;--fenix-text:#171820}
      body{background:var(--fenix-bg)!important;color:var(--fenix-text)!important}
      .top{background:linear-gradient(135deg,#06070d 0%,var(--fenix-navy) 58%,#181d36 100%)!important;border-bottom:3px solid var(--fenix-gold)!important;padding:10px 22px!important;display:flex;align-items:center;gap:16px;min-height:82px}
      .top .fenix-top-logo{width:190px;max-height:62px;object-fit:contain;object-position:left center;display:block}
      .top .fenix-top-copy{display:flex;flex-direction:column;justify-content:center}
      .top .fenix-top-copy strong{letter-spacing:.2px;color:#fff;font-size:17px}.top .fenix-top-copy small{color:#e7e7ea!important;opacity:.9!important;margin-top:3px}
      .card{border:1px solid #e8e2d7!important;box-shadow:0 5px 18px rgba(16,19,38,.07)!important}
      .section{color:var(--fenix-navy)!important;border-bottom-color:#e5dccb!important}
      .section:before{content:'';display:inline-block;width:18px;height:2px;background:var(--fenix-gold);vertical-align:middle;margin-right:7px}
      .primary,.green{background:var(--fenix-navy)!important;color:white!important;border:1px solid var(--fenix-navy)!important}
      .primary:hover,.green:hover{background:#1c2240!important}
      .ghost{color:var(--fenix-navy)!important;border-color:#cfc7b8!important}
      .metric{background:linear-gradient(180deg,#fff 0%,#faf8f3 100%)!important;border-color:#e7dfd0!important}
      .metric span{color:#6f6a61!important}.metric strong{color:var(--fenix-navy)!important}
      .proposal h1,.proposal h2{color:var(--fenix-navy)!important}.proposal h2{border-bottom:2px solid var(--fenix-gold)!important}
      .proposal h3{color:#2a2d3f!important}.proposal strong{color:var(--fenix-navy)}
      .proposal [data-faturamento-proposta]{background:var(--fenix-gold-soft)!important;border:1px solid #ddc98d!important}
      .fenix-proposal-brand{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:8px 0 18px;margin-bottom:18px;border-bottom:2px solid var(--fenix-gold)}
      .fenix-proposal-brand img{width:220px;max-height:90px;object-fit:contain;object-position:left center}.fenix-proposal-brand .brand-note{text-align:right;color:#6a665e;font-size:12px;line-height:1.4}
      .ok{background:#f4f8f6!important;border-color:#b8d0c4!important}.warn{background:#fff8e8!important;border-color:#e4c77e!important}
      input:focus,select:focus,textarea:focus{outline:none!important;border-color:var(--fenix-gold)!important;box-shadow:0 0 0 3px rgba(197,163,67,.18)!important}
      @media(max-width:650px){.top{align-items:flex-start}.top .fenix-top-logo{width:150px}.fenix-proposal-brand{align-items:flex-start;flex-direction:column}.fenix-proposal-brand .brand-note{text-align:left}}
      @media print{body{background:#fff!important}.top{display:none!important}.actions,.internal,#diagnostico{display:none!important}.card{box-shadow:none!important;border:0!important}.proposal h2{break-after:avoid}.fenix-proposal-brand{display:flex!important}.fenix-proposal-brand img{width:200px!important}}
    `;document.head.appendChild(style);
  }
  function applyHeaderLogo(){
    const top=document.querySelector('.top');if(!top||top.querySelector('.fenix-top-logo'))return;
    const logo=document.createElement('img');logo.src=LOGO;logo.alt='Fênix Intelligent BPO';logo.className='fenix-top-logo';
    const copy=document.createElement('div');copy.className='fenix-top-copy';copy.innerHTML='<strong>Diagnóstico CFO e Propostas</strong><small>Coleta → Diagnóstico CFO → Comercial → Proposta</small>';
    top.innerHTML='';top.appendChild(logo);top.appendChild(copy);
  }
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
  function addProposalBrand(proposal){
    if(!proposal||proposal.querySelector('.fenix-proposal-brand'))return;
    const brand=document.createElement('div');brand.className='fenix-proposal-brand';
    brand.innerHTML='<img src="'+LOGO+'" alt="Fênix Intelligent BPO"><div class="brand-note">Proposta Comercial<br>Apoio administrativo-financeiro com inteligência e tecnologia</div>';
    proposal.prepend(brand);
  }
  function enhanceProposal(){
    if(typeof window.gerarProposta!=='function'||window.gerarProposta.__enhanced)return;
    const original=window.gerarProposta;
    const wrapped=async function(){
      const r=await original.apply(this,arguments);
      const proposal=document.getElementById('proposal');
      normalizeProposalLanguage(proposal);addProposalBrand(proposal);
      if(proposal&&proposal.children.length&&!proposal.querySelector('[data-faturamento-proposta]')){
        const box=document.createElement('div');box.setAttribute('data-faturamento-proposta','1');box.style.cssText='border-radius:10px;padding:12px 14px;margin:12px 0 18px';
        box.innerHTML='<strong>Faturamento médio informado:</strong> '+money(moneyFromInput(document.getElementById('faturamento')?.value));
        const first=proposal.querySelector('h1,h2');if(first&&first.nextSibling)proposal.insertBefore(box,first.nextSibling);else proposal.appendChild(box);
      }
      return r;
    };
    wrapped.__enhanced=true;window.gerarProposta=wrapped;
  }
  function init(){applyBranding();applyHeaderLogo();enhanceRamo();enhanceEscopo();enhanceRecalculo();enhanceProposal()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
