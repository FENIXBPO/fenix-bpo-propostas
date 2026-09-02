const assert = require('assert');

process.env.SUPABASE_SECRET_KEY = 'test-secret';
process.env.FENIX_INTERNAL_PASSWORD = 'test-password';

function responseCapture() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

function jsonResponse(data, ok = true, status = 200) {
  return { ok, status, text: async () => JSON.stringify(data) };
}

async function testAcceptanceRejectsProposalFromAnotherClient() {
  const calls = [];
  global.fetch = async url => {
    calls.push(url);
    if (url.includes('bpo_clients?')) return jsonResponse([{ id: 'client-a', cnpj: '12345678000199' }]);
    if (url.includes('bpo_proposals?public_slug=')) return jsonResponse([{ id: 'proposal-b', intake_id: 'intake-b', status: 'publicada' }]);
    if (url.includes('bpo_intakes?id=eq.intake-b')) return jsonResponse([{ id: 'intake-b', client_id: 'client-b', status: 'proposta_publicada', raw_payload: {} }]);
    throw new Error(`Chamada inesperada: ${url}`);
  };

  delete require.cache[require.resolve('../api/proposal-acceptance')];
  const handler = require('../api/proposal-acceptance');
  const req = { method: 'POST', body: { cnpj: '12.345.678/0001-99', nome: 'Responsável', email: 'responsavel@cliente.com.br', accepted: true, proposal_ref: 'proposta-b' } };
  const res = responseCapture();
  await handler(req, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /não pertence ao CNPJ/i);
  assert.equal(calls.length, 3, 'O aceite divergente deve parar antes de qualquer gravação.');
}

async function testReopenRejectsActiveOpportunity() {
  global.fetch = async url => {
    if (url.includes('bpo_intakes?id=eq.11111111-1111-1111-1111-111111111111')) {
      return jsonResponse([{ id: '11111111-1111-1111-1111-111111111111', status: 'em_analise_cfo', raw_payload: {} }]);
    }
    throw new Error(`Chamada inesperada: ${url}`);
  };

  delete require.cache[require.resolve('../api/internal-intake-stage')];
  const handler = require('../api/internal-intake-stage');
  const req = {
    method: 'POST',
    headers: { cookie: '' },
    body: { intake_id: '11111111-1111-1111-1111-111111111111', action: 'reopen' }
  };

  // Assina um cookie válido usando a mesma regra do endpoint.
  const crypto = require('crypto');
  const exp = String(Math.floor(Date.now() / 1000) + 300);
  const sig = crypto.createHmac('sha256', process.env.FENIX_INTERNAL_PASSWORD).update(exp).digest('base64url');
  req.headers.cookie = `fenix_internal_session=${exp}.${sig}`;

  const res = responseCapture();
  await handler(req, res);
  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /Somente oportunidades encerradas/i);
}

(async () => {
  await testAcceptanceRejectsProposalFromAnotherClient();
  await testReopenRejectsActiveOpportunity();
  console.log('PASS bloqueios de aceite e Pipeline');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
