(function(){
  function install(){
    const title=document.querySelector('.topbar .title');
    if(!title||document.getElementById('fenixHeaderBrand'))return;
    const style=document.createElement('style');
    style.id='fenix-header-logo-style';
    style.textContent=`
      .topbar .title{display:flex;align-items:center;gap:14px;min-width:0}
      .topbar .title .fenix-title-copy{min-width:0}
      .fenix-header-brand{width:132px;height:48px;flex:0 0 132px;background:url('/assets/fenix-logo-header-crop.webp') center/contain no-repeat;border-right:1px solid rgba(239,189,73,.24);padding-right:14px}
      @media(max-width:1050px){.fenix-header-brand{width:118px;height:43px;flex-basis:118px}.topbar .title{gap:11px}}
      @media(max-width:760px){.fenix-header-brand{width:105px;height:39px;flex-basis:105px}}
    `;
    document.head.appendChild(style);
    const copy=document.createElement('div');
    copy.className='fenix-title-copy';
    while(title.firstChild)copy.appendChild(title.firstChild);
    const brand=document.createElement('div');
    brand.id='fenixHeaderBrand';
    brand.className='fenix-header-brand';
    brand.setAttribute('aria-label','FÊNIX Intelligent BPO');
    title.appendChild(brand);
    title.appendChild(copy);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
