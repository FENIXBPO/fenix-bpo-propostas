const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supabase(path, options = {}) {
  const headers = {
    apikey: SECRET_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (SECRET_KEY && SECRET_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SECRET_KEY}`;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text || null; }
  if (!response.ok) throw new Error(data?.message || data?.hint || `Supabase ${response.status}`);
  return data;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!SECRET_KEY) return res.status(503).json({ error: 'Integração com banco não configurada.' });

  const body = req.body || {};
  const cnpj = String(body.cnpj || '').replace(/\D/g, '');
  const nome = String(body.nome || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const accepted = body.accepted === true;

  if (!/^\d{14}$/.test(cnpj)) return res.status(400).json({ error: 'CNPJ inválido.' });
  if (!nome) return res.status(400).json({ error: 'Informe seu nome.' });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Informe um e-mail válido.' });
  if (!accepted) return res.status(400).json({ error: 'É necessário confirmar o aceite da proposta.' });

  try {
    const clients = await supabase(`bpo_clients?cnpj=eq.${cnpj}&select=id,cnpj,razao_social&limit=1`);
    const client = Array.isArray(clients) ? clients[0] : null;
    if (!client?.id) return res.status(404).json({ error: 'Cliente não localizado.' });

    const intakes = await supabase(`bpo_intakes?client_id=eq.${client.id}&select=id,status,raw_payload,created_at&order=created_at.desc&limit=1`);
    const intake = Array.isArray(intakes) ? intakes[0] : null;
    if (!intake?.id) return res.status(404).json({ error: 'Coleta do cliente não localizada.' });

    const acceptedAt = new Date().toISOString();
    const raw = intake.raw_payload && typeof intake.raw_payload === 'object' ? intake.raw_payload : {};
    const proposalAcceptance = {
      accepted: true,
      accepted_at: acceptedAt,
      accepted_by_name: nome,
      accepted_by_email: email,
      proposal_code: 'confiar-imoveis-v1',
      proposal_url: 'https://proposta.fenixbpo.com.br/p/confiar-imoveis.html',
      next_status: 'aguardando_aprovacao_cfo_contrato'
    };

    await supabase(`bpo_intakes?id=eq.${intake.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        status: 'proposta_aceita_aguardando_cfo',
        raw_payload: { ...raw, proposal_acceptance: proposalAcceptance },
        updated_at: acceptedAt
      })
    });

    return res.status(200).json({
      ok: true,
      status: 'proposta_aceita_aguardando_cfo',
      message: 'Aceite registrado. A proposta seguirá para validação final do CFO antes da geração do contrato.'
    });
  } catch (err) {
    console.error('Proposal acceptance error:', err);
    return res.status(500).json({ error: 'Não foi possível registrar o aceite agora. Tente novamente em instantes.' });
  }
};
