# Fase 5B — Dashboard API Real

Esta versão adiciona endpoints de dashboard alimentados por dados reais em PostgreSQL via Prisma.

## Endpoints protegidos por JWT

- `GET /api/v1/dashboard/general`
- `GET /api/v1/dashboard/operational`
- `GET /api/v1/dashboard/market`
- `GET /api/v1/dashboard/stock`

## Filtros suportados

### Operacional

- `operator`
- `operatorId`
- `block`
- `blockId`
- `well`
- `wellId`
- `rig`
- `rigId`
- `operationType`
- `status`
- `periodStart`
- `periodEnd`

### Mercado

- `operator`
- `operatorId`
- `block`
- `blockId`
- `basin`
- `contractType`
- `status`

### Stock

- `operator`
- `operatorId`
- `category`
- `specification`
- `location`
- `status`

## Seed reforçado

O `prisma/seed.ts` foi actualizado para criar um conjunto demonstrativo maior:

- 8 operadores;
- 8 blocos;
- 9 poços;
- 8 sondas;
- 12 operações;
- 8 contratos;
- 8 itens OCTG;
- movimentos de stock;
- submissões com validações;
- logs de auditoria.

O seed é idempotente para dados demonstrativos: apaga e recria as tabelas operacionais de demonstração, mantendo utilizadores, roles e operadores.
