(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.fenix-primary-action');
    if(!btn)return;
    const card=btn.closest('.fenix-card-v3');
    const stage=card?.closest('.fenix-v3-stage')?.dataset?.stage||'';
    if(!card||!['dados_recebidos','analise','cfo','contrato'].includes(stage))return;
    const intakeId=card.dataset.intakeId||'';
    if(!intakeId)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const url=`/painel/analise/?id=${encodeURIComponent(intakeId)}`;
    try{window.top.location.href=url}catch{window.location.href=url}
  },true);
})();
