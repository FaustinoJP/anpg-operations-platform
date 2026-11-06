# ANPG Operations Intelligence Platform — Versão Fase 5B

Pacote completo com **frontend + backend** para demonstração da plataforma ANPG.

## Incluído

- Frontend Next.js com identidade visual actual ANPG;
- Login real com JWT;
- Carrossel FPSO no login;
- Dashboard Geral com hero institucional;
- Dashboard Operacional ligado ao backend;
- Análise de Mercado ligada ao backend;
- Gestão de Stock OCTG ligada ao backend;
- Backend NestJS + Prisma + PostgreSQL;
- Swagger;
- Seed reforçado com dados demonstrativos;
- Filtros visuais enviando parâmetros para a API;
- Estados de loading/erro nos dashboards.

## Estrutura

```text
frontend/   # Next.js
backend/    # NestJS + Prisma
docker-compose.yml
start-backend.ps1
start-frontend.ps1
```

## Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run start:dev
```

API:

```text
http://localhost:3001/api/v1
```

Swagger:

```text
http://localhost:3001/api/v1/docs
```

## Frontend

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Credenciais

```text
Admin: admin@anpg.ao / anpg2025
Operador: operador@sonangol.co.ao / operador2025
```

## Endpoints de Dashboard

```text
GET /api/v1/dashboard/general
GET /api/v1/dashboard/operational
GET /api/v1/dashboard/market
GET /api/v1/dashboard/stock
```

Todos requerem token Bearer.

## Nota sobre base de dados existente

Se já tinhas executado versões anteriores, corre novamente:

```powershell
npm run seed
```

O seed actual recria os dados demonstrativos operacionais para que os dashboards tenham informação suficiente para teste.

## Hotfix 2026-10-05

Corrigido erro em frontend/components/charts.tsx: ReferenceError safeLabels is not defined ao abrir /operacional.
Também foram adicionadas proteções para gráficos vazios.
