# Hotfix All Charts

Correção aplicada em `frontend/components/charts.tsx` para evitar o erro:

`ReferenceError: safeLabels is not defined`

Inclui proteção nos componentes de gráficos para listas vazias ou indefinidas.

Depois de substituir esta versão, pare o frontend, elimine a cache `.next` se existir e execute novamente `npm run dev`.
