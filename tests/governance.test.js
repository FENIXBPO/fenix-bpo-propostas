const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const manual = read('MANUAL_GOLDEN_REFERENCE_FENIX.md');
assert.match(manual, /NORMA OFICIAL E VINCULANTE/i);
assert.match(manual, /Master Limpo — Golden Reference Oficial/);
assert.match(manual, /PDF homologado vence/i);
assert.match(manual, /pode "reinterpretar/i);
assert.match(manual, /Pipeline e proposta são produtos diferentes/i);
assert.match(manual, /página a página/i);
assert.match(manual, /branch própria/i);

const goldenPath = path.join(root, 'homologacao/FENIX_MASTER_LIMPO_GOLDEN_REFERENCE_APROVADO.pdf');
assert.ok(fs.existsSync(goldenPath), 'O PDF Golden Reference oficial deve estar versionado no repositório.');
const goldenHash = crypto.createHash('sha256').update(fs.readFileSync(goldenPath)).digest('hex');
assert.equal(goldenHash, '14b626a36031c0b04d0aabaaabaa52b5efd90672811f1dcff6060459042c1cf4', 'O PDF Golden Reference foi alterado sem nova homologação.');

const master = read('master-template/proposta-master-limpa-v1.html');
const pages = [...master.matchAll(/<section class="page" data-page="(\d+)"/g)].map(match => Number(match[1]));
assert.deepEqual(pages, [1, 2, 3, 4, 5, 6, 7, 8], 'O Master deve manter exatamente as oito páginas, na ordem oficial.');

const publicWrapper = read('p/proposta-master-v1.html');
const publicRuntime = read('assets/proposta-master-public-v1.js');
assert.match(publicRuntime, /\/master-template\/proposta-master-limpa-v1\.html/);
assert.match(publicRuntime, /\/api\/public-proposal\?ref=/);
assert.match(publicWrapper, /Aceite do cliente → validação CFO → contrato → assinatura → implantação/);

const acceptance = read('api/proposal-acceptance.js');
assert.match(acceptance, /status:'proposta_aceita_aguardando_cfo'/);
assert.match(acceptance, /intake\.client_id/);
assert.doesNotMatch(acceptance, /contrato_autorizado/);

const contractApi = read('api/internal-contract.js');
assert.match(contractApi, /proposal\.status!=='proposta_aceita_aguardando_cfo'/);
assert.match(contractApi, /template_version:TEMPLATE/);

const contract = read('CONTRATO_FENIX_BPO_MODELO_PADRAO_v22.md');
assert.equal((contract.match(/^# ANEXO [IVX]+/gm) || []).length, 2, 'O contrato padrão deve manter somente os Anexos I e II.');
assert.match(contract, /apoio técnico, administrativo e operacional/i);
assert.match(contract, /sem poderes de gestão/i);

console.log('PASS governança documental e estrutural');
