export const DEMO_SESSION_KEY = 'recalldesk-demo-session';

export const DEMO_USER = {
  name: 'Demo Operator',
  email: 'demo@recalldesk.ai',
  role: 'Demo Access',
};

export function isDemoSessionActive() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const storageValue = window.localStorage.getItem(DEMO_SESSION_KEY);
    const cookieValue = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${DEMO_SESSION_KEY}=`))
      ?.split('=')
      .slice(1)
      .join('=');

    return storageValue === 'active' || cookieValue === 'active';
  } catch {
    return false;
  }
}

export function setDemoSession(active: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  if (active) {
    window.localStorage.setItem(DEMO_SESSION_KEY, 'active');
    document.cookie = `${DEMO_SESSION_KEY}=active; Path=/; SameSite=Lax; Max-Age=604800`;
    return;
  }

  window.localStorage.removeItem(DEMO_SESSION_KEY);
  document.cookie = `${DEMO_SESSION_KEY}=; Path=/; SameSite=Lax; Max-Age=0`;
}

export function clearDemoSession() {
  setDemoSession(false);
}

export function readDemoData<T>(storageKey: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeDemoData<T>(storageKey: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function resetDemoStorage(keys: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  keys.forEach((key) => window.localStorage.removeItem(key));
}
