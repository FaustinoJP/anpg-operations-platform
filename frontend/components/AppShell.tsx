'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Icon, IconName } from '@/components/icons';
import { BrandLogo } from '@/components/BrandLogo';
import { apiRequest } from '@/lib/api';
import { AuthUser, clearSession, getAccessToken, getInitials, getStoredUser, updateStoredUser } from '@/lib/auth';

const navItems: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/dashboard', label: 'Dashboard Geral', icon: 'dashboard' },
  { href: '/operacional', label: 'Dashboard Operacional', icon: 'bars' },
  { href: '/mercado', label: 'Análise de Mercado', icon: 'pie' },
  { href: '/stock', label: 'Gestão de Stock OCTG', icon: 'database' },
  { href: '/portal', label: 'Portal dos Operadores', icon: 'users' },
  { href: '/submissoes', label: 'Submissões', icon: 'upload' },
  { href: '/relatorios', label: 'Relatórios', icon: 'file' },
  { href: '/auditoria', label: 'Auditoria', icon: 'shield' },
  { href: '/utilizadores', label: 'Utilizadores', icon: 'users' },
  { href: '/configuracoes', label: 'Configurações', icon: 'settings' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let mounted = true;
    const token = getAccessToken();

    if (!token) {
      clearSession();
      router.replace('/login');
      return;
    }

    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    apiRequest<AuthUser>('/auth/me', { auth: true })
      .then((currentUser) => {
        if (!mounted) return;
        updateStoredUser(currentUser);
        setUser(currentUser);
      })
      .catch(() => {
        clearSession();
        router.replace('/login');
      })
      .finally(() => {
        if (mounted) setCheckingSession(false);
      });

    return () => {
      mounted = false;
    };
  }, [router]);

  const profileLabel = useMemo(() => {
    if (!user) return 'A validar sessão';
    if (user.operator?.name) return user.operator.name;
    return user.role || 'Utilizador';
  }, [user]);

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  if (checkingSession && !user) {
    return (
      <div className="session-loading">
        <BrandLogo variant="red" layout="horizontal" />
        <strong>A validar sessão...</strong>
        <span>Aguarde enquanto confirmamos o acesso à plataforma.</span>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/dashboard" className="sidebar-logo" aria-label="Ir para o dashboard geral">
          <BrandLogo variant="white" layout="wide" />
        </Link>

        <nav className="nav-menu" aria-label="Menu principal">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`nav-link ${active ? 'active' : ''}`}>
                <span className="nav-icon"><Icon name={item.icon} /></span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-art" aria-hidden="true">
          <img src="/illustrations/offshore-footer.png" alt="" />
        </div>
      </aside>

      <main className="main-frame">
        <header className="topbar">
          <div className="platform-title">ANPG <span>Operations Intelligence</span></div>
          <div className="topbar-actions">
            <span className="topbar-icon" title="Notificações"><Icon name="bell" /><span className="badge">5</span></span>
            <span className="topbar-icon" title="Ajuda"><Icon name="help" /></span>
            <div className="user-chip">
              <div className="avatar">{getInitials(user?.name, user?.email)}</div>
              <div className="user-meta">
                <strong>{user?.name || 'Utilizador ANPG'}</strong>
                <small>{profileLabel}</small>
              </div>
            </div>
            <button className="logout-button" type="button" onClick={handleLogout}>Sair</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
