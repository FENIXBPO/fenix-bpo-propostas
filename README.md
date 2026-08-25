# fenix-bpo-propostas

Fluxo interno da Fenix BPO para levantamento de dados, diagnóstico CFO/Comercial e geração de propostas.

## Fluxo atual

1. Cadastro do cliente e contexto
2. Volumetria financeira e estrutura bancária
3. Escopo e implantação
4. Diagnóstico interno
5. Aprovação CFO
6. Aprovação Comercial
7. Geração da proposta pela IA usando somente escopo e valores aprovados
8. Envio / impressão
9. Minuta de contrato para revisão interna

## Precificação

A referência oficial da branch está documentada em `PRECIFICACAO_CFO.md` e implementada de forma isolada em `pricing-engine.js`.

A matriz CFO v1.0 prioriza volumetria e complexidade, calcula adicionais operacionais, implantação, horas estimadas e piso por margem quando o custo-hora real é informado.

Importante: nesta etapa a engine foi adicionada separadamente para validação. O formulário principal ainda usa o cálculo v1.4 anterior até a integração final da matriz ao diagnóstico da interface.

## Integrações atuais

- BrasilAPI: consulta de CNPJ
- Anthropic: geração de proposta e minuta
- SMTP/Nodemailer: envio de e-mail

## Variáveis necessárias

- `ANTHROPIC_API_KEY`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

## Pendências estruturais

- integrar `pricing-engine.js` ao diagnóstico da interface;
- persistência em banco;
- autenticação e perfis CFO/Comercial;
- histórico e auditoria;
- geração automática de PDF e anexo real no e-mail;
- CRM/automação pós-envio;
- aprovação do cliente e assinatura eletrônica;
- substituir geração livre de contrato por transposição controlada ao modelo contratual padrão.
