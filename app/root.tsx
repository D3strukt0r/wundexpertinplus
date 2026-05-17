import type {Route} from './+types/root';
import {useEffect} from 'react';
import {I18nextProvider, useTranslation} from 'react-i18next';
import {isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation} from 'react-router';
import {FallbackLayout} from './components/FallbackLayout';
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
  {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
  {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png'},
  {rel: 'shortcut icon', href: '/favicon.ico'},
  {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
  {rel: 'manifest', href: '/site.webmanifest'},
];

// Runs before React hydrates. Does two things in one inline pass:
//   1. Sets body.light / body.dark for the first paint (avoids theme FOUC).
//      Reads localStorage, falls back to prefers-color-scheme.
//   2. Adds body.js so the reveal-on-scroll CSS gates the hidden state on
//      JS being available — without JS, every `.reveal` element stays at
//      its final visible state instead of opacity:0 forever.
// Kept minified to one line for the fastest parse before hydration.
// eslint-disable-next-line style/max-len -- inline IIFE intentionally minified to one line for fastest parse before hydration (avoids theme FOUC)
const themeBootstrap = `(function(){try{var k='wundexpertinplus:theme';var s=localStorage.getItem(k);var t=(s==='light'||s==='dark')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.body.classList.add(t,'js');}catch(e){document.body.classList.add('light','js');}})();`;

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
        <meta name="theme-color" content="oklch(95.4% 0.013 82.4deg)" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="oklch(23.0% 0.020 167.0deg)" media="(prefers-color-scheme: dark)" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml -- themeBootstrap is a constant string defined above; no user input, no escaping needed */}
        <script dangerouslySetInnerHTML={{__html: themeBootstrap}} />
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
