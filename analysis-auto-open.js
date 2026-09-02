(function(){
  const q=new URLSearchParams(location.search);
  if(q.get('analysis_only')!=='1')return;
  const intakeId=q.get('open_intake')||'';
  const style=document.createElement('style');
  style.textContent=`
    body{background:#07101f!important;color:#0b1020!important}
    body>.top{display:none!important}
    .wrap{max-width:1480px!important;padding:18px!important}
    #fenix-internal-dashboard{display:none!important}
    .wrap>.card{margin-bottom:16px!important;border-radius:16px!important}
    #diagnostico{display:block!important}
  `;
  document.head.appendChild(style);

  async function openSelected(){
    if(!intakeId)return;
    try{
      const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||'Falha ao carregar análise.');
      const idx=(d.items||[]).findIndex(x=>String(x.id)===String(intakeId));
      if(idx<0)throw new Error('Oportunidade não encontrada.');
      let tries=0;
      const clickWhenReady=()=>{
        const btn=document.querySelector(`[data-open-intake="${idx}"]`);
        if(btn){btn.click();window.scrollTo({top:0,left:0,behavior:'auto'});return}
        if(tries++<80)return setTimeout(clickWhenReady,100);
        document.body.insertAdjacentHTML('afterbegin','<div style="padding:20px;color:white">Não foi possível abrir a análise automaticamente.</div>');
      };
      clickWhenReady();
    }catch(err){document.body.insertAdjacentHTML('afterbegin',`<div style="padding:20px;color:white">${String(err.message||err)}</div>`)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openSelected,{once:true});else openSelected();
})();
