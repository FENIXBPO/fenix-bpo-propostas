(function(){
  function install(){
    if(document.getElementById('fenix-sidebar-typography-v1'))return;

    const style=document.createElement('style');
    style.id='fenix-sidebar-typography-v1';
    style.textContent=`
      .side .brand{
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        height:76px!important;
        margin:0 6px 14px!important;
        background:none!important;
        overflow:visible!important;
      }
      .side .brand img{
        display:block!important;
        width:156px!important;
        max-width:100%!important;
        max-height:66px!important;
        object-fit:contain!important;
        opacity:1!important;
        visibility:visible!important;
      }

      .title h1{font-weight:800!important}
      .title p{font-weight:400!important}
      .nav button,.nav a{font-weight:400!important}
      .nav .active{font-weight:600!important}
      .col-head-top{font-weight:600!important}
      .col-count{font-weight:600!important}

      .deal h3{
        font-size:13px!important;
        line-height:1.35!important;
        font-weight:500!important;
      }
      .cnpj{
        font-size:10px!important;
        line-height:1.45!important;
        font-weight:400!important;
      }
      .tag{
        font-size:10px!important;
        font-weight:500!important;
      }
      .deal-meta{
        font-size:10px!important;
        line-height:1.45!important;
        font-weight:400!important;
      }
      .money{
        font-size:12px!important;
        line-height:1.4!important;
        font-weight:700!important;
      }
      .fenix-oplabel{
        font-size:9px!important;
        font-weight:400!important;
      }
      .fenix-opnext{
        font-size:10.5px!important;
        line-height:1.4!important;
        font-weight:500!important;
      }
      .fenix-opbtn{
        font-size:10px!important;
        font-weight:600!important;
      }
      .filters input,.filters select,.search input,.col-total,.kpi span{font-weight:400!important}
      .action,.btn{font-weight:600!important}
      .kpi strong{font-weight:700!important}
      .more{font-weight:600!important}
      .drawer-head h2,.modal-card h2{font-weight:700!important}
      .archive-card h3{font-weight:500!important}

      @media(max-width:1050px){
        .side .brand img{width:136px!important;max-height:58px!important}
      }
    `;
    document.head.appendChild(style);

    const brand=document.querySelector('.side .brand');
    if(brand){
      brand.innerHTML='';
      const img=document.createElement('img');
      img.src='/assets/fenix-logo-white-transparent.webp?v=3';
      img.alt='FÊNIX Intelligent BPO';
      img.decoding='async';
      img.loading='eager';
      img.onerror=function(){
        this.onerror=null;
        this.src='/assets/fenix-logo-header.webp?v=3';
      };
      brand.appendChild(img);
    }

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
