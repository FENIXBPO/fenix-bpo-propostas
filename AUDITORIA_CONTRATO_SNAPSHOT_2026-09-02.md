# Auditoria — proposta aceita → contrato

Data: 2026-09-02
Status: HOMOLOGAÇÃO / NÃO PRODUÇÃO

## Regra
O contrato deve nascer exclusivamente da proposta efetivamente aceita pelo cliente e validada pelo CFO.

Não é suficiente selecionar apenas a versão mais recente do intake, pois uma versão posterior em rascunho não pode substituir ou ocultar a proposta aceita.

## Fonte contratual
O snapshot contratual deve congelar:
- identificador, versão e código da proposta aceita;
- data de aceite;
- condições comerciais aprovadas;
- escopo aprovado;
- assumptions/contexto aprovado aplicável;
- dados cadastrais/legais conferidos para contratação.

## Gates
1. proposta publicada;
2. aceite ativo do cliente;
3. status `proposta_aceita_aguardando_cfo`;
4. validação CFO;
5. dados legais obrigatórios completos;
6. criação do `contract_data` imutável;
7. geração do documento somente após autorização explícita.

## Regra de segurança
A seleção para autorização do contrato deve procurar a proposta em estado de aceite aguardando CFO, e não apenas `order=version.desc&limit=1` sem filtro de status.

## Revisão do responsável FÊNIX
Ainda pendente para fase posterior:
- texto jurídico final do modelo v22;
- vigência padrão;
- regras específicas de SLA/retrabalho;
- condições padrão de pagamento;
- validação de Anexo I e Anexo II.

Nenhum desses pontos deve ser considerado aprovado por esta auditoria técnica.
