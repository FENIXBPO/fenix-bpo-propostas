(function(root){
  const VERSION='1.0.0';
  const DEFAULTS={targetMargin:0.50,commercialDiscountLimit:0.10};
  const VOLUME_TIERS=[
    {max:80,base:900,label:'até 80 movimentos/mês'},
    {max:150,base:1200,label:'81 a 150 movimentos/mês'},
    {max:300,base:1600,label:'151 a 300 movimentos/mês'},
    {max:500,base:2200,label:'301 a 500 movimentos/mês'},
    {max:800,base:3000,label:'501 a 800 movimentos/mês'},
    {max:Infinity,base:3800,label:'acima de 800 movimentos/mês — revisão obrigatória'}
  ];
  const moneyRound=n=>Math.ceil(Number(n||0)/50)*50;
  const num=v=>{const n=Number(String(v??'').replace(/\./g,'').replace(',','.'));return Number.isFinite(n)?n:0};
  const sizeBucket=v=>{v=String(v??'0');if(v.includes('+'))return parseInt(v)||0;if(v.includes('-'))return parseInt(v.split('-')[1])||0;return num(v)};
  const countBanks=v=>String(v||'').split(/[,;\n]/).map(x=>x.trim()).filter(Boolean).length;
  function volumeTier(movements){return VOLUME_TIERS.find(t=>movements<=t.max)||VOLUME_TIERS[VOLUME_TIERS.length-1]}
  function diagnose(f,settings={}){
    const cfg={...DEFAULTS,...settings};
    const faturamento=num(f.faturamento),banks=countBanks(f.bancos),cards=sizeBucket(f.cartoes),apps=sizeBucket(f.contas_aplicacao),clt=sizeBucket(f.funcionarios),cnpjs=Math.max(1,sizeBucket(f.cnpjs)),filiais=sizeBucket(f.filiais),cc=sizeBucket(f.centros_custo);
    const movements=num(f.recebimentos)+num(f.pagamentos)+num(f.notas)+num(f.notas_recebidas)+num(f.lancamentos);
    const tier=volumeTier(movements);
    let points=0;if(movements>500)points+=3;else if(movements>300)points+=2;else if(movements>150)points++;if(banks>2)points+=Math.min(3,banks-2);if(cards>3)points++;if(apps>2)points++;if(clt>5)points++;if(cnpjs>1)points+=2;if(filiais>0)points++;if(cc>3)points++;if(f.dor_atrasados==='Sim')points+=2;if(String(f.implantacao_situacao||'').includes('Desorganizado'))points+=2;
    const complexity=points>=8?'Alta':points>=4?'Média':'Baixa';
    const extras={bancos:Math.max(0,banks-2)*150,cartoes:Math.max(0,cards-3)*75,cnpjs:Math.max(0,cnpjs-1)*350,filiais:filiais*200,centrosCusto:Math.max(0,cc-3)*100,equipe:clt>5?200:0,faturamento:faturamento>1000000?500:faturamento>300000?250:0};
    const extrasTotal=Object.values(extras).reduce((a,b)=>a+b,0);const complexityFactor=complexity==='Alta'?1.20:complexity==='Média'?1.10:1;const structuralPrice=moneyRound((tier.base+extrasTotal)*complexityFactor);
    const hours=Math.max(7,Math.round((5+movements/55+banks*1.1+cards*.45+Math.max(0,cnpjs-1)*1.5+filiais*.8+cc*.15+clt*.20+(f.dor_atrasados==='Sim'?3:0))*10)/10);
    const costHour=num(settings.costHour);const costMonthly=costHour?hours*costHour:0;const marginFloor=costMonthly&&cfg.targetMargin<1?moneyRound(costMonthly/(1-cfg.targetMargin)):0;const commercialFloor=moneyRound(Math.max(structuralPrice*(1-cfg.commercialDiscountLimit),marginFloor));const suggested=moneyRound(Math.max(structuralPrice,marginFloor?marginFloor*1.10:0));
    let implantation=1500;if(f.implantacao_situacao==='Parcialmente organizado')implantation=2500;if(String(f.implantacao_situacao||'').includes('Desorganizado'))implantation=3500;implantation+=Math.max(0,cnpjs-1)*500+(f.dor_atrasados==='Sim'?750:0)+filiais*250;implantation=moneyRound(implantation);
    const margin=suggested&&costMonthly?(suggested-costMonthly)/suggested:null;const risks=[];if(movements>500)risks.push('Volumetria acima de 500 movimentos/mês');if(banks>2)risks.push('Mais de 2 bancos ativos');if(cards>3)risks.push('Mais de 3 cartões');if(cnpjs>1)risks.push('Múltiplos CNPJs');if(filiais>0)risks.push('Operação com filiais');if(cc>3)risks.push('Mais de 3 centros de custo');if(clt>5)risks.push('Equipe CLT acima de 5 pessoas');if(f.dor_atrasados==='Sim')risks.push('Existem atrasados/retrabalho para saneamento');if(String(f.implantacao_situacao||'').includes('Desorganizado'))risks.push('Implantação com saneamento relevante');if(!costHour)risks.push('Custo-hora interno não informado: piso de margem ainda não validado');if(movements>800)risks.push('Revisão manual obrigatória por volumetria acima da matriz padrão');
    return {version:VERSION,faturamento,movements,banks,cards,apps,clt,cnpjs,filiais,cc,points,complexity,tier,extras,extrasTotal,complexityFactor,structuralPrice,hours,costHour,costMonthly,targetMargin:cfg.targetMargin,marginFloor,commercialDiscountLimit:cfg.commercialDiscountLimit,commercialFloor,suggested,implantation,margin,risks,manualReview:movements>800||complexity==='Alta'};
  }
  const api={VERSION,DEFAULTS,VOLUME_TIERS,diagnose};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.FenixPricing=api;
})(typeof window!=='undefined'?window:globalThis);

if(typeof window!=='undefined'&&typeof document!=='undefined'){
  function loadScript(src){
    return new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=false;
      s.onload=resolve;
      s.onerror=()=>reject(new Error('Falha ao carregar '+src));
      document.head.appendChild(s);
    });
  }
  (async()=>{
    try{
      await loadScript('ui-enhancements.js?v=5');
      await loadScript('header-polish.js?v=5');
      await loadScript('header-singular-safe.js?v=1');
      await loadScript('intake-persistence.js?v=4');
    }catch(err){
      console.error('Fenix bootstrap error:',err);
    }
  })();
}
