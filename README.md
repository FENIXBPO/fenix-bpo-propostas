# fenix-bpo-propostas

Gerador interno de diagnóstico, proposta comercial e minuta contratual da Fenix BPO Financeiro.

## Fluxo v1.4

1. Preenchimento do cadastro e levantamento comercial do cliente.
2. Levantamento do volume financeiro, estrutura bancária, RH, complexidade e escopo desejado.
3. Geração de diagnóstico interno com estimativas operacionais.
4. Análise CFO.
5. Análise Comercial.
6. Liberação da geração da proposta somente quando os dois pareceres estiverem como `Aprovado`.
7. Geração da proposta via Anthropic.
8. Envio por e-mail, impressão/PDF manual e geração opcional de minuta de contrato.

## Dados coletados

O formulário coleta identificação da empresa e do responsável, contato, endereço, ramo, regime tributário, contabilidade, sistema atual, dor principal, expectativa, faturamento, recebimentos, pagamentos, notas emitidas/recebidas, outros lançamentos, bancos, aplicações, cartões, centros de custo, múltiplos CNPJs, filiais, aprovações, sócios, CLTs, terceiros, situação de implantação, retrabalho inicial, escopo desejado e observações.

## Diagnóstico CFO e Comercial

O diagnóstico calcula:

- volume mensal estimado;
- complexidade operacional;
- horas mensais estimadas;
- riscos operacionais;
- faixa-base comercial;
- adicionais já previstos nas regras existentes;
- mensalidade sugerida;
- piso comercial interno;
- implantação sugerida.

O CFO pode revisar mensalidade, piso, implantação e informar o custo-hora interno. A margem estimada só é calculada quando o custo-hora é informado.

O Comercial pode definir o desconto máximo autorizado e registrar seu parecer e estratégia de negociação.

A proposta permanece bloqueada até CFO e Comercial marcarem `Aprovado`.

## Regras comerciais atualmente usadas no diagnóstico

Estas regras preservam as faixas que já existiam na versão anterior do projeto:

- faturamento até R$ 100 mil: faixa mensal de R$ 700 a R$ 900;
- faturamento de R$ 100 mil a R$ 300 mil: faixa mensal de R$ 1.000 a R$ 1.500;
- faturamento acima de R$ 300 mil: faixa mensal de R$ 1.500 a R$ 2.500;
- mais de 2 bancos: adicional de R$ 150 por banco excedente;
- mais de 5 CLTs: adicional de R$ 200;
- implantação sugerida entre R$ 1.500 e R$ 3.500 conforme complexidade.

Essas regras são referência inicial para revisão interna e não substituem o parecer CFO/Comercial.

## Arquivos principais

- `index.html`: formulário, diagnóstico, aprovação interna, proposta e minuta contratual.
- `api/propose.js`: integração com Anthropic.
- `api/send-email.js`: envio SMTP via Nodemailer.

## Variáveis de ambiente

- `ANTHROPIC_API_KEY`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

## Execução

O projeto foi estruturado para ambiente compatível com rotas serverless em `/api`, como Vercel.

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente e publique/execute em um ambiente que exponha `api/propose.js` e `api/send-email.js` como endpoints HTTP.

## Pendências conhecidas

A v1.4 ainda não implementa:

- banco de dados/persistência dos diagnósticos e propostas;
- autenticação e perfis de acesso CFO/Comercial;
- trilha de auditoria e histórico;
- geração automática de PDF para anexo no e-mail;
- integração com CRM, n8n, Make ou Zapier;
- aprovação real pelo cliente e assinatura eletrônica;
- testes automatizados.

Esses itens devem ser tratados na próxima fase, após validação do fluxo interno.
