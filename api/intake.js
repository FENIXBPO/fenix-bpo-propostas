const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const cleanCnpj = value => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const validCnpj = value => /^[A-Z0-9]{12}\d{2}$/.test(cleanCnpj(value));
const clean = value => String(value ?? '').trim();
const toNumber = value => {
  const normalized = String(value ?? '').trim().replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
};
const toInteger = value => {
  const match = String(value ?? '').match(/\d+/);
  return match ? Number(match[0]) : null;
};
const parseCityUf = value => {
  const text = clean(value);
  if (!text) return { cidade: null, uf: null };
  const parts = text.split(/\s*[\/|-]\s*/).map(x => x.trim()).filter(Boolean);
  if (parts.length < 2) return { cidade: text, uf: null };
  const ufCandidate = parts[parts.length - 1].toUpperCase();
  return {
    cidade: parts.slice(0, -1).join(' / ') || null,
    uf: /^[A-Z]{2}$/.test(ufCandidate) ? ufCandidate : null
  };
};
const asArray = value => Array.isArray(value) ? value.map(clean).filter(Boolean) : [];

function buildNormalizedSnapshot(form, lookup, clientPayload) {
  return {
    schema_version: '2.1.0',
    captured_at: new Date().toISOString(),
    client: {
      cnpj: clientPayload.cnpj,
      razao_social: clientPayload.razao_social,
      nome_fantasia: clientPayload.nome_fantasia,
      responsavel: clientPayload.responsavel,
      responsavel_cargo: clean(form.cargo) || null,
      email: clientPayload.email,
      telefone: clientPayload.telefone,
      endereco: clientPayload.endereco,
      cidade: clientPayload.cidade,
      uf: clientPayload.uf,
      cep: clientPayload.cep
    },
    business: {
      ramo: clean(form.ramos || form.ramo) || null,
      descricao: clean(form.descricao) || null,
      dor: clean(form.dor) || null,
      expectativa: clean(form.expectativa) || null,
      objetivos: asArray(form.objetivos),
      atividade_que_mais_consome_tempo: clean(form.consome_tempo) || null
    },
    volume: {
      faturamento: toNumber(form.faturamento),
      recebimentos_mes: toInteger(form.recebimentos),
      pagamentos_mes: toInteger(form.pagamentos),
      notas_emitidas_mes: toInteger(form.notas),
      notas_recebidas_mes: null,
      outros_lancamentos_mes: null,
      outros_movimentos: clean(form.outros_movimentos) || null,
      contratos_novos_mes: null,
      comissoes_lancadas_mes: null
    },
    operation: {
      bancos_ativos: clean(form.bancos) || null,
      cartoes: clean(form.cartoes) || null,
      contas_aplicacao: clean(form.contas_aplicacao) || null,
      cnpjs_operacao: clean(form.cnpjs) || null,
      filiais: null,
      centros_custo: clean(form.centros_custo) || null,
      funcionarios_clt: clean(form.funcionarios) || null,
      situacao_atual: clean(form.implantacao_situacao) || null,
      atrasados_retrabalho: clean(form.dor_atrasados).toLowerCase() === 'sim',
      sistema_atual: clean(form.sistema_atual) || null,
      financeiro_interno: clean(form.financeiro_interno) || null,
      contabilidade_definida: clean(form.contabilidade_definida) || null,
      frequencia_desejada: clean(form.frequencia) || null,
      repasses_recorrentes: clean(form.repasses) || null,
      aprovador_financeiro: clean(form.aprovador_financeiro) || null,
      processo_aprovacao: clean(form.processo_aprovacao) || null,
      previsao_inicio: clean(form.previsao_inicio) || null,
      outros_servicos: clean(form.outros_servicos) || null
    },
    scope_requested: asArray(form.escopo),
    lookup: {
      source: lookup && Object.keys(lookup).length ? 'cnpj_lookup' : 'manual',
      situacao_cadastral: clean(lookup.situacao_cadastral) || null,
      cnae_principal: clean(lookup.cnae_principal) || null,
      atividade_principal: clean(lookup.atividade_principal) || null
    }
  };
}

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
  if (!clean(form.razao || lookup.razao_social)) return res.status(400).json({ error: 'Razão social é obrigatória.' });

  try {
    const manualLocation = parseCityUf(form.cidade_uf);
    const clientPayload = {
      cnpj,
      razao_social: clean(form.razao || lookup.razao_social),
      nome_fantasia: clean(form.nome_fantasia || lookup.nome_fantasia) || null,
      situacao_cadastral: clean(lookup.situacao_cadastral) || null,
      cnae_principal: clean(lookup.cnae_principal) || null,
      atividade_principal: clean(lookup.atividade_principal) || null,
      endereco: clean(lookup.endereco) || null,
      cidade: clean(lookup.cidade || manualLocation.cidade) || null,
      uf: clean(lookup.uf || manualLocation.uf) || null,
      cep: clean(lookup.cep) || null,
      responsavel: clean(form.responsavel) || null,
      email: clean(form.email) || null,
      telefone: clean(form.telefone) || null,
      updated_at: new Date().toISOString()
    };

    const clients = await supabase('bpo_clients?on_conflict=cnpj', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(clientPayload)
    });
    const client = Array.isArray(clients) ? clients[0] : clients;
    if (!client?.id) throw new Error('Cliente salvo sem identificador.');

    const normalized = buildNormalizedSnapshot(form, lookup, clientPayload);
    const intakePayload = {
      client_id: client.id,
      source: 'proposta_comercial',
      status: 'recebido',
      descricao_negocio: normalized.business.descricao,
      dor: normalized.business.dor,
      expectativa: normalized.business.expectativa,
      ramo: normalized.business.ramo,
      faturamento: normalized.volume.faturamento,
      recebimentos_mes: normalized.volume.recebimentos_mes,
      pagamentos_mes: normalized.volume.pagamentos_mes,
      notas_emitidas_mes: normalized.volume.notas_emitidas_mes,
      notas_recebidas_mes: null,
      outros_lancamentos_mes: null,
      contratos_novos_mes: null,
      comissoes_lancadas_mes: null,
      bancos_ativos: normalized.operation.bancos_ativos,
      cartoes: normalized.operation.cartoes,
      contas_aplicacao: normalized.operation.contas_aplicacao,
      cnpjs_operacao: normalized.operation.cnpjs_operacao,
      filiais: null,
      centros_custo: normalized.operation.centros_custo,
      funcionarios_clt: normalized.operation.funcionarios_clt,
      situacao_atual: normalized.operation.situacao_atual,
      atrasados_retrabalho: normalized.operation.atrasados_retrabalho,
      escopo: normalized.scope_requested,
      raw_payload: { form, cnpjData: lookup, normalized },
      updated_at: new Date().toISOString()
    };

    const intakes = await supabase('bpo_intakes', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(intakePayload)
    });
    const intake = Array.isArray(intakes) ? intakes[0] : intakes;

    return res.status(201).json({ ok: true, client_id: client.id, intake_id: intake?.id || null, schema_version: normalized.schema_version });
  } catch (err) {
    console.error('Intake save error:', err);
    return res.status(500).json({ error: 'Não foi possível salvar os dados agora. Nenhuma proposta foi liberada.' });
  }
};
