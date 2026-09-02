(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const yes=v=>v===true?'Sim':v===false?'Não':(v||'—');
  let cache=null,lastId='';

  async function getItems(){
    if(cache)return cache;
    const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(d.error||'Não foi possível carregar o contexto V2.');
    cache=d.items||[];
    return cache;
  }

  function value(v){return v===null||v===undefined||v===''?'—':String(v)}

  function render(item){
    const n=item?.normalized;
    if(!n)return;
    let box=document.getElementById('fenix-intake-v2-context');
    if(!box){
      box=document.createElement('div');
      box.id='fenix-intake-v2-context';
      box.className='card';
      const target=document.getElementById('diagnostico');
      target?.insertBefore(box,target.firstChild);
    }
    const client=n.client||{},business=n.business||{},op=n.operation||{},volume=n.volume||{};
    const objectives=Array.isArray(business.objetivos)?business.objetivos:[];
    box.innerHTML=`
      <div class="section">Contexto do cliente · Intake V2</div>
      <div class="grid">
        <div class="field"><label>Responsável / cargo</label><div>${esc(value(client.responsavel))}${client.responsavel_cargo?` · ${esc(client.responsavel_cargo)}`:''}</div></div>
        <div class="field"><label>Sistema financeiro / ERP</label><div>${esc(value(op.sistema_atual))}</div></div>
        <div class="field"><label>Financeiro interno</label><div>${esc(value(op.financeiro_interno))}</div></div>
        <div class="field"><label>Contabilidade definida</label><div>${esc(value(op.contabilidade_definida))}</div></div>
        <div class="field"><label>Frequência desejada</label><div>${esc(value(op.frequencia_desejada))}</div></div>
        <div class="field"><label>Repasses recorrentes</label><div>${esc(yes(op.repasses_recorrentes))}</div></div>
      </div>
      <div class="two" style="margin-top:14px">
        <div class="field"><label>Objetivos declarados</label><div>${objectives.length?objectives.map(x=>`• ${esc(x)}`).join('<br>'):'—'}</div></div>
        <div class="field"><label>O que mais consome tempo</label><div>${esc(value(business.atividade_que_mais_consome_tempo))}</div></div>
      </div>
      <div class="two" style="margin-top:14px">
        <div class="field"><label>Outros serviços informados</label><div>${esc(value(op.outros_servicos))}</div></div>
        <div class="field"><label>Volumetria complementar</label><div>Contratos novos/mês: <strong>${esc(value(volume.contratos_novos_mes))}</strong><br>Comissões/mês: <strong>${esc(value(volume.comissoes_lancadas_mes))}</strong></div></div>
      </div>
      <div class="internal" style="margin-top:14px"><strong>Governança:</strong> estes dados vieram do formulário do cliente. Eles apoiam diagnóstico e personalização, mas escopo e preço só se tornam oficiais após aprovação do CFO.</div>`;
  }

  async function sync(){
    const id=window.__fenixLoadedIntakeId||'';
    if(!id||id===lastId)return;
    lastId=id;
    try{
      const items=await getItems();
      const item=items.find(x=>x.id===id);
      if(item?.normalized)render(item);
    }catch(e){console.error('Intake V2 context:',e)}
  }

  const observer=new MutationObserver(()=>sync());
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true});
  window.addEventListener('fenix:internal-authenticated',()=>{cache=null;setTimeout(sync,200)});
  setInterval(sync,600);
})();
