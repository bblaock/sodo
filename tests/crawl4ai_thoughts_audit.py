#!/usr/bin/env python3
"""Live crawl smoke audit for the multilingual Thoughts pages."""

from __future__ import annotations

import asyncio
import json
import os
import sys
from html.parser import HTMLParser
from pathlib import Path

from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig

BASE_URL = os.getenv("SODO_BASE_URL", "https://bblaock.github.io/sodo").rstrip("/")
COVER_URL = "https://i.ibb.co/8LXftpWc/2253-A760-05-F7-4211-9-B74-03875386-B7-B2.png"
LANGUAGES = ("ar", "en", "ru")
ROUTES = [
    (f"/{language}/thoughts/", "listing", language)
    for language in LANGUAGES
] + [
    (f"/{language}/thoughts/what-if-ww2/", "article", language)
    for language in LANGUAGES
]
REMOVED_ASSETS = ("inline-diplomacy.svg", "inline-science.svg", "inline-paths.svg")


class ImageSourceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.sources: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "img":
            source = dict(attrs).get("src")
            if source:
                self.sources.append(source)


def markdown_text(value: object) -> str:
    if hasattr(value, "raw_markdown"):
        return str(getattr(value, "raw_markdown") or "")
    return str(value or "")


async def main() -> int:
    browser = BrowserConfig(
        browser_type="chromium",
        headless=True,
        viewport_width=1365,
        viewport_height=900,
        verbose=False,
    )
    run_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        page_timeout=60000,
        word_count_threshold=1,
    )

    failures: list[str] = []
    report: list[dict[str, object]] = []

    async with AsyncWebCrawler(config=browser) as crawler:
        for route, page_type, language in ROUTES:
            url = f"{BASE_URL}{route}"
            try:
                result = await crawler.arun(url=url, config=run_config)
                status = getattr(result, "status_code", None)
                html = str(
                    getattr(result, "html", "")
                    or getattr(result, "cleaned_html", "")
                    or ""
                )
                text = markdown_text(getattr(result, "markdown", ""))
                parser = ImageSourceParser()
                parser.feed(html)

                page_failures: list[str] = []
                if not result.success:
                    page_failures.append(
                        f"crawl failed: {getattr(result, 'error_message', 'unknown error')}"
                    )
                if status is not None and status != 200:
                    page_failures.append(f"HTTP status was {status}, expected 200")
                if len(text.strip()) < 100:
                    page_failures.append("page content is unexpectedly short")
                if COVER_URL not in parser.sources:
                    page_failures.append("original Thoughts cover image was not found")
                if page_type == "article":
                    for asset in REMOVED_ASSETS:
                        if asset in html:
                            page_failures.append(f"removed illustration still present: {asset}")

                failures.extend(f"{url}: {failure}" for failure in page_failures)
                report.append({
                    "url": url,
                    "language": language,
                    "page_type": page_type,
                    "success": bool(result.success),
                    "status_code": status,
                    "markdown_characters": len(text),
                    "image_count": len(parser.sources),
                    "cover_found": COVER_URL in parser.sources,
                    "failures": page_failures,
                })
                print(
                    f"[{'FAIL' if page_failures else 'PASS'}] {language.upper()} "
                    f"{page_type}: HTTP {status or 'unknown'}; "
                    f"{len(text)} text chars; {len(parser.sources)} images"
                )
                for failure in page_failures:
                    print(f"  - {failure}")
            except Exception as exc:
                message = f"{url}: {type(exc).__name__}: {exc}"
                failures.append(message)
                report.append({
                    "url": url,
                    "language": language,
                    "page_type": page_type,
                    "success": False,
                    "failures": [message],
                })
                print(f"[FAIL] {message}")

    Path("crawl4ai-report.json").write_text(
        json.dumps({"base_url": BASE_URL, "pages": report, "failures": failures}, indent=2),
        encoding="utf-8",
    )

    if failures:
        print(f"\nCrawl4AI audit failed with {len(failures)} issue(s).")
        return 1

    print(f"\nCrawl4AI audit passed: all {len(ROUTES)} Thoughts pages were crawled.")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
