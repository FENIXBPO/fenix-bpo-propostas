'use strict';

const crypto = require('crypto');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { validateApprovedSnapshot, EXPECTED_PAGES, MASTER_ID } = require('./proposal-master');

const GOLD = rgb(222 / 255, 176 / 255, 65 / 255);
const WHITE = rgb(1, 1, 1);
const LIGHT = rgb(231 / 255, 231 / 255, 231 / 255);
const MUTED = rgb(216 / 255, 209 / 255, 199 / 255);

// Coordenadas medidas no Master Oficial 13.3333 x 7.5 in.
// O runtime apenas escreve nos campos dinâmicos; nenhum elemento fixo é recriado.
const IN = 72;
const H = 7.5 * IN;
const box = (x, y, w, h) => ({ x: x * IN, y: H - (y + h) * IN, w: w * IN, h: h * IN });

const LAYOUT = Object.freeze({
  p1: {
    client: box(0.84, 3.562, 7.6, 0.487),
    footerClient: box(2.24, 7.043, 2.733, 0.225),
    footerSegment: box(5.20, 7.043, 1.40, 0.225),
    footerDate: box(7.747, 7.043, 1.333, 0.225),
  },
  p2: {
    scenario: box(0.71, 3.20, 2.02, 0.82), challenges: box(3.24, 3.20, 2.02, 0.82), objective: box(5.77, 3.20, 2.02, 0.82),
    cnpjs: box(2.75, 4.66, 0.45, 0.32), banks: box(4.34, 4.66, 0.45, 0.32), volume: box(6.20, 4.66, 1.15, 0.32),
    indicatorNote: box(6.00, 5.23, 1.70, 0.14),
  },
  p3: {
    intro: box(0.55, 2.06, 7.80, 0.40),
    op: [box(1.06, 3.33, 3.05, 0.40), box(1.06, 3.85, 3.05, 0.40), box(1.06, 4.37, 3.05, 0.40), box(1.06, 4.89, 3.05, 0.40)],
    mg: [box(5.01, 3.33, 3.05, 0.40), box(5.01, 3.85, 3.05, 0.40)],
  },
  p5: { erp: box(2.45, 2.80, 2.20, 0.32) },
  p6: { term: box(2.05, 5.68, 1.75, 0.30), dependencies: box(5.00, 5.68, 2.65, 0.30) },
  p7: {
    fenix: box(0.67, 3.66, 1.62, 0.58), software: box(2.77, 3.66, 1.62, 0.58), implementation: box(4.87, 3.66, 1.62, 0.58), total: box(6.97, 3.66, 1.62, 0.58),
    commercialTerms: box(0.65, 5.98, 7.55, 0.42),
  },
  p8: { acceptance: box(1.20, 6.42, 6.50, 0.22) },
});

