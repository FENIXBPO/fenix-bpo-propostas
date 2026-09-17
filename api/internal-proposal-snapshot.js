'use strict';

const crypto = require('crypto');
const { buildApprovedSnapshot, validateApprovedSnapshot } = require('../lib/proposal-master');

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
  const text = await r.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) throw new Error(data?.message || `Supabase ${r.status}`);
  return data;
}

module.exports = async function handler(req, res) {
  if (!password() || !SECRET_KEY) return res.status(503).json({ error: 'Área interna ainda não configurada.' });
  if (!authorized(req)) return res.status(401).json({ error: 'Acesso não autorizado.' });
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  const intakeId = String(req.query?.intake_id || req.body?.intake_id || '').trim();
  if (!/^[0-9a-f-]{36}$/i.test(intakeId)) return res.status(400).json({ error: 'Levantamento inválido.' });

  try {
    const proposals = await sb(`bpo_proposals?intake_id=eq.${intakeId}&select=*&order=version.desc&limit=1`);
    const proposal = Array.isArray(proposals) ? proposals[0] : null;
    if (!proposal) return res.status(404).json({ error: 'Proposta não encontrada.' });
    if (!['aprovada_cfo', 'publicada'].includes(proposal.status)) {
      return res.status(409).json({ error: 'A proposta precisa estar aprovada pelo CFO antes de gerar o snapshot oficial.' });
    }

    const intakes = await sb(`bpo_intakes?id=eq.${intakeId}&select=*&limit=1`);
    const intake = Array.isArray(intakes) ? intakes[0] : null;
    if (!intake) return res.status(404).json({ error: 'Levantamento não encontrado.' });

    const clients = intake.client_id
      ? await sb(`bpo_clients?id=eq.${intake.client_id}&select=*&limit=1`)
      : [];
    const client = Array.isArray(clients) ? clients[0] || {} : {};

    const snapshot = buildApprovedSnapshot({ proposal, intake, client });
    const validation = validateApprovedSnapshot(snapshot);

    if (!validation.ok) {
      return res.status(409).json({
        error: 'Snapshot do Master inconsistente. Geração bloqueada.',
        fields: validation.errors,
        validation,
      });
    }

    return res.status(200).json({ ok: true, snapshot, validation });
  } catch (err) {
    console.error('Internal proposal snapshot error:', err);
    return res.status(500).json({ error: 'Não foi possível montar o snapshot oficial da proposta.' });
  }
};
