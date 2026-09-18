'use strict';

const MASTER_ID = 'FENIX_PROPOSTA_HOMOLOGACAO_MASTER_HIBRIDO_V1';
const EXPECTED_PAGES = 8;
const MASTER_PDF_SHA256 = '0b3c7283c004ef127390b48b4bc3afeb77da64902ddd5331ddc843dbd8cec96e';

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function text(value) {
  return String(value ?? '').trim();
}

function calculateTotalMonthly(terms = {}) {
  return asNumber(terms.fenix_monthly ?? terms.final_monthly) + asNumber(terms.recurring_pass_through ?? terms.software_total);
}

function validateApprovedSnapshot(snapshot = {}) {
  const errors = [];
  const client = snapshot.client || {};
  const operation = snapshot.operation || {};
  const terms = snapshot.commercial_terms || {};
  const scope = snapshot.approved_scope || {};

  if (!text(client.legal_name)) errors.push('client.legal_name');
  if (!text(client.segment)) errors.push('client.segment');
  if (!text(snapshot.proposal_date)) errors.push('proposal_date');
  if (!text(operation.current_scenario)) errors.push('operation.current_scenario');
  if (!text(operation.main_challenges)) errors.push('operation.main_challenges');
  if (!text(operation.objective)) errors.push('operation.objective');
  if (asNumber(operation.cnpjs) < 1) errors.push('operation.cnpjs');

  const operational = Array.isArray(scope.operational) ? scope.operational.filter(text) : [];
  const managerial = Array.isArray(scope.managerial) ? scope.managerial.filter(text) : [];
  if (!operational.length && !managerial.length) errors.push('approved_scope');

  const fenixMonthly = asNumber(terms.fenix_monthly ?? terms.final_monthly);
  const passThrough = asNumber(terms.recurring_pass_through ?? terms.software_total);
  const implementation = asNumber(terms.implementation);
  const totalMonthly = asNumber(terms.total_monthly);

  if (fenixMonthly <= 0) errors.push('commercial_terms.fenix_monthly');
  if (passThrough < 0) errors.push('commercial_terms.recurring_pass_through');
  if (implementation < 0) errors.push('commercial_terms.implementation');
  if (passThrough > 0 && !text(terms.software_name)) errors.push('commercial_terms.software_name');

  const calculated = fenixMonthly + passThrough;
  if (Math.abs(totalMonthly - calculated) > 0.009) errors.push('commercial_terms.total_monthly');

  if (snapshot.cfo_approved !== true) errors.push('cfo_approved');

  return {
    ok: errors.length === 0,
    errors,
    calculated_total_monthly: calculated,
    show_pass_through: passThrough > 0,
    expected_pages: EXPECTED_PAGES,
    master_id: MASTER_ID,
  };
}

function buildApprovedSnapshot({ proposal, intake = {}, client = {} } = {}) {
  const terms = proposal?.commercial_terms || {};
  const analysis = proposal?.cfo_analysis || {};
  const assumptions = proposal?.assumptions || {};

  const fenixMonthly = asNumber(terms.fenix_monthly ?? terms.final_monthly);
  const passThrough = asNumber(terms.recurring_pass_through ?? terms.software_total);

  return {
    schema_version: 1,
    master_id: MASTER_ID,
    proposal_id: proposal?.id || null,
    proposal_version: proposal?.version || 1,
    proposal_code: proposal?.proposal_code || null,
    proposal_date: proposal?.proposal_date || new Date().toISOString().slice(0, 10),
    cfo_approved: proposal?.status === 'aprovada_cfo' || proposal?.status === 'publicada',
    cfo_approved_at: proposal?.approved_at || null,
    client: {
      legal_name: text(client.razao_social || client.legal_name),
      trade_name: text(client.nome_fantasia || client.trade_name),
      cnpj: text(client.cnpj),
      segment: text(intake.ramo || client.segment),
    },
    operation: {
      current_scenario: text(analysis.current_scenario || analysis.cenario_atual),
      main_challenges: text(analysis.main_challenges || analysis.principais_desafios),
      objective: text(analysis.objective || analysis.objetivo),
      cnpjs: asNumber(terms.cnpjs || assumptions.cnpjs || 1),
      bank_accounts: asNumber(assumptions.bank_accounts || assumptions.bancos_contas),
      projected_volume: asNumber(assumptions.projected_volume || assumptions.volume_previsto),
      erp: text(terms.software_name || assumptions.erp),
    },
    approved_scope: {
      operational: Array.isArray(proposal?.approved_scope?.operational) ? proposal.approved_scope.operational : [],
      managerial: Array.isArray(proposal?.approved_scope?.managerial) ? proposal.approved_scope.managerial : [],
    },
    commercial_terms: {
      fenix_monthly: fenixMonthly,
      recurring_pass_through: passThrough,
      software_name: text(terms.software_name),
      implementation: asNumber(terms.implementation),
      total_monthly: fenixMonthly + passThrough,
      validity_days: asNumber(terms.validity_days || 10),
      payment_terms: text(terms.payment_terms || 'Vencimento mensal conforme contrato.'),
    },
  };
}

module.exports = {
  MASTER_ID,
  EXPECTED_PAGES,
  MASTER_PDF_SHA256,
  calculateTotalMonthly,
  validateApprovedSnapshot,
  buildApprovedSnapshot,
};
