# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Codex, …) working in this repository.

## Commands

```shell
pnpm install
pnpm dev                # http://localhost:5173, HMR
pnpm build              # SSR build → build/client + build/server
SSR=false pnpm build    # static / SPA build → build/client only
pnpm preview            # serve the static build locally (4173)
pnpm typecheck          # react-router typegen && tsc --noEmit
pnpm lint               # eslint
pnpm test               # vitest run
pnpm test:watch         # vitest in watch mode
```

OCI image (Nix-built, no Dockerfile): `nix build .#dockerImage && docker load < result && docker run --rm -p 3000:3000 d3strukt0r/wundexpertinplus:latest`.

## Maintenance rules for agents

1. **Keep this file current.** When you change the build pipeline, add or remove a Vite plugin, change how `SITE_HOST` / env vars flow, change CI workflow inputs or outputs, or introduce a new config module, update the relevant section here in the same change set. Don't leave it lagging "for later".
2. **Run `pnpm lint` and `pnpm typecheck` before declaring a task done.** Both must exit 0. A passing `pnpm build` is not enough — lint catches the `Buffer`-without-import / nullish-conditional / unused-arg class of bugs that Vite silently builds past. Fix them in the same change set, not in a follow-up.

## Architecture

### Dual-mode build is the central design fork

`react-router.config.ts` reads `process.env.SSR`. Default is SSR (Node host, Docker). GitHub Pages has no Node runtime, so `deploy-gh-pages.yml` sets `SSR=false`, which produces a pure SPA in `build/client/`. CI runs both builds.

There are no server actions in this site — it's content-only with `tel:` / `mailto:` links and a client-side Google Map. If you ever add a server `action()` to a route, you'll need to wire in a SPA-build export stripper (see the `weleda-webcenter-text-export` repo for a reference implementation).

### Routing

