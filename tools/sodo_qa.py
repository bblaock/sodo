#!/usr/bin/env python3
"""Dependency-free quality checks for the SODO static website."""

from __future__ import annotations

import argparse
import json
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_SUFFIXES = {".html", ".htm"}
REFERENCE_ATTRIBUTES = {"href", "src", "poster", "data-src"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.references: list[tuple[str, str]] = []
        self.has_title = False
        self.has_viewport = False
        self.html_has_lang = False
        self._inside_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)

        if tag.lower() == "html":
            self.html_has_lang = bool(values.get("lang"))
        if tag.lower() == "title":
            self._inside_title = True
        if tag.lower() == "meta":
            name = (values.get("name") or "").lower()
            if name == "viewport":
                self.has_viewport = True

        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)

        for attribute in REFERENCE_ATTRIBUTES:
            value = values.get(attribute)
            if value:
                self.references.append((attribute, value.strip()))

        srcset = values.get("srcset")
        if srcset:
            for item in srcset.split(","):
                candidate = item.strip().split()
                if candidate:
                    self.references.append(("srcset", candidate[0]))

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._inside_title = False

    def handle_data(self, data: str) -> None:
        if self._inside_title and data.strip():
            self.has_title = True


def html_files(root: Path) -> list[Path]:
    return sorted(
        path for path in root.rglob("*")
        if path.is_file()
        and path.suffix.lower() in HTML_SUFFIXES
        and not any(part in {".git", ".venv", "__pycache__"} for part in path.parts)
    )


def resolve_local_target(raw_url: str, source: Path, root: Path) -> Path | None:
    """Resolve a local URL, including the GitHub Pages /sodo/ base path."""
    value = raw_url.strip()
    if not value or value.startswith("#"):
        return None

    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc:
        return None
    if parsed.path == "":
        return None

    url_path = unquote(parsed.path)
    if url_path == "/sodo":
        url_path = "/"
    elif url_path.startswith("/sodo/"):
        url_path = url_path[len("/sodo"):]

    if url_path.startswith("/"):
        relative = url_path.lstrip("/")
    else:
        relative = (source.parent.relative_to(root) / url_path).as_posix()

    candidate = (root / relative).resolve()
    try:
        candidate.relative_to(root.resolve())
    except ValueError:
        return None

    candidates = [candidate]
    if url_path.endswith("/"):
        candidates.insert(0, candidate / "index.html")
    elif not candidate.suffix:
        candidates.extend((candidate / "index.html", candidate.with_suffix(".html")))

    for option in candidates:
        if option.is_file():
            return option
    return candidates[0]


def validate_locale_routes(root: Path, errors: list[str]) -> int:
    """Ensure every supported language has the complete canonical route tree."""
    config_path = root / "locales" / "routes.json"
    router_path = root / "language-router.js"
    if not config_path.is_file():
        errors.append("locales/routes.json: missing locale route configuration")
        return 0
    if not router_path.is_file():
        errors.append("language-router.js: missing language-first route resolver")
    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"locales/routes.json: invalid configuration ({exc})")
        return 0

    languages = config.get("supportedLanguages", [])
    if languages != ["ar", "en", "ru"]:
        errors.append("locales/routes.json: supportedLanguages must be [ar, en, ru]")

    required_routes = [
        "index.html",
        "about/index.html",
        "thoughts/index.html",
        "films/index.html",
        "projects/index.html",
    ]
    canonical_film_pages = sorted((root / "films").glob("*/index.html"))
    required_routes.extend(
        f"films/{page.parent.name}/index.html" for page in canonical_film_pages
    )

    checked = 0
    for language in languages:
        for route in required_routes:
            target = root / language / route
            checked += 1
            if not target.is_file():
                errors.append(f"{language}/{route}: missing localized route")
                continue
            source = target.read_text(encoding="utf-8")
            if 'src="/sodo/language-router.js' not in source:
                errors.append(f"{language}/{route}: language router script is not loaded")
    return checked


def main() -> int:
    parser = argparse.ArgumentParser(description="Run SODO static-site QA checks.")
    parser.add_argument("--root", type=Path, default=ROOT, help="Website root directory")
    args = parser.parse_args()
    root = args.root.resolve()

    pages = html_files(root)
    if not pages:
        print("ERROR: no HTML pages found.")
        return 1

    errors: list[str] = []
    warnings: list[str] = []
    checked_references = 0
    locale_routes_checked = validate_locale_routes(root, errors)

    for page in pages:
        try:
            source = page.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            errors.append(f"{page.relative_to(root)}: cannot decode as UTF-8 ({exc})")
            continue

        parsed = PageParser()
        try:
            parsed.feed(source)
            parsed.close()
        except Exception as exc:  # HTMLParser errors should be visible, not fatal to the scan.
            warnings.append(f"{page.relative_to(root)}: HTML parser warning: {exc}")

        relative_page = page.relative_to(root)
        duplicates = sorted(
            identifier for identifier, count in Counter(parsed.ids).items()
            if count > 1
        )
        for identifier in duplicates:
            errors.append(f"{relative_page}: duplicate id=\"{identifier}\"")

        if not parsed.has_title:
            warnings.append(f"{relative_page}: missing or empty <title>")
        if not parsed.has_viewport:
            warnings.append(f"{relative_page}: missing viewport meta tag")
        if not parsed.html_has_lang:
            warnings.append(f"{relative_page}: <html> is missing a lang attribute")

        for attribute, raw_url in parsed.references:
            target = resolve_local_target(raw_url, page, root)
            if target is None:
                continue
            checked_references += 1
            if not target.is_file():
                errors.append(
                    f"{relative_page}: broken local {attribute} reference "
                    f"\"{raw_url}\" (expected {target.relative_to(root)})"
                )

    print(f"SODO QA: scanned {len(pages)} HTML pages, {checked_references} local references, and {locale_routes_checked} localized routes.")
    if warnings:
        print(f"\nWarnings ({len(warnings)}):")
        for warning in warnings:
            print(f"  WARN  {warning}")
    if errors:
        print(f"\nErrors ({len(errors)}):")
        for error in errors:
            print(f"  FAIL  {error}")
        return 1

    print("\nPASS: no duplicate IDs or broken local file references found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
