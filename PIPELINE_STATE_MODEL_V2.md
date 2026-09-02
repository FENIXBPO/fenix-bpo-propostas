# FÊNIX — Pipeline State Model V2

Status: **MODELO CANÔNICO PARA HOMOLOGAÇÃO**

## Etapas oficiais

`Lead → Dados recebidos → Análise → Proposta → Enviada → Aceita → CFO → Contrato → Assinatura → Implantação`

## Princípio

O Pipeline representa eventos e estados reais. Não criar avanço visual sem evento correspondente.

### Estados atuais compatíveis

- `recebido` → Dados recebidos
- `em_analise_cfo` / `rascunho_cfo` → Análise
- `proposta_aprovada_cfo` / `aprovada_cfo` → Proposta
- `proposta_publicada` / `publicada` → Enviada
- `proposta_aceita_aguardando_cfo` → CFO
- `contrato_autorizado` → Contrato

### Etapas futuras ainda não persistidas integralmente

- Lead
- Aceita como estado corrente separado
- Assinatura
- Implantação

A etapa **Aceita** deve ser preservada como milestone do aceite, mesmo quando o estado corrente já avançou para a fila CFO. O histórico/eventos deve mostrar o aceite; o Kanban deve mostrar o estado corrente real.

## Regras de transição

1. Cliente enviar formulário → Dados recebidos.
2. Abertura efetiva da análise → Análise.
3. CFO aprovar preço/escopo → Proposta.
4. Publicação/envio ao cliente → Enviada.
5. Cliente aceitar → registrar milestone Aceita + entrar na fila CFO.
6. CFO validar aceite e autorizar contrato → Contrato.
7. Contrato gerado e enviado à assinatura → Assinatura.
8. Assinatura concluída → Implantação.

## Regra de movimentação manual

O usuário interno não deve arrastar oportunidades para frente entre etapas críticas.

Ações manuais permitidas:
- Encerrar;
- Reabrir;
- ações de negócio explícitas que disparam eventos reais (aprovar CFO, publicar proposta, validar aceite, gerar contrato etc.).

## Estado Encerrado

`Encerrado` é um estado lateral e não faz parte das 10 etapas de conversão.

Ao reabrir, restaurar o último estado válido registrado.

## Métricas

- Leads: oportunidades ainda sem levantamento completo.
- Dados recebidos: coleta enviada.
- MRR em Pipeline: oportunidades a partir de Análise, sem duplicidade por CNPJ/negociação.
- MRR proposto: propostas aprovadas/publicadas.
- MRR aceito: propostas com aceite do cliente.
- MRR contratado: contrato autorizado/assinado, conforme definição de gestão.
- Conversão por etapa: baseada em eventos históricos, não apenas snapshot atual.

## Implementação

Arquivo canônico: `pipeline-state.js`.

O dashboard atual ainda usa 6 colunas. A migração visual para 10 etapas só deve ocorrer após:
- consumidores atualizados;
- eventos de assinatura/implantação definidos;
- homologação do fluxo;
- teste de deduplicação e métricas;
- preview validado.
