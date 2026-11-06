# Fase 5A — Fundação do Backend

## Objectivo

Criar a base real da plataforma para substituir gradualmente os dados simulados do frontend por dados provenientes de uma API e base de dados PostgreSQL.

## Incluído

1. Backend NestJS com prefixo `/api/v1`.
2. Prisma com modelo de dados inicial.
3. Autenticação JWT.
4. Seed com utilizador ANPG e operador.
5. Endpoints dos dashboards.
6. Endpoints de submissões.
7. Auditoria técnica.
8. Swagger para documentação da API.

## Perfis iniciais

- `ADMIN_ANPG`
- `GESTOR_ANPG`
- `ENGENHEIRO_ANALISTA`
- `OPERADOR`
- `AUDITOR`

## Fluxo inicial da submissão

```text
DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ├── APPROVED
  ├── CORRECTION_REQUESTED
  └── REJECTED
```

## Dados principais

- Utilizadores e perfis.
- Operadores.
- Blocos.
- Poços.
- Sondas.
- Operações.
- Contratos.
- Stock OCTG.
- Submissões.
- Resultados de validação.
- Relatórios.
- Auditoria.

## Integração futura com o frontend

O frontend deve usar:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

E substituir gradualmente os dados simulados por chamadas aos endpoints.
