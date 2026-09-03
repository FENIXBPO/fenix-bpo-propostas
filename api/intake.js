const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const cleanCnpj = value => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const validCnpj = value => /^[A-Z0-9]{12}\d{2}$/.test(cleanCnpj(value));
const toNumber = value => {
  const text = String(value ?? '').trim();
  if (!text) return null;

  let normalized = text.replace(/[^\d,.-]/g, '');
  const lastComma = normalized.lastIndexOf(',');
  const lastDot = normalized.lastIndexOf('.');

  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) normalized = normalized.replace(/\./g, '').replace(',', '.');
    else normalized = normalized.replace(/,/g, '');
  } else if (lastComma > -1) {
    normalized = normalized.replace(',', '.');
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};
const toInteger = value => {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number(match[0]) : null;
};
const parseCityUf = value => {
  const text = String(value || '').trim();
  if (!text) return { cidade: null, uf: null };
  const parts = text.split(/\s*[\/|-]\s*/).map(x => x.trim()).filter(Boolean);
  if (parts.length < 2) return { cidade: text, uf: null };
  const ufCandidate = parts[parts.length - 1].toUpperCase();
  return {
    cidade: parts.slice(0, -1).join(' / ') || null,
    uf: /^[A-Z]{2}$/.test(ufCandidate) ? ufCandidate : null
  };
};

async function supabase(path, options = {}) {
  const headers = {
    apikey: SECRET_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (SECRET_KEY && SECRET_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SECRET_KEY}`;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text || null; }
  if (!response.ok) {
    const error = new Error(data?.message || data?.hint || `Supabase ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });
  if (!SECRET_KEY) return res.status(503).json({ error: 'Integração com banco ainda não configurada na Vercel.' });

  const body = req.body || {};
  const form = body.form || {};
  const lookup = body.cnpjData || {};
  const cnpj = cleanCnpj(form.cnpj || lookup.cnpj);

  if (!validCnpj(cnpj)) return res.status(400).json({ error: 'CNPJ válido é obrigatório para salvar.' });
  if (!String(form.razao || lookup.razao_social || '').trim()) return res.status(400).json({ error: 'Razão social é obrigatória.' });

  try {
    const manualLocation = parseCityUf(form.cidade_uf);
    const clientPayload = {
      cnpj,
      razao_social: String(form.razao || lookup.razao_social || '').trim(),
      nome_fantasia: String(form.nome_fantasia || lookup.nome_fantasia || '').trim() || null,
      situacao_cadastral: String(lookup.situacao_cadastral || '').trim() || null,
      cnae_principal: String(lookup.cnae_principal || '').trim() || null,
      atividade_principal: String(form.atividade_cnpj || lookup.atividade_principal || '').trim() || null,
      endereco: String(form.endereco || lookup.endereco || '').trim() || null,
      cidade: String(manualLocation.cidade || lookup.cidade || '').trim() || null,
      uf: String(manualLocation.uf || lookup.uf || '').trim() || null,
      cep: String(form.cep || lookup.cep || '').trim() || null,
      responsavel: String(form.responsavel || '').trim() || null,
      email: String(form.email || '').trim() || null,
      telefone: String(form.telefone || '').trim() || null,
      updated_at: new Date().toISOString()
    };

    const clients = await supabase('bpo_clients?on_conflict=cnpj', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(clientPayload)
    });
    const client = Array.isArray(clients) ? clients[0] : clients;
    if (!client?.id) throw new Error('Cliente salvo sem identificador.');

    const intakePayload = {
      client_id: client.id,
      source: 'proposta_comercial',
      status: 'recebido',
      descricao_negocio: String(form.descricao || '').trim() || null,
      dor: String(form.dor || '').trim() || null,
      expectativa: String(form.expectativa || '').trim() || null,
      ramo: String(form.ramos || form.ramo || '').trim() || null,
      faturamento: toNumber(form.faturamento),
      recebimentos_mes: toInteger(form.recebimentos),
      pagamentos_mes: toInteger(form.pagamentos),
      notas_emitidas_mes: toInteger(form.notas),
      notas_recebidas_mes: toInteger(form.notas_recebidas),
      outros_lancamentos_mes: toInteger(form.lancamentos),
      contratos_novos_mes: toInteger(form.contratos_novos),
      comissoes_lancadas_mes: toInteger(form.comissoes_lancadas),
      bancos_ativos: String(form.bancos || '').trim() || null,
      cartoes: String(form.cartoes || '').trim() || null,
      contas_aplicacao: String(form.contas_aplicacao || '').trim() || null,
      cnpjs_operacao: String(form.cnpjs || '').trim() || null,
      filiais: String(form.filiais || '').trim() || null,
      centros_custo: String(form.centros_custo || '').trim() || null,
      funcionarios_clt: String(form.funcionarios || '').trim() || null,
      situacao_atual: String(form.implantacao_situacao || '').trim() || null,
      atrasados_retrabalho: String(form.dor_atrasados || '').toLowerCase() === 'sim',
      escopo: Array.isArray(form.escopo) ? form.escopo : [],
      raw_payload: { form, cnpjData: lookup },
      updated_at: new Date().toISOString()
    };

    const intakes = await supabase('bpo_intakes', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(intakePayload)
    });
    const intake = Array.isArray(intakes) ? intakes[0] : intakes;

    return res.status(201).json({ ok: true, client_id: client.id, intake_id: intake?.id || null });
  } catch (err) {
    console.error('Intake save error:', err);
    return res.status(500).json({ error: 'Não foi possível salvar os dados agora. Nenhuma proposta foi liberada.' });
  }
};
