(()=>{
  const convertRule = rule=>{
    try{
      if(rule.cssRules){[...rule.cssRules].forEach(convertRule);return}
      if(!rule.style)return;
      for(const prop of [...rule.style]){
        const value=rule.style.getPropertyValue(prop);
        if(value&&value.includes('vw')){
          rule.style.setProperty(prop,value.replace(/(-?\d*\.?\d+)vw/g,'$1cqw'),rule.style.getPropertyPriority(prop));
        }
      }
    }catch(_){/* ignore inaccessible rules */}
  };
  const apply=()=>{
    if(window.innerWidth<=760)return;
    for(const sheet of [...document.styleSheets]){
      const href=sheet.href||'';
      if(href.includes('/master-template/proposta-v2.css')){
        try{[...sheet.cssRules].forEach(convertRule)}catch(_){ }
      }
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
