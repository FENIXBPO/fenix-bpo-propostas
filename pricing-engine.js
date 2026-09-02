(function(root){
  const FALLBACK_POLICY={
    version:'1.1.0',targetMargin:0.50,commercialDiscountLimit:0.10,
    manualReview:{movementsAbove:800,complexity:'Alta'},
    volumeTiers:[
      {max:80,base:900,label:'até 80 movimentos/mês'},
      {max:150,base:1200,label:'81 a 150 movimentos/mês'},
      {max:300,base:1600,label:'151 a 300 movimentos/mês'},
      {max:500,base:2200,label:'301 a 500 movimentos/mês'},
      {max:800,base:3000,label:'501 a 800 movimentos/mês'},
      {max:Infinity,base:3800,label:'acima de 800 movimentos/mês — revisão obrigatória'}
    ],
    extras:{includedBanks:2,additionalBank:150,includedCards:3,additionalCard:75,additionalCnpj:350,branch:200,includedCostCenters:3,additionalCostCenter:100,cltThreshold:5,cltExtra:200,revenueThreshold1:300000,revenueExtra1:250,revenueThreshold2:1000000,revenueExtra2:500},
    complexity:{lowMaxPoints:3,mediumMaxPoints:7,factors:{Baixa:1,Média:1.10,Alta:1.20}},
    implementation:{organized:1500,partial:2500,disorganized:3500,additionalCnpj:500,rework:750,branch:250},
    estimation:{minimumHours:7,movementsPerHourDivisor:55,bankHours:1.1,cardHours:0.45,additionalCnpjHours:1.5,branchHours:0.8,costCenterHours:0.15,cltHours:0.20,reworkHours:3,suggestedMarginBuffer:1.10}
  };
  let POLICY=root.FenixPricingPolicy||FALLBACK_POLICY;
  if(typeof module!=='undefined'&&module.exports){try{POLICY=require('./pricing-policy.js')}catch{POLICY=FALLBACK_POLICY}}
  const VERSION='1.1.0';
  const DEFAULTS={targetMargin:POLICY.targetMargin,commercialDiscountLimit:POLICY.commercialDiscountLimit};
  const VOLUME_TIERS=POLICY.volumeTiers;
  const moneyRound=n=>Math.ceil(Number(n||0)/50)*50;
  const num=v=>{const n=Number(String(v??'').replace(/\./g,'').replace(',','.'));return Number.isFinite(n)?n:0};
  const sizeBucket=v=>{v=String(v??'0');if(v.includes('+'))return parseInt(v)||0;if(v.includes('-'))return parseInt(v.split('-')[1])||0;return num(v)};
  const countBanks=v=>String(v||'').split(/[,;\n]/).map(x=>x.trim()).filter(Boolean).length;
  function volumeTier(movements){return VOLUME_TIERS.find(t=>movements<=t.max)||VOLUME_TIERS[VOLUME_TIERS.length-1]}
  function diagnose(f,settings={}){
    const cfg={...DEFAULTS,...settings},e=POLICY.extras,c=POLICY.complexity,imp=POLICY.implementation,est=POLICY.estimation;
    const faturamento=num(f.faturamento),banks=countBanks(f.bancos),cards=sizeBucket(f.cartoes),apps=sizeBucket(f.contas_aplicacao),clt=sizeBucket(f.funcionarios),cnpjs=Math.max(1,sizeBucket(f.cnpjs)),filiais=sizeBucket(f.filiais),cc=sizeBucket(f.centros_custo);
    const movements=num(f.recebimentos)+num(f.pagamentos)+num(f.notas)+num(f.notas_recebidas)+num(f.lancamentos);
    const tier=volumeTier(movements);
    let points=0;if(movements>500)points+=3;else if(movements>300)points+=2;else if(movements>150)points++;if(banks>e.includedBanks)points+=Math.min(3,banks-e.includedBanks);if(cards>e.includedCards)points++;if(apps>2)points++;if(clt>e.cltThreshold)points++;if(cnpjs>1)points+=2;if(filiais>0)points++;if(cc>e.includedCostCenters)points++;if(f.dor_atrasados==='Sim')points+=2;if(String(f.implantacao_situacao||'').includes('Desorganizado'))points+=2;
    const complexity=points>c.mediumMaxPoints?'Alta':points>c.lowMaxPoints?'Média':'Baixa';
    const extras={bancos:Math.max(0,banks-e.includedBanks)*e.additionalBank,cartoes:Math.max(0,cards-e.includedCards)*e.additionalCard,cnpjs:Math.max(0,cnpjs-1)*e.additionalCnpj,filiais:filiais*e.branch,centrosCusto:Math.max(0,cc-e.includedCostCenters)*e.additionalCostCenter,equipe:clt>e.cltThreshold?e.cltExtra:0,faturamento:faturamento>e.revenueThreshold2?e.revenueExtra2:faturamento>e.revenueThreshold1?e.revenueExtra1:0};
    const extrasTotal=Object.values(extras).reduce((a,b)=>a+b,0);const complexityFactor=c.factors[complexity]||1;const structuralPrice=moneyRound((tier.base+extrasTotal)*complexityFactor);
    const hours=Math.max(est.minimumHours,Math.round((5+movements/est.movementsPerHourDivisor+banks*est.bankHours+cards*est.cardHours+Math.max(0,cnpjs-1)*est.additionalCnpjHours+filiais*est.branchHours+cc*est.costCenterHours+clt*est.cltHours+(f.dor_atrasados==='Sim'?est.reworkHours:0))*10)/10);
    const costHour=num(settings.costHour);const costMonthly=costHour?hours*costHour:0;const marginFloor=costMonthly&&cfg.targetMargin<1?moneyRound(costMonthly/(1-cfg.targetMargin)):0;const commercialFloor=moneyRound(Math.max(structuralPrice*(1-cfg.commercialDiscountLimit),marginFloor));const suggested=moneyRound(Math.max(structuralPrice,marginFloor?marginFloor*est.suggestedMarginBuffer:0));
    let implantation=imp.organized;if(f.implantacao_situacao==='Parcialmente organizado')implantation=imp.partial;if(String(f.implantacao_situacao||'').includes('Desorganizado'))implantation=imp.disorganized;implantation+=Math.max(0,cnpjs-1)*imp.additionalCnpj+(f.dor_atrasados==='Sim'?imp.rework:0)+filiais*imp.branch;implantation=moneyRound(implantation);
    const margin=suggested&&costMonthly?(suggested-costMonthly)/suggested:null;const risks=[];if(movements>500)risks.push('Volumetria acima de 500 movimentos/mês');if(banks>e.includedBanks)risks.push(`Mais de ${e.includedBanks} bancos ativos`);if(cards>e.includedCards)risks.push(`Mais de ${e.includedCards} cartões`);if(cnpjs>1)risks.push('Múltiplos CNPJs');if(filiais>0)risks.push('Operação com filiais');if(cc>e.includedCostCenters)risks.push(`Mais de ${e.includedCostCenters} centros de custo`);if(clt>e.cltThreshold)risks.push(`Equipe CLT acima de ${e.cltThreshold} pessoas`);if(f.dor_atrasados==='Sim')risks.push('Existem atrasados/retrabalho para saneamento');if(String(f.implantacao_situacao||'').includes('Desorganizado'))risks.push('Implantação com saneamento relevante');if(!costHour)risks.push('Custo-hora interno não informado: piso de margem ainda não validado');if(movements>POLICY.manualReview.movementsAbove)risks.push('Revisão manual obrigatória por volumetria acima da matriz padrão');
    return {version:VERSION,policyVersion:POLICY.version,faturamento,movements,banks,cards,apps,clt,cnpjs,filiais,cc,points,complexity,tier,extras,extrasTotal,complexityFactor,structuralPrice,hours,costHour,costMonthly,targetMargin:cfg.targetMargin,marginFloor,commercialDiscountLimit:cfg.commercialDiscountLimit,commercialFloor,suggested,implantation,margin,risks,manualReview:movements>POLICY.manualReview.movementsAbove||complexity===POLICY.manualReview.complexity};
  }
  const api={VERSION,POLICY,DEFAULTS,VOLUME_TIERS,diagnose};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.FenixPricing=api;
})(typeof window!=='undefined'?window:globalThis);

if(typeof window!=='undefined'&&typeof document!=='undefined'){
  function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Falha ao carregar '+src));document.head.appendChild(s)})}
  (async()=>{try{await loadScript('ui-enhancements.js?v=5');await loadScript('ramo-multiselect-fix.js?v=2');await loadScript('header-polish.js?v=5');await loadScript('header-singular-safe.js?v=1');await loadScript('contracts-commissions.js?v=1');await loadScript('client-form-ux.js?v=1');await loadScript('client-mode.js?v=3');await loadScript('intake-persistence.js?v=5');await loadScript('proposal-standard.js?v=1');await loadScript('internal-panel.js?v=1')}catch(err){console.error('Fenix bootstrap error:',err)}})();
}