Two routes: `routes/home.tsx` (one-page site: Hero / Leistungen / Über mich / Kontakt) and `routes/not-found.tsx` (`*` 404 fallback). The 404 renders Nav, centered title + message + back-home `<Link>`, and a green-panel Footer pinned to the viewport bottom via `flex-col min-h-dvh`. ErrorBoundary in `root.tsx` uses the simpler `<FallbackLayout>` (no Nav/Footer — Nav might be what's broken).

In-page anchors (`#leistungen`, etc.) drive section navigation. Nav targets come from `de.yml` as absolute path-with-hash (`/#kontakt`), so they SPA-navigate correctly from any route. React-router doesn't auto-scroll to hash on push, so `<ScrollToHash />` in `root.tsx` listens for `location.hash` and calls `scrollIntoView()`. `<ScrollRestoration getKey={(loc) => loc.pathname + loc.search} />` keeps hash-only navigations from resetting scroll to 0.

### Theme system

`useTheme` returns `[theme, setTheme]`. Sets `html.light` / `html.dark` for CSS variable cascades. Persists to `localStorage['wundexpertinplus:theme']` and falls back to `prefers-color-scheme`. An inline `themeBootstrap` IIFE in `root.tsx` runs in `<head>` (before stylesheets evaluate) so the first paint matches the stored choice — no FOUC and no cross-fade animation. The same IIFE adds `html.js` — see the no-JS section below for what that gates. The class is on `<html>` (not `<body>`) so the script can run during head parsing, before `<body>` even exists.

If JS is disabled, `<html>` has neither `.light` nor `.dark`. `_tokens.scss` mirrors the dark token values inside `@media (prefers-color-scheme: dark) html:not(.light):not(.dark) { ... }` so the OS preference still drives the palette.

The **Kontakt** section is intentionally dark-green in both modes — its CTAs reference `--green-fixed` / `--paper-fixed`, not the themed `--green` / `--paper` tokens.

### Progressive enhancement (no-JS path)

The site renders correctly with JavaScript disabled. Several conventions enforce this:

- **`html.js`** is added by the `themeBootstrap` IIFE before hydration. Use it as a CSS gate for anything whose *default* should be the final/visible state: e.g. `.reveal` defaults to opacity 1 / no transform; `html.js .reveal:not(.is-shown)` is what hides it pre-scroll-trigger (`_animations.scss`). Without JS, IntersectionObserver never runs, so without this gate every reveal would stay hidden forever.
- **Tailwind `no-js:` variant** (`tailwind.css:67`) is a `@custom-variant` matching `html:not(.js)` — use it to hide controls that are dead without JS (theme toggle, scroll-to-top button).
- **Mobile menu** is a hidden `<input type="checkbox">` + `<label>` + `:has(.site-nav__toggle:checked)` — works without JS via native label-for-input. React tracks `open` via the input's `onChange` (for aria-expanded and hashchange-close). **Don't add `onClick` on the label** — the native synthetic click is what we want. The hidden-checkbox styling is just utilities on the input (`absolute w-px h-px opacity-0 pointer-events-none`), not a class rule.
- **Anchor-link header offset** uses `scroll-margin-top` on each section target (`#home`, `#leistungen`, `#ueber-mich`, `#kontakt`) in `_base.scss`, **not** `scroll-padding-top` on `<html>`. Container-level scroll-padding triggers Chrome's "scroll focused element into view" routine when the hidden menu checkbox gains focus, causing a visible page-jump on every menu toggle.

### Accessibility (global media-query overrides)

Two universal-selector blocks in `_base.scss` handle user preferences automatically — anyone adding a new effect doesn't need to remember the override:

- **`@media (prefers-reduced-motion: reduce)`** nulls every animation/transition to 0.01ms (so `transitionend` / `animationend` listeners still fire), forces `animation-iteration-count: 1`, and sets `scroll-behavior: auto`. `!important` overrides Tailwind utility specificity. One rule covers every CSS transition, every `@keyframes` animation, and every Tailwind `transition-*` / `animate-*` / `duration-*` utility regardless of where they're declared.
- **`@media (prefers-reduced-transparency: reduce)`** overrides `--header-bg` to its solid sibling (light: same hue as `--map-bg`; dark: same as `--bg`), then disables `backdrop-filter` everywhere. Subtle borders (`--line` alpha 0.14/0.16) and shadows (`--shadow-soft`) are left alone — they're depth cues, not content-readability translucency.

### Styling

**Tailwind v4 is the primary styling system.** Utilities are colocated with markup; SCSS is reserved for what utilities can't express. `main.scss` is a short `@use` index:

```
app/styles/
  tailwind.css          @theme tokens + @utility (container, transition-drawer) + @custom-variant (dark, no-js)
  main.scss             @use index for the SCSS files below
  _mixins.scss          @mixin dark (emits html.dark & + no-JS prefers-color-scheme fallback)
  _tokens.scss          oklch CSS variables (:root + html.dark + no-JS @media)
  _base.scss            resets, scroll-margin targets, body color-flip transition, global reduced-motion + reduced-transparency overrides
  _animations.scss      html.js .reveal:not(.is-shown) gate only (transition lives on <Reveal>)
  _brand.scss           SVG brand-mark theme overrides (need higher specificity than the SVG's inline <style>)
  _nav.scss             :has(.site-nav__toggle:checked) morph rules + burger span transition
  sections/_hero.scss   portrait blob filter
  sections/_map.scss    map placeholder shimmer
```

Whole SCSS surface is ~430 LoC across 8 files. Everything else is utilities on the JSX.

**Design tokens** (`_tokens.scss`) are `oklch()` CSS variables on `:root` (light) with `html.dark` overrides and a no-JS `prefers-color-scheme: dark` fallback. No hex / rgb / hsl anywhere in the SCSS (or in inline SVG fills). `tailwind.css` mirrors these as `--color-*` tokens inside `@theme` so utilities like `bg-paper`, `text-ink-soft`, `border-line` resolve via `var()` and follow the cascade at use-time.

**The `dark` mixin** (`_mixins.scss`) emits BOTH `html.dark &` AND a no-JS `@media (prefers-color-scheme: dark) html:not(.dark):not(.light) &` selector. **Use `@include dark { ... }` for every dark-mode rule** — writing `html.dark &` directly misses the no-JS path. Partials that need it open with `@use 'mixins' as *;` (or `'../mixins'` from `sections/`).

#### Custom `@theme` tokens

`tailwind.css` extends Tailwind's namespaces with project-specific values:

- **Spacing** — `--spacing-hairline` (0.09375rem / 1.5px, burger lines), `--spacing-stack` (1.125rem / 18px, common rhythm), `--spacing-stack-lg` (1.375rem / 22px, wider rhythm). These half-step values aren't in Tailwind's dynamic spacing scale.
- **Typography** — `--text-micro` (0.625rem / 10px, eyebrow caps below `text-xs`). Font sizes/leading otherwise map to Tailwind defaults.
- **Tracking ladder** past `tracking-widest` (which tops at 0.1em) — `--tracking-eyebrow-tight` (0.14em), `--tracking-eyebrow` (0.18em), `--tracking-eyebrow-wide` (0.22em), `--tracking-eyebrow-widest` (0.3em). The uppercase eyebrow style across the site uses these.
- **Shadows** — `--shadow-card`, `--shadow-hover` reference `--shadow-soft` / `--color-shadow` so the light/dark cascade still flips them.
- **Easing** — `--ease-soft: cubic-bezier(0.2, 0.7, 0.2, 1)`.

Two `@utility` declarations:
- `container` — custom max-width steps that reserve scrollbar width (so the container snaps at the breakpoint exactly, not 15px past it).
- `transition-drawer` — single-property `max-height` transition for the mobile drawer, ridden by `ease-soft`. Can't use Tailwind's bare `transition` (no max-height in the curated property list) and `transition-all` would animate the drawer's open-state borders (we want them to snap).

**Rule of thumb for new values:**
1. If close (≤10% drift) to a Tailwind default → use the default.
2. If it recurs and isn't close → add a `@theme` token.
3. Only fall back to arbitrary `[…]` for one-off non-design-system values (rotations, translates, complex `transition-[…,…]` property lists, `min-h-[2lh]`, complex `grid-cols-[…]`, elliptical `rounded-[X_/_Y]`).

### Brand mark and favicons

Single source of truth: `app/assets/brand/plaster-plus.svg`.

- **Inline in the page** — imported with `?react` in `Nav.tsx` as a React component, so theme overrides in `_brand.scss` (`html.dark .brand-plaster__bg { ... }`) can win over the SVG's inline `<style>` block via specificity.
- **Standalone favicon** — the `favicon-rasters` Vite plugin (`app/vite/plugins/favicon-rasters.ts`) emits the SVG copy plus PNG rasters plus a multi-resolution `favicon.ico` (via `png-to-ico`) into `build/client/` at build time. The SVG's inline `<style>` has `prefers-color-scheme: dark` rules so the browser-tab favicon renders correctly on its own.
- **CSS-class fills are inlined before raster** — libvips (sharp's SVG renderer) ignores external CSS rules, so a class-only SVG rasterises as all-black. The plugin walks the SVG's `<style>` block, parses the light-mode rules (skipping `@media` blocks), converts `oklch(...)` values to sRGB hex via `culori`'s `formatHex`, and injects them as inline `fill` / `stroke` / `opacity` attributes on every element with a matching `class="..."`. The browser-visible SVG copy (`/favicon.svg`) is the untouched original — only the buffer passed to sharp is rewritten.
- **PWA icons** (192/512 maskable) come from the same SVG, sizes declared in `app/config/web-manifest.ts`'s `WEB_MANIFEST_ICONS`. The `web-manifest` plugin emits `site.webmanifest` referencing the same paths, so the manifest icon list and the rasterizer's emit set stay in lockstep.

Nothing favicon-related is committed — it's all regenerated each build.

### Nav

- **Routing-aware** — menu links and the brand logo use **react-router `<Link>`**, not `<a>`. Hrefs are stored in `de.yml` as absolute paths-with-hash (`/#leistungen`) so SPA navigation works from any route. A bare `#leistungen` would make react-router resolve relative to the current pathname (`/test#leistungen` from `/test`).
- **Breakpoints** — mobile drawer below Tailwind's `lg` (1024px), full menu at ≥`lg`. LinkedIn icon is hidden 1024–1279px (`max-xl:hidden`) so the row doesn't crowd in the narrow-desktop range; shown ≥1280px alongside the phone CTA and theme toggle. In the mobile drawer, LinkedIn is a separate row below the phone CTA.
- **Burger morph** — base styles (block / width / height / bg / origin) live as utilities on each `<span>` in `Nav.tsx`. The `:has(.site-nav__toggle:checked)` rules in `_nav.scss` apply the transform/opacity that morphs the three lines into an X. **The transition stays in SCSS** because Tailwind's `transition-transform` and `transition-opacity` each set a single `transition-property`, which would override the global `body *` color-flip transition (theme toggle would then snap the burger color instead of fading it).
- **Drawer** — base styles as utilities (`absolute top-full inset-x-0 max-h-0 overflow-hidden bg-paper transition-drawer lg:hidden`); the open rule (`:has(:checked) .site-nav__drawer { max-height + borders }`) stays in SCSS for the same `:has()` reason. `transition-drawer` is a custom `@utility` so we don't need arbitrary `transition-[max-height]`.

### Vite plugins

Three custom plugins live in `app/vite/plugins/`:

- **`favicon-rasters`** — described in *Brand mark and favicons*.
- **`web-manifest`** — emits `site.webmanifest` to the build root. Sources `name` from `app/locales/de.yml`'s `brand.name` so a single edit propagates to the PWA install title. Other fields (`short_name`, `description`, `theme_color`, `background_color`, `display`, icon list) come from `app/config/web-manifest.ts` — the same module `favicon-rasters` reads to know which PNG sizes to render. Theme/background colors are stored as precomputed sRGB hex because several Android launchers still can't parse `oklch(...)`.
- **`copyright-from-license`** — reads `LICENSE.txt`, exposes `__COPYRIGHT_YEARS__` and `__COPYRIGHT_HOLDER__` as build-time globals consumed by the footer copyright lines.

There is no `public/site.webmanifest` — the file is generated, not committed.

### Google Maps

`app/lib/google-maps.ts` exports a `@googlemaps/js-api-loader` singleton. The API key is read from `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` — provide it via `.env.local` for local dev (see `.env.example`) and via a repo secret in CI (`deploy-gh-pages.yml` passes it through). The key is origin-restricted by Google, so shipping it in the client bundle is safe; we still keep it out of source for easy rotation.

`MapBox.tsx` lazy-loads on mount, applies one of two `mapTypeStyles` arrays (light or dark) depending on theme, re-applies via `map.setOptions({styles: ...})` on flip — never re-inits. The CSS placeholder (rendered until JS resolves and on auth failure) keeps the schematic SVG strokes from the design as a soft shimmer, so there's no blank box.

### i18n is mandatory for all UI strings

Every user-facing string lives in `app/locales/de.yml`. Components import `useTranslation` from `react-i18next` and call `t('key')`. The `meta()` export in `routes/home.tsx` calls `i18n.t(...)` directly because it runs outside React. Lists (`leistungen.items`, `about.creds`, `kontakt.perks`) are YAML arrays — read them with `t('key', {returnObjects: true})`.

Nav target hrefs in `de.yml` are absolute (`/#kontakt`), not bare hash (`#kontakt`) — required for SPA navigation from non-`/` routes.

**HMR for translations** — `app/i18n.ts` includes a Vite `import.meta.hot.accept('./locales/de.yml', …)` hook that calls `addResourceBundle` + `changeLanguage(currentLang)` on YAML edit, so translations hot-reload without restarting the dev server. The dev server still needs one full restart any time `i18n.ts` itself changes (the init runs under `if (!i18n.isInitialized)`). For a future multi-locale setup, switch to the array form — `accept(['./locales/de.yml', './locales/en.yml'], …)` — since vite's `accept` has no glob support.

### Path alias

`~` resolves to `app/` (in both `tsconfig.json` paths and `vite.config.ts` resolve.alias). Use `~/components/Foo` rather than `../../components/Foo`.

### YAML imports

`app/locales/*.yml` are loaded as ES modules through `@modyfi/vite-plugin-yaml`. The ambient `*.yml` declaration lives in `app/globals.d.ts`.

### Site hostname (`SITE_HOST`)

The deployed hostname is **not** stored in the repo. Settings → Pages → Custom domain on the GitHub repo is the source of truth. CI workflows fetch it via `gh api "repos/{owner}/{repo}/pages" --jq '.cname'`, fail fast with `::error::` if it's empty or unreachable, and export it to the build as `SITE_HOST`.

- `vite.config.ts` reads `process.env.SITE_HOST` (falling back to `localhost` for local dev) and feeds `https://${SITE_HOST}` to `vite-plugin-sitemap` and `vite-plugin-robots-ts`.
- `deploy-gh-pages.yml` reads the value before `pnpm build` and passes it as a build-step env var.
- `docker.yml` reads the value once in the `setup` job, fans it out via job output to every arch in the build matrix, and passes it as `SITE_HOST` to `nix build`. Workflow declares `pages: read` permission for the API call.
- `flake.nix` forwards it into the pnpm derivation: `SITE_HOST = builtins.getEnv "SITE_HOST";` (requires `--impure`, which the docker workflow already uses for `DOCKER_LABELS_JSON`).

If you need a different hostname for one build (rare — e.g. local prod-like preview), set `SITE_HOST=example.com pnpm build`.

## Production image (Nix-built OCI)

**No Dockerfile.** Image produced by `flake.nix` via `pkgs.dockerTools.streamLayeredImage`, post-processed by `nix-utils`' `fixOciImageHistory` so layers show per-step Commands in Dive and Trivy stops flagging the synthetic `HEALTHCHECK` (DS-0026).

- **Build**: `nix build .#dockerImage` → `./result` is a docker-load-able tarball.
- **Runtime layout**: app lives at `/opt/wundexpertinplus/{build,node_modules,package.json}`. User `nonroot:65532`. CMD `react-router-serve ./build/server/index.js`. Healthcheck `curl -fsS http://localhost:3000/` every 30 s.
- **`pnpmDeps.hash`** is a fixed-output hash. Every lockfile change → new hash. First build with a stale hash fails with `specified: X / got: Y` — copy the `got` value in. `.github/scripts/bump-pnpm-hash.sh` automates the swap-to-fakeHash → read-`got:` → write-back cycle; `bump-pnpm-hash.yml` runs it on push.
- **`SITE_HOST`** is a derivation attribute (`SITE_HOST = builtins.getEnv "SITE_HOST";`). Empty when unset → Vite's localhost fallback; CI sets it from the GH Pages API. See *Site hostname* above.

## Workflows

- **`ci.yml`** — lint + typecheck + build + tests on every PR / push.
- **`deploy-gh-pages.yml`** — fetches the Custom domain via `gh api .../pages --jq .cname`, exports it as `SITE_HOST`, runs `SSR=false pnpm build`, uploads via `actions/upload-pages-artifact@v5` → `actions/deploy-pages@v5` on push to `master`. Fails fast if the API returns no custom domain.
- **`docker.yml`** — multi-arch (`amd64`, `arm64`, `riscv64`) Nix-built OCI image to Docker Hub. Reads the Pages custom domain once in `setup`, fans it out via job output to every arch in the `build` matrix as `SITE_HOST`. Requires `pages: read` permission (declared workflow-wide).
- **`bump-pnpm-hash.yml`** — push-triggered when `pnpm-lock.yaml` / `package.json` changes; runs `.github/scripts/bump-pnpm-hash.sh` to refresh `pnpmDeps.hash` in `flake.nix`. Requires `GH_PAT`.
- **`release.yml`** — `googleapis/release-please-action@v5`. Manages `package.json` (`version`) + `flake.nix` (`version = "X.Y.Z"; # x-release-please-version`). Uses `GH_PAT`.

## Gotchas

- **The `themeBootstrap` IIFE in `root.tsx`** is intentionally minified to a single line so it parses inline before hydration (avoids the theme FOUC).
- **Google Maps API key is public-but-restricted.** It's ok in the client bundle because Google enforces HTTP-Referer restrictions on the key (whitelisted to the site's origins). Don't proxy it through a backend.
- **`pnpmDeps.hash`** — every `pnpm-lock.yaml` change needs a paired hash bump in `flake.nix`.
- **Don't reintroduce a `public/CNAME` file.** The hostname lives in Settings → Pages → Custom domain and is fetched at build time. Adding a checked-in `CNAME` would create two sources of truth that can drift, and GitHub Actions-mode deploys ignore the file anyway (only branch-publishing mode honors it).
- **Favicon raster colors need inline attrs, not classes.** If you add a new element to `plaster-plus.svg`, give it a `class="brand-plaster__…"` matching one of the existing rules so the inline-styles pass picks it up. New CSS classes without corresponding rules in the SVG's `<style>` block will rasterise black.
- **pnpm via Corepack** on host/CI. Production image bypasses Corepack — uses `pkgs.pnpm_10` at build time, ships zero pnpm at runtime.
- **Nav `Link` hrefs must include the leading `/`** (e.g. `/#kontakt`). Bare `#kontakt` makes react-router resolve relative to the current pathname.
- **i18n init is guarded by `isInitialized`.** Changing options in `i18n.ts` requires a full dev-server restart (HMR can't re-run init). YAML *content* changes hot-reload via the `import.meta.hot.accept` hook in the same file.
- **Don't write `html.dark &` directly in SCSS** — use `@include dark { ... }` so the no-JS `prefers-color-scheme` fallback selector is emitted too.
