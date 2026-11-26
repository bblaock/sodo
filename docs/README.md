# SODO — Project Documentation

This folder is the technical reference for the SODO website. Keep it accurate as the project changes; update the relevant guide in the same pull request as any architectural change.

## Guides

- [Architecture](architecture.md) — URL structure, localization, page organization, shared assets, and hosting.
- [Maintenance and release workflow](maintenance.md) — safe changes, review, QA, deployment, and recovery practices.

## Project at a glance

- Repository: [bblaock/sodo](https://github.com/bblaock/sodo)
- Production site: [https://bblaock.github.io/sodo/](https://bblaock.github.io/sodo/)
- Default branch: `main`
- Site type: static website published with GitHub Pages.
- Supported locales: Arabic (`ar`), English (`en`), and Russian (`ru`).

## Documentation rules

1. Describe the behavior that exists; label proposed improvements as proposals.
2. Do not put credentials, API keys, private tokens, or personal data in this repository.
3. Do not replace or remove existing project files as part of a documentation-only change.
4. When a route, shared script, workflow, or content convention changes, update the matching guide.
5. Prefer small, reviewable pull requests and keep the published site unchanged until the change is reviewed and merged.
