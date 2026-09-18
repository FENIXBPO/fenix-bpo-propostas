'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { validateApprovedSnapshot, calculateTotalMonthly, MASTER_ID, EXPECTED_PAGES } = require('../lib/proposal-master');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/alfa-master-snapshot.json'), 'utf8'));

const result = validateApprovedSnapshot(fixture);
assert.strictEqual(result.ok, true, `Snapshot ALFA inválido: ${result.errors.join(', ')}`);
assert.strictEqual(result.calculated_total_monthly, 2500);
assert.strictEqual(result.show_pass_through, true);
assert.strictEqual(result.expected_pages, 8);
assert.strictEqual(result.master_id, MASTER_ID);
assert.strictEqual(EXPECTED_PAGES, 8);
assert.strictEqual(calculateTotalMonthly(fixture.commercial_terms), 2500);

const zeroPassThrough = JSON.parse(JSON.stringify(fixture));
zeroPassThrough.commercial_terms.recurring_pass_through = 0;
zeroPassThrough.commercial_terms.software_name = '';
zeroPassThrough.commercial_terms.total_monthly = 2300;
const zeroResult = validateApprovedSnapshot(zeroPassThrough);
assert.strictEqual(zeroResult.ok, true, `Caso sem repasse inválido: ${zeroResult.errors.join(', ')}`);
assert.strictEqual(zeroResult.show_pass_through, false);

const invalidTotal = JSON.parse(JSON.stringify(fixture));
invalidTotal.commercial_terms.total_monthly = 4000;
const invalidResult = validateApprovedSnapshot(invalidTotal);
assert.strictEqual(invalidResult.ok, false);
assert.ok(invalidResult.errors.includes('commercial_terms.total_monthly'));

const notApproved = JSON.parse(JSON.stringify(fixture));
notApproved.cfo_approved = false;
const approvalResult = validateApprovedSnapshot(notApproved);
assert.strictEqual(approvalResult.ok, false);
assert.ok(approvalResult.errors.includes('cfo_approved'));

console.log('proposal-master.test.js: OK');
