# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0](https://github.com/D3strukt0r/wundexpertinplus/compare/2.1.0...2.2.0) (2026-05-20)


### ✨ Features

* **build:** Create SPA fallback 404.html for static hosts ([4ae3954](https://github.com/D3strukt0r/wundexpertinplus/commit/4ae3954264e3080b7ddb1bcf64038cb9d6817524))
* **theme:** Synchronize browser chrome color with app theme ([e10b84e](https://github.com/D3strukt0r/wundexpertinplus/commit/e10b84e0839f978b7e8e4e077980a3bf14f649c5))


### ⚡ Performance

* **theme:** Apply theme and JS classes on  to prevent FOUC ([256f423](https://github.com/D3strukt0r/wundexpertinplus/commit/256f4231f3a8fa8874dbc0b89a9ab7ebd35bc356))


### ♻️ Refactoring

* **colors:** Standardize oklch chroma to percentage syntax ([a3205ac](https://github.com/D3strukt0r/wundexpertinplus/commit/a3205ac4a4dbf94e9a8955beb90162569c4bacbe))
* **scripts:** Relocate pnpm hash bump script ([81593eb](https://github.com/D3strukt0r/wundexpertinplus/commit/81593ebf295ae569cfd31a42b7e0fee3c3f66da0))

## [2.1.0](https://github.com/D3strukt0r/wundexpertinplus/compare/2.0.0...2.1.0) (2026-05-20)


### ✨ Features

* **build:** dynamically configure site hostname and PWA assets ([41bd224](https://github.com/D3strukt0r/wundexpertinplus/commit/41bd224b5deeabf2aa073e4f6d594a20c6145f95))

## [2.0.0](https://github.com/D3strukt0r/wundexpertinplus/compare/1.0.1...2.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* drops the WordPress image, web.Dockerfile, and the docker/nginx rootfs. Old ci-cd.yml and contribution boilerplate (CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, SUPPORT, AUTHORS, CONTRIBUTORS, ACKNOWLEDGMENTS, issue/PR templates) are removed in favour of references to the org-level .github repo.

### ✨ Features

* rebuild site as React Router 7 SPA/SSR ([d82bc82](https://github.com/D3strukt0r/wundexpertinplus/commit/d82bc827fb40cdd753588bc222f73bc51b33d316))

## 1.0.1 (2020-05-29)


### ✨ Features

* Set upload limit to 100M for WordPress uploads (`post_max_size` and `upload_max_filesize`) ([728850e](https://github.com/D3strukt0r/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))


### 🐛 Bug Fixes

* Move trailing inline comments off `.gitattributes` rule lines so the rules apply correctly ([728850e](https://github.com/D3strukt0r/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))

## 1.0.0 (2020-05-29)


### ✨ Features

* Initial project scaffolding (Docker, Vagrant, CI, governance files) ([728850e](https://github.com/D3strukt0r/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
* Add WordPress ([728850e](https://github.com/D3strukt0r/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
* Add site-specific plugins and themes ([728850e](https://github.com/D3strukt0r/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
* Update WordPress ([728850e](https://github.com/D3strukt0r/wundexpertinplus/commit/728850ece62730f3a0ef45edfe0752604e4d721b))
