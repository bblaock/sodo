# SODO — Maintenance and Release Workflow

## 1. Safe change procedure

1. Start from the latest `main`.
2. Create a focused feature or fix branch; do not experiment directly on `main`.
3. Inspect the existing page, shared styles/scripts, route conventions, and related tests before editing.
4. Keep the change limited to the requested behavior. Avoid unrelated redesigns, mass formatting, or asset replacement.
5. Add or update regression tests for any changed behavior.
6. Open a pull request targeting `main`, summarize the change, and list the checks performed.
7. Merge only after reviewing the diff and confirming required checks pass.
8. Verify the GitHub Pages deployment and relevant live routes after merge.

## 2. High-risk areas

Take extra care when changing:

- Locale routing, language initialization, or language-menu event handling.
- Shared header stacking contexts and mobile menu behavior.
- Shared `site.js`, CSS, or cache-busting references across localized pages.
- Film/series listing cards and their detail-page destinations.
- Poster paths and shared asset references.
- GitHub Actions workflows and GitHub Pages publishing configuration.

A change to shared navigation or localization can affect many pages at once. Test all supported locales and representative detail routes, not just the page being edited.

## 3. QA checklist

Before merging, run the checks available for the change:

- [ ] Python SODO QA passes (HTML references, duplicate IDs, basic metadata).
- [ ] Browser regression tests pass.
- [ ] All affected Arabic, English, and Russian routes load.
- [ ] Language switching updates the URL and visible language, and preserves the current route where applicable.
- [ ] No JavaScript runtime errors or failed same-origin resources.
- [ ] Mobile layout has no unintended horizontal overflow; menus remain tappable.
- [ ] Film/series cards, detail links, and local posters work.
- [ ] GitHub Pages deployment succeeds after merge.
- [ ] Live smoke checks pass for affected production URLs.

Record any check that could not be run. Do not describe an untested behavior as verified.

## 4. Content workflow for films and series

When adding a film or series:

1. Confirm the title, type, release information, IMDb identifier, and current work status.
2. Add the item to the correct listing (Films or Series).
3. Create its detail page for each supported locale, following the existing detail-page structure and design.
4. Add and verify the locally hosted poster asset.
5. Check every card destination and every localized detail route.
6. Record the title in the Notion SODO Film Library when the user requests the personal-library update.

Keep facts such as sequel status, renewal, cancellation, and release dates tied to reliable sources. Use clear status wording; distinguish completed, ongoing, cancelled, upcoming, and no announced continuation.

## 5. Recovery and checkpoints

- Prefer reverting a specific faulty commit or preparing a corrective pull request over resetting the whole branch.
- Before recovery, identify the last known-good commit and inspect the exact diff being reverted.
- Preserve existing saved branches and checkpoints. Never delete or overwrite them without explicit approval.
- Do not change repository visibility, publishing settings, or connected services without explicit approval.
- Keep secrets out of source files and commit history. Use GitHub's supported secret storage if a workflow genuinely requires credentials.

## 6. Reporting status accurately

Report these as separate outcomes:

- **Implemented:** the code or documentation change exists on a branch.
- **Merged:** the pull request is merged into `main`.
- **QA passed:** the relevant automated checks passed.
- **Deployed:** GitHub Pages reports a successful deployment.
- **Live verified:** the deployed URLs were actually checked.
- **Device tested:** the user or a real-device test confirmed behavior on the target phone/tablet.

Never infer live or device verification from a successful merge alone.
