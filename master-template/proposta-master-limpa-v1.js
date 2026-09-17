const qs=new URLSearchParams(location.search);
const ref=qs.get('ref');
const demo=qs.get('demo')==='1';
const FIXED={
  technology:{summary:'A tecnologia apoia a organização, a padronização e a rastreabilidade das rotinas financeiras, sempre combinada com acompanhamento operacional humano.',processes:'Informações estruturadas em ambiente definido para a operação.',automation:'Rotinas executadas de acordo com critérios e fluxos estabelecidos.',ai:'Apoio tecnológico para aumentar controle e consistência das informações.',data:'Registro das atividades e informações relevantes da operação.',decision:'Dados financeiros organizados para apoiar o cliente em suas próprias análises e decisões.'},
  implementation:{subtitle:'A implantação organiza a base necessária para o início das rotinas recorrentes, reduzindo riscos, dúvidas operacionais e retrabalho.',steps:['Validação das informações, confirmação do escopo, definição dos responsáveis e organização dos acessos necessários.','Organização da rotina operacional, cadastros, parametrizações e fluxo de documentos e informações.','Início das atividades contratadas, acompanhamento inicial e ajustes operacionais dentro do escopo aprovado.']},
  closing:{message:'Estamos prontos para apoiar sua operação com mais organização financeira, previsibilidade e inteligência operacional.',steps:['Validação final da proposta pelo cliente.','Registro do aceite comercial.','Validação final FÊNIX / CFO.','Emissão e formalização do contrato.']}
};
function text(id,value){const el=document.getElementById(id);if(el&&value!==undefined&&value!==null)el.textContent=value}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function list(id,items,emptyLabel=''){const el=document.getElementById(id);if(!el)return 0;const clean=(items||[]).filter(Boolean);el.innerHTML=clean.length?clean.map(x=>`<li>${escapeHtml(x)}</li>`).join(''):(emptyLabel?`<li class="empty-state">${escapeHtml(emptyLabel)}</li>`:'');return clean.length}
function money(n){return 'R$ '+Number(n||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:2})}
function sentence(s){s=String(s||'').trim();if(!s)return'';return s.charAt(0).toUpperCase()+s.slice(1).replace(/[.\s]+$/,'')+'.'}
function buildContext(p){const c=p.client||{},ctx=p.context||{};const name=c.name||c.razao_social||'O cliente';const parts=[];if(ctx.description)parts.push(sentence(ctx.description));if(ctx.pain)parts.push('O principal desafio identificado é '+sentence(String(ctx.pain).toLowerCase()));if(ctx.expectation)parts.push('A expectativa em relação à FÊNIX é '+sentence(String(ctx.expectation).toLowerCase()));return `${name}${c.segment?`, do segmento de ${String(c.segment).toLowerCase()}`:''}, apresentou o seguinte contexto: ${parts.join(' ')}`.trim()}
function fill(p){const c=p.client||{},t=p.commercial_terms||{},s=p.scope||{};
  text('clientName',(c.name||c.razao_social||'[NOME DO CLIENTE]').toUpperCase());
  text('clientLegal',c.razao_social||c.name||'[RAZÃO SOCIAL]');
  text('segment',c.segment||'[SEGMENTO]');
  text('proposalDate',new Date(p.published_at||Date.now()).toLocaleDateString('pt-BR'));
  text('contextSummary',buildContext(p));
  text('controlMsg',p.context?.description||'Rotinas e controles atuais considerados no desenho da operação.');
  text('predictMsg',p.context?.pain||'Pontos de atenção identificados a partir da coleta e da análise.');
  text('decisionMsg',p.context?.expectation||'Objetivo definido para uma operação mais organizada e previsível.');
  list('operationalScope',s.operational||[],'Nenhuma atividade operacional aprovada.');
  list('managerialScope',s.managerial||[],'Nenhum item gerencial adicional aprovado neste pacote.');
  text('scopeNote','Escopo aprovado pelo CFO. Alterações relevantes de volume ou atividades exigem revisão prévia.');
  text('technologySummary',FIXED.technology.summary);
  text('techProcesses',FIXED.technology.processes);text('techAutomation',FIXED.technology.automation);text('techAi',FIXED.technology.ai);text('techData',FIXED.technology.data);text('techDecision',FIXED.technology.decision);
  text('implementationSubtitle',FIXED.implementation.subtitle);FIXED.implementation.steps.forEach((v,i)=>text('step'+(i+1),v));
  text('softwareName',t.software_name||'Conforme operação');
  const fenixMonthly=Number(t.final_monthly||t.monthly_fee||0),software=Number(t.software_total||0),implementation=Number(t.implementation||0),totalMonthly=fenixMonthly+software;
  text('fenixMonthly',money(fenixMonthly)+'/mês');text('softwareValue',money(software)+'/mês');text('implementation',money(implementation));text('totalMonthly',money(totalMonthly)+'/mês');
  const softwareBox=document.getElementById('softwareBox');if(softwareBox)softwareBox.style.display=software>0?'':'none';
  text('commercialNote','Valores de software, ERP ou outros repasses são demonstrados separadamente e não compõem a receita da FÊNIX. A implantação é pagamento único e não integra o total mensal.');
  text('closingMessage',FIXED.closing.message);FIXED.closing.steps.forEach((v,i)=>text('next'+(i+1),v));
}
const DEMO={published_at:'2026-09-17T12:00:00.000Z',client:{name:'CLÍNICA HORIZONTE LTDA',razao_social:'CLÍNICA HORIZONTE LTDA',segment:'Saúde'},context:{description:'Operação financeira com necessidade de maior organização das rotinas recorrentes e melhor estruturação das informações.',pain:'reduzir retrabalho, aumentar rastreabilidade e ganhar previsibilidade',expectation:'estruturar uma rotina financeira organizada, documentada e acompanhável'},commercial_terms:{final_monthly:2300,implementation:2500,software_name:'Conta Azul',software_total:200},scope:{operational:['Contas a pagar e receber','Conciliação bancária conforme frequência definida','Lançamentos e organização das movimentações','Acompanhamento de pendências operacionais','Organização de documentos financeiros'],managerial:['Organização das informações para acompanhamento','Fluxo de caixa operacional conforme escopo aprovado']}};
async function init(){if(demo){fill(DEMO);return}if(!ref)return;try{const r=await fetch('/api/public-proposal?ref='+encodeURIComponent(ref),{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Falha ao carregar proposta');fill(d.proposal)}catch(err){console.error(err)}}
init();
