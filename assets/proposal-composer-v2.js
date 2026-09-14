(()=>{
/* FÊNIX Proposal Composer V2 — régua editorial executiva.
   Princípio: o layout e a tipografia permanecem estáveis; o conteúdo é que se adapta.
   A coleta é fonte de verdade. O Composer prioriza, resume e agrupa, sem inventar escopo. */
const arr=v=>Array.isArray(v)?v.filter(Boolean).map(x=>String(x).trim()).filter(Boolean):[];
const uniq=a=>[...new Set(a)];
const clean=v=>String(v||'').replace(/\s+/g,' ').trim();
const capWords=(v,max)=>{let s=clean(v);if(s.length<=max)return s;let cut=s.slice(0,max+1),i=cut.lastIndexOf(' ');if(i>max*.65)cut=cut.slice(0,i);return cut.replace(/[,:;\-\s]+$/,'')+'…'};
const sentence=v=>{const s=clean(v);if(!s)return'';return s.charAt(0).toUpperCase()+s.slice(1).replace(/[.\s]+$/,'')+'.'};
const has=(text,re)=>re.test(String(text||''));
function splitScope(items){const docs=[],oper=[];for(const item of arr(items)){if(/nota|contabil|document|contrato|nfs|interface/i.test(item))docs.push(item);else oper.push(item)}return{oper,docs}}
function editorialList(items,max,overflowLabel='Demais atividades conforme escopo aprovado.'){
  const src=uniq(arr(items));
  if(src.length<=max)return src;
  return [...src.slice(0,Math.max(1,max-1)),overflowLabel];
}
function executiveChallenges(ctx,objectives){
  const evidence=[clean(ctx.pain),...objectives].filter(Boolean).join(' | ');
  const out=[];
  if(has(evidence,/retrabalho|padroniza|organiza|process/i))out.push('Retrabalho e falta de padronização');
  if(has(evidence,/previs|caixa|receb|pag/i))out.push('Baixa previsibilidade financeira');
  if(has(evidence,/relat|gerenc|visib|dados|decis/i))out.push('Pouca visibilidade gerencial');
  if(!out.length&&ctx.pain)out.push(capWords(ctx.pain,78));
  for(const x of objectives){if(out.length>=3)break;const v=capWords(x,78);if(v&&!out.some(y=>y.toLowerCase()===v.toLowerCase()))out.push(v)}
  return out.slice(0,3);
}
function executiveContext(c,ctx,objectives){
  if(ctx.description)return sentence(capWords(ctx.description,185));
  if(ctx.pain)return sentence(`A operação apresenta ${capWords(String(ctx.pain).toLowerCase(),135)}`);
  if(objectives.length)return sentence(`${c.name||c.razao_social||'O cliente'} busca ${capWords(objectives.slice(0,2).join(' e ').toLowerCase(),135)}`);
  return `${c.name||c.razao_social||'O cliente'} busca organizar sua rotina financeira e ampliar a visibilidade da operação.`;
}
function executiveGoal(ctx,objectives){
  if(ctx.expectation)return sentence(capWords(ctx.expectation,175));
  const evidence=objectives.join(' | ');
  if(has(evidence,/relat|gerenc|dados|decis/i))return 'Estruturar a operação financeira, gerar informação confiável e apoiar a gestão.';
  if(has(evidence,/previs|caixa/i))return 'Organizar a rotina financeira e ampliar a previsibilidade da operação.';
  return 'Estruturar processos financeiros, reduzir retrabalho e dar mais clareza à operação.';
}
function compose(p){
  const c=p.client||{},t=p.commercial_terms||{},s=p.scope||{},op=p.operation||{},ctx=p.context||{};
  const objectives=uniq(arr(op.objectives));
  const scoped=splitScope(s.operational||[]);
  const rawOperational=scoped.oper.length?scoped.oper:['Conciliação bancária diária','Contas a pagar','Contas a receber','Agendamentos bancários','Lançamentos e organização financeira'];
  const rawDocuments=scoped.docs.length?scoped.docs:['Entrada de notas de compra','Emissão de notas fiscais de serviço (NFS-e)','Fechamento e interface com a contabilidade'];
  const rawManagerial=arr(s.managerial);
  const operational=editorialList(rawOperational,5);
  const documents=editorialList(rawDocuments,4);
  const managerial=editorialList(rawManagerial,4,'Demais entregas gerenciais conforme escopo aprovado.');

  const challenges=executiveChallenges(ctx,objectives);
  const context=executiveContext(c,ctx,objectives);
  const goal=executiveGoal(ctx,objectives);

  const fenix=[
    'Organizar e executar a rotina financeira.',
    'Conciliar, controlar e estruturar informações.',
    'Preparar relatórios e visão gerencial.',
    'Apoiar a gestão com inteligência operacional.'
  ];
  const client=[
    'Definir prioridades e diretrizes.',
    'Autorizar pagamentos e decisões de caixa.',
    'Disponibilizar documentos, acessos e informações.',
    'Aprovar mudanças extraordinárias de escopo.'
  ];

  const system=clean(op.system_current)||'Sistema não informado';
  const ca={sim:'Conta Azul em uso',pretende:'Conta Azul previsto',nao:'Conta Azul não utilizado'}[op.conta_azul_usage]||'Situação a validar';
  const tech={
    processes:'Rotinas padronizadas e previsibilidade operacional.',
    automation:'Menos retrabalho nas atividades recorrentes.',
    ai:'Organização e leitura de informações operacionais.',
    data:system==='Sistema não informado'?'Integração com as ferramentas da operação.':`Integração com ${capWords(system,55)} e demais ferramentas da operação.`,
    decision:'Informação estruturada para apoiar decisões.'
  };
  const steps=[
    'Definição de escopo, responsáveis e cronograma.',
    'Recebimento de documentos, acessos e sistemas.',
    'Organização da rotina, testes e ajustes.',
    'Entrada assistida e estabilização do processo.'
  ];
  const pricing={
    cnpjs:Math.max(1,Number(t.cnpjs||1)),
    banks:Number(t.bank_accounts_included||0),
    limit:Number(t.launch_limit_group||0),
    monthly:Number(t.final_monthly||0),
    software:Number(t.software_total||0),
    implementation:Number(t.implementation||0),
    softwareName:t.software_name||'Software / ERP'
  };

  /* A régua tipográfica fica NORMAL. A adaptação acontece editorialmente, não por redução de fonte. */
  const pages={2:{density:'normal'},3:{density:'normal'},4:{density:'normal'},5:{density:'normal'},6:{density:'normal'},7:{density:'normal'},8:{density:'normal'}};

  return{
    client:{name:c.name||c.razao_social||'[NOME DO CLIENTE]',legal:c.razao_social||c.name||'',segment:c.segment||'Não informado',responsible:c.responsavel||''},
    context:{summary:context,challenges,goal,objectives:editorialList(objectives,4,'Outros objetivos conforme diagnóstico.')},
    scope:{operational,documents,managerial},
    responsibilities:{fenix,client},
    technology:{...tech,system,ca},
    implementation:{steps},
    pricing,pages,
    closing:'Confirmamos o aceite desta proposta comercial e autorizamos o avanço para validação FÊNIX/CFO e etapa contratual.'
  };
}
window.FenixProposalComposer={compose};
})();