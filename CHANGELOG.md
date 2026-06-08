# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.1](https://github.com/Team-MaRo/wundexpertinplus/compare/2.3.0...2.3.1) (2026-06-04)


### 🐛 Bug Fixes

* support GitHub Pages project sub-path deploys ([a49ee3b](https://github.com/Team-MaRo/wundexpertinplus/commit/a49ee3b1b0b6cbd4a15663b767aa059bfcb7631f))

## [2.3.0](https://github.com/Team-MaRo/wundexpertinplus/compare/2.2.1...2.3.0) (2026-06-03)


### ✨ Features

* add Cloudflare Workers SSR as a third deploy target ([dfeee2e](https://github.com/Team-MaRo/wundexpertinplus/commit/dfeee2e0c20c31ddd9776face31c6195f1550909))
* Dynamic SEO in SSR and build in SPA & favicon endpoints for Dev mode ([61c07bd](https://github.com/Team-MaRo/wundexpertinplus/commit/61c07bdd392835abb44bc93cd24c086d09099dae))
* Rebuild new UI with schadcn & gsap ([40edb79](https://github.com/Team-MaRo/wundexpertinplus/commit/40edb79e59f6efa6476ad780c2f6a4a21d065e4d))
* Use standard tokens and rem instead of px ([ce44d00](https://github.com/Team-MaRo/wundexpertinplus/commit/ce44d00254e5e0e60291e5c087278be816dc6a08))


### 🐛 Bug Fixes

* Design issues & pnpm deps ([22a0eaa](https://github.com/Team-MaRo/wundexpertinplus/commit/22a0eaacc8b2a17c19d950d29caae5e216784e5d))
* Small text sizes & update deps ([d33f463](https://github.com/Team-MaRo/wundexpertinplus/commit/d33f463444a02e882ce5e3816fd78396d0104430))

## [2.2.1](https://github.com/Team-MaRo/wundexpertinplus/compare/2.2.0...2.2.1) (2026-05-26)


### 🐛 Bug Fixes

* **a11y:** Close no-JS dark cascade gap under prefers-reduced-transparency ([4cf6ca6](https://github.com/Team-MaRo/wundexpertinplus/commit/4cf6ca6e194f3846191572a4105cc50720cacd52))
* **build:** Serve site.webmanifest from vite dev server ([6382742](https://github.com/Team-MaRo/wundexpertinplus/commit/63827423c7246bd357b8e30ee45ab7caf70a7d03))
* **styles:** Make theme crossfade correct at any duration ([2f0a0db](https://github.com/Team-MaRo/wundexpertinplus/commit/2f0a0db452f1333b36a886feb0a0c54862717398))
* **workflows:** Use GH_PAT for Dependabot auto-merge to fire downstream workflows ([e653a3c](https://github.com/Team-MaRo/wundexpertinplus/commit/e653a3c7195bf49c119ba22345e2110614e54194))


### ♻️ Refactoring

* **maps:** Switch to [@vis](https://github.com/vis).gl/react-google-maps ([bd7067c](https://github.com/Team-MaRo/wundexpertinplus/commit/bd7067c125e7978342fef60fa24e2a3be9eb79bd))
* **styles:** Centralise motion + dark-cascade tokens ([87ff861](https://github.com/Team-MaRo/wundexpertinplus/commit/87ff8616945c1cf70752b8ce89c6831a8467c4fc))

## [2.2.0](https://github.com/Team-MaRo/wundexpertinplus/compare/2.1.0...2.2.0) (2026-05-20)


### ✨ Features

* **build:** Create SPA fallback 404.html for static hosts ([4ae3954](https://github.com/Team-MaRo/wundexpertinplus/commit/4ae3954264e3080b7ddb1bcf64038cb9d6817524))
* **theme:** Synchronize browser chrome color with app theme ([e10b84e](https://github.com/Team-MaRo/wundexpertinplus/commit/e10b84e0839f978b7e8e4e077980a3bf14f649c5))


### ⚡ Performance

* **theme:** Apply theme and JS classes on  to prevent FOUC ([256f423](https://github.com/Team-MaRo/wundexpertinplus/commit/256f4231f3a8fa8874dbc0b89a9ab7ebd35bc356))


### ♻️ Refactoring

* **colors:** Standardize oklch chroma to percentage syntax ([a3205ac](https://github.com/Team-MaRo/wundexpertinplus/commit/a3205ac4a4dbf94e9a8955beb90162569c4bacbe))
* **scripts:** Relocate pnpm hash bump script ([81593eb](https://github.com/Team-MaRo/wundexpertinplus/commit/81593ebf295ae569cfd31a42b7e0fee3c3f66da0))

## [2.1.0](https://github.com/Team-MaRo/wundexpertinplus/compare/2.0.0...2.1.0) (2026-05-20)


### ✨ Features

* **build:** dynamically configure site hostname and PWA assets ([41bd224](https://github.com/Team-MaRo/wundexpertinplus/commit/41bd224b5deeabf2aa073e4f6d594a20c6145f95))

## [2.0.0](https://github.com/Team-MaRo/wundexpertinplus/compare/1.0.1...2.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* drops the WordPress image, web.Dockerfile, and the docker/nginx rootfs. Old ci-cd.yml and contribution boilerplate (CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, SUPPORT, AUTHORS, CONTRIBUTORS, ACKNOWLEDGMENTS, issue/PR templates) are removed in favour of references to the org-level .github repo.

### ✨ Features

* rebuild site as React Router 7 SPA/SSR ([d82bc82](https://github.com/Team-MaRo/wundexpertinplus/commit/d82bc827fb40cdd753588bc222f73bc51b33d316))

## 1.0.1 (2020-05-29)


### ✨ Features

* Set upload limit to 100M for WordPress uploads (`post_max_size` and `upload_max_filesize`) ([728850e](https://github.com/Team-MaRo/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))


### 🐛 Bug Fixes

* Move trailing inline comments off `.gitattributes` rule lines so the rules apply correctly ([728850e](https://github.com/Team-MaRo/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))

## 1.0.0 (2020-05-29)


### ✨ Features

* Initial project scaffolding (Docker, Vagrant, CI, governance files) ([728850e](https://github.com/Team-MaRo/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
* Add WordPress ([728850e](https://github.com/Team-MaRo/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
* Add site-specific plugins and themes ([728850e](https://github.com/Team-MaRo/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
* Update WordPress ([728850e](https://github.com/Team-MaRo/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
