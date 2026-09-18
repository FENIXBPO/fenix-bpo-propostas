'use strict';

const crypto = require('crypto');
const { buildApprovedSnapshot, validateApprovedSnapshot, MASTER_PDF_SHA256 } = require('../lib/proposal-master');
const { renderFromFrozenMaster } = require('../lib/master-pdf-runtime');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const COOKIE = 'fenix_internal_session';

function password() { return process.env.FENIX_INTERNAL_PASSWORD || ''; }
function sign(v) { return crypto.createHmac('sha256', password()).update(v).digest('base64url'); }
function safeEqual(a, b) {
  const A = Buffer.from(String(a || ''));
  const B = Buffer.from(String(b || ''));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}
function cookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function authorized(req) {
  const token = cookies(req)[COOKIE];
  if (!token) return false;
  const [exp, sig] = String(token).split('.');
  return !!(exp && sig && Number(exp) >= Math.floor(Date.now() / 1000) && safeEqual(sig, sign(exp)));
}
async function sb(path, options = {}) {
  const headers = { apikey: SECRET_KEY, 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (SECRET_KEY?.startsWith('eyJ')) headers.Authorization = `Bearer ${SECRET_KEY}`;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers });
  const body = await r.text();
  let data = null;
  try { data = body ? JSON.parse(body) : null; } catch { data = body; }
  if (!r.ok) throw new Error(data?.message || `Supabase ${r.status}`);
  return data;
}
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function slugify(v) {
  return String(v || 'proposta').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'proposta';
}
function validateTerms(terms = {}) {
  const errors = [];
  for (const k of ['base_monthly', 'discount', 'final_monthly', 'implementation', 'software_total']) {
    if (terms[k] === undefined || terms[k] === null || num(terms[k]) < 0) errors.push(k);
  }
  if (num(terms.cnpjs) < 1) errors.push('cnpjs');
  if (num(terms.software_total) > 0 && !String(terms.software_name || '').trim()) errors.push('software_name');
  return errors;
}

async function snapshotFor(intakeId, proposal) {
  if (!proposal || !['aprovada_cfo', 'publicada'].includes(proposal.status)) {
    return { status: 409, body: { error: 'A proposta precisa estar aprovada pelo CFO antes de gerar o snapshot oficial.' } };
  }
  const intakes = await sb(`bpo_intakes?id=eq.${intakeId}&select=*&limit=1`);
  const intake = Array.isArray(intakes) ? intakes[0] : null;
  if (!intake) return { status: 404, body: { error: 'Levantamento não encontrado.' } };
  const clients = intake.client_id ? await sb(`bpo_clients?id=eq.${intake.client_id}&select=*&limit=1`) : [];
  const client = Array.isArray(clients) ? clients[0] || {} : {};
  const snapshot = buildApprovedSnapshot({ proposal, intake, client });
  const validation = validateApprovedSnapshot(snapshot);
  if (!validation.ok) {
    return { status: 409, body: { error: 'Snapshot do Master inconsistente. Geração bloqueada.', fields: validation.errors, validation } };
  }
  return { status: 200, body: { ok: true, snapshot, validation } };
}

