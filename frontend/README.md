# ANPG Operations Intelligence Platform

Protótipo frontend completo para apresentação da solução de dashboards solicitada no ITT da ANPG: operações de sondagem, intervenção e abandono de poços, análise de mercado, gestão de stock OCTG, portal dos operadores, submissões, relatórios, auditoria, utilizadores e configurações.

## O que já está incluído

- Tela de login institucional;
- Layout principal com menu lateral e cabeçalho;
- Dashboard Geral;
- Dashboard Operacional;
- Análise de Mercado;
- Gestão de Stock OCTG;
- Portal dos Operadores;
- Submissões;
- Relatórios e exportações simuladas;
- Auditoria;
- Utilizadores;
- Configurações;
- Dados simulados profissionais;
- Logos ANPG em `public/logos`;
- Pré-visualizações dos dashboards em `public/previews`;
- Estrutura preparada para futura API.


## Actualização Fase 3.1

- Filtros visuais interactivos nos dashboards.
- Melhor ajuste de textos, legendas e valores nos gráficos circulares.
- Melhor alinhamento dos KPI cards e gráficos horizontais.
- Documentação em `docs/fase-3-ajustes-dashboards-filtros.md`.

## Como executar localmente

```bash
npm install
npm run dev
```

Depois abrir:

```text
http://localhost:3000
```

O login demonstrativo redirecciona automaticamente para o dashboard geral.

## Credenciais demonstrativas

```text
Email: admin@anpg.ao
Palavra-passe: anpg2025
```

## Estrutura principal

```text
app/
  login/
  dashboard/
  operacional/
  mercado/
  stock/
  portal/
  submissoes/
  relatorios/
  auditoria/
  utilizadores/
  configuracoes/
components/
  AppShell.tsx
  charts.tsx
  icons.tsx
  ui.tsx
data/
  mockData.ts
public/
  logos/
  previews/
sample-data/
docs/
```

## Próxima fase recomendada

1. Criar backend com autenticação real;
2. Criar base de dados PostgreSQL;
3. Implementar upload real de Excel/PDF/DDR;
4. Implementar validação de dados;
5. Criar exportação real para Word, Excel e PowerPoint;
6. Implementar auditoria persistente;
7. Preparar integração com SAP, WellView, Power BI e API dos operadores.


## Atualização adicionada nesta versão

- Portal dos Operadores com simulação de upload e validação automática.
- Página Relatórios com exportações demonstráveis para Word, Excel, PowerPoint e CSV.
- Botões e estados visuais preparados para integração futura com API/backend.
- Documentação técnica complementar em `docs/fase-2-exportacoes-e-upload.md`.

## Fase 3 adicionada

A Fase 3 reforça o protótipo com:

- Dashboard Geral executivo com alertas, prioridades e fluxo operacional;
- Página de Submissões com fila de validação, detalhe, aprovação, rejeição e solicitação de correcção simuladas;
- Página de Auditoria com registos recentes, timeline, eventos por módulo e estado de conformidade.

Documentação técnica: `docs/fase-3-dashboard-submissoes-auditoria.md`.

## Fase 5A — Login real com backend

Esta versão já liga o login do frontend ao backend NestJS.

Antes de executar o frontend, cria um ficheiro `.env.local` na raiz do projecto com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

Com o backend ligado em `http://localhost:3001/api/v1`, entra em:

```text
http://localhost:3000/login
```

Credenciais do seed:

```text
Admin: admin@anpg.ao / anpg2025
Operador: operador@sonangol.co.ao / operador2025
```

O frontend agora:

- chama `POST /auth/login`;
- guarda o JWT no navegador;
- confirma a sessão em `GET /auth/me`;
- protege as páginas com `AppShell`;
- mostra nome e perfil reais na topbar;
- permite terminar sessão com o botão `Sair`.

## Identidade visual actual ANPG

Esta versão utiliza a nova linha visual ANPG: logo vermelho contemporâneo, interface clara, acentos vermelhos e tons charcoal/cinza. O guia resumido está em `docs/adaptacao-identidade-anpg-actual.md`.