function sha256(bytes) { return crypto.createHash('sha256').update(Buffer.from(bytes)).digest('hex'); }
function text(v) { return String(v ?? '').trim(); }
function brl(v, monthly = false) {
  const value = Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return monthly ? `${value}/mês` : value;
}
function dateBR(v) {
  const s = text(v);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`;
}
function volumeBRL(v) { return `R$ ${Number(v || 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`; }

function assertTemplate(bytes, expectedSha256) {
  if (!bytes || !bytes.length) throw new Error('MASTER_PDF_AUSENTE');
  if (expectedSha256 && sha256(bytes) !== expectedSha256) throw new Error('MASTER_PDF_HASH_DIVERGENTE');
}

function fitSize(font, value, maxSize, minSize, width) {
  let size = maxSize;
  while (size > minSize && font.widthOfTextAtSize(value, size) > width) size -= 0.25;
  if (font.widthOfTextAtSize(value, size) > width) throw new Error(`OVERFLOW_PDF:${value.slice(0, 40)}`);
  return size;
}

function drawSingle(page, font, value, region, maxSize, opts = {}) {
  const v = text(value); if (!v) return;
  const size = fitSize(font, v, maxSize, opts.minSize || Math.max(6.5, maxSize - 4), region.w);
  const tw = font.widthOfTextAtSize(v, size);
  let x = region.x;
  if (opts.align === 'center') x += Math.max(0, (region.w - tw) / 2);
  page.drawText(v, { x, y: region.y + Math.max(0, (region.h - size) / 2), size, font, color: opts.color || WHITE });
}

function wrap(font, value, size, width) {
  const words = text(value).split(/\s+/).filter(Boolean); const lines = []; let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (!line || font.widthOfTextAtSize(next, size) <= width) line = next;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line); return lines;
}

function drawWrapped(page, font, value, region, maxSize, opts = {}) {
  const v = text(value); if (!v) return;
  let size = maxSize; let lines = wrap(font, v, size, region.w); const min = opts.minSize || Math.max(6.5, maxSize - 2.5);
  const lineHeightFactor = opts.lineHeightFactor || 1.22;
  while (size > min && lines.length * size * lineHeightFactor > region.h) { size -= 0.25; lines = wrap(font, v, size, region.w); }
  if (lines.length * size * lineHeightFactor > region.h) throw new Error(`OVERFLOW_PDF:${v.slice(0, 40)}`);
  let y = region.y + region.h - size;
  for (const line of lines) { page.drawText(line, { x: region.x, y, size, font, color: opts.color || LIGHT }); y -= size * lineHeightFactor; }
}

async function renderFromFrozenMaster(templateBytes, snapshot, options = {}) {
  const validation = validateApprovedSnapshot(snapshot);
  if (!validation.ok) throw new Error(`INVALID_SNAPSHOT:${validation.errors.join(',')}`);
  if (snapshot.master_id && snapshot.master_id !== MASTER_ID) throw new Error('MASTER_ID_DIVERGENTE');
  assertTemplate(templateBytes, options.expectedSha256);

  const pdf = await PDFDocument.load(templateBytes, { updateMetadata: false });
  if (pdf.getPageCount() !== EXPECTED_PAGES) throw new Error(`MASTER_PAGES:${pdf.getPageCount()}!=${EXPECTED_PAGES}`);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();
  const c = snapshot.client; const o = snapshot.operation; const t = snapshot.commercial_terms; const s = snapshot.approved_scope;
  const footerClient = text(c.legal_name).toUpperCase(); const d = dateBR(snapshot.proposal_date);

  drawSingle(pages[0], bold, footerClient, LAYOUT.p1.client, 25, { minSize: 17, color: GOLD });
  for (const page of pages) {
    drawSingle(page, bold, footerClient, LAYOUT.p1.footerClient, 8.69, { minSize: 6.5 });
    drawSingle(page, bold, c.segment, LAYOUT.p1.footerSegment, 8.69, { minSize: 6.5 });
    drawSingle(page, bold, d, LAYOUT.p1.footerDate, 8.69, { minSize: 6.5 });
  }

  drawWrapped(pages[1], regular, o.current_scenario, LAYOUT.p2.scenario, 9.2);
  drawWrapped(pages[1], regular, o.main_challenges, LAYOUT.p2.challenges, 9.2);
  drawWrapped(pages[1], regular, o.objective, LAYOUT.p2.objective, 9.2);
  drawSingle(pages[1], bold, String(o.cnpjs), LAYOUT.p2.cnpjs, 21, { minSize: 14, align: 'center' });
  drawSingle(pages[1], bold, String(o.bank_accounts || 0), LAYOUT.p2.banks, 21, { minSize: 14, align: 'center' });
  drawSingle(pages[1], bold, volumeBRL(o.projected_volume), LAYOUT.p2.volume, 16, { minSize: 10, align: 'center' });
  if (options.indicatorNote) drawSingle(pages[1], regular, options.indicatorNote, LAYOUT.p2.indicatorNote, 6.8, { minSize: 5.5, color: MUTED });

  if (options.scopeIntro) drawWrapped(pages[2], regular, options.scopeIntro, LAYOUT.p3.intro, 11.8, { minSize: 9.5 });
  (s.operational || []).slice(0, 4).forEach((v, i) => drawWrapped(pages[2], regular, `• ${v}`, LAYOUT.p3.op[i], 10.3, { minSize: 8.2 }));
  (s.managerial || []).slice(0, 2).forEach((v, i) => drawWrapped(pages[2], regular, `• ${v}`, LAYOUT.p3.mg[i], 10.3, { minSize: 8.2 }));

  drawSingle(pages[4], bold, o.erp || t.software_name || 'Não aplicável', LAYOUT.p5.erp, 15, { minSize: 10 });
  if (options.implementationTerm) drawSingle(pages[5], bold, options.implementationTerm, LAYOUT.p6.term, 12, { minSize: 8 });
  if (options.dependencies) drawWrapped(pages[5], bold, options.dependencies, LAYOUT.p6.dependencies, 11, { minSize: 8.5 });

  drawSingle(pages[6], bold, brl(t.fenix_monthly, true), LAYOUT.p7.fenix, 10.4, { minSize: 8, align: 'center' });
  if (Number(t.recurring_pass_through || 0) > 0) drawSingle(pages[6], bold, brl(t.recurring_pass_through, true), LAYOUT.p7.software, 10.4, { minSize: 8, align: 'center' });
  drawSingle(pages[6], bold, brl(t.implementation, false), LAYOUT.p7.implementation, 10.4, { minSize: 8, align: 'center' });
  drawSingle(pages[6], bold, brl(t.total_monthly, true), LAYOUT.p7.total, 11.2, { minSize: 8.5, align: 'center' });
  drawWrapped(pages[6], bold, t.payment_terms || '', LAYOUT.p7.commercialTerms, 10.1, { minSize: 8 });
  drawSingle(pages[7], regular, `Aceite vinculado à proposta ${snapshot.proposal_code || ''}`, LAYOUT.p8.acceptance, 8.6, { minSize: 7, align: 'center', color: MUTED });

  return Buffer.from(await pdf.save({ useObjectStreams: false, addDefaultPage: false, updateFieldAppearances: false }));
}

module.exports = { LAYOUT, sha256, assertTemplate, renderFromFrozenMaster };
