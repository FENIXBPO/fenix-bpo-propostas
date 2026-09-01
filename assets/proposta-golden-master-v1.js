(function(){
  const q=new URLSearchParams(location.search);
  const defaults={
    cliente:'CONFIAR IMÓVEIS LTDA',
    razao:'Confiar Imóveis Ltda',
    segmento:'Imobiliário',
    data:'27 de agosto de 2026'
  };
  const data={
    cliente:(q.get('cliente')||defaults.cliente).trim(),
    razao:(q.get('razao')||q.get('cliente')||defaults.razao).trim(),
    segmento:(q.get('segmento')||defaults.segmento).trim(),
    data:(q.get('data')||defaults.data).trim()
  };
  function set(id,value){const el=document.getElementById(id);if(el)el.textContent=value}
  set('clientName',data.cliente.toUpperCase());
  set('clientFooter',data.razao);
  set('segment',data.segmento);
  set('proposalDate',data.data);
  document.title=`FÊNIX — Proposta Comercial | ${data.razao}`;

  function fitClientTitle(){
    const el=document.getElementById('clientName');
    if(!el)return;
    let size=parseFloat(getComputedStyle(el).fontSize);
    const min=52;
    while(el.scrollWidth>el.clientWidth && size>min){
      size-=2;
      el.style.fontSize=size+'px';
    }
    if(el.scrollWidth>el.clientWidth){
      el.style.whiteSpace='normal';
      el.style.lineHeight='.86';
      el.style.maxHeight='1.9em';
      el.style.overflow='hidden';
    }
  }
  requestAnimationFrame(fitClientTitle);
})();
