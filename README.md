# fenix-bpo-propostas

Fluxo interno da Fenix BPO para levantamento de dados, diagnóstico CFO/Comercial e geração de propostas.

## Fluxo atual

1. Cadastro do cliente e contexto
2. Volumetria financeira e estrutura bancária
3. Definição do escopo
4. Diagnóstico automático pela Matriz CFO v1.0
5. Análise de custo, margem, piso e implantação
6. Aprovação CFO
7. Aprovação Comercial
8. Geração da proposta pela IA usando somente escopo e valores aprovados
9. Impressão/PDF manual
10. Minuta de contrato para revisão interna

## Precificação

A referência oficial está documentada em `PRECIFICACAO_CFO.md` e implementada em `pricing-engine.js`.

A Matriz CFO v1.0 está integrada ao fluxo principal da branch por `app-v15.html`. O `index.html` direciona para essa versão.

A matriz prioriza volumetria e complexidade, calcula adicionais operacionais, implantação, horas estimadas, custo mensal, piso comercial e piso por margem quando o custo-hora real é informado.

### Guardrails internos

- custo-hora é obrigatório para validar margem;
- margem-alvo inicial: 50%, editável pelo CFO;
- desconto comercial máximo inicial: 10%, editável;
- preço abaixo do piso/margem exige exceção CFO explícita e justificativa;
- CFO e Comercial precisam estar como `Aprovado` antes da geração da proposta;
- piso, custo-hora, margem e limite de desconto nunca devem aparecer na proposta do cliente.

## Arquivos principais

- `index.html` — entrada da branch e redirecionamento para o fluxo atual
- `app-v15.html` — coleta, diagnóstico CFO/Comercial e geração de proposta
- `pricing-engine.js` — Matriz CFO v1.0
- `pricing-validation.html` — simulador isolado da matriz
- `PRECIFICACAO_CFO.md` — regras de negócio da precificação
- `api/propose.js` — geração via Anthropic
- `api/send-email.js` — envio SMTP (ainda não integrado ao novo fluxo v1.5)

## Integrações atuais

- BrasilAPI: existe na versão anterior; precisa ser reintroduzida na tela v1.5
- Anthropic: geração de proposta e minuta
- SMTP/Nodemailer: backend existente; envio com PDF real ainda pendente

## Variáveis necessárias

- `ANTHROPIC_API_KEY`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASS`

## Pendências estruturais

- reintroduzir busca automática de CNPJ na tela v1.5;
- persistência em banco;
- autenticação e perfis CFO/Comercial;
- histórico e auditoria de aprovações/exceções;
- geração automática de PDF e anexo real no e-mail;
- CRM/automação pós-envio;
- aprovação do cliente e assinatura eletrônica;
- substituir geração livre de contrato por transposição controlada ao modelo contratual padrão.
