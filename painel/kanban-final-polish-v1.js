(function(){
  if(document.getElementById('fenix-kanban-final-polish-v1')) return;
  const style=document.createElement('style');
  style.id='fenix-kanban-final-polish-v1';
  style.textContent=`
    /* Acabamento visual final aprovado — sem alterar estrutura, cores ou fluxo */
    .brand{height:88px!important;margin:0 0 10px!important;overflow:visible!important}
    .brand img{width:180px!important;max-width:none!important;max-height:82px!important;object-fit:contain!important}

    .deal h3{font-size:13px!important;font-weight:500!important;line-height:1.34!important;letter-spacing:0!important}
    .cnpj{font-size:10.5px!important;font-weight:400!important;color:#9aa1aa!important}
    .deal-meta{font-size:10.5px!important;font-weight:400!important;color:#c5c9cf!important}
    .tag{font-size:10px!important;font-weight:500!important}
    .money{font-size:12px!important;font-weight:700!important}

    .fenix-oplabel{font-size:9px!important;font-weight:400!important;color:#8f97a3!important;letter-spacing:.06em!important}
    .fenix-opnext{font-size:10.5px!important;font-weight:500!important;color:#d6d9de!important}
    .fenix-opbtn{font-weight:600!important}

    @media(max-width:1050px){
      .brand img{width:156px!important;max-width:none!important;max-height:70px!important}
    }
  `;
  document.head.appendChild(style);
})();
