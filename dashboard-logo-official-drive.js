(function(){
  if(new URLSearchParams(location.search).get('interno')!=='1')return;
  const DRIVE_LOGO='https://drive.google.com/uc?export=view&id=13tZmkBjfMthdrdqEhwD2Efw8x_4UmHvh';
  function apply(){
    const box=document.getElementById('fenix-internal-dashboard');
    const slot=box?.querySelector('.fenix-brand-row img');
    if(!slot)return setTimeout(apply,120);
    slot.src=DRIVE_LOGO;
    slot.alt='FÊNIX Intelligent BPO';
    slot.referrerPolicy='no-referrer';
    slot.style.display='block';
    slot.style.width='min(420px,72vw)';
    slot.style.height='auto';
    slot.style.maxHeight='110px';
    slot.style.objectFit='contain';
    slot.style.objectPosition='left center';
  }
  apply();
})();
