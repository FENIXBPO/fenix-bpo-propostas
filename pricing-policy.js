(function(root){
  const POLICY={
    version:'1.1.0',
    effectiveDate:'2026-09-02',
    currency:'BRL',
    targetMargin:0.50,
    commercialDiscountLimit:0.10,
    manualReview:{movementsAbove:800,complexity:'Alta'},
    volumeTiers:[
      {max:80,base:900,label:'até 80 movimentos/mês'},
      {max:150,base:1200,label:'81 a 150 movimentos/mês'},
      {max:300,base:1600,label:'151 a 300 movimentos/mês'},
      {max:500,base:2200,label:'301 a 500 movimentos/mês'},
      {max:800,base:3000,label:'501 a 800 movimentos/mês'},
      {max:Infinity,base:3800,label:'acima de 800 movimentos/mês — revisão obrigatória'}
    ],
    extras:{
      includedBanks:2,additionalBank:150,
      includedCards:3,additionalCard:75,
      additionalCnpj:350,
      branch:200,
      includedCostCenters:3,additionalCostCenter:100,
      cltThreshold:5,cltExtra:200,
      revenueThreshold1:300000,revenueExtra1:250,
      revenueThreshold2:1000000,revenueExtra2:500
    },
    complexity:{lowMaxPoints:3,mediumMaxPoints:7,factors:{Baixa:1,Média:1.10,Alta:1.20}},
    implementation:{organized:1500,partial:2500,disorganized:3500,additionalCnpj:500,rework:750,branch:250},
    estimation:{minimumHours:7,movementsPerHourDivisor:55,bankHours:1.1,cardHours:0.45,additionalCnpjHours:1.5,branchHours:0.8,costCenterHours:0.15,cltHours:0.20,reworkHours:3,suggestedMarginBuffer:1.10}
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=POLICY;
  root.FenixPricingPolicy=POLICY;
})(typeof window!=='undefined'?window:globalThis);
