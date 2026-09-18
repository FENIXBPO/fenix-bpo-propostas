'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { buildApprovedSnapshot, validateApprovedSnapshot, MASTER_PDF_SHA256 } = require('../lib/proposal-master');
const { renderFromFrozenMaster, sha256 } = require('../lib/master-pdf-runtime');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfngupnsacddtdbcrkdk.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALFA_INTAKE_ID = '66c8c6a9-9634-4039-8575-66dc86df53bb';

async function sb(resource) {
  if (!SECRET_KEY) throw new Error('SUPABASE_SECRET_KEY ausente no ambiente de homologação');
  const headers = { apikey: SECRET_KEY };
  if (SECRET_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SECRET_KEY}`;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, { headers, cache: 'no-store' });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.json();
}

(async () => {
  const proposals = await sb(`bpo_proposals?intake_id=eq.${ALFA_INTAKE_ID}&select=*&order=version.desc&limit=1`);
  const proposal = proposals[0];
  assert.ok(proposal, 'Proposta ALFA não encontrada');
  assert.ok(['aprovada_cfo', 'publicada'].includes(proposal.status), 'ALFA não está aprovada/publicada');

  const intakes = await sb(`bpo_intakes?id=eq.${ALFA_INTAKE_ID}&select=*&limit=1`);
  const intake = intakes[0];
  assert.ok(intake, 'Intake ALFA não encontrado');

  const clients = await sb(`bpo_clients?id=eq.${intake.client_id}&select=*&limit=1`);
  const client = clients[0] || {};

  const snapshot = buildApprovedSnapshot({ proposal, intake, client });
  const validation = validateApprovedSnapshot(snapshot);
  assert.strictEqual(validation.ok, true, `Snapshot real ALFA inválido: ${validation.errors.join(', ')}`);

  assert.strictEqual(snapshot.commercial_terms.fenix_monthly, 2300);
  assert.strictEqual(snapshot.commercial_terms.recurring_pass_through, 200);
  assert.strictEqual(snapshot.commercial_terms.total_monthly, 2500);
  assert.strictEqual(snapshot.commercial_terms.implementation, 1500);
  assert.strictEqual(snapshot.commercial_terms.software_name, 'Conta Azul');

  const masterPath = path.join(__dirname, '..', 'assets', 'master-oficial', 'FENIX_MASTER_CLEAN_RUNTIME.pdf');
  const master = fs.readFileSync(masterPath);
  assert.strictEqual(sha256(master), MASTER_PDF_SHA256, 'Hash do Master oficial divergente');

  const pdf = await renderFromFrozenMaster(master, snapshot, {
    expectedSha256: MASTER_PDF_SHA256,
    scopeIntro: 'Escopo validado a partir da coleta e aprovado pelo CFO.',
    implementationTerm: String(proposal.assumptions?.prazo_implantacao || '').trim(),
    dependencies: String(proposal.assumptions?.dependencias_implantacao || '').trim(),
  });

  const parsed = await PDFDocument.load(pdf);
  assert.strictEqual(parsed.getPageCount(), 8, 'PDF ALFA real deve manter 8 páginas');

  console.log('alfa-live-integration: OK — banco real + Master oficial + PDF');
})().catch((err) => { console.error(err); process.exit(1); });