module.exports = async function handler(req, res) {
  if (!password() || !SECRET_KEY) return res.status(503).json({ error: 'Área interna ainda não configurada.' });
  if (!authorized(req)) return res.status(401).json({ error: 'Acesso não autorizado.' });

  const intakeId = String(req.query?.intake_id || req.body?.intake_id || '').trim();
  if (!/^[0-9a-f-]{36}$/i.test(intakeId)) return res.status(400).json({ error: 'Levantamento inválido.' });

  try {
    const currentRows = await sb(`bpo_proposals?intake_id=eq.${intakeId}&select=*&order=version.desc&limit=1`);
    const current = Array.isArray(currentRows) ? currentRows[0] : null;

    if (req.method === 'GET') {
      if (String(req.query?.mode || '') === 'snapshot') {
        const result = await snapshotFor(intakeId, current);
        return res.status(result.status).json(result.body);
      }
      return res.status(200).json({ proposal: current || null });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

    const action = String(req.body?.action || 'save');
    if (!['save', 'approve', 'publish', 'snapshot', 'render_pdf'].includes(action)) return res.status(400).json({ error: 'Ação inválida.' });

    if (action === 'snapshot') {
      const result = await snapshotFor(intakeId, current);
      return res.status(result.status).json(result.body);
    }

    if (action === 'render_pdf') {
      const result = await snapshotFor(intakeId, current);
      if (result.status !== 200) return res.status(result.status).json(result.body);

      const masterUrl = String(process.env.FENIX_MASTER_PDF_URL || '').trim();
      const configuredHash = String(process.env.FENIX_MASTER_PDF_SHA256 || MASTER_PDF_SHA256 || '').trim().toLowerCase();
      if (!masterUrl) {
        return res.status(503).json({
          error: 'Master PDF congelado ainda não configurado no ambiente de homologação.',
          code: 'MASTER_PDF_URL_AUSENTE',
        });
      }
      if (!/^[a-f0-9]{64}$/.test(configuredHash)) {
        return res.status(503).json({
          error: 'Hash do Master PDF não configurado corretamente.',
          code: 'MASTER_PDF_HASH_AUSENTE',
        });
      }

      const masterResponse = await fetch(masterUrl, { cache: 'no-store' });
      if (!masterResponse.ok) {
        return res.status(502).json({
          error: 'Não foi possível carregar o Master PDF congelado.',
          code: 'MASTER_PDF_INDISPONIVEL',
          status: masterResponse.status,
        });
      }
      const masterBytes = Buffer.from(await masterResponse.arrayBuffer());
      const pdf = await renderFromFrozenMaster(masterBytes, result.body.snapshot, {
        expectedSha256: configuredHash,
        scopeIntro: 'Escopo validado a partir da coleta e aprovado pelo CFO.',
        implementationTerm: String(result.body.snapshot?.commercial_terms?.implementation_term || current?.assumptions?.prazo_implantacao || '').trim(),
        dependencies: String(current?.assumptions?.dependencias_implantacao || '').trim(),
      });

      const code = result.body.snapshot.proposal_code || `FENIX-${String(current?.version || 1)}`;
      const safeName = String(code).replace(/[^A-Za-z0-9._-]+/g, '_');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
      res.setHeader('Cache-Control', 'private, no-store');
      res.setHeader('X-Fenix-Master-Id', result.body.snapshot.master_id);
      res.setHeader('X-Fenix-Master-Sha256', configuredHash);
      return res.status(200).send(pdf);
    }

    if (action === 'publish') {
      if (!current || !['aprovada_cfo', 'publicada'].includes(current.status)) {
        return res.status(409).json({ error: 'A proposta precisa estar aprovada pelo CFO antes da publicação.' });
      }
      const termErrors = validateTerms(current.commercial_terms || {});
      if (termErrors.length) {
        return res.status(409).json({ error: 'A proposta possui condições comerciais inconsistentes e não pode ser publicada.', fields: termErrors });
      }
      const intakeRows = await sb(`bpo_intakes?id=eq.${intakeId}&select=id,client_id,ramo&limit=1`);
      const intake = intakeRows?.[0];
      const clientRows = intake?.client_id
        ? await sb(`bpo_clients?id=eq.${intake.client_id}&select=cnpj,razao_social,nome_fantasia&limit=1`)
        : [];
      const client = clientRows?.[0] || {};
      const slug = current.public_slug || `${slugify(client.nome_fantasia || client.razao_social)}-${String(current.version || 1)}`;
      const code = current.proposal_code || `FENIX-${String(client.cnpj || '').slice(-6) || 'CLIENTE'}-V${current.version || 1}`;
      const publicUrl = `https://proposta.fenixbpo.com.br/p/proposta-engine.html?ref=${encodeURIComponent(slug)}`;
      const now = new Date().toISOString();
      const rows = await sb(`bpo_proposals?id=eq.${current.id}`, {
        method: 'PATCH', headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ status: 'publicada', proposal_code: code, public_slug: slug, public_url: publicUrl, published_at: current.published_at || now, updated_at: now }),
      });
      const proposal = rows?.[0] || current;
      await sb('bpo_proposal_events', {
        method: 'POST', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ proposal_id: proposal.id, event_type: 'published', event_data: { version: proposal.version, public_url: publicUrl, renderer: 'proposal-engine-v1' } }),
      });
      await sb(`bpo_intakes?id=eq.${intakeId}`, {
        method: 'PATCH', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ status: 'proposta_publicada', updated_at: now }),
      });
      return res.status(200).json({ ok: true, proposal, public_url: publicUrl });
    }

    const terms = req.body?.commercial_terms || {};
    const termErrors = validateTerms(terms);
    if (action === 'approve' && termErrors.length) {
      return res.status(400).json({ error: 'Preencha e valide os campos comerciais obrigatórios antes de aprovar.', fields: termErrors });
    }
    const editable = current && ['rascunho_cfo', 'em_analise_cfo', 'aprovada_cfo'].includes(current.status);
    const version = editable ? current.version : (current?.version || 0) + 1;
    const status = action === 'approve' ? 'aprovada_cfo' : 'em_analise_cfo';
    const payload = {
      intake_id: intakeId,
      version,
      status,
      cfo_analysis: req.body?.cfo_analysis || {},
      commercial_terms: terms,
      approved_scope: req.body?.approved_scope || { operational: [], managerial: [] },
      assumptions: req.body?.assumptions || {},
      approved_by: action === 'approve' ? 'CFO' : current?.approved_by || null,
      approved_at: action === 'approve' ? new Date().toISOString() : current?.approved_at || null,
      updated_at: new Date().toISOString(),
    };
    let proposal;
    if (editable) {
      const rows = await sb(`bpo_proposals?id=eq.${current.id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
      proposal = rows?.[0] || current;
    } else {
      const rows = await sb('bpo_proposals', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) });
      proposal = rows?.[0] || null;
    }
    if (proposal?.id) {
      await sb('bpo_proposal_events', {
        method: 'POST', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ proposal_id: proposal.id, event_type: action === 'approve' ? 'cfo_approved' : 'cfo_saved', event_data: { version, status } }),
      });
    }
    await sb(`bpo_intakes?id=eq.${intakeId}`, {
      method: 'PATCH', headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status: status === 'aprovada_cfo' ? 'proposta_aprovada_cfo' : 'em_analise_cfo', updated_at: new Date().toISOString() }),
    });
    return res.status(200).json({ ok: true, proposal });
  } catch (err) {
    console.error('Internal proposal error:', err);
    return res.status(500).json({ error: 'Não foi possível processar a proposta.' });
  }
};
