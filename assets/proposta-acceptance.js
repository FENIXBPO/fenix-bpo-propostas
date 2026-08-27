(() => {
  const openBtn = document.getElementById('openAcceptance');
  const backdrop = document.getElementById('acceptanceModal');
  const closeBtn = document.getElementById('closeAcceptance');
  const form = document.getElementById('acceptanceForm');
  const status = document.getElementById('acceptanceStatus');
  const submit = document.getElementById('submitAcceptance');
  if (!openBtn || !backdrop || !form) return;

  const open = () => { backdrop.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { backdrop.classList.remove('open'); document.body.style.overflow = ''; };
  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = '';
    const nome = document.getElementById('acceptName').value.trim();
    const email = document.getElementById('acceptEmail').value.trim();
    const accepted = document.getElementById('acceptCheck').checked;
    if (!nome || !email || !accepted) {
      status.textContent = 'Preencha nome, e-mail e confirme o aceite.';
      status.style.color = '#f2bd45';
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Registrando...';
    try {
      const r = await fetch('/api/proposal-acceptance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj: '27049091000106', nome, email, accepted: true })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Não foi possível registrar o aceite.');
      status.textContent = 'Aceite registrado com sucesso. A proposta seguirá para validação final do CFO antes da geração do contrato.';
      status.style.color = '#83d69b';
      form.querySelectorAll('input,button').forEach(el => el.disabled = true);
      openBtn.textContent = 'Proposta aceita — aguardando validação CFO';
      openBtn.disabled = true;
      openBtn.style.opacity = '.72';
    } catch (err) {
      status.textContent = err.message || 'Não foi possível registrar o aceite agora.';
      status.style.color = '#ff8d8d';
      submit.disabled = false;
      submit.textContent = 'Confirmar aceite';
    }
  });
})();
