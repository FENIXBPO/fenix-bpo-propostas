(()=>{
  const mount=document.getElementById('masterMount');
  if(!mount)return;
  const sigType=bytes=>{
    if(bytes.length>=8&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)return'image/png';
    if(bytes.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return'image/webp';
    return'';
  };
  const textToBytes=t=>Uint8Array.from(atob(t.replace(/\s+/g,'')),c=>c.charCodeAt(0));
  async function assetUrl(path){
    const raw=`https://raw.githubusercontent.com/FENIXBPO/fenix-bpo-propostas/feat/proposta-v2-integracao-dados/${path}`;
    let res=await fetch(raw,{cache:'no-store'});if(!res.ok)throw new Error('asset');
    let bytes=new Uint8Array(await res.arrayBuffer());
    for(let i=0;i<4;i++){
      const type=sigType(bytes);if(type)return URL.createObjectURL(new Blob([bytes],{type}));
      const txt=new TextDecoder().decode(bytes).trim();
      if(!/^[A-Za-z0-9+/=\s]+$/.test(txt))break;
      bytes=textToBytes(txt);
    }
    throw new Error('asset');
  }
  async function hydrateBrand(){
    try{
      const [logo,symbol]=await Promise.all([assetUrl('assets/fenix-logo-transparent.webp'),assetUrl('assets/fenix-symbol.png')]);
      mount.querySelectorAll('.brand-logo-img').forEach(img=>{img.src=logo;img.alt='FÊNIX Intelligent BPO'});
      mount.querySelectorAll('.phoenix-watermark-img').forEach(img=>{img.src=symbol;img.alt=''});
    }catch(e){console.error('FÊNIX brand asset',e)}
  }
  const enhance=()=>{
    const deck=mount.querySelector('.deck');
    if(!deck||deck.dataset.viewerReady==='1')return false;
    [...deck.children].forEach(node=>{
      if(!node.classList||!node.classList.contains('page'))return;
      const wrap=document.createElement('section');
      wrap.className='slide-viewport';
      wrap.setAttribute('aria-label','Lâmina '+(node.dataset.page||''));
      deck.insertBefore(wrap,node);wrap.appendChild(node);
    });
    deck.dataset.viewerReady='1';hydrateBrand();return true;
  };
  if(enhance())return;
  const obs=new MutationObserver(()=>{if(enhance())obs.disconnect()});
  obs.observe(mount,{childList:true,subtree:true});
})();