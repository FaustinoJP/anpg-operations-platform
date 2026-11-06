# Fase 3.1 — Ajustes visuais dos dashboards e filtros

## Objectivo

Esta actualização melhora a leitura dos dashboards e deixa os filtros visualmente interactivos para demonstração.

## Ajustes aplicados

- Filtros dos dashboards agora abrem um menu de opções por clique.
- O valor seleccionado passa a aparecer no próprio filtro.
- Filtros activos ficam realçados com destaque institucional em dourado.
- Foi adicionado contador visual de filtros aplicados e botão para limpar filtros.
- Os textos longos dos filtros ficam protegidos contra quebra/desalinhamento.
- Os gráficos circulares foram reajustados para manter valores e legendas dentro da área disponível.
- As legendas dos gráficos circulares agora usam truncagem controlada quando o texto é longo.
- Os gráficos de barras horizontais foram ajustados para evitar sobreposição de nomes de operadores e valores.
- Os cartões KPI receberam melhor controlo de quebra de texto para valores como `48,5 M USD`, `68,4 M USD` e `3 categorias`.

## Nota técnica

Nesta fase os filtros funcionam visualmente no frontend, actualizando a selecção e o estado aplicado. A filtragem real dos dados será ligada posteriormente ao backend/API ou ao motor de dados local.
