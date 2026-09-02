# Governança de Deploy — FÊNIX BPO

## Objetivo
Evitar excesso de deployments, preservar a cota da Vercel e garantir que nenhuma alteração visual/funcional chegue à produção sem homologação e aprovação explícita.

## Regra oficial

Fluxo:

`branch de trabalho → consolidação → homologacao → aprovação visual/funcional → main`

### Branches de trabalho
Exemplos: `feat/*`, `fix/*`, `chore/*`, `audit/*`.

- Não devem gerar deployment automático na Vercel.
- Podem receber múltiplos commits técnicos sem consumir previews.
- Testes e revisão de código devem ocorrer antes da promoção para homologação.

### Branch `homologacao`

- É a única branch de preview automático autorizada além de `main`.
- Recebe somente pacotes consolidados já revisados tecnicamente.
- Cada rodada de homologação deve buscar 1 deployment consolidado.
- O responsável da FÊNIX valida visualmente antes de qualquer promoção.

### Branch `main`

- Produção.
- Só recebe conteúdo já aprovado em homologação.
- Nenhum merge automático por conveniência.

## Configuração Vercel

O `vercel.json` restringe deployment automático:

- `main`: habilitado;
- `homologacao`: habilitado;
- demais branches: desabilitadas;
- GitHub auto-alias: desabilitado.

## Regra operacional

1. Trabalhar em branch técnica sem preview.
2. Agrupar ajustes relacionados.
3. Rodar testes e checklist técnico.
4. Promover o pacote para `homologacao`.
5. Gerar um único preview.
6. Validar desktop, mobile, dados, fluxo e identidade visual.
7. Obter aprovação explícita do responsável FÊNIX.
8. Somente então promover para `main`.

## Proibições

- Não criar commit apenas para forçar novo preview.
- Não usar produção como ambiente de teste.
- Não alterar Golden Reference, Intake padrão ou Pipeline aprovado diretamente em `main`.
- Não liberar proposta/contrato/fluxo crítico sem homologação correspondente.

## Exceção

Correção emergencial de produção deve ser documentada e ainda assim passar por branch/PR. Se a urgência impedir homologação visual completa, registrar explicitamente o risco e executar somente a correção mínima necessária.
