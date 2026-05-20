import {useCallback, useSyncExternalStore} from 'react';

const STORAGE_KEY = 'wundexpertinplus:theme';

export type Theme = 'light' | 'dark';

// Shared subscriber set so every `useTheme` consumer (nav toggle, map, …)
// re-renders when the theme changes. Without this, each component had its
// own React state copy — toggling the nav would not trigger MapBox's
// `useEffect([theme])`, leaving the Google Maps styles stuck on the
// previous theme.
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function getSnapshot(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerSnapshot(): Theme {
  return 'light';
}

function applyTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage may throw in private mode / sandboxed contexts; ignore.
  }
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
  // Notify all subscribers so every useTheme consumer re-renders.
  subscribers.forEach((fn) => {
    fn();
  });
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggle = useCallback(() => {
    applyTheme(getSnapshot() === 'dark' ? 'light' : 'dark');
  }, []);
  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
  }, []);
  return {theme, toggle, setTheme};
}
