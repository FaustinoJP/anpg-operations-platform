export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  role?: string | null;
  operator?: {
    id: string;
    name: string;
    code: string;
  } | null;
  lastLoginAt?: string | null;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: 'Bearer' | string;
  user: AuthUser;
};

const TOKEN_KEY = 'anpg_access_token';
const USER_KEY = 'anpg_user';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function saveSession(payload: LoginResponse) {
  if (!isBrowser()) return;
  window.localStorage.setItem(TOKEN_KEY, payload.accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function updateStoredUser(user: AuthUser) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || 'ANPG').trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}
