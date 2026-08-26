(function(){
  const REQUESTED_INTERNAL=new URLSearchParams(location.search).get('interno')==='1';
  if(!REQUESTED_INTERNAL)return;

  function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function val(id,v){const e=document.getElementById(id);if(e)e.value=v??''}
  function checkScope(values){
    const set=new Set(Array.isArray(values)?values:[]);
    document.querySelectorAll('input[name=escopo]').forEach(i=>i.checked=set.has(i.value));
  }
  function fill(item){
    const f=item.raw_payload?.form||{};const c=item.client||{};
    val('cnpj',f.cnpj||c.cnpj);val('razao',f.razao||c.razao_social);val('responsavel',f.responsavel||c.responsavel);val('email',f.email||c.email);val('telefone',f.telefone||c.telefone);val('ramos',f.ramos||item.ramo);
    val('descricao',f.descricao||item.descricao_negocio);val('dor',f.dor||item.dor);val('expectativa',f.expectativa||item.expectativa);val('faturamento',f.faturamento||item.faturamento);
    val('recebimentos',f.recebimentos||item.recebimentos_mes);val('pagamentos',f.pagamentos||item.pagamentos_mes);val('notas',f.notas||item.notas_emitidas_mes);val('notas_recebidas',f.notas_recebidas||item.notas_recebidas_mes);val('lancamentos',f.lancamentos||item.outros_lancamentos_mes);
    val('contratos_novos',f.contratos_novos||item.contratos_novos_mes);val('comissoes_lancadas',f.comissoes_lancadas||item.comissoes_lancadas_mes);val('bancos',f.bancos||item.bancos_ativos);val('cartoes',f.cartoes||item.cartoes);val('contas_aplicacao',f.contas_aplicacao||item.contas_aplicacao);val('cnpjs',f.cnpjs||item.cnpjs_operacao);val('filiais',f.filiais||item.filiais);val('centros_custo',f.centros_custo||item.centros_custo);val('funcionarios',f.funcionarios||item.funcionarios_clt);val('implantacao_situacao',f.implantacao_situacao||item.situacao_atual);val('dor_atrasados',f.dor_atrasados||(item.atrasados_retrabalho?'Sim':'Não'));
    checkScope(f.escopo||item.escopo);
    window.__fenixLoadedIntakeId=item.id;
    document.getElementById('diagnostico')?.classList.remove('hidden');
    if(typeof window.recalcular==='function')window.recalcular();
    document.getElementById('diagnostico')?.scrollIntoView({behavior:'smooth'});
  }

  function render(items){
    let box=document.getElementById('fenix-internal-dashboard');
    if(!box){box=document.createElement('div');box.id='fenix-internal-dashboard';box.className='card';box.style.marginBottom='16px';document.querySelector('.wrap')?.prepend(box)}
    const rows=(items||[]).map((item,idx)=>{
      const c=item.client||{};const name=c.razao_social||c.nome_fantasia||'Cliente sem nome';
      const date=item.created_at?new Date(item.created_at).toLocaleString('pt-BR'):'';
      return `<div class="row" style="align-items:center;gap:10px;flex-wrap:wrap"><div style="flex:1;min-width:240px"><strong>${esc(name)}</strong><br><small>${esc(c.cnpj||'')} · ${esc(date)} · ${esc(item.status||'recebido')}</small></div><div><strong>${money(item.faturamento)}</strong></div><button class="btn ghost" data-open-intake="${idx}">Abrir análise</button></div>`;
    }).join('');
    box.innerHTML=`<div class="section">Levantamentos recebidos</div>${rows||'<div class="ok">Nenhum levantamento recebido ainda.</div>'}`;
    box.querySelectorAll('[data-open-intake]').forEach(btn=>btn.onclick=()=>fill(items[Number(btn.dataset.openIntake)]));
  }

  async function load(){
    if(!window.FENIX_INTERNAL_MODE)return;
    try{
      const r=await fetch('/api/internal-intakes',{credentials:'same-origin'});const d=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(d.error||'Falha ao carregar.');render(d.items||[]);
    }catch(e){
      let box=document.getElementById('fenix-internal-dashboard');
      if(!box){box=document.createElement('div');box.id='fenix-internal-dashboard';box.className='card';document.querySelector('.wrap')?.prepend(box)}
      box.innerHTML=`<div class="section">Levantamentos recebidos</div><div class="err">${esc(e.message||'Não foi possível carregar os levantamentos.')}</div>`;
    }
  }

  window.addEventListener('fenix:internal-authenticated',load);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(load,150));else setTimeout(load,150);
})();
