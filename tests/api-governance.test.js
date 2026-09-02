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

function validInternalCookie() {
  const crypto = require('crypto');
  const exp = String(Math.floor(Date.now() / 1000) + 300);
  const sig = crypto.createHmac('sha256', process.env.FENIX_INTERNAL_PASSWORD).update(exp).digest('base64url');
  return `fenix_internal_session=${exp}.${sig}`;
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
    headers: { cookie: validInternalCookie() },
    body: { intake_id: '11111111-1111-1111-1111-111111111111', action: 'reopen' }
  };

  const res = responseCapture();
  await handler(req, res);
  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /Somente oportunidades encerradas/i);
}

async function testContractAuthorizationRequiresAcceptedProposal() {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url, method: options.method || 'GET' });
    if (url.includes('bpo_proposals?intake_id=eq.22222222-2222-2222-2222-222222222222')) {
      assert(url.includes('status=eq.proposta_aceita_aguardando_cfo'), 'Autorização contratual deve buscar explicitamente a proposta aceita.');
      return jsonResponse([]);
    }
    throw new Error(`Chamada inesperada: ${options.method || 'GET'} ${url}`);
  };

  delete require.cache[require.resolve('../api/internal-contract')];
  const handler = require('../api/internal-contract');
  const req = {
    method: 'POST',
    headers: { cookie: validInternalCookie() },
    query: {},
    body: { intake_id: '22222222-2222-2222-2222-222222222222', contract_fields: {} }
  };
  const res = responseCapture();
  await handler(req, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /proposta efetivamente aceita/i);
  assert.equal(calls.length, 1, 'Sem proposta aceita, nenhuma leitura adicional ou gravação deve ocorrer.');
  assert(calls.every(call => call.method === 'GET'), 'Sem proposta aceita, autorização não pode gravar dados.');
}

async function testContractPreviewGetHasNoWriteSideEffect() {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    calls.push({ url, method: options.method || 'GET' });
    if (url.includes('bpo_contracts?contract_code=')) {
      return jsonResponse([{
        id: 'contract-1',
        proposal_id: 'proposal-1',
        contract_code: 'CTR-TESTE',
        template_version: 'Contrato_Fenix_BPO_MODELO_PADRAO_v22',
        status: 'autorizado_cfo_aguardando_geracao',
        generated_at: null,
        contract_data: { client: {}, legal: {}, commercial_terms: {}, approved_scope: {}, assumptions: {} }
      }]);
    }
    throw new Error(`GET de prévia não deve gravar. Chamada inesperada: ${options.method || 'GET'} ${url}`);
  };

  delete require.cache[require.resolve('../api/internal-contract-document')];
  const handler = require('../api/internal-contract-document');
  const req = { method: 'GET', headers: { cookie: validInternalCookie() }, query: { ref: 'CTR-TESTE' }, body: {} };
  const res = responseCapture();
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, 'autorizado_cfo_aguardando_geracao');
  assert.equal(res.body.generated_at, null);
  assert.equal(calls.length, 1);
  assert(calls.every(call => call.method === 'GET'), 'Prévia GET não pode executar PATCH/POST.');
}

(async () => {
  await testAcceptanceRejectsProposalFromAnotherClient();
  await testReopenRejectsActiveOpportunity();
  await testContractAuthorizationRequiresAcceptedProposal();
  await testContractPreviewGetHasNoWriteSideEffect();
  console.log('PASS bloqueios de aceite, Pipeline e contrato vinculados à proposta aceita');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
