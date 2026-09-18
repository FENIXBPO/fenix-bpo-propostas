'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { renderFromFrozenMaster, sha256, assertTemplate } = require('../lib/master-pdf-runtime');
const { MASTER_PDF_SHA256 } = require('../lib/proposal-master');

const masterPath = path.join(__dirname, '..', 'assets', 'master-oficial', 'FENIX_MASTER_CLEAN_RUNTIME.pdf');
const fixturePath = path.join(__dirname, 'fixtures', 'alfa-master-snapshot.json');
const snapshot = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

(async () => {
  assert.ok(fs.existsSync(masterPath), 'Master oficial real ausente');
  const master = fs.readFileSync(masterPath);
  const hash = sha256(master);

  assert.strictEqual(hash, MASTER_PDF_SHA256, 'Hash do Master oficial divergente');
  assert.doesNotThrow(() => assertTemplate(master, MASTER_PDF_SHA256));
  assert.throws(() => assertTemplate(master, '0'.repeat(64)), /MASTER_PDF_HASH_DIVERGENTE/);

  const out = await renderFromFrozenMaster(master, snapshot, {
    expectedSha256: MASTER_PDF_SHA256,
    indicatorNote: 'Indicadores do caso de homologação',
    scopeIntro: 'Escopo validado a partir da coleta e aprovado pelo CFO.',
    implementationTerm: '15 a 30 dias',
    dependencies: 'Acessos bancários, Conta Azul e documentos iniciais.',
  });

  const parsed = await PDFDocument.load(out);
  assert.strictEqual(parsed.getPageCount(), 8, 'PDF final deve manter 8 páginas');
  assert.strictEqual(snapshot.commercial_terms.fenix_monthly, 2300);
  assert.strictEqual(snapshot.commercial_terms.recurring_pass_through, 200);
  assert.strictEqual(snapshot.commercial_terms.total_monthly, 2500);
  assert.strictEqual(snapshot.commercial_terms.implementation, 1500);

  const noCfo = structuredClone(snapshot);
  noCfo.cfo_approved = false;
  await assert.rejects(
    () => renderFromFrozenMaster(master, noCfo, { expectedSha256: MASTER_PDF_SHA256 }),
    /INVALID_SNAPSHOT/
  );

  const wrongTotal = structuredClone(snapshot);
  wrongTotal.commercial_terms.total_monthly = 2700;
  await assert.rejects(
    () => renderFromFrozenMaster(master, wrongTotal, { expectedSha256: MASTER_PDF_SHA256 }),
    /INVALID_SNAPSHOT/
  );

  const zero = structuredClone(snapshot);
  zero.commercial_terms.recurring_pass_through = 0;
  zero.commercial_terms.software_name = '';
  zero.commercial_terms.total_monthly = 2300;
  const zeroOut = await renderFromFrozenMaster(master, zero, { expectedSha256: MASTER_PDF_SHA256 });
  assert.strictEqual((await PDFDocument.load(zeroOut)).getPageCount(), 8);

  console.log('master-pdf-runtime: OK — Master oficial real + ALFA');
})().catch((err) => { console.error(err); process.exit(1); });
