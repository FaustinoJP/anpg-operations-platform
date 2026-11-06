'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { AuthHeroCarousel } from '@/components/AuthHeroCarousel';
import { BrandLogo } from '@/components/BrandLogo';
import { getAccessToken, LoginResponse, saveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@anpg.ao');
  const [password, setPassword] = useState('anpg2025');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/dashboard');
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      saveSession(payload);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar sessão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page branded-login-page">
      <section className="login-card-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-form-logo">
            <BrandLogo variant="red" layout="horizontal" />
          </div>
          <span className="login-form-kicker">Ambiente integrado ANPG</span>
          <h2>Acesso à plataforma</h2>
          <p>Use as credenciais criadas no backend para entrar no ambiente integrado.</p>
          <div className="form-group">
            <label htmlFor="email">Email institucional</label>
            <input
              id="email"
              className="form-control"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Palavra-passe</label>
            <input
              id="password"
              className="form-control"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error ? <div className="auth-alert error">{error}</div> : null}

          <button
            className="btn danger"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
          >
            {loading ? 'A validar credenciais...' : 'Entrar'}
          </button>

          <div className="demo-box">
            <strong>Credenciais do seed:</strong><br />
            Admin: admin@anpg.ao / anpg2025<br />
            Operador: operador@sonangol.co.ao / operador2025<br />
            <span>O login agora chama directamente <code>/auth/login</code> no backend.</span>
          </div>
        </form>
      </section>

      <AuthHeroCarousel />
    </main>
  );
}
