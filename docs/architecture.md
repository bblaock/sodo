# SODO — Architecture

## 1. Overview

SODO is a static personal website. Its source is maintained in GitHub and its public site is published through GitHub Pages. Netlify is not part of the current deployment setup.

The repository is the source of truth for website code, assets, route pages, and change history. Notion is used separately for project notes and the personal film library; it is not the runtime database for the public website.

## 2. URL and locale model

The repository is published under the GitHub Pages project path `/sodo/`.

- `/sodo/` — language-selection gateway.
- `/sodo/ar/` — Arabic home.
- `/sodo/en/` — English home.
- `/sodo/ru/` — Russian home.

Localized sections follow the locale segment:

- `/{locale}/about/`
- `/{locale}/thoughts/`
- `/{locale}/films/`
- `/{locale}/projects/`

Film and series detail pages use:

- `/{locale}/films/{filmSlug}/`

Use the actual locale-prefixed route when linking internally. Do not create links that accidentally drop the `/sodo/` project base path.

## 3. Language behavior

The locale in the URL is authoritative for localized pages. The shared language router and site script coordinate locale initialization, internal navigation, and language switching.

Language switching should preserve the equivalent current section or film-detail route when that localized destination exists. Keep the document `lang` and `dir` attributes consistent with the selected locale (Arabic is right-to-left; English and Russian are left-to-right).

The language menu has mobile stacking-order protections. Changes to the shared header, menu, transitions, or locale routing must be tested on narrow viewports as well as desktop.

## 4. Page and content organization

The site contains the language gateway, localized home pages, localized section pages, and localized film/series detail pages. Film and series cards link to their corresponding detail pages.

The approved detail-page presentation is cinematic and responsive. Preserve the established visual system unless a design change is explicitly requested:

- Dark base colors: `#080a08` and `#111510`.
- Lime accent: `#c8ff4d`.
- Poster-led detail layout with synopsis and title metadata.
- Responsive mobile layout and reduced-motion support.

## 5. Posters and static assets

Posters used by the site are stored locally in the repository (including optimized WebP assets under `assets/posters/`). Prefer the existing local asset workflow over adding fragile third-party hotlinks.

When adding a title, verify that the poster file exists, the path is correct from every relevant localized page, and the image loads in browser tests.

## 6. Quality and publishing

The project uses automated checks in GitHub Actions, including the Python site QA checker and browser-based regression checks. The Python checker validates local HTML references, duplicate IDs, and basic page metadata. Browser coverage has included locale routes, language switching, navigation, mobile overflow, runtime errors, and failed same-origin resources.

GitHub Pages is the production publishing target. A passing code check is not, by itself, proof that the deployed site is visually correct or that a real iPhone/iPad interaction has been tested.
