import {useCallback, useSyncExternalStore} from 'react';

const STORAGE_KEY = 'wundexpertinplus:theme';

// Shared by the JSX `<meta name="theme-color">` tags in root.tsx, the inline
// bootstrap that runs them on first paint, and `applyTheme` below. Same values
// as the `--bg` token in `_tokens.scss` (light line 21, dark line 63).
export const THEME_COLOR_LIGHT = 'oklch(95.4% 3.25% 82.4deg)';
export const THEME_COLOR_DARK = 'oklch(23.0% 5% 167.0deg)';

export type Theme = 'light' | 'dark';

// Shared subscriber set so every `useTheme` consumer (nav toggle, map, …)
// re-renders when the theme changes. Without this, each component had its
// own React state copy — toggling the nav would not trigger MapBox's
// `useEffect([theme])`, leaving the Google Maps styles stuck on the
// previous theme.
const subscribers = new Set<() => void>();

// Duration of the @property color transition on :root, read from the
// `--theme-transition` CSS variable (defined in `_tokens.scss`) so the
// JS suppression timer below stays in sync with the CSS source of truth.
// During the transition, per-element `transition: background-color/color/…`
// rules would otherwise chase the animating var() value and *lag* their own
// transition-duration behind, leaving previous-theme colours visible on the
// nav buttons / map / etc. The `theme-changing` class below suppresses
// per-element transitions for the duration so every element follows the
// shared @property animation in lockstep.
function getThemeTransitionMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--theme-transition')
    .trim();
  const ms = parseFloat(raw);
  return Number.isFinite(ms) && ms > 0 ? ms : 250;
}
let themeChangingTimer: number | null = null;

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
  // Synchronous class flip. The cross-fade between themes is handled
  // entirely in CSS by @property-registered color tokens transitioning on
  // :root (see `_tokens.scss`). CSS Transitions L1: a property-value change
  // on an element with a matching transition rule auto-interpolates; an
  // in-flight transition interrupted by another value change picks up the
  // current interpolated value as the new start, which is exactly the
  // spam-click responsiveness we want.
  const html = document.documentElement;
  // Suppress per-element color transitions for one cycle so they don't
  // chase the @property animation with their own transition-duration of
  // lag (see getThemeTransitionMs above). Re-extends on every click so
  // spam-clicking stays smooth.
  html.classList.add('theme-changing');
  if (themeChangingTimer !== null) {
    clearTimeout(themeChangingTimer);
  }
  themeChangingTimer = window.setTimeout(() => {
    html.classList.remove('theme-changing');
    themeChangingTimer = null;
  }, getThemeTransitionMs() + 20);
  html.classList.toggle('dark', theme === 'dark');
  html.classList.toggle('light', theme === 'light');
  // Side effects deferred: they don't need to land before the paint and
  // would otherwise stretch the cascade event into a second frame.
  requestAnimationFrame(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may throw in private mode / sandboxed contexts; ignore.
    }
    // Override every `<meta name="theme-color">` regardless of its `media`
    // attribute. Both metas end up with the same value, so whichever one
    // wins the browser's media match shows the chosen theme's chrome colour.
    const color = theme === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      m.setAttribute('content', color);
    });
    // Notify all subscribers so every useTheme consumer re-renders.
    subscribers.forEach((fn) => {
      fn();
    });
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
