import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ArrowUpIcon from '~/assets/icons/arrow-up.svg?react';
import {cn} from '~/lib/utils';

// Fixed-position button bottom-right of the viewport. Appears once the user
// has scrolled past the threshold; click smooth-scrolls to the top.
//
// `window.scrollTo({top: 0})` (no explicit `behavior`) honours the CSS
// `scroll-behavior` declared on `<html>` in _base.scss — so the same
// `prefers-reduced-motion: reduce` override that disables anchor-click
// smooth scroll also disables this one. No JS branching needed.
const SCROLL_THRESHOLD_PX = 400;

const BASE = cn(
  'fixed right-4 bottom-4 md:right-6 md:bottom-6',
  'w-10 h-10 md:w-11 md:h-11 z-50',
  'inline-flex items-center justify-center cursor-pointer',
  'rounded-full border border-border bg-card text-foreground',
  'shadow-hover',
  // `translate`, not `transform` — Tailwind v4 `translate-y-*` compiles to
  // the modern `translate` CSS property, so the transition list has to
  // name it explicitly. Opacity uses the same soft ease curve as the slide.
  'transition-[opacity,translate,background-color,border-color,color] duration-theme ease-soft',
  'hover:bg-secondary',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  // Hide when JS hasn't loaded — the visibility logic lives in React.
  'no-js:hidden',
);

export function ScrollToTop() {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // eslint-disable-next-line react/set-state-in-effect -- runs on every scroll event AND once on mount to read scrollY (which SSR can't know); no other way to sync initial state
      setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={cn(BASE, {
        'opacity-100 translate-y-0': visible,
        'opacity-0 translate-y-2 pointer-events-none': !visible,
      })}
      onClick={() => {
        window.scrollTo({top: 0});
      }}
      aria-label={t('scroll_to_top')}
      aria-hidden={!visible}
      title={t('scroll_to_top')}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUpIcon width={18} height={18} aria-hidden="true" />
    </button>
  );
}
