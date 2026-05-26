import type {Plugin} from 'vite';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import process from 'node:process';
import {parse as parseYaml} from 'yaml';
import {WEB_MANIFEST, WEB_MANIFEST_ICONS} from '../../config/web-manifest';

interface Options {
  // Path (relative to project root) of the locale YAML to source `name`
  // from. Defaults to `app/locales/de.yml`. The plugin reads `brand.name`
  // so a single edit in the locale propagates to the PWA install title.
  locale?: string;
  // Output filename emitted to the client build root. Browser
  // `<link rel="manifest">` references this. Defaults to
  // `site.webmanifest`.
  out?: string;
}

interface LocaleShape {
  brand?: {name?: string};
}

// Emits the PWA web app manifest at build time and serves it from
// `configureServer` during `vite dev`. Replaces the hand-maintained
// `public/site.webmanifest`. The icon set is shared with `favicon-rasters`
// via `app/config/web-manifest.ts` so the two stay consistent from one
// source. Without the dev-time route, `vite dev` 404s the request, the
// browser receives the HTML 404 page, parses it as JSON, and logs
// `Manifest: Line: 1, column: 1, Syntax error.`
export function webManifest(opts: Options = {}): Plugin {
  const localePath = opts.locale ?? join('app', 'locales', 'de.yml');
  const out = opts.out ?? 'site.webmanifest';
  const route = `/${out}`;

  // Re-runs on each dev request (cheap; YAML read is tiny) so edits to
  // `de.yml` propagate without a dev-server restart. Build path calls it
  // once per `generateBundle`.
  function buildManifest(): string {
    const yaml = parseYaml(readFileSync(join(process.cwd(), localePath), 'utf8')) as LocaleShape;
    const name = yaml.brand?.name;
    if (name === undefined || name === '') {
      throw new Error(`[web-manifest] missing brand.name in ${localePath}`);
    }
    const manifest = {
      name,
      ...WEB_MANIFEST,
      icons: WEB_MANIFEST_ICONS.map((icon) => ({
        src: `/${icon.out}`,
        sizes: `${icon.size}x${icon.size}`,
        type: 'image/png',
        ...(icon.purpose === undefined ? {} : {purpose: icon.purpose}),
      })),
    };
    return `${JSON.stringify(manifest, null, 2)}\n`;
  }

  return {
    name: 'web-manifest',
    applyToEnvironment: (env) => env.name === 'client',
    configureServer(server) {
      server.middlewares.use(route, (_req, res) => {
        try {
          res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
          res.end(buildManifest());
        } catch (err) {
          server.config.logger.error(`[web-manifest] ${(err as Error).message}`);
          res.statusCode = 500;
          res.end(`/* ${(err as Error).message} */`);
        }
      });
      server.config.logger.info(`✓ [web-manifest] Exposed new route: ${route}`);
    },
    generateBundle() {
      let source: string;
      try {
        source = buildManifest();
      } catch (err) {
        this.error((err as Error).message);
      }
      this.emitFile({type: 'asset', fileName: out, source});
    },
  };
}
