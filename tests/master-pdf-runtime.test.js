'use strict';

const assert = require('assert');
const { PDFDocument } = require('pdf-lib');
const { renderFromFrozenMaster, sha256, assertTemplate } = require('../lib/master-pdf-runtime');

async function blankMaster() {
  const pdf = await PDFDocument.create();
  for (let i = 0; i < 8; i += 1) pdf.addPage([13.3333 * 72, 7.5 * 72]);
  return Buffer.from(await pdf.save({ useObjectStreams: false }));
}

const snapshot = {
  master_id: 'FENIX_PROPOSTA_HOMOLOGACAO_MASTER_HIBRIDO_V1',
  proposal_code: 'FENIX-HML-0001-V1',
  proposal_date: '2026-09-17',
  cfo_approved: true,
  client: { legal_name: 'ALFA SERVIÇOS EMPRESARIAIS LTDA', segment: 'Serviços' },
  operation: {
    current_scenario: 'Empresa de serviços em fase de estruturação das rotinas financeiras.',
    main_challenges: 'Reduzir retrabalho e organizar contas a pagar e receber.',
    objective: 'Implantar rotina financeira organizada e rastreável.',
    cnpjs: 1, bank_accounts: 2, projected_volume: 120000, erp: 'Conta Azul',
  },
  approved_scope: {
    operational: ['Contas a pagar e receber conforme escopo aprovado', 'Conciliação bancária conforme rotina aprovada', 'Fluxo de caixa operacional', 'Organização de documentos e informações financeiras'],
    managerial: ['Organização das informações para acompanhamento', 'Relatório operacional de pendências e fluxo de caixa'],
  },
  commercial_terms: {
    fenix_monthly: 2300, recurring_pass_through: 200, software_name: 'Conta Azul', implementation: 1500,
    total_monthly: 2500, validity_days: 10, payment_terms: 'Vencimento mensal conforme contrato. Proposta válida por 10 dias.',
  },
};

(async () => {
  const master = await blankMaster();
  const hash = sha256(master);
  assert.doesNotThrow(() => assertTemplate(master, hash));
  assert.throws(() => assertTemplate(master, '0'.repeat(64)), /MASTER_PDF_HASH_DIVERGENTE/);

  const out = await renderFromFrozenMaster(master, snapshot, {
    expectedSha256: hash,
    indicatorNote: 'Indicadores do caso de homologação',
    scopeIntro: 'Escopo validado a partir da coleta e aprovado pelo CFO.',
    implementationTerm: '15 a 30 dias',
    dependencies: 'Acessos bancários, Conta Azul e documentos iniciais.',
  });
  const parsed = await PDFDocument.load(out);
  assert.strictEqual(parsed.getPageCount(), 8, 'PDF final deve manter 8 páginas');

  const noCfo = structuredClone(snapshot); noCfo.cfo_approved = false;
  await assert.rejects(() => renderFromFrozenMaster(master, noCfo, { expectedSha256: hash }), /INVALID_SNAPSHOT/);

  const wrongTotal = structuredClone(snapshot); wrongTotal.commercial_terms.total_monthly = 2700;
  await assert.rejects(() => renderFromFrozenMaster(master, wrongTotal, { expectedSha256: hash }), /INVALID_SNAPSHOT/);

  const zero = structuredClone(snapshot); zero.commercial_terms.recurring_pass_through = 0; zero.commercial_terms.software_name = ''; zero.commercial_terms.total_monthly = 2300;
  const zeroOut = await renderFromFrozenMaster(master, zero, { expectedSha256: hash });
  assert.strictEqual((await PDFDocument.load(zeroOut)).getPageCount(), 8);

  console.log('master-pdf-runtime: ok');
})().catch((err) => { console.error(err); process.exit(1); });
