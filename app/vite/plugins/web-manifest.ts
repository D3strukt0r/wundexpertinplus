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

// Emits the PWA web app manifest at build time. Replaces the
// hand-maintained `public/site.webmanifest`. The icon set is shared
// with `favicon-rasters` via `app/config/web-manifest.ts` so the two
// stay consistent from one source.
export function webManifest(opts: Options = {}): Plugin {
  const localePath = opts.locale ?? join('app', 'locales', 'de.yml');
  const out = opts.out ?? 'site.webmanifest';

  return {
    name: 'web-manifest',
    applyToEnvironment: (env) => env.name === 'client',
    apply: 'build',
    generateBundle() {
      const yaml = parseYaml(readFileSync(join(process.cwd(), localePath), 'utf8')) as LocaleShape;
      const name = yaml.brand?.name;
      if (name === undefined || name === '') {
        this.error(`[web-manifest] missing brand.name in ${localePath}`);
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

      this.emitFile({
        type: 'asset',
        fileName: out,
        source: `${JSON.stringify(manifest, null, 2)}\n`,
      });
    },
  };
}
