import type {RouteConfig} from '@react-router/dev/routes';
import process from 'node:process';
import {index, route} from '@react-router/dev/routes';

// SSR serves the SEO artifacts as resource routes (host resolved at runtime);
// the SPA build emits them as static files instead (see vite.config.ts).
const ssr = process.env.SSR !== 'false';

export default [
  index('routes/home.tsx'),
  ...(ssr
    ? [
        route('sitemap.xml', 'routes/sitemap-xml.ts'),
        route('robots.txt', 'routes/robots-txt.ts'),
      ]
    : []),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
