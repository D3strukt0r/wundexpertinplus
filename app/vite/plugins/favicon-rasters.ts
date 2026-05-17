import type {Plugin} from 'vite';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import process from 'node:process';
import pngToIco from 'png-to-ico';

interface Options {
  // Path (relative to project root) of the source SVG. The committed file
  // ships both light + dark variants via a `prefers-color-scheme` <style>
  // block; raster fallbacks here are always the SVG's light-mode rendering.
  source?: string;
  // Path (relative to project root) of the web app manifest. PNG icons it
  // declares in `icons[]` are added to the emit set so the manifest stays
  // the single source of truth for PWA icons (192/512 maskable, etc.)
  // without us re-declaring them in `PNG_SIZES`.
  manifest?: string;
  // Output filename for the SVG copy emitted to the build root. Browser
  // tab `<link rel="icon">` references this. Defaults to `favicon.svg`.
  svgOut?: string;
}

// PNGs not declared by the manifest — favicon-sized + Apple touch icon.
// Anything the manifest also wants generated lives there; this list covers
// only the rasters referenced via `<link rel>` in `root.tsx`.
const PNG_SIZES = [
  {size: 96, out: 'favicon-96x96.png'},
  {size: 180, out: 'apple-touch-icon.png'},
] as const;

// Resolutions baked into the multi-image .ico. Matches what RealFavicon-
// Generator embeds: 16/32/48
// at 32bpp, BMP-encoded inside the ICO container for maximum legacy support.
const ICO_SIZES = [16, 32, 48] as const;

interface ManifestIcon {
  src: string;
  sizes: string;
  type?: string;
  purpose?: string;
}

interface WebManifest {
  icons?: ManifestIcon[];
}

const SQUARE_SIZE_RE = /^(\d+)x(\d+)$/;
const WHITESPACE_RE = /\s+/;

// Pulls PNG `(size, fileName)` pairs out of a manifest. Skips anything we
// can't render: non-PNG types, non-square sizes, multi-size declarations
// (those belong in PNG_SIZES or ICO_SIZES). Reports skip reasons so the
// build logs surface manifest entries that won't be regenerated.
function pngIconsFromManifest(
  manifest: WebManifest,
  warn: (msg: string) => void,
): {size: number; out: string}[] {
  const out: {size: number; out: string}[] = [];
  for (const icon of manifest.icons ?? []) {
    if (icon.type !== undefined && icon.type !== 'image/png') {
      warn(`[favicon-rasters] skipped ${icon.src}: type "${icon.type}" — only image/png is handled.`);
      continue;
    }
    const tokens = icon.sizes.split(WHITESPACE_RE).filter(Boolean);
    if (tokens.length !== 1) {
      warn(`[favicon-rasters] skipped ${icon.src}: expected one size, got "${icon.sizes}".`);
      continue;
    }
    const match = SQUARE_SIZE_RE.exec(tokens[0]!);
    if (!match || match[1] !== match[2]) {
      warn(`[favicon-rasters] skipped ${icon.src}: "${tokens[0]}" is not a square WxH size.`);
      continue;
    }
    out.push({size: Number(match[1]), out: icon.src.startsWith('/') ? icon.src.slice(1) : icon.src});
  }
  return out;
}

// Generates PNG + ICO favicon fallbacks from the source SVG during the
// client build, plus emits the SVG itself to the build root so the
// `<link rel="icon">` URL keeps working without keeping a duplicate copy
// in `public/`. The source SVG is the same file the Nav uses inline via
// `?react` — one canonical brand mark, used everywhere.
//
// PNG outputs come from a mix of:
//   1. The manifest's `icons[]` (kept untouched as the single source of truth
//      for PWA icons),
//   2. `PNG_SIZES` for non-manifest entries the manifest doesn't carry
//      (favicon-96, apple-touch-icon),
//   3. `ICO_SIZES` for the multi-resolution `.ico`.
// All emitted via `emitFile` so they land at the expected root URLs in
// `build/client/` without going through `public/`.
//
// Runs in the client build only — SSR doesn't need favicons.
export function faviconRasters(opts: Options = {}): Plugin {
  const source = opts.source ?? join('app', 'assets', 'brand', 'plaster-plus.svg');
  const manifestPath = opts.manifest ?? join('public', 'site.webmanifest');
  const svgOut = opts.svgOut ?? 'favicon.svg';

  return {
    name: 'favicon-rasters',
    applyToEnvironment: (env) => env.name === 'client',
    apply: 'build',
    async generateBundle() {
      const sharp = (await import('sharp')).default;
      const svg = readFileSync(join(process.cwd(), source));
      const manifest = JSON.parse(readFileSync(join(process.cwd(), manifestPath), 'utf8')) as WebManifest;
      const manifestPngs = pngIconsFromManifest(manifest, (msg) => {
        this.warn(msg);
      });

      // Copy the source SVG to the build root so /favicon.svg keeps working
      // for `<link rel="icon">` tags. The same file is also imported via
      // `?react` for the Nav brand mark, so there's only one source.
      this.emitFile({type: 'asset', fileName: svgOut, source: svg});

      // Density 384 gives sharp enough headroom to rasterise the SVG up to
      // 512px without aliasing.
      const renderPng = async (size: number) => sharp(svg, {density: 384})
        .resize(size, size, {fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}})
        .png()
        .toBuffer();

      for (const {size, out} of [...PNG_SIZES, ...manifestPngs]) {
        const buf = await renderPng(size);
        this.emitFile({type: 'asset', fileName: out, source: buf});
      }

      // Multi-resolution favicon.ico — `png-to-ico` takes PNG buffers and
      // produces BMP-encoded (DIB) entries inside the ICO, matching the
      // format that RealFaviconGenerator emits for maximum browser/OS
      // compatibility (pre-Vista Windows + older shells can't read
      // PNG-in-ICO).
      const icoPngs = await Promise.all(ICO_SIZES.map(async (s) => renderPng(s)));
      const ico = await pngToIco(icoPngs);
      this.emitFile({type: 'asset', fileName: 'favicon.ico', source: ico});
    },
  };
}
