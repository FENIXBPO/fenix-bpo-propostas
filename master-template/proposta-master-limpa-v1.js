const qs=new URLSearchParams(location.search);
const ref=qs.get('ref');
const demo=qs.get('demo')==='1';

const FIXED={
  fenixResponsibilities:[
    'Executar as rotinas previstas no escopo aprovado.',
    'Organizar lançamentos, documentos, conciliações e informações.',
    'Preparar pagamentos para aprovação do cliente.',
    'Apontar divergências, pendências e necessidades operacionais.'
  ],
  clientResponsibilities:[
    'Autorizações e liberações de pagamentos.',
    'Movimentação de recursos e decisões sobre caixa.',
    'Decisões gerenciais, comerciais e contratuais.',
    'Veracidade e tempestividade das informações fornecidas.'
  ],
  technology:{
    summary:'Processos bem definidos ganham escala com automação. A IA apoia leitura, organização e classificação de informações; dados estruturados fortalecem o acompanhamento e a tomada de decisão.',
    processes:'Rotinas definidas, padrões e calendário operacional.',
    automation:'Menos repetição manual, retrabalho e mais consistência.',
    ai:'Apoio à leitura, classificação e organização das informações.',
    data:'Informações consolidadas para acompanhamento do negócio.',
    decision:'Base mais confiável para análises e decisões do cliente.'
  },
  implementation:{
    subtitle:'Da aprovação à entrada em operação, seguimos um fluxo simples e estruturado.',
    steps:[
      'Validação do escopo, premissas e condições comerciais.',
      'Formalização contratual e pagamentos iniciais definidos na proposta.',
      'Alinhamento inicial, acessos, parametrização e organização dos fluxos.',
      'Entrada em rotina com calendário de entregas e acompanhamento.'
    ]
  },
  closing:{
    message:'Estamos prontos para apoiar sua operação com mais organização financeira, previsibilidade e inteligência operacional.',
    steps:[
      'Validação final desta proposta pelo cliente.',
      'O aceite segue para validação interna da FÊNIX.',
      'Após autorização do CFO, o contrato é gerado.',
      'Implantação e entrada em operação.'
    ],
    institutional:'Organização financeira, processos inteligentes e informação para decisões melhores.'
  }
};

function text(id,value){const el=document.getElementById(id);if(el&&value!==undefined&&value!==null)el.textContent=value;}
function list(id,items){const el=document.getElementById(id);if(!el)return;el.innerHTML=(items||[]).map(x=>`<li>${escapeHtml(String(x))}</li>`).join('');}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function money(n){return 'R$ '+Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:2});}
function fitClientName(){const el=document.getElementById('clientName');if(!el)return;let size=parseFloat(getComputedStyle(el).fontSize);el.style.whiteSpace='normal';el.style.maxHeight='2.05em';el.style.overflow='hidden';while((el.scrollHeight>el.clientHeight||el.scrollWidth>el.clientWidth)&&size>48){size-=2;el.style.fontSize=size+'px';}}

function buildContext(p){const c=p.client||{},ctx=p.context||{};const name=c.name||c.razao_social||'O cliente';const desc=ctx.description?`${ctx.description}. `:'';const pain=ctx.pain?`O principal desafio identificado é ${ctx.pain.toLowerCase()}. `:'';const exp=ctx.expectation?`A expectativa em relação à FÊNIX é ${ctx.expectation.toLowerCase()}.`:'';return `${name} atua no segmento ${c.segment||'informado'} e apresentou o seguinte contexto: ${desc}${pain}${exp}`.trim();}
function contextTitle(p){const pain=(p.context?.pain||'').trim();if(!pain)return 'Mais controle. Mais previsibilidade. Mais clareza para decidir.';return pain.length<52?pain.toUpperCase():'Mais controle. Mais previsibilidade. Mais clareza para decidir.';}

