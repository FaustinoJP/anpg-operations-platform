# Fase Branding — Logos ANPG + Carrossel FPSO

## Objectivo

Actualizar a solução para ficar mais próxima da identidade visual actual da ANPG, usando vermelho institucional, slate/charcoal, novos logos e imagens FPSO como fundo/carrossel.

## Componentes adicionados

### `BrandLogo.tsx`
Centraliza o uso dos logos:

- `variant="red"` para fundos claros;
- `variant="white"` para fundos escuros;
- `layout="horizontal"`, `layout="stacked"` ou `layout="wide"`.

### `AuthHeroCarousel.tsx`
Carrossel usado no login:

- 3 imagens offshore/FPSO;
- rotação automática a cada 5 segundos;
- navegação por pontos;
- overlay escuro para legibilidade;
- texto institucional por slide.

### `DashboardHero.tsx`
Banner do Dashboard Geral:

- imagens FPSO em rotação;
- logo ANPG branco;
- botões de acção;
- cartão de índice de prontidão.

## Assets adicionados

```text
frontend/public/logos/anpg-logo-horizontal.png
frontend/public/logos/anpg-logo-horizontal-white.png
frontend/public/logos/anpg-logo-stacked.png
frontend/public/logos/anpg-logo-stacked-white.png
frontend/public/logos/anpg-logo-wide-white.png
frontend/public/images/fpso-hero-1.png
frontend/public/images/fpso-hero-2.png
frontend/public/images/fpso-hero-3.png
```

## Páginas alteradas

- `app/login/page.tsx`
- `app/dashboard/page.tsx`
- `components/AppShell.tsx`
- `app/globals.css`

