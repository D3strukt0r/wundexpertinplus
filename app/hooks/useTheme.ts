import {useCallback, useSyncExternalStore} from 'react';

const STORAGE_KEY = 'wundexpertinplus:theme';

// Shared by the JSX `<meta name="theme-color">` tags in root.tsx, the inline
// bootstrap that runs them on first paint, and `applyTheme` below. Same values
// as the `--background` token in `_tokens.scss` (light :root, dark cascade).
export const THEME_COLOR_LIGHT = 'oklch(95.4% 0.0130 81.5deg)';
export const THEME_COLOR_DARK = 'oklch(21.6% 0.0181 168deg)';

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
  // Override every `<meta name="theme-color">` regardless of its `media`
  // attribute. Both metas end up with the same value, so whichever one wins
  // the browser's media match shows the chosen theme's chrome colour.
  const color = theme === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.setAttribute('content', color);
  });
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
