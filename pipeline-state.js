(function(root){
  const STAGES=[
    {key:'lead',title:'Lead',order:1,kind:'current'},
    {key:'dados_recebidos',title:'Dados recebidos',order:2,kind:'current'},
    {key:'analise',title:'Análise',order:3,kind:'current'},
    {key:'proposta',title:'Proposta',order:4,kind:'current'},
    {key:'enviada',title:'Enviada',order:5,kind:'current'},
    {key:'aceita',title:'Aceita',order:6,kind:'milestone'},
    {key:'cfo',title:'CFO',order:7,kind:'current'},
    {key:'contrato',title:'Contrato',order:8,kind:'current'},
    {key:'assinatura',title:'Assinatura',order:9,kind:'current'},
    {key:'implantacao',title:'Implantação',order:10,kind:'current'}
  ];

  const STATUS_TO_STAGE={
    lead:'lead',
    recebido:'dados_recebidos',
    dados_recebidos:'dados_recebidos',
    em_analise_cfo:'analise',
    rascunho_cfo:'analise',
    proposta_aprovada_cfo:'proposta',
    aprovada_cfo:'proposta',
    proposta_publicada:'proposta',
    publicada:'proposta',
    proposta_enviada:'enviada',
    enviada_cliente:'enviada',
    enviada:'enviada',
    proposta_aceita:'aceita',
    proposta_aceita_aguardando_cfo:'cfo',
    aceite_validado_cfo:'cfo',
    contrato_autorizado:'contrato',
    autorizado_cfo_aguardando_geracao:'contrato',
    contrato_gerado:'contrato',
    gerado:'contrato',
    aguardando_assinatura:'assinatura',
    assinado:'assinatura',
    implantacao:'implantacao',
    em_implantacao:'implantacao',
    operacao_iniciada:'implantacao',
    encerrado:'encerrado'
  };

  function stageOf(status){return STATUS_TO_STAGE[String(status||'').trim()]||'dados_recebidos'}
  function stage(key){return STAGES.find(s=>s.key===key)||null}
  function acceptedMilestone(proposal){return !!proposal?.accepted_at||['proposta_aceita','proposta_aceita_aguardando_cfo','aceite_validado_cfo','contrato_autorizado'].includes(proposal?.status)}
  const api={version:'2.1.0',STAGES,STATUS_TO_STAGE,stageOf,stage,acceptedMilestone};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.FenixPipelineState=api;
})(typeof window!=='undefined'?window:globalThis);
