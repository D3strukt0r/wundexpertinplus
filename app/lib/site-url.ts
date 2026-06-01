import process from 'node:process';

// Resolves the site origin at runtime for the SSR resource routes: an explicit
// `SITE_HOST` env wins (e.g. set in docker-compose), else the proxied/requested
// host header, else the request URL's own host. The SPA build instead bakes the
// host in at build time (see `vite.config.ts`).
export function resolveSiteUrl(request: Request): string {
  const envHost = process.env.SITE_HOST?.trim();
  const host = envHost !== undefined && envHost !== ''
    ? envHost
    : request.headers.get('x-forwarded-host')
      ?? request.headers.get('host')
      ?? new URL(request.url).host;
  return `https://${host}`;
}