function fill(p){const c=p.client||{},t=p.commercial_terms||{},s=p.scope||{};
  text('clientName',(c.name||c.razao_social||'[NOME DO CLIENTE]').toUpperCase());
  text('clientLegal',c.razao_social||c.name||'[RAZÃO SOCIAL]');
  text('segment',c.segment||'[SEGMENTO]');
  text('proposalDate',new Date(p.published_at||Date.now()).toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}));
  text('p2Title',contextTitle(p));
  text('contextSummary',buildContext(p));
  text('controlMsg','Rotinas padronizadas, conciliações recorrentes e acompanhamento consistente.');
  text('predictMsg','Visão organizada de compromissos, recebimentos e caixa.');
  text('decisionMsg','Informação consolidada para apoiar análises e decisões do cliente.');
  list('operationalScope',s.operational||[]);
  list('managerialScope',s.managerial||[]);
  text('scopeNote','Escopo aprovado pelo CFO. Alterações relevantes de volume ou atividades exigem revisão prévia.');
  list('fenixResponsibilities',FIXED.fenixResponsibilities);
  list('clientResponsibilities',FIXED.clientResponsibilities);
  text('technologySummary',FIXED.technology.summary);text('techProcesses',FIXED.technology.processes);text('techAutomation',FIXED.technology.automation);text('techAi',FIXED.technology.ai);text('techData',FIXED.technology.data);text('techDecision',FIXED.technology.decision);
  text('implementationSubtitle',FIXED.implementation.subtitle);FIXED.implementation.steps.forEach((v,i)=>text('step'+(i+1),v));
  text('cnpjs',t.cnpjs||1);text('limitEach',`${t.launch_limit_per_cnpj||0} lanç./mês`);text('limitGroup',`${t.launch_limit_group||0} lanç./mês`);text('banks',`Até ${t.bank_accounts_included||0} incluídas`);
  text('finalMonthly',money(t.final_monthly)+'/mês');text('perCnpj',`${money(t.per_cnpj)} por CNPJ/mês`);text('baseMonthly',money(t.base_monthly)+'/mês');text('discount',money(t.discount));text('implementation',money(t.implementation));text('softwareName',t.software_name||'Software / ERP');text('softwareValue',money(t.software_total)+'/mês');
  text('commercialNote','Serviços extraordinários, retrabalhos ou atividades fora do escopo somente após autorização prévia do cliente. Alterações relevantes de volume, CNPJs, contas bancárias ou escopo podem gerar revisão comercial.');
  text('closingMessage',FIXED.closing.message);FIXED.closing.steps.forEach((v,i)=>text('next'+(i+1),v));text('institutionalLine',FIXED.closing.institutional);
  fitClientName();
}

const DEMO={published_at:'2026-08-31T18:35:21.152Z',client:{name:'FENIX SERVICOS DE APOIO ADMINISTRATIVO E FINANCEIRO LTDA',razao_social:'FENIX SERVICOS DE APOIO ADMINISTRATIVO E FINANCEIRO LTDA',segment:'Serviços'},context:{description:'Empresa que atua como BPO',pain:'Controlar caixa e ter previsibilidade',expectation:'Me ajudar a controlar empresa e trazer dados reais'},commercial_terms:{cnpjs:1,base_monthly:1800,discount:500,final_monthly:1300,implementation:2500,software_name:'Conta Azul',software_total:200,per_cnpj:1300,launch_limit_per_cnpj:250,launch_limit_group:250,bank_accounts_included:2},scope:{operational:['Conciliação bancária diária','Contas a pagar','Contas a receber','Agendamentos bancários','Lançamentos e organização de despesas','Lançamento de notas','Entrada de notas de compra','Emissão de NFS-e','Interface com contabilidade','Relatório de fluxo de caixa realizado','Contratos a receber','Comissões a pagar','Acompanhamento de parcelas contratuais','Relatório de fluxo de caixa projetado'],managerial:[]}};

async function init(){
  if(demo){fill(DEMO);return;}
  if(!ref)return;
  try{const r=await fetch('/api/public-proposal?ref='+encodeURIComponent(ref));const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao carregar proposta');fill(d.proposal);}catch(err){console.error(err);}
}
window.addEventListener('resize',fitClientName);init();
