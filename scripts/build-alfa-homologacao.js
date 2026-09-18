'use strict';

const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const { renderFromFrozenMaster, sha256 } = require('../lib/master-pdf-runtime');
const { validateApprovedSnapshot, MASTER_PDF_SHA256 } = require('../lib/proposal-master');

(async () => {
  const root = path.join(__dirname, '..');
  const masterPath = path.join(root, 'assets', 'master-oficial', 'FENIX_MASTER_CLEAN_RUNTIME.pdf');
  const fixturePath = path.join(root, 'tests', 'fixtures', 'alfa-master-snapshot.json');
  if (!fs.existsSync(masterPath)) throw new Error('MASTER_OFICIAL_AUSENTE');
  if (!fs.existsSync(fixturePath)) throw new Error('ALFA_FIXTURE_AUSENTE');

  const master = fs.readFileSync(masterPath);
  if (sha256(master) !== MASTER_PDF_SHA256) throw new Error('MASTER_HASH_DIVERGENTE');

  const snapshot = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const validation = validateApprovedSnapshot(snapshot);
  if (!validation.ok) throw new Error('ALFA_SNAPSHOT_INVALIDO:' + validation.errors.join(','));

  if (snapshot.commercial_terms.fenix_monthly !== 2300) throw new Error('ALFA_FENIX_MONTHLY');
  if (snapshot.commercial_terms.recurring_pass_through !== 200) throw new Error('ALFA_SOFTWARE_MONTHLY');
  if (snapshot.commercial_terms.total_monthly !== 2500) throw new Error('ALFA_TOTAL_MONTHLY');
  if (snapshot.commercial_terms.implementation !== 1500) throw new Error('ALFA_IMPLEMENTATION');

  const pdf = await renderFromFrozenMaster(master, snapshot, {
    expectedSha256: MASTER_PDF_SHA256,
    indicatorNote: 'Indicadores do caso de homologação',
    scopeIntro: 'Escopo validado a partir da coleta e aprovado pelo CFO.',
    implementationTerm: '15 a 30 dias, condicionado a acessos e informações',
    dependencies: 'Acessos bancários, Conta Azul e documentos iniciais.',
  });

  const parsed = await PDFDocument.load(pdf);
  if (parsed.getPageCount() !== 8) throw new Error('ALFA_PDF_PAGINAS');

  const outDir = path.join(root, 'homologacao', 'artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'FENIX-HML-0001-V1.pdf'), pdf);
  fs.writeFileSync(path.join(outDir, 'FENIX-HML-0001-V1.json'), JSON.stringify({
    ok: true,
    master_sha256: MASTER_PDF_SHA256,
    pages: parsed.getPageCount(),
    fenix_monthly: snapshot.commercial_terms.fenix_monthly,
    software_monthly: snapshot.commercial_terms.recurring_pass_through,
    total_monthly: snapshot.commercial_terms.total_monthly,
    implementation: snapshot.commercial_terms.implementation
  }, null, 2));

  console.log('ALFA homologacao: OK');
})().catch((err) => { console.error(err); process.exit(1); });
