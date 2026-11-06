# Fase 2 — Exportações e Submissões Demonstráveis

Esta versão adiciona funcionalidades demonstráveis ao protótipo frontend:

## Portal dos Operadores

- Upload visual de ficheiro técnico.
- Simulação de validação automática.
- Checklist de consistência.
- Estado visual da submissão.
- Fluxo preparado para futura API real.

## Relatórios

Botões funcionais para gerar ficheiros de demonstração:

- Word `.doc` — relatório técnico operacional.
- Excel `.xls` — indicadores estruturados e itens críticos.
- PowerPoint `.ppt` — apresentação executiva em formato compatível com Office.
- CSV `.csv` — base técnica de indicadores.

## Próxima evolução técnica

Na versão com backend, estes botões devem chamar endpoints como:

```text
POST /api/v1/reports/word
POST /api/v1/reports/excel
POST /api/v1/reports/powerpoint
POST /api/v1/submissions
POST /api/v1/uploads/validate
```
