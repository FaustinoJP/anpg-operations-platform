# Fase 5A — Login real no frontend

Esta versão liga a tela de login do frontend ao backend NestJS.

## O que foi implementado

- `POST /auth/login` chamado directamente no formulário de login.
- Token JWT guardado no `localStorage`.
- Utilizador autenticado guardado no `localStorage`.
- Validação da sessão em cada página protegida através de `GET /auth/me`.
- Redireccionamento automático para `/login` quando não existe token ou quando o token é inválido/expirado.
- Topbar actualizada com nome e perfil real do utilizador autenticado.
- Botão `Sair` com limpeza da sessão.

## Variável de ambiente

Criar `.env.local` no frontend com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Credenciais de teste

```text
Admin ANPG
Email: admin@anpg.ao
Senha: anpg2025

Operador
Email: operador@sonangol.co.ao
Senha: operador2025
```

## Execução recomendada

1. Backend ligado:

```bash
cd anpg-operations-backend
npm run start:dev
```

2. Frontend ligado:

```bash
cd anpg-operations-frontend
npm run dev
```

3. Abrir:

```text
http://localhost:3000/login
```
