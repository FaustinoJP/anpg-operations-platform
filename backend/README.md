# ANPG Operations Backend

Backend MVP da **ANPG Operations Intelligence Platform**, preparado para alimentar os dashboards do frontend com dados reais, autenticação, submissões e auditoria.

## Stack

- NestJS + TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Swagger/OpenAPI
- Auditoria em base de dados

## Estrutura

```text
src/
├── auth/           # Login, sessão e /auth/me
├── dashboard/      # Endpoints dos dashboards
├── submissions/    # Submissões dos operadores e validação ANPG
├── audit/          # Registos de auditoria
├── users/          # Utilizadores e perfis
├── health/         # Health check
└── prisma/         # PrismaService

prisma/
├── schema.prisma   # Modelo de dados
└── seed.ts         # Dados de demonstração
```

## Instalação

```bash
npm install
cp .env.example .env
```

Criar a base PostgreSQL:

```sql
CREATE DATABASE anpg_operations;
```

Executar migração e seed:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
```

Iniciar em desenvolvimento:

```bash
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

Health check:

```text
GET http://localhost:3001/api/v1/health
```

## Credenciais de demonstração

```text
Admin ANPG
Email: admin@anpg.ao
Senha: anpg2025

Operador
Email: operador@sonangol.co.ao
Senha: operador2025
```

## Endpoints iniciais

```text
POST /api/v1/auth/login
GET  /api/v1/auth/me
GET  /api/v1/health
GET  /api/v1/dashboard/general
GET  /api/v1/dashboard/operational
GET  /api/v1/dashboard/market
GET  /api/v1/dashboard/stock
GET  /api/v1/submissions
POST /api/v1/submissions
GET  /api/v1/submissions/:id
PATCH /api/v1/submissions/:id/status
GET  /api/v1/audit
GET  /api/v1/audit/summary
GET  /api/v1/users
POST /api/v1/users
```

## Próximo passo técnico

Depois desta fundação, o próximo incremento é ligar o frontend actual aos endpoints do backend usando `NEXT_PUBLIC_API_BASE_URL` e implementar estados reais de carregamento, erro e dados vazios.
