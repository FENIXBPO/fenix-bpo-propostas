(()=>{
  const apply=()=>{
    document.querySelectorAll('.engine-slide').forEach(svg=>{
      const champ=svg.querySelector('#champ');
      if(champ){
        const stops=champ.querySelectorAll('stop');
        const colors=['#D7C7A8','#BFA77C','#8F7754','#C8B48E'];
        stops.forEach((s,i)=>s.setAttribute('stop-color',colors[i]||colors[colors.length-1]));
      }
      const silver=svg.querySelector('#silver');
      if(silver){
        const stops=silver.querySelectorAll('stop');
        const colors=['#F1F1EF','#D5D5D2','#A9AAA7'];
        stops.forEach((s,i)=>s.setAttribute('stop-color',colors[i]||colors[colors.length-1]));
      }
      svg.querySelectorAll('.cardtitle').forEach(el=>el.setAttribute('fill','#C7B28A'));
      svg.querySelectorAll('circle[fill="#D8B986"]').forEach(el=>el.setAttribute('fill','#BFA77C'));
      svg.querySelectorAll('[stroke="#75654E"]').forEach(el=>el.setAttribute('stroke','#5F5648'));
      svg.querySelectorAll('[stroke="#A98B60"]').forEach(el=>el.setAttribute('stroke','#8F7B5C'));
      svg.querySelectorAll('[fill="#D8B986"]').forEach(el=>el.setAttribute('fill','#BFA77C'));
      svg.querySelectorAll('[fill="#B99664"]').forEach(el=>el.setAttribute('fill','#9C8766'));
      svg.querySelectorAll('[stroke="#725D40"]').forEach(el=>el.setAttribute('stroke','#5C5245'));
    });
  };
  const obs=new MutationObserver(()=>apply());
  obs.observe(document.documentElement,{subtree:true,childList:true});
  addEventListener('load',apply);
  setTimeout(apply,250);
})();
