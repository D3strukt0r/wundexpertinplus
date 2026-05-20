import type {Route} from './+types/root';
import {useEffect} from 'react';
import {I18nextProvider, useTranslation} from 'react-i18next';
import {isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation} from 'react-router';
import {FallbackLayout} from './components/FallbackLayout';
import {THEME_COLOR_DARK, THEME_COLOR_LIGHT} from './hooks/useTheme';
import {i18n} from './i18n';

import './styles/tailwind.css';
import './styles/main.scss';

// Scroll to the element matching location.hash whenever the hash changes.
// React-router doesn't auto-scroll on hash navigation, so without this the
// Nav's Link components would update the URL without moving the viewport.
// Uses the page's existing CSS scroll-behavior (smooth, gated by
// prefers-reduced-motion in _base.scss).
function ScrollToHash() {
  const {hash} = useLocation();
  useEffect(() => {
    if (!hash) {
      return;
    }
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.scrollIntoView();
    }
  }, [hash]);
  return null;
}

export const links: Route.LinksFunction = () => [
  {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
  {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap',
  },
  // Favicon set. The SVG carries both light + dark variants inline via a
  // `prefers-color-scheme` `@media` block in its own <style> element, so a
  // single `<link rel="icon">` covers both. PNG + ICO are fallbacks for
  // browsers without SVG-favicon support.
  {rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: '/favicon.svg'},
  {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png'},
  {rel: 'shortcut icon', href: '/favicon.ico'},
  {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
  {rel: 'manifest', href: '/site.webmanifest'},
];

// Runs in <head> before stylesheets evaluate. Writes to <html>
// (`document.documentElement`) because <body> doesn't exist yet during head
// parsing — putting the class on the root element pre-CSS-eval means body
// inherits the dark variable cascade from its first computed style, so the
// global `body, body *` transition in _base.scss has nothing to animate.
// Does three things in one inline pass:
//   1. Sets html.light / html.dark for the first paint (avoids theme FOUC
//      and the cross-fade that fires when the class is added post-paint).
//      Reads localStorage, falls back to prefers-color-scheme.
//   2. Adds html.js so the reveal-on-scroll CSS gates the hidden state on
//      JS being available — without JS, every `.reveal` element stays at
//      its final visible state instead of opacity:0 forever.
//   3. Overrides every `<meta name="theme-color">` content so the mobile
//      browser chrome (address-bar strip) follows the in-page theme even
//      when it disagrees with the OS preference.
// Kept minified to one line for the fastest parse before hydration.
// eslint-disable-next-line style/max-len -- inline IIFE intentionally minified to one line for fastest parse before hydration (avoids theme FOUC)
const themeBootstrap = `(function(){try{var k='wundexpertinplus:theme';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.add(t,'js');var c=t==='dark'?'${THEME_COLOR_DARK}':'${THEME_COLOR_LIGHT}';document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',c);});}catch(e){document.documentElement.classList.add('light','js');}})();`;

export function Layout({children}: {children: React.ReactNode}) {
  return (
    // Browser extensions (Grammarly, password managers, dark-mode helpers,
    // …) attach attributes / inline styles to <html> and <body> after the
    // server-rendered HTML lands and before React hydrates. That diff
    // would otherwise log a hydration warning the user can't fix.
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-title" content="Wund Expertin Plus" />
        {/* Two metas so no-JS users still get OS-driven chrome colour. With
            JS, the bootstrap below and `applyTheme` overwrite both `content`
            attrs to the chosen theme — whichever the browser picks via the
            `media` query then shows the right colour regardless. */}
        <meta name="theme-color" content={THEME_COLOR_LIGHT} media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content={THEME_COLOR_DARK} media="(prefers-color-scheme: dark)" />
        {/* Must run before <Links /> so the theme class is on <html> before
            any stylesheet evaluates — that's what prevents the FOUC. */}
        {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- themeBootstrap is a constant string defined above; no user input, no escaping needed */}
        <script dangerouslySetInnerHTML={{__html: themeBootstrap}} />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        <ScrollToHash />
        <ScrollRestoration getKey={(location) => location.pathname + location.search} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
  const {t} = useTranslation();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : t('errors.unknown');
  return <FallbackLayout title={t('errors.generic_title')} message={message} />;
}
