const assert = require('assert');
const { diagnose, VERSION, POLICY } = require('../pricing-engine');

assert.equal(VERSION, '1.1.0');
assert.equal(POLICY.version, '1.1.0');

const base = {
  faturamento: '80000',
  recebimentos: '20',
  pagamentos: '25',
  notas: '10',
  notas_recebidas: '10',
  lancamentos: '5',
  bancos: 'Itaú',
  cartoes: '1',
  contas_aplicacao: '0',
  cnpjs: '1',
  filiais: '0',
  centros_custo: '1',
  funcionarios: '2',
  implantacao_situacao: 'Organizado',
  dor_atrasados: 'Não'
};

let d = diagnose(base, { costHour: 50, targetMargin: 0.5, commercialDiscountLimit: 0.1 });
assert.equal(d.policyVersion, '1.1.0');
assert.equal(d.movements, 70);
assert.equal(d.tier.base, 900);
assert.equal(d.structuralPrice, 900);
assert.equal(d.implantation, 1500);
assert.equal(d.complexity, 'Baixa');
assert.equal(d.manualReview, false);
assert(d.commercialFloor >= d.marginFloor);

d = diagnose({
  ...base,
  recebimentos: '70', pagamentos: '80', notas: '40', notas_recebidas: '30', lancamentos: '20',
  bancos: 'Itaú,Sicoob,Inter', cartoes: '4', funcionarios: '6-10', faturamento: '400000'
}, { costHour: 60, targetMargin: 0.5, commercialDiscountLimit: 0.1 });
assert.equal(d.movements, 240);
assert.equal(d.extras.bancos, 150);
assert.equal(d.extras.cartoes, 75);
assert.equal(d.extras.equipe, 200);
assert.equal(d.extras.faturamento, 250);
assert(d.suggested >= d.structuralPrice);

d = diagnose({
  ...base,
  recebimentos: '300', pagamentos: '300', notas: '100', notas_recebidas: '100', lancamentos: '100',
  bancos: 'A,B,C,D', cartoes: '5+', cnpjs: '3', filiais: '2', centros_custo: '5+', funcionarios: '11-20',
  implantacao_situacao: 'Desorganizado / saneamento necessário', dor_atrasados: 'Sim', faturamento: '1500000'
}, { costHour: 80, targetMargin: 0.5, commercialDiscountLimit: 0.1 });
assert.equal(d.movements, 900);
assert.equal(d.manualReview, true);
assert.equal(d.complexity, 'Alta');
assert(d.implantation > 3500);
assert(d.risks.some(x => /revisão/i.test(x)));

d = diagnose(base, { costHour: 200, targetMargin: 0.6, commercialDiscountLimit: 0.1 });
assert(d.marginFloor > 0);
assert(d.suggested >= d.marginFloor);
assert(d.commercialFloor >= d.marginFloor);

console.log('PASS política CFO v1.1 + 4 cenários de regressão');
