(()=>{
const cap=(s,n)=>String(s||'').trim().slice(0,n);
const arr=(v)=>Array.isArray(v)?v.filter(Boolean).map(x=>String(x).trim()).filter(Boolean):[];
const uniq=(a)=>[...new Set(a)];
const sentence=v=>{v=String(v||'').trim();if(!v)return'';return v.charAt(0).toUpperCase()+v.slice(1).replace(/[.\s]+$/,'')+'.'};
function splitScope(items){const docs=[],oper=[];for(const item of arr(items)){if(/nota|contabil|document|contrato|nfs|interface/i.test(item))docs.push(item);else oper.push(item)}return{oper,docs}}
function density(count,chars){if(count<=3&&chars<220)return'compact';if(count<=6&&chars<520)return'normal';return'dense'}
function compose(p){const c=p.client||{},t=p.commercial_terms||{},s=p.scope||{},op=p.operation||{},ctx=p.context||{};const objectives=arr(op.objectives);const scoped=splitScope(s.operational||[]);
const operational=uniq(scoped.oper.length?scoped.oper:['Conciliação bancária diária','Contas a pagar','Contas a receber','Agendamentos bancários','Lançamentos e organização financeira']);
const documents=uniq(scoped.docs.length?scoped.docs:['Entrada de notas de compra','Emissão de notas fiscais de serviço (NFS-e)','Fechamento e interface com a contabilidade']);
const managerial=uniq(arr(s.managerial));
const contextParts=[];if(ctx.description)contextParts.push(sentence(cap(ctx.description,260)));if(ctx.pain)contextParts.push('O principal desafio identificado é '+sentence(cap(String(ctx.pain).toLowerCase(),140)));
const context=contextParts.join(' ')||`${c.name||c.razao_social||'O cliente'} busca organizar sua rotina financeira e ampliar a visibilidade da operação.`;
const challenges=uniq([ctx.pain,objectives.find(x=>/organiza|process|retrabalho/i.test(x)),objectives.find(x=>/previs|caixa|receb/i.test(x))].filter(Boolean)).slice(0,3);
const goal=cap(ctx.expectation||objectives.find(x=>/relat|gerenc|dados|decis/i.test(x))||'Estruturar a operação financeira, organizar processos e gerar informação confiável para apoiar a gestão.',240);
const fenix=['Organiza a rotina financeira.','Executa conciliações, controles e lançamentos.','Prepara informações, agenda e fluxo operacional.','Estrutura relatórios e apoio gerencial.'];if(objectives.some(x=>/decis|gerenc|relat/i.test(x)))fenix.push('Apoia a gestão com inteligência operacional.');
const client=['Define prioridades e diretrizes.','Autoriza pagamentos e decisões de caixa.','Disponibiliza documentos, acessos e informações.','Valida premissas e cronogramas.','Aprova alterações extraordinárias de escopo.'];
const system=op.system_current||'Sistema não informado',ca={sim:'Conta Azul em uso',pretende:'Conta Azul previsto',nao:'Conta Azul não utilizado'}[op.conta_azul_usage]||'Situação a validar';
const tech={processes:'Rotinas padronizadas, organização e previsibilidade operacional.',automation:'Menos retrabalho e mais eficiência nas atividades recorrentes.',ai:'Apoio à leitura, organização e análise de informações operacionais.',data:`Integração com ${system}${/conta azul/i.test(system)?'':', Conta Azul e outras ferramentas da operação'}.`,decision:objectives.some(x=>/relat|gerenc/i.test(x))?'Visão estruturada para acompanhar indicadores e apoiar decisões.':'Informação organizada para acompanhamento da operação.'};
const steps=['Kick-off, definição de responsáveis, escopo e agenda de implantação.','Recebimento de documentos, acessos bancários, ERP e organização da base.','Configuração da rotina, calendário financeiro, testes e ajustes operacionais.','Entrada assistida em produção, acompanhamento inicial e estabilização da rotina.'];
const pricing={cnpjs:Math.max(1,Number(t.cnpjs||1)),banks:Number(t.bank_accounts_included||0),limit:Number(t.launch_limit_group||0),monthly:Number(t.final_monthly||0),software:Number(t.software_total||0),implementation:Number(t.implementation||0),softwareName:t.software_name||'Software / ERP'};
const pages={2:{density:density(3,context.length+challenges.join('').length+goal.length)},3:{density:density(operational.length+documents.length+managerial.length,[...operational,...documents,...managerial].join('').length)},4:{density:density(fenix.length+client.length,[...fenix,...client].join('').length)},5:{density:'normal'},6:{density:'normal'},7:{density:'normal'},8:{density:'normal'}};
return{client:{name:c.name||c.razao_social||'[NOME DO CLIENTE]',legal:c.razao_social||c.name||'',segment:c.segment||'Não informado',responsible:c.responsavel||''},context:{summary:context,challenges,goal,objectives},scope:{operational,documents,managerial},responsibilities:{fenix,client},technology:{...tech,system,ca},implementation:{steps},pricing,pages,closing:'Concordamos com a proposta comercial apresentada e autorizamos o avanço para a etapa contratual, sujeito à validação final FÊNIX/CFO.'}}
window.FenixProposalComposer={compose};
})();