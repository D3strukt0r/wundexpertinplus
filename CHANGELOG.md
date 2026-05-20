# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0](https://github.com/D3strukt0r/wundexpertinplus/compare/1.0.1...2.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* drops the WordPress image, web.Dockerfile, and the docker/nginx rootfs. Old ci-cd.yml and contribution boilerplate (CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, SUPPORT, AUTHORS, CONTRIBUTORS, ACKNOWLEDGMENTS, issue/PR templates) are removed in favour of references to the org-level .github repo.

### ✨ Features

* rebuild site as React Router 7 SPA/SSR ([0dbfa3c](https://github.com/D3strukt0r/wundexpertinplus/commit/0dbfa3c939aaad307d99992a78837b0112e93617))

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
