import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import MoonIcon from '~/assets/icons/moon.svg?react';
import SunIcon from '~/assets/icons/sun.svg?react';
import {useTheme} from '~/hooks/useTheme';

interface Props {
  // Mobile nav uses a slightly smaller variant.
  size?: 'sm' | 'md';
}

const BUTTON = classNames(
  'inline-flex items-center justify-center shrink-0 relative overflow-hidden',
  'rounded-full border border-line bg-transparent text-ink cursor-pointer',
  'transition-[background,border-color,color] duration-motion ease',
  'hover:bg-bg-deep hover:border-ink-soft',
  'focus-visible:outline-2 focus-visible:outline-green focus-visible:outline-offset-2',
  // No JS = no meaningful click target.
  'no-js:hidden',
);

// Icon slots cross-fade and rotate when `html.dark` toggles. The `dark:`
// variant is class-based (configured in tailwind.css) so it follows the
// theme cascade rather than the OS media query.
//
// `translate` and `rotate` (not `transform`) — Tailwind v4 compiles
// translate-y-* / rotate-* utilities to the modern individual CSS
// properties, so the transition list must name them directly.
const ICON_SLOT = classNames(
  'absolute inline-flex',
  'transition-[translate,rotate,opacity] duration-300 ease-soft',
);

const MOON_SLOT = 'translate-y-0 rotate-0 opacity-100 dark:translate-y-[120%] dark:rotate-[40deg] dark:opacity-0';
const SUN_SLOT = '-translate-y-[120%] -rotate-[40deg] opacity-0 dark:translate-y-0 dark:rotate-0 dark:opacity-100';

export function ThemeToggle({size = 'md'}: Props) {
  const {t} = useTranslation();
  const {theme, toggle} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- SSR-hydration marker: must fire only on the client after mount, so aria-pressed stays absent during SSR
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';
  const label = isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark');
  const iconPx = size === 'sm' ? 16 : 18;

  return (
    <button
      // The aria-label / title / aria-pressed all switch based on the resolved
      // theme; SSR has no access to localStorage or prefers-color-scheme, so
      // those attrs legitimately diverge on hydration. Suppress the warning —
      // visual swap is driven by CSS reading html.dark, so users see the
      // right icon regardless of which side wins the markup race.
      suppressHydrationWarning
      type="button"
      className={classNames(BUTTON, size === 'sm' ? 'w-8 h-8' : 'w-9 h-9')}
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={mounted ? isDark : undefined}
    >
      <span className={classNames(ICON_SLOT, MOON_SLOT)}>
        <MoonIcon width={iconPx} height={iconPx} aria-hidden="true" />
      </span>
      <span className={classNames(ICON_SLOT, SUN_SLOT)}>
        <SunIcon width={iconPx} height={iconPx} aria-hidden="true" />
      </span>
    </button>
  );
}
