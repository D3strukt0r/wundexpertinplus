import type {Plugin} from 'vite';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import process from 'node:process';
import ViteYaml from '@modyfi/vite-plugin-yaml';
import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import {ALLOW_ALL, robots} from 'vite-plugin-robots-ts';
import sitemap from 'vite-plugin-sitemap';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vitest/config';
import {copyrightFromLicense} from './app/vite/plugins/copyright-from-license';
import {faviconRasters} from './app/vite/plugins/favicon-rasters';

const isVitest = process.env.VITEST === 'true';

// Single source of truth for the deployed hostname: public/CNAME. GitHub
// Pages reads it to bind the custom domain; sitemap + robots read it here
// so both stay in lockstep with a single edit. Falls back to a localhost
// stand-in if CNAME is missing (first-boot before the domain is wired up).
const cnamePath = join(process.cwd(), 'public', 'CNAME');
const cname = existsSync(cnamePath) ? readFileSync(cnamePath, 'utf8').trim() : 'localhost';
const SITE_URL = `https://${cname}`;
const OUT_DIR = 'build/client';
const absOutDir = join(process.cwd(), OUT_DIR);

// sitemap + robots close their bundle hooks before react-router has flushed
// assets to build/client on a cold build, so the dir might not exist yet.
mkdirSync(absOutDir, {recursive: true});

// react-router 7 runs Vite with multiple environments (client, ssr). Scope
// sitemap + robots to the client build so their closeBundle hooks don't fire
// for the SSR output (which lives at build/server/).
function clientOnly(plugin: Plugin): Plugin {
  return {...plugin, applyToEnvironment: (env) => env.name === 'client'};
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    // Pulls year(s) + holder from LICENSE.txt and exposes them as
    // build-time globals (__COPYRIGHT_YEARS__, __COPYRIGHT_HOLDER__) so
    // the footer copyright stays in lockstep with the legal artefact.
    copyrightFromLicense(),
    // Rasterises `public/favicon.svg` to PNG + multi-resolution ICO during
    // the client build. Modern browsers use the SVG directly; these are
    // fallbacks for older platforms.
    faviconRasters(),
    // react-router's vite plugin clashes with vitest's environment setup, so
    // skip it when running tests.
    ...(isVitest ? [] : [reactRouter()]),
    ViteYaml(),
    svgr({include: '**/*.svg?react'}),
    clientOnly(sitemap({
      hostname: SITE_URL,
      outDir: OUT_DIR,
      dynamicRoutes: ['/'],
      generateRobotsTxt: false,
    })),
    clientOnly(robots({
      content: `${ALLOW_ALL}\n`,
      sitemap: `${SITE_URL}/sitemap.xml`,
    })),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '~': new URL('./app', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['app/**/*.{test,spec}.{ts,tsx}'],
  },
});
