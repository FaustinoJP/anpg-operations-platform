# Fase 5B — Frontend ligado aos dashboards reais

Esta versão liga os dashboards principais ao backend real:

- Dashboard Geral → `/dashboard/general`
- Dashboard Operacional → `/dashboard/operational`
- Análise de Mercado → `/dashboard/market`
- Gestão de Stock OCTG → `/dashboard/stock`

## Novos recursos

- `frontend/lib/dashboardApi.ts`
- loading state nos dashboards;
- error state com botão de retry;
- filtros visuais enviando parâmetros para a API;
- KPIs, gráficos e tabelas alimentados pela resposta do backend;
- fallback para gráficos sem dados.

## Execução

1. Manter o backend ligado em `http://localhost:3001/api/v1`.
2. Configurar `frontend/.env.local` com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

3. Entrar com:

```text
admin@anpg.ao / anpg2025
```
