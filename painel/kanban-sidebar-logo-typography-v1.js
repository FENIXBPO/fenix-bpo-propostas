(function(){
  function install(){
    if(document.getElementById('fenix-sidebar-typography-v1'))return;

    const style=document.createElement('style');
    style.id='fenix-sidebar-typography-v1';
    style.textContent=`
      /* Logo oficial no topo da barra lateral, conforme referência aprovada */
      .side .brand{
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        height:66px!important;
        margin:0 6px 14px!important;
        background:none!important;
      }
      .side .brand img{
        display:block;
        width:148px;
        max-width:100%;
        max-height:58px;
        object-fit:contain;
      }

      /* Hierarquia tipográfica aprovada: reduzir peso sem alterar layout */
      .title h1{font-weight:800!important}
      .title p{font-weight:400!important}
      .nav button,.nav a{font-weight:400!important}
      .nav .active{font-weight:600!important}
      .col-head-top{font-weight:600!important}
      .col-count{font-weight:600!important}
      .deal h3{font-weight:600!important}
      .money{font-weight:700!important}
      .cnpj,.deal-meta,.filters input,.filters select,.search input,.col-total,.kpi span{font-weight:400!important}
      .action,.btn,.fenix-opbtn{font-weight:600!important}
      .kpi strong{font-weight:700!important}
      .tag{font-weight:600!important}
      .more{font-weight:600!important}
      .fenix-oplabel{font-weight:400!important}
      .fenix-opnext{font-weight:600!important}
      .drawer-head h2,.modal-card h2{font-weight:700!important}
      .archive-card h3{font-weight:600!important}

      @media(max-width:1050px){
        .side .brand img{width:130px;max-height:52px}
      }
    `;
    document.head.appendChild(style);

    const brand=document.querySelector('.side .brand');
    if(brand){
      brand.innerHTML='';
      const img=document.createElement('img');
      img.src='/assets/fenix-logo-header-crop.webp';
      img.alt='FÊNIX Intelligent BPO';
      img.decoding='async';
      brand.appendChild(img);
    }

    /* Remove somente a inserção antiga de logo no cabeçalho, caso esteja presente. */
    const oldHeaderBrand=document.getElementById('fenixHeaderBrand');
    if(oldHeaderBrand)oldHeaderBrand.remove();
    const oldHeaderStyle=document.getElementById('fenix-header-logo-style');
    if(oldHeaderStyle)oldHeaderStyle.remove();
    const copy=document.querySelector('.topbar .title .fenix-title-copy');
    const title=document.querySelector('.topbar .title');
    if(copy&&title){
      while(copy.firstChild)title.insertBefore(copy.firstChild,copy);
      copy.remove();
      title.style.display='';
      title.style.alignItems='';
      title.style.gap='';
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
