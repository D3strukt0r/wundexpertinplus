// Shared config for the PWA web app manifest + the favicon rasterizer.
// The Vite plugins `web-manifest.ts` (emits site.webmanifest) and
// `favicon-rasters.ts` (rasterises the brand SVG into PNGs) both read
// this so the icon set and manifest stay in lockstep from a single edit.

export interface ManifestIcon {
  size: number;
  out: string;
  purpose?: 'maskable' | 'any' | 'monochrome';
}

export const WEB_MANIFEST_ICONS: ManifestIcon[] = [
  {size: 192, out: 'web-app-manifest-192x192.png', purpose: 'maskable'},
  {size: 512, out: 'web-app-manifest-512x512.png', purpose: 'maskable'},
];

// Colours stored as sRGB hex (precomputed from the OKLCH design tokens
// in `app/styles/_tokens.scss`). The manifest spec accepts CSS color
// strings, but several Android launchers still don't parse `oklch(...)`.
export const WEB_MANIFEST = {
  short_name: 'Wund Expertin',
  description: 'Sibylle Bürgi-Lütscher · Dipl. Wundexpertin SAfW · Wundbehandlung in Baselland',
  lang: 'de',
  display: 'standalone',
  // OS UI chrome (status bar, title bar) when the PWA is launched standalone.
  theme_color: '#f4efe6',
  // Splash-screen fill shown while the installed PWA is booting.
  background_color: '#f4efe6',
} as const;
